'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useCreateLoan } from '@/hooks/useMicroLoan';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';
import ImageCropModal from './ImageCropModal';
import { LoanCard } from './LoanCard';
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

// Income range enum (same as CreateLoanForm)
enum IncomeRange {
  PREFER_NOT_TO_SAY = '',
  UNDER_1K = 'under_1k',
  ONE_TO_TWO_K = '1k_to_2k',
  TWO_TO_THREE_HALF_K = '2k_to_3.5k',
  THREE_HALF_TO_FIVE_K = '3.5k_to_5k',
  FIVE_TO_SEVEN_HALF_K = '5k_to_7.5k',
  OVER_SEVEN_HALF_K = 'over_7.5k'
}

const INCOME_RANGES: Record<string, number> = {
  [IncomeRange.UNDER_1K]: 750,
  [IncomeRange.ONE_TO_TWO_K]: 1500,
  [IncomeRange.TWO_TO_THREE_HALF_K]: 2750,
  [IncomeRange.THREE_HALF_TO_FIVE_K]: 4250,
  [IncomeRange.FIVE_TO_SEVEN_HALF_K]: 6250,
  [IncomeRange.OVER_SEVEN_HALF_K]: 10000,
};

interface FormData {
  // Step 1: Basics
  amount: string;
  repaymentWeeks: number;
  loanPurposes: string[];

  // Step 4: About You & Loan Details
  aboutYou: string;
  businessWebsite: string;
  twitterHandle: string;
  loanUseAndImpact: string;
  monthlyIncome: IncomeRange;
  imageUrl: string;
  imageAspectRatio?: number;
}

interface CreditScoreData {
  score: number;
  breakdown: {
    revenueScore: number;
    consistencyScore: number;
    reliabilityScore: number;
    growthScore: number;
  };
  factors: string[];
  recommendations: string[];
  connections: Array<{
    platform: string;
    platform_user_id: string;
    connected_at: string;
    last_synced_at: string;
    revenue_data: {
      totalRevenue: number;
      orderCount: number;
      periodDays: number;
      currency: string;
    };
  }>;
}

export default function LoanCreationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected, isConnecting, userProfile } = useMiniAppWallet();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Form data - simplified for mobile
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    repaymentWeeks: 12,
    loanPurposes: [],
    aboutYou: '',
    businessWebsite: '',
    twitterHandle: '',
    loanUseAndImpact: '',
    monthlyIncome: IncomeRange.PREFER_NOT_TO_SAY,
    imageUrl: '',
  });

  // Credit score data (from Step 2 OAuth)
  const [creditScore, setCreditScore] = useState<CreditScoreData | null>(null);

  // UI state
  const [draftId, setDraftId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState('');

  // Loan creation hook
  const {
    createLoan,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  } = useCreateLoan();

  // Set mounted state to handle SSR hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load draft from URL params (after OAuth callback)
  useEffect(() => {
    const loadDraftFromParams = async () => {
      const draftIdParam = searchParams.get('draft');
      const stepParam = searchParams.get('step');

      if (draftIdParam && address) {
        try {
          const response = await fetch(`/api/loan-drafts?id=${draftIdParam}&wallet=${address}`);
          if (response.ok) {
            const draft = await response.json();
            setDraftId(draft.id);

            // Restore form data from draft
            if (draft.step1_data) {
              setFormData(prev => ({ ...prev, ...draft.step1_data }));
            }
            if (draft.step4_data) {
              setFormData(prev => ({ ...prev, ...draft.step4_data }));
            }

            // Load credit score
            if (draft.step3_data?.creditScore) {
              setCreditScore(draft.step3_data.creditScore);
            } else {
              // Fetch fresh credit score
              await loadCreditScore();
            }

            // Navigate to specified step
            if (stepParam) {
              setCurrentStep(parseInt(stepParam));
            }
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    };

    if (address) {
      loadDraftFromParams();
    }
  }, [searchParams, address]);

  // Load credit score
  const loadCreditScore = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/credit-score?walletAddress=${encodeURIComponent(address)}`);
      if (response.ok) {
        const data = await response.json();
        setCreditScore(data);

        // Save to draft
        if (draftId) {
          await saveDraftStep(3, { creditScore: data });
        }
      }
    } catch (error) {
      console.error('Error loading credit score:', error);
    }
  };

  // Save draft to Supabase
  const saveDraftStep = async (step: number, data: any) => {
    if (!address) return;

    try {
      const payload: any = {
        id: draftId,
        walletAddress: address,
        currentStep: step,
      };

      // Map step data to correct field
      if (step === 1) payload.step1Data = data;
      if (step === 2) payload.step2Data = data;
      if (step === 3) payload.step3Data = data;
      if (step === 4) payload.step4Data = data;

      const method = draftId ? 'PUT' : 'POST';
      const response = await fetch('/api/loan-drafts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const draft = await response.json();
        if (!draftId) {
          setDraftId(draft.id);
        }
        return draft.id;
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  // Handle field changes
  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Step 1 validation - updated for mini app requirements
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) < 25) {
      newErrors.amount = 'Minimum loan amount is $25 USDC';
    }
    if (!formData.amount || parseFloat(formData.amount) > 3000) {
      newErrors.amount = 'Maximum loan amount is $3,000 USDC';
    }
    if (formData.loanPurposes.length === 0) {
      newErrors.loanPurposes = 'Please select at least one funding purpose';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4 validation
  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.aboutYou.trim() || formData.aboutYou.length < 100) {
      newErrors.aboutYou = 'Please add more detail (at least 100 characters)';
    }
    if (!formData.loanUseAndImpact.trim() || formData.loanUseAndImpact.length < 225) {
      newErrors.loanUseAndImpact = 'Please add more detail (at least 225 characters)';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const goToNextStep = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      const id = await saveDraftStep(1, {
        amount: formData.amount,
        repaymentWeeks: formData.repaymentWeeks,
        loanPurposes: formData.loanPurposes,
      });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Step 2 handled by OAuth buttons - they save draft before redirecting
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Image upload functions (same as CreateLoanForm)
  const resizeAndCompressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadImageToIPFS = async (file: File | Blob, filename: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file, filename);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to IPFS');
    }

    const result = await response.json();
    return `ipfs://${result.hash}`;
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setShowCropModal(true);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Failed to load image. Please try a different image.');
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob, aspectRatio: number | undefined) => {
    try {
      const compressedBlob = await resizeAndCompressImage(
        new File([croppedBlob], 'cropped.jpg', { type: 'image/jpeg' })
      );

      const previewUrl = URL.createObjectURL(compressedBlob);
      handleChange('imageUrl', previewUrl);
      handleChange('imageAspectRatio', aspectRatio);

      // Store for later IPFS upload
      (window as any).__pendingImageBlob = compressedBlob;
      (window as any).__pendingImageFilename = 'loan-photo.jpg';

      setShowCropModal(false);
      setTempImageSrc('');
    } catch (error) {
      console.error('Error processing cropped image:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setTempImageSrc('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  // Upload metadata to IPFS and create loan
  const uploadMetadataToIPFS = async () => {
    // Upload image to IPFS first
    let imageURI: string | undefined;
    const pendingImageBlob = (window as any).__pendingImageBlob;
    const pendingImageFilename = (window as any).__pendingImageFilename;

    if (pendingImageBlob && pendingImageFilename) {
      console.log('Uploading image to IPFS...');
      imageURI = await uploadImageToIPFS(pendingImageBlob, pendingImageFilename);
      console.log('Image uploaded to IPFS:', imageURI);
    }

    // Create metadata
    // Generate title from loan purposes
    const title = `Funding for ${formData.loanPurposes.join(', ')}`;

    const metadata = {
      name: title,
      description: formData.aboutYou.substring(0, 280),
      fullDescription: `${formData.aboutYou}\n\n**What I'll achieve and how I'll pay it back:**\n${formData.loanUseAndImpact}`,
      image: imageURI,
      businessWebsite: formData.businessWebsite || undefined,
      twitterHandle: formData.twitterHandle || undefined,
      loanDetails: {
        aboutYou: formData.aboutYou,
        businessWebsite: formData.businessWebsite,
        twitterHandle: formData.twitterHandle,
        loanUseAndImpact: formData.loanUseAndImpact,
        loanPurposes: formData.loanPurposes,
      },
      creditScore: creditScore ? {
        score: creditScore.score,
        connectedPlatforms: creditScore.connections.map(c => c.platform),
      } : undefined,
      createdAt: new Date().toISOString(),
    };

    console.log('Uploading metadata to IPFS...');

    const response = await fetch('/api/upload-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    const result = await response.json();
    const metadataURI = `ipfs://${result.hash}`;

    console.log('Metadata uploaded to IPFS:', metadataURI);

    return metadataURI;
  };

  // Submit loan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert('Please connect your wallet');
      return;
    }

    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress('Preparing upload...');

    try {
      setUploadProgress('Uploading to IPFS...');
      const metadataURI = await uploadMetadataToIPFS();
      setUploadProgress('Creating blockchain transaction...');

      const now = Math.floor(Date.now() / 1000);
      const fundraisingDeadline = Math.floor(now + (30 * 86400)); // 30 days
      const loanDuration = formData.repaymentWeeks * 7 * 86400; // weeks to seconds

      const principal = parseUnits(formData.amount, USDC_DECIMALS);

      await createLoan({
        borrower: address as `0x${string}`,
        metadataURI,
        principal,
        loanDuration,
        fundraisingDeadline,
      });

      // Mark draft as completed
      if (draftId) {
        await fetch('/api/loan-drafts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: draftId, isCompleted: true }),
        });
      }

    } catch (error: any) {
      console.error('Error creating loan:', error);

      const isUserRejection =
        error.message?.includes('User denied') ||
        error.message?.includes('User rejected') ||
        error.code === 4001 ||
        error.code === 'ACTION_REJECTED';

      if (!isUserRejection) {
        alert(error.message || 'Failed to create loan');
      }

      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  // Success state with elaborate social sharing
  if (isSuccess && hash) {
    const shareUrl = `${window.location.origin}/loan/${hash}`;
    const shareText = `I just created a loan request for $${formData.amount} USDC on LendFriend! Help me reach my goal 🙏`;
    const shareTextWithPurpose = `I'm raising $${formData.amount} USDC for ${formData.loanPurposes.join(', ')} on LendFriend! Support small businesses and earn returns 💪`;

    const handleShare = (platform: string, event?: React.MouseEvent<HTMLButtonElement>) => {
      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextWithPurpose)}&url=${encodeURIComponent(shareUrl)}&hashtags=DeFi,MicroLoans,Base`;
          break;
        case 'warpcast':
          url = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareTextWithPurpose + '\n\n' + shareUrl)}`;
          break;
        case 'telegram':
          url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTextWithPurpose)}`;
          break;
        case 'whatsapp':
          url = `https://wa.me/?text=${encodeURIComponent(shareTextWithPurpose + '\n\n' + shareUrl)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'email':
          const subject = `Support My Loan Request on LendFriend`;
          const body = `Hi,\n\nI just created a loan request on LendFriend, a decentralized lending platform on Base.\n\n${shareTextWithPurpose}\n\nYou can view and contribute to my loan here:\n${shareUrl}\n\nThanks for your support!`;
          url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(shareUrl);
          // Simple visual feedback - change button text temporarily
          const copyBtn = event.currentTarget as HTMLButtonElement;
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '✓ Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2000);
          return;
      }
      if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1a96c1] to-[#157ba3] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Loan Created!</h2>
          <p className="text-gray-700 mb-2 text-lg">Your loan is live and accepting contributions</p>
          <p className="text-xs text-gray-500 mb-8 font-mono bg-white/50 rounded px-3 py-2 inline-block">
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-[#1a96c1]/30 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share Your Loan</h3>

            {/* Primary sharing options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X/Twitter
              </button>
              <button
                onClick={() => handleShare('warpcast')}
                className="flex items-center justify-center gap-2 bg-[#8A63D2] hover:bg-[#7952C1] text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                Warpcast
              </button>
            </div>

            {/* Secondary sharing options */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => handleShare('telegram')}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.828.941z"/>
                </svg>
                <span className="text-xs">Telegram</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-[#25D366] hover:bg-[#20BD5C] text-white rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.062 18.062c-.773.773-1.66 1.385-2.636 1.819a8.902 8.902 0 01-3.426.657c-1.458 0-2.873-.354-4.149-1.017l-4.576 1.204 1.225-4.478a8.849 8.849 0 01-1.125-4.247c0-1.187.231-2.346.687-3.426.434-.976 1.046-1.863 1.819-2.636a8.902 8.902 0 012.636-1.819A8.76 8.76 0 0112 3.375a8.76 8.76 0 013.426.687 8.902 8.902 0 012.636 1.819 8.902 8.902 0 011.819 2.636A8.76 8.76 0 0120.625 12a8.76 8.76 0 01-.687 3.426 8.902 8.902 0 01-1.876 2.636zm-2.144-6.391c-.196-.098-1.161-.573-1.343-.638-.181-.065-.313-.098-.446.098-.133.196-.514.638-.629.773-.116.133-.231.15-.428.049-.196-.098-.831-.306-1.583-.975-.585-.522-1.981-1.297-.227-1.873.196-.065.349-.098.524-.295.175-.196.386-.514.579-.773.196-.261.261-.446.392-.744.131-.295.065-.556-.032-.779-.098-.223-.446-1.074-.609-1.47-.163-.392-.327-.34-.446-.347-.115-.007-.247-.007-.38-.007-.133 0-.349.049-.532.246-.181.196-.693.677-.693 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.419.475.146.906.126 1.248.077.38-.058 1.171-.48 1.338-.942.164-.464.164-.86.114-.942-.049-.084-.181-.133-.38-.232z"/>
                </svg>
                <span className="text-xs">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-[#0077B5] hover:bg-[#006399] text-white rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-xs">LinkedIn</span>
              </button>
            </div>

            {/* Utility buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleShare('email')}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copy Link
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="block w-full bg-[#1a96c1] hover:bg-[#157ba3] text-white font-bold py-4 px-6 rounded-xl"
          >
            View All Loans
          </button>
        </div>
      </div>
    );
  }

  // Back button component for reuse
  const BackButton = () => (
    <button
      onClick={() => router.push('/')}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="font-medium">Back to Loans</span>
    </button>
  );

  // Loading state - only show after mount to prevent hydration issues
  if (mounted && isConnecting) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Wallet...</h2>
        </div>
      </div>
    );
  }

  if (mounted && !isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to create a loan request</p>
          <p className="text-sm text-gray-500">Open this app in Warpcast to get started</p>
        </div>
      </div>
    );
  }

  // Require Farcaster profile to create a loan
  if (mounted && isConnected && !userProfile?.username) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Farcaster Profile Required</h2>
          <p className="text-gray-600 mb-4">
            To request funding, you need a verified Farcaster profile. This helps build trust with lenders.
          </p>
          <p className="text-sm text-gray-500">
            Please open this app from Warpcast with a connected Farcaster account.
          </p>
        </div>
      </div>
    );
  }

  // Progress indicator
  const steps = [
    { num: 1, name: 'Basics' },
    { num: 2, name: 'Connect' },
    { num: 3, name: 'Eligibility' },
    { num: 4, name: 'Complete' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Loans</span>
      </button>

      {/* Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center" style={{ flex: idx < steps.length - 1 ? '1' : '0 0 auto' }}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep === step.num
                      ? 'bg-[#1a96c1] text-white shadow-sm'
                      : currentStep > step.num
                      ? 'bg-[#1a96c1] text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.num ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium text-center max-w-[80px] ${
                    currentStep >= step.num ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 px-3">
                  <div
                    className={`h-0.5 w-full transition-all ${
                      currentStep > step.num ? 'bg-[#1a96c1]' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: BASICS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Loan Basics</h2>
              <p className="text-sm text-gray-500 mb-5">Tell us about your funding needs</p>

              <div className="space-y-5">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    How much do you need?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">$</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      placeholder="500"
                      step="10"
                      min="25"
                      max="3000"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-lg font-medium focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none transition-all ${
                        errors.amount ? 'border-red-300' : 'border-gray-200 focus:border-[#2C7A7B]'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">USDC</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Min $25 · Max $3,000</p>
                  {errors.amount && <p className="text-sm text-red-600 mt-1.5">{errors.amount}</p>}
                </div>

                {/* Repayment */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Repayment timeline</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 4, label: '1 month' },
                      { value: 8, label: '2 months' },
                      { value: 12, label: '3 months' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('repaymentWeeks', option.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.repaymentWeeks === option.value
                            ? 'border-[#2C7A7B] bg-[#2C7A7B]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`font-medium ${formData.repaymentWeeks === option.value ? 'text-[#2C7A7B]' : 'text-gray-900'}`}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan purposes */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">What's this funding for?</label>
                  <p className="text-xs text-gray-500 mb-3">Select all that apply</p>

                  <div className="flex flex-wrap gap-2">
                    {['Marketing', 'Improving cash flow', 'Company expansion', 'Inventory purchasing', 'Research and development', 'Other'].map((purpose) => (
                      <button
                        key={purpose}
                        type="button"
                        onClick={() => {
                          const newPurposes = formData.loanPurposes.includes(purpose)
                            ? formData.loanPurposes.filter(p => p !== purpose)
                            : [...formData.loanPurposes, purpose];
                          handleChange('loanPurposes', newPurposes);
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.loanPurposes.includes(purpose)
                            ? 'bg-[#2C7A7B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>

                  {errors.loanPurposes && <p className="text-sm text-red-600 mt-2">{errors.loanPurposes}</p>}
                </div>
              </div>
            </div>

            {/* Continue button */}
            <button
              type="button"
              onClick={goToNextStep}
              className="w-full py-3 bg-[#2C7A7B] text-white font-medium rounded-xl hover:bg-[#234E52] transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: CONNECT PLATFORMS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Connect Your Business</h2>
              <p className="text-sm text-gray-500 mb-5">
                Optional: Link your accounts to help lenders understand your business.
              </p>

              <div className="space-y-3">
                {/* Shopify */}
                {creditScore?.connections.some(c => c.platform === 'shopify') ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <ShoppingBagIcon className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Shopify</span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!address) return;
                      try {
                        const shopDomain = prompt('Enter your Shopify store domain (e.g., yourstore.myshopify.com):');
                        if (!shopDomain || !shopDomain.includes('.myshopify.com')) return;
                        const response = await fetch(
                          `/api/shopify/auth?shop=${encodeURIComponent(shopDomain)}&wallet=${encodeURIComponent(address)}`
                        );
                        const data = await response.json();
                        if (response.ok) window.open(data.authUrl, '_blank');
                      } catch (error) {
                        console.error('Shopify connection error:', error);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#2C7A7B] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Shopify</span>
                    </div>
                    <span className="text-sm text-[#2C7A7B]">Connect</span>
                  </button>
                )}

                {/* Stripe */}
                {creditScore?.connections.some(c => c.platform === 'stripe') ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Stripe</span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!address) return;
                      try {
                        const response = await fetch(
                          `/api/stripe/auth?wallet=${encodeURIComponent(address)}`
                        );
                        const data = await response.json();
                        if (response.ok) window.open(data.authUrl, '_blank');
                      } catch (error) {
                        console.error('Stripe connection error:', error);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#2C7A7B] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Stripe</span>
                    </div>
                    <span className="text-sm text-[#2C7A7B]">Connect</span>
                  </button>
                )}

                {/* Square */}
                {creditScore?.connections.some(c => c.platform === 'square') ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BuildingStorefrontIcon className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Square</span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!address) return;
                      try {
                        const params = new URLSearchParams({
                          wallet: address,
                          ...(draftId && { draft: draftId }),
                        });
                        const response = await fetch(`/api/square/auth?${params.toString()}`);
                        const data = await response.json();
                        if (response.ok) window.open(data.authUrl, '_blank');
                      } catch (error) {
                        console.error('Square connection error:', error);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#2C7A7B] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Square</span>
                    </div>
                    <span className="text-sm text-[#2C7A7B]">Connect</span>
                  </button>
                )}
              </div>
            </div>

            {/* Info card */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                Connecting accounts is optional but helps lenders trust your application.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (creditScore) {
                    saveDraftStep(2, { connectedPlatforms: creditScore.connections.map(c => c.platform) });
                  }
                  goToNextStep();
                }}
                className="flex-1 py-3 bg-[#2C7A7B] text-white font-medium rounded-xl hover:bg-[#234E52] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ELIGIBILITY */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Your Eligibility</h2>
              <p className="text-sm text-gray-500 mb-4">Based on your connected accounts</p>

              {creditScore && creditScore.score > 0 ? (
                <div className="space-y-4">
                  {/* Score display */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Credit Score</span>
                    <span className="text-2xl font-bold text-[#2C7A7B]">{creditScore.score}/100</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2C7A7B] h-2 rounded-full transition-all"
                      style={{ width: `${creditScore.score}%` }}
                    />
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500">Revenue</span>
                      <span className="block font-semibold text-gray-900">{Math.round(creditScore.breakdown.revenueScore)}/40</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500">Consistency</span>
                      <span className="block font-semibold text-gray-900">{Math.round(creditScore.breakdown.consistencyScore)}/20</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500">Reliability</span>
                      <span className="block font-semibold text-gray-900">{Math.round(creditScore.breakdown.reliabilityScore)}/20</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-500">Growth</span>
                      <span className="block font-semibold text-gray-900">{Math.round(creditScore.breakdown.growthScore)}/20</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-3">No platforms connected yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    You can still create a loan, but connecting platforms helps you get funded faster.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-[#2C7A7B] font-medium"
                  >
                    ← Connect platforms
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="flex-1 py-3 bg-[#2C7A7B] text-white font-medium rounded-xl hover:bg-[#234E52] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPLETE APPLICATION */}
        {currentStep === 4 && (
          <div className="space-y-4">
            {/* About You */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">About You</h2>
              <p className="text-sm text-gray-500 mb-4">Help lenders get to know you</p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-900">Your story *</label>
                    <span className={`text-xs ${formData.aboutYou.length < 100 ? 'text-gray-400' : 'text-green-600'}`}>
                      {formData.aboutYou.length}/100+
                    </span>
                  </div>
                  <textarea
                    value={formData.aboutYou}
                    onChange={(e) => handleChange('aboutYou', e.target.value)}
                    placeholder="Tell us about yourself, what you do, and who you serve..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none resize-none ${
                      errors.aboutYou ? 'border-red-300' : 'border-gray-200 focus:border-[#2C7A7B]'
                    }`}
                  />
                  {errors.aboutYou && <p className="text-sm text-red-600 mt-1">{errors.aboutYou}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.businessWebsite}
                      onChange={(e) => handleChange('businessWebsite', e.target.value)}
                      placeholder="yoursite.com"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-[#2C7A7B] focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">X/Twitter</label>
                    <input
                      type="text"
                      value={formData.twitterHandle}
                      onChange={(e) => handleChange('twitterHandle', e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-[#2C7A7B] focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Use */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">How You'll Use It</h2>
              <p className="text-sm text-gray-500 mb-4">Explain your plan and how you'll pay it back</p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">Your plan *</label>
                  <span className={`text-xs ${formData.loanUseAndImpact.length < 225 ? 'text-gray-400' : 'text-green-600'}`}>
                    {formData.loanUseAndImpact.length}/225+
                  </span>
                </div>
                <textarea
                  value={formData.loanUseAndImpact}
                  onChange={(e) => handleChange('loanUseAndImpact', e.target.value)}
                  placeholder="I'll use this funding to... and I'll repay it by..."
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none resize-none ${
                    errors.loanUseAndImpact ? 'border-red-300' : 'border-gray-200 focus:border-[#2C7A7B]'
                  }`}
                />
                {errors.loanUseAndImpact && <p className="text-sm text-red-600 mt-1">{errors.loanUseAndImpact}</p>}
              </div>
            </div>

            {/* Photo */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Add a Photo</h2>
              <p className="text-sm text-gray-500 mb-4">Loans with photos get funded 35% faster</p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 transition-colors ${
                  isDragging ? 'border-[#2C7A7B] bg-[#2C7A7B]/5' : errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                {formData.imageUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                      <img src={formData.imageUrl} alt="Loan preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Photo added</p>
                      <button
                        type="button"
                        onClick={() => handleChange('imageUrl', '')}
                        className="text-sm text-red-600 font-medium mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-3">
                      <label htmlFor="file-upload" className="cursor-pointer text-[#2C7A7B] font-medium text-sm">
                        <span>Upload photo</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {errors.imageUrl && <p className="text-sm text-red-600 mt-2">{errors.imageUrl}</p>}
            </div>

            {/* Preview */}
            {(formData.loanPurposes.length > 0 || formData.imageUrl) && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                <div className="max-w-sm mx-auto">
                  <LoanCard
                    address={"0x0000000000000000000000000000000000000000" as `0x${string}`}
                    borrower={(address || "0x0000000000000000000000000000000000000000") as `0x${string}`}
                    name={formData.loanPurposes.length > 0 ? `Funding for ${formData.loanPurposes.join(', ')}` : "What's this funding for?"}
                    description={""}
                    principal={formData.amount ? parseUnits(formData.amount, USDC_DECIMALS) : 0n}
                    totalFunded={0n}
                    fundraisingActive={true}
                    active={false}
                    completed={false}
                    contributorsCount={0n}
                    imageUrl={formData.imageUrl || undefined}
                  />
                </div>
              </div>
            )}

            {/* Submit status */}
            {uploadProgress && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium">{uploadProgress}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isPending || isConfirming || isSubmitting}
                className="flex-1 py-3 bg-[#2C7A7B] text-white font-medium rounded-xl hover:bg-[#234E52] transition-colors disabled:bg-gray-400"
              >
                {isPending || isConfirming || isSubmitting ? 'Creating...' : 'Create Loan'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Image Crop Modal */}
      {showCropModal && tempImageSrc && (
        <ImageCropModal
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useCreateLoan } from '@/hooks/useMicroLoan';
import { useMiniAppWallet } from '@/hooks/useMiniAppWallet';
import ImageCropModal from './ImageCropModal';
import { LoanCard } from './LoanCard';
import { sdk } from '@farcaster/miniapp-sdk';
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

  // Business connection state
  const [showShopifyInput, setShowShopifyInput] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

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

  // Refresh credit score when user returns to app (after OAuth in external browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentStep === 2 && address) {
        // User came back to the app - refresh credit score to check for new connections
        loadCreditScore();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentStep, address]);

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
        case 'farcaster': // Changed from 'warpcast' to 'farcaster'
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
          const copyBtn = event?.currentTarget as HTMLButtonElement;
          if (copyBtn) {
              const originalText = copyBtn.innerHTML;
              copyBtn.innerHTML = '✓ Copied!';
              setTimeout(() => {
                  copyBtn.innerHTML = originalText;
              }, 2000);
          }
          return;
      }
      if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"> {/* Changed background */}
          <div className="w-20 h-20 bg-base-blue rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"> {/* Changed background */}
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-base-black mb-2">Loan Created!</h2> {/* Changed text color */}
          <p className="text-gray-600 mb-2 text-lg">Your loan is live and accepting contributions</p>
          <p className="text-xs text-gray-500 mb-8 font-mono bg-gray-50 rounded px-3 py-2 inline-block border border-gray-200"> {/* Changed background and added border */}
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 shadow-inner"> {/* Changed background and border */}
            <h3 className="text-xl font-bold text-base-black mb-4 text-center">Share Your Loan</h3> {/* Changed text color */}

            {/* Primary sharing options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 bg-black hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X/Twitter</span>
              </button>
              <button
                onClick={() => handleShare('farcaster')}
                className="flex items-center justify-center gap-2 bg-[#855DCD] hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 1000 1000" fill="currentColor">
                    <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"/>
                    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                    <path d="M675.555 746.667C663.282 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.555V817.778C875.555 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.555Z"/>
                </svg>
                <span>Farcaster</span>
              </button>
            </div>

            {/* Secondary sharing options */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => handleShare('telegram')}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-[#0088CC]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-xs text-gray-700">Telegram</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                <span className="text-xs text-gray-700">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-xs text-gray-700">LinkedIn</span>
              </button>
            </div>

            {/* Utility buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleShare('email')}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-3 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </button>
              <button
                onClick={(e) => handleShare('copy', e)}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-3 rounded-xl transition-colors"
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
            className="block w-full bg-base-blue hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98]"
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
        <div className="bg-base-gray border border-gray-200 rounded-2xl p-6 text-center"> {/* Updated colors */}
          <div className="animate-spin h-8 w-8 border-4 border-base-blue border-t-transparent rounded-full mx-auto mb-4"></div> {/* Updated colors */}
          <h2 className="text-xl font-bold text-base-black mb-2">Connecting Wallet...</h2> {/* Updated colors */}
        </div>
      </div>
    );
  }

  if (mounted && !isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-base-gray border border-gray-200 rounded-2xl p-6 text-center"> {/* Updated colors */}
          <h2 className="text-xl font-bold text-base-black mb-2">Wallet Not Connected</h2> {/* Updated colors */}
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
        <div className="bg-base-gray border border-gray-200 rounded-2xl p-6 text-center"> {/* Updated colors */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"> {/* Kept gray-100 for neutral icon background */}
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Kept gray-600 for neutral icon color */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-base-black mb-2">Farcaster Profile Required</h2> {/* Updated colors */}
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
        className="flex items-center gap-2 text-gray-600 hover:text-base-black mb-6 transition-colors group" // Updated hover text color
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
                      ? 'bg-base-blue text-white shadow-sm' // Updated colors
                      : currentStep > step.num
                      ? 'bg-base-blue text-white' // Updated colors
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
                    currentStep >= step.num ? 'text-base-black' : 'text-gray-500' // Updated colors
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 px-3">
                  <div
                    className={`h-0.5 w-full transition-all ${
                      currentStep > step.num ? 'bg-base-blue' : 'bg-gray-200' // Updated colors
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
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"> {/* Added border */}
              <h2 className="text-lg font-bold text-base-black mb-1">Loan Basics</h2> {/* Updated text color */}
              <p className="text-sm text-gray-500 mb-5">Tell us about your funding needs</p>

              <div className="space-y-5">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-base-black mb-2"> {/* Updated text color */}
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-lg font-medium focus:ring-2 focus:ring-base-blue/20 outline-none transition-all ${ /* Updated colors */
                        errors.amount ? 'border-red-300' : 'border-gray-200 focus:border-base-blue' /* Updated colors */
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">USDC</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Min $25 · Max $3,000</p>
                  {errors.amount && <p className="text-sm text-red-600 mt-1.5">{errors.amount}</p>}
                </div>

                {/* Repayment */}
                <div>
                  <label className="block text-sm font-medium text-base-black mb-2">Repayment timeline</label> {/* Updated text color */}
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
                            ? 'border-base-blue bg-base-blue/5' // Updated colors
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`font-medium ${formData.repaymentWeeks === option.value ? 'text-base-blue' : 'text-base-black'}`}> {/* Updated colors */}
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan purposes */}
                <div>
                  <label className="block text-sm font-medium text-base-black mb-2">What's this funding for?</label> {/* Updated text color */}
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
                            ? 'bg-base-blue text-white' // Updated colors
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
              className="w-full py-3 bg-base-blue text-white font-medium rounded-xl hover:opacity-90 transition-all active:scale-[0.98]" // Updated colors
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: CONNECT PLATFORMS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"> {/* Added border */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-base-black">Connect Your Business</h2> {/* Updated text color */}
                <button
                  type="button"
                  onClick={() => loadCreditScore()}
                  className="p-2 text-gray-400 hover:text-base-black hover:bg-gray-100 rounded-lg transition-colors" // Updated hover text color
                  title="Refresh connection status"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Optional: Link your accounts to help lenders understand your business.
              </p>

              <div className="space-y-3">
                {/* Shopify */}
                {creditScore?.connections.some(c => c.platform === 'shopify') ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                       <svg width="24" height="24" viewBox="0 0 446.3 127.5" fill="#96bf48" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <g>
                                <path d="M154.4,70.9c-3.8-2.1-5.8-3.8-5.8-6.2c0-3.1,2.7-5,7-5c5,0,9.4,2.1,9.4,2.1l3.5-10.7c0,0-3.2-2.5-12.7-2.5c-13.2,0-22.4,7.6-22.4,18.2c0,6,4.3,10.6,10,13.9c4.6,2.6,6.2,4.5,6.2,7.2c0,2.9-2.3,5.2-6.6,5.2c-6.4,0-12.4-3.3-12.4-3.3l-3.7,10.7c0,0,5.6,3.7,14.9,3.7c13.6,0,23.3-6.7,23.3-18.7C165.3,78.9,160.3,74.3,154.4,70.9z"/>
                                <path d="M208.6,48.4c-6.7,0-11.9,3.2-16,8l-0.2-0.1l5.8-30.4H183l-14.7,77.3h15.1l5-26.4c2-10,7.1-16.1,11.9-16.1c3.4,0,4.7,2.3,4.7,5.6c0,2.1-0.2,4.6-0.7,6.7l-5.7,30.3h15.1l5.9-31.2c0.7-3.3,1.1-7.2,1.1-9.9C220.9,53.5,216.5,48.4,208.6,48.4z"/>
                                <path d="M255.1,48.4c-18.2,0-30.3,16.4-30.3,34.7c0,11.7,7.2,21.2,20.8,21.2c17.9,0,29.9-16,29.9-34.7C275.6,58.7,269.3,48.4,255.1,48.4z M247.7,92.6c-5.2,0-7.3-4.4-7.3-9.9c0-8.7,4.5-22.8,12.7-22.8c5.4,0,7.1,4.6,7.1,9.1C260.2,78.4,255.7,92.6,247.7,92.6z"/>
                                <path d="M314.3,48.4c-10.2,0-16,9-16,9h-0.2l0.9-8.1h-13.4c-0.7,5.5-1.9,13.8-3.1,20.1L272,124.6h15.1l4.2-22.4h0.3c0,0,3.1,2,8.9,2c17.8,0,29.4-18.2,29.4-36.6C329.9,57.5,325.4,48.4,314.3,48.4z M299.9,92.9c-3.9,0-6.2-2.2-6.2-2.2l2.5-14.1c1.8-9.4,6.7-15.7,11.9-15.7c4.6,0,6,4.3,6,8.3C314.1,78.9,308.3,92.9,299.9,92.9z"/>
                                <path d="M351.5,26.7c-4.8,0-8.7,3.8-8.7,8.8c0,4.5,2.8,7.6,7.1,7.6h0.2c4.7,0,8.8-3.2,8.9-8.8C359.1,29.8,356.1,26.7,351.5,26.7z"/>
                                <polygon points="330.3,103.2 345.5,103.2 355.8,49.6 340.5,49.6 		"/>
                                <path d="M394.2,49.5h-10.5l0.5-2.5c0.9-5.2,3.9-9.8,9-9.8c2.7,0,4.8,0.8,4.8,0.8l3-11.8c0,0-2.6-1.3-8.2-1.3c-5.4,0-10.7,1.5-14.8,5c-5.2,4.4-7.6,10.7-8.8,17.1l-0.4,2.5h-7l-2.2,11.4h7l-8,42.3h15.1l8-42.3h10.4L394.2,49.5z"/>
                                <path d="M430.6,49.6c0,0-9.5,23.8-13.7,36.8h-0.2c-0.3-4.2-3.7-36.8-3.7-36.8h-15.9l9.1,49.2c0.2,1.1,0.1,1.8-0.3,2.5c-1.8,3.4-4.7,6.7-8.2,9.1c-2.8,2.1-6,3.4-8.5,4.3l4.2,12.8c3.1-0.7,9.4-3.2,14.8-8.2c6.9-6.5,13.3-16.4,19.8-30l18.5-39.7H430.6z"/>
                            </g>
                            <g>
                                <path d="M74.8,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0c-0.3,0-0.6,0-1,0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6,0.2-12,4.5-16.8,12.2c-3.4,5.4-6,12.2-6.7,17.5c-6.9,2.1-11.7,3.6-11.8,3.7c-3.5,1.1-3.6,1.2-4,4.5c-0.3,2.5-9.5,72.9-9.5,72.9l75.6,13.1V14.7C75.3,14.7,75,14.8,74.8,14.8z M57.3,20.2c-4,1.2-8.4,2.6-12.7,3.9c1.2-4.7,3.6-9.4,6.4-12.5c1.1-1.1,2.6-2.4,4.3-3.2C57,12,57.4,16.9,57.3,20.2z M49.1,4.4c1.4,0,2.6,0.3,3.6,0.9c-1.6,0.8-3.2,2.1-4.7,3.6c-3.8,4.1-6.7,10.5-7.9,16.6c-3.6,1.1-7.2,2.2-10.5,3.2C31.8,19.1,39.9,4.6,49.1,4.4z M37.5,59.4c0.4,6.4,17.3,7.8,18.3,22.9c0.7,11.9-6.3,20-16.4,20.6c-12.2,0.8-18.9-6.4-18.9-6.4l2.6-11c0,0,6.7,5.1,12.1,4.7c3.5-0.2,4.8-3.1,4.7-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.9,51.8,31.5,40.1,48.3,39c6.5-0.4,9.8,1.2,9.8,1.2l-3.8,14.4c0,0-4.3-2-9.4-1.6C37.5,53.5,37.4,58.2,37.5,59.4z M61.3,19c0-3-0.4-7.3-1.8-10.9c4.6,0.9,6.8,6,7.8,9.1C65.5,17.7,63.5,18.3,61.3,19z"/>
                                <path d="M78.2,124l31.4-7.8c0,0-13.5-91.3-13.6-91.9c-0.1-0.6-0.6-1-1.1-1c-0.5,0-9.3-0.2-9.3-0.2s-5.4-5.2-7.4-7.2V124z"/>
                            </g>
                        </g>
                       </svg>
                      <span className="font-medium text-base-black">Shopify</span> {/* Updated text color */}
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : showShopifyInput ? (
                  <div className="p-4 bg-white border border-base-blue rounded-xl space-y-3"> {/* Updated border color */}
                    <div className="flex items-center gap-3">
                       <svg width="24" height="24" viewBox="0 0 446.3 127.5" fill="#96bf48" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <g>
                                <path d="M154.4,70.9c-3.8-2.1-5.8-3.8-5.8-6.2c0-3.1,2.7-5,7-5c5,0,9.4,2.1,9.4,2.1l3.5-10.7c0,0-3.2-2.5-12.7-2.5c-13.2,0-22.4,7.6-22.4,18.2c0,6,4.3,10.6,10,13.9c4.6,2.6,6.2,4.5,6.2,7.2c0,2.9-2.3,5.2-6.6,5.2c-6.4,0-12.4-3.3-12.4-3.3l-3.7,10.7c0,0,5.6,3.7,14.9,3.7c13.6,0,23.3-6.7,23.3-18.7C165.3,78.9,160.3,74.3,154.4,70.9z"/>
                                <path d="M208.6,48.4c-6.7,0-11.9,3.2-16,8l-0.2-0.1l5.8-30.4H183l-14.7,77.3h15.1l5-26.4c2-10,7.1-16.1,11.9-16.1c3.4,0,4.7,2.3,4.7,5.6c0,2.1-0.2,4.6-0.7,6.7l-5.7,30.3h15.1l5.9-31.2c0.7-3.3,1.1-7.2,1.1-9.9C220.9,53.5,216.5,48.4,208.6,48.4z"/>
                                <path d="M255.1,48.4c-18.2,0-30.3,16.4-30.3,34.7c0,11.7,7.2,21.2,20.8,21.2c17.9,0,29.9-16,29.9-34.7C275.6,58.7,269.3,48.4,255.1,48.4z M247.7,92.6c-5.2,0-7.3-4.4-7.3-9.9c0-8.7,4.5-22.8,12.7-22.8c5.4,0,7.1,4.6,7.1,9.1C260.2,78.4,255.7,92.6,247.7,92.6z"/>
                                <path d="M314.3,48.4c-10.2,0-16,9-16,9h-0.2l0.9-8.1h-13.4c-0.7,5.5-1.9,13.8-3.1,20.1L272,124.6h15.1l4.2-22.4h0.3c0,0,3.1,2,8.9,2c17.8,0,29.4-18.2,29.4-36.6C329.9,57.5,325.4,48.4,314.3,48.4z M299.9,92.9c-3.9,0-6.2-2.2-6.2-2.2l2.5-14.1c1.8-9.4,6.7-15.7,11.9-15.7c4.6,0,6,4.3,6,8.3C314.1,78.9,308.3,92.9,299.9,92.9z"/>
                                <path d="M351.5,26.7c-4.8,0-8.7,3.8-8.7,8.8c0,4.5,2.8,7.6,7.1,7.6h0.2c4.7,0,8.8-3.2,8.9-8.8C359.1,29.8,356.1,26.7,351.5,26.7z"/>
                                <polygon points="330.3,103.2 345.5,103.2 355.8,49.6 340.5,49.6 		"/>
                                <path d="M394.2,49.5h-10.5l0.5-2.5c0.9-5.2,3.9-9.8,9-9.8c2.7,0,4.8,0.8,4.8,0.8l3-11.8c0,0-2.6-1.3-8.2-1.3c-5.4,0-10.7,1.5-14.8,5c-5.2,4.4-7.6,10.7-8.8,17.1l-0.4,2.5h-7l-2.2,11.4h7l-8,42.3h15.1l8-42.3h10.4L394.2,49.5z"/>
                                <path d="M430.6,49.6c0,0-9.5,23.8-13.7,36.8h-0.2c-0.3-4.2-3.7-36.8-3.7-36.8h-15.9l9.1,49.2c0.2,1.1,0.1,1.8-0.3,2.5c-1.8,3.4-4.7,6.7-8.2,9.1c-2.8,2.1-6,3.4-8.5,4.3l4.2,12.8c3.1-0.7,9.4-3.2,14.8-8.2c6.9-6.5,13.3-16.4,19.8-30l18.5-39.7H430.6z"/>
                            </g>
                            <g>
                                <path d="M74.8,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0c-0.3,0-0.6,0-1,0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6,0.2-12,4.5-16.8,12.2c-3.4,5.4-6,12.2-6.7,17.5c-6.9,2.1-11.7,3.6-11.8,3.7c-3.5,1.1-3.6,1.2-4,4.5c-0.3,2.5-9.5,72.9-9.5,72.9l75.6,13.1V14.7C75.3,14.7,75,14.8,74.8,14.8z M57.3,20.2c-4,1.2-8.4,2.6-12.7,3.9c1.2-4.7,3.6-9.4,6.4-12.5c1.1-1.1,2.6-2.4,4.3-3.2C57,12,57.4,16.9,57.3,20.2z M49.1,4.4c1.4,0,2.6,0.3,3.6,0.9c-1.6,0.8-3.2,2.1-4.7,3.6c-3.8,4.1-6.7,10.5-7.9,16.6c-3.6,1.1-7.2,2.2-10.5,3.2C31.8,19.1,39.9,4.6,49.1,4.4z M37.5,59.4c0.4,6.4,17.3,7.8,18.3,22.9c0.7,11.9-6.3,20-16.4,20.6c-12.2,0.8-18.9-6.4-18.9-6.4l2.6-11c0,0,6.7,5.1,12.1,4.7c3.5-0.2,4.8-3.1,4.7-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.9,51.8,31.5,40.1,48.3,39c6.5-0.4,9.8,1.2,9.8,1.2l-3.8,14.4c0,0-4.3-2-9.4-1.6C37.5,53.5,37.4,58.2,37.5,59.4z M61.3,19c0-3-0.4-7.3-1.8-10.9c4.6,0.9,6.8,6,7.8,9.1C65.5,17.7,63.5,18.3,61.3,19z"/>
                                <path d="M78.2,124l31.4-7.8c0,0-13.5-91.3-13.6-91.9c-0.1-0.6-0.6-1-1.1-1c-0.5,0-9.3-0.2-9.3-0.2s-5.4-5.2-7.4-7.2V124z"/>
                            </g>
                        </g>
                       </svg>
                      <span className="font-medium text-base-black">Shopify</span> {/* Updated text color */}
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : showShopifyInput ? (
                  <div className="p-4 bg-white border border-base-blue rounded-xl space-y-3"> {/* Updated border color */}
                    <div className="flex items-center gap-3">
                       <svg width="24" height="24" viewBox="0 0 446.3 127.5" fill="#96bf48" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <g>
                                <path d="M154.4,70.9c-3.8-2.1-5.8-3.8-5.8-6.2c0-3.1,2.7-5,7-5c5,0,9.4,2.1,9.4,2.1l3.5-10.7c0,0-3.2-2.5-12.7-2.5c-13.2,0-22.4,7.6-22.4,18.2c0,6,4.3,10.6,10,13.9c4.6,2.6,6.2,4.5,6.2,7.2c0,2.9-2.3,5.2-6.6,5.2c-6.4,0-12.4-3.3-12.4-3.3l-3.7,10.7c0,0,5.6,3.7,14.9,3.7c13.6,0,23.3-6.7,23.3-18.7C165.3,78.9,160.3,74.3,154.4,70.9z"/>
                                <path d="M208.6,48.4c-6.7,0-11.9,3.2-16,8l-0.2-0.1l5.8-30.4H183l-14.7,77.3h15.1l5-26.4c2-10,7.1-16.1,11.9-16.1c3.4,0,4.7,2.3,4.7,5.6c0,2.1-0.2,4.6-0.7,6.7l-5.7,30.3h15.1l5.9-31.2c0.7-3.3,1.1-7.2,1.1-9.9C220.9,53.5,216.5,48.4,208.6,48.4z"/>
                                <path d="M255.1,48.4c-18.2,0-30.3,16.4-30.3,34.7c0,11.7,7.2,21.2,20.8,21.2c17.9,0,29.9-16,29.9-34.7C275.6,58.7,269.3,48.4,255.1,48.4z M247.7,92.6c-5.2,0-7.3-4.4-7.3-9.9c0-8.7,4.5-22.8,12.7-22.8c5.4,0,7.1,4.6,7.1,9.1C260.2,78.4,255.7,92.6,247.7,92.6z"/>
                                <path d="M314.3,48.4c-10.2,0-16,9-16,9h-0.2l0.9-8.1h-13.4c-0.7,5.5-1.9,13.8-3.1,20.1L272,124.6h15.1l4.2-22.4h0.3c0,0,3.1,2,8.9,2c17.8,0,29.4-18.2,29.4-36.6C329.9,57.5,325.4,48.4,314.3,48.4z M299.9,92.9c-3.9,0-6.2-2.2-6.2-2.2l2.5-14.1c1.8-9.4,6.7-15.7,11.9-15.7c4.6,0,6,4.3,6,8.3C314.1,78.9,308.3,92.9,299.9,92.9z"/>
                                <path d="M351.5,26.7c-4.8,0-8.7,3.8-8.7,8.8c0,4.5,2.8,7.6,7.1,7.6h0.2c4.7,0,8.8-3.2,8.9-8.8C359.1,29.8,356.1,26.7,351.5,26.7z"/>
                                <polygon points="330.3,103.2 345.5,103.2 355.8,49.6 340.5,49.6 		"/>
                                <path d="M394.2,49.5h-10.5l0.5-2.5c0.9-5.2,3.9-9.8,9-9.8c2.7,0,4.8,0.8,4.8,0.8l3-11.8c0,0-2.6-1.3-8.2-1.3c-5.4,0-10.7,1.5-14.8,5c-5.2,4.4-7.6,10.7-8.8,17.1l-0.4,2.5h-7l-2.2,11.4h7l-8,42.3h15.1l8-42.3h10.4L394.2,49.5z"/>
                                <path d="M430.6,49.6c0,0-9.5,23.8-13.7,36.8h-0.2c-0.3-4.2-3.7-36.8-3.7-36.8h-15.9l9.1,49.2c0.2,1.1,0.1,1.8-0.3,2.5c-1.8,3.4-4.7,6.7-8.2,9.1c-2.8,2.1-6,3.4-8.5,4.3l4.2,12.8c3.1-0.7,9.4-3.2,14.8-8.2c6.9-6.5,13.3-16.4,19.8-30l18.5-39.7H430.6z"/>
                            </g>
                            <g>
                                <path d="M74.8,14.8c0,0-1.4,0.4-3.7,1.1c-0.4-1.3-1-2.8-1.8-4.4c-2.6-5-6.5-7.7-11.1-7.7c0,0,0,0,0,0c-0.3,0-0.6,0-1,0.1c-0.1-0.2-0.3-0.3-0.4-0.5c-2-2.2-4.6-3.2-7.7-3.1c-6,0.2-12,4.5-16.8,12.2c-3.4,5.4-6,12.2-6.7,17.5c-6.9,2.1-11.7,3.6-11.8,3.7c-3.5,1.1-3.6,1.2-4,4.5c-0.3,2.5-9.5,72.9-9.5,72.9l75.6,13.1V14.7C75.3,14.7,75,14.8,74.8,14.8z M57.3,20.2c-4,1.2-8.4,2.6-12.7,3.9c1.2-4.7,3.6-9.4,6.4-12.5c1.1-1.1,2.6-2.4,4.3-3.2C57,12,57.4,16.9,57.3,20.2z M49.1,4.4c1.4,0,2.6,0.3,3.6,0.9c-1.6,0.8-3.2,2.1-4.7,3.6c-3.8,4.1-6.7,10.5-7.9,16.6c-3.6,1.1-7.2,2.2-10.5,3.2C31.8,19.1,39.9,4.6,49.1,4.4z M37.5,59.4c0.4,6.4,17.3,7.8,18.3,22.9c0.7,11.9-6.3,20-16.4,20.6c-12.2,0.8-18.9-6.4-18.9-6.4l2.6-11c0,0,6.7,5.1,12.1,4.7c3.5-0.2,4.8-3.1,4.7-5.1c-0.5-8.4-14.3-7.9-15.2-21.7C23.9,51.8,31.5,40.1,48.3,39c6.5-0.4,9.8,1.2,9.8,1.2l-3.8,14.4c0,0-4.3-2-9.4-1.6C37.5,53.5,37.4,58.2,37.5,59.4z M61.3,19c0-3-0.4-7.3-1.8-10.9c4.6,0.9,6.8,6,7.8,9.1C65.5,17.7,63.5,18.3,61.3,19z"/>
                                <path d="M78.2,124l31.4-7.8c0,0-13.5-91.3-13.6-91.9c-0.1-0.6-0.6-1-1.1-1c-0.5,0-9.3-0.2-9.3-0.2s-5.4-5.2-7.4-7.2V124z"/>
                            </g>
                        </g>
                       </svg>
                      <span className="font-medium text-base-black">Connect Shopify</span> {/* Updated text color */}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={shopifyDomain}
                        onChange={(e) => setShopifyDomain(e.target.value)}
                        placeholder="yourstore.myshopify.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-base-blue focus:border-transparent" // Updated colors
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter your Shopify store domain</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowShopifyInput(false);
                          setShopifyDomain('');
                        }}
                        className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors" // Updated class structure
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={connectingPlatform === 'shopify'}
                        onClick={async () => {
                          if (!address) {
                            alert('Please connect your wallet first');
                            return;
                          }
                          const domain = shopifyDomain.trim().toLowerCase();
                          if (!domain) return;

                          // Auto-append .myshopify.com if not present
                          const fullDomain = domain.includes('.myshopify.com')
                            ? domain
                            : `${domain}.myshopify.com`;

                          setConnectingPlatform('shopify');
                          try {
                            const response = await fetch(
                              `/api/shopify/auth?shop=${encodeURIComponent(fullDomain)}&wallet=${encodeURIComponent(address)}`
                            );
                            const data = await response.json();
                            if (response.ok && data.authUrl) {
                              // Use SDK to open external URL (breaks out of iframe)
                              try {
                                await sdk.actions.openUrl(data.authUrl);
                              } catch {
                                // Fallback for non-miniapp context
                                window.open(data.authUrl, '_blank');
                              }
                              setConnectingPlatform(null);
                              setShowShopifyInput(false);
                            } else {
                              alert(data.error || 'Failed to connect to Shopify');
                              setConnectingPlatform(null);
                            }
                          } catch (error) {
                            console.error('Shopify connection error:', error);
                            alert('Failed to connect to Shopify. Please try again.');
                            setConnectingPlatform(null);
                          }
                        }}
                        className="flex-1 py-3 bg-base-blue text-white font-medium rounded-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50" // Updated colors
                      >
                        {connectingPlatform === 'shopify' ? 'Connecting...' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowShopifyInput(true)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-base-blue hover:bg-gray-50 transition-colors" // Updated colors
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-base-black">Shopify</span> {/* Updated text color */}
                    </div>
                    <span className="text-sm text-base-blue">Connect</span> {/* Updated text color */}
                  </button>
                )}

                {/* Stripe */}
                {creditScore?.connections.some(c => c.platform === 'stripe') ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                       <svg width="24" height="10" viewBox="0 0 360 150" fill="#635BFF" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M360 77.4001C360 51.8001 347.6 31.6001 323.9 31.6001C300.1 31.6001 285.7 51.8001 285.7 77.2001C285.7 107.3 302.7 122.5 327.1 122.5C339 122.5 348 119.8 354.8 116V96.0001C348 99.4001 340.2 101.5 330.3 101.5C320.6 101.5 312 98.1001 310.9 86.3001H359.8C359.8 85.0001 360 79.8001 360 77.4001ZM310.6 67.9001C310.6 56.6001 317.5 51.9001 323.8 51.9001C329.9 51.9001 336.4 56.6001 336.4 67.9001H310.6Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M247.1 31.6001C237.3 31.6001 231 36.2001 227.5 39.4001L226.2 33.2001H204.2V149.8L229.2 144.5L229.3 116.2C232.9 118.8 238.2 122.5 247 122.5C264.9 122.5 281.2 108.1 281.2 76.4001C281.1 47.4001 264.6 31.6001 247.1 31.6001ZM241.1 100.5C235.2 100.5 231.7 98.4001 229.3 95.8001L229.2 58.7001C231.8 55.8001 235.4 53.8001 241.1 53.8001C250.2 53.8001 256.5 64.0001 256.5 77.1001C256.5 90.5001 250.3 100.5 241.1 100.5Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M169.8 25.7L194.9 20.3V0L169.8 5.3V25.7Z"/>
                        <path d="M194.9 33.3H169.8V120.8H194.9V33.3Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M142.9 40.7L141.3 33.3H119.7V120.8H144.7V61.5C150.6 53.8 160.6 55.2 163.7 56.3V33.3C160.5 32.1 148.8 29.9 142.9 40.7Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M92.8999 11.6001L68.4999 16.8001L68.3999 96.9001C68.3999 111.7 79.4999 122.6 94.2999 122.6C102.5 122.6 108.5 121.1 111.8 119.3V99.0001C108.6 100.3 92.7999 104.9 92.7999 90.1001V54.6001H111.8V33.3001H92.7999L92.8999 11.6001Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M25.3 58.7001C25.3 54.8001 28.5 53.3001 33.8 53.3001C41.4 53.3001 51 55.6001 58.6 59.7001V36.2001C50.3 32.9001 42.1 31.6001 33.8 31.6001C13.5 31.6001 0 42.2001 0 59.9001C0 87.5001 38 83.1001 38 95.0001C38 99.6001 34 101.1 28.4 101.1C20.1 101.1 9.5 97.7001 1.1 93.1001V116.9C10.4 120.9 19.8 122.6 28.4 122.6C49.2 122.6 63.5 112.3 63.5 94.4001C63.4 64.6001 25.3 69.9001 25.3 58.7001Z"/>
                       </svg>
                      <span className="font-medium text-base-black">Stripe</span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!address) {
                        alert('Please connect your wallet first');
                        return;
                      }
                      try {
                        const response = await fetch(
                          `/api/stripe/auth?wallet=${encodeURIComponent(address)}`
                        );
                        const data = await response.json();
                        if (response.ok && data.authUrl) {
                          // Use SDK to open external URL (breaks out of iframe)
                          try {
                            await sdk.actions.openUrl(data.authUrl);
                          } catch {
                            window.open(data.authUrl, '_blank');
                          }
                        } else {
                          alert(data.error || 'Failed to connect to Stripe');
                        }
                      } catch (error) {
                        console.error('Stripe connection error:', error);
                        alert('Failed to connect to Stripe. Please try again.');
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-base-blue hover:bg-gray-50 transition-colors" // Updated colors
                  >
                    <div className="flex items-center gap-3">
                       <svg width="24" height="10" viewBox="0 0 360 150" fill="#635BFF" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M360 77.4001C360 51.8001 347.6 31.6001 323.9 31.6001C300.1 31.6001 285.7 51.8001 285.7 77.2001C285.7 107.3 302.7 122.5 327.1 122.5C339 122.5 348 119.8 354.8 116V96.0001C348 99.4001 340.2 101.5 330.3 101.5C320.6 101.5 312 98.1001 310.9 86.3001H359.8C359.8 85.0001 360 79.8001 360 77.4001ZM310.6 67.9001C310.6 56.6001 317.5 51.9001 323.8 51.9001C329.9 51.9001 336.4 56.6001 336.4 67.9001H310.6Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M247.1 31.6001C237.3 31.6001 231 36.2001 227.5 39.4001L226.2 33.2001H204.2V149.8L229.2 144.5L229.3 116.2C232.9 118.8 238.2 122.5 247 122.5C264.9 122.5 281.2 108.1 281.2 76.4001C281.1 47.4001 264.6 31.6001 247.1 31.6001ZM241.1 100.5C235.2 100.5 231.7 98.4001 229.3 95.8001L229.2 58.7001C231.8 55.8001 235.4 53.8001 241.1 53.8001C250.2 53.8001 256.5 64.0001 256.5 77.1001C256.5 90.5001 250.3 100.5 241.1 100.5Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M169.8 25.7L194.9 20.3V0L169.8 5.3V25.7Z"/>
                        <path d="M194.9 33.3H169.8V120.8H194.9V33.3Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M142.9 40.7L141.3 33.3H119.7V120.8H144.7V61.5C150.6 53.8 160.6 55.2 163.7 56.3V33.3C160.5 32.1 148.8 29.9 142.9 40.7Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M92.8999 11.6001L68.4999 16.8001L68.3999 96.9001C68.3999 111.7 79.4999 122.6 94.2999 122.6C102.5 122.6 108.5 121.1 111.8 119.3V99.0001C108.6 100.3 92.7999 104.9 92.7999 90.1001V54.6001H111.8V33.3001H92.7999L92.8999 11.6001Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M25.3 58.7001C25.3 54.8001 28.5 53.3001 33.8 53.3001C41.4 53.3001 51 55.6001 58.6 59.7001V36.2001C50.3 32.9001 42.1 31.6001 33.8 31.6001C13.5 31.6001 0 42.2001 0 59.9001C0 87.5001 38 83.1001 38 95.0001C38 99.6001 34 101.1 28.4 101.1C20.1 101.1 9.5 97.7001 1.1 93.1001V116.9C10.4 120.9 19.8 122.6 28.4 122.6C49.2 122.6 63.5 112.3 63.5 94.4001C63.4 64.6001 25.3 69.9001 25.3 58.7001Z"/>
                       </svg>
                      <span className="font-medium text-base-black">Stripe</span> {/* Updated text color */}
                    </div>
                    <span className="text-sm text-base-blue">Connect</span> {/* Updated text color */}
                  </button>
                )}

                {/* Square */}
                {creditScore?.connections.some(c => c.platform === 'square') ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-base-black">Square</span>
                    </div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!address) {
                        alert('Please connect your wallet first');
                        return;
                      }
                      try {
                        const params = new URLSearchParams({
                          wallet: address,
                          ...(draftId && { draft: draftId }),
                        });
                        const response = await fetch(`/api/square/auth?${params.toString()}`);
                        const data = await response.json();
                        if (response.ok && data.authUrl) {
                          try {
                            await sdk.actions.openUrl(data.authUrl);
                          } catch {
                            window.open(data.authUrl, '_blank');
                          }
                        } else {
                          alert(data.error || 'Failed to connect to Square');
                        }
                      } catch (error) {
                        console.error('Square connection error:', error);
                        alert('Failed to connect to Square. Please try again.');
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-base-blue hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                       <svg width="24" height="6" viewBox="0 0 2000 501.43" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                        <path d="M501.43,83.79v333.84c0,46.27-37.5,83.79-83.79,83.79H83.79c-46.28,0-83.79-37.5-83.79-83.79V83.79C0,37.52,37.52,0,83.79,0h333.84c46.29,0,83.79,37.5,83.79,83.79ZM410.23,117.65c0-14.61-11.85-26.45-26.45-26.45H117.63c-14.61,0-26.45,11.84-26.45,26.45v266.19c0,14.61,11.84,26.45,26.45,26.45h266.17c14.61,0,26.45-11.85,26.45-26.45V117.65h-.02ZM182.32,197.6c0-8.43,6.79-15.26,15.17-15.26h106.4c8.39,0,15.17,6.84,15.17,15.26v106.24c0,8.43-6.75,15.26-15.17,15.26h-106.4c-8.39,0-15.17-6.84-15.17-15.26v-106.24ZM778.95,221.94l-3.85-.86c-41.04-9.31-65.81-14.93-65.81-42,0-24.2,23.02-41.11,55.98-41.11,30.52,0,53.74,12.76,73.08,40.16,1.11,1.57,2.84,2.61,4.74,2.84,1.89.23,3.79-.35,5.23-1.59l32.16-27.71c2.68-2.31,3.15-6.22,1.1-9.09-24.19-33.89-67.01-54.12-114.56-54.12-31.56,0-60.34,9.26-81.04,26.08-21.73,17.65-33.21,41.93-33.21,70.23,0,63.76,54.74,76.94,98.71,87.53,4.45,1.08,8.77,2.1,12.95,3.08,39.74,9.36,66,15.54,66,43.74s-24.04,45.48-61.24,45.48c-33.71,0-64.35-17.1-86.28-48.14-1.1-1.55-2.8-2.59-4.68-2.84-1.88-.25-3.73.28-5.2,1.49l-33.86,27.99c-2.72,2.25-3.28,6.14-1.3,9.05,25.63,37.64,76.48,61.97,129.56,61.97,32.56,0,62.52-9.57,84.36-26.95,23.27-18.51,35.57-44.01,35.57-73.73,0-67.27-57.62-80.13-108.45-91.48ZM1126.34,177.74h-40.76c-3.74,0-6.78,3.04-6.78,6.78v19.06c-12.6-14.21-33.77-30.22-65.18-30.22s-56.88,12.32-75.37,35.62c-17.16,21.63-26.62,51.73-26.62,84.75s9.45,63.12,26.62,84.75c18.49,23.31,44.56,35.62,75.37,35.62,26.63,0,49.1-9.45,65.18-27.37v107.92c0,3.74,3.04,6.78,6.78,6.78h40.76c3.74,0,6.78-3.04,6.78-6.78V184.52c0-3.74-3.04-6.78-6.78-6.78ZM1080.11,287.17v13.57c0,39.86-21.97,65.61-55.98,65.61-36.15,0-57.74-27.15-57.74-72.61s21.58-72.61,57.74-72.61c34.01,0,55.98,25.93,55.98,66.05ZM1360.6,177.74h-40.76c-3.74,0-6.78,3.04-6.78,6.78v130.66c0,32.45-23.32,49.42-46.36,49.42-26.03,0-39.79-15.58-39.79-45.04v-135.03c0-3.74-3.04-6.78-6.78-6.78h-40.76c-3.74,0-6.78,3.04-6.78,6.78v146.41c0,50.53,30.93,83.17,78.8,83.17,23.76,0,43.95-9.67,61.67-29.56v17.96c0,3.74,3.04... [truncated]
                   </svg>
                      <span className="font-medium text-base-black">Square</span>
                    </div>
                    <span className="text-sm text-base-blue">Connect</span>
                  </button>
                )}
                             </div>
                          </div> {/* Closes inner card Div 2 */}
              
                          {/* Info card */}
                          <div className="bg-base-gray rounded-xl p-4 border border-gray-200"> {/* Updated colors */}              <p className="text-sm text-gray-700"> {/* Updated text color */}
                Connecting accounts is optional but helps lenders trust your application.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors active:scale-[0.98]"
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
                className="flex-1 py-3 bg-base-blue text-white font-medium rounded-xl hover:opacity-90 transition-all active:scale-[0.98]" // Updated colors
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ELIGIBILITY */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"> {/* Added border */}
              <h2 className="text-lg font-bold text-base-black mb-1">Your Eligibility</h2> {/* Updated text color */}
              <p className="text-sm text-gray-500 mb-4">Based on your connected accounts</p>

              {creditScore && creditScore.score > 0 ? (
                <div className="space-y-4">
                  {/* Score display */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Credit Score</span>
                    <span className="text-2xl font-bold text-base-blue">{creditScore.score}/100</span> {/* Updated text color */}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-base-blue h-2 rounded-full transition-all" // Updated color
                      style={{ width: `${creditScore.score}%` }}
                    />
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100"> {/* Added border */}
                      <span className="text-xs text-gray-500">Revenue</span>
                      <span className="block font-semibold text-base-black">{Math.round(creditScore.breakdown.revenueScore)}/40</span> {/* Updated text color */}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100"> {/* Added border */}
                      <span className="text-xs text-gray-500">Consistency</span>
                      <span className="block font-semibold text-base-black">{Math.round(creditScore.breakdown.consistencyScore)}/20</span> {/* Updated text color */}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100"> {/* Added border */}
                      <span className="text-xs text-gray-500">Reliability</span>
                      <span className="block font-semibold text-base-black">{Math.round(creditScore.breakdown.reliabilityScore)}/20</span> {/* Updated text color */}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100"> {/* Added border */}
                      <span className="text-xs text-gray-500">Growth</span>
                      <span className="block font-semibold text-base-black">{Math.round(creditScore.breakdown.growthScore)}/20</span> {/* Updated text color */}
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
                    className="text-sm text-base-blue font-medium" // Updated text color
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
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="flex-1 py-3 bg-base-blue text-white font-medium rounded-xl hover:opacity-90 transition-all active:scale-[0.98]" // Updated colors
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
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"> {/* Added border */}
              <h2 className="text-lg font-bold text-base-black mb-1">About You</h2> {/* Updated text color */}
              <p className="text-sm text-gray-500 mb-4">Help lenders get to know you</p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-base-black">Your story *</label> {/* Updated text color */}
                    <span className={`text-xs ${formData.aboutYou.length < 100 ? 'text-gray-400' : 'text-green-600'}`}>
                      {formData.aboutYou.length}/100+
                    </span>
                  </div>
                  <textarea
                    value={formData.aboutYou}
                    onChange={(e) => handleChange('aboutYou', e.target.value)}
                    placeholder="Tell us about yourself, what you do, and who you serve..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-base-blue/20 outline-none resize-none ${ /* Updated colors */
                      errors.aboutYou ? 'border-red-300' : 'border-gray-200 focus:border-base-blue' /* Updated colors */
                    }`}
                  />
                  {errors.aboutYou && <p className="text-sm text-red-600 mt-1">{errors.aboutYou}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-base-black mb-2">Website</label> {/* Updated text color */}
                    <input
                      type="url"
                      value={formData.businessWebsite}
                      onChange={(e) => handleChange('businessWebsite', e.target.value)}
                      placeholder="yoursite.com"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-base-blue focus:ring-2 focus:ring-base-blue/20 outline-none text-sm" // Updated colors
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-black mb-2">X/Twitter</label> {/* Updated text color */}
                    <input
                      type="text"
                      value={formData.twitterHandle}
                      onChange={(e) => handleChange('twitterHandle', e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-base-blue focus:ring-2 focus:ring-base-blue/20 outline-none text-sm" // Updated colors
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Use */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"> {/* Added border */}
              <h2 className="text-lg font-bold text-base-black mb-1">How You'll Use It</h2> {/* Updated text color */}
              <p className="text-sm text-gray-500 mb-4">Explain your plan and how you'll pay it back</p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-base-black">Your plan *</label> {/* Updated text color */}
                  <span className={`text-xs ${formData.loanUseAndImpact.length < 225 ? 'text-gray-400' : 'text-green-600'}`}>
                    {formData.loanUseAndImpact.length}/225+
                  </span>
                </div>
                <textarea
                  value={formData.loanUseAndImpact}
                  onChange={(e) => handleChange('loanUseAndImpact', e.target.value)}
                  placeholder="I'll use this funding to... and I'll repay it by..."
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-base-blue/20 outline-none resize-none ${ /* Updated colors */
                    errors.loanUseAndImpact ? 'border-red-300' : 'border-gray-200 focus:border-base-blue' /* Updated colors */
                  }`}
                />
                {errors.loanUseAndImpact && <p className="text-sm text-red-600 mt-1">{errors.loanUseAndImpact}</p>}
              </div>
            </div>

            {/* Photo */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"> {/* Added border */}
              <h2 className="text-lg font-bold text-base-black mb-1">Add a Photo</h2> {/* Updated text color */}
              <p className="text-sm text-gray-500 mb-4">Loans with photos get funded 35% faster</p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 transition-colors ${
                  isDragging ? 'border-base-blue bg-base-blue/5' : errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50' /* Updated colors */
                }`}
              >
                {formData.imageUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                      <img src={formData.imageUrl} alt="Loan preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-base-black">Photo added</p> {/* Updated text color */}
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
                      <label htmlFor="file-upload" className="cursor-pointer text-base-blue font-medium text-sm"> {/* Updated text color */}
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
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"> {/* Added border */}
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
              <div className="bg-base-gray rounded-xl p-4 border border-gray-200"> {/* Updated colors */}
                <p className="text-sm text-gray-700 font-medium">{uploadProgress}</p> {/* Updated text color */}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isPending || isConfirming || isSubmitting}
                className="flex-1 py-3 bg-base-blue text-white font-medium rounded-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50" // Updated colors
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

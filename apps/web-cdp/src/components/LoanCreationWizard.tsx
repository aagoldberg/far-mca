'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseUnits } from 'viem';
import { USDC_DECIMALS } from '@/types/loan';
import { useWalletType } from '@/hooks/useWalletType';
import { useCreateLoanGasless } from '@/hooks/useMicroLoan';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';
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
  grade: 'A' | 'B' | 'C' | 'D';
  gradeLabel: string;
  breakdown: {
    revenueStability: number;
    orderConsistency: number;
    businessTenure: number;
    growthTrend: number;
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
  const { address, isConnected, walletType, isCheckingConnection } = useWalletType();
  const { farcasterProfile } = useFarcasterProfile();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Form data
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState('');

  // Shopify connection state
  const [showShopifyInput, setShowShopifyInput] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [isConnectingShopify, setIsConnectingShopify] = useState(false);
  const [isRefreshingConnections, setIsRefreshingConnections] = useState(false);

  // Loan creation hook
  const {
    createLoan,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  } = useCreateLoanGasless();

  // Load draft from URL params (after OAuth callback)
  useEffect(() => {
    const loadDraftFromParams = async () => {
      const draftIdParam = searchParams.get('draft');
      const stepParam = searchParams.get('step');

      // Always navigate to step if specified (even without draft)
      if (stepParam && !draftIdParam) {
        const step = parseInt(stepParam);
        setCurrentStep(step);
        // Load credit score for step 2 or 3
        if (step === 2 || step === 3) {
          await loadCreditScore();
        }
      }

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

            // Always fetch fresh credit score (don't use stale draft data)
            await loadCreditScore();

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

  // Refresh all connections and reload score
  const refreshConnections = async () => {
    if (!address || isRefreshingConnections) return;

    setIsRefreshingConnections(true);
    try {
      // First refresh the connection data from platforms
      const refreshResponse = await fetch('/api/connections/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (refreshResponse.ok) {
        // Then reload the credit score
        await loadCreditScore();
      }
    } catch (error) {
      console.error('Error refreshing connections:', error);
    } finally {
      setIsRefreshingConnections(false);
    }
  };

  // Handle Shopify connection
  const handleShopifyConnect = async () => {
    if (!address || !shopifyDomain.trim()) return;

    // Validate domain format
    let domain = shopifyDomain.trim().toLowerCase();
    if (!domain.includes('.myshopify.com')) {
      // Try adding .myshopify.com if just store name provided
      if (!domain.includes('.')) {
        domain = `${domain}.myshopify.com`;
        setShopifyDomain(domain);
      } else {
        setErrors(prev => ({ ...prev, shopify: 'Please enter a valid .myshopify.com domain' }));
        return;
      }
    }

    setIsConnectingShopify(true);
    setErrors(prev => ({ ...prev, shopify: '' }));

    try {
      let authUrl = `/api/shopify/auth?shop=${encodeURIComponent(domain)}&wallet=${encodeURIComponent(address)}`;
      if (draftId) {
        authUrl += `&draft=${encodeURIComponent(draftId)}`;
      }
      const response = await fetch(authUrl);
      const data = await response.json();

      if (response.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setErrors(prev => ({ ...prev, shopify: data.error || 'Failed to connect to Shopify' }));
        setIsConnectingShopify(false);
      }
    } catch (error) {
      console.error('Shopify connection error:', error);
      setErrors(prev => ({ ...prev, shopify: 'Connection failed. Please try again.' }));
      setIsConnectingShopify(false);
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

  // Step 1 validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) < 100) {
      newErrors.amount = 'Minimum loan amount is $100 USDC';
    }
    if (!formData.amount || parseFloat(formData.amount) > 10000) {
      newErrors.amount = 'Maximum loan amount is $10,000 USDC';
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
        borrower: address,
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

  // Success state (same as CreateLoanForm)
  if (isSuccess && hash) {
    const shareUrl = `${window.location.origin}/`;
    const shareText = `I just created a funding request on LendFriend! Help me reach my goal 🙏`;

    const handleShare = (platform: string) => {
      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'warpcast':
          url = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
      }
      if (url) window.open(url, '_blank', 'width=600,height=400');
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Request Live!</h2>
          <p className="text-gray-700 mb-2 text-lg text-center">Your funding request is active and accepting contributions</p>
          <p className="text-xs text-gray-500 mb-8 font-mono bg-white/50 rounded px-3 py-2 block text-center w-fit mx-auto">
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-brand-100 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share Your Request</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl"
              >
                X/Twitter
              </button>
              <button
                onClick={() => handleShare('warpcast')}
                className="flex items-center justify-center gap-2 bg-[#8A63D2] hover:bg-[#7952C1] text-white font-semibold py-3 px-4 rounded-xl"
              >
                Warpcast
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="block w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl"
          >
            View All Loans
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isCheckingConnection) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-secondary-50 border border-secondary-200 rounded-2xl p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-secondary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Wallet...</h2>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to create a funding request</p>
          <p className="text-sm text-gray-500">Click 'Login' in the navigation to connect</p>
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
        <span className="font-medium">Cancel</span>
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
                      ? 'bg-brand-600 text-white shadow-sm'
                      : currentStep > step.num
                      ? 'bg-brand-600 text-white'
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
                      currentStep > step.num ? 'bg-brand-600' : 'bg-gray-200'
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
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Funding Request</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  How much capital do you need?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">$</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    placeholder="500"
                    step="10"
                    min="100"
                    max="10000"
                    className={`w-full pl-9 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20 outline-none transition-all ${
                      errors.amount ? 'border-red-300' : 'border-gray-300 focus:border-secondary-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">$100 - $10,000 USDC</p>
                {errors.amount && <p className="text-sm text-red-600 mt-1.5">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">When can you repay this?</label>
                <select
                  value={formData.repaymentWeeks}
                  onChange={(e) => handleChange('repaymentWeeks', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-20 outline-none transition-all appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value={4}>1 month</option>
                  <option value={8}>2 months</option>
                  <option value={12}>3 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">What's this funding for?</label>
                <p className="text-xs text-gray-500 mb-3">Select all that apply</p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {['Marketing', 'Improving cash flow', 'Company expansion', 'Inventory purchasing', 'Research and development', 'Other'].map((purpose) => (
                    <label key={purpose} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.loanPurposes.includes(purpose)}
                        onChange={(e) => {
                          const newPurposes = e.target.checked
                            ? [...formData.loanPurposes, purpose]
                            : formData.loanPurposes.filter(p => p !== purpose);
                          handleChange('loanPurposes', newPurposes);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-2 focus:ring-brand-600 focus:ring-opacity-20 transition-all"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{purpose}</span>
                    </label>
                  ))}
                </div>

                {errors.loanPurposes && <p className="text-sm text-red-600 mt-2">{errors.loanPurposes}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow"
                >
                  Continue to Connect Platforms
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONNECT PLATFORMS */}
        {currentStep === 2 && (
          <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Business</h2>
              <p className="text-base text-gray-600">
                Link your business platforms to build your Trust Score and unlock better loan terms.
              </p>
            </div>

            {/* Trust Score Display */}
            {creditScore && creditScore.connections.length > 0 && (
              <div className="bg-gradient-to-r from-secondary-800 to-secondary-700 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-200 mb-1">Your Trust Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{creditScore.score}</span>
                      <span className="text-secondary-300">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-secondary-200 mb-1">{creditScore.connections.length} platform{creditScore.connections.length !== 1 ? 's' : ''} connected</p>
                    {creditScore.connections.length < 3 && (
                      <p className="text-xs text-brand-300">Connect more to boost your score</p>
                    )}
                    <button
                      type="button"
                      onClick={refreshConnections}
                      disabled={isRefreshingConnections}
                      className="mt-2 text-xs text-secondary-300 hover:text-white flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <ArrowPathIcon className={`w-3.5 h-3.5 ${isRefreshingConnections ? 'animate-spin' : ''}`} />
                      {isRefreshingConnections ? 'Syncing...' : 'Refresh Data'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect platforms</h3>

              <div className="space-y-3">
                {/* Shopify Platform Card */}
                {showShopifyInput ? (
                  // Input form for connecting/reconnecting
                  <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
                    <div className="flex items-center gap-3">
                      <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
                      <span className="text-base font-medium text-gray-900">
                        {creditScore?.connections.some(c => c.platform === 'shopify') ? 'Reconnect Shopify' : 'Connect Shopify'}
                      </span>
                    </div>
                    <div>
                      <label htmlFor="shopifyDomain" className="block text-sm font-medium text-gray-700 mb-1">
                        Store Domain
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="shopifyDomain"
                          value={shopifyDomain}
                          onChange={(e) => setShopifyDomain(e.target.value)}
                          placeholder="yourstore.myshopify.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleShopifyConnect();
                            }
                          }}
                          disabled={isConnectingShopify}
                        />
                        <button
                          type="button"
                          onClick={handleShopifyConnect}
                          disabled={!shopifyDomain.trim() || isConnectingShopify}
                          className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {isConnectingShopify ? 'Connecting...' : 'Connect'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your .myshopify.com domain to securely connect
                      </p>
                      {errors.shopify && (
                        <p className="text-xs text-red-600 mt-1">{errors.shopify}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowShopifyInput(false);
                        setShopifyDomain('');
                        setErrors(prev => ({ ...prev, shopify: '' }));
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : creditScore?.connections.some(c => c.platform === 'shopify') ? (
                  // Connected state
                  (() => {
                    const shopifyConn = creditScore.connections.find(c => c.platform === 'shopify');
                    const revenue = shopifyConn?.revenue_data?.totalRevenue || 0;
                    const orders = shopifyConn?.revenue_data?.orderCount || 0;
                    return (
                      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ShoppingBagIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium text-gray-900">Shopify</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Connected</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {shopifyConn?.platform_user_id || 'Store connected'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              ${revenue.toLocaleString()} revenue · {orders} orders
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={refreshConnections}
                                disabled={isRefreshingConnections}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                              >
                                <ArrowPathIcon className={`h-3 w-3 ${isRefreshingConnections ? 'animate-spin' : ''}`} />
                                {isRefreshingConnections ? 'Syncing' : 'Sync'}
                              </button>
                              <span className="text-gray-300">·</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setShopifyDomain(shopifyConn?.platform_user_id || '');
                                  setShowShopifyInput(true);
                                }}
                                className="text-xs text-secondary-600 hover:text-secondary-700 transition-colors"
                              >
                                Reconnect
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  // Not connected - show connect button
                  <button
                    type="button"
                    onClick={() => setShowShopifyInput(true)}
                    className="w-full border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
                      <span className="text-base font-medium text-gray-900">Shopify</span>
                    </div>
                  </button>
                )}

                {/* Stripe Platform Card */}
                {creditScore?.connections.some(c => c.platform === 'stripe') ? (
                  (() => {
                    const stripeConn = creditScore.connections.find(c => c.platform === 'stripe');
                    const revenue = stripeConn?.revenue_data?.totalRevenue || 0;
                    const orders = stripeConn?.revenue_data?.orderCount || 0;
                    return (
                      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CreditCardIcon className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium text-gray-900">Stripe</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Connected</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {stripeConn?.platform_user_id || 'Account connected'}
                            </p>
                            {revenue > 0 && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                ${revenue.toLocaleString()} revenue · {orders} transactions
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={refreshConnections}
                              disabled={isRefreshingConnections}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Refresh data"
                            >
                              <ArrowPathIcon className={`h-4 w-4 ${isRefreshingConnections ? 'animate-spin' : ''}`} />
                            </button>
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-6 w-6 text-gray-400" />
                      <span className="text-base font-medium text-gray-500">Stripe</span>
                      <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                    </div>
                  </div>
                )}

                {/* Square Platform Card */}
                {creditScore?.connections.some(c => c.platform === 'square') ? (
                  (() => {
                    const squareConn = creditScore.connections.find(c => c.platform === 'square');
                    const revenue = squareConn?.revenue_data?.totalRevenue || 0;
                    const orders = squareConn?.revenue_data?.orderCount || 0;
                    return (
                      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                            <BuildingStorefrontIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-medium text-gray-900">Square</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Connected</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {squareConn?.platform_user_id || 'Account connected'}
                            </p>
                            {revenue > 0 && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                ${revenue.toLocaleString()} revenue · {orders} transactions
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={refreshConnections}
                              disabled={isRefreshingConnections}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Refresh data"
                            >
                              <ArrowPathIcon className={`h-4 w-4 ${isRefreshingConnections ? 'animate-spin' : ''}`} />
                            </button>
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <BuildingStorefrontIcon className="h-6 w-6 text-gray-400" />
                      <span className="text-base font-medium text-gray-500">Square</span>
                      <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Helpful hints based on connection status */}
              {creditScore && creditScore.connections.length === 0 && (
                <div className="mt-6 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <p className="text-sm text-secondary-800">
                    <strong>Tip:</strong> Connecting at least one platform helps us verify your business revenue and may improve your loan terms.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
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
                className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${
                  creditScore && creditScore.connections.length > 0
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                {creditScore && creditScore.connections.length > 0 ? 'Continue to Eligibility' : 'Skip for Now'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ELIGIBILITY */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Business Assessment</h2>
              <p className="text-sm text-gray-600 mb-6">Based on your connected revenue sources</p>

              {creditScore && creditScore.score > 0 ? (
                <div className="space-y-6">
                  {/* Business Health Score */}
                  <div className="bg-gradient-to-r from-brand-50 to-green-50 border border-brand-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">Part 1</div>
                        <h3 className="text-lg font-bold text-gray-900">Business Health</h3>
                        <p className="text-sm text-gray-500">Quality and stability of your business</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          creditScore.score >= 75 ? 'text-green-600' :
                          creditScore.score >= 55 ? 'text-blue-600' :
                          creditScore.score >= 40 ? 'text-amber-600' : 'text-gray-600'
                        }`}>
                          {creditScore.score >= 75 ? 'Established' :
                           creditScore.score >= 55 ? 'Growing' :
                           creditScore.score >= 40 ? 'Building' : 'Emerging'}
                        </div>
                        <div className="text-sm text-gray-500">{creditScore.score}/100</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className={`h-2.5 rounded-full ${
                          creditScore.score >= 75 ? 'bg-green-500' :
                          creditScore.score >= 55 ? 'bg-blue-500' :
                          creditScore.score >= 40 ? 'bg-amber-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${creditScore.score}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Revenue Stability</span>
                        <span className="font-medium">{Math.round(creditScore.breakdown.revenueStability)}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Consistency</span>
                        <span className="font-medium">{Math.round(creditScore.breakdown.orderConsistency)}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Business Tenure</span>
                        <span className="font-medium">{Math.round(creditScore.breakdown.businessTenure)}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Growth Trend</span>
                        <span className="font-medium">{Math.round(creditScore.breakdown.growthTrend)}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Affordability */}
                  {(() => {
                    // Calculate monthly revenue from connected platforms
                    const totalRevenue = creditScore.connections.reduce((sum, conn) => {
                      return sum + (conn.revenue_data?.totalRevenue || 0);
                    }, 0);
                    const totalDays = creditScore.connections.reduce((sum, conn) => {
                      return Math.max(sum, conn.revenue_data?.periodDays || 90);
                    }, 90);
                    const monthlyRevenue = (totalRevenue / totalDays) * 30;
                    const loanAmount = parseFloat(formData.amount) || 0;
                    const ratio = monthlyRevenue > 0 ? loanAmount / monthlyRevenue : Infinity;

                    let tier: 'Comfortable' | 'Manageable' | 'Stretched' | 'High Burden';
                    let tierColor: string;
                    let tierBg: string;

                    if (ratio < 0.5) {
                      tier = 'Comfortable';
                      tierColor = 'text-green-600';
                      tierBg = 'bg-green-500';
                    } else if (ratio < 1.0) {
                      tier = 'Manageable';
                      tierColor = 'text-blue-600';
                      tierBg = 'bg-blue-500';
                    } else if (ratio < 2.0) {
                      tier = 'Stretched';
                      tierColor = 'text-amber-600';
                      tierBg = 'bg-amber-500';
                    } else {
                      tier = 'High Burden';
                      tierColor = 'text-red-600';
                      tierBg = 'bg-red-500';
                    }

                    const showWarning = ratio >= 1.0;

                    return (
                      <div className={`border rounded-xl p-5 ${showWarning ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Part 2</div>
                            <h3 className="text-lg font-bold text-gray-900">Loan Affordability</h3>
                            <p className="text-sm text-gray-500">Can your business handle this loan?</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${tierColor}`}>{tier}</div>
                            <div className="text-sm text-gray-500">{ratio.toFixed(1)}x monthly revenue</div>
                          </div>
                        </div>

                        {/* Visual ratio bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>0x</span>
                            <span>2x+</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-full w-[25%] bg-green-100"></div>
                            <div className="absolute top-0 left-[25%] h-full w-[25%] bg-blue-100"></div>
                            <div className="absolute top-0 left-[50%] h-full w-[25%] bg-amber-100"></div>
                            <div className="absolute top-0 left-[75%] h-full w-[25%] bg-red-100"></div>
                            <div
                              className={`absolute top-0 h-full w-1 ${tierBg} z-10`}
                              style={{ left: `${Math.min(ratio / 2 * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex text-[10px] text-gray-400 mt-1">
                            <span className="w-[25%] text-center">Comfortable</span>
                            <span className="w-[25%] text-center">Manageable</span>
                            <span className="w-[25%] text-center">Stretched</span>
                            <span className="w-[25%] text-center">High Burden</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Loan Request:</span>
                            <span className="ml-2 font-semibold">${loanAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">~Monthly Revenue:</span>
                            <span className="ml-2 font-semibold">${Math.round(monthlyRevenue).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Adjust loan amount - always visible */}
                        {monthlyRevenue > 0 && (
                          <div className={`border rounded-lg p-4 mt-4 ${showWarning ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
                            {showWarning && (
                              <p className="text-sm text-amber-800 font-medium mb-3">
                                Consider reducing your loan amount for better terms.
                              </p>
                            )}

                            {/* Recommended amounts */}
                            <div className="mb-4">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recommended amounts based on your revenue:</p>
                              {(() => {
                                // Round to nearest $100 for cleaner amounts
                                const roundTo100 = (n: number) => Math.round(n / 100) * 100;
                                const comfortableAmt = roundTo100(monthlyRevenue * 0.4);
                                const manageableAmt = roundTo100(monthlyRevenue * 0.75);
                                const stretchedAmt = roundTo100(monthlyRevenue * 1.5);

                                return (
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleChange('amount', comfortableAmt.toString())}
                                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                                        ratio < 0.5 && ratio >= 0.3
                                          ? 'bg-green-100 border-green-300 text-green-700'
                                          : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                      }`}
                                    >
                                      ${comfortableAmt.toLocaleString()}
                                      <span className="ml-1 text-xs opacity-75">Comfortable</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleChange('amount', manageableAmt.toString())}
                                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                                        ratio >= 0.5 && ratio < 1.0
                                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                                          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                      }`}
                                    >
                                      ${manageableAmt.toLocaleString()}
                                      <span className="ml-1 text-xs opacity-75">Manageable</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleChange('amount', stretchedAmt.toString())}
                                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                                        ratio >= 1.0 && ratio < 2.0
                                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                                          : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
                                      }`}
                                    >
                                      ${stretchedAmt.toLocaleString()}
                                      <span className="ml-1 text-xs opacity-75">Stretched</span>
                                    </button>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Custom amount input */}
                            <div className="flex items-center gap-3">
                              <label className="text-sm text-gray-600 whitespace-nowrap">Or enter custom:</label>
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                  type="number"
                                  value={formData.amount}
                                  onChange={(e) => handleChange('amount', e.target.value)}
                                  min="100"
                                  max="50000"
                                  step="50"
                                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    You haven't connected any revenue sources yet. You can still create a request, but connecting platforms helps you get funded faster.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    ← Go Back to Connect Platforms
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl"
              >
                Continue to Complete Application
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COMPLETE APPLICATION */}
        {currentStep === 4 && (
          <>
            {/* About You */}
            <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Your Story</h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Tell us about yourself, what you do, and who you serve *
                  </label>
                  <span className={`text-xs ${formData.aboutYou.length < 100 ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.aboutYou.length} chars
                  </span>
                </div>
                <textarea
                  value={formData.aboutYou}
                  onChange={(e) => handleChange('aboutYou', e.target.value)}
                  placeholder="I'm Sarah, a single mother of two living in Austin. I work as a seamstress from home..."
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                    errors.aboutYou ? 'border-red-300' : 'border-gray-300 focus:border-brand-500'
                  }`}
                />
                {errors.aboutYou && <p className="text-sm text-red-600 mt-1">{errors.aboutYou}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your website or portfolio (optional)</label>
                <input
                  type="url"
                  value={formData.businessWebsite}
                  onChange={(e) => handleChange('businessWebsite', e.target.value)}
                  placeholder="https://myportfolio.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">X/Twitter handle (optional)</label>
                <input
                  type="text"
                  value={formData.twitterHandle}
                  onChange={(e) => handleChange('twitterHandle', e.target.value)}
                  placeholder="@alice or alice"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none"
                />
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Funding Details</h2>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    What will this funding help you achieve, and how will you pay it back? *
                  </label>
                  <span className={`text-xs ${formData.loanUseAndImpact.length < 225 ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.loanUseAndImpact.length} chars
                  </span>
                </div>
                <textarea
                  value={formData.loanUseAndImpact}
                  onChange={(e) => handleChange('loanUseAndImpact', e.target.value)}
                  placeholder="I'll use the $600 to buy a Singer Professional sewing machine ($450) and fabric supplies ($150)..."
                  rows={10}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                    errors.loanUseAndImpact ? 'border-red-300' : 'border-gray-300 focus:border-brand-500'
                  }`}
                />
                {errors.loanUseAndImpact && <p className="text-sm text-red-600 mt-1">{errors.loanUseAndImpact}</p>}
              </div>
            </div>

            {/* Photo */}
            <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Add a Photo</h2>
              <p className="text-sm text-gray-600 mb-4">
                Show lenders your business in action — requests with photos get funded 35% faster.
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 ${
                  isDragging ? 'border-brand-500 bg-brand-50' : errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                {formData.imageUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={formData.imageUrl} alt="Loan preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">Image uploaded ✅</p>
                      <button
                        type="button"
                        onClick={() => handleChange('imageUrl', '')}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer text-brand-600 hover:text-brand-700 font-medium">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <span className="text-gray-600"> or drag and drop</span>
                    </div>
                  </div>
                )}
              </div>

              {errors.imageUrl && <p className="text-sm text-red-600 mt-2">{errors.imageUrl}</p>}
            </div>

            {/* Preview */}
            {(formData.loanPurposes.length > 0 || formData.imageUrl) && (
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Preview</h2>
                <div className="max-w-md mx-auto">
                  <LoanCard
                    address={"0x0000000000000000000000000000000000000000" as `0x${string}`}
                    borrower={address || "0x0000000000000000000000000000000000000000" as `0x${string}`}
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

            {/* Submit */}
            {uploadProgress && (
              <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
                <p className="text-gray-900 font-semibold">{uploadProgress}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isPending || isConfirming || isSubmitting}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl disabled:bg-gray-400"
              >
                {isPending || isConfirming || isSubmitting ? 'Creating...' : 'Submit Funding Request'}
              </button>
            </div>
          </>
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

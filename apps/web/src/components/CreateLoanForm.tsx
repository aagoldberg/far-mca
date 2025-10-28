'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { useCreateLoan } from '@/hooks/useMicroLoan';
import { USDC_DECIMALS } from '@/types/loan';
import ImageCropModal from '@/components/ImageCropModal';
import { LoanCard } from '@/components/LoanCard';
import { useFarcasterProfile } from '@/hooks/useFarcasterProfile';

enum IncomeRange {
  PREFER_NOT_TO_SAY = '',
  UNDER_1K = 'under_1k',
  ONE_TO_TWO_K = '1k_to_2k',
  TWO_TO_THREE_HALF_K = '2k_to_3.5k',
  THREE_HALF_TO_FIVE_K = '3.5k_to_5k',
  FIVE_TO_SEVEN_HALF_K = '5k_to_7.5k',
  OVER_SEVEN_HALF_K = 'over_7.5k'
}

// Income range to monthly income mapping for calculations
const INCOME_RANGES: Record<string, number> = {
  [IncomeRange.UNDER_1K]: 750,
  [IncomeRange.ONE_TO_TWO_K]: 1500,
  [IncomeRange.TWO_TO_THREE_HALF_K]: 2750,
  [IncomeRange.THREE_HALF_TO_FIVE_K]: 4250,
  [IncomeRange.FIVE_TO_SEVEN_HALF_K]: 6250,
  [IncomeRange.OVER_SEVEN_HALF_K]: 9000,
};

interface FormData {
  // Section 1: Basics
  amount: string;
  repaymentWeeks: number;
  title: string;

  // Section 2: About You
  aboutYou: string;
  businessWebsite: string;
  twitterHandle: string; // X/Twitter handle (e.g., "@alice" or "alice")

  // Section 3: This Loan
  loanUseAndImpact: string; // Combined: what you'll buy + what it will help you achieve
  repaymentPlan: string;
  monthlyIncome: IncomeRange;

  // Section 4: Photo
  imageUrl: string;
  imageAspectRatio?: number; // undefined means free crop
}

export default function CreateLoanForm() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createLoan, isPending, isConfirming, isSuccess, hash } = useCreateLoan();
  const { profile } = useFarcasterProfile(address);

  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    repaymentWeeks: 8,
    title: '',
    aboutYou: '',
    businessWebsite: '',
    twitterHandle: '',
    loanUseAndImpact: '',
    repaymentPlan: '',
    monthlyIncome: IncomeRange.PREFER_NOT_TO_SAY,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [showCropModal, setShowCropModal] = useState(false);

  // Give the wallet time to connect automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      setIsCheckingConnection(false);
    }
  }, [isConnected]);

  const handleChange = (field: keyof FormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Calculate bi-weekly payment (handle grant with 0 weeks)
  const biWeeklyPayment = formData.amount && formData.repaymentWeeks > 0
    ? parseFloat(formData.amount) / (formData.repaymentWeeks / 2)
    : 0;

  // Calculate payment as % of income (skip for grants)
  const paymentPercentage = formData.repaymentWeeks > 0 && formData.monthlyIncome && formData.monthlyIncome !== IncomeRange.PREFER_NOT_TO_SAY
    ? (biWeeklyPayment / INCOME_RANGES[formData.monthlyIncome]) * 100
    : null;

  // Extract numbers from loan use field
  const extractNumbers = (text: string | undefined): number[] => {
    if (!text) return [];
    const regex = /\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    const matches = text.matchAll(regex);
    return Array.from(matches).map(m => parseFloat(m[1].replace(/,/g, '')));
  };

  const loanUseNumbers = extractNumbers(formData.loanUseAndImpact || '');
  const loanUseSum = loanUseNumbers.reduce((sum, n) => sum + n, 0);
  const loanAmount = parseFloat(formData.amount) || 0;
  const sumMatchesAmount = loanUseSum > 0 && Math.abs(loanUseSum - loanAmount) / loanAmount < 0.1;

  // Image upload functions
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
    try {
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
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Section 1: Basics
    if (!formData.amount || parseFloat(formData.amount) < 100) {
      newErrors.amount = 'Minimum loan amount is $100 USDC';
    }
    if (!formData.amount || parseFloat(formData.amount) > 10000) {
      newErrors.amount = 'Maximum loan amount is $10,000 USDC';
    }
    if (!formData.title.trim() || formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    if (formData.title.length > 80) {
      newErrors.title = 'Title must be 80 characters or less';
    }

    // Section 2: About You
    if (!formData.aboutYou.trim()) {
      newErrors.aboutYou = 'Please tell us about yourself';
    } else if (formData.aboutYou.length < 100) {
      newErrors.aboutYou = 'Please add more detail (at least 100 characters)';
    }

    // Section 3: This Loan (now includes repayment plan)
    if (!formData.loanUseAndImpact.trim()) {
      newErrors.loanUseAndImpact = 'Please describe what you\'ll achieve and how you\'ll pay it back';
    } else if (formData.loanUseAndImpact.length < 225) {
      newErrors.loanUseAndImpact = 'Please add more detail (at least 225 characters)';
    }

    // Section 4: Photo
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadMetadataToIPFS = async () => {
    try {
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
      const metadata = {
        name: formData.title,
        description: formData.aboutYou.substring(0, 280), // Short description for card
        fullDescription: `${formData.aboutYou}\n\n**What I'll achieve and how I'll pay it back:**\n${formData.loanUseAndImpact}`,
        image: imageURI,
        businessWebsite: formData.businessWebsite || undefined,
        twitterHandle: formData.twitterHandle || undefined,
        loanDetails: {
          aboutYou: formData.aboutYou,
          businessWebsite: formData.businessWebsite,
          twitterHandle: formData.twitterHandle,
          loanUseAndImpact: formData.loanUseAndImpact,
        },
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
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      alert('Please connect your wallet');
      return;
    }

    if (!validate()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      // Validate
      const MIN_PRINCIPAL = 100e6;
      const MIN_LOAN_DURATION = 4 * 7 * 86400; // 4 weeks
      const MAX_LOAN_DURATION = 12 * 7 * 86400; // 12 weeks (3 months)

      if (principal < BigInt(MIN_PRINCIPAL)) {
        throw new Error('Principal must be at least $100 USDC');
      }
      // Allow 0 duration for grants, or require between 4 and 12 weeks for loans
      if (loanDuration !== 0 && (loanDuration < MIN_LOAN_DURATION || loanDuration > MAX_LOAN_DURATION)) {
        throw new Error('Loan duration must be 0 (grant) or between 4 and 12 weeks');
      }

      console.log('Creating loan with params:', {
        borrower: address,
        metadataURILength: metadataURI.length,
        principal: principal.toString(),
        loanDuration,
        fundraisingDeadline,
      });

      await createLoan({
        borrower: address,
        metadataURI,
        principal,
        loanDuration,
        fundraisingDeadline,
      });

    } catch (error: any) {
      console.error('Error creating loan:', error);
      alert(error.message || 'Failed to create loan');
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  // Success state
  if (isSuccess && hash) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-[#3B9B7F] to-[#2E7D68] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Loan Created!
          </h2>
          <p className="text-gray-700 mb-2 text-lg">
            Your loan is live and accepting contributions
          </p>
          <p className="text-xs text-gray-500 mb-8 font-mono bg-white/50 rounded px-3 py-2 inline-block">
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View All Loans
            </button>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Create Another Loan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isCheckingConnection) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Wallet...</h2>
          <p className="text-gray-600">
            Connecting to your wallet
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">
            Please connect your wallet to create a loan request
          </p>
          <p className="text-sm text-gray-500">
            Click 'Login' in the navigation to connect
          </p>
        </div>
      </div>
    );
  }

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

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Create Your Loan
        </h1>
        <p className="text-gray-600">
          Get zero-interest funding from your community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Loan Basics */}
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#3B9B7F]/10 flex items-center justify-center text-[#3B9B7F] font-bold text-sm">1</span>
            Loan Basics
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                How much would help you reach your goal? *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="500"
                  step="10"
                  min="100"
                  max="10000"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                    errors.amount ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">$100 - $10,000 USDC</p>
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                When can you repay this? *
              </label>
              <select
                name="repaymentWeeks"
                value={formData.repaymentWeeks}
                onChange={(e) => handleChange('repaymentWeeks', parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B9B7F] focus:ring-0 outline-none"
              >
                <option value={0}>This is a grant (no repayment)</option>
                <option value={4}>1 month</option>
                <option value={8}>2 months</option>
                <option value={12}>3 months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                What's this loan for? *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="A sewing machine to start my clothing alteration business"
                maxLength={80}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 outline-none ${
                  errors.title ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-gray-500">
                  Be specific about what you need
                </p>
                <span className="text-xs text-gray-400">{formData.title.length}/80</span>
              </div>
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: About You */}
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#3B9B7F]/10 flex items-center justify-center text-[#3B9B7F] font-bold text-sm">2</span>
            About You
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Tell us about yourself, what you do, and who you serve *
                </label>
                <span className={`text-xs ${
                  formData.aboutYou.length < 100 ? 'text-red-500' :
                  formData.aboutYou.length >= 200 && formData.aboutYou.length <= 600 ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {formData.aboutYou.length} chars
                </span>
              </div>
              <textarea
                name="aboutYou"
                value={formData.aboutYou}
                onChange={(e) => handleChange('aboutYou', e.target.value)}
                placeholder="I'm Sarah, a single mother of two living in Austin. I work as a seamstress from home, making custom clothes for my neighbors and local boutiques. I've been sewing since I was 12 - my grandmother taught me. Right now I'm doing everything by hand because I can't afford a proper sewing machine. Despite this, I have 6 regular customers and make about $800/month. My dream is to expand and hire another seamstress from my community..."
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.aboutYou ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              {errors.aboutYou && (
                <p className="text-sm text-red-600 mt-1">{errors.aboutYou}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Your website or portfolio (optional)
              </label>
              <input
                type="url"
                name="businessWebsite"
                value={formData.businessWebsite}
                onChange={(e) => handleChange('businessWebsite', e.target.value)}
                placeholder="https://myportfolio.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 outline-none ${
                  errors.businessWebsite ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Show lenders what you do
              </p>
              {errors.businessWebsite && (
                <p className="text-sm text-red-600 mt-1">{errors.businessWebsite}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                X/Twitter handle (optional)
              </label>
              <input
                type="text"
                name="twitterHandle"
                value={formData.twitterHandle}
                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                placeholder="@alice or alice"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 outline-none ${
                  errors.twitterHandle ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Build trust through your social network
              </p>
              {errors.twitterHandle && (
                <p className="text-sm text-red-600 mt-1">{errors.twitterHandle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: This Loan */}
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#3B9B7F]/10 flex items-center justify-center text-[#3B9B7F] font-bold text-sm">3</span>
            Loan Details
          </h2>

          <div className="space-y-4">
            {/* Combined: Loan Impact & Repayment Plan */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900">
                  What will this loan help you achieve, and how will you pay it back? *
                </label>
                <span className={`text-xs ${
                  formData.loanUseAndImpact.length < 225 ? 'text-red-500' :
                  formData.loanUseAndImpact.length >= 400 && formData.loanUseAndImpact.length <= 1000 ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {formData.loanUseAndImpact.length} chars
                </span>
              </div>
              <textarea
                name="loanUseAndImpact"
                value={formData.loanUseAndImpact}
                onChange={(e) => handleChange('loanUseAndImpact', e.target.value)}
                placeholder="I'll use the $600 to buy a Singer Professional sewing machine ($450) and fabric supplies ($150).

Right now I'm hand-sewing everything, taking 4-5 hours per dress. With a machine, I can finish in 45 minutes - going from 6 dresses/month to 25-30 dresses.

I have 12 customers waiting! This will grow my income from $800 to $2,000/month. This will help me support my kids better and maybe even hire my neighbor Maria.

For repayment: I currently earn $800/month and expect $2,000 after. The bi-weekly payment would be under 10% of my current income, which I can easily manage. I also have $400/month child support as backup, and my sister has agreed to help if needed."
                rows={10}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.loanUseAndImpact ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              {errors.loanUseAndImpact && (
                <p className="text-sm text-red-600 mt-1">{errors.loanUseAndImpact}</p>
              )}
            </div>

            {/* Monthly Income (Optional) */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                What do you earn each month? (optional)
              </label>
              <select
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', e.target.value as IncomeRange)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B9B7F] focus:ring-0 outline-none"
              >
                <option value={IncomeRange.PREFER_NOT_TO_SAY}>Prefer not to say</option>
                <option value={IncomeRange.UNDER_1K}>Less than $1,000/month</option>
                <option value={IncomeRange.ONE_TO_TWO_K}>$1,000 - $2,000/month</option>
                <option value={IncomeRange.TWO_TO_THREE_HALF_K}>$2,000 - $3,500/month</option>
                <option value={IncomeRange.THREE_HALF_TO_FIVE_K}>$3,500 - $5,000/month</option>
                <option value={IncomeRange.FIVE_TO_SEVEN_HALF_K}>$5,000 - $7,500/month</option>
                <option value={IncomeRange.OVER_SEVEN_HALF_K}>More than $7,500/month</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                🔒 Only you see this — helps us make sure payments fit your budget
              </p>
            </div>
          </div>
        </div>

        {/* Income Warning */}
        {paymentPercentage !== null && paymentPercentage > 25 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  This repayment schedule may be challenging
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Your bi-weekly payment (${biWeeklyPayment.toFixed(2)}) is {paymentPercentage.toFixed(1)}% of your stated monthly income.
                  Most successful borrowers keep payments under 20% of income.
                </p>
                <p className="text-sm text-gray-600 font-medium">Suggestions:</p>
                <ul className="text-sm text-gray-600 space-y-1 mt-1">
                  {formData.repaymentWeeks < 24 && (
                    <li>• Extend timeline to {formData.repaymentWeeks + 8} weeks → ${(parseFloat(formData.amount) / ((formData.repaymentWeeks + 8) / 2)).toFixed(2)} bi-weekly</li>
                  )}
                  <li>• Reduce loan amount to ${(INCOME_RANGES[formData.monthlyIncome] * 0.2 * (formData.repaymentWeeks / 2)).toFixed(2)}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {paymentPercentage !== null && paymentPercentage < 20 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  This looks manageable!
                </h3>
                <p className="text-sm text-gray-700">
                  Your bi-weekly payment (${biWeeklyPayment.toFixed(2)}) is only {paymentPercentage.toFixed(1)}% of your stated monthly income.
                  This is well within the recommended range.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  💡 Tip: Mentioning this in your "repayment plan" above helps build lender confidence.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Add a Photo */}
        <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#3B9B7F]/10 flex items-center justify-center text-[#3B9B7F] font-bold text-sm">4</span>
            Add a Photo
          </h2>
          <p className="text-sm text-gray-600 mb-4 ml-10">
            Show lenders what you're working toward — loans with photos get funded 35% faster
          </p>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
              isDragging
                ? 'border-[#3B9B7F] bg-green-50'
                : errors.imageUrl
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {formData.imageUrl ? (
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Loan preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Image uploaded ✅</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Drag a new image to replace
                  </p>
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
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-[#3B9B7F] hover:text-[#2E7D68] font-medium"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <span className="text-gray-600"> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF - automatically resized and optimized
                </p>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-[#3B9B7F]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Loading...</span>
                </div>
              </div>
            )}
          </div>

          {errors.imageUrl && (
            <p className="text-sm text-red-600 mt-2">{errors.imageUrl}</p>
          )}
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#3B9B7F] border-t-transparent"></div>
              <p className="text-gray-900 font-semibold">{uploadProgress}</p>
            </div>
          </div>
        )}

        {/* Loan Card Preview */}
        {(formData.title || formData.loanUseAndImpact || formData.amount || formData.imageUrl) && (
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-300 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Preview</h2>
            <p className="text-sm text-gray-600 mb-5">
              How your loan will appear
            </p>

            <div className="max-w-md mx-auto">
              <LoanCard
                address={"0x0000000000000000000000000000000000000000" as `0x${string}`}
                borrower={address || "0x0000000000000000000000000000000000000000" as `0x${string}`}
                name={formData.title || "What's this loan for?"}
                description={""}
                principal={formData.amount ? parseUnits(formData.amount, USDC_DECIMALS) : 0n}
                totalFunded={0n}
                fundraisingActive={true}
                active={false}
                completed={false}
                contributorsCount={0n}
                termPeriods={BigInt(formData.repaymentWeeks / 2)}
                imageUrl={formData.imageUrl || undefined}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || isConfirming || isSubmitting}
          className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isPending || isConfirming || isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isPending ? 'Creating...' : 'Confirming...'}
            </span>
          ) : (
            'Create Loan'
          )}
        </button>
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

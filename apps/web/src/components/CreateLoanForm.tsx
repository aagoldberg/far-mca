'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { useCreateLoan } from '@/hooks/useMicroLoan';
import { USDC_DECIMALS, PERIOD_LENGTH } from '@/types/loan';

export default function CreateLoanForm() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createLoan, isPending, isConfirming, isSuccess, hash } = useCreateLoan();

  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    businessType: '',
    location: '',
    imageUrl: '',
    fundingGoal: '',
    termMonths: 12,
    periodLengthDays: 30,
    firstPaymentDays: 30,
    fundraisingDays: 30,
    useOfFunds: '',
    repaymentSource: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // For web app with Privy, wallet connects immediately
  useEffect(() => {
    setIsCheckingConnection(false);
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resizeAndCompressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions (max 1200x1200, maintain aspect ratio)
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

          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob for upload
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
      // Resize and compress the image
      const compressedBlob = await resizeAndCompressImage(file);

      console.log(`Image compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressedBlob.size / 1024).toFixed(0)}KB`);

      // Create preview for display
      const previewUrl = URL.createObjectURL(compressedBlob);
      handleChange('imageUrl', previewUrl);

      // Store the blob and filename for later IPFS upload
      (window as any).__pendingImageBlob = compressedBlob;
      (window as any).__pendingImageFilename = file.name;

      setIsUploading(false);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try a different image.');
      setIsUploading(false);
    }
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

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Business photo is required';
    }
    if (!formData.fundingGoal || parseFloat(formData.fundingGoal) <= 0) {
      newErrors.fundingGoal = 'Valid funding goal is required';
    }
    if (formData.termMonths < 1 || formData.termMonths > 60) {
      newErrors.termMonths = 'Term must be between 1 and 60 months';
    }
    if (!formData.useOfFunds.trim()) {
      newErrors.useOfFunds = 'Use of funds is required';
    }
    if (!formData.repaymentSource.trim()) {
      newErrors.repaymentSource = 'Repayment source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadMetadataToIPFS = async () => {
    try {
      // Upload image to IPFS first if there's a pending blob
      let imageURI: string | undefined;
      const pendingImageBlob = (window as any).__pendingImageBlob;
      const pendingImageFilename = (window as any).__pendingImageFilename;

      if (pendingImageBlob && pendingImageFilename) {
        console.log('Uploading image to IPFS...');
        imageURI = await uploadImageToIPFS(pendingImageBlob, pendingImageFilename);
        console.log('Image uploaded to IPFS:', imageURI);
      }

      // Create metadata with IPFS image URL
      const metadata = {
        name: formData.businessName,
        description: formData.description,
        businessType: formData.businessType,
        location: formData.location,
        image: imageURI, // IPFS URI instead of base64
        useOfFunds: formData.useOfFunds,
        repaymentSource: formData.repaymentSource,
        createdAt: new Date().toISOString(),
      };

      console.log('Uploading metadata to IPFS...');

      // Upload metadata to IPFS
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
      return;
    }

    setIsSubmitting(true);
    setUploadProgress('Preparing upload...');

    try {
      // Upload metadata (which includes uploading image to IPFS)
      setUploadProgress('Uploading to IPFS...');
      const metadataURI = await uploadMetadataToIPFS();
      setUploadProgress('Creating blockchain transaction...');

      // Calculate timestamps - ensure they are integers
      const now = Math.floor(Date.now() / 1000);
      const fundraisingDeadline = Math.floor(now + (formData.fundraisingDays * 86400));
      const firstDueDate = Math.floor(fundraisingDeadline + (formData.firstPaymentDays * 86400));

      // Prepare contract parameters
      const principal = parseUnits(formData.fundingGoal, USDC_DECIMALS);
      const periodLength = Math.floor(formData.periodLengthDays * 86400); // Convert days to seconds

      // Validate against contract bounds
      const MIN_PRINCIPAL = 100e6; // $100 minimum (6 decimals)
      const MIN_TERM_PERIODS = 3;
      const MAX_TERM_PERIODS = 60;
      const MIN_PERIOD_LENGTH = 7 * 86400; // 7 days
      const MAX_PERIOD_LENGTH = 60 * 86400; // 60 days

      if (principal < BigInt(MIN_PRINCIPAL)) {
        throw new Error(`Principal must be at least $100 USDC`);
      }
      if (formData.termMonths < MIN_TERM_PERIODS || formData.termMonths > MAX_TERM_PERIODS) {
        throw new Error(`Term periods must be between ${MIN_TERM_PERIODS} and ${MAX_TERM_PERIODS}`);
      }
      if (periodLength < MIN_PERIOD_LENGTH || periodLength > MAX_PERIOD_LENGTH) {
        throw new Error(`Period length must be between 7 and 60 days`);
      }
      if (fundraisingDeadline <= now) {
        throw new Error('Fundraising deadline must be in the future');
      }
      if (firstDueDate <= fundraisingDeadline) {
        throw new Error('First due date must be after fundraising deadline');
      }

      console.log('Creating loan with params:', {
        borrower: address,
        metadataURILength: metadataURI.length,
        principal: principal.toString(),
        termPeriods: formData.termMonths,
        periodLength,
        firstDueDate,
        fundraisingDeadline,
      });

      await createLoan({
        borrower: address,
        metadataURI,
        principal,
        termPeriods: formData.termMonths,
        periodLength,
        firstDueDate,
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
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Request is Live!
          </h2>
          <p className="text-gray-600 mb-2">
            Your community can now lend their support to help make your dream a reality
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              See Your Request
            </button>
            <button
              onClick={() => {
                const loanUrl = `${window.location.origin}/loan/${hash}`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Help Me Build My Dream',
                    text: `I'm asking our community for support. Will you lend a hand?`,
                    url: loanUrl,
                  }).catch(() => {
                    // Fallback to copying link
                    navigator.clipboard.writeText(loanUrl);
                    alert('Link copied to clipboard!');
                  });
                } else {
                  // Fallback to copying link
                  navigator.clipboard.writeText(loanUrl);
                  alert('Link copied to clipboard!');
                }
              }}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Spread the Word
              </span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Create Another Request
            </button>
          </div>
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
            Please connect your wallet to request community support
          </p>
          <p className="text-sm text-gray-500">
            Use the login button in the top right corner
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4 px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg text-sm text-blue-800">
        <strong>IPFS Version 2.0</strong> - Using decentralized storage for efficient transactions
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Request Community Support
      </h1>
      <p className="text-gray-600 mb-6">
        Connect with neighbors who believe in your dream • 0% interest • Pay back exactly what you borrow
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Business Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="e.g., Joe's Coffee Shop"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.businessName ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              {errors.businessName && (
                <p className="text-sm text-red-600 mt-1">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Share your story with the community - what's your dream and how will this support help you achieve it?"
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  value={formData.businessType}
                  onChange={(e) => handleChange('businessType', e.target.value)}
                  placeholder="e.g., Restaurant, Retail"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Photo *
              </label>

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
                        alt="Business preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">Image uploaded</p>
                      <p className="text-xs text-gray-500 mb-2">
                        Drag a new image to replace, or paste a URL below
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
                      <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* URL Input (alternative) */}
              <div className="mt-3">
                <input
                  type="url"
                  value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="Or paste image URL: https://example.com/photo.jpg"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
              </div>

              {errors.imageUrl && (
                <p className="text-sm text-red-600 mt-2">{errors.imageUrl}</p>
              )}
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Loan Terms</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Goal (USDC) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  value={formData.fundingGoal}
                  onChange={(e) => handleChange('fundingGoal', e.target.value)}
                  placeholder="0"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                    errors.fundingGoal ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                  }`}
                />
              </div>
              {errors.fundingGoal && (
                <p className="text-sm text-red-600 mt-1">{errors.fundingGoal}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Term (periods)
                </label>
                <input
                  type="number"
                  value={formData.termMonths}
                  onChange={(e) => handleChange('termMonths', parseInt(e.target.value))}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of payment periods (e.g., 12 months)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period Length (days)
                </label>
                <input
                  type="number"
                  value={formData.periodLengthDays}
                  onChange={(e) => handleChange('periodLengthDays', parseInt(e.target.value))}
                  min="7"
                  max="90"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Days between payments (e.g., 30)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fundraising Period (days)
                </label>
                <input
                  type="number"
                  value={formData.fundraisingDays}
                  onChange={(e) => handleChange('fundraisingDays', parseInt(e.target.value))}
                  min="1"
                  max="90"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Days to reach funding goal
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Payment (days after funding)
                </label>
                <input
                  type="number"
                  value={formData.firstPaymentDays}
                  onChange={(e) => handleChange('firstPaymentDays', parseInt(e.target.value))}
                  min="1"
                  max="90"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#3B9B7F] focus:ring-0 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Grace period before first payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Additional Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use of Funds *
              </label>
              <textarea
                value={formData.useOfFunds}
                onChange={(e) => handleChange('useOfFunds', e.target.value)}
                placeholder="How will this support help you grow? (e.g., new equipment to serve more customers, inventory to expand your reach)"
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.useOfFunds ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              {errors.useOfFunds && (
                <p className="text-sm text-red-600 mt-1">{errors.useOfFunds}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repayment Source *
              </label>
              <textarea
                value={formData.repaymentSource}
                onChange={(e) => handleChange('repaymentSource', e.target.value)}
                placeholder="How will you pay back the community? (e.g., steady monthly revenue, income from specific services)"
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.repaymentSource ? 'border-red-300' : 'border-gray-300 focus:border-[#3B9B7F]'
                }`}
              />
              {errors.repaymentSource && (
                <p className="text-sm text-red-600 mt-1">{errors.repaymentSource}</p>
              )}
            </div>
          </div>
        </div>

        {/* Zero-Interest Highlight */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Community Support, Not Profit</h3>
              <p className="text-sm text-gray-700 mb-2">
                Your neighbors lend because they believe in you, not to make money. Pay back exactly what you receive - nothing more.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Zero interest - ever</li>
                <li>• Fair, predictable repayment</li>
                <li>• Neighbors helping neighbors</li>
                <li>• Built on trust and transparency</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Progress Indicator */}
        {uploadProgress && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-blue-800 font-medium">{uploadProgress}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || isConfirming || isSubmitting}
          className="w-full bg-[#3B9B7F] hover:bg-[#2E7D68] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming || isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isPending ? 'Creating Loan...' : 'Confirming...'}
            </span>
          ) : (
            'Share Your Request'
          )}
        </button>
      </form>
    </div>
  );
}

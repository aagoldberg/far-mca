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

  // Give the wallet time to connect automatically in Farcaster
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingConnection(false);
    }, 2000); // Wait 2 seconds for wallet to connect

    return () => clearTimeout(timer);
  }, []);

  // Stop checking once connected
  useEffect(() => {
    if (isConnected) {
      setIsCheckingConnection(false);
    }
  }, [isConnected]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (limit to 500KB for on-chain storage)
    const maxSize = 500 * 1024; // 500KB
    if (file.size > maxSize) {
      alert(`Image is too large (${(file.size / 1024).toFixed(0)}KB). Please use an image smaller than 500KB. You can:\n\n1. Use a photo compression tool\n2. Resize the image to smaller dimensions\n3. Use a JPEG with lower quality setting`);
      return;
    }

    setIsUploading(true);
    try {
      // Convert image to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange('imageUrl', base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
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
    // For MVP, we'll use a simple JSON structure
    // In production, you'd upload to IPFS via Pinata or similar
    const metadata = {
      name: formData.businessName,
      description: formData.description,
      businessType: formData.businessType,
      location: formData.location,
      imageUrl: formData.imageUrl,
      useOfFunds: formData.useOfFunds,
      repaymentSource: formData.repaymentSource,
    };

    // For now, return a data URL (in production, upload to IPFS)
    const jsonString = JSON.stringify(metadata);

    // Use proper UTF-8 encoding for base64 conversion with chunking for large data
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);

    // Process in chunks to avoid call stack limit
    let binaryString = '';
    const chunkSize = 8192;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      binaryString += String.fromCharCode(...chunk);
    }

    const base64 = btoa(binaryString);
    const dataUrl = `data:application/json;base64,${base64}`;
    return dataUrl;
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

    try {
      // Upload metadata
      const metadataURI = await uploadMetadataToIPFS();

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
            Loan Created Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Your zero-interest loan is now live and accepting contributions
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="block w-full bg-[#2E7D32] hover:bg-[#4CAF50] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              View All Loans
            </button>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Create Another Loan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking for wallet connection
  if (isCheckingConnection) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Wallet...</h2>
          <p className="text-gray-600">
            Connecting to your Farcaster wallet
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
            Please make sure you're opening this in Warpcast
          </p>
          <p className="text-sm text-gray-500">
            This app requires a Farcaster Mini App environment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Create Zero-Interest Loan
      </h1>
      <p className="text-gray-600 mb-6">
        Get community funding with 0% interest • 1.0x repayment only
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
                  errors.businessName ? 'border-red-300' : 'border-gray-300 focus:border-[#2E7D32]'
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
                placeholder="Tell funders about your business and why you need this loan..."
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300 focus:border-[#2E7D32]'
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                    ? 'border-[#2E7D32] bg-green-50'
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
                        className="cursor-pointer text-[#2E7D32] hover:text-[#4CAF50] font-medium"
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
                      PNG, JPG, GIF up to 500KB (compressed images work best)
                    </p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-[#2E7D32]" viewBox="0 0 24 24">
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
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                    errors.fundingGoal ? 'border-red-300' : 'border-gray-300 focus:border-[#2E7D32]'
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-0 outline-none"
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
                placeholder="How will you use the loan? (e.g., equipment, inventory, marketing)"
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.useOfFunds ? 'border-red-300' : 'border-gray-300 focus:border-[#2E7D32]'
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
                placeholder="How will you repay? (e.g., monthly revenue, specific income stream)"
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 outline-none ${
                  errors.repaymentSource ? 'border-red-300' : 'border-gray-300 focus:border-[#2E7D32]'
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
              <h3 className="font-semibold text-gray-900 mb-1">Zero-Interest Community Loan</h3>
              <p className="text-sm text-gray-700 mb-2">
                You'll repay exactly 1.0x of what you raise - no interest, no profit for funders.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No interest charges</li>
                <li>• Fixed repayment schedule</li>
                <li>• Community support model</li>
                <li>• Transparent on-chain</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending || isConfirming || isSubmitting}
          className="w-full bg-[#2E7D32] hover:bg-[#4CAF50] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            'Create Loan'
          )}
        </button>
      </form>
    </div>
  );
}

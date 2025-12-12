'use client';

import { useState, useCallback } from 'react';
import { BorrowerProfileFormData } from '@/types/borrowerProfile';
import ImageCropModal from './ImageCropModal';

interface OwnerIdentityFormProps {
  initialData?: Partial<BorrowerProfileFormData>;
  onDataChange: (data: Partial<BorrowerProfileFormData>) => void;
  errors?: Record<string, string>;
  showSocialProof?: boolean;
}

export default function OwnerIdentityForm({
  initialData = {},
  onDataChange,
  errors = {},
  showSocialProof = true,
}: OwnerIdentityFormProps) {
  const [formData, setFormData] = useState<Partial<BorrowerProfileFormData>>({
    ownerFullName: initialData.ownerFullName || '',
    ownerPhotoUrl: initialData.ownerPhotoUrl || '',
    ownerEmail: initialData.ownerEmail || '',
    instagramHandle: initialData.instagramHandle || '',
    instagramFollowers: initialData.instagramFollowers,
    linkedinUrl: initialData.linkedinUrl || '',
    googleRating: initialData.googleRating,
    googleReviewCount: initialData.googleReviewCount,
  });

  // Image upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState('');

  const handleChange = (field: keyof BorrowerProfileFormData, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  // Image upload functions
  const resizeAndCompressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 400; // Smaller for profile photos
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

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);
      const compressedBlob = await resizeAndCompressImage(
        new File([croppedBlob], 'owner-photo.jpg', { type: 'image/jpeg' })
      );

      // Upload to IPFS
      const ipfsUrl = await uploadImageToIPFS(compressedBlob, 'owner-photo.jpg');

      // Also create a preview URL
      const previewUrl = URL.createObjectURL(compressedBlob);

      handleChange('ownerPhotoUrl', ipfsUrl);

      // Store preview URL for display (will be replaced with IPFS gateway URL in production)
      (window as any).__ownerPhotoPreview = previewUrl;

      setShowCropModal(false);
      setTempImageSrc('');
    } catch (error) {
      console.error('Error processing cropped image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
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

  // Get display URL for photo
  const getPhotoDisplayUrl = () => {
    if ((window as any).__ownerPhotoPreview) {
      return (window as any).__ownerPhotoPreview;
    }
    if (formData.ownerPhotoUrl?.startsWith('ipfs://')) {
      const hash = formData.ownerPhotoUrl.replace('ipfs://', '');
      return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }
    return formData.ownerPhotoUrl;
  };

  return (
    <div className="space-y-6">
      {/* Owner Identity Section - REQUIRED */}
      <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Your Identity</h2>
          <p className="text-sm text-gray-600">
            Your real identity creates accountability and builds trust with lenders.
            This information will be publicly visible on your loan request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Photo <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-4 ${
                isDragging
                  ? 'border-brand-500 bg-brand-50'
                  : errors.ownerPhotoUrl
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              {formData.ownerPhotoUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={getPhotoDisplayUrl()}
                      alt="Owner photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">Photo uploaded</p>
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('ownerPhotoUrl', '');
                        delete (window as any).__ownerPhotoPreview;
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <label htmlFor="owner-photo-upload" className="cursor-pointer text-brand-600 hover:text-brand-700 font-medium">
                    <span>Upload your photo</span>
                    <input
                      id="owner-photo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Clear headshot recommended</p>
                </div>
              )}
            </div>
            {errors.ownerPhotoUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.ownerPhotoUrl}</p>
            )}
          </div>

          {/* Owner Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ownerFullName || ''}
              onChange={(e) => handleChange('ownerFullName', e.target.value)}
              placeholder="Maya Chen"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-0 outline-none ${
                errors.ownerFullName
                  ? 'border-red-300'
                  : 'border-gray-300 focus:border-brand-500'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              As it appears on legal documents
            </p>
            {errors.ownerFullName && (
              <p className="text-sm text-red-600 mt-1">{errors.ownerFullName}</p>
            )}
          </div>
        </div>

        {/* Email (optional) */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="email"
            value={formData.ownerEmail || ''}
            onChange={(e) => handleChange('ownerEmail', e.target.value)}
            placeholder="maya@serenityscents.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            For lender communication (not displayed publicly)
          </p>
        </div>
      </div>

      {/* Social Proof Section - OPTIONAL */}
      {showSocialProof && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Social Proof</h2>
            <p className="text-sm text-gray-600">
              Adding more verifiable presence increases your visibility to lenders.
              All fields are optional.
            </p>
          </div>

          {/* Trust Boost Info */}
          <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-900">Earn Trust Boosts</p>
                <p className="text-xs text-brand-700 mt-0.5">
                  Google Reviews: +10% | Instagram 1K+: +5% | LinkedIn: +5% | Multiple platforms: +15%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Reviews */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Google Business Reviews
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={formData.googleRating || ''}
                    onChange={(e) => handleChange('googleRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="4.8"
                    step="0.1"
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Rating (1-5)</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.googleReviewCount || ''}
                    onChange={(e) => handleChange('googleReviewCount', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="127"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1"># of reviews</p>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Instagram
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                    <input
                      type="text"
                      value={formData.instagramHandle || ''}
                      onChange={(e) => handleChange('instagramHandle', e.target.value.replace('@', ''))}
                      placeholder="serenityscents"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Handle</p>
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.instagramFollowers || ''}
                    onChange={(e) => handleChange('instagramFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="12400"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Followers</p>
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/mayachen"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-0 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Accountability Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-900">Public Accountability</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your identity and loan status will be publicly visible. If you default,
              this will be visible to anyone who views your profile.
            </p>
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && tempImageSrc && (
        <ImageCropModal
          imageSrc={tempImageSrc}
          onCropComplete={(blob) => handleCropComplete(blob)}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

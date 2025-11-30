'use client';

import { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface PostUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (update: {
    title: string;
    content: string;
    updateType: string;
    images: File[];
  }) => Promise<void>;
}

export default function PostUpdateModal({ isOpen, onClose, onSubmit }: PostUpdateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [updateType, setUpdateType] = useState<'progress' | 'milestone' | 'gratitude' | 'repayment' | 'challenge'>('progress');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        content,
        updateType,
        images,
      });

      // Reset form
      setTitle('');
      setContent('');
      setUpdateType('progress');
      setImages([]);
      onClose();
    } catch (error) {
      console.error('Error posting update:', error);
      alert('Failed to post update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 sm:items-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Post Update</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Update Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Type
            </label>
            <select
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
            >
              <option value="progress">Progress Update</option>
              <option value="milestone">Milestone</option>
              <option value="gratitude">Gratitude</option>
              <option value="repayment">Repayment Update</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this update about?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your progress with your supporters..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/1000 characters</p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#2C7A7B] transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {images.length > 0
                    ? `${images.length} image${images.length > 1 ? 's' : ''} selected`
                    : 'Click to upload images'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> Your update will be posted to the blockchain
              and notified to all your supporters via Farcaster.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="w-full py-3 bg-[#2C7A7B] text-white rounded-lg font-medium hover:bg-[#234E52] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post Update'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useFarcasterAccount } from '@/hooks/useFarcasterAccount';
import { AvatarCropper } from './AvatarCropper';

interface ValidationErrors {
  bio?: string;
  display_name?: string;
  location?: string;
  url?: string;
}

interface ProfileFormData {
  bio: string;
  display_name: string;
  location: string;
  url: string;
  pfp_url: string;
}

export function FarcasterProfileEdit() {
  const { farcasterAccount, updateProfile, isLoading, error, clearError } = useFarcasterAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    bio: '',
    display_name: '',
    location: '',
    url: '',
    pfp_url: '',
  });

  const [initialData, setInitialData] = useState<ProfileFormData>({
    bio: '',
    display_name: '',
    location: '',
    url: '',
    pfp_url: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showCropper, setShowCropper] = useState(false);

  // Fetch current profile data from Neynar
  useEffect(() => {
    async function fetchProfile() {
      if (!farcasterAccount?.fid) return;

      setIsLoadingProfile(true);
      try {
        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterAccount.fid}`,
          {
            headers: {
              'api_key': process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const user = data.users?.[0];

          if (user) {
            setProfileData(user);
            const currentData = {
              bio: user.profile?.bio?.text || '',
              display_name: user.display_name || '',
              location: user.profile?.location?.description || '',
              url: user.profile?.url || '',
              pfp_url: user.pfp_url || '',
            };
            setFormData(currentData);
            setInitialData(currentData);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [farcasterAccount]);

  // Validation functions
  const validateBio = (bio: string): string | null => {
    if (bio.length > 160) return 'Bio must be 160 characters or less';
    return null;
  };

  const validateDisplayName = (name: string): string | null => {
    if (name.length > 50) return 'Display name must be 50 characters or less';
    if (name.length > 0 && !/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      return 'Only letters, numbers, spaces, hyphens, and underscores allowed';
    }
    return null;
  };

  const validateLocation = (location: string): string | null => {
    if (location.length > 50) return 'Location must be 50 characters or less';
    return null;
  };

  const validateURL = (url: string): string | null => {
    if (!url) return null; // Optional field
    try {
      new URL(url);
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'URL must start with http:// or https://';
      }
      return null;
    } catch {
      return 'Invalid URL format';
    }
  };

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'bio':
        return validateBio(value);
      case 'display_name':
        return validateDisplayName(value);
      case 'location':
        return validateLocation(value);
      case 'url':
        return validateURL(value);
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setSuccessMessage(''); // Clear success message on edit
    clearError();

    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error || undefined });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    // Validate on blur
    const error = validateField(field, formData[field as keyof ProfileFormData]);
    setErrors({ ...errors, [field]: error || undefined });
  };

  const handleSave = async () => {
    // Validate all fields
    const validationErrors: ValidationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof ProfileFormData]);
      if (error) validationErrors[field as keyof ValidationErrors] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    clearError();
    setSuccessMessage('');

    // Only send changed fields
    const updates: any = {};
    if (formData.bio !== initialData.bio) updates.bio = formData.bio;
    if (formData.display_name !== initialData.display_name) updates.display_name = formData.display_name;
    if (formData.location !== initialData.location) updates.location = formData.location;
    if (formData.url !== initialData.url) updates.url = formData.url;
    if (formData.pfp_url !== initialData.pfp_url) updates.pfp_url = formData.pfp_url;

    const success = await updateProfile(updates);

    if (success) {
      setSuccessMessage('Profile updated successfully!');
      setInitialData(formData);
      setIsEditing(false);

      // Clear cache to force refresh
      if (typeof window !== 'undefined') {
        const walletAddress = (window as any).ethereum?.selectedAddress;
        if (walletAddress) {
          const cacheKey = `farcaster_account_cache_${walletAddress.toLowerCase()}`;
          localStorage.removeItem(cacheKey);
        }
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setIsEditing(false);
    clearError();
    setSuccessMessage('');
  };

  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const [isCreatingSigner, setIsCreatingSigner] = useState(false);
  const [signerApprovalUrl, setSignerApprovalUrl] = useState<string | null>(null);

  const handleCreateSigner = async () => {
    if (!farcasterAccount?.fid) return;

    setIsCreatingSigner(true);
    try {
      const response = await fetch('/api/farcaster/create-signer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid: farcasterAccount.fid }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show approval URL to user
        setSignerApprovalUrl(data.signer_approval_url);

        // Store signer_uuid temporarily (will be persisted after approval)
        const tempSignerUuid = data.signer_uuid;

        // Open approval URL in new window
        window.open(data.signer_approval_url, '_blank', 'width=600,height=700');

        setSuccessMessage('Please approve the signer request in the popup window, then refresh this page.');
      } else {
        setErrors({ bio: data.error || 'Failed to create signer' });
      }
    } catch (err) {
      console.error('Signer creation error:', err);
      setErrors({ bio: 'Failed to create signer for profile updates' });
    } finally {
      setIsCreatingSigner(false);
    }
  };

  if (!farcasterAccount) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎭</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Farcaster Account
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a Farcaster account to set up your profile and connect with the community.
            </p>
            <p className="text-xs text-gray-500">
              You can create a Farcaster account from the user menu in the top right.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Farcaster Profile</h2>
          <p className="text-sm text-gray-600 mt-1">
            @{farcasterAccount.username}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-red-700">{error}</p>
            {error.includes('signer UUID') && !farcasterAccount.signer_uuid && (
              <div className="pt-2 border-t border-red-200">
                <p className="text-xs text-red-600 mb-3">
                  Your Farcaster account needs a signer to enable profile editing. You can either:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleCreateSigner}
                    disabled={isCreatingSigner}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {isCreatingSigner ? 'Creating Signer...' : 'Enable Profile Editing'}
                  </button>
                  <p className="text-xs text-gray-600 text-center">
                    Or update your profile in <a href="https://warpcast.com/~/settings" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Farcaster Settings</a>
                  </p>
                </div>
              </div>
            )}
            {error.includes('not approved') && farcasterAccount?.signer_approval_url && (
              <div className="pt-2 border-t border-red-200">
                <p className="text-xs text-red-600 mb-3">
                  Please approve the signer request to enable profile editing:
                </p>
                <button
                  onClick={() => window.open(farcasterAccount.signer_approval_url, '_blank', 'width=600,height=700')}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Open Approval Page
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Avatar / Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            {formData.pfp_url ? (
              <img
                src={formData.pfp_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowCropper(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                {formData.pfp_url ? 'Change Picture' : 'Upload Picture'}
              </button>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          {isEditing ? (
            <div>
              <input
                id="display_name"
                type="text"
                value={formData.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                onBlur={() => handleBlur('display_name')}
                maxLength={50}
                placeholder="Your Name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.display_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.display_name ? (
                  <p className="text-xs text-red-600">{errors.display_name}</p>
                ) : (
                  <p className="text-xs text-gray-500">How you want to be known</p>
                )}
                <span className={`text-xs ${formData.display_name.length > 45 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {formData.display_name.length} / 50
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900">
              {formData.display_name || <span className="italic text-gray-500">Not set</span>}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <div>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                onBlur={() => handleBlur('bio')}
                maxLength={160}
                rows={3}
                placeholder="Tell people about yourself"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio ? (
                  <p className="text-xs text-red-600">{errors.bio}</p>
                ) : (
                  <p className="text-xs text-gray-500">A short description about you</p>
                )}
                <span className={`text-xs ${formData.bio.length > 140 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {formData.bio.length} / 160
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {formData.bio || <span className="italic text-gray-500">No bio added yet</span>}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          {isEditing ? (
            <div>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onBlur={() => handleBlur('location')}
                maxLength={50}
                placeholder="City, Country"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.location ? (
                <p className="text-xs text-red-600 mt-1">{errors.location}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Where you're based</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-900">
              {formData.location || <span className="italic text-gray-500">No location set</span>}
            </p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          {isEditing ? (
            <div>
              <input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                onBlur={() => handleBlur('url')}
                placeholder="https://yourwebsite.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.url ? (
                <p className="text-xs text-red-600 mt-1">{errors.url}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Your personal or project website</p>
              )}
            </div>
          ) : (
            <div>
              {formData.url ? (
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {formData.url}
                </a>
              ) : (
                <p className="text-sm italic text-gray-500">No website set</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons (shown when editing) */}
        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges || Object.keys(errors).some(key => errors[key as keyof ValidationErrors])}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}

        {/* Unsaved changes indicator */}
        {isEditing && hasUnsavedChanges && (
          <p className="text-xs text-orange-600 italic">
            You have unsaved changes
          </p>
        )}
      </div>

      {/* Avatar Cropper Modal */}
      {showCropper && (
        <AvatarCropper
          onImageCropped={(imageUrl) => {
            handleInputChange('pfp_url', imageUrl);
            setShowCropper(false);
          }}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}

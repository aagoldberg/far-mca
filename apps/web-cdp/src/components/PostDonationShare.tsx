'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ShareIcon,
  HeartIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PhotoIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PostDonationShareProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    goalAmount: number;
    totalRaised: number;
    creator: string;
  };
  donationAmount: number;
  donorName?: string;
}

export default function PostDonationShare({ 
  isOpen, 
  onClose, 
  campaign, 
  donationAmount,
  donorName = 'You'
}: PostDonationShareProps) {
  const [shareStep, setShareStep] = useState<'motivation' | 'customize' | 'share' | 'success'>('motivation');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const progressPercentage = Math.min((campaign.totalRaised / campaign.goalAmount) * 100, 100);
  const remainingAmount = Math.max(campaign.goalAmount - campaign.totalRaised, 0);

  // Generate sharing messages
  const defaultMessages = {
    personal: `I just donated $${donationAmount} to "${campaign.title}" and you can help too! Every contribution brings us closer to the $${campaign.goalAmount.toLocaleString()} goal. 💚`,
    milestone: `Amazing! "${campaign.title}" just reached ${Math.round(progressPercentage)}% of its goal! I contributed $${donationAmount} - who's next? 🎯`,
    urgent: `Only $${remainingAmount.toLocaleString()} left to go for "${campaign.title}"! I just donated $${donationAmount}. Can you help us cross the finish line? 🏃‍♂️`,
    grateful: `Feeling grateful to support "${campaign.title}" with a $${donationAmount} donation. This cause means a lot to me and I hope you'll consider helping too! 🙏`
  };

  const shareTemplates = [
    {
      id: 'personal',
      emoji: '💚',
      title: 'Personal appeal',
      message: defaultMessages.personal,
      tone: 'Friendly & Direct'
    },
    {
      id: 'milestone',
      emoji: '🎯',
      title: 'Milestone celebration',
      message: defaultMessages.milestone,
      tone: 'Exciting & Progress-focused'
    },
    {
      id: 'urgent',
      emoji: '🏃‍♂️',
      title: 'Urgency & goal',
      message: defaultMessages.urgent,
      tone: 'Urgent & Goal-oriented'
    },
    {
      id: 'grateful',
      emoji: '🙏',
      title: 'Grateful tone',
      message: defaultMessages.grateful,
      tone: 'Heartfelt & Appreciative'
    }
  ];

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-600', description: 'Share with your network' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-sky-500', description: 'Tweet to followers' },
    { id: 'farcaster', name: 'Farcaster', icon: '🟣', color: 'bg-purple-600', description: 'Share on Farcaster' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500', description: 'Story or post' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'bg-green-500', description: 'Message friends' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', description: 'Professional network' },
    { id: 'copy', name: 'Copy Link', icon: '🔗', color: 'bg-gray-600', description: 'Share anywhere' }
  ];

  const motivationalReasons = [
    {
      icon: <UserGroupIcon className="w-6 h-6 text-blue-600" />,
      title: 'Your network cares',
      description: 'Friends and family are 3x more likely to donate when you share',
      stat: '3x higher'
    },
    {
      icon: <SparklesIcon className="w-6 h-6 text-purple-600" />,
      title: 'Create momentum',
      description: 'Your share could inspire the next big donation wave',
      stat: 'Viral potential'
    },
    {
      icon: <HeartIconSolid className="w-6 h-6 text-red-500" />,
      title: 'Amplify impact',
      description: 'Every share multiplies the reach of this important cause',
      stat: 'Bigger reach'
    }
  ];

  const campaignUrl = `${window.location.origin}/campaign/${campaign.id}`;

  // Generate platform-specific share URLs with UTM tracking
  const generateShareUrl = (platform: string): string | null => {
    // Add UTM parameters for tracking
    const utmUrl = `${campaignUrl}?utm_source=${platform}&utm_medium=social&utm_campaign=post_donation_share&utm_content=donor_${campaign.id}`;
    const encodedUrl = encodeURIComponent(utmUrl);
    const encodedText = encodeURIComponent(customMessage);

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

      case 'farcaster':
        // Farcaster compose URL via Warpcast - embeds the campaign URL
        return `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedUrl}`;

      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;

      case 'instagram':
        // Instagram doesn't support URL sharing - will handle specially
        return null;

      case 'copy':
        // Special handling in handleShare
        return null;

      default:
        return null;
    }
  };

  useEffect(() => {
    if (shareStep === 'customize' && shareTemplates.length > 0) {
      setCustomMessage(shareTemplates[0].message);
    }
  }, [shareStep]);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleShare = async () => {
    if (selectedPlatforms.length === 0) return;

    // Handle each selected platform
    selectedPlatforms.forEach((platform) => {
      if (platform === 'copy') {
        // Handle copy link - include UTM tracking
        const utmUrl = `${campaignUrl}?utm_source=copy&utm_medium=social&utm_campaign=post_donation_share&utm_content=donor_${campaign.id}`;
        navigator.clipboard.writeText(`${customMessage}\n\n${utmUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else if (platform === 'instagram') {
        // Instagram: copy message and show instructions
        navigator.clipboard.writeText(`${customMessage}\n\nLink in bio or DM for campaign details!`);
        alert('Caption copied! Open Instagram and paste to share.\n\nNote: Instagram doesn\'t support direct URL sharing, so the campaign link has been copied separately.');
      } else if (platform === 'facebook') {
        // Facebook: copy message to clipboard and open share dialog
        // Facebook no longer accepts pre-filled text for security reasons
        navigator.clipboard.writeText(customMessage);
        const shareUrl = generateShareUrl(platform);
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=600');
          // Show notification that message was copied
          alert('Your message has been copied to clipboard! Paste it into the Facebook post dialog that just opened.');
        }
      } else {
        // All other platforms: open share URL in new window
        const shareUrl = generateShareUrl(platform);
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      }
    });

    setShareStep('success');
  };

  const handleTemplateSelect = (template: typeof shareTemplates[0]) => {
    setCustomMessage(template.message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <HeartIconSolid className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Thank you for your donation!</h2>
                <p className="text-gray-600">Help us reach even more supporters</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4 flex items-center gap-2">
            {['motivation', 'customize', 'share', 'success'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  shareStep === step ? 'bg-blue-600 text-white' :
                  ['motivation', 'customize', 'share'].indexOf(shareStep) > index ? 'bg-green-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {['motivation', 'customize', 'share'].indexOf(shareStep) > index ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && <div className={`w-8 h-1 rounded transition-colors ${
                  ['motivation', 'customize', 'share'].indexOf(shareStep) > index ? 'bg-green-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Motivation Step */}
          {shareStep === 'motivation' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                  <CheckCircleIcon className="w-4 h-4" />
                  ${donationAmount} donated successfully
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Want to maximize your impact?
                </h3>
                <p className="text-gray-600 text-lg">
                  Sharing this campaign could inspire dozens more donations
                </p>
              </div>

              <div className="grid gap-4">
                {motivationalReasons.map((reason, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0">
                      {reason.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{reason.title}</h4>
                      <p className="text-gray-600 text-sm">{reason.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-blue-600">{reason.stat}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShareStep('customize')}
                  className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Let's share this!
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}

          {/* Customize Step */}
          {shareStep === 'customize' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customize your message</h3>
                <p className="text-gray-600">Choose a template or write your own message</p>
              </div>

              {/* Message Templates */}
              <div className="grid gap-3">
                {shareTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`text-left p-4 border rounded-lg transition-colors hover:border-blue-300 ${
                      customMessage === template.message ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{template.title}</h4>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {template.tone}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{template.message}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Message Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your own message..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Campaign link will be automatically added
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShareStep('share')}
                  disabled={!customMessage.trim()}
                  className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to sharing
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShareStep('motivation')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Share Step */}
          {shareStep === 'share' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose platforms to share</h3>
                <p className="text-gray-600">Select where you'd like to share your message</p>
              </div>

              {/* Platform Selection */}
              <div className="grid grid-cols-2 gap-3">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`p-4 border rounded-lg transition-all hover:border-blue-300 ${
                      selectedPlatforms.includes(platform.id) 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white`}>
                        <span className="text-lg">{platform.icon}</span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">{platform.name}</h4>
                        <p className="text-xs text-gray-500">{platform.description}</p>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <CheckCircleIcon className="w-5 h-5 text-blue-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Message Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Message preview</h4>
                <p className="text-sm text-gray-700 mb-2">{customMessage}</p>
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <span>🔗</span>
                  <span className="truncate">{campaignUrl}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  disabled={selectedPlatforms.length === 0}
                  className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShareIcon className="w-4 h-4" />
                  Share on {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                </button>
                <button
                  onClick={() => setShareStep('customize')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {shareStep === 'success' && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you for sharing!</h3>
                <p className="text-gray-600">
                  Your share could inspire others to support this important cause
                </p>
              </div>

              {copied && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  Link copied to clipboard!
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Your friends will see the campaign and your personal endorsement</li>
                  <li>• We'll track any donations that come from your shares</li>
                  <li>• You'll get updates on the campaign's progress</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
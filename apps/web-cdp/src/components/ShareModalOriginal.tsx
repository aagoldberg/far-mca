"use client";

import { useState, useEffect } from 'react';
import { 
    XMarkIcon, 
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';

// Enhanced social media platforms with better icons and colors
const socialPlatforms = [
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'X', icon: '𝕏', color: 'bg-black hover:bg-gray-800' },
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700 hover:bg-blue-800' },
    { name: 'Email', icon: '📧', color: 'bg-gray-600 hover:bg-gray-700' },
    { name: 'Telegram', icon: '✈️', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Reddit', icon: '🤖', color: 'bg-orange-500 hover:bg-orange-600' },
    { name: 'Pinterest', icon: '📌', color: 'bg-red-600 hover:bg-red-700' },
    { name: 'TikTok', icon: '🎵', color: 'bg-black hover:bg-gray-800' },
    { name: 'Snapchat', icon: '👻', color: 'bg-yellow-400 hover:bg-yellow-500' },
    { name: 'Messenger', icon: '💬', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Discord', icon: '🎮', color: 'bg-indigo-500 hover:bg-indigo-600' },
    { name: 'Bluesky', icon: '🦋', color: 'bg-sky-400 hover:bg-sky-500' },
    { name: 'Farcaster', icon: '🟪', color: 'bg-purple-500 hover:bg-purple-600' },
];

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    campaignId: string;
    campaignTitle: string;
};

export default function ShareModal({ isOpen, onClose, campaignId, campaignTitle }: ShareModalProps) {
    const [campaignUrl, setCampaignUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Ensure this only runs on the client-side where `window` is available.
        setCampaignUrl(`${window.location.origin}/campaign/${campaignId}`);
    }, [campaignId]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(campaignUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const getShareLink = (platform: string) => {
        const baseText = `Check out this fundraiser for "${campaignTitle}"`;
        const hashtags = '#fundraising #charity #everybit #crypto';
        const twitterText = encodeURIComponent(`${baseText} ${hashtags} ${campaignUrl}`);
        const basicText = encodeURIComponent(`${baseText}: ${campaignUrl}`);
        
        switch (platform) {
            case 'Facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}`;
            case 'X':
                return `https://twitter.com/intent/tweet?text=${twitterText}`;
            case 'LinkedIn':
                return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(campaignUrl)}&title=${encodeURIComponent(campaignTitle)}&summary=${encodeURIComponent(`Help support this important cause: ${campaignTitle}`)}`;
            case 'WhatsApp':
                return `https://api.whatsapp.com/send?text=${basicText}`;
            case 'Email':
                return `mailto:?subject=${encodeURIComponent(`Support: ${campaignTitle}`)}&body=${encodeURIComponent(`Hi,\n\nI wanted to share this fundraiser with you:\n\n${campaignTitle}\n\n${campaignUrl}\n\nEvery contribution makes a difference!\n\nBest regards`)}`;
            case 'Telegram':
                return `https://t.me/share/url?url=${encodeURIComponent(campaignUrl)}&text=${basicText}`;
            case 'Reddit':
                return `https://www.reddit.com/submit?url=${encodeURIComponent(campaignUrl)}&title=${encodeURIComponent(campaignTitle)}`;
            case 'Pinterest':
                return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(campaignUrl)}&description=${encodeURIComponent(campaignTitle)}`;
            case 'TikTok':
                return `https://www.tiktok.com/share?url=${encodeURIComponent(campaignUrl)}`;
            case 'Snapchat':
                return `https://www.snapchat.com/share?url=${encodeURIComponent(campaignUrl)}`;
            case 'Messenger':
                return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(campaignUrl)}&app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ''}`;
            case 'Bluesky':
                return `https://bsky.app/intent/compose?text=${encodeURIComponent(`${baseText} ${campaignUrl}`)}`;
            case 'Farcaster':
                return `https://warpcast.com/~/compose?text=${encodeURIComponent(campaignTitle)}&embeds[]=${encodeURIComponent(campaignUrl)}`;
            case 'Discord':
                return '#'; // Discord doesn't have a direct share link, we'll copy it.
            default:
                return '#';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl p-6 m-4 w-full max-w-md relative animate-in slide-in-from-bottom-10 fade-in-25">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                
                <h2 className="text-xl font-bold mb-4">Quick share</h2>
                
                <div className="flex items-center space-x-2 mb-6">
                    <input 
                        type="text" 
                        readOnly 
                        value={campaignUrl} 
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                    />
                    <button 
                        onClick={copyToClipboard}
                        className="flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold"
                    >
                        {copied ? (
                            <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-500" />
                        ) : (
                            <ClipboardDocumentIcon className="w-5 h-5" />
                        )}
                        <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>

                <h3 className="text-lg font-bold mb-2">Reach more donors by sharing</h3>
                <p className="text-sm text-gray-500 mb-4">
                    We've written tailored messages and auto-generated posters based on the fundraiser story for you to share.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {socialPlatforms.map(platform => (
                        <a 
                            key={platform.name}
                            href={getShareLink(platform.name)}
                            onClick={(e) => {
                                if (platform.name === 'Discord') {
                                    e.preventDefault();
                                    copyToClipboard();
                                }
                            }}
                            target={platform.name === 'Discord' ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            className={`flex items-center p-3 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 ${platform.color}`}
                        >
                            <span className="text-lg">{platform.icon}</span>
                            <span className="ml-3 font-semibold">{platform.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
} 
'use client';

import { useState, useEffect } from 'react';
import {
    XMarkIcon,
    EnvelopeIcon,
    QrCodeIcon,
    CodeBracketIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import { generateShareUrls, copyToClipboard, trackShareEvent, type LoanShareData } from '@/utils/shareUtils';

const shareOptions = [
    {
        id: 'facebook',
        name: 'Facebook',
        bgColor: 'hover:bg-gray-50',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        )
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        bgColor: 'hover:bg-gray-50',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
        )
    },
    {
        id: 'messenger',
        name: 'Messenger',
        bgColor: 'hover:bg-gray-50',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
                <defs>
                    <radialGradient id="messengerGradient" cx="19.247%" cy="99.465%" r="108.96%">
                        <stop offset="0%" stopColor="#09F"/>
                        <stop offset="60.975%" stopColor="#A033FF"/>
                        <stop offset="93.482%" stopColor="#FF5280"/>
                        <stop offset="100%" stopColor="#FF7061"/>
                    </radialGradient>
                </defs>
                <path fill="url(#messengerGradient)" d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
            </svg>
        )
    },
    {
        id: 'email',
        name: 'Email',
        bgColor: 'hover:bg-gray-50',
        icon: <EnvelopeIcon className="w-6 h-6 text-gray-700" />
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        bgColor: 'hover:bg-gray-50',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        )
    },
    {
        id: 'twitter',
        name: 'X',
        bgColor: 'hover:bg-gray-50',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        )
    },
    {
        id: 'nextdoor',
        name: 'Nextdoor',
        bgColor: 'hover:bg-gray-50',
        icon: (
            <svg className="w-6 h-6" viewBox="0 0 256 256" fill="#8BC740">
                <path d="M128 0C57.308 0 0 57.308 0 128s57.308 128 128 128 128-57.308 128-128S198.692 0 128 0zm64 176c-4.8 11.2-14.4 20.8-25.6 25.6-7.2 3.2-15.2 4.8-23.2 4.8s-16-1.6-23.2-4.8c-11.2-4.8-20.8-14.4-25.6-25.6-3.2-7.2-4.8-15.2-4.8-23.2V128h107.2v24.8c0 8-1.6 16-4.8 23.2zm0-48H64v-48c0-35.2 28.8-64 64-64s64 28.8 64 64v48z"/>
            </svg>
        )
    },
    {
        id: 'qrcode',
        name: 'QR code',
        bgColor: 'hover:bg-gray-50',
        icon: <QrCodeIcon className="w-6 h-6 text-gray-700" />
    },
    {
        id: 'widget',
        name: 'Website widget',
        bgColor: 'hover:bg-gray-50',
        icon: <CodeBracketIcon className="w-6 h-6 text-gray-700" />
    },
    {
        id: 'streaming',
        name: 'Events & streaming',
        bgColor: 'hover:bg-gray-50',
        icon: <VideoCameraIcon className="w-6 h-6 text-gray-700" />
    }
];

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    loan: LoanShareData;
    customMessage?: string;
};

export default function ShareModal({ isOpen, onClose, loan, customMessage }: ShareModalProps) {
    const [loanUrl, setLoanUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLoanUrl(`${window.location.origin}/loan/${loan.id}`);
        }
    }, [loan.id]);

    const handleCopyToClipboard = async () => {
        const success = await copyToClipboard(loanUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            trackShareEvent(loan.id, 'copy_link', 'share');
        }
    };

    const handlePlatformShare = async (platformId: string) => {
        // For now, just handle specific platforms
        if (platformId === 'qrcode' || platformId === 'widget' || platformId === 'streaming') {
            // These would open specific modals/functionality in the future
            console.log(`${platformId} clicked - feature coming soon`);
            return;
        }

        const shareUrls = generateShareUrls(loan, customMessage);
        const shareUrl = shareUrls[platformId];

        if (platformId === 'email') {
            window.location.href = shareUrl;
        } else if (platformId === 'messenger') {
            // Messenger uses fb-messenger:// scheme on mobile, or web fallback
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        } else {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }

        trackShareEvent(loan.id, platformId, 'share');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Quick share</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    {/* URL Copy Section */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-600 mb-2">Your unique link</p>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm text-gray-700 truncate">{loanUrl}</p>
                            </div>
                            <button
                                onClick={handleCopyToClipboard}
                                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-[#2C7A7B] hover:bg-[#2C7A7B] hover:text-white rounded-lg transition-colors border border-[#2C7A7B]"
                            >
                                {copied ? 'Copied!' : 'Copy link'}
                            </button>
                        </div>
                    </div>

                    {/* Share Options Section */}
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">
                            Reach more donors by sharing
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            We've written tailored messages and auto-generated posters based on the fundraiser story for you to share
                        </p>

                        {/* Share Options Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handlePlatformShare(option.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 transition-colors ${option.bgColor}`}
                                >
                                    <div className="flex-shrink-0">
                                        {option.icon}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {option.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

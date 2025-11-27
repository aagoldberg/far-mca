'use client';

import { useState, useEffect } from 'react';
import {
    XMarkIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { generateShareUrls, copyToClipboard, trackShareEvent, type LoanShareData } from '@/utils/shareUtils';

const primaryPlatforms = [
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        brandColor: 'bg-[#25D366] hover:bg-[#20BA56]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
        )
    },
    {
        id: 'facebook',
        name: 'Facebook',
        brandColor: 'bg-[#1877F2] hover:bg-[#1565C0]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        )
    },
    {
        id: 'twitter',
        name: 'X',
        brandColor: 'bg-black hover:bg-gray-900',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        )
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        brandColor: 'bg-[#0A66C2] hover:bg-[#004182]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        )
    }
];

const morePlatforms = [
    {
        id: 'discord',
        name: 'Discord',
        brandColor: 'bg-[#5865F2] hover:bg-[#4752C4]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
        )
    },
    {
        id: 'reddit',
        name: 'Reddit',
        brandColor: 'bg-[#FF4500] hover:bg-[#E63E00]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
        )
    },
    {
        id: 'email',
        name: 'Email',
        brandColor: 'bg-gray-600 hover:bg-gray-700',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
            </svg>
        )
    },
    {
        id: 'telegram',
        name: 'Telegram',
        brandColor: 'bg-[#0088CC] hover:bg-[#006699]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
        )
    },
    {
        id: 'sms',
        name: 'SMS',
        brandColor: 'bg-[#10B981] hover:bg-[#059669]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
            </svg>
        )
    },
    {
        id: 'farcaster',
        name: 'Farcaster',
        brandColor: 'bg-[#855DCD] hover:bg-[#7A56C2]',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 1000 1000" fill="currentColor">
                <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z"/>
                <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                <path d="M675.555 746.667C663.282 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.555V817.778C875.555 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.555Z"/>
            </svg>
        )
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
    const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [showMoreOptions, setShowMoreOptions] = useState(false);

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
        const shareUrls = generateShareUrls(loan, customMessage);
        const shareUrl = shareUrls[platformId];

        if (platformId === 'discord') {
            // Use hero-focused default message for Discord
            const progressEmoji = loan.progressPercentage >= 75 ? '🔥' : loan.progressPercentage >= 50 ? '🎯' : loan.progressPercentage >= 25 ? '✨' : '💚';
            let heroMessage = '';
            if (loan.progressPercentage >= 75) {
                heroMessage = `I'm helping finish funding "${loan.title}" - we're almost there!`;
            } else if (loan.progressPercentage >= 50) {
                heroMessage = `I'm supporting "${loan.title}" and you can too!`;
            } else {
                heroMessage = `Help me make "${loan.title}" happen!`;
            }
            const discordMessage = customMessage || `${progressEmoji} ${heroMessage}\n\n${Math.round(loan.progressPercentage)}% funded • $${loan.totalFunded.toLocaleString()} of $${loan.principal.toLocaleString()} raised\n\nZero-interest community loan. Your share could change everything!`;
            const success = await copyToClipboard(`${discordMessage}\n\n${loanUrl}`);
            if (success) {
                setCopiedPlatform(platformId);
                setTimeout(() => setCopiedPlatform(null), 2000);
            }
        } else if (platformId === 'email' || platformId === 'sms') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }

        trackShareEvent(loan.id, platformId, 'share');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl p-6 m-4 w-full max-w-2xl relative animate-in slide-in-from-bottom-10 fade-in-25 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold mb-5 text-gray-900">Help make this happen</h2>

                {/* OG Card Preview */}
                <div className="mb-5">
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
                        {imageLoading && !imageError && (
                            <div className="w-full h-[315px] bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B9B7F] mx-auto mb-2"></div>
                                    <p className="text-sm text-gray-500">Loading preview...</p>
                                </div>
                            </div>
                        )}
                        {imageError ? (
                            <div className="w-full h-[315px] bg-gray-50 flex items-center justify-center p-6">
                                <div className="text-center">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-500 mb-1">Preview unavailable</p>
                                    <p className="text-xs text-gray-400">Share card will still work when shared</p>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={`/api/og/loan/${loan.id}`}
                                alt="Share preview"
                                className={`w-full h-auto ${imageLoading ? 'hidden' : ''}`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    console.error('[ShareModal] OG image failed to load');
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Impact Message - moved up for prominence */}
                <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 text-center font-semibold">
                        Shared loans get funded 3× faster
                    </p>
                </div>

                {/* URL Copy Section - simplified */}
                <div className="mb-5">
                    <button
                        onClick={handleCopyToClipboard}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-semibold transition-colors gap-2"
                    >
                        {copied ? (
                            <>
                                <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
                                <span className="text-green-600">Link copied!</span>
                            </>
                        ) : (
                            <>
                                <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700">Copy link</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Social Sharing Section */}
                <div className="border-t border-gray-200 pt-5">

                    {/* Primary Share Buttons */}
                    <div className="grid grid-cols-4 gap-3">
                        {primaryPlatforms.map(platform => (
                            <button
                                key={platform.id}
                                onClick={() => handlePlatformShare(platform.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${platform.brandColor} text-white`}
                                title={`Share on ${platform.name}`}
                            >
                                <div className="flex-shrink-0 mb-1.5">
                                    {platform.icon}
                                </div>
                                <span className="text-xs font-medium">
                                    {platform.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* More Options Toggle */}
                    <button
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                        className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-1"
                    >
                        <span>{showMoreOptions ? 'Fewer' : 'More'} options</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* More Platform Options */}
                    {showMoreOptions && (
                        <div className="grid grid-cols-3 gap-3 mt-3 animate-in slide-in-from-top-2 fade-in-50">
                            {morePlatforms.map(platform => (
                                <button
                                    key={platform.id}
                                    onClick={() => handlePlatformShare(platform.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${platform.brandColor} text-white`}
                                    title={`Share on ${platform.name}`}
                                >
                                    <div className="flex-shrink-0 mb-1.5">
                                        {platform.icon}
                                    </div>
                                    <span className="text-xs font-medium">
                                        {platform.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

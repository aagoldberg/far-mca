'use client';

import { useState, useEffect } from 'react';
import {
    XMarkIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { generateShareUrls, copyToClipboard, trackShareEvent, type LoanShareData } from '@/utils/shareUtils';

const socialPlatforms = [
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
        id: 'whatsapp',
        name: 'WhatsApp',
        brandColor: 'bg-[#25D366] hover:bg-[#1EBD5B]',
        icon: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
        )
    },
    {
        id: 'twitter',
        name: 'X',
        brandColor: 'bg-black hover:bg-gray-800',
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
            const success = await copyToClipboard(`${customMessage || `Check out this zero-interest loan!`} ${loanUrl}`);
            if (success) {
                setCopiedPlatform(platformId);
                setTimeout(() => setCopiedPlatform(null), 2000);
            }
        } else if (platformId === 'email') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }

        trackShareEvent(loan.id, platformId, 'share');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl p-6 m-4 w-full max-w-md relative animate-in slide-in-from-bottom-10 fade-in-25">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900">Share Loan</h2>

                {/* Loan Preview */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">{loan.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Borrower: {loan.borrower.slice(0, 6)}...{loan.borrower.slice(-4)}</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium text-[#3B9B7F]">{Math.round(loan.progressPercentage)}% funded</span>
                    </div>
                </div>

                {/* URL Copy Section */}
                <div className="flex items-center space-x-2 mb-6">
                    <input
                        type="text"
                        readOnly
                        value={loanUrl}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B9B7F] focus:border-transparent"
                    />
                    <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-semibold transition-colors"
                    >
                        {copied ? (
                            <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-500" />
                        ) : (
                            <ClipboardDocumentIcon className="w-5 h-5" />
                        )}
                        <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>

                <h3 className="text-lg font-bold mb-2 text-gray-900">Share on social media</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Help spread the word and bring more supporters to this loan
                </p>

                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {socialPlatforms.map(platform => (
                        <button
                            key={platform.id}
                            onClick={() => handlePlatformShare(platform.id)}
                            className={`flex items-center p-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md ${platform.brandColor} text-white`}
                        >
                            <div className="flex-shrink-0">
                                {platform.icon}
                            </div>
                            <span className="ml-3 font-semibold">
                                {platform.id === 'discord' && copiedPlatform === 'discord' ? 'Copied!' : platform.name}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                    Share tracking helps improve loan reach
                </div>
            </div>
        </div>
    );
}

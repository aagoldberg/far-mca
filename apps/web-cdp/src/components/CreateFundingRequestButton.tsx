"use client";

import { useCDPAuth } from '@/hooks/useCDPAuth';
import Link from 'next/link';

export const CreateFundingRequestButton = () => {
    const { ready, authenticated } = useCDPAuth();

    if (!ready || !authenticated) {
        return null;
    }

    return (
        <Link
            href="/request-funding"
            className="rounded-xl bg-white hover:bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-20"
        >
            Request Funding
        </Link>
    )
} 
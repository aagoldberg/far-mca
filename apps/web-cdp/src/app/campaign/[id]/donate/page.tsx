"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ContributeForm from '@/components/ContributeForm';
import { useCampaign } from '@/hooks/useCampaign';

export default function DonatePage() {
    const params = useParams<{ id: string }>();
    const campaignNumericId = params.id;
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { campaign, loading, error, refetch } = useCampaign(campaignNumericId);

    const handleSuccess = (message: string) => {
        console.log("Donation successful:", message);
        setSuccessMessage(message);
        setErrorMessage(null);
        refetch();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            setSuccessMessage(null);
        }, 5000);
    };

    const handleError = (error: string) => {
        console.error("Donation Error:", error);
        setErrorMessage(error);
        setSuccessMessage(null);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-600">Loading campaign details...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center text-red-500">
                    <p>Error loading campaign: {error}</p>
                </div>
            </div>
        );
    }
    
    if (!campaign && !loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center">
                    <p>Campaign not found.</p>
                </div>
            </div>
        );
    }
    
    // Still loading but campaign is null, show loading state
    if (!campaign) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-600">Loading campaign details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3">
                    You are donating to &quot;{campaign.metadata?.title || 'this campaign'}&quot;
                </h1>
                <p className="text-lg text-gray-600">
                    Thank you for your generosity. Every bit helps.
                </p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-green-800">Success!</h3>
                            <p className="text-sm text-green-700 mt-1">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <ContributeForm
                campaignNumericId={campaignNumericId}
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </div>
    );
} 
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCDPAuth } from '@/hooks/useCDPAuth';
import { uploadJson, uploadImage } from '@/utils/storage';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CAMPAIGN_FACTORY_ADDRESS } from '@/constants';
import { campaignFactoryAbi } from '@/abi/CampaignFactory';
import ShopifyConnectButton from './ShopifyConnectButton';
import CreditScoreCard from './CreditScoreCard';
import CreditScoreDisplay from './CreditScoreDisplay';
import { TrophyIcon } from '@heroicons/react/24/outline';

const USDC_DECIMALS = 6;

export const CreateFundingRequestForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ready, authenticated, user } = useCDPAuth();
  const { address } = useAccount();
  
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    fundingAmount: '',
    revenueShare: '5', // Default 5%
    repaymentCap: '1.5', // Default 1.5x
    monthlyRevenue: '',
    useOfFunds: '',
    image: null as File | null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [creditScore, setCreditScore] = useState<any>(null);
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [showCreditScoring, setShowCreditScoring] = useState(false);

  const { data: hash, writeContract } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  // Handle credit score from URL parameters (after Shopify OAuth redirect)
  useEffect(() => {
    const creditScoreParam = searchParams.get('creditScore');
    const shopifyConnectedParam = searchParams.get('shopifyConnected');
    
    if (creditScoreParam) {
      try {
        const parsedCreditScore = JSON.parse(creditScoreParam);
        setCreditScore(parsedCreditScore);
        setShopifyConnected(shopifyConnectedParam === 'true');
        
        // Auto-populate form with credit score data
        if (parsedCreditScore.revenueInDollars) {
          setFormData(prev => ({
            ...prev,
            monthlyRevenue: parsedCreditScore.revenueInDollars.toString()
          }));
        }
      } catch (error) {
        console.error('Failed to parse credit score:', error);
      }
    }
  }, [searchParams]);

  const handleCreditTermsAccepted = (terms: any) => {
    setFormData(prev => ({
      ...prev,
      revenueShare: (terms.paybackPercentage * 100).toString(),
      repaymentCap: terms.riskLevel === 'low' ? '1.5' : '2.0'
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Upload image if provided
      let imageCID = '';
      if (formData.image) {
        setUploadProgress(25);
        imageCID = await uploadImage(formData.image);
        setUploadProgress(50);
      }

      // Create metadata object
      const metadata = {
        title: formData.businessName,
        description: formData.description,
        image: imageCID ? `ipfs://${imageCID}` : '',
        fundingAmount: formData.fundingAmount,
        revenueShare: parseFloat(formData.revenueShare),
        repaymentCap: parseFloat(formData.repaymentCap),
        monthlyRevenue: formData.monthlyRevenue,
        useOfFunds: formData.useOfFunds,
        creator: address,
        timestamp: new Date().toISOString(),
        // Include credit score data if available
        creditScore: creditScore ? {
          score: creditScore.score,
          riskLevel: creditScore.riskLevel,
          shopifyVerified: shopifyConnected,
          shop: creditScore.shop,
          verificationTimestamp: creditScore.timestamp
        } : null,
      };

      setUploadProgress(75);
      
      // Upload metadata to IPFS
      const metadataCID = await uploadJson(metadata);
      setUploadProgress(90);

      // Create campaign on blockchain
      const goalAmountWei = parseUnits(formData.fundingAmount, USDC_DECIMALS);
      
      writeContract({
        address: CAMPAIGN_FACTORY_ADDRESS,
        abi: campaignFactoryAbi,
        functionName: 'createCampaign',
        args: [
          goalAmountWei,
          `ipfs://${metadataCID}`
        ],
      });

      setUploadProgress(100);
    } catch (error) {
      console.error('Error creating funding request:', error);
      alert('Failed to create funding request. Please try again.');
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Handle successful transaction
  if (isConfirmed) {
    router.push('/my-advances');
  }

  if (!ready) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!authenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please connect your wallet to create a funding request</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Business Funding</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credit Scoring Section */}
        {!creditScore && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Credit Verification (Optional)</h3>
              <button
                type="button"
                onClick={() => setShowCreditScoring(!showCreditScoring)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showCreditScoring ? 'Hide' : 'Get Better Terms'}
              </button>
            </div>
            
            {showCreditScoring && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <TrophyIcon className="h-6 w-6 text-blue-600 mt-1" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Connect Your Shopify Store for Better Terms
                    </h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Get pre-approved with lower rates by verifying your revenue through Shopify.
                      Your credit score will be calculated based on real sales data.
                    </p>
                    <ShopifyConnectButton
                      onConnectionSuccess={(score) => setCreditScore(score)}
                      onConnectionError={(error) => console.error('Shopify connection failed:', error)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Credit Score Display */}
        {creditScore && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Credit Assessment Results</h3>
            <CreditScoreCard
              creditScore={creditScore}
              requestedAmount={parseFloat(formData.fundingAmount) || 0}
              onTermsAccepted={handleCreditTermsAccepted}
            />
          </div>
        )}

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
          
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Business Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your business and what makes it unique"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Business Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-md" />
            )}
          </div>
        </div>

        {/* Funding Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Funding Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fundingAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Funding Amount (USDC) *
              </label>
              <input
                type="number"
                id="fundingAmount"
                name="fundingAmount"
                value={formData.fundingAmount}
                onChange={handleInputChange}
                required
                min="1000"
                max="100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10000"
              />
            </div>

            <div>
              <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Revenue (USD) *
              </label>
              <input
                type="number"
                id="monthlyRevenue"
                name="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleInputChange}
                required
                min="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="revenueShare" className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Share (%) *
              </label>
              <select
                id="revenueShare"
                name="revenueShare"
                value={formData.revenueShare}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3">3% - Low Risk</option>
                <option value="5">5% - Standard</option>
                <option value="8">8% - Growth Stage</option>
                <option value="12">12% - High Growth</option>
              </select>
            </div>

            <div>
              <label htmlFor="repaymentCap" className="block text-sm font-medium text-gray-700 mb-2">
                Repayment Cap (Multiple) *
              </label>
              <select
                id="repaymentCap"
                name="repaymentCap"
                value={formData.repaymentCap}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1.2">1.2x - Conservative</option>
                <option value="1.5">1.5x - Standard</option>
                <option value="2.0">2.0x - Growth</option>
                <option value="3.0">3.0x - High Growth</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="useOfFunds" className="block text-sm font-medium text-gray-700 mb-2">
              Use of Funds *
            </label>
            <textarea
              id="useOfFunds"
              name="useOfFunds"
              value={formData.useOfFunds}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="How will you use the funding? (e.g., inventory, marketing, equipment)"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting || isConfirming}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? `Creating... ${uploadProgress}%` : 
             isConfirming ? 'Confirming Transaction...' : 
             'Create Funding Request'}
          </button>
        </div>
      </form>
    </div>
  );
};
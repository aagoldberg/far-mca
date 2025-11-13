"use client";

import { useState, FormEvent, useEffect, useCallback, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { campaignFactoryABI } from "@/abi/CampaignFactory";
import { parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import Link from "next/link";
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CAMPAIGN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS as `0x${string}`;
const USDC_DECIMALS = 6;
const ASPECT_RATIO = 1.91 / 1;
const MIN_DIMENSION = 150;

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}

export function CreateCampaignForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [duration, setDuration] = useState("7"); // Default to 7 days
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [newCampaignId, setNewCampaignId] = useState<string | null>(null);
  const router = useRouter();

  const { user, login } = usePrivy();
  const { address: connectedAddress, isConnected } = useAccount();

  const {
    writeContract: createCampaignWrite,
    data: writeTxHash,
    reset: resetWriteContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error('Contract write error:', error);
        // Parse and display user-friendly error message
        let errorMessage = 'Failed to create fundraiser. ';
        
        if (error.message.includes('insufficient funds')) {
          errorMessage += 'You need more ETH for gas fees. Use the faucet in the top right.';
        } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
          errorMessage += 'Transaction was cancelled.';
        } else if (error.message.includes('gas')) {
          errorMessage += 'Gas estimation failed. Try reducing image size or simplifying description.';
        } else if (error.message.includes('network') || error.message.includes('chain')) {
          errorMessage += 'Please switch to Base Sepolia network in your wallet.';
        } else {
          errorMessage += 'Please try again with a smaller image or simpler description.';
        }
        
        setMessage(errorMessage);
        setIsError(true);
      }
    }
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
    error: confirmationError,
  } = useWaitForTransactionReceipt({
    hash: writeTxHash,
  });

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image is too large. Please use an image under 2MB.');
        setIsError(true);
        event.target.value = ''; // Reset input
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file (JPG, PNG, etc.)');
        setIsError(true);
        event.target.value = ''; // Reset input
        return;
      }
      
      setCrop(undefined); // Reset crop on new image
      setImgSrc(URL.createObjectURL(file));
    }
  };

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setMessage("");
      setIsError(false);
      setTransactionHash(undefined);
      setNewCampaignId(null);
      resetWriteContract();

      if (!isConnected || !connectedAddress) {
        setMessage("Please connect your wallet.");
        setIsError(true);
        return;
      }

      if (!title.trim() || !description.trim() || !imgSrc) {
        setMessage("Title, description, and an image are required.");
        setIsError(true);
        return;
      }
      if (!completedCrop || !imgRef.current) {
        setMessage("Please select and crop the image.");
        setIsError(true);
        return;
      }
      const goalAmountNum = parseFloat(goalAmount);
      if (isNaN(goalAmountNum) || goalAmountNum <= 0) {
        setMessage("Goal amount must be a positive number.");
        setIsError(true);
        return;
      }
      const durationDays = parseInt(duration, 10);
      if (isNaN(durationDays) || durationDays <= 0) {
        setMessage("Duration must be a positive number of days.");
        setIsError(true);
        return;
      }

      try {
        const croppedImageFile = await getCroppedImg(imgRef.current, completedCrop, 'croppedImage.jpg');
        
        setMessage("Step 1/3: Uploading image to IPFS...");
        const imageFormData = new FormData();
        imageFormData.append("file", croppedImageFile);
        const imageUploadRes = await fetch("/api/uploadImage", {
          method: "POST",
          body: imageFormData,
        });
        if (!imageUploadRes.ok) {
          const errorData = await imageUploadRes.json();
          throw new Error(`Image upload failed: ${errorData.details || errorData.error}`);
        }
        const imageUploadData = await imageUploadRes.json();
        const imageCID = imageUploadData.cid;
        setMessage("Step 1/3: Image uploaded successfully!");

        setMessage("Step 2/3: Uploading campaign metadata...");
        const metadata = {
          title,
          description,
          image: imageCID,
        };
        const metadataUploadRes = await fetch("/api/uploadJson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metadata),
        });
        if (!metadataUploadRes.ok) {
            const errorData = await metadataUploadRes.json();
            throw new Error(`Metadata upload failed: ${errorData.details || errorData.error}`);
        }
        const metadataUploadData = await metadataUploadRes.json();
        const metadataURI = metadataUploadData.cid;
        setMessage("Step 2/3: Metadata uploaded successfully!");

        setMessage("Step 3/3: Waiting for transaction confirmation...");
        
        const goalAmountBigInt = parseUnits(goalAmount, USDC_DECIMALS);
        const deadlineTimestamp = Math.floor(Date.now() / 1000) + (parseInt(duration, 10) * 24 * 60 * 60);

        console.log("Creating campaign with params:", {
          goalAmountBigInt: goalAmountBigInt.toString(),
          deadlineTimestamp,
          metadataURI,
          factoryAddress: CAMPAIGN_FACTORY_ADDRESS,
          currentTime: Math.floor(Date.now() / 1000)
        });

        // Write to contract (not async - wagmi handles this internally)
        createCampaignWrite({
          address: CAMPAIGN_FACTORY_ADDRESS,
          abi: campaignFactoryABI,
          functionName: "createCampaign",
          args: [goalAmountBigInt, BigInt(deadlineTimestamp), metadataURI],
          chainId: baseSepolia.id,
        });

      } catch (error: any) {
        console.error("Campaign creation failed:", error);
        setMessage(`Error: ${error.message}`);
        setIsError(true);
      }
    },
    [
      title,
      description,
      goalAmount,
      duration,
      imgSrc,
      completedCrop,
      connectedAddress,
      isConnected,
      createCampaignWrite,
      resetWriteContract,
    ]
  );

  useEffect(() => {
    if (isConfirming) {
        setMessage("Processing transaction on the blockchain...");
    } else if (isConfirmed && receipt) {
      setTransactionHash(receipt.transactionHash);

      const eventTopic = "0x1fb58c3a18a6b912649c8896f3cba262444a97b56c86fa5d8086e0284a25008c"; // CampaignCreated event signature
      const campaignCreatedLog = receipt.logs.find(
        (log) =>
          log.topics[0] === eventTopic &&
          log.address.toLowerCase() ===
            CAMPAIGN_FACTORY_ADDRESS.toLowerCase()
      );

      if (campaignCreatedLog && campaignCreatedLog.topics[1]) {
        // topics[1] contains the campaign ID (uint256)
        const campaignId = parseInt(campaignCreatedLog.topics[1], 16).toString();
        setNewCampaignId(campaignId);
        setMessage("Your campaign has been successfully created!");
      } else {
        setMessage(
          "Campaign created, but we could not find the campaign address. Please check a block explorer."
        );
      }
    } else if (writeError) {
        setMessage(`Error: ${writeError.message}`);
        setIsError(true);
    } else if (confirmationError) {
        setMessage(`Error: ${confirmationError.message}`);
        setIsError(true);
    }
  }, [isConfirming, isConfirmed, receipt, writeError, confirmationError]);

  const handleCreateAnother = () => {
    setTitle("");
    setDescription("");
    setGoalAmount("");
    setDuration("7");
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setMessage("");
    setIsError(false);
    setTransactionHash(undefined);
    setNewCampaignId(null);
    resetWriteContract();
  };

  if (!user) {
    return (
      <div className="text-center">
        <p className="mb-4">You must be logged in to create a fundraiser.</p>
        <button
          onClick={login}
          className="bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition"
        >
          Log In
        </button>
      </div>
    );
  }

    return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isConfirmed && transactionHash ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Your fundraiser is live!</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-green-800 font-medium break-words">
                Transaction Hash: <a href={`https://sepolia.basescan.org/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">{transactionHash}</a>
              </p>
              {newCampaignId && (
                <p className="text-green-800 font-medium mt-2 break-words">
                  Campaign ID: <Link href={`/campaign/${newCampaignId}`}><span className="underline hover:text-green-900">#{newCampaignId}</span></Link>
                </p>
              )}
            </div>
            <div className="flex justify-center space-x-4">
             <button
                type="button"
                onClick={handleCreateAnother}
                className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
             >
                Create Another Fundraiser
             </button>
              {newCampaignId && (
                <Link href={`/campaign/${newCampaignId}`} passHref>
                  <span className="w-full block text-center bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition cursor-pointer">
                    View Your Page
                  </span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Fundraiser Title
          </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              required
            />
        </div>

            {imgSrc && (
                <div className="my-4">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}
                    >
                        <img 
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc} 
                            onLoad={onImageLoad}
                            style={{ maxHeight: '400px' }}
                        />
                    </ReactCrop>
                </div>
            )}
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image (1.91:1 aspect ratio)
                </label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                        Goal Amount (USDC)
                    </label>
                    <input
                        type="number"
                        id="goalAmount"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                        required
                        min="1"
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (days)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                        required
                        min="1"
                    />
        </div>
      </div>

        <button
          type="submit"
          disabled={isWritePending || isConfirming}
          className="w-full bg-[#29738F] hover:bg-[#234A5B] text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 disabled:bg-gray-400"
        >
          {isWritePending || isConfirming ? 'Creating...' : 'Create Fundraiser'}
        </button>
            {message && (
              <div className={`mt-4 p-4 rounded-lg text-center ${isError ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm font-medium ${isError ? 'text-red-800' : 'text-blue-800'}`}>
                  {message}
                </p>
                {isError && message.includes('faucet') && (
                  <p className="text-xs text-red-600 mt-2">
                    💡 Tip: Check your Test Balances in the top right corner
                  </p>
                )}
                {isError && message.includes('image') && (
                  <p className="text-xs text-red-600 mt-2">
                    💡 Tip: Try compressing your image at tinypng.com first
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </form>
      </div>
  );
} 
import { useState } from 'react';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';

// Entry Point v0.6 address (standard)
const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

// Base Sepolia Pimlico endpoint
const PIMLICO_RPC_URL = `https://api.pimlico.io/v2/84532/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`;

interface UserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  paymasterAndData: string;
}

interface Use4337TransactionResult {
  executeTransaction: (params: {
    smartAccountAddress: string;
    targetAddress: string;
    abi: any[];
    functionName: string;
    args: any[];
    value?: bigint;
  }) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function use4337Transaction(): Use4337TransactionResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = async (params: {
    smartAccountAddress: string;
    targetAddress: string;
    abi: any[];
    functionName: string;
    args: any[];
    value?: bigint;
  }): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔵 Starting 4337 transaction with params:', params);

      // 1. Encode the target function call
      const targetCallData = encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      });

      console.log('📝 Target call data:', targetCallData);

      // 2. Build UserOperation (assuming simple execute(target, value, data) account)
      // Note: This is a simplified version - real implementation needs account-specific callData
      const userOp: Partial<UserOperation> = {
        sender: params.smartAccountAddress,
        nonce: '0x0', // Will be fetched from bundler
        initCode: '0x', // Assuming account is already deployed
        callData: targetCallData, // Simplified - real implementation needs account wrapper
        callGasLimit: '0x0',
        verificationGasLimit: '0x0',
        preVerificationGas: '0x0',
        maxFeePerGas: '0x0',
        maxPriorityFeePerGas: '0x0',
        paymasterAndData: '0x',
      };

      console.log('📋 Initial UserOp:', userOp);

      // 3. Get gas estimation from Pimlico
      const estimationResponse = await fetch(PIMLICO_RPC_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_estimateUserOperationGas',
          params: [userOp, ENTRY_POINT_ADDRESS]
        })
      });

      const estimation = await estimationResponse.json();
      console.log('⛽ Gas estimation response:', estimation);

      if (estimation.error) {
        throw new Error(`Gas estimation failed: ${estimation.error.message}`);
      }

      const { preVerificationGas, verificationGasLimit, callGasLimit } = estimation.result;

      // 4. Get gas prices
      const gasPriceResponse = await fetch(PIMLICO_RPC_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'pimlico_getUserOperationGasPrice',
          params: []
        })
      });

      const gasPrice = await gasPriceResponse.json();
      console.log('💰 Gas price response:', gasPrice);

      if (gasPrice.error) {
        throw new Error(`Gas price fetch failed: ${gasPrice.error.message}`);
      }

      const { maxFeePerGas, maxPriorityFeePerGas } = gasPrice.result;

      // 5. Build final UserOperation
      const finalUserOp: UserOperation = {
        ...userOp as UserOperation,
        preVerificationGas,
        verificationGasLimit,
        callGasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
      };

      console.log('✅ Final UserOp:', finalUserOp);

      // 6. Send UserOperation
      const sendResponse = await fetch(PIMLICO_RPC_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'eth_sendUserOperation',
          params: [finalUserOp, ENTRY_POINT_ADDRESS]
        })
      });

      const sendResult = await sendResponse.json();
      console.log('🚀 Send response:', sendResult);

      if (sendResult.error) {
        throw new Error(`Transaction failed: ${sendResult.error.message}`);
      }

      const userOpHash = sendResult.result;
      console.log('🎯 UserOp hash:', userOpHash);

      return userOpHash;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ 4337 transaction failed:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeTransaction,
    isLoading,
    error
  };
}
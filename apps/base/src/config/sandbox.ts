// Unified Sandbox Configuration for Payment Providers

export const isSandboxMode = (): boolean => {
  return process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';
};

export const sandboxConfig = {
  // Provider-specific sandbox settings
  providers: {
    coinbase: {
      skipRedirect: true,        // Don't redirect to Coinbase
      mockDelay: 2000,          // Simulate processing time
      autoComplete: true,       // Auto-complete payment flow
    },
    privy: {
      useTestAccounts: process.env.NEXT_PUBLIC_PRIVY_TEST_ACCOUNTS === 'true',
      mockFunding: true,        // Simulate wallet funding
      mockDelay: 2500,         // Simulate funding time
    },
  },
  
  // Shared sandbox features
  features: {
    showBanner: true,           // Display sandbox mode indicator
    showTransactionLogs: true,  // Log mock transactions to console
    allowFailureSimulation: true, // Enable error testing
  },
  
  // Test data
  testData: {
    // Sample donation amounts
    amounts: [5, 10, 25, 50, 100],
    
    // Mock transaction responses
    mockTransaction: {
      hash: () => '0x' + Math.random().toString(16).substring(2).padEnd(64, '0'),
      blockNumber: 12345678,
      status: 'success',
    },
    
    // Test user credentials (for Privy test accounts)
    testCredentials: {
      email: 'test+sandbox@privy.io',
      phone: '+1 555 555 0000',
      otp: '123456',
    },
  },
  
  // Sandbox UI messages
  messages: {
    banner: '🧪 Sandbox Mode Active - No real transactions will be processed',
    paymentSuccess: '[SANDBOX] Payment simulated successfully',
    paymentError: '[SANDBOX] Payment simulation failed (test error)',
    fundingSuccess: '[SANDBOX] Wallet funded with test USDC',
  },
};

// Helper to get provider-specific sandbox config
export const getProviderSandboxConfig = (provider: 'coinbase' | 'privy') => {
  if (!isSandboxMode()) return null;
  
  return {
    ...sandboxConfig.providers[provider],
    ...sandboxConfig.features,
    testData: sandboxConfig.testData,
  };
};

// Helper to generate mock transaction result
export const generateMockTransaction = (amount: number, provider: string) => {
  if (!isSandboxMode()) return null;
  
  return {
    transactionHash: sandboxConfig.testData.mockTransaction.hash(),
    amount: amount,
    provider: provider,
    timestamp: Date.now(),
    status: 'success',
    message: sandboxConfig.messages.paymentSuccess,
  };
};

// Helper to simulate payment delay
export const simulateSandboxDelay = async (provider: 'coinbase' | 'privy') => {
  if (!isSandboxMode()) return;
  
  const delay = sandboxConfig.providers[provider].mockDelay;
  await new Promise(resolve => setTimeout(resolve, delay));
};

// Helper to determine if should simulate failure (for testing)
export const shouldSimulateFailure = (): boolean => {
  if (!isSandboxMode() || !sandboxConfig.features.allowFailureSimulation) {
    return false;
  }
  
  // 5% chance of failure in sandbox mode for testing
  return Math.random() < 0.05;
};
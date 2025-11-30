import type { 
  IPaymentProvider, 
  PaymentParams, 
  PaymentResult, 
  PaymentMethod,
  SandboxConfig 
} from '../types';

export class PrivyProvider implements IPaymentProvider {
  name = 'privy' as const;
  displayName = 'Privy Funding';
  supportedMethods: PaymentMethod[] = ['card', 'exchange'];
  
  private fundingEnabled: boolean;
  private sandboxMode: boolean;
  private testAccountsEnabled: boolean;
  
  constructor() {
    this.fundingEnabled = process.env.NEXT_PUBLIC_PRIVY_FUNDING_ENABLED !== 'false';
    this.sandboxMode = process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';
    this.testAccountsEnabled = process.env.NEXT_PUBLIC_PRIVY_TEST_ACCOUNTS === 'true';
  }
  
  async initiatePayment(params: PaymentParams): Promise<PaymentResult> {
    const { method, campaignAddress, fiatAmount, onSuccess, onError } = params;
    
    if (!this.isAvailable()) {
      const error = 'Privy funding is not available';
      onError?.(error);
      return {
        success: false,
        error,
        provider: this.name,
      };
    }
    
    try {
      // In sandbox mode with test accounts, simulate the payment
      if (this.sandboxMode && this.testAccountsEnabled) {
        return await this.simulatePayment(params);
      }
      
      // For production, we'll trigger Privy's fundWallet flow
      // This will be called from a React component that has access to the hook
      // The actual implementation will be in PrivyFundingButton.tsx
      
      // Return a pending status - the actual funding will be handled by the component
      return {
        success: true,
        message: 'Funding flow initiated',
        provider: this.name,
      };
    } catch (error: any) {
      const errorMsg = error.message || 'Funding initiation failed';
      onError?.(errorMsg);
      
      return {
        success: false,
        error: errorMsg,
        provider: this.name,
      };
    }
  }
  
  private async simulatePayment(params: PaymentParams): Promise<PaymentResult> {
    const { method, fiatAmount, onSuccess } = params;
    
    // Simulate processing delay based on method
    const delay = method === 'card' ? 2500 : 1500;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Generate mock transaction hash
    const mockTxHash = '0x' + Math.random().toString(16).substring(2).padEnd(64, '0');
    
    // Simulate funding the wallet and then making the donation
    onSuccess?.(`[SANDBOX] Wallet funded with $${fiatAmount} USDC via ${method}`);
    
    return {
      success: true,
      transactionHash: mockTxHash as `0x${string}`,
      message: `Sandbox: Funded wallet and donated $${fiatAmount}`,
      provider: this.name,
    };
  }
  
  isAvailable(): boolean {
    return this.fundingEnabled;
  }
  
  isMethodSupported(method: PaymentMethod): boolean {
    // Privy funding supports card and exchange, but not direct wallet (that's separate)
    return this.supportedMethods.includes(method);
  }
  
  isSandboxMode(): boolean {
    return this.sandboxMode;
  }
  
  getSandboxConfig(): SandboxConfig | null {
    if (!this.sandboxMode) return null;
    
    return {
      enabled: true,
      skipRedirects: true,
      autoApprove: this.testAccountsEnabled,
      mockDelay: 2000,
      testCredentials: this.testAccountsEnabled ? {
        email: 'test+XXXX@privy.io',
        phone: '+1 555 555 XXXX',
      } : undefined,
    };
  }
}
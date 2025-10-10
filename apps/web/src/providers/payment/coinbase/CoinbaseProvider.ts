import { generateOnRampURL } from '@coinbase/cbpay-js';
import type { 
  IPaymentProvider, 
  PaymentParams, 
  PaymentResult, 
  PaymentMethod,
  SandboxConfig 
} from '../types';

export class CoinbaseProvider implements IPaymentProvider {
  name = 'coinbase' as const;
  displayName = 'Coinbase Pay';
  supportedMethods: PaymentMethod[] = ['card', 'exchange'];
  
  private appId: string | undefined;
  private sandboxMode: boolean;
  
  constructor() {
    this.appId = process.env.NEXT_PUBLIC_COINBASE_APP_ID;
    this.sandboxMode = process.env.NEXT_PUBLIC_COINBASE_MOCK_MODE === 'true' ||
                       process.env.NEXT_PUBLIC_SANDBOX_MODE === 'true';
  }
  
  async initiatePayment(params: PaymentParams): Promise<PaymentResult> {
    const { method, campaignAddress, fiatAmount, onSuccess, onError } = params;
    
    if (!this.isAvailable()) {
      const error = 'Coinbase Pay is not configured';
      onError?.(error);
      return {
        success: false,
        error,
        provider: this.name,
      };
    }
    
    try {
      // In sandbox mode, simulate the payment
      if (this.sandboxMode) {
        return await this.simulatePayment(params);
      }
      
      // Ensure we're running in browser
      if (typeof window === 'undefined') {
        throw new Error('Payment initiation requires browser environment');
      }
      
      // Generate OnRamp URL based on payment method
      const onrampUrl = generateOnRampURL({
        appId: this.appId!,
        addresses: {
          [campaignAddress]: ['base-sepolia']
        },
        assets: ['USDC'],
        defaultAsset: 'USDC',
        defaultNetwork: 'base-sepolia',
        presetFiatAmount: fiatAmount,
        fiatCurrency: 'USD',
        defaultExperience: 'buy',
        defaultPaymentMethod: method === 'card' ? 'CARD' : 'CRYPTO_ACCOUNT',
        redirectUrl: `${window.location.origin}${window.location.pathname}?success=true&provider=coinbase`
      });
      
      // Redirect to Coinbase OnRamp
      window.location.href = onrampUrl;
      
      onSuccess?.('Redirecting to Coinbase Pay...');
      
      return {
        success: true,
        message: 'Redirecting to payment processor',
        provider: this.name,
      };
    } catch (error: any) {
      const errorMsg = error.message || 'Payment initiation failed';
      onError?.(errorMsg);
      
      return {
        success: false,
        error: errorMsg,
        provider: this.name,
      };
    }
  }
  
  private async simulatePayment(params: PaymentParams): Promise<PaymentResult> {
    const { onSuccess } = params;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock transaction hash
    const mockTxHash = '0x' + Math.random().toString(16).substring(2).padEnd(64, '0');
    
    onSuccess?.(`[SANDBOX] Payment simulated successfully`);
    
    return {
      success: true,
      transactionHash: mockTxHash as `0x${string}`,
      message: 'Sandbox payment completed',
      provider: this.name,
    };
  }
  
  isAvailable(): boolean {
    return !!this.appId;
  }
  
  isMethodSupported(method: PaymentMethod): boolean {
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
      autoApprove: true,
      mockDelay: 2000,
    };
  }
}
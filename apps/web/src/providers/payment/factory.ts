import { IPaymentProvider, ProviderName } from './types';
import { CoinbaseProvider } from './coinbase/CoinbaseProvider';
import { PrivyProvider } from './privy/PrivyProvider';

export class PaymentProviderFactory {
  private static instance: IPaymentProvider | null = null;
  
  static getProvider(providerName?: ProviderName): IPaymentProvider {
    // Use cached instance if available and matches requested provider
    if (this.instance && (!providerName || this.instance.name === providerName)) {
      return this.instance;
    }
    
    // Determine provider from environment or parameter
    const selectedProvider = providerName || 
      (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as ProviderName) || 
      'coinbase'; // Default to coinbase for backwards compatibility
    
    // Create the appropriate provider
    switch (selectedProvider) {
      case 'privy':
        this.instance = new PrivyProvider();
        break;
      case 'coinbase':
      default:
        this.instance = new CoinbaseProvider();
        break;
    }
    
    return this.instance;
  }
  
  static reset(): void {
    this.instance = null;
  }
  
  static getCurrentProviderName(): ProviderName {
    return this.instance?.name || 
      (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as ProviderName) || 
      'coinbase';
  }
  
  static isSandboxMode(): boolean {
    const provider = this.getProvider();
    return provider.isSandboxMode();
  }
}
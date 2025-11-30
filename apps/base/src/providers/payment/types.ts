// Payment provider types and interfaces

export type PaymentMethod = 'card' | 'exchange' | 'wallet';
export type ProviderName = 'coinbase' | 'privy';

export interface PaymentParams {
  method: PaymentMethod;
  campaignAddress: `0x${string}`;
  campaignNumericId: string;
  fiatAmount: number;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  message?: string;
  error?: string;
  provider: ProviderName;
}

export interface IPaymentProvider {
  name: ProviderName;
  displayName: string;
  supportedMethods: PaymentMethod[];
  
  // Core payment initiation
  initiatePayment(params: PaymentParams): Promise<PaymentResult>;
  
  // Provider availability checks
  isAvailable(): boolean;
  isMethodSupported(method: PaymentMethod): boolean;
  
  // Sandbox/test mode
  isSandboxMode(): boolean;
  getSandboxConfig(): SandboxConfig | null;
  
  // UI components (provider-specific buttons)
  getPaymentButton?: (props: PaymentButtonProps) => React.ReactElement | null;
}

export interface PaymentButtonProps {
  method: PaymentMethod;
  campaignAddress: `0x${string}`;
  campaignNumericId: string;
  fiatAmount: number;
  disabled?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export interface SandboxConfig {
  enabled: boolean;
  skipRedirects: boolean;
  autoApprove: boolean;
  mockDelay: number;
  testCredentials?: {
    email?: string;
    phone?: string;
  };
}

export interface PaymentProviderConfig {
  provider: ProviderName;
  sandbox?: boolean;
  coinbase?: {
    appId?: string;
    apiKey?: string;
  };
  privy?: {
    fundingEnabled?: boolean;
    testAccountsEnabled?: boolean;
  };
}
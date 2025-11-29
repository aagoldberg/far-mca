// types/applepay.d.ts

interface ApplePaySession {
    new(version: number, request: ApplePayJS.ApplePayPaymentRequest): ApplePayJS.ApplePaySession;
    canMakePayments(): boolean;
    canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
    supportsVersion(version: number): boolean;
    STATUS_SUCCESS: number;
    STATUS_FAILURE: number;
    STATUS_INVALID_BILLING_POSTAL_ADDRESS: number;
    STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: number;
    STATUS_INVALID_SHIPPING_CONTACT: number;
    STATUS_PIN_REQUIRED: number;
    STATUS_PIN_INCORRECT: number;
    STATUS_PIN_LOCKOUT: number;
  }
  
  declare namespace ApplePayJS {
    interface ApplePayPaymentRequest {
      countryCode: string;
      currencyCode: string;
      supportedNetworks: string[];
      merchantCapabilities: string[];
      total: ApplePayLineItem;
    }
  
    interface ApplePaySession {
      onvalidatemerchant: ((event: ApplePayJS.ApplePayValidateMerchantEvent) => void) | null;
      onpaymentauthorized: ((event: ApplePayJS.ApplePayPaymentAuthorizedEvent) => void) | null;
      oncancel: ((event: Event) => void) | null;
      begin(): void;
      completeMerchantValidation(merchantSession: any): void;
      completePayment(status: number): void;
    }
  
    interface ApplePayValidateMerchantEvent extends Event {
      validationURL: string;
    }
  
    interface ApplePayPaymentAuthorizedEvent extends Event {
      payment: ApplePayPayment;
    }
  
    interface ApplePayPayment {
      token: ApplePayPaymentToken;
    }
  
    interface ApplePayPaymentToken {
      paymentData: object;
      paymentMethod: ApplePayPaymentMethod;
      transactionIdentifier: string;
    }
  
    interface ApplePayPaymentMethod {
      displayName: string;
      network: string;
      type: string;
    }
  
    interface ApplePayLineItem {
      label: string;
      amount: string;
    }
  }
  
  interface Window {
    ApplePaySession: ApplePaySession;
  } 
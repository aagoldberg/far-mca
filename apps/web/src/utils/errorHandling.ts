// Centralized error handling utility for better UX
export interface ErrorDetails {
  title: string;
  message: string;
  suggestion?: string;
  actionLabel?: string;
  actionCallback?: () => void;
  severity: 'error' | 'warning' | 'info';
}

export class UserFriendlyError extends Error {
  public details: ErrorDetails;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.details = details;
    this.name = 'UserFriendlyError';
  }
}

// Parse common blockchain errors into user-friendly messages
export function parseBlockchainError(error: unknown): ErrorDetails {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // User rejected transaction
  if (lowerMessage.includes('user rejected') || 
      lowerMessage.includes('user denied') || 
      lowerMessage.includes('user cancelled')) {
    return {
      title: 'Transaction Cancelled',
      message: 'You cancelled the transaction in your wallet.',
      suggestion: 'Click "Donate" again when you\'re ready to proceed.',
      severity: 'info'
    };
  }

  // Insufficient funds
  if (lowerMessage.includes('insufficient funds') || 
      lowerMessage.includes('insufficient balance') ||
      lowerMessage.includes('exceeds balance')) {
    return {
      title: 'Insufficient Balance',
      message: 'You don\'t have enough tokens to complete this transaction.',
      suggestion: 'Get more USDC or ETH to cover transaction fees.',
      actionLabel: 'Get USDC',
      severity: 'warning'
    };
  }

  // Network/chain errors
  if (lowerMessage.includes('chain') || 
      lowerMessage.includes('network') ||
      lowerMessage.includes('wrong network')) {
    return {
      title: 'Wrong Network',
      message: 'Your wallet is connected to the wrong network.',
      suggestion: 'Switch to Base Sepolia testnet in your wallet.',
      actionLabel: 'Switch Network',
      severity: 'warning'
    };
  }

  // Gas estimation failed
  if (lowerMessage.includes('gas') || 
      lowerMessage.includes('execution reverted') ||
      lowerMessage.includes('out of gas')) {
    return {
      title: 'Transaction Failed',
      message: 'The transaction couldn\'t be processed due to network issues.',
      suggestion: 'Wait a moment and try again. Network might be congested.',
      actionLabel: 'Try Again',
      severity: 'error'
    };
  }

  // Allowance errors
  if (lowerMessage.includes('allowance') || 
      lowerMessage.includes('transfer amount exceeds allowance')) {
    return {
      title: 'Approval Issue',
      message: 'Token approval didn\'t complete properly.',
      suggestion: 'The transaction will retry automatically. If it fails again, please refresh and try once more.',
      severity: 'warning'
    };
  }

  // Nonce errors
  if (lowerMessage.includes('nonce') || 
      lowerMessage.includes('already known')) {
    return {
      title: 'Transaction Pending',
      message: 'Another transaction is still processing.',
      suggestion: 'Wait for your previous transaction to complete, then try again.',
      severity: 'info'
    };
  }

  // Contract interaction errors
  if (lowerMessage.includes('contract') || 
      lowerMessage.includes('call exception')) {
    return {
      title: 'Smart Contract Error',
      message: 'There was an issue communicating with the blockchain.',
      suggestion: 'This is usually temporary. Please wait a moment and try again.',
      actionLabel: 'Try Again',
      severity: 'error'
    };
  }

  // RPC/connection errors
  if (lowerMessage.includes('rpc') || 
      lowerMessage.includes('connection') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('fetch')) {
    return {
      title: 'Connection Issue',
      message: 'Unable to connect to the blockchain network.',
      suggestion: 'Check your internet connection and try again.',
      actionLabel: 'Try Again',
      severity: 'error'
    };
  }

  // Generic fallback
  return {
    title: 'Transaction Failed',
    message: 'Something went wrong with your transaction.',
    suggestion: 'Please try again. If the problem persists, contact support.',
    actionLabel: 'Try Again',
    severity: 'error'
  };
}

// Create user-friendly error from any error
export function createUserFriendlyError(error: unknown): UserFriendlyError {
  const details = parseBlockchainError(error);
  return new UserFriendlyError(details);
}

// Format error for display in UI
export function formatErrorForUI(error: unknown): {
  title: string;
  message: string;
  suggestion?: string;
  actionLabel?: string;
  severity: 'error' | 'warning' | 'info';
} {
  if (error instanceof UserFriendlyError) {
    return error.details;
  }
  
  return parseBlockchainError(error);
}
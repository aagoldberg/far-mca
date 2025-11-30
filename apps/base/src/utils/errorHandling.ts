/**
 * Error handling utilities for user-friendly blockchain error messages
 * Based on patterns from web-cdp
 */

export interface ErrorDetails {
  title: string;
  message: string;
  suggestion?: string;
  actionLabel?: string;
  severity: 'error' | 'warning' | 'info';
}

export class UserFriendlyError extends Error {
  public details: ErrorDetails;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = 'UserFriendlyError';
    this.details = details;
  }
}

/**
 * Parse blockchain errors into user-friendly messages
 */
export function parseBlockchainError(error: unknown): ErrorDetails {
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  // User rejected transaction
  if (lowerMessage.includes('user rejected') || lowerMessage.includes('user denied')) {
    return {
      title: 'Transaction Cancelled',
      message: 'You cancelled the transaction in your wallet.',
      suggestion: 'Try again when you\'re ready.',
      severity: 'info',
    };
  }

  // Insufficient funds
  if (lowerMessage.includes('insufficient funds') || lowerMessage.includes('insufficient balance')) {
    return {
      title: 'Insufficient Balance',
      message: 'You don\'t have enough tokens for this transaction.',
      suggestion: 'Add more USDC or ETH to your wallet.',
      actionLabel: 'Get Funds',
      severity: 'warning',
    };
  }

  // Wrong network
  if (lowerMessage.includes('wrong network') || lowerMessage.includes('chain mismatch')) {
    return {
      title: 'Wrong Network',
      message: 'Please switch to Base Sepolia network.',
      suggestion: 'Change network in your wallet settings.',
      actionLabel: 'Switch Network',
      severity: 'warning',
    };
  }

  // Gas estimation failed
  if (lowerMessage.includes('gas required exceeds') || lowerMessage.includes('gas estimation failed')) {
    return {
      title: 'Gas Estimation Failed',
      message: 'Transaction would likely fail.',
      suggestion: 'Check your input values and try again.',
      severity: 'error',
    };
  }

  // Allowance issues
  if (lowerMessage.includes('allowance') || lowerMessage.includes('approved')) {
    return {
      title: 'Approval Required',
      message: 'You need to approve USDC spending first.',
      suggestion: 'Approve the contract to use your USDC.',
      actionLabel: 'Approve USDC',
      severity: 'warning',
    };
  }

  // Nonce errors
  if (lowerMessage.includes('nonce') || lowerMessage.includes('replacement')) {
    return {
      title: 'Transaction Pending',
      message: 'You have a pending transaction.',
      suggestion: 'Wait for it to complete or cancel it in your wallet.',
      severity: 'info',
    };
  }

  // Connection errors
  if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('rpc')) {
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the blockchain.',
      suggestion: 'Check your internet connection and try again.',
      actionLabel: 'Retry',
      severity: 'error',
    };
  }

  // Wallet not connected
  if (lowerMessage.includes('not connected') || lowerMessage.includes('no wallet')) {
    return {
      title: 'Wallet Not Connected',
      message: 'Please connect your wallet first.',
      suggestion: 'Click the connect button to continue.',
      actionLabel: 'Connect Wallet',
      severity: 'warning',
    };
  }

  // Contract-specific errors from web-cdp patterns
  if (message.includes('GoalExceeded')) {
    return {
      title: 'Funding Goal Exceeded',
      message: 'This loan has already been fully funded or your contribution would exceed the goal.',
      suggestion: 'Try a smaller amount or choose a different loan.',
      severity: 'warning',
    };
  }

  if (message.includes('FundraisingNotActive') || message.includes('FundraisingEnded')) {
    return {
      title: 'Fundraising Ended',
      message: 'Fundraising for this loan has ended.',
      suggestion: 'Browse other active loans to contribute to.',
      actionLabel: 'Browse Loans',
      severity: 'info',
    };
  }

  if (message.includes('InvalidAmount')) {
    return {
      title: 'Invalid Amount',
      message: 'The contribution amount is invalid.',
      suggestion: 'Please enter a valid amount (minimum $5 USDC).',
      severity: 'error',
    };
  }

  if (message.includes('SafeERC20FailedOperation') || message.includes('ERC20')) {
    return {
      title: 'Token Transfer Failed',
      message: 'Unable to transfer USDC tokens.',
      suggestion: 'Ensure you have sufficient USDC balance and have approved the loan contract.',
      actionLabel: 'Check Balance',
      severity: 'error',
    };
  }

  if (message.includes('LoanNotActive')) {
    return {
      title: 'Loan Not Active',
      message: 'This loan is not active for repayments.',
      suggestion: 'The loan may not be funded yet or already completed.',
      severity: 'info',
    };
  }

  if (message.includes('AlreadyClaimed')) {
    return {
      title: 'Already Claimed',
      message: 'You have already claimed your share of repayments.',
      suggestion: 'Wait for more repayments to become available.',
      severity: 'info',
    };
  }

  if (message.includes('NotContributor')) {
    return {
      title: 'Not a Contributor',
      message: 'You haven\'t contributed to this loan.',
      suggestion: 'Only contributors can claim repayments.',
      severity: 'warning',
    };
  }

  if (message.includes('NotBorrower')) {
    return {
      title: 'Unauthorized',
      message: 'Only the borrower can perform this action.',
      suggestion: 'This action is restricted to the loan borrower.',
      severity: 'error',
    };
  }

  // Contract revert
  if (lowerMessage.includes('revert') || lowerMessage.includes('require')) {
    return {
      title: 'Transaction Failed',
      message: 'The transaction was rejected by the contract.',
      suggestion: 'Check the requirements and try again.',
      severity: 'error',
    };
  }

  // Generic error
  return {
    title: 'Transaction Error',
    message: 'Something went wrong with your transaction.',
    suggestion: 'Please try again. If the problem persists, contact support.',
    severity: 'error',
  };
}

/**
 * Format error for display
 */
export function formatError(error: unknown): string {
  if (error instanceof UserFriendlyError) {
    return error.details.message;
  }

  if (error instanceof Error) {
    const parsed = parseBlockchainError(error);
    return parsed.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is user rejection
 */
export function isUserRejection(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('user rejected') || lowerMessage.includes('user denied');
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('rpc');
}

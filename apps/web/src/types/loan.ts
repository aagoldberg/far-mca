/**
 * TypeScript types for MicroLoan contracts
 *
 * These types represent the data structures used throughout the Farcaster app
 * for interacting with zero-interest microloans on Base Sepolia.
 */

// =============================================================================
// RAW CONTRACT DATA
// =============================================================================

/**
 * Raw loan data as returned from the MicroLoan contract
 * All bigint values are in their raw form (USDC = 6 decimals)
 */
export interface RawLoan {
  address: `0x${string}`;
  borrower: `0x${string}`;
  principal: bigint;              // Target funding amount (USDC, 6 decimals)
  totalFunded: bigint;            // Current funded amount (USDC, 6 decimals)
  totalRepaid: bigint;            // Amount repaid so far (USDC, 6 decimals)
  termPeriods: bigint;            // Number of repayment periods (e.g., 12)
  periodLength: bigint;           // Length of each period in seconds (e.g., 2592000 = 30 days)
  firstDueDate: bigint;           // Timestamp of first payment
  fundraisingDeadline: bigint;    // Timestamp fundraising ends
  metadataURI: string;            // IPFS URI for loan metadata
  fundraisingActive: boolean;     // Can still accept contributions
  active: boolean;                // Loan is active and repaying
  completed: boolean;             // Loan fully repaid
  disbursed: boolean;             // Borrower withdrew funds
  contributorsCount: bigint;      // Number of unique contributors
}

/**
 * Loan metadata stored on IPFS
 * Referenced by metadataURI in the loan contract
 */
export interface LoanMetadata {
  name: string;                   // Business/project name
  description: string;            // Loan purpose and details
  businessType: string;           // Type of business (e.g., "Local Coffee Shop")
  location?: string;              // Optional location
  imageUrl?: string;              // Optional business image
  externalUrl?: string;           // Optional website/social link
  farcasterUsername?: string;     // Optional Farcaster handle
  fundingGoal: string;            // Human-readable goal (e.g., "$5,000")
  useOfFunds: string;             // How funds will be used
  repaymentSource: string;        // How borrower will repay
  additionalInfo?: string;        // Any extra information
}

// =============================================================================
// PROCESSED/DISPLAY DATA
// =============================================================================

/**
 * Processed loan data with fetched metadata
 * Ready for display in UI components
 */
export interface ProcessedLoan extends RawLoan {
  metadata: LoanMetadata | null;  // Fetched from IPFS
  isLoading?: boolean;            // Metadata still loading
  error?: string;                 // Error fetching metadata
}

/**
 * Loan details with calculated fields
 * Used in detail pages and dashboards
 */
export interface LoanDetails extends ProcessedLoan {
  // Calculated percentages
  fundingProgress: number;        // 0-100, percentage funded
  repaymentProgress: number;      // 0-100, percentage repaid

  // Formatted amounts (human-readable)
  principalFormatted: string;     // e.g., "5,000.00 USDC"
  totalFundedFormatted: string;   // e.g., "3,250.00 USDC"
  totalRepaidFormatted: string;   // e.g., "1,250.00 USDC"
  perPeriodFormatted: string;     // e.g., "416.67 USDC/month"

  // Dates (human-readable)
  fundraisingDeadlineDate: Date;
  firstDueDateDate: Date;
  nextDueDateDate: Date | null;   // Next payment due (if active)

  // Status flags
  isFunded: boolean;              // Reached funding goal
  isExpired: boolean;             // Past fundraising deadline
  canDisburse: boolean;           // Borrower can withdraw
  isDefaulted: boolean;           // Past due with grace period

  // Period calculations
  periodsCompleted: number;       // Number of periods passed
  periodsRemaining: number;       // Number of periods left
  periodLengthDays: number;       // Period length in days
}

// =============================================================================
// USER CONTRIBUTIONS
// =============================================================================

/**
 * User's contribution to a specific loan
 */
export interface UserContribution {
  loanAddress: `0x${string}`;
  contributorAddress: `0x${string}`;
  amount: bigint;                 // Contribution amount (USDC, 6 decimals)
  amountFormatted: string;        // Human-readable (e.g., "500.00 USDC")
  claimable: bigint;              // Amount available to claim
  claimableFormatted: string;     // Human-readable claimable
  claimed: bigint;                // Amount already claimed
  claimedFormatted: string;       // Human-readable claimed
  sharePercentage: number;        // % of total loan (0-100)
}

// =============================================================================
// LOAN CREATION
// =============================================================================

/**
 * Parameters for creating a new loan
 * Used in create loan form
 */
export interface CreateLoanParams {
  borrower: `0x${string}`;
  metadataURI: string;            // IPFS URI after uploading metadata
  principal: bigint;              // Funding goal (USDC, 6 decimals)
  termPeriods: number;            // Number of payment periods
  periodLength: number;           // Seconds per period
  firstDueDate: number;           // Unix timestamp
  fundraisingDeadline: number;    // Unix timestamp
}

/**
 * Form data for creating a loan (before conversion)
 */
export interface CreateLoanFormData {
  businessName: string;
  description: string;
  businessType: string;
  location?: string;
  imageUrl?: string;
  farcasterUsername?: string;

  // Funding details
  fundingGoal: string;            // Dollar amount as string (e.g., "5000")
  termMonths: number;             // Number of months (e.g., 12)
  firstPaymentDate: Date;         // Date picker value
  fundraisingDays: number;        // Days until deadline (e.g., 30)

  // Additional info
  useOfFunds: string;
  repaymentSource: string;
  additionalInfo?: string;
}

// =============================================================================
// TRANSACTION STATES
// =============================================================================

/**
 * Transaction state for write operations
 */
export interface TransactionState {
  isLoading: boolean;             // Transaction in progress
  isSuccess: boolean;             // Transaction confirmed
  isError: boolean;               // Transaction failed
  error: Error | null;            // Error details
  hash?: `0x${string}`;           // Transaction hash
}

/**
 * Approval state for USDC spending
 */
export interface ApprovalState extends TransactionState {
  isApproved: boolean;            // Has sufficient approval
  currentAllowance: bigint;       // Current approved amount
  needsApproval: boolean;         // Needs approval for amount
}

// =============================================================================
// LOAN LISTS AND FILTERS
// =============================================================================

/**
 * Loan list item for browsing/listing
 * Lightweight version for cards
 */
export interface LoanListItem {
  address: `0x${string}`;
  borrower: `0x${string}`;
  name: string;                   // From metadata
  description: string;            // From metadata
  imageUrl?: string;              // From metadata
  principal: bigint;
  totalFunded: bigint;
  fundingProgress: number;        // 0-100
  fundraisingActive: boolean;
  active: boolean;
  completed: boolean;
  contributorsCount: bigint;
}

/**
 * Filter options for loan lists
 */
export interface LoanFilters {
  status?: 'fundraising' | 'active' | 'completed' | 'all';
  borrower?: `0x${string}`;       // Filter by borrower
  contributor?: `0x${string}`;    // Filter by contributor
  minAmount?: bigint;             // Minimum principal
  maxAmount?: bigint;             // Maximum principal
  sortBy?: 'newest' | 'oldest' | 'amount' | 'progress';
}

// =============================================================================
// REPAYMENT SCHEDULE
// =============================================================================

/**
 * Single period in repayment schedule
 */
export interface RepaymentPeriod {
  periodNumber: number;           // 1-indexed period number
  dueDate: Date;                  // When payment is due
  amount: bigint;                 // Amount due this period (USDC, 6 decimals)
  amountFormatted: string;        // Human-readable
  isPaid: boolean;                // Has been paid
  isPastDue: boolean;             // Past due date
  isCurrent: boolean;             // Current period
  isFuture: boolean;              // Future period
}

/**
 * Complete repayment schedule
 */
export interface RepaymentSchedule {
  periods: RepaymentPeriod[];
  totalAmount: bigint;            // Total to be repaid (= principal)
  totalAmountFormatted: string;
  paidAmount: bigint;             // Amount paid so far
  paidAmountFormatted: string;
  remainingAmount: bigint;        // Amount still owed
  remainingAmountFormatted: string;
  currentPeriod: number | null;   // Current period number
  periodsCompleted: number;
  periodsRemaining: number;
}

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Loan status enum
 */
export enum LoanStatus {
  FUNDRAISING = 'fundraising',   // Accepting contributions
  FUNDED = 'funded',              // Goal reached, can disburse
  ACTIVE = 'active',              // Disbursed, repaying
  COMPLETED = 'completed',        // Fully repaid
  CANCELLED = 'cancelled',        // Fundraising cancelled
  EXPIRED = 'expired',            // Past deadline, not funded
  DEFAULTED = 'defaulted',        // Past due with grace period
}

/**
 * User role in relation to a loan
 */
export enum UserRole {
  BORROWER = 'borrower',          // Created the loan
  CONTRIBUTOR = 'contributor',    // Funded the loan
  VISITOR = 'visitor',            // Just viewing
}

/**
 * Period length presets (in seconds)
 */
export const PERIOD_LENGTH = {
  WEEKLY: 604800,                 // 7 days
  BIWEEKLY: 1209600,              // 14 days
  MONTHLY: 2592000,               // 30 days
  QUARTERLY: 7776000,             // 90 days
} as const;

/**
 * USDC decimals constant
 */
export const USDC_DECIMALS = 6;

/**
 * Grace period for defaults (in seconds)
 */
export const DEFAULT_GRACE_PERIOD = 604800; // 7 days

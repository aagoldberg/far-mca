/**
 * Loan Payment Status Utility
 *
 * Calculates payment status for MicroLoans based on:
 * - Disbursement time (when loan was funded)
 * - Term periods (number of payment periods)
 * - Principal amount
 * - Total repaid so far
 *
 * No grace period is included - loans are considered overdue immediately
 * when they fall behind the expected linear repayment schedule.
 */

export enum PaymentStatus {
  ON_TRACK = 'ON_TRACK',
  WARNING = 'WARNING',      // 1-7 days overdue
  OVERDUE = 'OVERDUE',      // 8-30 days overdue
  CRITICAL = 'CRITICAL',     // 30+ days overdue
  PAID_OFF = 'PAID_OFF',
  NOT_STARTED = 'NOT_STARTED', // Loan created but not yet disbursed
}

export interface LoanStatusInfo {
  status: PaymentStatus;
  daysOverdue: number;
  expectedRepayment: bigint;
  actualRepayment: bigint;
  percentageRepaid: number;
  currentPeriod: number;
  totalPeriods: number;
  isFullyRepaid: boolean;
}

/**
 * Calculate the expected repayment amount based on elapsed time
 * Uses linear repayment schedule: total amount / periods
 */
function calculateExpectedRepayment(
  principal: bigint,
  termPeriods: number,
  periodsPassed: number
): bigint {
  if (periodsPassed <= 0) return 0n;
  if (periodsPassed >= termPeriods) return principal;

  // Linear repayment: (principal / totalPeriods) * periodsPassed
  const amountPerPeriod = principal / BigInt(termPeriods);
  return amountPerPeriod * BigInt(periodsPassed);
}

/**
 * Calculate days since disbursement
 */
function getDaysSinceDisbursement(disbursementTime: bigint): number {
  const now = Math.floor(Date.now() / 1000);
  const secondsSince = now - Number(disbursementTime);
  return Math.floor(secondsSince / (24 * 60 * 60));
}

/**
 * Calculate how many payment periods have passed
 * Assumes weekly periods (7 days each)
 */
function getPeriodsPassedWeekly(disbursementTime: bigint): number {
  const daysSince = getDaysSinceDisbursement(disbursementTime);
  return Math.floor(daysSince / 7);
}

/**
 * Calculate how many days the borrower is overdue
 */
function calculateDaysOverdue(
  disbursementTime: bigint,
  expectedRepayment: bigint,
  actualRepayment: bigint
): number {
  // If they've paid enough or more, they're not overdue
  if (actualRepayment >= expectedRepayment) return 0;

  const daysSince = getDaysSinceDisbursement(disbursementTime);
  const periodsPassed = Math.floor(daysSince / 7);
  const daysIntoCurrentPeriod = daysSince % 7;

  // If behind, they're overdue by at least the days into current period
  // Plus 7 days for each full period they're behind
  return daysIntoCurrentPeriod > 0 ? daysIntoCurrentPeriod : 0;
}

/**
 * Determine payment status based on days overdue
 */
function getStatusFromDaysOverdue(
  daysOverdue: number,
  isFullyRepaid: boolean,
  disbursementTime: bigint
): PaymentStatus {
  if (isFullyRepaid) return PaymentStatus.PAID_OFF;
  if (disbursementTime === 0n) return PaymentStatus.NOT_STARTED;

  if (daysOverdue === 0) return PaymentStatus.ON_TRACK;
  if (daysOverdue <= 7) return PaymentStatus.WARNING;
  if (daysOverdue <= 30) return PaymentStatus.OVERDUE;
  return PaymentStatus.CRITICAL;
}

/**
 * Main function to calculate loan payment status
 */
export function calculateLoanStatus(
  disbursementTime: bigint,
  termPeriods: number,
  principal: bigint,
  totalRepaid: bigint
): LoanStatusInfo {
  // Check if loan is fully repaid
  const isFullyRepaid = totalRepaid >= principal;

  // If not disbursed yet
  if (disbursementTime === 0n) {
    return {
      status: PaymentStatus.NOT_STARTED,
      daysOverdue: 0,
      expectedRepayment: 0n,
      actualRepayment: totalRepaid,
      percentageRepaid: 0,
      currentPeriod: 0,
      totalPeriods: termPeriods,
      isFullyRepaid: false,
    };
  }

  // Calculate periods passed (weekly)
  const periodsPassed = getPeriodsPassedWeekly(disbursementTime);
  const currentPeriod = Math.min(periodsPassed, termPeriods);

  // Calculate expected repayment
  const expectedRepayment = calculateExpectedRepayment(
    principal,
    termPeriods,
    periodsPassed
  );

  // Calculate days overdue
  const daysOverdue = isFullyRepaid
    ? 0
    : calculateDaysOverdue(disbursementTime, expectedRepayment, totalRepaid);

  // Determine status
  const status = getStatusFromDaysOverdue(
    daysOverdue,
    isFullyRepaid,
    disbursementTime
  );

  // Calculate percentage repaid
  const percentageRepaid = principal > 0n
    ? Number((totalRepaid * 100n) / principal)
    : 0;

  return {
    status,
    daysOverdue,
    expectedRepayment,
    actualRepayment: totalRepaid,
    percentageRepaid,
    currentPeriod,
    totalPeriods: termPeriods,
    isFullyRepaid,
  };
}

/**
 * Get human-readable status text
 */
export function getStatusText(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.ON_TRACK:
      return 'On Track';
    case PaymentStatus.WARNING:
      return 'Payment Due Soon';
    case PaymentStatus.OVERDUE:
      return 'Overdue';
    case PaymentStatus.CRITICAL:
      return 'Critically Overdue';
    case PaymentStatus.PAID_OFF:
      return 'Paid Off';
    case PaymentStatus.NOT_STARTED:
      return 'Not Disbursed';
    default:
      return 'Unknown';
  }
}

/**
 * Get color scheme for status badge
 */
export function getStatusColors(status: PaymentStatus): {
  bg: string;
  border: string;
  text: string;
} {
  switch (status) {
    case PaymentStatus.ON_TRACK:
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
      };
    case PaymentStatus.WARNING:
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
      };
    case PaymentStatus.OVERDUE:
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
      };
    case PaymentStatus.CRITICAL:
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
      };
    case PaymentStatus.PAID_OFF:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
      };
    case PaymentStatus.NOT_STARTED:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
      };
  }
}

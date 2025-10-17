'use client';

import {
  PaymentStatus,
  LoanStatusInfo,
  getStatusText,
  getStatusColors,
} from '@/utils/loanStatus';

interface PaymentWarningBadgeProps {
  statusInfo: LoanStatusInfo;
  size?: 'small' | 'medium' | 'large';
  showDaysOverdue?: boolean;
}

export default function PaymentWarningBadge({
  statusInfo,
  size = 'small',
  showDaysOverdue = true,
}: PaymentWarningBadgeProps) {
  const { status, daysOverdue } = statusInfo;

  // Don't show badge for on-track or not-started loans
  if (status === PaymentStatus.ON_TRACK || status === PaymentStatus.NOT_STARTED) {
    return null;
  }

  const colors = getStatusColors(status);
  const text = getStatusText(status);

  // Size classes
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border ${colors.bg} ${colors.border} ${colors.text} ${sizeClasses[size]} font-semibold`}
    >
      {/* Warning icon */}
      {status !== PaymentStatus.PAID_OFF && (
        <svg
          className="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {/* Status text */}
      <span>{text}</span>

      {/* Days overdue (if applicable) */}
      {showDaysOverdue &&
        daysOverdue > 0 &&
        status !== PaymentStatus.PAID_OFF && (
          <span className="opacity-75">({daysOverdue}d)</span>
        )}
    </div>
  );
}

/**
 * Compact badge variant for use in tight spaces like loan cards
 */
export function PaymentWarningBadgeCompact({
  statusInfo,
}: {
  statusInfo: LoanStatusInfo;
}) {
  const { status, daysOverdue } = statusInfo;

  // Don't show badge for on-track or not-started loans
  if (status === PaymentStatus.ON_TRACK || status === PaymentStatus.NOT_STARTED) {
    return null;
  }

  const colors = getStatusColors(status);

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${colors.bg} ${colors.border} ${colors.text} text-xs font-semibold border`}
    >
      {status === PaymentStatus.WARNING && '⚠️'}
      {status === PaymentStatus.OVERDUE && '🔴'}
      {status === PaymentStatus.CRITICAL && '🚨'}
      {status === PaymentStatus.PAID_OFF && '✅'}
      <span>
        {status === PaymentStatus.PAID_OFF
          ? 'Paid'
          : `${daysOverdue}d overdue`}
      </span>
    </div>
  );
}

/**
 * Full alert banner variant for loan details page
 */
export function PaymentWarningAlert({
  statusInfo,
}: {
  statusInfo: LoanStatusInfo;
}) {
  const { status, daysOverdue, percentageRepaid } = statusInfo;

  // Don't show alert for on-track, not-started, or paid-off loans
  if (
    status === PaymentStatus.ON_TRACK ||
    status === PaymentStatus.NOT_STARTED ||
    status === PaymentStatus.PAID_OFF
  ) {
    return null;
  }

  const colors = getStatusColors(status);
  const text = getStatusText(status);

  return (
    <div
      className={`w-full p-4 rounded-lg border-2 ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${colors.text}`}>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${colors.text}`}>{text}</h3>
          <p className={`text-sm ${colors.text} opacity-90`}>
            This loan is{' '}
            <span className="font-semibold">{daysOverdue} days overdue</span>.
            Only {percentageRepaid}% has been repaid so far.
          </p>

          {status === PaymentStatus.CRITICAL && (
            <p className={`text-sm mt-2 ${colors.text} font-semibold`}>
              Urgent action required. The borrower has not made payments in over
              30 days.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

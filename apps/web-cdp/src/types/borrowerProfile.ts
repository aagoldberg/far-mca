// Borrower Profile Types
// Reputational collateral data structure

export type LoanStatus = 'none' | 'current' | 'late' | 'delinquent' | 'default';

export interface BorrowerProfile {
  id: string;
  walletAddress: string;

  // Owner Identity (REQUIRED)
  ownerFullName: string;
  ownerPhotoUrl: string;
  ownerEmail?: string;

  // Social Proof (OPTIONAL)
  socialProof: {
    instagramHandle?: string;
    instagramFollowers?: number;
    tiktokHandle?: string;
    tiktokFollowers?: number;
    linkedinUrl?: string;
    googleRating?: number;
    googleReviewCount?: number;
    yelpRating?: number;
    yelpReviewCount?: number;
  };

  // Platform-calculated
  trustBoostPercent: number;

  // Loan History (platform-tracked)
  loanHistory: {
    totalLoans: number;
    repaidOnTime: number;
    currentStatus: LoanStatus;
    daysPastDue: number;
  };

  // Settings
  isPublic: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Form data for creating/updating profile
export interface BorrowerProfileFormData {
  ownerFullName: string;
  ownerPhotoUrl: string;
  ownerEmail?: string;
  instagramHandle?: string;
  instagramFollowers?: number;
  tiktokHandle?: string;
  tiktokFollowers?: number;
  linkedinUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
  yelpRating?: number;
  yelpReviewCount?: number;
}

// Database row format (snake_case)
export interface BorrowerProfileRow {
  id: string;
  wallet_address: string;
  owner_full_name: string;
  owner_photo_url: string;
  owner_email: string | null;
  instagram_handle: string | null;
  instagram_followers: number | null;
  tiktok_handle: string | null;
  tiktok_followers: number | null;
  linkedin_url: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  yelp_rating: number | null;
  yelp_review_count: number | null;
  trust_boost_percent: number;
  total_loans: number;
  loans_repaid_on_time: number;
  current_loan_status: LoanStatus;
  days_past_due: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Convert database row to frontend format
export function rowToBorrowerProfile(row: BorrowerProfileRow): BorrowerProfile {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    ownerFullName: row.owner_full_name,
    ownerPhotoUrl: row.owner_photo_url,
    ownerEmail: row.owner_email || undefined,
    socialProof: {
      instagramHandle: row.instagram_handle || undefined,
      instagramFollowers: row.instagram_followers || undefined,
      tiktokHandle: row.tiktok_handle || undefined,
      tiktokFollowers: row.tiktok_followers || undefined,
      linkedinUrl: row.linkedin_url || undefined,
      googleRating: row.google_rating || undefined,
      googleReviewCount: row.google_review_count || undefined,
      yelpRating: row.yelp_rating || undefined,
      yelpReviewCount: row.yelp_review_count || undefined,
    },
    trustBoostPercent: row.trust_boost_percent,
    loanHistory: {
      totalLoans: row.total_loans,
      repaidOnTime: row.loans_repaid_on_time,
      currentStatus: row.current_loan_status,
      daysPastDue: row.days_past_due,
    },
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get loan status display info
export function getLoanStatusDisplay(status: LoanStatus, daysPastDue: number): {
  label: string;
  color: string;
  bgColor: string;
  icon: 'check' | 'warning' | 'error';
} {
  switch (status) {
    case 'current':
      return {
        label: 'CURRENT',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: 'check',
      };
    case 'late':
      return {
        label: `LATE - ${daysPastDue} days`,
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        icon: 'warning',
      };
    case 'delinquent':
      return {
        label: `DELINQUENT - ${daysPastDue} days past due`,
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: 'error',
      };
    case 'default':
      return {
        label: 'DEFAULTED',
        color: 'text-red-900',
        bgColor: 'bg-red-200',
        icon: 'error',
      };
    default:
      return {
        label: 'No Active Loans',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: 'check',
      };
  }
}

// Get repayment rate display
export function getRepaymentDisplay(repaidOnTime: number, total: number): {
  rate: string;
  label: string;
  color: string;
} {
  if (total === 0) {
    return {
      rate: 'N/A',
      label: 'New borrower',
      color: 'text-gray-500',
    };
  }

  const rate = Math.round((repaidOnTime / total) * 100);

  if (rate >= 90) {
    return {
      rate: `${rate}%`,
      label: `${repaidOnTime}/${total} on time`,
      color: 'text-green-600',
    };
  } else if (rate >= 70) {
    return {
      rate: `${rate}%`,
      label: `${repaidOnTime}/${total} on time`,
      color: 'text-yellow-600',
    };
  } else {
    return {
      rate: `${rate}%`,
      label: `${repaidOnTime}/${total} on time`,
      color: 'text-red-600',
    };
  }
}

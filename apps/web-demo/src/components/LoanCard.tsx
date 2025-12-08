'use client';

import Link from 'next/link';
import { Loan } from '@/lib/mockData';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function LoanCard({ loan }: { loan: Loan }) {
  const progress = (loan.funded / loan.amount) * 100;

  return (
    <Link
      href={`/loan/${loan.id}`}
      className="block bg-white rounded-2xl border border-stone-200 hover:border-brand-300 hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Cover Image with Avatar Overlay */}
      <div className="relative h-40">
        <img
          src={loan.coverImage}
          alt={loan.businessName}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Avatar positioned at bottom left */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <img
            src={loan.avatar}
            alt={loan.borrowerName}
            className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg"
          />
          <div>
            <h3 className="font-semibold text-white text-lg drop-shadow-lg">
              {loan.businessName}
            </h3>
            <p className="text-sm text-white/90 drop-shadow">{loan.borrowerName}</p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium shadow ${
            loan.status === 'active'
              ? 'bg-green-100 text-green-700'
              : loan.status === 'repaying'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          {loan.status === 'active'
            ? 'Raising'
            : loan.status === 'repaying'
            ? 'Repaying'
            : 'Completed'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <p className="text-stone-600 text-sm line-clamp-2">{loan.purpose}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-stone-900">
              {formatCurrency(loan.funded)}
            </span>
            <span className="text-stone-500">
              of {formatCurrency(loan.amount)}
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-stone-500">
            {loan.fundersCount} supporter{loan.fundersCount !== 1 ? 's' : ''}
          </span>
          <span className="text-stone-500">{loan.duration} months</span>
        </div>
      </div>
    </Link>
  );
}

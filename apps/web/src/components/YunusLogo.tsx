"use client";

// LendFriend logo with growth icon
const GrowthIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
  </svg>
);

export function YunusLogo() {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="transition-all duration-300 group-hover:scale-110">
        <GrowthIcon className="w-8 h-8 text-[#2E7D32] hover:text-[#4CAF50] transition-colors" />
      </div>

      <span className="text-2xl font-bold tracking-tight text-[#2E7D32] group-hover:text-[#4CAF50] transition-colors">
        lendfriend
      </span>
    </div>
  );
}
"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer no-underline">
      <div className="text-[22px] sm:text-[26px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif' }}>
        <span className="text-secondary-700 group-hover:text-secondary-800 transition-colors">Lend</span>
        <span className="text-brand-600 group-hover:text-brand-700 transition-colors">Friend</span>
      </div>
    </div>
  );
}
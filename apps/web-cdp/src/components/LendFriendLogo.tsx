"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer no-underline">
      <div className="text-[22px] sm:text-[26px] tracking-tight" style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif', fontWeight: 500 }}>
        <span className="text-cyan-700 group-hover:text-cyan-800 transition-colors">LendFriend</span>
      </div>
    </div>
  );
}
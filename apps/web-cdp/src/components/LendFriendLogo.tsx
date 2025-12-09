"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer no-underline">
      <div className="text-[20px] sm:text-[22px] tracking-tight text-cyan-700 group-hover:text-cyan-800 transition-colors" style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif' }}>
        <span style={{ fontWeight: 300 }}>Lend</span><span style={{ fontWeight: 500 }}>Friend</span>
      </div>
    </div>
  );
}
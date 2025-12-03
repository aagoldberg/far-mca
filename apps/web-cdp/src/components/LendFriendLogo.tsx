"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer no-underline">
      <div className="text-2xl sm:text-3xl font-bold tracking-tight">
        <span className="text-teal-700 group-hover:text-teal-800 transition-colors">Lend</span>
        <span className="text-emerald-600 group-hover:text-emerald-700 transition-colors">Friend</span>
      </div>
    </div>
  );
}
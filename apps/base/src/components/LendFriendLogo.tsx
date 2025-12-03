"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer no-underline">
      <img
        src="/lf-logo.svg"
        alt="LendFriend"
        width={48}
        height={48}
        className="group-hover:scale-105 transition-transform"
      />
      <div className="text-2xl sm:text-3xl font-bold tracking-tight">
        <span className="text-teal-700 group-hover:text-teal-800 transition-colors">Lend</span>
        <span className="text-emerald-600 group-hover:text-emerald-700 transition-colors">Friend</span>
      </div>
    </div>
  );
}

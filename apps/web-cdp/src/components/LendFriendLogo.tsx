"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center group cursor-pointer no-underline">
      <div className="flex flex-col">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-cyan-700 group-hover:text-cyan-800 transition-colors">Lend</span>
          <span className="text-teal-600 group-hover:text-teal-700 transition-colors">Friend</span>
        </div>
      </div>
    </div>
  );
}
"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center group cursor-pointer no-underline">
      <div className="flex flex-col">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-cyan-700 group-hover:text-cyan-800 transition-colors">Lend</span>
          <span className="text-teal-600 group-hover:text-teal-700 transition-colors">Friend</span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-slate-400 -mt-0.5 font-medium tracking-widest uppercase">
          Community Lending
        </span>
      </div>
    </div>
  );
}
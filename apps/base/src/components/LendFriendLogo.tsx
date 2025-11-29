"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center group cursor-pointer no-underline">
      <div className="flex flex-col">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#2C7DA0] from-35% via-[#2E8B8B] via-45% to-[#3B9B7F] to-55% bg-clip-text text-transparent group-hover:from-[#236382] group-hover:via-[#26706F] group-hover:to-[#2E7D68] transition-all">
          LendFriend
        </span>
        <span className="text-[10px] sm:text-[11px] text-gray-500 -mt-0.5 font-semibold tracking-wider hidden xs:block">
          COMMUNITY LENDING
        </span>
      </div>
    </div>
  );
}
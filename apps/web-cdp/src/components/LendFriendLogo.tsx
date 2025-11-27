"use client";

export function LendFriendLogo() {
  return (
    <div className="flex items-center group cursor-pointer no-underline">
      <div className="flex flex-col">
        <div className="text-2xl sm:text-3xl tracking-tight">
          <span className="font-semibold text-[#2C7A7B] group-hover:text-[#234E52] transition-colors">
            Lend
          </span>
          <span className="font-medium text-[#4A9C9D] group-hover:text-[#3A8C8E] transition-colors">
            friend
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-gray-500 -mt-0.5 font-semibold tracking-wider hidden xs:block">
          COMMUNITY LENDING
        </span>
      </div>
    </div>
  );
}
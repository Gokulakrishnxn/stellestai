"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSearch } from "@/app/contexts/SearchContext";

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/patients": "Patients",
  "/assessment": "New Assessment",
  "/reports": "Reports",
  "/analytics": "Visual Analytics",
  "/settings": "Settings",
};

const NOTIFICATIONS = [
  "Rohan Iyer — assessment due",
  "Diya Nair — high risk flag",
  "3 reports ready to export",
];

export default function Topbar() {
  const pathname = usePathname();
  const { search, setSearch } = useSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const title =
    Object.entries(PAGE_TITLES).find(
      ([path]) => pathname === path || pathname.startsWith(path + "/")
    )?.[1] ?? "Dashboard";

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <header className="h-auto min-h-[56px] bg-white border-b border-[#E5E4DF] flex flex-wrap lg:flex-nowrap items-center px-4 sm:px-6 py-2 gap-3 shrink-0">
      {/* Left: page title */}
      <h1 className="text-[16px] font-medium text-[#111827] whitespace-nowrap shrink-0 order-1">
        {title}
      </h1>

      {/* Center: search */}
      <div className="order-3 lg:order-2 w-full lg:w-auto lg:flex-1 flex lg:justify-center">
        <div className="relative w-full sm:w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF]">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name or ID..."
            className="w-full h-[36px] rounded-full bg-[#F7F6F3] border border-[#E5E4DF] pl-9 pr-4 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#1D9E75] transition-colors"
          />
        </div>
      </div>

      {/* Right: bell + divider + doctor */}
      <div className="order-2 lg:order-3 ml-auto flex items-center gap-2 shrink-0">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F6F3] rounded-md transition-colors"
          >
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#DC2626] rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[264px] bg-white border border-[#E5E4DF] rounded-xl z-50 overflow-hidden">
              <p className="px-4 pt-3 pb-1.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E4DF]">
                Notifications · 3
              </p>
              {NOTIFICATIONS.map((text, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F9F8F6] transition-colors"
                >
                  <p className="text-[13px] text-[#111827]">{text}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-[#E5E4DF]" />

        {/* Doctor avatar + name */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F7F6F3] transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#1D9E75" }}
          >
            <span className="text-white text-[11px] font-semibold">PS</span>
          </div>
          <span className="hidden sm:inline text-[13px] font-medium text-[#111827]">
            Dr. Priya Sharma
          </span>
          <span className="hidden sm:inline text-[#9CA3AF]">
            <ChevronDownIcon />
          </span>
        </button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function BarChart2Icon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", Icon: GridIcon },
  { label: "Patients", href: "/patients", Icon: UsersIcon },
  { label: "New Assessment", href: "/assessment/new", Icon: PlusCircleIcon },
  { label: "Reports", href: "/reports", Icon: FileTextIcon },
  { label: "Analytics", href: "/analytics", Icon: BarChart2Icon },
  { label: "Settings", href: "/settings", Icon: SlidersIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:flex w-[220px] shrink-0 bg-white border-r border-[#E5E4DF] flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-[56px] border-b border-[#E5E4DF] shrink-0">
          <div
            className="w-7 h-7 flex items-center justify-center shrink-0"
            style={{ background: "#1D9E75", borderRadius: "10px" }}
          >
            <EyeIcon />
          </div>
          <span className="text-[16px] font-medium text-[#111827]">Stellest</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/"));
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "relative flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] mb-0.5 transition-colors",
                  active
                    ? "bg-[#F0FBF7] text-[#1D9E75] font-medium"
                    : "text-[#6B7280] hover:bg-[#F9F8F6] hover:text-[#111827]",
                ].join(" ")}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                    style={{ background: "#1D9E75" }}
                  />
                )}
                <span className={active ? "text-[#1D9E75]" : "text-[#9CA3AF]"}>
                  <Icon />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Doctor / clinic */}
        <div className="border-t border-[#E5E4DF] px-4 py-3 shrink-0">
          <p className="text-[11px] text-[#9CA3AF] mb-2.5 uppercase tracking-wider font-medium">
            Clarity Eye Clinic
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#1D9E75" }}
            >
              <span className="text-white text-[11px] font-semibold">PS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111827] truncate">DR. LIPIKA ROY</p>
              <p className="text-[11px] text-[#9CA3AF]">Optometrist</p>
            </div>
            <button className="text-[#9CA3AF] hover:text-[#6B7280] shrink-0 transition-colors">
              <DotsIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#E5E4DF] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="grid grid-cols-6 px-1 py-1">
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href + "/"));

            return (
              <Link
                key={`mobile-${href}`}
                href={href}
                className={[
                  "flex flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[10px] leading-none",
                  active ? "text-[#1D9E75]" : "text-[#6B7280]",
                ].join(" ")}
              >
                <span className={active ? "text-[#1D9E75]" : "text-[#9CA3AF]"}>
                  <Icon />
                </span>
                <span className="truncate max-w-full">{label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

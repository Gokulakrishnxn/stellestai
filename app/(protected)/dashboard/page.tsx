"use client";

import { useState } from "react";
import { useSearch } from "@/app/contexts/SearchContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Risk = "High" | "Moderate" | "Low";

interface Patient {
  id: string;
  name: string;
  initials: string;
  patientId: string;
  age: number;
  risk: Risk;
  progression: number;
  sphere: string;
  lastSeen: string;
  lastSeenDays: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Aanya M",
    initials: "AM",
    patientId: "PT-001",
    age: 11,
    risk: "High",
    progression: 0.9,
    sphere: "-3.25 D",
    lastSeen: "3 weeks ago",
    lastSeenDays: 21,
  },
  {
    id: "2",
    name: "Rohan I",
    initials: "RI",
    patientId: "PT-002",
    age: 9,
    risk: "High",
    progression: 1.1,
    sphere: "-2.00 D",
    lastSeen: "2 days ago",
    lastSeenDays: 2,
  },
  {
    id: "3",
    name: "Preethi S",
    initials: "PS",
    patientId: "PT-003",
    age: 13,
    risk: "Moderate",
    progression: 0.45,
    sphere: "-1.75 D",
    lastSeen: "4 weeks ago",
    lastSeenDays: 28,
  },
  {
    id: "4",
    name: "Kiran B",
    initials: "KB",
    patientId: "PT-004",
    age: 10,
    risk: "Low",
    progression: 0.3,
    sphere: "-4.00 D",
    lastSeen: "1 day ago",
    lastSeenDays: 1,
  },
  {
    id: "5",
    name: "Sanjay M",
    initials: "SM",
    patientId: "PT-005",
    age: 14,
    risk: "Moderate",
    progression: 0.55,
    sphere: "-2.50 D",
    lastSeen: "10 days ago",
    lastSeenDays: 10,
  },
  {
    id: "6",
    name: "Diya N",
    initials: "DN",
    patientId: "PT-006",
    age: 8,
    risk: "High",
    progression: 0.8,
    sphere: "-1.25 D",
    lastSeen: "5 weeks ago",
    lastSeenDays: 35,
  },
];

const OVERDUE = [
  { name: "Arjun K", initials: "AK", lastSeen: "6 weeks ago", risk: "High" as Risk },
  { name: "Meena R", initials: "MR", lastSeen: "5 weeks ago", risk: "Moderate" as Risk },
  { name: "Vikram S", initials: "VS", lastSeen: "8 weeks ago", risk: "High" as Risk },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_BADGE: Record<Risk, { bg: string; text: string }> = {
  High: { bg: "#FEF2F2", text: "#991B1B" },
  Moderate: { bg: "#FFFBEB", text: "#92400E" },
  Low: { bg: "#F0FDF4", text: "#166534" },
};

const RISK_BAR_COLOR: Record<Risk, string> = {
  High: "#DC2626",
  Moderate: "#D97706",
  Low: "#16A34A",
};

function filterPatients(
  patients: Patient[],
  search: string
): Patient[] {
  let result = patients;

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q)
    );
  }

  return result;
}

// ─── Inline Icons ─────────────────────────────────────────────────────────────

function UsersIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AlertTriangleIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ClipboardIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: Risk }) {
  const { bg, text } = RISK_BADGE[risk];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: bg, color: text }}
    >
      {risk}
    </span>
  );
}

function InitialsAvatar({
  initials,
  size = 32,
}: {
  initials: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "#1D9E75",
        fontSize: size <= 32 ? "11px" : "13px",
      }}
    >
      <span className="text-white font-semibold">{initials}</span>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { search } = useSearch();
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [scheduledSet, setScheduledSet] = useState<Set<string>>(new Set());

  const visiblePatients = filterPatients(PATIENTS, search);

  function handleViewClick(id: string) {
    setHighlightedRow(id);
    setTimeout(() => setHighlightedRow(null), 300);
  }

  function handleSchedule(name: string) {
    setScheduledSet((prev) => new Set([...prev, name]));
    setTimeout(() => {
      setScheduledSet((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }, 2000);
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 min-h-full">

      {/* ── Stats Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Total patients */}
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <UsersIcon color="#1D9E75" />
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              Total Patients
            </span>
          </div>
          <div className="text-[32px] font-medium text-[#111827] leading-none mb-1.5">
            148
          </div>
          <div className="text-[12px] text-[#16A34A]">↑ 4 new this week</div>
        </div>

        {/* High risk */}
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangleIcon color="#DC2626" />
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              High Risk
            </span>
          </div>
          <div className="text-[32px] font-medium text-[#DC2626] leading-none mb-1.5">
            23
          </div>
          <div className="text-[12px] text-[#DC2626]">5 unreviewed</div>
        </div>

        {/* Assessments today */}
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardIcon color="#D97706" />
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              Assessments Today
            </span>
          </div>
          <div className="text-[32px] font-medium text-[#111827] leading-none mb-1.5">
            7
          </div>
          <div className="text-[12px] text-[#D97706]">3 pending results</div>
        </div>

      </div>

      {/* ── Two-column content ────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-4 flex-1">

        {/* Left: Patient table */}
        <div className="flex-1 min-w-0 bg-white border border-[#E5E4DF] rounded-[10px] overflow-hidden flex flex-col">
          {/* Table header */}
          <div className="px-4 sm:px-5 py-4 border-b border-[#E5E4DF]">
            <span className="text-[14px] font-medium text-[#111827]">
              Recent assessments
            </span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[#E5E4DF]">
                  {["Patient", "Age", "Risk", "Progression", "Sphere", "Last seen", ""].map(
                    (col, i) => (
                      <th
                        key={i}
                        className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {visiblePatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[13px] text-[#9CA3AF]"
                    >
                      No patients match your filters.
                    </td>
                  </tr>
                ) : (
                  visiblePatients.map((patient) => {
                    const highlighted = highlightedRow === patient.id;
                    return (
                      <tr
                        key={patient.id}
                        className="group border-b border-[#E5E4DF] last:border-b-0 hover:bg-[#F9F8F6] transition-colors relative"
                      >
                        {/* Patient cell */}
                        <td
                          className="px-4 py-3 transition-all"
                          style={{
                            borderLeft: highlighted
                              ? "3px solid #1D9E75"
                              : "3px solid transparent",
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <InitialsAvatar initials={patient.initials} />
                            <div>
                              <div className="text-[13px] font-medium text-[#111827]">
                                {patient.name}
                              </div>
                              <div className="text-[11px] text-[#9CA3AF]">
                                {patient.patientId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Age */}
                        <td className="px-4 py-3 text-[13px] text-[#111827] whitespace-nowrap">
                          {patient.age} yrs
                        </td>

                        {/* Risk */}
                        <td className="px-4 py-3">
                          <RiskBadge risk={patient.risk} />
                        </td>

                        {/* Progression */}
                        <td className="px-4 py-3">
                          <div className="text-[13px] text-[#111827] font-medium">
                            {patient.progression.toFixed(2)} D/yr
                          </div>
                          <div
                            className="mt-1 h-[3px] rounded-full overflow-hidden"
                            style={{ width: "72px", background: "#F3F4F6" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(patient.progression / 2.0) * 100}%`,
                                background: RISK_BAR_COLOR[patient.risk],
                              }}
                            />
                          </div>
                        </td>

                        {/* Sphere */}
                        <td className="px-4 py-3 text-[13px] text-[#111827] whitespace-nowrap">
                          {patient.sphere}
                        </td>

                        {/* Last seen */}
                        <td className="px-4 py-3 text-[13px] text-[#6B7280] whitespace-nowrap">
                          {patient.lastSeen}
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewClick(patient.id)}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-[13px] text-[#1D9E75] font-medium border border-[#1D9E75] rounded-md px-3 py-1 hover:bg-[#F0FBF7] whitespace-nowrap"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 sm:px-5 py-3 border-t border-[#E5E4DF] flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#6B7280]">
              Showing {visiblePatients.length} of 148 patients
            </span>
            <button className="text-[12px] text-[#1D9E75] font-medium hover:underline">
              View all →
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full xl:w-[300px] shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">

          {/* Risk distribution */}
          <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5">
            <h3 className="text-[14px] font-medium text-[#111827] mb-4">
              Risk distribution
            </h3>

            {/* Donut chart */}
            <div className="flex justify-center mb-4">
              <div className="relative w-[148px] h-[148px]">
                {/* Outer donut ring via conic-gradient */}
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(#DC2626 0% 16%, #D97706 16% 57%, #16A34A 57% 100%)",
                  }}
                />
                {/* Inner white circle */}
                <div className="absolute inset-[28px] rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-[20px] font-semibold text-[#111827] leading-none">
                    148
                  </span>
                  <span className="text-[11px] text-[#6B7280] mt-0.5">
                    patients
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              {[
                { label: "High risk", count: 23, color: "#DC2626" },
                { label: "Moderate", count: 61, color: "#D97706" },
                { label: "Low risk", count: 64, color: "#16A34A" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-[13px] text-[#6B7280]">{label}</span>
                  </div>
                  <span className="text-[13px] font-medium text-[#111827]">
                    {count}{" "}
                    <span className="font-normal text-[#9CA3AF]">patients</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue reviews */}
          <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-[#111827]">
                Overdue reviews
              </h3>
              <button className="text-[12px] text-[#1D9E75] font-medium hover:underline">
                See all →
              </button>
            </div>

            <div className="space-y-3">
              {OVERDUE.map((patient) => (
                <div key={patient.name}>
                  <div className="flex items-center gap-2.5">
                    <InitialsAvatar initials={patient.initials} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-medium text-[#111827] truncate">
                          {patient.name}
                        </span>
                        <RiskBadge risk={patient.risk} />
                      </div>
                      <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                        Last seen {patient.lastSeen}
                      </div>
                    </div>
                  </div>

                  {/* Schedule button / confirmation */}
                  <div className="mt-2 ml-[44px]">
                    {scheduledSet.has(patient.name) ? (
                      <span className="text-[11px] text-[#1D9E75] font-medium">
                        ✓ Appointment request sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSchedule(patient.name)}
                        className="text-[11px] font-medium px-3 py-1 rounded-md border border-[#1D9E75] text-[#1D9E75] hover:bg-[#F0FBF7] transition-colors"
                      >
                        Schedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5">
            <h3 className="text-[14px] font-medium text-[#111827] mb-4">
              This month
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "New patients", value: 12 },
                { label: "Assessments", value: 41 },
                { label: "High risk found", value: 7 },
                { label: "Reports sent", value: 38 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#F9F8F6] rounded-lg p-3">
                  <div className="text-[22px] font-semibold text-[#111827] leading-none">
                    {value}
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

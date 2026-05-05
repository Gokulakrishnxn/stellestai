"use client";

import { useMemo, useState } from "react";

type Risk = "High" | "Moderate" | "Low";
type Treatment = "Stellest lens" | "Atropine" | "OK lens" | "None";
type FilterKey = "All patients" | "High risk" | "Moderate" | "Low risk" | "Overdue review";
type SortKey = "lastSeen" | "name" | "risk" | "progression";

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  risk: Risk;
  sphere: string;
  progression: number;
  axialLength: string;
  lastSeenLabel: string;
  lastSeenDays: number;
  lastAssessmentDate: string;
  treatment: Treatment;
}

const TOTAL_PATIENTS = 148;
const ROWS_PER_PAGE = 20;

const PATIENTS: Patient[] = [
  { id: "PT-001", name: "Aanya Mehta", phone: "+91 98765 41001", age: 11, risk: "High", sphere: "-3.25 D", progression: 0.9, axialLength: "24.8 mm", lastSeenLabel: "2 days ago", lastSeenDays: 2, lastAssessmentDate: "12 Jan 2025", treatment: "Stellest lens" },
  { id: "PT-002", name: "Rohan Iyer", phone: "+91 98765 41002", age: 9, risk: "High", sphere: "-2.00 D", progression: 1.1, axialLength: "24.2 mm", lastSeenLabel: "2 days ago", lastSeenDays: 2, lastAssessmentDate: "12 Jan 2025", treatment: "Atropine" },
  { id: "PT-003", name: "Preethi Suresh", phone: "+91 98765 41003", age: 13, risk: "Moderate", sphere: "-1.75 D", progression: 0.45, axialLength: "23.8 mm", lastSeenLabel: "4 days ago", lastSeenDays: 4, lastAssessmentDate: "10 Jan 2025", treatment: "Stellest lens" },
  { id: "PT-004", name: "Kiran Balasubram", phone: "+91 98765 41004", age: 10, risk: "Low", sphere: "-4.00 D", progression: 0.3, axialLength: "25.1 mm", lastSeenLabel: "1 day ago", lastSeenDays: 1, lastAssessmentDate: "13 Jan 2025", treatment: "OK lens" },
  { id: "PT-005", name: "Sanjay Mohan", phone: "+91 98765 41005", age: 14, risk: "Moderate", sphere: "-2.50 D", progression: 0.55, axialLength: "24.0 mm", lastSeenLabel: "10 days ago", lastSeenDays: 10, lastAssessmentDate: "03 Jan 2025", treatment: "None" },
  { id: "PT-006", name: "Diya Nair", phone: "+91 98765 41006", age: 8, risk: "High", sphere: "-1.25 D", progression: 0.8, axialLength: "23.5 mm", lastSeenLabel: "5 weeks ago", lastSeenDays: 35, lastAssessmentDate: "08 Dec 2024", treatment: "Atropine" },
  { id: "PT-007", name: "Arjun Kumar", phone: "+91 98765 41007", age: 12, risk: "High", sphere: "-3.75 D", progression: 0.95, axialLength: "25.2 mm", lastSeenLabel: "6 weeks ago", lastSeenDays: 42, lastAssessmentDate: "01 Dec 2024", treatment: "Stellest lens" },
  { id: "PT-008", name: "Meena Rajesh", phone: "+91 98765 41008", age: 11, risk: "Moderate", sphere: "-2.25 D", progression: 0.5, axialLength: "24.1 mm", lastSeenLabel: "5 weeks ago", lastSeenDays: 35, lastAssessmentDate: "08 Dec 2024", treatment: "None" },
  { id: "PT-009", name: "Vikram Singh", phone: "+91 98765 41009", age: 15, risk: "High", sphere: "-5.00 D", progression: 1.2, axialLength: "26.0 mm", lastSeenLabel: "8 weeks ago", lastSeenDays: 56, lastAssessmentDate: "18 Nov 2024", treatment: "Atropine" },
  { id: "PT-010", name: "Kavya Pillai", phone: "+91 98765 41010", age: 10, risk: "Low", sphere: "-1.00 D", progression: 0.2, axialLength: "23.2 mm", lastSeenLabel: "3 days ago", lastSeenDays: 3, lastAssessmentDate: "11 Jan 2025", treatment: "None" },
  { id: "PT-011", name: "Rahul Sharma", phone: "+91 98765 41011", age: 9, risk: "High", sphere: "-2.75 D", progression: 1.05, axialLength: "24.6 mm", lastSeenLabel: "1 week ago", lastSeenDays: 7, lastAssessmentDate: "06 Jan 2025", treatment: "Stellest lens" },
  { id: "PT-012", name: "Sneha Krishnan", phone: "+91 98765 41012", age: 13, risk: "Moderate", sphere: "-2.00 D", progression: 0.4, axialLength: "23.9 mm", lastSeenLabel: "2 weeks ago", lastSeenDays: 14, lastAssessmentDate: "30 Dec 2024", treatment: "OK lens" },
  { id: "PT-013", name: "Dev Menon", phone: "+91 98765 41013", age: 8, risk: "High", sphere: "-1.50 D", progression: 0.85, axialLength: "23.6 mm", lastSeenLabel: "3 days ago", lastSeenDays: 3, lastAssessmentDate: "11 Jan 2025", treatment: "Atropine" },
  { id: "PT-014", name: "Ananya Reddy", phone: "+91 98765 41014", age: 14, risk: "Low", sphere: "-3.00 D", progression: 0.25, axialLength: "24.3 mm", lastSeenLabel: "1 day ago", lastSeenDays: 1, lastAssessmentDate: "13 Jan 2025", treatment: "None" },
  { id: "PT-015", name: "Ishaan Gupta", phone: "+91 98765 41015", age: 11, risk: "Moderate", sphere: "-2.50 D", progression: 0.6, axialLength: "24.2 mm", lastSeenLabel: "6 days ago", lastSeenDays: 6, lastAssessmentDate: "08 Jan 2025", treatment: "Stellest lens" },
  { id: "PT-016", name: "Pooja Venkat", phone: "+91 98765 41016", age: 12, risk: "Low", sphere: "-1.75 D", progression: 0.15, axialLength: "23.4 mm", lastSeenLabel: "4 days ago", lastSeenDays: 4, lastAssessmentDate: "10 Jan 2025", treatment: "None" },
  { id: "PT-017", name: "Nikhil Patel", phone: "+91 98765 41017", age: 10, risk: "High", sphere: "-3.50 D", progression: 1.0, axialLength: "25.0 mm", lastSeenLabel: "2 weeks ago", lastSeenDays: 14, lastAssessmentDate: "30 Dec 2024", treatment: "Atropine" },
  { id: "PT-018", name: "Riya Banerjee", phone: "+91 98765 41018", age: 9, risk: "Moderate", sphere: "-1.25 D", progression: 0.35, axialLength: "23.7 mm", lastSeenLabel: "3 weeks ago", lastSeenDays: 21, lastAssessmentDate: "23 Dec 2024", treatment: "Stellest lens" },
  { id: "PT-019", name: "Aryan Chopra", phone: "+91 98765 41019", age: 13, risk: "Low", sphere: "-0.75 D", progression: 0.1, axialLength: "23.1 mm", lastSeenLabel: "5 days ago", lastSeenDays: 5, lastAssessmentDate: "09 Jan 2025", treatment: "None" },
  { id: "PT-020", name: "Lakshmi Iyer", phone: "+91 98765 41020", age: 11, risk: "High", sphere: "-4.25 D", progression: 0.9, axialLength: "25.3 mm", lastSeenLabel: "1 week ago", lastSeenDays: 7, lastAssessmentDate: "06 Jan 2025", treatment: "OK lens" },
];

const FILTERS: FilterKey[] = [
  "All patients",
  "High risk",
  "Moderate",
  "Low risk",
  "Overdue review",
];

const SORT_LABELS: Record<SortKey, string> = {
  lastSeen: "Last seen",
  name: "Name",
  risk: "Risk",
  progression: "Progression",
};

const RISK_BADGE: Record<Risk, { bg: string; text: string; bar: string }> = {
  High: { bg: "#FEF2F2", text: "#991B1B", bar: "#DC2626" },
  Moderate: { bg: "#FFFBEB", text: "#92400E", bar: "#D97706" },
  Low: { bg: "#F0FDF4", text: "#166534", bar: "#16A34A" },
};

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All patients");
  const [sortBy, setSortBy] = useState<SortKey>("lastSeen");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PATIENTS.filter((patient) => {
      const byText =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q) ||
        patient.phone.toLowerCase().includes(q);

      let byRisk = true;
      if (activeFilter === "High risk") byRisk = patient.risk === "High";
      else if (activeFilter === "Moderate") byRisk = patient.risk === "Moderate";
      else if (activeFilter === "Low risk") byRisk = patient.risk === "Low";
      else if (activeFilter === "Overdue review") byRisk = patient.lastSeenDays > 21;

      return byText && byRisk;
    });

    return filtered.toSorted((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progression") return b.progression - a.progression;
      if (sortBy === "risk") {
        const score: Record<Risk, number> = { High: 3, Moderate: 2, Low: 1 };
        return score[b.risk] - score[a.risk];
      }
      return a.lastSeenDays - b.lastSeenDays;
    });
  }, [activeFilter, query, sortBy]);

  const start = filteredPatients.length === 0 ? 0 : 1;
  const end = filteredPatients.length;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 min-h-full">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-medium text-[#111827]">All patients</h2>
          <p className="text-[13px] text-[#6B7280] mt-1">148 patients across all risk levels</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID, or phone..."
              className="w-[240px] max-w-full h-9 rounded-lg border border-[#E5E4DF] bg-white pl-9 pr-3 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#1D9E75]"
            />
          </div>

          <button className="h-9 px-3 rounded-lg border border-[#E5E4DF] bg-white text-[#374151] text-[13px] flex items-center gap-2 hover:bg-[#F9F8F6] transition-colors">
            <FilterIcon />
            Filter
          </button>

          <button className="h-9 px-4 rounded-lg bg-[#1D9E75] text-white text-[13px] font-medium hover:bg-[#158963] transition-colors">
            + Add Patient
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={[
                  "px-3 py-1.5 rounded-full border text-[12px] transition-colors",
                  active
                    ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                    : "bg-white border-[#E5E4DF] text-[#6B7280] hover:bg-[#F9F8F6]",
                ].join(" ")}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setSortMenuOpen((prev) => !prev)}
              className="h-8 px-3 rounded-lg border border-[#E5E4DF] bg-white text-[12px] text-[#374151] flex items-center gap-1.5 hover:bg-[#F9F8F6]"
            >
              Sort by: {SORT_LABELS[sortBy]}
              <ChevronDownIcon />
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E5E4DF] rounded-lg shadow-sm z-20 overflow-hidden">
                {(["lastSeen", "name", "risk", "progression"] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key);
                      setSortMenuOpen(false);
                    }}
                    className={[
                      "w-full text-left px-3 py-2 text-[12px] hover:bg-[#F9F8F6]",
                      sortBy === key ? "text-[#1D9E75] font-medium" : "text-[#374151]",
                    ].join(" ")}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-8 rounded-lg border border-[#E5E4DF] bg-white p-0.5 flex items-center">
            <button className="h-full w-8 rounded-md text-[#9CA3AF] hover:bg-[#F3F4F6] flex items-center justify-center">
              <GridIcon />
            </button>
            <button className="h-full w-8 rounded-md bg-[#1D9E75] text-white flex items-center justify-center">
              <ListIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E4DF] rounded-[10px] overflow-hidden">
        <div className="overflow-auto max-h-[68vh]">
          <table className="w-full min-w-[1250px]">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-[#E5E4DF]">
                {[
                  "Patient",
                  "ID",
                  "Age",
                  "Risk",
                  "Sphere (mean)",
                  "Progression",
                  "Axial length",
                  "Last assessment",
                  "Treatment",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const riskTheme = RISK_BADGE[patient.risk];
                return (
                  <tr
                    key={patient.id}
                    className="group h-[60px] border-b border-[#E5E4DF] last:border-b-0 hover:bg-[#F9F8F6] transition-colors"
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-[11px] font-semibold">
                          {getInitials(patient.name)}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-[#111827]">{patient.name}</div>
                          <div className="text-[11px] text-[#9CA3AF]">{patient.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-[12px] text-[#6B7280] font-mono whitespace-nowrap">{patient.id}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-[13px] text-[#111827]">{patient.age}</span>{" "}
                      <span className="text-[12px] text-[#9CA3AF]">yrs</span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ background: riskTheme.bg, color: riskTheme.text }}
                      >
                        {patient.risk}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[13px] text-[#111827] whitespace-nowrap">{patient.sphere}</td>
                    <td className="px-4 py-2">
                      <div className="text-[13px] font-medium text-[#111827] whitespace-nowrap">
                        {patient.progression.toFixed(2)} D/yr
                      </div>
                      <div className="mt-1 h-[3px] w-[72px] rounded-full bg-[#F3F4F6] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((patient.progression / 1.25) * 100, 100)}%`,
                            background: riskTheme.bar,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-[13px] text-[#111827] whitespace-nowrap">{patient.axialLength || "—"}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-[13px] text-[#111827]">{patient.lastSeenLabel}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{patient.lastAssessmentDate}</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-2.5 py-0.5 text-[11px] text-[#4B5563]">
                        {patient.treatment}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-[13px] text-[#9CA3AF]">
                    No patients match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#E5E4DF] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <span className="text-[12px] text-[#6B7280]">
            Showing {start}-{end} of {TOTAL_PATIENTS} patients
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="h-8 px-3 text-[12px] rounded-md border border-[#E5E4DF] text-[#6B7280] bg-white hover:bg-[#F9F8F6]">
              ← Prev
            </button>
            <button className="h-8 w-8 text-[12px] rounded-md bg-[#1D9E75] text-white">1</button>
            <button className="h-8 w-8 text-[12px] rounded-md border border-[#E5E4DF] text-[#6B7280] bg-white hover:bg-[#F9F8F6]">2</button>
            <button className="h-8 w-8 text-[12px] rounded-md border border-[#E5E4DF] text-[#6B7280] bg-white hover:bg-[#F9F8F6]">3</button>
            <span className="text-[12px] text-[#9CA3AF] px-1">...</span>
            <button className="h-8 w-8 text-[12px] rounded-md border border-[#E5E4DF] text-[#6B7280] bg-white hover:bg-[#F9F8F6]">8</button>
            <button className="h-8 px-3 text-[12px] rounded-md border border-[#E5E4DF] text-[#6B7280] bg-white hover:bg-[#F9F8F6]">
              Next →
            </button>
          </div>

          <button className="h-8 px-3 text-[12px] rounded-md border border-[#E5E4DF] text-[#374151] bg-white hover:bg-[#F9F8F6] flex items-center gap-1.5">
            20 per page <ChevronDownIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

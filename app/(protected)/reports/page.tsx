"use client";

import { useMemo, useState } from "react";

type ReportType = "Clinical note" | "Patient summary" | "Full export";
type ReportStatus = "Ready" | "Pending" | "Failed";
type FilterType = "All" | "Clinical notes" | "Patient summaries" | "Exports";

interface ReportRow {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  patientInitials: string;
  type: ReportType;
  relativeTime: string;
  generatedAt: string;
  status: ReportStatus;
}

const INITIAL_REPORTS: ReportRow[] = [
  { id: "REP-0041", patientName: "Aanya Mehta", patientId: "PT-001", age: 11, patientInitials: "AM", type: "Clinical note", relativeTime: "2 hours ago", generatedAt: "12 Jan 2025, 14:32", status: "Ready" },
  { id: "REP-0040", patientName: "Rohan Iyer", patientId: "PT-002", age: 9, patientInitials: "RI", type: "Patient summary", relativeTime: "3 hours ago", generatedAt: "12 Jan 2025, 13:10", status: "Ready" },
  { id: "REP-0039", patientName: "Preethi S", patientId: "PT-003", age: 13, patientInitials: "PS", type: "Full export", relativeTime: "5 hours ago", generatedAt: "12 Jan 2025, 11:42", status: "Ready" },
  { id: "REP-0038", patientName: "Kiran B", patientId: "PT-004", age: 10, patientInitials: "KB", type: "Clinical note", relativeTime: "1 day ago", generatedAt: "11 Jan 2025, 16:05", status: "Ready" },
  { id: "REP-0037", patientName: "Sanjay M", patientId: "PT-005", age: 14, patientInitials: "SM", type: "Patient summary", relativeTime: "1 day ago", generatedAt: "11 Jan 2025, 15:02", status: "Ready" },
  { id: "REP-0036", patientName: "Diya N", patientId: "PT-006", age: 8, patientInitials: "DN", type: "Clinical note", relativeTime: "2 days ago", generatedAt: "10 Jan 2025, 12:21", status: "Ready" },
  { id: "REP-0035", patientName: "Vikram S", patientId: "PT-009", age: 15, patientInitials: "VS", type: "Full export", relativeTime: "3 days ago", generatedAt: "09 Jan 2025, 10:54", status: "Failed" },
  { id: "REP-0034", patientName: "Arjun K", patientId: "PT-007", age: 12, patientInitials: "AK", type: "Clinical note", relativeTime: "3 days ago", generatedAt: "09 Jan 2025, 09:17", status: "Ready" },
  { id: "REP-0033", patientName: "Meena R", patientId: "PT-008", age: 11, patientInitials: "MR", type: "Patient summary", relativeTime: "4 days ago", generatedAt: "08 Jan 2025, 17:28", status: "Ready" },
  { id: "REP-0032", patientName: "Kavya P", patientId: "PT-010", age: 10, patientInitials: "KP", type: "Clinical note", relativeTime: "—", generatedAt: "—", status: "Pending" },
];

const PATIENT_OPTIONS = [
  { name: "Aanya Mehta", patientId: "PT-001", age: 11 },
  { name: "Rohan Iyer", patientId: "PT-002", age: 9 },
  { name: "Preethi Suresh", patientId: "PT-003", age: 13 },
  { name: "Kiran Balasubram", patientId: "PT-004", age: 10 },
  { name: "Sanjay Mohan", patientId: "PT-005", age: 14 },
  { name: "Diya Nair", patientId: "PT-006", age: 8 },
];

const FILTERS: FilterType[] = ["All", "Clinical notes", "Patient summaries", "Exports"];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileTextIcon({ color = "#1D9E75" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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

function StatusDot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />;
}

function typeStyles(type: ReportType) {
  if (type === "Clinical note") return { bg: "#EFF6FF", text: "#1D4ED8" };
  if (type === "Patient summary") return { bg: "#F5F3FF", text: "#6D28D9" };
  return { bg: "#F3F4F6", text: "#374151" };
}

function statusConfig(status: ReportStatus) {
  if (status === "Ready") return { color: "#16A34A", label: "Ready" };
  if (status === "Pending") return { color: "#D97706", label: "Generating..." };
  return { color: "#DC2626", label: "Failed" };
}

export default function ReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<(typeof PATIENT_OPTIONS)[number] | null>(null);
  const [newType, setNewType] = useState<ReportType>("Clinical note");
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2025-01-31");

  const visibleReports = useMemo(() => {
    return reports.filter((row) => {
      if (filter === "All") return true;
      if (filter === "Clinical notes") return row.type === "Clinical note";
      if (filter === "Patient summaries") return row.type === "Patient summary";
      return row.type === "Full export";
    });
  }, [reports, filter]);

  const selectedReport = reports.find((r) => r.id === selectedId) ?? null;

  const patientHits = PATIENT_OPTIONS.filter((p) => {
    const q = patientQuery.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q);
  }).slice(0, 6);

  function onDownload(reportId: string) {
    alert(`Downloading ${reportId}.pdf...`);
  }

  function onRetry(reportId: string) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: "Pending", relativeTime: "just now", generatedAt: "Queued..." }
          : r
      )
    );
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: "Ready", relativeTime: "just now", generatedAt: "13 Jan 2025, 10:08" }
            : r
        )
      );
    }, 2000);
  }

  function onGenerate() {
    if (!selectedPatient) return;
    const nextId = `REP-${String(42 + reports.length).padStart(4, "0")}`;
    const newRow: ReportRow = {
      id: nextId,
      patientName: selectedPatient.name,
      patientId: selectedPatient.patientId,
      age: selectedPatient.age,
      patientInitials: selectedPatient.name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase(),
      type: newType,
      relativeTime: "just now",
      generatedAt: "Queued...",
      status: "Pending",
    };
    setReports((prev) => [newRow, ...prev]);
    setSelectedId(newRow.id);
    setModalOpen(false);
    setSelectedPatient(null);
    setPatientQuery("");
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === newRow.id
            ? { ...r, status: "Ready", generatedAt: "13 Jan 2025, 10:12", relativeTime: "just now" }
            : r
        )
      );
    }, 2000);
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 min-h-full">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-medium text-[#111827]">Reports</h2>
          <p className="text-[13px] text-[#6B7280] mt-1">41 reports generated this month</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-9 rounded-lg border border-[#E5E4DF] bg-white px-2 flex items-center gap-2 text-[12px] text-[#374151]">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="outline-none" />
            <span>→</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="outline-none" />
          </div>
          <button className="h-9 px-3 rounded-lg border border-[#E5E4DF] bg-white text-[13px] text-[#374151] hover:bg-[#F9F8F6] flex items-center gap-2">
            <DownloadIcon />
            Export all
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="h-9 px-4 rounded-lg bg-[#1D9E75] text-white text-[13px] font-medium hover:bg-[#158963]"
          >
            + Generate report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Reports this month</p>
          <p className="text-[30px] leading-none text-[#111827] font-medium mt-2">41</p>
          <p className="text-[12px] text-[#16A34A] mt-2">↑12 from last month</p>
        </div>
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Pending generation</p>
          <p className="text-[30px] leading-none text-[#111827] font-medium mt-2">3</p>
          <p className="text-[12px] text-[#D97706] mt-2">Queued</p>
        </div>
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Avg generation time</p>
          <p className="text-[30px] leading-none text-[#111827] font-medium mt-2">2.4s</p>
          <p className="text-[12px] text-[#6B7280] mt-2">Via Gemini AI</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="flex-1 min-w-0 bg-white border border-[#E5E4DF] rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E4DF] flex items-center gap-2 flex-wrap">
            {FILTERS.map((pill) => {
              const active = filter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setFilter(pill)}
                  className={[
                    "px-3 py-1.5 rounded-full border text-[12px] transition-colors",
                    active
                      ? "bg-[#1D9E75] border-[#1D9E75] text-white"
                      : "bg-white border-[#E5E4DF] text-[#6B7280] hover:bg-[#F9F8F6]",
                  ].join(" ")}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px]">
              <thead>
                <tr className="border-b border-[#E5E4DF]">
                  {["Report", "Patient", "Type", "Generated", "Status", "Actions"].map((head) => (
                    <th key={head} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleReports.map((row) => {
                  const selected = row.id === selectedId;
                  const typeTheme = typeStyles(row.type);
                  const statusTheme = statusConfig(row.status);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedId(row.id)}
                      className="group border-b border-[#E5E4DF] last:border-b-0 hover:bg-[#F9F8F6] cursor-pointer"
                    >
                      <td className="px-4 py-3" style={{ borderLeft: selected ? "3px solid #1D9E75" : "3px solid transparent" }}>
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-md bg-[#F0FBF7] inline-flex items-center justify-center">
                            <FileTextIcon />
                          </span>
                          <div>
                            <p className="text-[13px] font-medium text-[#111827]">Myopia Assessment Report</p>
                            <p className="text-[11px] text-[#9CA3AF] font-mono">{row.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1D9E75] text-white text-[10px] font-semibold flex items-center justify-center">
                            {row.patientInitials}
                          </div>
                          <div>
                            <p className="text-[13px] text-[#111827] font-medium">{row.patientName}</p>
                            <p className="text-[11px] text-[#9CA3AF]">{row.patientId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: typeTheme.bg, color: typeTheme.text }}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] text-[#111827]">{row.relativeTime}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{row.generatedAt}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: statusTheme.color }}>
                          <StatusDot color={statusTheme.color} />
                          {statusTheme.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(row.id);
                            }}
                            className="text-[12px] text-[#1D9E75] hover:underline inline-flex items-center gap-1"
                          >
                            <EyeIcon />
                            View
                          </button>
                          {row.status === "Failed" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRetry(row.id);
                              }}
                              className="text-[12px] text-[#D97706] hover:underline"
                            >
                              Retry
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownload(row.id);
                              }}
                              className="text-[12px] text-[#1D9E75] hover:underline inline-flex items-center gap-1"
                            >
                              <DownloadIcon />
                              Download PDF
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(`https://stellest.app/reports/${row.id}`);
                            }}
                            className="text-[12px] text-[#1D9E75] hover:underline inline-flex items-center gap-1"
                          >
                            <LinkIcon />
                            Copy link
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="w-full xl:w-[300px] shrink-0 space-y-4">
          <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-4">
            <h3 className="text-[13px] font-medium text-[#111827] mb-3">Filters</h3>
            <div className="space-y-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    "w-full text-left text-[12px] px-3 py-2 rounded-lg border transition-colors",
                    f === filter
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]"
                      : "bg-white border-[#E5E4DF] text-[#6B7280] hover:bg-[#F9F8F6]",
                  ].join(" ")}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-4">
            <h3 className="text-[13px] font-medium text-[#111827] mb-3">Report preview</h3>
            {selectedReport ? (
              <div className="border border-[#E5E4DF] rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[#111827]">{selectedReport.id}</p>
                  <button
                    onClick={() => onDownload(selectedReport.id)}
                    className="text-[11px] text-[#1D9E75] font-medium hover:underline"
                  >
                    Download
                  </button>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-1">
                  {selectedReport.patientName} · {selectedReport.patientId} · {selectedReport.age} yrs
                </p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Generated: {selectedReport.generatedAt}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Type: {selectedReport.type}</p>

                <div className="my-3 h-px bg-[#E5E4DF]" />
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B7280]">Clinical note</p>
                <div className="mt-2 h-[200px] overflow-auto border border-[#E5E4DF] rounded-lg bg-[#F9FAFB] p-2.5 text-[12px] text-[#374151]">
                  Patient {selectedReport.patientName}, aged {selectedReport.age}, presents with a predicted myopia progression of 0.90 D/yr, placing the case in the high-risk category. Recommend stricter near-work hygiene, minimum 2 hours of outdoor activity daily, and follow-up refraction with axial length monitoring in 8 to 12 weeks.
                </div>

                <div className="my-3 h-px bg-[#E5E4DF]" />
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B7280]">Patient summary</p>
                <p className="mt-2 text-[12px] text-[#374151]">
                  Your child&apos;s eye check shows that their glasses prescription is growing faster than average. We recommend daily outdoor time and regular follow-up visits to slow progression.
                </p>

                <div className="mt-3 flex gap-2">
                  <button className="flex-1 h-8 text-[11px] rounded-md border border-[#E5E4DF] text-[#374151] hover:bg-[#F9F8F6]">
                    Copy clinical note
                  </button>
                  <button className="flex-1 h-8 text-[11px] rounded-md border border-[#E5E4DF] text-[#374151] hover:bg-[#F9F8F6]">
                    Copy summary
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[280px] border border-dashed border-[#A7F3D0] rounded-lg bg-[#F8FFFC] flex flex-col items-center justify-center text-center px-4">
                <span className="w-12 h-12 rounded-xl border border-[#A7F3D0] bg-white inline-flex items-center justify-center mb-3">
                  <FileTextIcon />
                </span>
                <p className="text-[13px] text-[#6B7280]">Select a report to preview</p>
              </div>
            )}

            <div className="mt-3 text-[11px] text-[#9CA3AF] flex items-center gap-2">
              <span className="inline-flex w-4 h-4 rounded-full bg-[#F3F4F6] items-center justify-center text-[9px]">G</span>
              Powered by Gemini 1.5 Flash
            </div>
          </div>
        </aside>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E4DF] rounded-xl p-5">
            <h3 className="text-[15px] font-semibold text-[#111827]">Generate report</h3>
            <p className="text-[12px] text-[#6B7280] mt-1">Create a new AI report for a selected patient.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[12px] font-medium text-[#374151]">Select patient</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    <SearchIcon />
                  </span>
                  <input
                    value={patientQuery}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      setSelectedPatient(null);
                    }}
                    placeholder="Search name or patient ID..."
                    className="w-full h-9 rounded-lg border border-[#E5E4DF] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[#1D9E75]"
                  />
                </div>
                <div className="mt-1 border border-[#E5E4DF] rounded-lg max-h-36 overflow-auto">
                  {patientHits.map((p) => (
                    <button
                      key={p.patientId}
                      onClick={() => {
                        setSelectedPatient(p);
                        setPatientQuery(`${p.name} · ${p.patientId}`);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] hover:bg-[#F9F8F6] border-b last:border-b-0 border-[#E5E4DF]"
                    >
                      {p.name} · {p.patientId}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#374151]">Report type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as ReportType)}
                  className="mt-1.5 w-full h-9 rounded-lg border border-[#E5E4DF] bg-white px-3 text-[13px] outline-none focus:border-[#1D9E75]"
                >
                  <option value="Clinical note">Clinical note</option>
                  <option value="Patient summary">Patient summary</option>
                  <option value="Full export">Full export</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="h-9 px-4 rounded-lg border border-[#E5E4DF] text-[13px] text-[#374151] hover:bg-[#F9F8F6]"
              >
                Cancel
              </button>
              <button
                onClick={onGenerate}
                disabled={!selectedPatient}
                className="h-9 px-4 rounded-lg bg-[#1D9E75] text-white text-[13px] font-medium hover:bg-[#158963] disabled:opacity-50"
              >
                Generate →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";

type ReportType = "Clinical note" | "Patient summary" | "Full export";
type ReportStatus = "Ready" | "Pending" | "Failed";

interface ReportData {
  id: string;
  patientName: string;
  patientId: string;
  age: number;
  type: ReportType;
  generatedAt: string;
  status: ReportStatus;
}

const REPORTS: Record<string, ReportData> = {
  "REP-0041": {
    id: "REP-0041",
    patientName: "Aanya Mehta",
    patientId: "PT-001",
    age: 11,
    type: "Clinical note",
    generatedAt: "12 Jan 2025, 14:32",
    status: "Ready",
  },
  "REP-0040": {
    id: "REP-0040",
    patientName: "Rohan Iyer",
    patientId: "PT-002",
    age: 9,
    type: "Patient summary",
    generatedAt: "12 Jan 2025, 13:10",
    status: "Ready",
  },
};

function statusStyle(status: ReportStatus) {
  if (status === "Ready") return { text: "#166534", bg: "#F0FDF4", label: "Ready" };
  if (status === "Pending") return { text: "#92400E", bg: "#FFFBEB", label: "Generating..." };
  return { text: "#991B1B", bg: "#FEF2F2", label: "Failed" };
}

const actualPoints = [
  { age: 8, sphere: -0.5 },
  { age: 8.5, sphere: -0.75 },
  { age: 9, sphere: -1.25 },
  { age: 9.5, sphere: -1.75 },
  { age: 10, sphere: -2.25 },
  { age: 10.5, sphere: -3.0 },
  { age: 11, sphere: -3.25 },
];

const treatedPoints = [
  { age: 11, sphere: -3.25 },
  { age: 12, sphere: -3.8 },
  { age: 13, sphere: -4.2 },
  { age: 14, sphere: -4.5 },
  { age: 15, sphere: -4.72 },
  { age: 16, sphere: -4.88 },
  { age: 17, sphere: -4.98 },
  { age: 18, sphere: -5.05 },
];

const untreatedPoints = [
  { age: 11, sphere: -3.25 },
  { age: 12, sphere: -4.15 },
  { age: 13, sphere: -5.2 },
  { age: 14, sphere: -6.1 },
  { age: 15, sphere: -6.85 },
  { age: 16, sphere: -7.4 },
  { age: 17, sphere: -7.8 },
  { age: 18, sphere: -8.05 },
];

function pointToSvg(age: number, sphere: number) {
  const minAge = 8;
  const maxAge = 18;
  const minSphere = -8.2;
  const maxSphere = 0;
  const x = 40 + ((age - minAge) / (maxAge - minAge)) * 500;
  const y = 250 - ((sphere - minSphere) / (maxSphere - minSphere)) * 220;
  return { x, y };
}

function toPath(points: { age: number; sphere: number }[]) {
  return points
    .map((p, idx) => {
      const pt = pointToSvg(p.age, p.sphere);
      return `${idx === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    })
    .join(" ");
}

export default async function ReportPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = REPORTS[id] ?? {
    id,
    patientName: "Unknown patient",
    patientId: "N/A",
    age: 0,
    type: "Clinical note" as ReportType,
    generatedAt: "—",
    status: "Pending" as ReportStatus,
  };
  const status = statusStyle(report.status);
  const actualPath = toPath(actualPoints);
  const treatedPath = toPath(treatedPoints);
  const untreatedPath = toPath(untreatedPoints);

  return (
    <div className="p-4 sm:p-6 min-h-full bg-[#F7F6F3]">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-medium text-[#111827]">Clinical Report Overview</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Professional clinic format with progression analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/reports"
              className="h-9 px-3 rounded-lg border border-[#E5E4DF] bg-white text-[13px] text-[#374151] inline-flex items-center hover:bg-[#F9F8F6]"
            >
              ← Back to reports
            </Link>
            <Link
              href={`/reports/${report.id}/print`}
              className="h-9 px-3 rounded-lg bg-[#1D9E75] text-white text-[13px] font-medium inline-flex items-center hover:bg-[#158963]"
            >
              Print / PDF
            </Link>
          </div>
        </div>

        <section className="bg-white border border-[#E5E4DF] rounded-[12px] overflow-hidden shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
            <div className="p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6B7280]">Stellest Clinical Decision Support</p>
              <h3 className="text-[18px] font-medium text-[#111827] mt-1">Myopia Progression Report</h3>
              <p className="text-[12px] text-[#6B7280] mt-1">Reference ID: <span className="font-mono">{report.id}</span></p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <p className="text-[12px] text-[#6B7280]">Patient Name <span className="text-[#111827] font-medium ml-2">{report.patientName}</span></p>
                <p className="text-[12px] text-[#6B7280]">Patient ID <span className="text-[#111827] font-medium ml-2">{report.patientId}</span></p>
                <p className="text-[12px] text-[#6B7280]">Age <span className="text-[#111827] font-medium ml-2">{report.age} years</span></p>
                <p className="text-[12px] text-[#6B7280]">Generated <span className="text-[#111827] font-medium ml-2">{report.generatedAt}</span></p>
              </div>
            </div>
            <div className="bg-[#1D9E75] p-4 sm:p-5 text-white flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-white/85">Clinical Risk Category</p>
                <p className="text-[28px] leading-none font-semibold mt-2">High</p>
                <p className="text-[12px] text-white/85 mt-2">Risk score: 0.84 / 1.00</p>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-white" style={{ width: "84%" }} />
                </div>
                <p className="text-[11px] text-white/85 mt-2">Progression trend: Accelerating</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1fr_310px] gap-4">
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#6B7280]">Progression Analysis Graph</p>
                <span className="text-[11px] text-[#6B7280]">Sphere (D) vs Age</span>
              </div>
              <div className="rounded-lg border border-[#E5E4DF] bg-[#FCFCFB] p-3 overflow-x-auto">
                <svg viewBox="0 0 560 270" className="w-full min-w-[560px] h-[260px]" role="img" aria-label="Progression analysis graph">
                  <line x1="40" y1="250" x2="540" y2="250" stroke="#D1D5DB" strokeWidth="1" />
                  <line x1="40" y1="30" x2="40" y2="250" stroke="#D1D5DB" strokeWidth="1" />
                  <line x1="40" y1="30" x2="540" y2="30" stroke="#F3F4F6" strokeWidth="1" />
                  <line x1="40" y1="85" x2="540" y2="85" stroke="#F3F4F6" strokeWidth="1" />
                  <line x1="40" y1="140" x2="540" y2="140" stroke="#F3F4F6" strokeWidth="1" />
                  <line x1="40" y1="195" x2="540" y2="195" stroke="#F3F4F6" strokeWidth="1" />

                  <path d={actualPath} fill="none" stroke="#1D9E75" strokeWidth="2.5" />
                  <path d={treatedPath} fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="6 5" />
                  <path d={untreatedPath} fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="6 5" />

                  {actualPoints.map((p) => {
                    const pt = pointToSvg(p.age, p.sphere);
                    return <circle key={`${p.age}-${p.sphere}`} cx={pt.x} cy={pt.y} r="3.2" fill="#1D9E75" />;
                  })}

                  <line x1={pointToSvg(11, -3.2).x} y1="30" x2={pointToSvg(11, -3.2).x} y2="250" stroke="#9CA3AF" strokeDasharray="4 4" />
                  <rect x={pointToSvg(11, -3.2).x - 36} y="8" width="72" height="16" rx="8" fill="#FFFFFF" stroke="#E5E7EB" />
                  <text x={pointToSvg(11, -3.2).x} y="20" textAnchor="middle" fontSize="10" fill="#6B7280">Today · 11 yrs</text>

                  <text x="40" y="264" fontSize="10" fill="#6B7280">8</text>
                  <text x="140" y="264" fontSize="10" fill="#6B7280">10</text>
                  <text x="240" y="264" fontSize="10" fill="#6B7280">12</text>
                  <text x="340" y="264" fontSize="10" fill="#6B7280">14</text>
                  <text x="440" y="264" fontSize="10" fill="#6B7280">16</text>
                  <text x="534" y="264" fontSize="10" fill="#6B7280">18</text>

                  <text x="8" y="35" fontSize="10" fill="#6B7280">0</text>
                  <text x="4" y="90" fontSize="10" fill="#6B7280">-2</text>
                  <text x="4" y="145" fontSize="10" fill="#6B7280">-4</text>
                  <text x="4" y="200" fontSize="10" fill="#6B7280">-6</text>
                  <text x="4" y="252" fontSize="10" fill="#6B7280">-8</text>
                </svg>

                <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-[#6B7280]">
                  <span className="inline-flex items-center gap-1.5"><span className="w-4 h-[2px] bg-[#1D9E75]" />Actual measurements</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-4 h-[2px] border-t-2 border-dashed border-[#10B981]" />Treated trajectory</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-4 h-[2px] border-t-2 border-dashed border-[#DC2626]" />Untreated trajectory</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#6B7280] mb-3">Clinical Interpretation</p>
              <div className="rounded-lg border border-[#A7F3D0] bg-[#F0FBF7] p-3 text-[13px] text-[#065F46] leading-6">
                The progression curve suggests high-risk acceleration between ages 10-12. With continued Stellest treatment, projected refractive error at 18 years is approximately <span className="font-semibold">-5.05 D</span>, compared with <span className="font-semibold">-8.05 D</span> in the untreated model.
              </div>
              <div className="mt-3 rounded-lg border border-[#E5E4DF] bg-[#F9FAFB] p-3 text-[13px] text-[#374151] leading-7">
                Patient {report.patientName}, aged {report.age}, presents with bilateral progressive myopia and a high-risk trajectory based on recent refractive acceleration. Continue strict optical myopia control, increase outdoor exposure to at least 2 hours daily, and review again in 8-12 weeks for objective response monitoring.
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4">
              <p className="text-[13px] font-medium text-[#111827] mb-3">Report Metrics</p>
              <div className="space-y-2.5">
                <div className="rounded-lg border border-[#E5E4DF] bg-[#FAFAF9] px-3 py-2">
                  <p className="text-[11px] text-[#6B7280]">Current sphere</p>
                  <p className="text-[14px] font-medium text-[#111827]">-3.25 D</p>
                </div>
                <div className="rounded-lg border border-[#E5E4DF] bg-[#ECFDF5] px-3 py-2">
                  <p className="text-[11px] text-[#047857]">Projected with treatment</p>
                  <p className="text-[14px] font-medium text-[#065F46]">-5.05 D at age 18</p>
                </div>
                <div className="rounded-lg border border-[#E5E4DF] bg-[#FEF2F2] px-3 py-2">
                  <p className="text-[11px] text-[#991B1B]">Projected untreated</p>
                  <p className="text-[14px] font-medium text-[#991B1B]">-8.05 D at age 18</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4">
              <p className="text-[13px] font-medium text-[#111827] mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button className="w-full h-9 rounded-lg border border-[#E5E4DF] text-[12px] text-[#374151] hover:bg-[#F9F8F6]">
                  Download PDF
                </button>
                <button className="w-full h-9 rounded-lg border border-[#E5E4DF] text-[12px] text-[#374151] hover:bg-[#F9F8F6]">
                  Copy Share Link
                </button>
                <button className="w-full h-9 rounded-lg border border-[#E5E4DF] text-[12px] text-[#374151] hover:bg-[#F9F8F6]">
                  Export JSON
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4">
              <p className="text-[13px] font-medium text-[#111827] mb-2">Report Metadata</p>
              <div className="space-y-1.5 text-[12px]">
                <p className="text-[#6B7280]">Status</p>
                <p>
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ background: status.bg, color: status.text }}
                  >
                    {status.label}
                  </span>
                </p>
                <p className="text-[#6B7280]">Model</p>
                <p className="text-[#111827]">Gemini 1.5 Flash</p>
                <p className="text-[#6B7280] mt-2">Version</p>
                <p className="text-[#111827]">v0.3-clinical-notes</p>
                <p className="text-[#6B7280] mt-2">Confidence</p>
                <p className="text-[#111827]">0.91</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

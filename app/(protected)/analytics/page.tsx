"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type ForecastMode = "sphere" | "axial";
type ForecastRange = "1yr" | "2yr" | "5yr";
type RiskLevel = "High" | "Moderate" | "Low";

interface PatientData {
  name: string;
  patientId: string;
  age: number;
  initials: string;
}

interface ReportPoint {
  x: number;
  y: number;
}

declare global {
  interface Window {
    Chart: any;
  }
}

const PATIENTS: PatientData[] = [
  { name: "Aanya Mehta", patientId: "PT-001", age: 11, initials: "AM" },
  { name: "Rohan Iyer", patientId: "PT-002", age: 9, initials: "RI" },
  { name: "Preethi Suresh", patientId: "PT-003", age: 13, initials: "PS" },
];

const SPHERE_ACTUAL: ReportPoint[] = [
  { x: 8.0, y: -0.5 },
  { x: 8.5, y: -0.75 },
  { x: 9.0, y: -1.25 },
  { x: 9.5, y: -1.75 },
  { x: 10.0, y: -2.25 },
  { x: 10.5, y: -3.0 },
  { x: 11.0, y: -3.25 },
];

const SPHERE_TREATED: ReportPoint[] = [
  { x: 11.0, y: -3.25 },
  { x: 12.0, y: -3.8 },
  { x: 13.0, y: -4.2 },
  { x: 14.0, y: -4.5 },
  { x: 15.0, y: -4.72 },
  { x: 16.0, y: -4.88 },
  { x: 17.0, y: -4.98 },
  { x: 18.0, y: -5.05 },
];

const SPHERE_UNTREATED: ReportPoint[] = [
  { x: 11.0, y: -3.25 },
  { x: 12.0, y: -4.15 },
  { x: 13.0, y: -5.2 },
  { x: 14.0, y: -6.1 },
  { x: 15.0, y: -6.85 },
  { x: 16.0, y: -7.4 },
  { x: 17.0, y: -7.8 },
  { x: 18.0, y: -8.05 },
];

const AL_ACTUAL: ReportPoint[] = [
  { x: 8, y: 23.2 },
  { x: 9, y: 23.6 },
  { x: 10, y: 24.1 },
  { x: 11, y: 24.8 },
];

const AL_TREATED: ReportPoint[] = [
  { x: 11, y: 24.8 },
  { x: 12, y: 25.1 },
  { x: 13, y: 25.35 },
  { x: 14, y: 25.55 },
  { x: 15, y: 25.75 },
  { x: 16, y: 25.9 },
  { x: 17, y: 26.0 },
  { x: 18, y: 26.1 },
];

const AL_UNTREATED: ReportPoint[] = [
  { x: 11, y: 24.8 },
  { x: 12, y: 25.35 },
  { x: 13, y: 25.85 },
  { x: 14, y: 26.25 },
  { x: 15, y: 26.55 },
  { x: 16, y: 26.8 },
  { x: 17, y: 27.05 },
  { x: 18, y: 27.25 },
];

const FACTORS = [
  { label: "Parental myopia (2)", value: 85, level: "High" as RiskLevel },
  { label: "Age of onset (8 yrs)", value: 78, level: "High" as RiskLevel },
  { label: "Axial length (24.8mm)", value: 72, level: "High" as RiskLevel },
  { label: "Near work (5h/day)", value: 52, level: "Moderate" as RiskLevel },
  { label: "Progression rate", value: 90, level: "High" as RiskLevel },
  { label: "Outdoor time (1.5h)", value: 45, level: "Moderate" as RiskLevel },
  { label: "Current treatment", value: 30, level: "Low" as RiskLevel },
];

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function TrendingDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function colorForFactor(value: number) {
  if (value > 70) return "#DC2626";
  if (value >= 40) return "#D97706";
  return "#16A34A";
}

function levelPill(level: RiskLevel) {
  if (level === "High") return { bg: "#FEF2F2", text: "#991B1B" };
  if (level === "Moderate") return { bg: "#FFFBEB", text: "#92400E" };
  return { bg: "#F0FDF4", text: "#166534" };
}

export default function AnalyticsPage() {
  const [chartReady, setChartReady] = useState(false);
  const [patientOpen, setPatientOpen] = useState(false);
  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [mode, setMode] = useState<ForecastMode>("sphere");
  const [range, setRange] = useState<ForecastRange>("5yr");
  const [barsAnimated, setBarsAnimated] = useState(false);
  const patientMenuRef = useRef<HTMLDivElement | null>(null);

  const mainRef = useRef<HTMLCanvasElement | null>(null);
  const annualRef = useRef<HTMLCanvasElement | null>(null);
  const axialRef = useRef<HTMLCanvasElement | null>(null);
  const cohortRef = useRef<HTMLCanvasElement | null>(null);

  const mainChartRef = useRef<any>(null);
  const annualChartRef = useRef<any>(null);
  const axialChartRef = useRef<any>(null);
  const cohortChartRef = useRef<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setBarsAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (patientMenuRef.current && !patientMenuRef.current.contains(e.target as Node)) {
        setPatientOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const rangeEnd = useMemo(() => {
    if (range === "1yr") return 12;
    if (range === "2yr") return 13;
    return 18;
  }, [range]);

  const filteredPatients = useMemo(() => {
    const q = patientQuery.toLowerCase().trim();
    if (!q) return PATIENTS;
    return PATIENTS.filter((p) => p.name.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q));
  }, [patientQuery]);

  useEffect(() => {
    if (!chartReady || !mainRef.current || !window.Chart) return;
    if (mainChartRef.current) mainChartRef.current.destroy();

    const C = window.Chart;
    const treated = (mode === "sphere" ? SPHERE_TREATED : AL_TREATED).filter((p) => p.x <= rangeEnd);
    const untreated = (mode === "sphere" ? SPHERE_UNTREATED : AL_UNTREATED).filter((p) => p.x <= rangeEnd);
    const actual = mode === "sphere" ? SPHERE_ACTUAL : AL_ACTUAL;
    const uncertainty = mode === "sphere" ? 0.3 : 0.2;
    const treatedUpper = treated.map((p) => ({ x: p.x, y: p.y + uncertainty }));
    const treatedLower = treated.map((p) => ({ x: p.x, y: p.y - uncertainty }));
    const untreatedUpper = untreated.map((p) => ({ x: p.x, y: p.y + uncertainty }));
    const untreatedLower = untreated.map((p) => ({ x: p.x, y: p.y - uncertainty }));

    const zonePlugin = {
      id: "riskZones",
      beforeDraw(chart: any) {
        if (mode !== "sphere") return;
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;
        const y = scales.y;
        const zones = [
          { top: 0, bottom: -0.5, color: "rgba(34,197,94,0.08)", label: "No myopia" },
          { top: -0.5, bottom: -3.0, color: "rgba(245,158,11,0.07)", label: "Mild-moderate" },
          { top: -3.0, bottom: -6.0, color: "rgba(249,115,22,0.07)", label: "High myopia" },
          { top: -6.0, bottom: -8.0, color: "rgba(239,68,68,0.08)", label: "Severe myopia" },
        ];
        zones.forEach((z: any) => {
          const yTop = y.getPixelForValue(z.top);
          const yBottom = y.getPixelForValue(z.bottom);
          ctx.fillStyle = z.color;
          ctx.fillRect(chartArea.left, Math.min(yTop, yBottom), chartArea.right - chartArea.left, Math.abs(yBottom - yTop));
          ctx.fillStyle = "#9CA3AF";
          ctx.font = "10px sans-serif";
          ctx.fillText(z.label, chartArea.right - 72, (yTop + yBottom) / 2);
        });
      },
    };

    mainChartRef.current = new C(mainRef.current, {
      type: "line",
      data: {
        datasets: [
          { label: "Treated lower", data: treatedLower, borderWidth: 0, pointRadius: 0, fill: false },
          { label: "Treated upper", data: treatedUpper, borderWidth: 0, pointRadius: 0, fill: "-1", backgroundColor: "rgba(29,158,117,0.08)" },
          { label: "Untreated lower", data: untreatedLower, borderWidth: 0, pointRadius: 0, fill: false },
          { label: "Untreated upper", data: untreatedUpper, borderWidth: 0, pointRadius: 0, fill: "-1", backgroundColor: "rgba(220,38,38,0.08)" },
          {
            label: "Actual measurements",
            data: actual,
            borderColor: "#1D9E75",
            borderWidth: 2.5,
            tension: 0.25,
            pointRadius: 4,
            pointBackgroundColor: "#FFFFFF",
            pointBorderWidth: 2,
            pointBorderColor: "#1D9E75",
          },
          {
            label: "Treated forecast",
            data: treated,
            borderColor: "#1D9E75",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            tension: 0.25,
          },
          {
            label: "Untreated forecast",
            data: untreated,
            borderColor: "#DC2626",
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            tension: 0.25,
          },
          {
            label: "Today",
            data: mode === "sphere" ? [{ x: 11, y: 0 }, { x: 11, y: -8 }] : [{ x: 11, y: 22 }, { x: 11, y: 28 }],
            borderColor: "#9CA3AF",
            borderDash: [4, 4],
            borderWidth: 1,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800 },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            min: 8,
            max: rangeEnd,
            title: { display: true, text: "Age (years)" },
            grid: { color: "#F3F4F6" },
          },
          y: mode === "sphere" ? {
            min: -8,
            max: 0,
            title: { display: true, text: "Spherical equivalent (D)" },
            grid: { color: "#F3F4F6" },
          } : {
            min: 22,
            max: 28,
            title: { display: true, text: "Axial length (mm)" },
            grid: { color: "#F3F4F6" },
          },
        },
      },
      plugins: [zonePlugin],
    });

    return () => {
      if (mainChartRef.current) mainChartRef.current.destroy();
    };
  }, [chartReady, mode, rangeEnd]);

  useEffect(() => {
    if (!chartReady || !annualRef.current || !window.Chart) return;
    if (annualChartRef.current) annualChartRef.current.destroy();
    const C = window.Chart;
    annualChartRef.current = new C(annualRef.current, {
      type: "bar",
      data: {
        labels: ["8-9", "9-10", "10-11"],
        datasets: [{
          data: [0.25, 0.5, 0.9],
          backgroundColor: ["#16A34A", "#D97706", "#DC2626"],
          borderColor: ["#16A34A", "#D97706", "#DC2626"],
          borderWidth: [1, 1, 2],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { min: 0, max: 1.5, grid: { color: "#F3F4F6" } } },
      },
    });
    return () => annualChartRef.current?.destroy();
  }, [chartReady]);

  useEffect(() => {
    if (!chartReady || !axialRef.current || !window.Chart) return;
    if (axialChartRef.current) axialChartRef.current.destroy();
    const C = window.Chart;
    axialChartRef.current = new C(axialRef.current, {
      type: "line",
      data: {
        labels: [8, 9, 10, 11],
        datasets: [
          { label: "Normal upper", data: [24.5, 24.5, 24.5, 24.5], borderWidth: 0, fill: false, pointRadius: 0 },
          { label: "Normal lower", data: [23.0, 23.0, 23.0, 23.0], borderWidth: 0, pointRadius: 0, fill: "-1", backgroundColor: "rgba(156,163,175,0.12)" },
          {
            label: "Measured AL",
            data: [23.2, 23.6, 24.1, 24.8],
            borderColor: "#1D9E75",
            backgroundColor: "rgba(29,158,117,0.15)",
            fill: true,
            tension: 0.3,
            pointRadius: 3.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { min: 23, max: 26, grid: { color: "#F3F4F6" } } },
      },
    });
    return () => axialChartRef.current?.destroy();
  }, [chartReady]);

  useEffect(() => {
    if (!chartReady || !cohortRef.current || !window.Chart) return;
    if (cohortChartRef.current) cohortChartRef.current.destroy();
    const C = window.Chart;
    const dots = Array.from({ length: 30 }, (_, i) => {
      const age = 8 + (i % 8) + Math.random() * 0.7;
      const sphere = -(0.6 + Math.random() * 5.2);
      const risk = sphere < -4 ? "#DC2626" : sphere < -2.4 ? "#D97706" : "#16A34A";
      return { x: age, y: sphere, r: 4, color: risk };
    });
    cohortChartRef.current = new C(cohortRef.current, {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "Cohort",
            data: dots.map((d) => ({ x: d.x, y: d.y, r: d.r })),
            backgroundColor: dots.map((d) => d.color),
          },
          {
            label: "Aanya",
            data: [{ x: 11, y: -3.25, r: 7 }],
            backgroundColor: "#111827",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 8, max: 15, title: { display: true, text: "Age" }, grid: { color: "#F3F4F6" } },
          y: { min: -6, max: -0.5, title: { display: true, text: "Sphere (D)" }, grid: { color: "#F3F4F6" } },
        },
      },
    });
    return () => cohortChartRef.current?.destroy();
  }, [chartReady]);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => setChartReady(true)}
      />
      <div className="p-4 sm:p-6 flex flex-col gap-4 min-h-full bg-[#F7F6F3]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-medium text-[#111827]">Visual Analytics</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">Progression forecasting and cohort analysis</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={patientMenuRef}>
              <button onClick={() => setPatientOpen((v) => !v)} className="h-9 px-3 border border-[#E5E4DF] bg-white rounded-lg text-[13px] text-[#111827] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1D9E75] text-white text-[10px] font-semibold inline-flex items-center justify-center">{selectedPatient.initials}</span>
                {selectedPatient.name} — {selectedPatient.patientId}
                <ChevronDownIcon />
              </button>
              {patientOpen && (
                <div className="absolute right-0 mt-1 w-[280px] bg-white border border-[#E5E4DF] rounded-lg z-20 p-2">
                  <input value={patientQuery} onChange={(e) => setPatientQuery(e.target.value)} placeholder="Search patient..." className="w-full h-8 border border-[#E5E4DF] rounded-md px-2 text-[12px] mb-2 outline-none focus:border-[#1D9E75]" />
                  <div className="max-h-40 overflow-auto">
                    {filteredPatients.map((p) => (
                      <button
                        key={p.patientId}
                        onClick={() => { setSelectedPatient(p); setPatientOpen(false); }}
                        className="w-full text-left px-2 py-2 hover:bg-[#F9F8F6] rounded-md flex items-center gap-2"
                      >
                        <span className="w-7 h-7 rounded-full bg-[#1D9E75] text-white text-[10px] font-semibold inline-flex items-center justify-center">{p.initials}</span>
                        <span className="text-[12px] text-[#111827]">{p.name} — {p.patientId}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="h-9 px-3 border border-[#E5E4DF] bg-white rounded-lg text-[13px] text-[#374151] flex items-center gap-1.5 shadow-sm">Last 12 months <ChevronDownIcon /></button>
            <button onClick={() => alert("Exporting charts PDF...")} className="h-9 px-3 border border-[#E5E4DF] bg-white rounded-lg text-[13px] text-[#374151] flex items-center gap-2 shadow-sm hover:bg-[#F9F8F6]">
              <DownloadIcon />
              Export charts
            </button>
          </div>
        </div>

        <section className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 sm:p-5 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 mb-3">
            <div>
              <h3 className="text-[14px] font-medium text-[#111827]">Myopia progression forecast</h3>
              <p className="text-[12px] text-[#6B7280]">{selectedPatient.name} · {selectedPatient.patientId} · Age {selectedPatient.age}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-[#E5E4DF] bg-white p-0.5">
                <button onClick={() => setMode("sphere")} className={`h-7 px-3 rounded-md text-[12px] ${mode === "sphere" ? "bg-[#1D9E75] text-white" : "text-[#6B7280]"}`}>Sphere</button>
                <button onClick={() => setMode("axial")} className={`h-7 px-3 rounded-md text-[12px] ${mode === "axial" ? "bg-[#1D9E75] text-white" : "text-[#6B7280]"}`}>Axial length</button>
              </div>
              <div className="flex rounded-lg border border-[#E5E4DF] bg-white p-0.5">
                {(["1yr", "2yr", "5yr"] as ForecastRange[]).map((r) => (
                  <button key={r} onClick={() => setRange(r)} className={`h-7 px-3 rounded-md text-[12px] ${range === r ? "bg-[#1D9E75] text-white" : "text-[#6B7280]"}`}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            {[
              { label: "Current sphere", value: "-3.25 D", tone: "text-[#111827]" },
              { label: "Projected at 18", value: "-5.05 D", tone: "text-[#1D9E75]" },
              { label: "Without treatment", value: "-8.05 D", tone: "text-[#DC2626]" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-[#E5E4DF] bg-[#FAFAF9] px-3 py-2">
                <p className="text-[11px] text-[#6B7280]">{item.label}</p>
                <p className={`text-[14px] font-medium mt-1 ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="relative h-[520px] rounded-xl border border-[#E5E4DF] bg-[#FCFCFB] p-3">
            <canvas ref={mainRef} />
            <span className="absolute left-[38%] top-2 text-[10px] px-2 py-1 rounded-full bg-white border border-[#E5E4DF] text-[#6B7280]">Today · Age 11</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-[12px] text-[#6B7280]">
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-[2px] bg-[#1D9E75]" />Actual measurements</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-[2px] border-t-2 border-dashed border-[#1D9E75]" />Treated forecast</span>
            <span className="inline-flex items-center gap-1.5 text-[#DC2626]"><span className="w-5 h-[2px] border-t-2 border-dashed border-[#DC2626]" />Untreated forecast</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D1FAE5]" />Confidence range</span>
          </div>
          <div className="mt-4 border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ background: "#F0FBF7", borderColor: "#A7F3D0" }}>
            <div className="flex items-start gap-2">
              <TrendingDownIcon />
              <p className="text-[12px] text-[#065F46]">
                With current Stellest lens treatment, Aanya is projected to reach -5.05 D by age 18 - 3.00 D better than the untreated trajectory. This represents an estimated 37% reduction in myopia progression.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[28px] font-medium text-[#1D9E75] leading-none">37%</p>
              <p className="text-[11px] text-[#6B7280]">projected reduction</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
            <h3 className="text-[14px] font-medium text-[#111827]">Annual progression rate</h3>
            <p className="text-[12px] text-[#6B7280]">D/yr change over time - lower is better</p>
            <div className="h-[240px] mt-3"><canvas ref={annualRef} /></div>
            <div className="mt-2 text-[12px] text-[#DC2626] font-medium">↑ +0.40 D/yr over 2 years</div>
            <p className="text-[12px] text-[#6B7280]">Progression is accelerating</p>
          </div>
          <div className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
            <h3 className="text-[14px] font-medium text-[#111827]">Axial length progression</h3>
            <p className="text-[12px] text-[#6B7280]">Eye elongation over time (mm)</p>
            <div className="h-[240px] mt-3"><canvas ref={axialRef} /></div>
            <p className="text-[12px] text-[#374151] mt-2">Total growth: +1.6mm over 3 years</p>
            <p className="text-[12px] text-[#DC2626]">+0.53mm/yr average - above normal range</p>
            <span className="inline-flex mt-2 rounded-full px-2.5 py-0.5 text-[11px] bg-[#FEF2F2] text-[#991B1B]">Elevated axial length</span>
          </div>
        </section>

        <section className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <h3 className="text-[14px] font-medium text-[#111827]">Risk factor contribution analysis</h3>
          <p className="text-[12px] text-[#6B7280] mb-4">Factors contributing to high-risk classification</p>
          <div className="space-y-3">
            {FACTORS.map((factor) => {
              const levelStyle = levelPill(factor.level);
              return (
                <div key={factor.label} className="grid grid-cols-[220px_1fr_48px_92px] gap-3 items-center">
                  <span className="text-[12px] text-[#374151]">{factor.label}</span>
                  <div className="h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: barsAnimated ? `${factor.value}%` : "0%", background: colorForFactor(factor.value) }} />
                  </div>
                  <span className="text-[12px] text-[#111827] font-medium">{factor.value}%</span>
                  <span className="inline-flex justify-center rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: levelStyle.bg, color: levelStyle.text }}>{factor.level}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <p className="text-[12px] text-[#374151] mb-2">Overall risk score: 0.84 / 1.00</p>
            <div className="relative h-3 rounded-full bg-[#F3F4F6] overflow-hidden">
              <div className="h-full rounded-full bg-[#DC2626]" style={{ width: "84%" }} />
              <span className="absolute top-0 bottom-0 border-l-2 border-dashed border-[#6B7280]" style={{ left: "65%" }} />
            </div>
            <p className="mt-1 text-[11px] text-[#9CA3AF]">High risk classification threshold: 0.65</p>
          </div>
        </section>

        <section className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <h3 className="text-[14px] font-medium text-[#111827]">How does Aanya compare?</h3>
          <p className="text-[12px] text-[#6B7280]">Benchmarked against 148 clinic patients, same age group (10-12 yrs)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {[
              { title: "Progression rate", patient: "0.90 D/yr", avg: "0.52 D/yr", percentile: "84th percentile" },
              { title: "Sphere", patient: "-3.25 D", avg: "-2.10 D", percentile: "76th percentile" },
              { title: "Axial length", patient: "24.8mm", avg: "23.9mm", percentile: "88th percentile" },
            ].map((card) => (
              <div key={card.title} className="border border-[#E5E4DF] rounded-lg p-3 bg-[#FAFAF9]">
                <p className="text-[12px] text-[#6B7280]">{card.title}</p>
                <p className="text-[13px] text-[#111827] font-medium mt-1">Patient: {card.patient}</p>
                <p className="text-[12px] text-[#6B7280]">Clinic avg: {card.avg}</p>
                <p className="text-[12px] text-[#DC2626] mt-2">{card.percentile}</p>
              </div>
            ))}
          </div>
          <div className="h-[280px] mt-4 rounded-lg border border-[#E5E4DF] bg-[#FCFCFB] p-2">
            <canvas ref={cohortRef} />
          </div>
        </section>

        <section className="bg-white border border-[#E5E4DF] rounded-[12px] p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <h3 className="text-[14px] font-medium text-[#111827]">Treatment scenario comparison</h3>
          <p className="text-[12px] text-[#6B7280] mb-3">Projected outcomes at age 18 under different interventions</p>
          <div className="overflow-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#E5E4DF]">
                  {["Treatment option", "Projected sphere at 18", "Reduction vs untreated", "Evidence level", "Recommended"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-[#6B7280]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["No treatment", "-8.05 D", "—", "—", "—"],
                  ["Stellest lens", "-5.05 D", "-3.00 D", "★★★★☆ High", "✓ Current"],
                  ["Orthokeratology", "-4.80 D", "-3.25 D", "★★★★☆ High", "Consider"],
                  ["Atropine 0.05%", "-4.50 D", "-3.55 D", "★★★★★ High", "Consider"],
                  ["Combined therapy", "-4.10 D", "-3.95 D", "★★★☆☆ Mod", "Discuss"],
                ].map((row) => {
                  const isNoTx = row[0] === "No treatment";
                  const isCurrent = row[0] === "Stellest lens";
                  return (
                    <tr key={row[0]} className="border-b border-[#E5E4DF] last:border-b-0" style={{ background: isNoTx ? "#FEF2F2" : isCurrent ? "#F0FBF7" : "transparent" }}>
                      {row.map((cell, idx) => (
                        <td key={idx} className="px-3 py-2 text-[12px] text-[#374151]" style={{ borderLeft: isCurrent && idx === 0 ? "3px solid #1D9E75" : "none" }}>{cell}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-[#9CA3AF]">
            Evidence ratings based on published meta-analyses (Cochrane, BHVI, IMI guidelines). Projections are model estimates and should guide, not replace, clinical decisions.
          </p>
        </section>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ForecastMode = "sphere" | "axial";
type ForecastRange = "1yr" | "2yr" | "5yr";
type RiskLevel = "High" | "Moderate" | "Low";
type HistoryRange = "1m" | "3m" | "6m" | "1y" | "2y" | "3y" | "4y" | "5y";

interface PatientData {
  name: string;
  patientId: string;
  age: number;
  initials: string;
}

interface Point {
  x: number;
  y: number;
}

const PATIENTS: PatientData[] = [
  { name: "Aanya Mehta", patientId: "PT-001", age: 11, initials: "AM" },
  { name: "Rohan Iyer", patientId: "PT-002", age: 9, initials: "RI" },
  { name: "Preethi Suresh", patientId: "PT-003", age: 13, initials: "PS" },
];

const SPHERE_ACTUAL: Point[] = [
  { x: 8.0, y: -0.5 },
  { x: 8.5, y: -0.75 },
  { x: 9.0, y: -1.25 },
  { x: 9.5, y: -1.75 },
  { x: 10.0, y: -2.25 },
  { x: 10.5, y: -3.0 },
  { x: 11.0, y: -3.25 },
];

const SPHERE_TREATED: Point[] = [
  { x: 11.0, y: -3.25 },
  { x: 12.0, y: -3.8 },
  { x: 13.0, y: -4.2 },
  { x: 14.0, y: -4.5 },
  { x: 15.0, y: -4.72 },
  { x: 16.0, y: -4.88 },
  { x: 17.0, y: -4.98 },
  { x: 18.0, y: -5.05 },
];

const SPHERE_UNTREATED: Point[] = [
  { x: 11.0, y: -3.25 },
  { x: 12.0, y: -4.15 },
  { x: 13.0, y: -5.2 },
  { x: 14.0, y: -6.1 },
  { x: 15.0, y: -6.85 },
  { x: 16.0, y: -7.4 },
  { x: 17.0, y: -7.8 },
  { x: 18.0, y: -8.05 },
];

const AL_ACTUAL: Point[] = [
  { x: 8, y: 23.2 },
  { x: 9, y: 23.6 },
  { x: 10, y: 24.1 },
  { x: 11, y: 24.8 },
];

const AL_TREATED: Point[] = [
  { x: 11, y: 24.8 },
  { x: 12, y: 25.1 },
  { x: 13, y: 25.35 },
  { x: 14, y: 25.55 },
  { x: 15, y: 25.75 },
  { x: 16, y: 25.9 },
  { x: 17, y: 26.0 },
  { x: 18, y: 26.1 },
];

const AL_UNTREATED: Point[] = [
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

const ANNUAL_BARS = [
  { period: "8-9", rate: 0.25 },
  { period: "9-10", rate: 0.5 },
  { period: "10-11", rate: 0.9 },
];

const HISTORY_RANGE_OPTIONS: { value: HistoryRange; label: string; years: number }[] = [
  { value: "1m", label: "1 month", years: 1 / 12 },
  { value: "3m", label: "3 month", years: 3 / 12 },
  { value: "6m", label: "6 month", years: 6 / 12 },
  { value: "1y", label: "1 year", years: 1 },
  { value: "2y", label: "2 year", years: 2 },
  { value: "3y", label: "3 year", years: 3 },
  { value: "4y", label: "4 year", years: 4 },
  { value: "5y", label: "5 year", years: 5 },
];

const RADAR_DATA = FACTORS.map((f) => ({ factor: f.label.split(" (")[0], value: f.value }));

const PIE_DATA = [
  { name: "High risk", value: 23, fill: "#DC2626" },
  { name: "Moderate", value: 61, fill: "#D97706" },
  { name: "Low risk", value: 64, fill: "#16A34A" },
];

const SCATTER_DATA = Array.from({ length: 30 }, (_, i) => {
  const age = 8 + (i % 8) + (i % 4) * 0.15;
  const sphere = -(0.6 + (i * 0.17) % 5.2);
  return {
    age,
    sphere,
    color: sphere < -4 ? "#DC2626" : sphere < -2.4 ? "#D97706" : "#16A34A",
  };
});

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
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [mode, setMode] = useState<ForecastMode>("sphere");
  const [range, setRange] = useState<ForecastRange>("5yr");
  const [historyRange, setHistoryRange] = useState<HistoryRange>("1y");

  const rangeEnd = useMemo(() => {
    if (range === "1yr") return 12;
    if (range === "2yr") return 13;
    return 18;
  }, [range]);

  const treated = (mode === "sphere" ? SPHERE_TREATED : AL_TREATED).filter((p) => p.x <= rangeEnd);
  const untreated = (mode === "sphere" ? SPHERE_UNTREATED : AL_UNTREATED).filter((p) => p.x <= rangeEnd);
  const actual = mode === "sphere" ? SPHERE_ACTUAL : AL_ACTUAL;
  const historyYears = HISTORY_RANGE_OPTIONS.find((option) => option.value === historyRange)?.years ?? 1;
  const historyStartAge = selectedPatient.age - historyYears;
  const filteredActual = actual.filter((p) => p.x >= historyStartAge && p.x <= selectedPatient.age);

  const baseForecast: {
    age: number;
    actual: number | null;
    treated: number | null;
    untreated: number | null;
  }[] = filteredActual
    .map((p) => ({
      age: p.x,
      actual: p.y,
      treated: treated.find((x) => x.x === p.x)?.y ?? null,
      untreated: untreated.find((x) => x.x === p.x)?.y ?? null,
    }))
  const projectedOnly: {
    age: number;
    actual: number | null;
    treated: number | null;
    untreated: number | null;
  }[] = treated
    .filter((p) => !filteredActual.some((a) => a.x === p.x))
    .map((p) => ({
      age: p.x,
      actual: null,
      treated: p.y,
      untreated: untreated.find((x) => x.x === p.x)?.y ?? null,
    }));

  const forecastData = [...baseForecast, ...projectedOnly].sort((a, b) => a.age - b.age);
  const forecastMinAge = Math.max(8, Math.floor(historyStartAge * 2) / 2);

  const forecastConfig = {
    actual: { label: "Actual", color: "#1D9E75" },
    treated: { label: "Treated", color: "#10B981" },
    untreated: { label: "Untreated", color: "#DC2626" },
  } satisfies ChartConfig;

  const annualConfig = {
    rate: { label: "Progression", color: "#D97706" },
  } satisfies ChartConfig;

  const axialAreaConfig = {
    axial: { label: "Axial length", color: "#1D9E75" },
  } satisfies ChartConfig;

  const pieConfig = {
    high: { label: "High risk", color: "#DC2626" },
    moderate: { label: "Moderate", color: "#D97706" },
    low: { label: "Low", color: "#16A34A" },
  } satisfies ChartConfig;

  const radarConfig = {
    value: { label: "Risk score", color: "#DC2626" },
  } satisfies ChartConfig;

  return (
      <div className="p-4 sm:p-6 flex flex-col gap-4 min-h-full bg-[#F7F6F3]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-medium text-[#111827]">Visual Analytics</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">Progression forecasting and cohort analysis</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedPatient.patientId}
              onValueChange={(v) => {
                const found = PATIENTS.find((p) => p.patientId === v);
                if (found) setSelectedPatient(found);
              }}
            >
              <SelectTrigger className="w-full sm:w-[260px] h-9 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PATIENTS.map((p) => (
                  <SelectItem key={p.patientId} value={p.patientId}>
                    {p.name} — {p.patientId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={historyRange} onValueChange={(value) => setHistoryRange(value as HistoryRange)}>
              <SelectTrigger className="w-[148px] h-9 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HISTORY_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={() => alert("Exporting charts PDF...")} className="h-9 px-3 border border-[#E5E4DF] bg-white rounded-lg text-[13px] text-[#374151] flex items-center gap-2 shadow-sm hover:bg-[#F9F8F6]">
              <DownloadIcon />
              Export charts
            </button>
          </div>
        </div>

        <Card className="border-[#E5E4DF] shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <CardHeader className="pb-3">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
              <div>
                <CardTitle className="text-[14px]">Myopia progression forecast</CardTitle>
                <CardDescription className="text-[12px]">
                  {selectedPatient.name} · {selectedPatient.patientId} · Age {selectedPatient.age}
                </CardDescription>
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
          </CardHeader>
          <CardContent className="pt-0">
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

          <div className="relative h-[340px] sm:h-[420px] xl:h-[520px] rounded-xl border border-[#E5E4DF] bg-[#FCFCFB] p-3">
            <ChartContainer config={forecastConfig} className="h-full w-full">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" type="number" domain={[forecastMinAge, rangeEnd]} />
                <YAxis domain={mode === "sphere" ? [-8, 0] : [22, 28]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <ReferenceLine x={11} stroke="#9CA3AF" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="treated" stroke="var(--color-treated)" strokeWidth={1.8} strokeDasharray="6 4" dot={false} />
                <Line type="monotone" dataKey="untreated" stroke="var(--color-untreated)" strokeWidth={1.8} strokeDasharray="6 4" dot={false} />
              </LineChart>
            </ChartContainer>
            <span className="absolute left-[42%] top-2 text-[10px] px-2 py-1 rounded-full bg-white border border-[#E5E4DF] text-[#6B7280]">Today · Age 11</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-[12px] text-[#6B7280]">
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-[2px] bg-[#1D9E75]" />Actual measurements</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-5 h-[2px] border-t-2 border-dashed border-[#1D9E75]" />Treated forecast</span>
            <span className="inline-flex items-center gap-1.5 text-[#DC2626]"><span className="w-5 h-[2px] border-t-2 border-dashed border-[#DC2626]" />Untreated forecast</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D1FAE5]" />Confidence range</span>
          </div>
          </CardContent>
        </Card>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="border-[#E5E4DF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Annual progression rate</CardTitle>
              <CardDescription className="text-[12px]">Bar chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={annualConfig} className="h-[220px] sm:h-[240px] w-full">
                <BarChart data={ANNUAL_BARS.filter((entry) => Number(entry.period.split("-")[1]) >= historyStartAge)}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 1.5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rate" radius={6}>
                    {ANNUAL_BARS.map((entry) => (
                      <Cell key={entry.period} fill={entry.rate > 0.75 ? "#DC2626" : entry.rate >= 0.5 ? "#D97706" : "#16A34A"} />
                    ))}
                  </Bar>
                  <ReferenceLine y={0.5} stroke="#9CA3AF" strokeDasharray="4 4" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="border-[#E5E4DF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Axial length progression</CardTitle>
              <CardDescription className="text-[12px]">Area chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={axialAreaConfig} className="h-[220px] sm:h-[240px] w-full">
                <AreaChart data={AL_ACTUAL.filter((p) => p.x >= historyStartAge && p.x <= selectedPatient.age).map((p) => ({ age: p.x, axial: p.y }))}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="age" />
                  <YAxis domain={[23, 26]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="axial" stroke="var(--color-axial)" fill="var(--color-axial)" fillOpacity={0.2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <Card className="border-[#E5E4DF] shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[14px]">Risk factor contribution analysis</CardTitle>
            <CardDescription className="text-[12px]">Factors contributing to high-risk classification</CardDescription>
          </CardHeader>
          <CardContent>
          <p className="text-[12px] text-[#6B7280] mb-4">Animated contribution bars</p>
          <div className="space-y-3">
            {FACTORS.map((factor) => {
              const levelStyle = levelPill(factor.level);
              return (
                <div key={factor.label} className="grid grid-cols-1 md:grid-cols-[220px_1fr_48px_92px] gap-2 md:gap-3 items-center">
                  <span className="text-[12px] text-[#374151]">{factor.label}</span>
                  <div className="h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${factor.value}%`, background: colorForFactor(factor.value) }} />
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
          </CardContent>
        </Card>

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
          <div className="h-[240px] sm:h-[280px] mt-4 rounded-lg border border-[#E5E4DF] bg-[#FCFCFB] p-2">
            <ChartContainer config={pieConfig} className="h-full w-full">
              <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="age" type="number" domain={[8, 15]} />
                <YAxis dataKey="sphere" type="number" domain={[-6, -0.5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Scatter data={SCATTER_DATA} fill="#8884d8">
                  {SCATTER_DATA.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Scatter>
                <Scatter data={[{ age: 11, sphere: -3.25 }]} fill="#111827" />
              </ScatterChart>
            </ChartContainer>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="border-[#E5E4DF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Risk distribution</CardTitle>
              <CardDescription className="text-[12px]">Pie chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieConfig} className="h-[220px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={PIE_DATA} dataKey="value" nameKey="name" innerRadius={45} outerRadius={78} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="border-[#E5E4DF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Factor radar</CardTitle>
              <CardDescription className="text-[12px]">Radar chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={radarConfig} className="h-[220px] w-full">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.22} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="border-[#E5E4DF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[14px]">Overall risk gauge</CardTitle>
              <CardDescription className="text-[12px]">Radial chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ risk: { label: "Risk", color: "#DC2626" } }} className="h-[220px] w-full">
                <RadialBarChart innerRadius={70} outerRadius={95} data={[{ name: "risk", value: 84, fill: "#DC2626" }]} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={8} background />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadialBarChart>
              </ChartContainer>
              <p className="text-center text-[12px] text-[#6B7280] mt-1">84% High-risk score</p>
            </CardContent>
          </Card>
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
  );
}

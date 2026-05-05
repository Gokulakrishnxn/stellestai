"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Risk = "low" | "moderate" | "high";
type Gender = "M" | "F" | "Other" | "";
type SubmitState = "idle" | "loading" | "success";

interface ExistingPatient {
  id: string;
  name: string;
  patientId: string;
  age: number;
}

interface AssessmentForm {
  // Step 1
  selectedPatient: ExistingPatient | null;
  fullName: string;
  dob: string;
  gender: Gender;
  phone: string;
  parentMyopia: 0 | 1 | 2 | null;
  currentTreatment: string;
  // Step 2
  rightSphere: string;
  rightCylinder: string;
  rightAxis: string;
  rightVA: string;
  leftSphere: string;
  leftCylinder: string;
  leftAxis: string;
  leftVA: string;
  rightAL: string;
  leftAL: string;
  hasProgression: boolean;
  priorProgression: string;
  // Step 3
  outdoorHours: number;
  nearWorkHours: number;
  screenStudy: string;
  screenDevices: string;
  screenTV: string;
  readingDistance: number;
  notes: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PATIENTS: ExistingPatient[] = [
  { id: "1", name: "Aanya Mehta", patientId: "PT-001", age: 11 },
  { id: "2", name: "Rohan Iyer", patientId: "PT-002", age: 9 },
  { id: "3", name: "Preethi Sharma", patientId: "PT-003", age: 13 },
  { id: "4", name: "Kiran Babu", patientId: "PT-004", age: 10 },
  { id: "5", name: "Sanjay Menon", patientId: "PT-005", age: 14 },
  { id: "6", name: "Diya Nair", patientId: "PT-006", age: 8 },
];

const INITIAL: AssessmentForm = {
  selectedPatient: null,
  fullName: "",
  dob: "",
  gender: "",
  phone: "",
  parentMyopia: null,
  currentTreatment: "",
  rightSphere: "",
  rightCylinder: "",
  rightAxis: "",
  rightVA: "",
  leftSphere: "",
  leftCylinder: "",
  leftAxis: "",
  leftVA: "",
  rightAL: "",
  leftAL: "",
  hasProgression: false,
  priorProgression: "",
  outdoorHours: 1.5,
  nearWorkHours: 5.0,
  screenStudy: "",
  screenDevices: "",
  screenTV: "",
  readingDistance: 28,
  notes: "",
};

const STEP_LABELS = ["Patient", "Refractive", "Lifestyle", "Review"];

const STEP_TITLES = [
  "Patient information",
  "Refractive error measurements",
  "Lifestyle & environmental factors",
  "Review & run prediction",
];

const STEP_TIPS: Record<number, string> = {
  1: "Tip: Axial length data improves AI accuracy by ~18%",
  2: "Tip: Enter both eyes for best results",
  3: "Tip: Outdoor time is the strongest modifiable factor",
  4: "Ready to predict! Review your data and submit.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function calcAge(dob: string): number | null {
  if (!dob) return null;
  const born = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  if (
    now.getMonth() < born.getMonth() ||
    (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())
  )
    age--;
  return age;
}

function getCompleteness(f: AssessmentForm) {
  const checks = [
    !!(f.selectedPatient || f.fullName.trim()),
    !!(f.selectedPatient || f.dob),
    !!(f.selectedPatient || f.parentMyopia !== null),
    !!f.rightSphere,
    !!f.leftSphere,
    true, // slider — always has a value
    true,
    true,
  ];
  const count = checks.filter(Boolean).length;
  return { count, total: 8, pct: Math.round((count / 8) * 100) };
}

function estimateRisk(f: AssessmentForm): Risk | null {
  if (!f.rightSphere) return null;
  let score = 0;
  const sph = parseFloat(f.rightSphere) || 0;
  if (sph <= -4) score += 2;
  else if (sph <= -2) score += 1;
  if (f.outdoorHours < 1) score += 2;
  else if (f.outdoorHours < 2) score += 1;
  if (f.nearWorkHours > 6) score += 2;
  else if (f.nearWorkHours >= 4) score += 1;
  score += f.parentMyopia ?? 0;
  if (score >= 5) return "high";
  if (score >= 3) return "moderate";
  return "low";
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function InfoIcon({ color = "#2563EB" }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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

// ─── Primitives ───────────────────────────────────────────────────────────────

function Field({
  label, required, children, error, className,
}: {
  label: string; required?: boolean; children: React.ReactNode; error?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-medium text-[#374151] mb-1.5">
        {label}
        {required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-[#DC2626]">{error}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text", error, className,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; error?: boolean; className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={[
        "w-full h-[38px] px-3 text-[13px] border rounded-lg outline-none focus:border-[#1D9E75] placeholder:text-[#9CA3AF] transition-colors",
        error ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E5E4DF] bg-white",
        className ?? "",
      ].join(" ")}
    />
  );
}

function Pills<T extends string | number | boolean>({
  options, value, onChange,
}: {
  options: { label: string; value: T }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 py-2 text-[12px] font-medium rounded-lg border transition-colors"
            style={{
              background: active ? "#1D9E75" : "#fff",
              color: active ? "#fff" : "#6B7280",
              borderColor: active ? "#1D9E75" : "#E5E4DF",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function RangeSlider({
  label, required, value, onChange, min, max, step,
  displayValue, displayColor, sublabel, warning, unit,
}: {
  label: string; required?: boolean; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; displayValue: string;
  displayColor: string; sublabel: string; warning?: string; unit: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  function handleDirectInput(raw: string) {
    if (raw.trim() === "") return;
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) return;
    const clamped = Math.max(min, Math.min(max, parsed));
    onChange(clamped);
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-3 mb-2.5">
        <label className="text-[12px] font-medium text-[#374151]">
          {label}
          {required && <span className="text-[#DC2626] ml-0.5">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <div
            className="h-9 px-3 rounded-lg border bg-white flex items-center text-[12px] font-medium text-[#374151]"
            style={{ borderColor: "#E5E4DF" }}
          >
            <input
              type="number"
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={(e) => handleDirectInput(e.target.value)}
              className="w-16 text-right bg-transparent outline-none font-semibold tabular-nums"
              style={{ color: displayColor }}
            />
            <span className="ml-1 text-[#6B7280]">{unit}</span>
          </div>
          <span className="text-[21px] font-semibold leading-none tabular-nums" style={{ color: displayColor }}>
            {displayValue}
          </span>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="h-2 rounded-full bg-[#EEF2F7] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${pct}%`, background: displayColor }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between mt-2 items-center">
        <span className="text-[11px] text-[#9CA3AF]">{min}</span>
        <span className="text-[11px] text-[#6B7280] text-center px-2">{sublabel}</span>
        <span className="text-[11px] text-[#9CA3AF]">{max}</span>
      </div>
      {warning && (
        <p className="mt-1.5 text-[11px] font-medium" style={{ color: "#D97706" }}>⚠ {warning}</p>
      )}
    </div>
  );
}

function SummaryCard({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-[#E5E4DF] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">{title}</span>
        <button onClick={onEdit} className="text-[11px] text-[#1D9E75] font-medium hover:underline">Edit</button>
      </div>
      {children}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, onStepClick }: { current: number; onStepClick: (n: number) => void }) {
  return (
    <div className="relative">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <Fragment key={n}>
            <div className="relative inline-flex w-1/4 min-w-0 flex-col items-center align-top">
              {i < STEP_LABELS.length - 1 && (
                <div
                  className="absolute h-[2px] top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] transition-colors"
                  style={{ background: n < current ? "#1D9E75" : "#E5E7EB" }}
                />
              )}
            <button
              onClick={() => done && onStepClick(n)}
              disabled={!done}
              className="flex flex-col items-center shrink-0 w-full"
              style={{ cursor: done ? "pointer" : "default" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border-2 transition-all"
                style={{
                  background: done || active ? "#1D9E75" : "#fff",
                  borderColor: done || active ? "#1D9E75" : "#D1D5DB",
                  color: done || active ? "#fff" : "#9CA3AF",
                }}
              >
                {done ? <CheckIcon /> : n}
              </div>
              <span
                className="mt-1.5 text-[10px] sm:text-[11px] font-medium text-center whitespace-nowrap"
                style={{ color: done || active ? "#1D9E75" : "#9CA3AF" }}
              >
                {label}
              </span>
            </button>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ─── Step 1 — Patient ─────────────────────────────────────────────────────────

type Updater = <K extends keyof AssessmentForm>(k: K, v: AssessmentForm[K]) => void;

function Step1({ form, update, errors }: { form: AssessmentForm; update: Updater; errors: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hits = query.length > 0
    ? PATIENTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.patientId.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-5">
      {/* Patient search */}
      <Field label="Search existing patient">
        <div className="relative" ref={ref}>
          {form.selectedPatient ? (
            <div className="flex items-center gap-2.5 px-3 py-2 border border-[#1D9E75] bg-[#F0FBF7] rounded-lg">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D9E75" }}>
                <span className="text-white text-[10px] font-semibold">{initials(form.selectedPatient.name)}</span>
              </div>
              <span className="flex-1 text-[13px] font-medium" style={{ color: "#1D9E75" }}>
                {form.selectedPatient.name} — {form.selectedPatient.patientId}
              </span>
              <button
                onClick={() => { update("selectedPatient", null); setQuery(""); }}
                className="text-[#9CA3AF] hover:text-[#6B7280] text-[16px] font-bold leading-none"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                placeholder="Search patient by name or ID..."
                className="w-full h-[38px] pl-8 pr-3 text-[13px] border border-[#E5E4DF] rounded-lg outline-none focus:border-[#1D9E75] placeholder:text-[#9CA3AF]"
              />
              {open && hits.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-[#E5E4DF] rounded-lg overflow-hidden">
                  {hits.map((p) => (
                    <button
                      key={p.id}
                      className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-[#F0FBF7] border-b border-[#E5E4DF] last:border-b-0 transition-colors"
                      onClick={() => { update("selectedPatient", p); setQuery(""); setOpen(false); }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D9E75" }}>
                        <span className="text-white text-[10px] font-semibold">{initials(p.name)}</span>
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#111827]">{p.name}</div>
                        <div className="text-[11px] text-[#9CA3AF]">{p.patientId} · {p.age} yrs</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Field>

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E4DF]" />
        <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-[#E5E4DF]" />
      </div>

      {/* Patient card (if selected) or new-patient fields */}
      {form.selectedPatient ? (
        <div className="space-y-4">
          <div className="p-4 bg-[#F9F8F6] border border-[#E5E4DF] rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D9E75" }}>
              <span className="text-white text-[12px] font-semibold">{initials(form.selectedPatient.name)}</span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#111827]">{form.selectedPatient.name}</p>
              <p className="text-[11px] text-[#6B7280]">{form.selectedPatient.patientId} · {form.selectedPatient.age} years old</p>
            </div>
          </div>
          <Field label="Current treatment">
            <select
              value={form.currentTreatment}
              onChange={(e) => update("currentTreatment", e.target.value)}
              className="w-full h-[38px] px-3 text-[13px] text-[#111827] border border-[#E5E4DF] rounded-lg outline-none focus:border-[#1D9E75] bg-white"
            >
              <option value="">Select treatment...</option>
              <option value="none">None</option>
              <option value="stellest">Stellest lens</option>
              <option value="atropine_001">Atropine 0.01%</option>
              <option value="atropine_005">Atropine 0.05%</option>
              <option value="ok_lens">OK lens</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Full name" required error={errors.fullName} className="col-span-2">
            <TextInput value={form.fullName} onChange={(v) => update("fullName", v)} placeholder="Patient full name" error={!!errors.fullName} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of birth" required error={errors.dob}>
              <TextInput type="date" value={form.dob} onChange={(v) => update("dob", v)} error={!!errors.dob} />
            </Field>
            <Field label="Phone">
              <TextInput type="tel" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+91 98765 43210" />
            </Field>
          </div>
          <Field label="Gender">
            <Pills<Gender>
              options={[{label:"M",value:"M"},{label:"F",value:"F"},{label:"Other",value:"Other"}]}
              value={form.gender} onChange={(v) => update("gender", v)}
            />
          </Field>
          <Field label="Parent myopia" required error={errors.parentMyopia}>
            <Pills<0 | 1 | 2>
              options={[{label:"0 parents",value:0},{label:"1 parent",value:1},{label:"2 parents",value:2}]}
              value={form.parentMyopia} onChange={(v) => update("parentMyopia", v)}
            />
          </Field>
          <Field label="Current treatment">
            <select
              value={form.currentTreatment}
              onChange={(e) => update("currentTreatment", e.target.value)}
              className="w-full h-[38px] px-3 text-[13px] text-[#111827] border border-[#E5E4DF] rounded-lg outline-none focus:border-[#1D9E75] bg-white"
            >
              <option value="">Select treatment...</option>
              <option value="none">None</option>
              <option value="stellest">Stellest lens</option>
              <option value="atropine_001">Atropine 0.01%</option>
              <option value="atropine_005">Atropine 0.05%</option>
              <option value="ok_lens">OK lens</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
      )}
    </div>
  );
}

// ─── Step 2 — Refractive ──────────────────────────────────────────────────────

function Step2({ form, update, errors }: { form: AssessmentForm; update: Updater; errors: Record<string, string> }) {
  const rows: Array<{
    label: string; required?: boolean;
    rField: keyof AssessmentForm; lField: keyof AssessmentForm;
    rPH: string; lPH: string;
  }> = [
    { label: "Sphere (D)", required: true, rField: "rightSphere", lField: "leftSphere", rPH: "-3.25", lPH: "-3.00" },
    { label: "Cylinder (D)", rField: "rightCylinder", lField: "leftCylinder", rPH: "-0.50", lPH: "-0.75" },
    { label: "Axis (°)", rField: "rightAxis", lField: "leftAxis", rPH: "180", lPH: "175" },
    { label: "Visual acuity", rField: "rightVA", lField: "leftVA", rPH: "6/9", lPH: "6/9" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[12px] text-[#6B7280]">Enter current refraction findings</p>

      {/* Refraction grid */}
      <div>
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div />
          <p className="text-[12px] font-semibold text-[#374151] text-center">Right eye</p>
          <p className="text-[12px] font-semibold text-[#374151] text-center">Left eye</p>
        </div>
        <div className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-3 items-center">
              <label className="text-[12px] text-[#374151]">
                {row.label}
                {row.required && <span className="text-[#DC2626] ml-0.5">*</span>}
              </label>
              <input
                type="text"
                value={form[row.rField] as string}
                onChange={(e) => update(row.rField, e.target.value as never)}
                placeholder={row.rPH}
                className={`w-full h-[38px] px-3 text-[13px] text-center border rounded-lg outline-none focus:border-[#1D9E75] placeholder:text-[#9CA3AF] transition-colors ${errors[row.rField] ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E5E4DF]"}`}
              />
              <input
                type="text"
                value={form[row.lField] as string}
                onChange={(e) => update(row.lField, e.target.value as never)}
                placeholder={row.lPH}
                className={`w-full h-[38px] px-3 text-[13px] text-center border rounded-lg outline-none focus:border-[#1D9E75] placeholder:text-[#9CA3AF] transition-colors ${errors[row.lField] ? "border-[#DC2626] bg-[#FEF2F2]" : "border-[#E5E4DF]"}`}
              />
            </div>
          ))}
        </div>
        {(errors.rightSphere || errors.leftSphere) && (
          <p className="mt-2 text-[11px] text-[#DC2626]">Sphere is required for both eyes.</p>
        )}
      </div>

      {/* Axial length */}
      <div>
        <h3 className="text-[13px] font-medium text-[#111827] mb-3">Axial length</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Right eye AL (mm)">
            <TextInput value={form.rightAL} onChange={(v) => update("rightAL", v)} placeholder="24.8" />
          </Field>
          <Field label="Left eye AL (mm)">
            <TextInput value={form.leftAL} onChange={(v) => update("leftAL", v)} placeholder="24.6" />
          </Field>
        </div>
      </div>

      {/* Previous progression */}
      <div>
        <h3 className="text-[13px] font-medium text-[#111827] mb-3">Previous progression</h3>
        <Field label="Known progression rate">
          <Pills<boolean>
            options={[{label:"Yes",value:true},{label:"No",value:false}]}
            value={form.hasProgression} onChange={(v) => update("hasProgression", v)}
          />
        </Field>
        {form.hasProgression && (
          <div className="mt-3">
            <Field label="Prior D/yr">
              <TextInput type="number" value={form.priorProgression} onChange={(v) => update("priorProgression", v)} placeholder="0.75" />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 3 — Lifestyle ───────────────────────────────────────────────────────

function Step3({ form, update }: { form: AssessmentForm; update: Updater }) {
  const outdoorColor =
    form.outdoorHours >= 2 ? "#16A34A" : form.outdoorHours >= 1 ? "#D97706" : "#DC2626";
  const nearColor =
    form.nearWorkHours > 6 ? "#DC2626" : form.nearWorkHours >= 4 ? "#D97706" : "#16A34A";
  const rdColor = form.readingDistance < 30 ? "#D97706" : "#111827";

  return (
    <div className="space-y-7">
      <RangeSlider
        label="Outdoor activity" required
        value={form.outdoorHours} onChange={(v) => update("outdoorHours", v)}
        min={0} max={8} step={0.5}
        displayValue={`${form.outdoorHours.toFixed(1)} hrs/day`}
        displayColor={outdoorColor}
        sublabel="Recommended: ≥ 2 hours/day"
        unit="hrs"
      />

      <RangeSlider
        label="Near work" required
        value={form.nearWorkHours} onChange={(v) => update("nearWorkHours", v)}
        min={0} max={12} step={0.5}
        displayValue={`${form.nearWorkHours.toFixed(1)} hrs/day`}
        displayColor={nearColor}
        sublabel="Includes reading, screens, homework"
        unit="hrs"
      />

      {/* Screen time breakdown */}
      <div>
        <label className="block text-[12px] font-medium text-[#374151] mb-3">
          Screen time breakdown{" "}
          <span className="font-normal text-[#9CA3AF]">(optional)</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { label: "Study/reading", field: "screenStudy" as keyof AssessmentForm, ph: "2.5" },
              { label: "Devices", field: "screenDevices" as keyof AssessmentForm, ph: "1.5" },
              { label: "TV", field: "screenTV" as keyof AssessmentForm, ph: "1.0" },
            ] as const
          ).map((col) => (
            <div key={col.label}>
              <label className="block text-[11px] text-[#6B7280] mb-1.5">{col.label}</label>
              <div className="relative">
                <input
                  type="number" step="0.5" min="0" max="24"
                  value={form[col.field] as string}
                  onChange={(e) => update(col.field, e.target.value as never)}
                  placeholder={col.ph}
                  className="w-full h-[38px] px-3 pr-8 text-[13px] border border-[#E5E4DF] rounded-lg outline-none focus:border-[#1D9E75] placeholder:text-[#9CA3AF]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#9CA3AF] pointer-events-none">
                  hrs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RangeSlider
        label="Reading distance"
        value={form.readingDistance} onChange={(v) => update("readingDistance", v)}
        min={20} max={50} step={1}
        displayValue={`${form.readingDistance} cm`}
        displayColor={rdColor}
        sublabel="Optimal: 30–40 cm"
        warning={form.readingDistance < 30 ? "Close reading distance — risk factor" : undefined}
        unit="cm"
      />

      <Field label="Notes / observations">
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          placeholder="Any additional clinical observations..."
          className="w-full px-3 py-2.5 text-[13px] border border-[#E5E4DF] rounded-lg outline-none focus:border-[#1D9E75] placeholder:text-[#9CA3AF] resize-none"
        />
      </Field>
    </div>
  );
}

// ─── Step 4 — Review ──────────────────────────────────────────────────────────

function Step4({
  form, onEdit, onSubmit, submitState,
}: {
  form: AssessmentForm; onEdit: (s: number) => void;
  onSubmit: () => void; submitState: SubmitState;
}) {
  const name = form.selectedPatient?.name || form.fullName || "—";
  const pid = form.selectedPatient?.patientId || "New patient";
  const age = form.selectedPatient?.age ?? calcAge(form.dob);

  const checks = [
    { label: "Patient selected", ok: !!(form.selectedPatient || form.fullName), warn: false },
    { label: "Refractive data complete", ok: !!(form.rightSphere && form.leftSphere), warn: false },
    { label: "Axial length provided (+accuracy boost)", ok: !!(form.rightAL && form.leftAL), warn: false },
    { label: "Outdoor activity below recommended threshold", ok: form.outdoorHours >= 2, warn: form.outdoorHours < 2 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard title="Patient" onEdit={() => onEdit(1)}>
          <p className="text-[13px] font-medium text-[#111827]">{name}</p>
          <p className="text-[11px] text-[#6B7280]">
            {age != null ? `${age} yrs · ` : ""}{pid}
          </p>
        </SummaryCard>

        <SummaryCard title="Refraction" onEdit={() => onEdit(2)}>
          {form.rightSphere ? (
            <>
              <p className="text-[11px] text-[#6B7280]">
                R: {form.rightSphere} / {form.rightCylinder || "—"} × {form.rightAxis || "—"}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                L: {form.leftSphere} / {form.leftCylinder || "—"} × {form.leftAxis || "—"}
              </p>
            </>
          ) : (
            <p className="text-[11px] text-[#DC2626]">Not entered</p>
          )}
        </SummaryCard>

        <SummaryCard title="Axial length" onEdit={() => onEdit(2)}>
          {form.rightAL ? (
            <>
              <p className="text-[11px] text-[#6B7280]">R: {form.rightAL} mm</p>
              <p className="text-[11px] text-[#6B7280]">L: {form.leftAL || "—"} mm</p>
            </>
          ) : (
            <p className="text-[11px] text-[#9CA3AF]">Not provided</p>
          )}
        </SummaryCard>

        <SummaryCard title="Lifestyle" onEdit={() => onEdit(3)}>
          <p className="text-[11px] text-[#6B7280]">{form.outdoorHours.toFixed(1)}h outdoor</p>
          <p className="text-[11px] text-[#6B7280]">{form.nearWorkHours.toFixed(1)}h near work</p>
        </SummaryCard>
      </div>

      {/* Checklist */}
      <div className="border border-[#E5E4DF] rounded-lg overflow-hidden">
        {checks.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? "border-t border-[#E5E4DF]" : ""}`}
          >
            <span
              className="text-[15px] shrink-0"
              style={{ color: item.warn ? "#D97706" : item.ok ? "#16A34A" : "#DC2626" }}
            >
              {item.warn ? "⚠" : item.ok ? "✓" : "✗"}
            </span>
            <span
              className="text-[12px]"
              style={{ color: item.warn ? "#D97706" : item.ok ? "#374151" : "#DC2626" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {submitState === "success" ? (
        <div
          className="flex items-center gap-3 p-4 rounded-lg border"
          style={{ background: "#F0FDF4", borderColor: "#86EFAC" }}
        >
          <span className="text-[20px]" style={{ color: "#16A34A" }}>✓</span>
          <p className="text-[13px] font-medium" style={{ color: "#16A34A" }}>
            Prediction complete! Redirecting to results...
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <button
            onClick={onSubmit}
            disabled={submitState === "loading"}
            className="w-full h-12 rounded-lg text-[14px] font-semibold text-white flex items-center justify-center gap-2.5 transition-colors disabled:opacity-75"
            style={{ background: "#1D9E75" }}
          >
            {submitState === "loading" ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Running prediction...
              </>
            ) : (
              "Run myopia prediction →"
            )}
          </button>
          <p className="text-center text-[11px] text-[#9CA3AF]">
            Prediction takes 2–3 seconds. Results will be saved automatically.
          </p>
          <p className="text-center text-[11px] text-[#9CA3AF]">
            This assessment is for clinical decision support only. Results require professional interpretation.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Prediction loading ───────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  { label: "Analyzing patient profile", ms: 600 },
  { label: "Processing refractive measurements", ms: 1300 },
  { label: "Running myopia progression model", ms: 2000 },
  { label: "Generating clinical insights", ms: 2600 },
];

function PredictionLoading({ onComplete }: { onComplete: () => void }) {
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // Step completion timers
    const timers = ANALYSIS_STEPS.map((s, i) =>
      setTimeout(() => setDoneSet((prev) => new Set([...prev, i])), s.ms)
    );
    // Completion callback slightly after last step
    const done = setTimeout(onComplete, 3000);

    // Smooth continuous progress (0 → 100 over ~2800ms)
    const startTime = Date.now();
    const totalMs = 2800;
    const tick = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min((elapsed / totalMs) * 100, 99);
      setPct(Math.round(raw));
    }, 40);
    const stopTick = setTimeout(() => {
      clearInterval(tick);
      setPct(100);
    }, totalMs);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
      clearTimeout(stopTick);
      clearInterval(tick);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const r = 58;
  const circ = 2 * Math.PI * r; // 364.4
  const activeIdx = doneSet.size < ANALYSIS_STEPS.length ? doneSet.size : -1;

  return (
    <div className="px-6 py-8 flex flex-col items-center">
      {/* Large animated ring */}
      <div className="relative w-[152px] h-[152px] mb-8">
        <svg width="152" height="152" viewBox="0 0 152 152">
          {/* Track */}
          <circle cx="76" cy="76" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="76" cy="76" r={r}
            fill="none"
            stroke="#1D9E75"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (pct / 100) * circ}
            transform="rotate(-90, 76, 76)"
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[32px] font-semibold text-[#111827] leading-none tabular-nums">
            {pct}
            <span className="text-[18px] text-[#6B7280]">%</span>
          </span>
          <span className="text-[11px] text-[#9CA3AF] mt-1 uppercase tracking-wider">analyzing</span>
        </div>
      </div>

      {/* Analysis steps */}
      <div className="w-full space-y-2.5">
        {ANALYSIS_STEPS.map((step, i) => {
          const done = doneSet.has(i);
          const active = i === activeIdx;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300"
              style={{
                background: done ? "#F0FBF7" : active ? "#FAFAF8" : "#F9F8F6",
                borderColor: done ? "#A7F3D0" : active ? "#D1D5DB" : "#E5E4DF",
              }}
            >
              {/* Status icon */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  background: done ? "#1D9E75" : active ? "#fff" : "#F3F4F6",
                  border: active ? "2px solid #1D9E75" : "none",
                }}
              >
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : active ? (
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#1D9E75" }} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
                )}
              </div>

              {/* Label */}
              <span
                className="flex-1 text-[13px] transition-colors duration-300"
                style={{
                  color: done ? "#065F46" : active ? "#111827" : "#9CA3AF",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {step.label}
              </span>

              {/* Status text */}
              {done && (
                <span className="text-[11px] font-medium shrink-0" style={{ color: "#16A34A" }}>Done</span>
              )}
              {active && (
                <span className="text-[11px] font-medium shrink-0 animate-pulse" style={{ color: "#1D9E75" }}>
                  Running...
                </span>
              )}
              {!done && !active && (
                <span className="text-[11px] shrink-0" style={{ color: "#D1D5DB" }}>Waiting</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] text-[#9CA3AF] text-center">
        This may take 2–3 seconds. Do not close this page.
      </p>
    </div>
  );
}

// ─── Prediction success ───────────────────────────────────────────────────────

function PredictionSuccess({ patientName }: { patientName: string }) {
  return (
    <div className="px-6 py-10 flex flex-col items-center text-center">
      {/* Large success circle */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#F0FDF4", border: "2px solid #86EFAC" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h3 className="text-[18px] font-semibold text-[#111827] mb-2">Prediction complete</h3>
      <p className="text-[13px] text-[#6B7280] mb-1">
        Results for <span className="font-medium text-[#111827]">{patientName || "this patient"}</span> are ready.
      </p>
      <p className="text-[12px] text-[#9CA3AF] mb-8">
        Review the clinical summary and risk classification below.
      </p>

      {/* Result summary strip */}
      <div className="w-full border border-[#E5E4DF] rounded-lg overflow-hidden mb-6">
        {[
          { label: "Predicted progression", value: "0.82 D/yr", color: "#DC2626" },
          { label: "5-year estimate", value: "−7.35 D", color: "#D97706" },
          { label: "Risk classification", value: "High", color: "#DC2626" },
          { label: "Recommended review", value: "3 months", color: "#1D9E75" },
        ].map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-[#E5E4DF]" : ""}`}
          >
            <span className="text-[12px] text-[#6B7280]">{row.label}</span>
            <span className="text-[13px] font-semibold" style={{ color: row.color }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full h-11 rounded-lg text-[14px] font-semibold text-white transition-colors hover:opacity-90"
        style={{ background: "#1D9E75" }}
      >
        View full clinical report →
      </button>
      <p className="mt-3 text-[11px] text-[#9CA3AF]">
        This assessment is for clinical decision support only. Results require professional interpretation.
      </p>
    </div>
  );
}

// ─── Risk ring ────────────────────────────────────────────────────────────────

function RiskRing({ pct, risk }: { pct: number; risk: Risk | null }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  const color =
    !risk ? "#D1D5DB"
    : risk === "low" ? "#16A34A"
    : risk === "moderate" ? "#D97706"
    : "#DC2626";
  const label = !risk ? "No data" : risk === "low" ? "Low" : risk === "moderate" ? "Moderate" : "High";

  return (
    <div className="relative w-[112px] h-[112px] mx-auto">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle
          cx="56" cy="56" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={circ - filled}
          strokeLinecap="round"
          transform="rotate(-90, 56, 56)"
          style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">{label}</span>
        <span className="text-[10px] text-[#9CA3AF]">risk</span>
      </div>
    </div>
  );
}

// ─── Preview sidebar ──────────────────────────────────────────────────────────

function PreviewSidebar({ form, step }: { form: AssessmentForm; step: number }) {
  const { count, total, pct } = getCompleteness(form);
  const risk = estimateRisk(form);
  const patientName = form.selectedPatient?.name || form.fullName;

  return (
    <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5 space-y-5">
      <h3 className="text-[13px] font-medium text-[#111827]">Assessment preview</h3>

      {/* Patient */}
      {patientName ? (
        <div className="flex items-center gap-2.5 p-3 rounded-lg border" style={{ background: "#F0FBF7", borderColor: "#A7F3D0" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1D9E75" }}>
            <span className="text-white text-[11px] font-semibold">{initials(patientName)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#111827] truncate">{patientName}</p>
            <p className="text-[11px] text-[#6B7280]">
              {form.selectedPatient?.patientId ?? "New patient"}
              {form.selectedPatient?.age ? ` · ${form.selectedPatient.age} yrs` : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-[#E5E4DF] bg-[#F9F8F6] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E5E4DF] flex items-center justify-center shrink-0">
            <span className="text-[#9CA3AF] text-[11px] font-semibold">?</span>
          </div>
          <p className="text-[12px] text-[#9CA3AF]">No patient selected</p>
        </div>
      )}

      {/* Risk ring */}
      <div>
        <RiskRing pct={pct} risk={risk} />
        <p className="text-center text-[11px] text-[#9CA3AF] mt-2">
          {risk
            ? "Estimated risk (preliminary)"
            : "Estimated risk will appear after submission"}
        </p>
      </div>

      {/* Completeness bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Form completeness</span>
          <span className="text-[11px] font-semibold text-[#111827]">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: pct === 100 ? "#16A34A" : "#1D9E75" }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-[#6B7280]">
          {count} of {total} required fields complete
        </p>
      </div>

      {/* Contextual tip */}
      <div className="p-3 rounded-lg border" style={{ background: "#F0FBF7", borderColor: "#A7F3D0" }}>
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-px"><InfoIcon color="#065F46" /></span>
          <p className="text-[11px]" style={{ color: "#065F46" }}>{STEP_TIPS[step]}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewAssessmentPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AssessmentForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  function update<K extends keyof AssessmentForm>(key: K, value: AssessmentForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (step === 1 && !form.selectedPatient) {
      if (!form.fullName.trim()) e.fullName = "Patient name is required";
      if (!form.dob) e.dob = "Date of birth is required";
      if (form.parentMyopia === null) e.parentMyopia = "Select parent myopia status";
    }
    if (step === 2) {
      if (!form.rightSphere) e.rightSphere = "Required";
      if (!form.leftSphere) e.leftSphere = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (!validate()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  function jumpToStep(n: number) {
    setErrors({});
    setStep(n);
  }

  function handleSubmit() {
    setSubmitState("loading");
  }

  const patientName = form.selectedPatient?.name || form.fullName;

  const nextLabel =
    step === 1 ? "Next: Refractive data →"
    : step === 2 ? "Next: Lifestyle →"
    : "Next: Review →";

  return (
    <div className="p-6 flex gap-6 items-start">
      {/* ── Left: multi-step form ───────────────────────────────────── */}
      <div className="flex-1 min-w-0 bg-white border border-[#E5E4DF] rounded-[10px] overflow-visible">
        {submitState === "loading" ? (
          /* ── Prediction loading screen ───────────────────────────── */
          <>
            <div className="px-6 pt-5 pb-4 border-b border-[#E5E4DF]">
              <p className="text-[14px] font-semibold text-[#111827]">Running prediction</p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Analyzing{patientName ? ` ${patientName}'s` : ""} clinical data…
              </p>
            </div>
            <PredictionLoading onComplete={() => setSubmitState("success")} />
          </>
        ) : submitState === "success" ? (
          /* ── Prediction success screen ───────────────────────────── */
          <>
            <div className="px-6 pt-5 pb-4 border-b border-[#E5E4DF]">
              <p className="text-[14px] font-semibold text-[#111827]">Prediction complete</p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Clinical summary for{patientName ? ` ${patientName}` : " this patient"} is ready.
              </p>
            </div>
            <PredictionSuccess patientName={patientName} />
          </>
        ) : (
          /* ── Normal multi-step form ──────────────────────────────── */
          <>
            {/* Step indicator */}
            <div className="px-6 pt-6 pb-5 border-b border-[#E5E4DF]">
              <StepIndicator current={step} onStepClick={jumpToStep} />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-[16px] font-semibold text-[#111827] mb-5">
                {STEP_TITLES[step - 1]}
              </h2>
              {step === 1 && <Step1 form={form} update={update} errors={errors} />}
              {step === 2 && <Step2 form={form} update={update} errors={errors} />}
              {step === 3 && <Step3 form={form} update={update} />}
              {step === 4 && (
                <Step4 form={form} onEdit={jumpToStep} onSubmit={handleSubmit} submitState={submitState} />
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex gap-3">
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium text-[#6B7280] border border-[#E5E4DF] rounded-lg hover:border-[#9CA3AF] hover:text-[#374151] transition-colors"
                >
                  <ArrowLeftIcon /> Back
                </button>
              )}
              {step < 4 && (
                <button
                  onClick={goNext}
                  className="flex-1 h-10 rounded-lg text-[13px] font-semibold text-white transition-colors hover:opacity-90"
                  style={{ background: "#1D9E75" }}
                >
                  {nextLabel}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Right: live preview ─────────────────────────────────────── */}
      <div className="w-[280px] shrink-0 sticky top-6">
        <PreviewSidebar form={form} step={step} />
      </div>
    </div>
  );
}

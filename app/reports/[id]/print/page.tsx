"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Chart: any;
  }
}

function PrinterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function PrintReportPage() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<any>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    if (!chartReady || !chartRef.current || !window.Chart) return;
    const C = window.Chart;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new C(chartRef.current, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Actual",
            data: [
              { x: 8.0, y: -0.5 },
              { x: 8.5, y: -0.75 },
              { x: 9.0, y: -1.25 },
              { x: 9.5, y: -1.75 },
              { x: 10.0, y: -2.25 },
              { x: 10.5, y: -3.0 },
              { x: 11.0, y: -3.25 },
            ],
            borderColor: "#1D9E75",
            borderWidth: 2,
            tension: 0.25,
            pointRadius: 3,
            pointBackgroundColor: "#FFFFFF",
            pointBorderColor: "#1D9E75",
            pointBorderWidth: 1.5,
          },
          {
            label: "Treated",
            data: [
              { x: 11.0, y: -3.25 },
              { x: 12.0, y: -3.8 },
              { x: 13.0, y: -4.2 },
              { x: 14.0, y: -4.5 },
              { x: 15.0, y: -4.72 },
              { x: 16.0, y: -4.88 },
              { x: 17.0, y: -4.98 },
              { x: 18.0, y: -5.05 },
            ],
            borderColor: "#1D9E75",
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            tension: 0.25,
          },
          {
            label: "Untreated",
            data: [
              { x: 11.0, y: -3.25 },
              { x: 12.0, y: -4.15 },
              { x: 13.0, y: -5.2 },
              { x: 14.0, y: -6.1 },
              { x: 15.0, y: -6.85 },
              { x: 16.0, y: -7.4 },
              { x: 17.0, y: -7.8 },
              { x: 18.0, y: -8.05 },
            ],
            borderColor: "#DC2626",
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context: any) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} D`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min: 8,
            max: 18,
            title: { display: true, text: "Age (years)", color: "#6B7280", font: { size: 10 } },
            ticks: { color: "#6B7280", font: { size: 10 } },
            grid: { color: "#F3F4F6" },
          },
          y: {
            min: -8,
            max: 0,
            title: { display: true, text: "Spherical equivalent (D)", color: "#6B7280", font: { size: 10 } },
            ticks: { color: "#6B7280", font: { size: 10 } },
            grid: { color: "#F3F4F6" },
          },
        },
      },
    });

    return () => chartInstanceRef.current?.destroy();
  }, [chartReady]);

  return (
    <div className="print-root min-h-screen bg-white text-[#111827]">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => setChartReady(true)}
      />

      <button
        onClick={() => window.print()}
        className="print-btn fixed top-4 right-4 z-50 h-10 px-4 rounded-lg bg-[#1D9E75] text-white text-[13px] font-medium inline-flex items-center gap-2 shadow-sm"
      >
        <PrinterIcon />
        Download PDF
      </button>

      <main className="a4 mx-auto my-6 border border-[#E5E4DF] bg-white">
        <header className="grid grid-cols-[70%_30%] h-[72px]">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#1D9E75] inline-flex items-center justify-center">
              <LogoIcon />
            </div>
            <div>
              <p className="text-[18px] font-medium leading-none">Stellest</p>
              <p className="text-[11px] text-[#6B7280] mt-1">Myopia Progression Report</p>
            </div>
          </div>
          <div className="bg-[#1D9E75] text-white px-4 py-3">
            <p className="text-[14px] font-medium font-mono">REP-0041</p>
            <p className="text-[11px] text-white/80 mt-1">Generated: 12 Jan 2025</p>
            <p className="text-[11px] text-white/80">Clarity Eye Clinic</p>
          </div>
        </header>

        <section className="grid grid-cols-[60%_40%] border-b border-[#E5E4DF]">
          <div className="px-4 py-3">
            <p className="section-label">PATIENT INFORMATION</p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {[
                ["Full name", "Aanya Mehta"],
                ["Patient ID", "PT-001"],
                ["Date of birth", "14 March 2013 (Age: 11 years)"],
                ["Gender", "Female"],
                ["Contact", "+91 98765 43210"],
                ["Assessed by", "Dr. Priya Sharma, Optometrist"],
                ["Assessment date", "12 January 2025"],
                ["Clinic", "Clarity Eye Clinic, Chennai"],
              ].map(([k, v]) => (
                <div key={k} className="text-[10px]">
                  <p className="text-[#6B7280]">{k}</p>
                  <p className="text-[12px] text-[#111827] mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="section-label text-center">RISK SUMMARY</p>
            <div className="mt-2 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#DC2626] text-white flex flex-col items-center justify-center leading-none">
                <span className="text-[13px] font-medium">HIGH</span>
                <span className="text-[13px] font-medium">RISK</span>
              </div>
              <p className="mt-2 text-[12px] font-medium">Risk score: 0.84 / 1.00</p>
              <div className="mt-2 w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div className="h-full bg-[#DC2626]" style={{ width: "84%" }} />
              </div>
              <div className="mt-2 flex gap-1.5 flex-wrap justify-center">
                {["Age: 11 yrs", "Parental: 2", "0.90 D/yr"].map((pill) => (
                  <span key={pill} className="text-[10px] px-2 py-0.5 rounded bg-[#F3F4F6] text-[#374151]">{pill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-3">
          <p className="section-label mb-2">CLINICAL MEASUREMENTS</p>
          <table className="w-full text-[11px] border border-[#E5E4DF] border-collapse">
            <thead>
              <tr className="bg-[#F7F6F3]">
                {["Measurement", "Right eye", "Left eye", "Normal range", "Status"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 border-b border-[#E5E4DF]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Sphere (D)", "-3.25", "-3.00", "-0.25 to 0.00", "⚠ Myopic", "#D97706"],
                ["Cylinder (D)", "-0.50", "-0.75", "0 to -0.25", "⚠ Mild astig.", "#D97706"],
                ["Axis (°)", "180", "175", "—", "—", "#9CA3AF"],
                ["Visual acuity", "6/9", "6/9", "6/6", "⚠ Reduced", "#D97706"],
                ["Axial length (mm)", "24.8", "24.6", "22.0-24.0", "⚠ Elongated", "#D97706"],
                ["IOP (mmHg)", "14", "15", "10-21", "✓ Normal", "#16A34A"],
              ].map((r, i) => (
                <tr key={r[0]} style={{ background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF9" }}>
                  <td className="px-3 py-2 border-b border-[#E5E4DF]">{r[0]}</td>
                  <td className="px-3 py-2 border-b border-[#E5E4DF]">{r[1]}</td>
                  <td className="px-3 py-2 border-b border-[#E5E4DF]">{r[2]}</td>
                  <td className="px-3 py-2 border-b border-[#E5E4DF]">{r[3]}</td>
                  <td className="px-3 py-2 border-b border-[#E5E4DF]" style={{ color: r[5] }}>{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="px-4 py-3 grid grid-cols-[58%_42%] gap-3 border-t border-[#E5E4DF]">
          <div>
            <p className="section-label mb-2">PROGRESSION FORECAST</p>
            <div className="h-[280px] border border-[#E5E4DF] rounded p-2">
              <canvas ref={chartRef} />
            </div>
            <div className="mt-2 text-[10px] text-[#6B7280] flex gap-3">
              <span>─ Teal solid: Actual</span>
              <span>╌ Teal dashed: Treated</span>
              <span className="text-[#DC2626]">╌ Red dashed: Untreated</span>
            </div>
            <div className="mt-2 text-[11px] space-y-0.5">
              <p><span className="text-[#1D9E75]">Treated (age 18): -5.05 D</span></p>
              <p><span className="text-[#DC2626]">Untreated (age 18): -8.05 D</span></p>
              <p className="font-medium">Projected benefit: -3.00 D</p>
              <p className="font-medium text-[#1D9E75]">Treatment efficacy: 37%</p>
            </div>
          </div>
          <div>
            <p className="section-label mb-2">CONTRIBUTING RISK FACTORS</p>
            <div className="space-y-2">
              {[
                ["Progression rate", "0.90", 90, "#DC2626", "High"],
                ["Parental myopia (2 parents)", "High", 85, "#DC2626", "High"],
                ["Age of onset (8 years)", "Early", 78, "#DC2626", "High"],
                ["Axial length (24.8mm)", "High", 72, "#DC2626", "High"],
                ["Near work hours (5h/day)", "Mod", 52, "#D97706", "Mod"],
                ["Outdoor activity (1.5h/day)", "Low", 45, "#D97706", "Mod"],
                ["Current treatment", "Active", 30, "#16A34A", "Low"],
              ].map((f) => (
                <div key={String(f[0])} className="grid grid-cols-[1fr_38px_66px_28px] items-center gap-2">
                  <span className="text-[11px]">{f[0]}</span>
                  <span className="text-[11px] text-[#6B7280]">{f[1]}</span>
                  <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${f[2]}%`, background: String(f[3]) }} />
                  </div>
                  <span className="text-[9px] text-[#6B7280]">{f[4]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-3 border-t border-[#E5E4DF] clinical-note">
          <div className="flex items-center justify-between mb-2">
            <p className="section-label text-[#065F46]">CLINICAL NOTE</p>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280]">
              Generated by Gemini AI · 12 Jan 2025
            </span>
          </div>
          <p className="text-[12px] leading-[1.8] text-[#1F2937]">
            Patient Aanya Mehta, aged 11, presents with a bilateral myopic refractive error (RE: -3.25/-0.50×180,
            LE: -3.00/-0.75×175) and an elevated axial length (RE: 24.8mm, LE: 24.6mm). Stellest AI models predict
            a progression rate of 0.90 D/yr, placing this patient in the high-risk category (risk score: 0.84/1.00).
            Key contributing factors include early onset myopia (age 8), bilateral parental myopia, below-recommended
            outdoor activity (1.5 hrs/day), and elevated near work load (5 hrs/day). Current Stellest spectacle lens
            treatment is ongoing. A 3-month review is recommended given the accelerating progression trajectory.
          </p>
        </section>

        <section className="px-4 py-3 border-t border-[#E5E4DF]">
          <p className="section-label mb-2">TREATMENT RECOMMENDATIONS</p>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-[#FAFAF9] rounded border-l-[3px] border-[#1D9E75] recommendation-card">
              <p className="text-[12px] font-medium">Stellest spectacle lenses</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857]">Active</span>
              <p className="text-[11px] text-[#374151] mt-2">Evidence-based DIMS lenses showing ~60% reduction in progression. Patient compliance should be monitored at each visit.</p>
              <p className="text-[11px] mt-2">Evidence: ★★★★☆</p>
            </div>
            <div className="p-3 bg-[#FAFAF9] rounded border-l-[3px] border-[#D97706] recommendation-card">
              <p className="text-[12px] font-medium">Increased outdoor activity</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E]">Lifestyle</span>
              <p className="text-[11px] text-[#374151] mt-2">Target minimum 2 hours daily outdoor exposure. Current 1.5 hrs/day is below recommended threshold. Even 30-min increase shows measurable protective effect.</p>
              <p className="text-[11px] mt-2">Evidence: ★★★★★</p>
            </div>
            <div className="p-3 bg-[#FAFAF9] rounded border-l-[3px] border-[#9CA3AF] recommendation-card">
              <p className="text-[12px] font-medium">Low-dose atropine (0.01%)</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563]">Consider</span>
              <p className="text-[11px] text-[#374151] mt-2">Given accelerating progression (0.90 D/yr), atropine adjunct therapy warrants discussion at next consultation. Ophthalmologist referral may be appropriate.</p>
              <p className="text-[11px] mt-2">Evidence: ★★★★★</p>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-[#1D9E75]">📅 Next review recommended: April 2025 (3 months)</p>
        </section>

        <section className="px-4 py-3 border-t border-[#E5E4DF]">
          <div className="rounded-lg border border-[#E5E4DF] bg-[#F7F6F3] px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-medium text-[#111827]">👤 For Aanya &amp; family</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ECECEC] text-[#6B7280]">Plain language summary</span>
            </div>
            <p className="text-[13px] leading-[1.9] text-[#374151]">
              Aanya&apos;s eye check today shows that her glasses prescription is growing faster than we would like - about 0.90 units per year.
              This puts her in the &apos;high risk&apos; group, which means we need to watch her eyes carefully and continue treatment.
              <br /><br />
              The good news is that her current Stellest glasses are helping slow this growth down. Without them, her prescription could
              reach -8.00 by age 18. With treatment, we expect it to reach around -5.00 - that&apos;s a significant difference.
              <br /><br />
              The most important thing Aanya can do right now is spend more time outdoors - ideally at least 2 hours every day. Sunlight
              helps slow eye growth naturally. We also recommend limiting reading and screen time to short sessions with regular breaks.
              <br /><br />
              Please bring Aanya back for her next check-up in April 2025. We will reassess her progress and decide if any changes to treatment are needed.
            </p>
          </div>
        </section>

        <footer className="px-4 py-3 border-t border-[#E5E4DF]">
          <div className="grid grid-cols-2">
            <div>
              <p className="text-[11px] font-medium">Clarity Eye Clinic</p>
              <p className="text-[10px] text-[#6B7280]">42 Anna Salai, Chennai - +91 44 2222 3333</p>
              <p className="text-[10px] text-[#6B7280]">www.clarityeye.com</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#6B7280]">REP-0041 · Dr. Priya Sharma · 12 Jan 2025</p>
              <p className="text-[10px] text-[#6B7280]">Page: 1 of 1</p>
            </div>
          </div>
          <p className="text-[9px] text-center text-[#9CA3AF] mt-3">
            This report is generated by Stellest AI and is intended as clinical decision support only. It does not constitute a medical
            diagnosis or prescription. All clinical decisions must be made by a qualified healthcare professional.
          </p>
          <div className="h-1 bg-[#1D9E75] mt-3" />
        </footer>
      </main>

      <style jsx global>{`
        .print-root {
          font-family: "DM Sans", sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .a4 {
          width: 794px;
        }
        .section-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6b7280;
          font-weight: 500;
        }
        .clinical-note {
          border-left: 3px solid #1d9e75;
          background: #f0fbf7;
          border-radius: 0 6px 6px 0;
        }
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          .print-btn {
            display: none !important;
          }
          body {
            margin: 0;
            background: white;
          }
          .a4 {
            width: 100%;
            margin: 0;
            border: none;
            box-shadow: none;
          }
          .clinical-note,
          .recommendation-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          * {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

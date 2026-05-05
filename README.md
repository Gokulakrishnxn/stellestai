# Stellest AI - Clinical Myopia Decision Support

Stellest AI is a clinical dashboard and assessment platform for myopia progression tracking, risk stratification, treatment planning, and report generation.

This project is built with Next.js App Router and includes:

- protected dashboard shell (sidebar + topbar)
- patient management and assessment workflows
- visual analytics with forecasting charts
- report generation and printable clinical PDF output

## Product Design Goals

- Keep the interface clinician-first: clear information hierarchy, low visual noise.
- Use consistent risk language across all pages (High / Moderate / Low).
- Present complex analytics in explainable, decision-oriented layouts.
- Support both on-screen workflows and print-ready clinical documentation.

## Main Screens

- `Dashboard` - quick clinic overview, risk distribution, overdue follow-ups.
- `Patients` - searchable/filterable patient registry with risk and progression context.
- `New Assessment` - multi-step data capture flow for refractive and lifestyle inputs.
- `Reports` - generated clinical notes, summaries, exports, and preview panel.
- `Visual Analytics` - progression forecasting, cohort benchmarking, treatment scenarios.
- `Print Report` - A4 single-page clinical report at `/reports/[id]/print`.

## Design System Snapshot

- **Primary color:** `#1D9E75` (teal)
- **Critical color:** `#DC2626` (red)
- **Warning color:** `#D97706` (amber)
- **Surface:** white cards on warm gray background (`#F7F6F3`)
- **Border:** `#E5E4DF`
- **Typography:** compact, clinical UI scale (`11px`-`18px` in key layouts)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js (CDN on analytics/print pages)

## Project Structure

```txt
app/
  (protected)/
    analytics/
    assessment/
    dashboard/
    patients/
    reports/
  api/
  components/
  reports/[id]/print/
lib/
hooks/
types/
store/
```

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Current Scope

This repository currently focuses on frontend UX, interaction patterns, and clinical design prototypes. Some data flows are mocked in-page for demonstration and UI validation.

## Notes

- Print styles are included for report output.
- Clinical content is decision-support oriented and intended for professional review.

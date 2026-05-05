import { Fragment } from "react";

function Bone({ className }: { className: string }) {
  return <div className={`rounded bg-[#F3F4F6] animate-pulse ${className}`} />;
}

export default function NewAssessmentLoading() {
  return (
    <div className="p-6 flex gap-6 items-start">
      {/* ── Left: form card skeleton ──────────────────────────────── */}
      <div className="flex-1 min-w-0 bg-white border border-[#E5E4DF] rounded-[10px] overflow-hidden">
        {/* Step indicator skeleton */}
        <div className="px-6 pt-6 pb-5 border-b border-[#E5E4DF]">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((n, i) => (
              <Fragment key={n}>
                <div className="flex flex-col items-center shrink-0 gap-2">
                  <Bone className="w-8 h-8 rounded-full" />
                  <Bone className="w-14 h-2.5" />
                </div>
                {i < 3 && <div className="flex-1 h-[2px] mx-2 mb-5 bg-[#F3F4F6] rounded animate-pulse" />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Form content skeleton */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <Bone className="w-48 h-5" />

          {/* Search bar */}
          <div className="space-y-1.5">
            <Bone className="w-36 h-3" />
            <Bone className="w-full h-[38px]" />
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#F3F4F6]" />
            <Bone className="w-6 h-3" />
            <div className="flex-1 h-px bg-[#F3F4F6]" />
          </div>

          {/* Name field full-width */}
          <div className="space-y-1.5">
            <Bone className="w-24 h-3" />
            <Bone className="w-full h-[38px]" />
          </div>

          {/* Two-col row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Bone className="w-28 h-3" />
              <Bone className="h-[38px]" />
            </div>
            <div className="space-y-1.5">
              <Bone className="w-16 h-3" />
              <Bone className="h-[38px]" />
            </div>
          </div>

          {/* Toggle pills — gender */}
          <div className="space-y-1.5">
            <Bone className="w-16 h-3" />
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => <Bone key={n} className="flex-1 h-10" />)}
            </div>
          </div>

          {/* Toggle pills — parent myopia */}
          <div className="space-y-1.5">
            <Bone className="w-28 h-3" />
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => <Bone key={n} className="flex-1 h-10" />)}
            </div>
          </div>

          {/* Dropdown */}
          <div className="space-y-1.5">
            <Bone className="w-36 h-3" />
            <Bone className="w-full h-[38px]" />
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="px-6 pb-6">
          <Bone className="w-full h-10" />
        </div>
      </div>

      {/* ── Right: preview sidebar skeleton ──────────────────────── */}
      <div className="w-[280px] shrink-0 sticky top-6">
        <div className="bg-white border border-[#E5E4DF] rounded-[10px] p-5 space-y-5">
          {/* Title */}
          <Bone className="w-36 h-4" />

          {/* Patient chip */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#E5E4DF]">
            <Bone className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Bone className="w-24 h-3" />
              <Bone className="w-16 h-2.5" />
            </div>
          </div>

          {/* Risk ring */}
          <Bone className="w-[112px] h-[112px] rounded-full mx-auto" />
          <Bone className="w-40 h-2.5 mx-auto" />

          {/* Completeness bar */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Bone className="w-32 h-2.5" />
              <Bone className="w-8 h-2.5" />
            </div>
            <Bone className="w-full h-1.5 rounded-full" />
            <Bone className="w-44 h-2.5" />
          </div>

          {/* Tip */}
          <Bone className="w-full h-14 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

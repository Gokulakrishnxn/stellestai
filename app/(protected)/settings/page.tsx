"use client";

import { useState } from "react";

function SaveButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="h-9 px-4 rounded-lg bg-[#1D9E75] text-white text-[13px] font-medium hover:bg-[#158963] disabled:opacity-60"
    >
      {loading ? "Saving..." : label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] text-[#6B7280]">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full h-9 rounded-lg border border-[#E5E4DF] bg-white px-3 text-[13px] text-[#111827] outline-none focus:border-[#1D9E75]";

export default function SettingsPage() {
  const googleProfile = {
    name: "DR. LIPIKA ROY",
    email: "lipika@clarityeye.com",
    picture:
      "https://lh3.googleusercontent.com/a/default-user=s96-c",
  };

  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  function saveSection(key: string) {
    setSaving((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSaving((prev) => ({ ...prev, [key]: false }));
      setSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setSaved((prev) => ({ ...prev, [key]: false }));
      }, 3000);
    }, 800);
  }

  return (
    <div className="p-4 sm:p-6 min-h-full bg-[#F7F6F3]">
      <div className="mx-auto max-w-[980px]">
        <div className="w-full space-y-4">
          <section
            id="profile"
            className="bg-white border border-[#E5E4DF] rounded-[12px] overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-4 border-b border-[#E5E4DF] bg-[#FCFCFB]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#111827]">Profile settings</h3>
                  <p className="text-[12px] text-[#6B7280] mt-1">Manage your personal and professional information.</p>
                </div>
                {saved.profile && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#166534] w-fit">
                    ✓ Saved
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="rounded-xl border border-[#E5E4DF] bg-[#F9FAFB] p-4 sm:p-5 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={googleProfile.picture}
                    alt={`${googleProfile.name} profile`}
                    className="h-16 w-16 rounded-full border border-[#E5E4DF] object-cover bg-white"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#111827]">{googleProfile.name}</p>
                    <p className="text-[12px] text-[#6B7280]">chief MEDICAL OFFICER</p>
                    <p className="text-[12px] text-[#6B7280]">{googleProfile.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full name*"><input defaultValue="DR. LIPIKA ROY" className={inputClass} /></Field>
                <Field label="Email*"><input defaultValue="lipika@clarityeye.com" className={inputClass} /></Field>
                <Field label="Phone"><input defaultValue="+91 98765 43210" className={inputClass} /></Field>
                <Field label="Specialisation"><input defaultValue="Optometrist" className={inputClass} /></Field>
                <Field label="Registration no."><input defaultValue="OPT-MH-2018-0042" className={inputClass} /></Field>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E4DF] flex justify-end">
                <SaveButton label="Save profile" loading={!!saving.profile} onClick={() => saveSection("profile")} />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

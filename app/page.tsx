export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <section className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Stelles AI</h1>
          <p className="mt-2 text-sm text-slate-600">
            Clinical risk assessment assistant for patient progression tracking.
          </p>
          <div className="mt-8 space-y-3">
            <a
              href="/dashboard"
              className="flex h-11 items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Enter Dashboard
            </a>
            <a
              href="/patients/new"
              className="flex h-11 items-center justify-center rounded-lg border border-slate-300 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              New Assessment
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

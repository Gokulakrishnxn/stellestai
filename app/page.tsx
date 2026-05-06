import Link from "next/link";
import { 
  ArrowRight, 
  BrainCircuit, 
  LineChart, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Users,
  Stethoscope,
  Sparkles,
  FileBarChart,
  ChevronRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-slate-900 overflow-hidden font-sans selection:bg-slate-200">
      
      {/* MagicUI Style Background Gradient (Very Subtle) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(27,158,117,0.3)_0%,transparent_70%)] blur-[100px]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1b9e75] text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Stellest AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-[#1b9e75] transition-colors">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="flex items-center gap-2 rounded-xl bg-[#1b9e75] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#147b5b] transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-24">
        
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Announcement Pill */}
          <Link href="#features" className="group mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1b9e75]"></span>
            </span>
            <span>Powered by Gemini & BISCUIT Clinical Data</span>
            <ChevronRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          {/* Massive Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1] max-w-4xl">
            Every year without treatment, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1b9e75] via-[#147b5b] to-[#1b9e75]">
              vision gets worse.
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 leading-relaxed mb-10">
            Stellest AI analyzes your patient's clinical data in seconds — predicting myopia progression, estimating Stellest Lens efficacy, and generating comprehensive reports.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="group relative w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1b9e75] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1b9e75]/20 hover:bg-[#147b5b] transition-all duration-300"
            >
              Start Analysis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:bg-slate-50 shadow-sm transition-all duration-300"
            >
              See how it works
            </Link>
          </div>
        </section>

        {/* Dashboard Mockup - MagicUI Floating Style */}
        <section className="mx-auto max-w-6xl px-6 mt-24">
          <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/5 overflow-hidden ring-1 ring-slate-900/5">
            {/* Window Controls */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
              <div className="ml-4 flex-1 flex justify-center">
                <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 font-medium shadow-sm flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-slate-400" />
                  stellest.ai/dashboard
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Sidebar */}
              <div className="border-b lg:border-b-0 lg:border-r border-slate-100 p-8 bg-white flex flex-col justify-center">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Patient Profile</h3>
                <p className="text-sm text-slate-500 mb-8">How old is your patient?</p>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between text-sm font-semibold text-slate-700 mb-3">
                      <span>Current Age</span>
                      <span className="text-[#1b9e75]">7 yrs</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-2 bg-[#1b9e75] w-[20%]"></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between text-sm font-semibold text-slate-700 mb-3">
                      <span>Current Prescription</span>
                      <span className="text-[#1b9e75]">-1.50 D</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-2 bg-[#1b9e75] w-[30%]"></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-400 mt-8 font-medium">
                  * Simplified estimate based on BISCUIT clinical data.
                </p>
              </div>
              
              {/* Main Chart Area */}
              <div className="col-span-2 p-8 relative min-h-[400px] flex flex-col bg-slate-50/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Progression Forecast</h3>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-slate-500">Untreated</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#1b9e75] shadow-sm"></div><span className="text-slate-900">With Stellest Lenses</span></div>
                  </div>
                </div>

                <div className="flex-1 relative mt-4">
                  {/* Grid */}
                  <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-slate-200 pb-6 pl-2">
                    {[0, -2, -4, -6, -8].map((val, i) => (
                      <div key={i} className="w-full h-px bg-slate-200 relative">
                        <span className="absolute -left-8 -top-2 text-[10px] font-medium text-slate-400">{val}D</span>
                      </div>
                    ))}
                    <div className="absolute bottom-0 w-full flex justify-between pt-2 text-[10px] font-medium text-slate-400">
                      <span>Age 7</span><span>Age 11</span><span>Age 15</span><span>Age 18</span>
                    </div>
                  </div>
                  
                  {/* Chart SVGs */}
                  <svg className="absolute inset-0 h-[calc(100%-1.5rem)] w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Untreated Line */}
                    <path d="M0,0 Q40,30 100,90" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
                    
                    {/* Treated Line */}
                    <path d="M0,0 Q40,20 100,35" fill="none" stroke="#1b9e75" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Points */}
                    <circle cx="0" cy="0" r="4" fill="#1b9e75" className="shadow-sm" />
                    <circle cx="100" cy="90" r="4" fill="#ef4444" />
                    <circle cx="100" cy="35" r="4" fill="#1b9e75" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Evidence Stats - Minimal */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-[#1b9e75] font-bold tracking-widest text-xs uppercase mb-3">Clinical Evidence</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">The numbers don't lie</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "67%", label: "Reduction in myopia progression over 2 years" },
              { value: "0.28mm", label: "Average axial length saving vs single vision" },
              { value: "90%", label: "Maintained sharp vision throughout the trial" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="text-6xl font-bold mb-4 text-[#1b9e75] tracking-tighter">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 lg:px-8 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-[#1b9e75] font-bold tracking-widest text-xs uppercase mb-3">Workflow</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">From intake to report in minutes</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-24 right-24 h-px bg-slate-200"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
              {[
                { step: 1, title: "Enter Clinical Data", desc: "Input demographics, refractive data, axial length, and history.", icon: Stethoscope },
                { step: 2, title: "AI Analysis", desc: "Gemini processes data to calculate SER and progression risk.", icon: BrainCircuit },
                { step: 3, title: "Visual Report", desc: "Get an interactive dashboard and PDF report instantly.", icon: FileBarChart },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mb-6 text-[#1b9e75]">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features - MagicUI Bento Grid */}
        <section id="features" className="mx-auto max-w-7xl px-6 lg:px-8 mt-32">
          <div className="mb-16 text-center">
            <h2 className="text-[#1b9e75] font-bold tracking-widest text-xs uppercase mb-3">Features</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Everything a clinician needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Real-time AI Analysis", desc: "Instant predictions powered by Gemini using your patient's clinical data and our Stellest retrospective dataset.", icon: Sparkles },
              { title: "Visual Analytics", desc: "Interactive progression charts comparing treated vs untreated myopia trajectories.", icon: LineChart },
              { title: "PDF Reports", desc: "Professional, printable clinical reports with risk scores and patient-friendly explanations.", icon: FileText },
              { title: "Treatment Efficacy", desc: "Quantified projections of Stellest benefit — diopters saved and axial length slowdown.", icon: ShieldCheck },
              { title: "Risk Stratification", desc: "Multi-factor risk scoring using parental myopia, age of onset, and biometric data.", icon: Activity },
              { title: "Population Benchmarking", desc: "Compare patient data against our retrospective Stellest clinical dataset.", icon: Users },
            ].map((feature, i) => (
              <div key={i} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1b9e75]/10 text-[#1b9e75] mb-12">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-6 lg:px-8 mt-32 mb-16">
          <div className="relative rounded-3xl border border-slate-200 bg-white p-10 sm:p-20 overflow-hidden text-center shadow-2xl shadow-black/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,158,117,0.05)_0%,transparent_70%)]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                A child with myopia at age 7 could reach <span className="text-red-500">−10D by 18</span> without intervention.
              </h2>
              <p className="text-lg text-slate-500 mb-10">
                High myopia is a leading risk factor for permanent vision loss. Stellest AI helps you make evidence-based decisions, fast.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/signup"
                  className="rounded-xl bg-[#1b9e75] text-white px-8 py-4 text-base font-semibold shadow-lg shadow-[#1b9e75]/20 hover:bg-[#147b5b] transition-colors"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-200 bg-white py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Sparkles className="h-5 w-5 text-[#1b9e75]" />
            <span className="text-base font-bold tracking-tight text-slate-900">Stellest AI</span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} Stellest AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

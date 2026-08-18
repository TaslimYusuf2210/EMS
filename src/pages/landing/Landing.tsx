import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Building2,
  BarChart3,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import workTimeSvg from "../../assets/work_time.svg";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description:
      "Keep every employee record — personal details, employment history, and documents — organized in one place.",
  },
  {
    icon: Building2,
    title: "Departments & Roles",
    description:
      "Map your org structure with departments, positions, and reporting lines that stay in sync.",
  },
  {
    icon: BarChart3,
    title: "Insightful Reports",
    description:
      "Track headcount, hiring trends, and salary summaries with clear, always-current analytics.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description:
      "Role-aware access and encrypted authentication keep sensitive people data protected.",
  },
  {
    icon: Clock,
    title: "Time Saved Daily",
    description:
      "Automate the busywork so HR and managers can focus on people, not spreadsheets.",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale",
    description:
      "From a small team to a growing organization, StaffSync grows alongside your workforce.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "10k+", label: "Employees managed" },
  { value: "3x", label: "Faster onboarding" },
  { value: "24/7", label: "Access anywhere" },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fefae0] text-slate-800 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#fefae0]/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#faedcd] flex items-center justify-center text-neutral-950 font-black text-lg shadow-sm">
              S
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              StaffSync
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-700 transition-colors">Features</a>
            <a href="#why" className="hover:text-indigo-700 transition-colors">Why StaffSync</a>
            <a href="#cta" className="hover:text-indigo-700 transition-colors">Get Started</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/create-account"
              className="px-4 py-2 text-sm font-bold text-neutral-950 bg-[#faedcd] hover:bg-[#ccd5ae] rounded-xl shadow-sm transition-colors"
            >
              Get started
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-[#fefae0] px-6 py-4 flex flex-col gap-4">
            <a href="#features" onClick={() => setMenuOpen(false)} className="font-semibold text-slate-600">Features</a>
            <a href="#why" onClick={() => setMenuOpen(false)} className="font-semibold text-slate-600">Why StaffSync</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="font-semibold text-slate-600">Sign in</Link>
            <Link
              to="/create-account"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 text-center text-sm font-bold text-neutral-950 bg-[#faedcd] rounded-xl"
            >
              Get started
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e9edc9] text-indigo-900 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              Smart workforce management
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-950 leading-[1.1]">
              Run your people operations with clarity.
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-lg">
              StaffSync brings employees, departments, and reporting into a single
              dashboard — so HR and managers spend less time chasing data and more
              time building teams.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/create-account"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-neutral-950 bg-[#faedcd] hover:bg-[#ccd5ae] rounded-xl shadow-lg shadow-indigo-100 transition-colors"
              >
                Create an account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-indigo-700 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors"
              >
                Sign in to dashboard
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
              {["No credit card required", "Free to start", "Cancel anytime"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#7d8a4e]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src={workTimeSvg}
              alt="StaffSync illustration"
              className="w-full max-w-md object-contain animate-fade-in hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-indigo-950">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-indigo-950">
            Everything you need to manage your team
          </h2>
          <p className="mt-3 text-slate-600">
            A focused toolkit for the parts of HR that eat the most time.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[#e9edc9] flex items-center justify-center text-indigo-900">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section id="why" className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-indigo-950">
              Why teams switch to StaffSync
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Scattered spreadsheets and siloed tools slow everyone down. StaffSync
              centralizes your people data with a clean, intuitive dashboard your
              whole team will actually enjoy using.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "One source of truth for employees and org structure",
                "Real-time reports without exporting to Excel",
                "Onboarding that takes minutes, not days",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#7d8a4e] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#fefae0] border border-slate-100 rounded-3xl p-8">
            <div className="text-4xl font-extrabold text-indigo-950">“</div>
            <p className="text-lg text-slate-700 leading-relaxed">
              We replaced three tools with StaffSync. Managing our 120-person team
              finally feels effortless.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#ccd5ae] flex items-center justify-center text-neutral-950 font-black">
                A
              </div>
              <div>
                <div className="font-bold text-slate-900">Alex Okafor</div>
                <div className="text-sm text-slate-500">Head of People</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-indigo-950 text-white px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#ccd5ae]" />
            <div className="absolute -bottom-16 -left-10 w-72 h-72 rounded-full bg-[#faedcd]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to simplify your people operations?
            </h2>
            <p className="mt-4 text-indigo-200 max-w-xl mx-auto">
              Join teams already using StaffSync to manage their workforce with
              confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-account"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-neutral-950 bg-[#faedcd] hover:bg-[#ccd5ae] rounded-xl transition-colors"
              >
                Get started free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white border border-indigo-700 hover:bg-indigo-900 rounded-xl transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#faedcd] flex items-center justify-center text-neutral-950 font-black">
              S
            </div>
            <span className="font-bold text-slate-800">StaffSync</span>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} StaffSync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

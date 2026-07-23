import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Award,
  BarChart3,
  Calculator,
  ArrowRight,
  Users,
  FileCheck,
  TrendingUp,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState("");

  const handleLookup = (e) => {
    e.preventDefault();
    if (rollNumber.trim()) {
      navigate(`/student-result?rollNumber=${rollNumber.trim()}`);
    }
  };

//   const stats = [
//     { label: "Students Tracked", value: "12,480" },
//     { label: "Result Batches", value: "64" },
//     { label: "Avg. SGPA", value: "7.82" },
//     { label: "Papers Evaluated", value: "1.2L+" },
//   ];

  const features = [
    {
      icon: FileCheck,
      title: "Student Result",
      desc: "Look up any student's full semester marksheet by roll-number.",
      path: "/student-result",
    },
    {
      icon: Award,
      title: "Top Performer",
      desc: "See branch-wise and batch-wise toppers, ranked by SGPA.",
      path: "/top-performer",
    },
    {
      icon: BarChart3,
      title: "Class Report",
      desc: "Average class SGPA, grade distribution, and subject-wise averages.",
      path: "/class-report",
    },
    {
      icon: Calculator,
      title: "SGPA Calculator",
      desc: "Estimate your SGPA before results are officially declared.",
      path: "/sgpa-calculator",
    },
  ];

  const steps = [
    { n: "01", title: "Enter roll-number", desc: "Type your IET DAVV roll-number into the lookup bar above." },
    { n: "02", title: "Instant computation", desc: "We parse your marksheet and calculate SGPA, grade points, and rank on the fly." },
    { n: "03", title: "View & share", desc: "See your full result breakdown, or share a clean summary link with anyone." },
  ];

  return (
    <div className="font-[Inter] text-slate-900">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white overflow-hidden">
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider text-amber-300 bg-amber-400/10 ring-1 ring-amber-300/30 rounded-full px-3 py-1 mb-5">
              IET DAVV · RESULT PORTAL
            </span>
            <h1 className="font-[Sora] text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Your result, <span className="text-amber-300">decoded</span>.
            </h1>
            <p className="mt-4 text-indigo-100 text-lg max-w-md">
              SGPA, rank, and subject-wise scores for every IET DAVV student —
              searchable in seconds, no waiting for the notice board.
            </p>

            {/* Lookup bar — signature element */}
            <form
              onSubmit={handleLookup}
              className="mt-8 flex items-center gap-2 bg-white/5 backdrop-blur-sm ring-1 ring-white/15 rounded-xl p-2 max-w-md"
            >
              <Search size={18} className="text-indigo-300 ml-2 shrink-0" />
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter rollNumber number, e.g. 24I4086"
                className="flex-1 bg-transparent outline-none font-[JetBrains_Mono] text-sm placeholder:text-indigo-300/60 text-white py-2"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-indigo-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
              >
                Check Result
              </button>
            </form>

            <button
              onClick={() => navigate("/sgpa-calculator")}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-indigo-200 hover:text-white transition-colors"
            >
              Or Guess your SGPA manually <ArrowRight size={14} />
            </button>
          </div>

          {/* Decorative mock result card */}
          <div className="hidden lg:flex justify-center">
            <div className="w-72 rotate-3 bg-white text-slate-900 rounded-2xl shadow-2xl shadow-indigo-950/50 p-5 ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wide">SEMESTER RESULT</span>
                <span className="text-xs font-[JetBrains_Mono] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                  PASS
                </span>
              </div>
              <p className="font-[JetBrains_Mono] text-xs text-slate-400">24I4086</p>
              <p className="font-semibold text-sm mb-4">B.Tech · Information Technology</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400">SGPA</p>
                  <p className="font-[JetBrains_Mono] text-3xl font-bold text-indigo-900">9.14</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Rank</p>
                  <p className="font-[JetBrains_Mono] text-lg font-semibold text-amber-500">#4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      {/* <section className="bg-indigo-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-[JetBrains_Mono] text-2xl sm:text-3xl font-bold text-amber-300">
                {s.value}
              </p>
              <p className="text-xs text-indigo-300 mt-1 tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* FEATURES */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 max-w-xl">
            <h2 className="font-[Sora] text-3xl font-bold tracking-tight">Everything on one dashboard</h2>
            <p className="text-slate-500 mt-2">
              Four tools built for how students and faculty actually use result day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <button
                key={f.path}
                onClick={() => navigate(f.path)}
                className="group text-left bg-white rounded-2xl p-6 ring-1 ring-slate-200 hover:ring-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 grid place-items-center mb-4 group-hover:bg-indigo-900 group-hover:text-amber-300 transition-colors duration-200">
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-[Sora] text-3xl font-bold tracking-tight text-center mb-14">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <span className="font-[JetBrains_Mono] text-5xl font-bold text-indigo-100">
                  {s.n}
                </span>
                <h3 className="font-semibold mt-2">{s.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="hidden sm:block absolute top-4 -right-6 text-slate-300"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-indigo-950 text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Users size={28} className="mx-auto text-amber-300 mb-4" />
          <h2 className="font-[Sora] text-2xl font-bold">Built for IET DAVV, by an IET DAVV student</h2>
          <p className="text-indigo-300 mt-2 text-sm max-w-lg mx-auto">
            No more crowding around the notice board — check, calculate, and
            compare results from anywhere.
          </p>
          <button
            onClick={() => navigate("/student-result")}
            className="mt-6 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Check Your Result <TrendingUp size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
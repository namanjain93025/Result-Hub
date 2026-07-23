import React, { useState } from "react";
import axios from "axios";
import { Calculator, RotateCcw, Info, Loader2 } from "lucide-react";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
const GRADE_OPTIONS = ["O", "A+", "A", "B+", "B", "C", "P", "F"];

const SUBJECT_NAMES = [
  "Theory Subject 1",
  "Theory Subject 2",
  "Theory Subject 3",
  "Theory Subject 4",
  "Theory Subject 5",
  "Theory Subject 6",
  "Practical Subject 1",
  "Practical Subject 2",
  "Practical Subject 3",
  "Practical Subject 4",
];

const TOTAL_SUBJECTS = 10;
const DEFAULT_CREDITS = [4, 4, 4, 4, 4, 4, 1, 1, 1, 1];

const SGPACalculator = () => {
  const [grades, setGrades] = useState(Array(TOTAL_SUBJECTS).fill("O"));
  const [credits, setCredits] = useState([...DEFAULT_CREDITS]);
  const [result, setResult] = useState(null); // { sgpa, totalCredits, totalPoints }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateGrade = (index, value) => {
    const updated = [...grades];
    updated[index] = value;
    setGrades(updated);
  };

  const updateCredit = (index, value) => {
    const updated = [...credits];
    updated[index] = Number(value);
    setCredits(updated);
  };

  const calculateSgpa = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/calculator/sgpa", {
        subjects:grades,
        credits:credits,
      });
    //   console.log(data)
      if(data.success)setResult(data);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to calculate SGPA. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setGrades(Array(TOTAL_SUBJECTS).fill("O"));
    setCredits([...DEFAULT_CREDITS]);
    setResult(null);
    setError("");
  };

  const gradeColor = (grade) => {
    if (grade === "F") return "text-red-500 bg-red-50 ring-red-200";
    if (grade === "O" || grade === "A+") return "text-emerald-600 bg-emerald-50 ring-emerald-200";
    return "text-indigo-700 bg-indigo-50 ring-indigo-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Inter] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 rounded-full px-3 py-1 mb-4">
            <Calculator size={12} /> SGPA CALCULATOR
          </span>
          <h1 className="font-[Sora] text-3xl font-bold text-slate-900 tracking-tight">
            Estimate your semester SGPA
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Enter grades for 6 theory and 4 practical subjects — SGPA is calculated on the server.
          </p>
        </div>

        {/* Result card */}
        <div className="bg-indigo-950 rounded-2xl px-6 py-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-indigo-300 uppercase tracking-wide">Your SGPA</p>
            <p className="font-[JetBrains_Mono] text-5xl font-bold text-amber-300 leading-tight">
              {result ? result.sgpa : "--"}
            </p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wide">Total Credits</p>
              <p className="font-[JetBrains_Mono] text-lg font-semibold text-white">
                {result ? result.totalCredits : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wide">Grade Points</p>
              <p className="font-[JetBrains_Mono] text-lg font-semibold text-white">
                {result ? result.totalPoints : "--"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 ring-1 ring-red-200">
            {error}
          </div>
        )}

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-3 px-1 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          <span className="col-span-6 sm:col-span-7">Subject</span>
          <span className="col-span-2 sm:col-span-2 text-center">Credit</span>
          <span className="col-span-4 sm:col-span-3 text-center">Grade</span>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-slate-200 px-5 mb-6">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide pt-4 pb-1">
            Theory Subjects
          </p>
          {SUBJECT_NAMES.slice(0, 6).map((name, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center py-3 border-b border-slate-100 last:border-b-0">
              <span className="col-span-6 sm:col-span-7 text-sm font-medium text-slate-700 truncate">
                {name}
              </span>
              <input
                type="number"
                min="0"
                max="6"
                value={credits[i]}
                onChange={(e) => updateCredit(i, e.target.value)}
                className="col-span-2 sm:col-span-2 font-[JetBrains_Mono] text-sm text-center bg-slate-50 rounded-lg py-1.5 outline-none ring-1 ring-slate-200 focus:ring-indigo-400"
              />
              <select
                value={grades[i]}
                onChange={(e) => updateGrade(i, e.target.value)}
                className={`col-span-4 sm:col-span-3 font-[JetBrains_Mono] text-sm font-semibold text-center rounded-lg py-1.5 outline-none ring-1 cursor-pointer ${gradeColor(grades[i])}`}
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-slate-200 px-5 mb-6">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide pt-4 pb-1">
            Practical Subjects
          </p>
          {SUBJECT_NAMES.slice(6, 10).map((name, j) => {
            const i = j + 6;
            return (
              <div key={i} className="grid grid-cols-12 gap-3 items-center py-3 border-b border-slate-100 last:border-b-0">
                <span className="col-span-6 sm:col-span-7 text-sm font-medium text-slate-700 truncate">
                  {name}
                </span>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={credits[i]}
                  onChange={(e) => updateCredit(i, e.target.value)}
                  className="col-span-2 sm:col-span-2 font-[JetBrains_Mono] text-sm text-center bg-slate-50 rounded-lg py-1.5 outline-none ring-1 ring-slate-200 focus:ring-indigo-400"
                />
                <select
                  value={grades[i]}
                  onChange={(e) => updateGrade(i, e.target.value)}
                  className={`col-span-4 sm:col-span-3 font-[JetBrains_Mono] text-sm font-semibold text-center rounded-lg py-1.5 outline-none ring-1 cursor-pointer ${gradeColor(grades[i])}`}
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-2 text-xs text-slate-500 max-w-md">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p>Grade points: O=10, A+=9, A=8, B+=7, B=6, C=5, P=4, F=0. Calculated server-side.</p>
          </div>
          <button onClick={resetAll} className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-900 transition-colors">
            <RotateCcw size={14} /> Reset all
          </button>
        </div>

        <button
          onClick={calculateSgpa}
          disabled={loading}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-indigo-950 font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
          {loading ? "Calculating..." : "Calculate SGPA"}
        </button>
      </div>
    </div>
  );
};

export default SGPACalculator;
import React, { useState } from "react";
import { useAppContext } from "../appContext/AppContext";
import { Trophy, Medal, Loader2, AlertCircle, Search } from "lucide-react";

const currentYearShort = new Date().getFullYear() % 100;
const BATCHES = Array.from({ length: 6 }, (_, i) => currentYearShort -1-i); // last 6 admission years

const TopPerformer = () => {
  const {branchOptions,sectionOptions,semesterOptions,axios} = useAppContext();
  console.log("hi ",semesterOptions);
  const [filters, setFilters] = useState({
    branch: "IT",
    section: "A",
    batch: currentYearShort,
    semester: 1,
  });

  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const fetchTopPerformers = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      // console.log(filters)
      const { data } = await axios.get("/api/analytics/top-performers", {
        params: filters, // { branch, section, batch, semester }
      });
      setPerformers(data.topperList); // already sorted by backend, length up to 20
      console.log("top performers are",data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load top performers.");
      setPerformers([]);
    } finally {
      setLoading(false);
    }
  };

  const podiumStyle = (rank) => {
  if (rank === 1) return "bg-amber-700/45 ring-amber-500/80";
  if (rank === 2) return "bg-slate-700/45 ring-slate-500/80";
  if (rank === 3) return "bg-orange-800/45 ring-orange-600/80";
  return "";
};
  const medalColor = (rank) => {
    if (rank === 1) return "text-amber-400";
    if (rank === 2) return "text-slate-300";
    if (rank === 3) return "text-orange-400";
    return "";
  };

  const topThree = performers.slice(0, 3);
  const rest = performers.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 font-[Inter] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 rounded-full px-3 py-1 mb-4">
            <Trophy size={12} /> TOP PERFORMERS
          </span>
          <h1 className="font-[Sora] text-3xl font-bold text-slate-900 tracking-tight">
            Highest SGPA this semester
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Filter by branch, section, batch, and semester to see the top ranked students.
          </p>
        </div>

        {/* Filter bar */}
        <form
          onSubmit={fetchTopPerformers}
          className="bg-white rounded-2xl ring-1 ring-slate-200 p-5 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => updateFilter("branch", e.target.value)}
              className="w-full mt-1 font-[JetBrains_Mono] text-sm bg-slate-50 rounded-lg py-2 px-2 outline-none ring-1 ring-slate-200 focus:ring-indigo-400 cursor-pointer"
            >
              {branchOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Section</label>
            <select
              value={filters.section}
              onChange={(e) => updateFilter("section", e.target.value)}
              className="w-full mt-1 font-[JetBrains_Mono] text-sm bg-slate-50 rounded-lg py-2 px-2 outline-none ring-1 ring-slate-200 focus:ring-indigo-400 cursor-pointer"
            >
              {sectionOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Batch</label>
            <select
              value={filters.batch}
              onChange={(e) => updateFilter("batch", Number(e.target.value))}
              className="w-full mt-1 font-[JetBrains_Mono] text-sm bg-slate-50 rounded-lg py-2 px-2 outline-none ring-1 ring-slate-200 focus:ring-indigo-400 cursor-pointer"
            >
              {BATCHES.map((b) => (
                <option key={b} value={b}>20{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => updateFilter("semester", Number(e.target.value))}
              className="w-full mt-1 font-[JetBrains_Mono] text-sm bg-slate-50 rounded-lg py-2 px-2 outline-none ring-1 ring-slate-200 focus:ring-indigo-400 cursor-pointer"
            >
              {semesterOptions.map((s) => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 sm:col-span-4 mt-1 flex items-center justify-center gap-2 bg-indigo-950 hover:bg-indigo-900 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? "Fetching..." : "Show Top Performers"}
          </button>
        </form>

        {/* Error state */}
        {!loading && error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 ring-1 ring-red-200 mb-6">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Empty / pre-search state */}
        {!loading && !error && searched && performers.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-16">
            No results found for this selection.
          </p>
        )}
        {!loading && !searched && (
          <p className="text-center text-slate-400 text-sm py-16">
            Choose your branch, section, batch, and semester, then hit "Show Top Performers".
          </p>
        )}

        {/* Podium — top 3 */}
        {!loading && !error && topThree.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {topThree.map((student, i) => {
              const rank = i + 1;
              return (
                <div
                  key={student._id}
                  className={`bg-indigo-950 rounded-2xl p-5 ring-1 ${podiumStyle(rank)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Medal size={20} className={medalColor(rank)} />
                    <span className="font-[JetBrains_Mono] text-xs font-semibold text-indigo-300">
                      RANK #{rank}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm leading-snug truncate">
                    {student.studentName}
                  </p>
                  <p className="font-[JetBrains_Mono] text-xs text-indigo-300 mt-1">
                    {student.rollNumber} · {student.enrollmentNumber}
                  </p>
                  <p className="font-[JetBrains_Mono] text-2xl font-bold text-amber-300 mt-3">
                    {student.sgpa.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Ranked list — rest */}
        {!loading && !error && rest.length > 0 && (
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <span className="col-span-1">Rank</span>
              <span className="col-span-4 sm:col-span-5">Name</span>
              <span className="col-span-3">Roll No.</span>
              <span className="hidden sm:block sm:col-span-2">Enrollment</span>
              <span className="col-span-2 sm:col-span-1 text-right">SGPA</span>
            </div>

            {rest.map((student, i) => {
              const rank = i + 4;
              return (
                <div
                  key={student._id}
                  className="grid grid-cols-12 gap-3 items-center px-5 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors duration-150"
                >
                  <span className="col-span-1 font-[JetBrains_Mono] text-sm font-semibold text-slate-400">
                    {rank}
                  </span>
                  <span className="col-span-4 sm:col-span-5 text-sm font-medium text-slate-800 truncate">
                    {student.studentName}
                  </span>
                  <span className="col-span-3 font-[JetBrains_Mono] text-xs text-slate-500">
                    {student.rollNumber}
                  </span>
                  <span className="hidden sm:block sm:col-span-2 font-[JetBrains_Mono] text-xs text-slate-500 truncate">
                    {student.enrollmentNumber}
                  </span>
                  <span className="col-span-2 sm:col-span-1 font-[JetBrains_Mono] text-sm font-bold text-indigo-700 text-right">
                    {student.sgpa.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformer;
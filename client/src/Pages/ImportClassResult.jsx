import { useState } from "react";
import axios from "axios";
 
// Adjust to match your API base setup (e.g. axios instance from api/axiosInstance.js)
// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
 axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
const initialForm = {
  rollPrefix: "",
  startRoll: "",
  endRoll: "",
  studentType: "Regular",
  semester: "",
  academicSession: "",
  section: "A",
  branch: "",
};
 
const STUDENT_TYPES = ["Regular"];
const Branch_Types = ["IT","CS","EI","ETC","CE","ME"];
const Section_Types = ["A","B"];
 
export default function ImportClassResult() {


  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null); // { total, success, failed, failedRolls }
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 
  const validate = () => {
    console.log(form)
    if (!form.rollPrefix.trim()) return "Roll prefix is required.";
    if (!form.startRoll || !form.endRoll) return "Start and end roll numbers are required.";
    if (Number(form.startRoll) > Number(form.endRoll))
      return "Start roll cannot be greater than end roll.";
    if (!form.semester) return "Semester is required.";
    if (!form.academicSession.trim()) return "Academic session is required.";
    if (!form.section.trim()) return "Section is required.";
    if (!form.branch.trim()) return "Branch is required.";
    return "";
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSummary(null);
    console.log('i am  inside submit handler')
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
 
    setLoading(true);
    try {
      console.log(form)
      const { data } = await axios.post(
        `/api/results/import-class-result`,
        {
          ...form,
          startRoll: Number(form.startRoll),
          endRoll: Number(form.endRoll),
          semester: Number(form.semester),
        },
        { withCredentials: true }
      );
 
      setSummary(
        data.summary ?? {
          total  :data.total ?? 0,
          updated: data.totupdatedal ?? 0,
          imported: data.imported ?? 0,
          notFound: data.notFound ?? 0,
          errors: data.errors ?? [],
          failed : data.failed?? 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Import failed. Check the server logs and try again."
      );
    } finally {
      setLoading(false);
    }
  };
 
  const handleReset = () => {
    setForm(initialForm);
    setError("");
    setSummary(null);
  };
 
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Import class result</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fetches results for a roll number range from the college portal and stores them in the database.
        </p>
      </div>
 
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll prefix
            </label>
            <input
              type="text"
              name="rollPrefix"
              value={form.rollPrefix}
              onChange={handleChange}
              placeholder="e.g. 24I40"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start roll
            </label>
            <input
              type="number"
              name="startRoll"
              value={form.startRoll}
              onChange={handleChange}
              placeholder="1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End roll
            </label>
            <input
              type="number"
              name="endRoll"
              value={form.endRoll}
              onChange={handleChange}
              placeholder="60"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student type
            </label>
            <select
              name="studentType"
              value={form.studentType}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STUDENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <input
              type="number"
              name="semester"
              min="1"
              max="8"
              value={form.semester}
              onChange={handleChange}
              placeholder="5"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic session
            </label>
            <input
              type="text"
              name="academicSession"
              value={form.academicSession}
              onChange={handleChange}
              placeholder="e.g. 2025-26"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            
            <select
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Section_Types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
 
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Branch_Types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
 
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}
 
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white text-sm font-medium rounded-md py-2 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Importing..." : "Import results"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-4 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </form>
 
      {summary && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Import summary</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-md p-3 text-center">
              <p className="text-lg font-semibold text-gray-900">{summary.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-green-50 rounded-md p-3 text-center">
              <p className="text-lg font-semibold text-green-700">{summary.imported}</p>
              <p className="text-xs text-gray-500">Imported</p>
            </div>
            <div className="bg-red-50 rounded-md p-3 text-center">
              <p className="text-lg font-semibold text-red-700">{summary.updated}</p>
              <p className="text-xs text-gray-500">Updated</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3 text-center">
              <p className="text-lg font-semibold text-gray-900">{summary.notFound}</p>
              <p className="text-xs text-gray-500">Not Found</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3 text-center">
              <p className="text-lg font-semibold text-gray-900">{summary.failed}</p>
              <p className="text-xs text-gray-500">failed</p>
            </div>
          </div>
 
          {summary.errors?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Failed roll numbers</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {summary.errors.map((roll,i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-50 text-red-700 border border-red-200 rounded px-2 py-0.5"
                  >
                    {roll.rollNumber}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
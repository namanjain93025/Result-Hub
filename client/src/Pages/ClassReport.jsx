import React, { useState } from "react";
import axios from "axios";
import {useAppContext}from '../appContext/AppContext.jsx'
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LoaderCircle,
  Search,
  Users,
} from "lucide-react";

const ClassReport = () => {
  const [formData, setFormData] = useState({
    branch: "",
    section: "",
    batch: "",
    semester: "",
  });
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {branchOptions, sectionOptions,batchOptions,semesterOptions} = useAppContext();


  
 

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { branch, section, batch, semester } = formData;

    if (!branch || !section || !batch || !semester) {
      setError("Please select all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setReport(null);

      const response = await axios.get(
        `/api/analytics/class-report`,
        {
          params: {
            branch,
            section,
            batch,
            semester,
          },
        }
      );

      if (response.data.success) {
        setReport(response.data);
      } else {
        setError(response.data.message || "Unable to generate class report.");
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while fetching the class report."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAverageStyle = (average) => {
    if (average >= 8) {
      return {
        text: "text-emerald-300",
        background: "bg-emerald-500",
      };
    }

    if (average >= 6) {
      return {
        text: "text-amber-300",
        background: "bg-amber-500",
      };
    }

    return {
      text: "text-orange-300",
      background: "bg-orange-500",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}

        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 ring-1 ring-amber-400/40">
            <BarChart3 className="h-8 w-8 text-amber-300" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Class Report
          </h1>

          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            View class performance and subject-wise average grade points
          </p>
        </div>

        {/* Filter form */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Branch */}

            <div>
              <label
                htmlFor="branch"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Branch
              </label>

              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="">Select branch</option>

                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}

            <div>
              <label
                htmlFor="section"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Section
              </label>

              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="">Select section</option>

                {sectionOptions.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch */}

            <div>
              <label
                htmlFor="batch"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Batch
              </label>

              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="">Select batch</option>

                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>
                    20{batch}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}

            <div>
              <label
                htmlFor="semester"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Semester
              </label>

              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="">Select semester</option>

                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Generating Report
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Generate Class Report
              </>
            )}
          </button>
        </form>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Report */}

        {report && (
          <div className="mt-10 space-y-8">
            {/* Selected class */}

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-slate-800 px-4 py-2">
                Branch: {formData.branch}
              </span>

              <span className="rounded-full bg-slate-800 px-4 py-2">
                Section: {formData.section}
              </span>

              <span className="rounded-full bg-slate-800 px-4 py-2">
                Batch: 20{formData.batch}
              </span>

              <span className="rounded-full bg-slate-800 px-4 py-2">
                Semester: {formData.semester}
              </span>
            </div>

            {/* Summary cards */}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-800/90 p-6 ring-1 ring-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Total Students
                    </p>

                    <p className="mt-2 text-4xl font-bold text-slate-100">
                      {report.totalStudent}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-indigo-500/20 p-4 ring-1 ring-indigo-400/30">
                    <Users className="h-8 w-8 text-indigo-300" />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-amber-700/30 p-6 ring-1 ring-amber-500/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-200/80">
                      Class Average SGPA
                    </p>

                    <p className="mt-2 text-4xl font-bold text-amber-200">
                      {Number(report.classAvgSgpa ?? 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-500/20 p-4 ring-1 ring-amber-400/40">
                    <GraduationCap className="h-8 w-8 text-amber-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/20 p-3 ring-1 ring-indigo-400/30">
                  <BookOpen className="h-6 w-6 text-indigo-300" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    Subject-wise Performance
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Average grade point scored in each subject
                  </p>
                </div>
              </div>

              {report.subjects?.length > 0 ? (
                <div className="space-y-4">
                  {report.subjects.map((subject, index) => {
                    const average = Number(subject.average ?? 0);
                    const style = getAverageStyle(average);
                    const width = Math.min(Math.max(average * 10, 0), 100);

                    return (
                      <div
                        key={`${subject.subjectName}-${index}`}
                        className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5"
                      >
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                              Subject {index + 1}
                            </p>

                            <h3 className="mt-1 font-semibold text-slate-100">
                              {subject.subjectName || "Unknown Subject"}
                            </h3>
                          </div>

                          <div
                            className={`rounded-xl bg-slate-900 px-4 py-2 text-lg font-bold ${style.text}`}
                          >
                            {average.toFixed(2)}
                          </div>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className={`h-full rounded-full ${style.background} transition-all duration-500`}
                            style={{ width: `${width}%` }}
                          />
                        </div>

                        <div className="mt-2 flex justify-between text-xs text-slate-500">
                          <span>0</span>
                          <span>Average Grade Point</span>
                          <span>10</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-800 p-6 text-center text-slate-400">
                  No subject data is available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassReport;
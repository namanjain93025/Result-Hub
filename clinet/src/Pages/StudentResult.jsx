import React, { useState ,useEffect} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Hash,
  Loader2,
  Search,
  User,
} from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const StudentResult = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
   const [searchParams] = useSearchParams();
   const rollnum = searchParams.get("rollNumber");
  //  if(rollnum)setRollNumber(rollnum);
  useEffect(() => {
  if (rollnum) {
    setRollNumber(rollnum.toUpperCase());
  }
}, [rollnum]);
  const searchResult = async (event) => {
    event.preventDefault();

    const cleanedRollNumber = rollNumber.trim().toUpperCase();

    if (!cleanedRollNumber) {
      setError("Please enter a roll number.");
      setStudent(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStudent(null);
      setSearched(true);

      const { data } = await axios.get(
        `/api/results/${encodeURIComponent(cleanedRollNumber)}`
      );

      if (!data.success) {
        setError(data.message || "Student result not found.");
        return;
      }

      /*
        Supports responses like:

        {
          success: true,
          result: { ...student data }
        }

        {
          success: true,
          student: { ...student data }
        }

        Or direct student fields with success.
      */
      const studentData = data.result || data.student || data.data || data;

      setStudent(studentData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load the student result."
      );

      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  /*
    Removes the incorrect final entry:

    {
      subjectName: "Marks Range",
      subjectCode: "90-100"
    }
  */
  const subjects = (student?.subjects || []).filter(
    (subject) =>
      subject.subjectName?.trim().toLowerCase() !== "marks range" &&
      subject.subjectCode?.trim() !== "90-100"
  );

  const formatSgpa = (sgpa) => {
    const numericSgpa = Number(sgpa);

    if (Number.isNaN(numericSgpa)) {
      return "N/A";
    }

    return numericSgpa.toFixed(2);
  };

  const getStatusStyle = (status) => {
    if (status?.toLowerCase() === "pass") {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    return "bg-red-50 text-red-700 ring-red-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 font-[Inter]">
      <div className="mx-auto max-w-3xl">
        {/* Header */}

        <div className="mb-8 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wider text-indigo-700 ring-1 ring-indigo-200">
            <GraduationCap size={13} />
            STUDENT RESULT
          </span>

          <h1 className="font-[Sora] text-3xl font-bold tracking-tight text-slate-900">
            Search student result
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter a student roll number to view the semester result.
          </p>
        </div>

        {/* Search form */}

        <form
          onSubmit={searchResult}
          className="mb-8 rounded-2xl bg-white p-5 ring-1 ring-slate-200"
        >
          <label
            htmlFor="rollNumber"
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Roll Number
          </label>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Hash
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(event) =>
                  setRollNumber(event.target.value.toUpperCase())
                }
                placeholder="Example: 24I4001"
                autoComplete="off"
                className="w-full rounded-lg bg-slate-50 py-2.5 pl-10 pr-3 font-[JetBrains_Mono] text-sm uppercase text-slate-800 outline-none ring-1 ring-slate-200 placeholder:normal-case placeholder:text-slate-400 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-36 items-center justify-center gap-2 rounded-lg bg-indigo-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}

              {loading ? "Searching..." : "Search Result"}
            </button>
          </div>
        </form>

        {/* Error */}

        {!loading && error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Initial state */}

        {!loading && !searched && !student && (
          <div className="py-16 text-center">
            <Search size={28} className="mx-auto mb-3 text-slate-300" />

            <p className="text-sm text-slate-400">
              Enter a roll number and click “Search Result”.
            </p>
          </div>
        )}

        {/* No result */}

        {!loading && searched && !error && !student && (
          <div className="py-16 text-center">
            <AlertCircle size={28} className="mx-auto mb-3 text-slate-300" />

            <p className="text-sm text-slate-400">
              No result was found for this roll number.
            </p>
          </div>
        )}

        {/* Result */}

        {!loading && !error && student && (
          <div className="space-y-6">
            {/* Student summary */}

            <div className="overflow-hidden rounded-2xl bg-indigo-950 ring-1 ring-indigo-900">
              <div className="p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-900 ring-1 ring-indigo-700">
                      <User size={22} className="text-indigo-200" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                        Student
                      </p>

                      <h2 className="mt-1 truncate font-[Sora] text-xl font-bold text-white">
                        {student.studentName || "Unknown Student"}
                      </h2>

                      <p className="mt-1 font-[JetBrains_Mono] text-xs text-indigo-300">
                        {student.rollNumber}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-700/45 px-5 py-3 ring-1 ring-amber-500/80">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                      SGPA
                    </p>

                    <p className="mt-1 font-[JetBrains_Mono] text-3xl font-bold text-amber-300">
                      {formatSgpa(student.sgpa)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusStyle(
                      student.resultStatus
                    )}`}
                  >
                    <CheckCircle2 size={13} />
                    {student.resultStatus || "Unknown"}
                  </span>

                  <span className="rounded-full bg-indigo-900 px-3 py-1 text-xs font-medium text-indigo-200 ring-1 ring-indigo-700">
                    {student.studentType || "N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-t border-indigo-900 sm:grid-cols-4">
                <ResultInfo
                  label="Enrollment"
                  value={student.enrollmentNumber}
                />

                <ResultInfo
                  label="Branch"
                  value={student.branch}
                />

                <ResultInfo
                  label="Section"
                  value={student.section}
                />

                <ResultInfo
                  label="Semester"
                  value={`Sem ${student.semester}`}
                />
              </div>

              <div className="grid grid-cols-2 border-t border-indigo-900">
                <ResultInfo
                  label="Batch"
                  value={student.batch ? `20${student.batch}` : "N/A"}
                />

                <ResultInfo
                  label="Student Type"
                  value={student.studentType}
                />
              </div>
            </div>

            {/* Subjects table */}

            {subjects.length > 0 ? (
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
                    <BookOpen size={17} className="text-indigo-700" />
                  </div>

                  <div>
                    <h3 className="font-[Sora] text-base font-semibold text-slate-900">
                      Subject-wise result
                    </h3>

                    <p className="text-xs text-slate-400">
                      Theory and practical grades for each subject
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[650px]">
                    {/* Table header */}

                    <div className="grid grid-cols-12 gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <span className="col-span-1">#</span>

                      <span className="col-span-6">
                        Subject
                      </span>

                      <span className="col-span-2 text-center">
                        Theory
                      </span>

                      <span className="col-span-3 text-center">
                        Practical
                      </span>
                    </div>

                    {/* Table rows */}

                    {subjects.map((subject, index) => (
                      <div
                        key={`${subject.subjectCode}-${index}`}
                        className="grid grid-cols-12 items-center gap-3 border-b border-slate-100 px-5 py-3 transition-colors last:border-b-0 hover:bg-slate-50"
                      >
                        <span className="col-span-1 font-[JetBrains_Mono] text-xs font-semibold text-slate-400">
                          {index + 1}
                        </span>

                        <div className="col-span-6 min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            {subject.subjectName}
                          </p>

                          <p className="mt-1 font-[JetBrains_Mono] text-xs text-slate-400">
                            {subject.subjectCode}
                          </p>
                        </div>

                        <span className="col-span-2 text-center">
                          <GradeBadge grade={subject.theoryGrade} />
                        </span>

                        <span className="col-span-3 text-center">
                          <GradeBadge grade={subject.practicalGrade} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white px-5 py-10 text-center ring-1 ring-slate-200">
                <BookOpen
                  size={26}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="text-sm text-slate-400">
                  No subject details are available.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ResultInfo = ({ label, value }) => {
  return (
    <div className="border-r border-t border-indigo-900 px-5 py-4 last:border-r-0 sm:border-t-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
        {label}
      </p>

      <p className="mt-1 truncate font-[JetBrains_Mono] text-sm font-semibold text-white">
        {value === undefined || value === null || value === ""
          ? "N/A"
          : value}
      </p>
    </div>
  );
};

const GradeBadge = ({ grade }) => {
  const normalizedGrade = grade?.trim().toUpperCase();

  const gradeStyles = {
    O: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "A+": "bg-indigo-50 text-indigo-700 ring-indigo-200",
    A: "bg-blue-50 text-blue-700 ring-blue-200",
    "B+": "bg-cyan-50 text-cyan-700 ring-cyan-200",
    B: "bg-amber-50 text-amber-700 ring-amber-200",
    C: "bg-orange-50 text-orange-700 ring-orange-200",
    F: "bg-red-50 text-red-700 ring-red-200",
    "-": "bg-slate-50 text-slate-400 ring-slate-200",
  };

  const style =
    gradeStyles[normalizedGrade] ||
    "bg-slate-50 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1 font-[JetBrains_Mono] text-xs font-bold ring-1 ${style}`}
    >
      {normalizedGrade || "-"}
    </span>
  );
};

export default StudentResult;
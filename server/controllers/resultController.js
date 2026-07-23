import { getStudentResult } from "../services/resultService.js";

export const searchStudentResult = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const { studentType = "Regular" } = req.query;

    if (!rollNumber?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required",
      });
    }

    const data = await getStudentResult(
      rollNumber,
      studentType
    );

    return res.status(200).json({
      success: true,
      message: "Student result fetched successfully",
      source: data.source,
      student: data.result,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found")
      ? 404
      : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// }
export const downloadResultPdf = async()=>{
    
}
import { importClassResults } from "../services/classImportService.js";

export const importClassResultController = async (req, res) => {
  try {
    
    const {
      rollPrefix,
      startRoll,
      endRoll,
      studentType = "Regular",
      semester,
      academicSession,
      section,
      branch,

    } = req.body;

    if (
      !rollPrefix ||
      startRoll === undefined ||
      endRoll === undefined ||
      !semester ||
      !academicSession||
      !section||
      !branch
    ) {
      return res.status(400).json({
        success: false,
        message:
          "rollPrefix,section, startRoll, endRoll, semester and academicSession are required",
      });
    }

    const start = Number(startRoll);
    const end = Number(endRoll);
    const semesterNumber = Number(semester);

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      end < start
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid roll-number range",
      });
    }

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8",
      });
    }

    // Prevent accidentally importing a very large range
    if (end - start + 1 > 150) {
      return res.status(400).json({
        success: false,
        message: "A maximum of 150 students can be imported at once",
      });
    }
    console.log('i reached till this point')
    const summary = await importClassResults({
      rollPrefix: rollPrefix.trim().toUpperCase(),
      startRoll: start,
      endRoll: end,
      studentType,
      semester: semesterNumber,
      section,
      branch,
      batch : rollPrefix.slice(0,2),
    // academicSession: academicSession.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Class result import completed",
      summary,
    });
  } catch (error) {
    console.error("Class import error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to import class results",
    });
  }
};

import StudentResult from "../models/studentResult.js";
import { fetchResultPage } from "./scraperService.js";
import { parseStudentResult } from "./parserService.js";

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const importClassResults = async ({
  rollPrefix,
  startRoll,
  endRoll,
  studentType,
  semester,
  section,
  branch,
  batch,
  // academicSession,
}) => {
  const summary = {
    total: endRoll - startRoll + 1,
    imported: 0,
    updated: 0,
    notFound: 0,
    failed: 0,
    errors: [],
  };

  for (let number = startRoll; number <= endRoll; number++) {
    
    // console.log('inside loop')
    const studentNumber = String(number).padStart(2, "0");
    const rollNumber = `${rollPrefix}${studentNumber}`;

    try {
      console.log(`Fetching result for ${rollNumber}`);

      // 1. Fetch HTML from college website
      const html = await fetchResultPage(rollNumber, studentType);

      // 2. Convert HTML into a JavaScript object
      const parsedResult = parseStudentResult(html);

      if (!parsedResult) {
        summary.notFound++;

        summary.errors.push({
          rollNumber,
          message: "Result not found",
        });

        await delay(500);
        continue;
      }

      /*
        semester and academicSession are being added here because
        your result-page parser may not extract them from the HTML.
      */
      const resultData = {
        ...parsedResult,
        rollNumber,
        studentType,
        semester,
        section,
        branch,
        batch,
        // academicSession,
        fetchedAt: new Date(),
      };

      // Check whether the semester result already exists
      const existingResult = await StudentResult.findOne({
        enrollmentNumber: resultData.enrollmentNumber,
        semester,
        // academicSession,
        studentType,
      });

      // Save a new result or update an existing result
      await StudentResult.findOneAndUpdate(
        {
          enrollmentNumber: resultData.enrollmentNumber,
          semester,
          // academicSession,
          studentType,
        },
        {
          $set: resultData,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      if (existingResult) {
        summary.updated++;
      } else {
        summary.imported++;
      }
    } catch (error) {
      summary.failed++;

      summary.errors.push({
        rollNumber,
        message: error.message,
      });

      console.error(
        `Failed to import ${rollNumber}:`,
        error.message
      );
    }

    // Avoid sending requests too quickly to the college website
    await delay(700);
  }

  return summary;
};
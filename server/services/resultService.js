import StudentResult from "../models/studentResult.js";
import { fetchResultPage } from "./scraperService.js";
import { parseStudentResult } from "./parserService.js";

export const getStudentResult = async (
  rollNumber,
  studentType = "Regular"
) => {
  const normalizedRollNumber = rollNumber.trim().toUpperCase();

  // 1. Check whether the result already exists in MongoDB
  const existingResult = await StudentResult.findOne({
    rollNumber: normalizedRollNumber,
    studentType,
  }).lean();
  //TODO : learn about .lena

  if (existingResult) {
    return {
      result: existingResult,
      source: "database",
    };
  }

  // 2. Fetch HTML from the college result website
  const html = await fetchResultPage(
    normalizedRollNumber,
    studentType
  );

  // 3. Parse the HTML and convert it into a JavaScript object
  const parsedResult = parseStudentResult(html);

  if (!parsedResult) {
    throw new Error("Result not found for the provided roll number");
  }
  const branchMap = {
  I: "IT",
  T: "ETC",
  C: "CS",
  E: "EI"
};
  const sectionMap = {
  0: "A",
  1: "B",
};
  // 4. Add values that may not be directly returned by the parser
  const resultData = {
    ...parsedResult,
    rollNumber: normalizedRollNumber,
    studentType,
    section : sectionMap[rollNumber[4]],
    branch :branchMap[rollNumber[2]],
    batch : rollNumber.slice(0, 2), 
    fetchedAt: new Date(),
  };
   console.log(resultData);
  // 5. Save the result in MongoDB
  const savedResult = await StudentResult.findOneAndUpdate(
    {
      enrollmentNumber: resultData.enrollmentNumber,
      semester: resultData.semester,
      // academicSession: resultData.academicSession,
      studentType,
    },
    resultData,
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  ).lean();

  // 6. Return the result to the controller
  return {
    result: savedResult,
    source: "college-website",
  };
};
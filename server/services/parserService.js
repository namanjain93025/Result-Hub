import * as cheerio from "cheerio";

export const parseStudentResult = (html) => {
  const $ = cheerio.load(html);

  const pageText = $("body").text().replace(/\s+/g, " ").trim();

  if (
    pageText.includes("Result not available") ||
    pageText.includes("Result Not Found")
  ) {
    return null;
  }

  const tables = $("table");

  if (tables.length === 0) {
    return null;
  }

  let enrollmentNumber = "";
  let rollNumber = "";
  let studentName = "";
  let resultStatus = "";
  let sgpa = null;
  let semester = null;
  let academicSession = "";
  const subjects = [];

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("td, th")
      .map((_, cell) => $(cell).text().replace(/\s+/g, " ").trim())
      .get();

    if (cells.length < 2) return;

    const label = cells[0].toLowerCase();
    const value = cells[1];

    if (label.includes("enrollment")) {
      enrollmentNumber = value;
    }

    if (label.includes("roll")) {
      rollNumber = value;
    }

    if (label.includes("name")) {
      studentName = value;
    }

    if (label.includes("result")) {
      resultStatus = value;
    }

    if (label.includes("sgpa")) {
      sgpa = Number.parseFloat(value);
    }

    if (label.includes("semester")) {
      const semesterMatch = value.match(/\d+/);

      if (semesterMatch) {
        semester = Number(semesterMatch[0]);
      }
    }
   
    if (
      label.includes("session") ||
      label.includes("academic session")
    ) {
      academicSession = value;
    }
  });

  /*
    Adjust this selector according to the table that contains subjects.
    The logic assumes a row has:

    Subject name | Subject code | Theory grade | Practical grade
  */

  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("td")
      .map((_, cell) => $(cell).text().replace(/\s+/g, " ").trim())
      .get();

    if (cells.length < 4) return;

    const [subjectName, subjectCode, theoryGrade, practicalGrade] =
      cells;

    const looksLikeSubjectCode =
      /^[A-Z0-9-]{3,}$/i.test(subjectCode);

    if (!looksLikeSubjectCode) return;

    subjects.push({
      subjectName,
      subjectCode,
      theoryGrade: theoryGrade || "-",
      practicalGrade: practicalGrade || "-",
    });
  });

  if (!rollNumber || !studentName) {
    return null;
  }

  return {
    enrollmentNumber,
    rollNumber,
    studentName,
    semester : rollNumber[3],
    academicSession ,
    resultStatus,
    sgpa,
    subjects,
  };
};
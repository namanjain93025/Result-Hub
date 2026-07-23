export const calculateSGPA = (req, res) => {
  try {
    console.log('inside calculator')
    const { subjects, credits } = req.body;

    if (!Array.isArray(subjects) || !Array.isArray(credits)) {
      return res.status(400).json({
        success: false,
        message: "Subjects and credits must be arrays",
      });
    }

    if (subjects.length === 0 || credits.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subjects and credits cannot be empty",
      });
    }

    if (subjects.length !== credits.length) {
      return res.status(400).json({
        success: false,
        message: "Every subject must have a corresponding credit",
      });
    }
    if (subjects.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Enter All Subjects",
      });
    }

    const gradeMap = {
      O: 10,
      "A+": 9,
      A: 8,
      "B+": 7,
      B: 6,
      C: 5,
      P: 4,
      F: 0,
    };

    let totalObtainedPoints = 0;
    let totalCredits = 0;

    for (let i = 0; i < subjects.length; i++) {
      const grade = subjects[i].toUpperCase();
      const gradePoint = gradeMap[grade];
      const credit = Number(credits[i]);

      if (gradePoint === undefined) {
        return res.status(400).json({
          success: false,
          message: `Invalid grade: ${subjects[i]}`,
        });
      }
     
      if (!Number.isFinite(credit) || credit <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid credit at position ${i}`,
        });
      }

      totalObtainedPoints +=( gradePoint * credit);
      totalCredits += credit;
    }

    const sgpa = totalObtainedPoints / totalCredits;
    console.log(sgpa)
    return res.status(200).json({
      success: true,
      sgpa: Number(sgpa.toFixed(2)),
      totalCredits,
      totalPoints:totalObtainedPoints, 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
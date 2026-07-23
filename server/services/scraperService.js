import axios from "axios";

const RESULT_URL =
  "https://results.ietdavv.edu.in/DisplayStudentResult";

export const fetchResultPage = async (
  rollNumber,
  studentType
) => {
  try {
    const response = await axios.get(RESULT_URL, {
      params: {
        rollno: rollNumber,
        typeOfStudent: studentType,
      },

      timeout: 10000,

      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("College result website took too long to respond");
    }

    throw new Error("Unable to fetch result from college website");
  }
};
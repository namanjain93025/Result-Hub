import express from 'express'


import{
  searchStudentResult,
  importClassResultController,
  downloadResultPdf,
} from "../controllers/resultController.js"

const result = express.Router();

result.get("/:rollNumber/pdf", downloadResultPdf);
result.get("/:rollNumber", searchStudentResult);
result.post("/import-class-result", importClassResultController);

export default result;
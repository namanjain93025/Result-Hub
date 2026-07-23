import express from 'express'

import{
  getTopPerformers,
  getBranchReport,
} from"../controllers/analyticsController.js"

const analytics = express.Router();

analytics.get("/top-performers", getTopPerformers);
analytics.get("/class-report", getBranchReport);

export default analytics;
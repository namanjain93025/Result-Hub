import express from 'express'

import{calculateSGPA} from "../controllers/calculatorController.js";

const calculateRoute = express.Router();

calculateRoute.post("/sgpa", calculateSGPA);

export default calculateRoute;
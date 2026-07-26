import express from 'express'
import dotenv from "dotenv";
import { connnectTODB } from './config/db.js';
import analytics from './routes/analyticsRoutes.js';
import calculateRoute from './routes/calculatorRoutes.js';
import result from './routes/resultRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import adminRoute from './routes/adminRoutes.js';
//instance of express
const app = express();
dotenv.config();


const port = process.env.PORT
const allowedOrigins =['http://localhost:5173','https://result-hub-eta.vercel.app/']
//middlewares
app.use(express.json());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(cookieParser());
await connnectTODB();

app.use("/api/results", result);
app.use("/api/analytics", analytics);
app.use("/api/calculator", calculateRoute);
app.use('/api/admin',adminRoute)
app.get('/',(req,res)=>{
    return res.json({
        success: true,
        message: "ResultIQ API is running",
    })
})
app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})


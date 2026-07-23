import express from 'express'
import {adminAuth } from '../middelware/adminAuth.js'
import {adminLogin,isAdminAuth,adminLogout} from '../controllers/admin.js'

const adminRoute  = express.Router();

adminRoute.post('/login',adminLogin)
adminRoute.get('/auth',adminAuth,isAdminAuth);
adminRoute.post('/logout',adminAuth,adminLogout);

export default adminRoute
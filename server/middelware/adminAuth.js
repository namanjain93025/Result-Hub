import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
configDotenv();

export const adminAuth = async (req ,res,next)=>{
    try {
       const { adminToken } = req.cookies;

       if(!adminToken){
        return res.json({
            success  :false,
            message  :'Not Authorized',
        })
       }
       const tokenDecode =  jwt.verify(adminToken,process.env.JWT_SECRET)
       if(!tokenDecode || tokenDecode.username !== process.env.USERNAME){
        return res.json({
            success  :false,
            message  :'Not Authorized',
        })
       }
       next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

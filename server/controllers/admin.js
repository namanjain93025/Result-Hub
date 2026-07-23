import jwt from 'jsonwebtoken'
import dotenv, { configDotenv } from 'dotenv'
configDotenv();

export const adminLogin = async(req ,res)=>{
  try {
    const {username,password} = req.body;
    if(!username || !password){
        return res.json({
            success :false,
            message :"Enter all credentials"
        })
    }
    console.log(username,password,process.env.USERNAME,process.env.PASSWORD)
    if(username!== process.env.USERNAME || password!==process.env.PASSWORD){
        return res.json({
            success : false,
            message :"Invalid Credentials"
        })
    }
    const token = jwt.sign({username:username},process.env.JWT_SECRET ,{expiresIn:"7d"});
     return res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).json({
                success: true,
                message: 'Logged in successfully',
            })
    
  } catch (error) {
    return res.json({
        success :false,
        message :error.message,
    })
  }
}


export const isAdminAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });

    }
}

export const adminLogout = async(req ,res)=>{
    try {
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({
            success : true,
            message : 'Admin logged out Successfully'
        })
    } catch (error) {
       
        return res.json({
        success :false,
        message :error.message,
        })
    }
}
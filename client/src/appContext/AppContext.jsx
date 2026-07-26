import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  
  const fetchAdmin = async () => {
        try {
            const { data } = await axios.get('/api/admin/auth');
            if (data.success) {
                setIsAdminLogin(true);
                navigate('/import-class-result')
            } else {
                setIsAdminLogin(false);
            }
        } catch (error) {
            setIsAdminLogin(false);
        }
    }
    
    useEffect(()=>{
     fetchAdmin();

    },[])
   
  const value = {
    setIsAdminLogin,
    isAdminLogin,
    navigate,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};



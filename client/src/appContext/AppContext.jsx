import { createContext, useEffect, useState ,useContext} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
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

    
   const sectionOptions = ["A", "B"];
   const branchOptions = ["IT", "CS", "EI", "ME", "CE", "ETC"];
   const batchOptions = ["22", "23", "24", "25"];
   const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];
   const STUDENT_TYPES = "Regular";
   const value = {
    setIsAdminLogin,
    isAdminLogin,
    navigate,
    axios,
    branchOptions,
    sectionOptions,
    batchOptions,
    semesterOptions,
    STUDENT_TYPES,
    };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = ()=>{
    return useContext(AppContext);
}



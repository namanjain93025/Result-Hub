import React ,{useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import ImportClassResult from "./Pages/ImportClassResult";
import SGPACalculator from "./Pages/SGPACalculator";
import ClassReport from "./Pages/ClassReport";
import StudentResult from "./Pages/StudentResult";
import TopPerfomer from "./Pages/TopPerfomer";
import AdminLogin from "./component/AdminLogin";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { AppContext } from "./appContext/AppContext";
import AdminNavbar from "./component/AdminNavbar";
const App = () => {
  const { isAdminLogin, setIsAdminLogin } = useContext(AppContext);
  console.log( "isAdmin login ",isAdminLogin);
  return (
    <>
     {isAdminLogin ?<AdminNavbar/>:<Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/class-report" element={<ClassReport />} />
        <Route path="/import-class-result" element={isAdminLogin ?<ImportClassResult/>:<AdminLogin/> } />
        <Route path="/sgpa-calculator" element={<SGPACalculator />} />
        <Route path="/student-result" element={<StudentResult />} />
        <Route path="/top-performer" element={<TopPerfomer />} />
      </Routes>
      
      <Footer/>
    </>
  );
};

export default App;
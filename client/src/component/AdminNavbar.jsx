import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../appContext/AppContext";
import { GraduationCap, LoaderCircle, LogOut } from "lucide-react";

const AdminNavbar = () => {
  const {setIsAdminLogin,
        navigate,
        axios} = useContext(AppContext);
    const [loggingOut, setLoggingOut] = useState(false);
   
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post("/api/admin/logout");
     setIsAdminLogin(false)
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900/95 backdrop-blur-md shadow-lg shadow-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-white shrink-0"
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/30">
            <GraduationCap size={20} />
          </span>
          <span className="tracking-tight">
            Result<span className="text-amber-300">Hub</span>
          </span>
          <span className="ml-2 hidden sm:inline-block rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-300/30">
            Admin
          </span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-indigo-100 transition-colors duration-200 hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              <span className="hidden sm:inline">Logging out</span>
            </>
          ) : (
            <>
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
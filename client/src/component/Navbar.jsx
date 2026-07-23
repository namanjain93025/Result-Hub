import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Student Result", path: "/student-result" },
    { name: "Top Performer", path: "/top-performer" },
    { name: "Class Report", path: "/class-report" },
    { name: "SGPA Calculator", path: "/sgpa-calculator" },
    { name: "Admin", path: "/import-class-result" },
  ];

  const linkClass = ({ isActive }) =>
    `relative py-1 font-medium transition-colors duration-200 ${
      isActive ? "text-white" : "text-indigo-100 hover:text-white"
    } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-amber-400 after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900/95 backdrop-blur-md shadow-lg shadow-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-white shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/30">
            <GraduationCap size={20} />
          </span>
          <span className="tracking-tight">
            Result<span className="text-amber-300">Hub</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 border-t border-white/10" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-4 py-3 gap-1 bg-indigo-950/95">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-amber-400/15 text-amber-300"
                    : "text-indigo-100 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
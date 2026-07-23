import React from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = [
    { name: "Student Result", path: "/student-result" },
    { name: "Top Performer", path: "/top-performer" },
    { name: "Class Report", path: "/class-report" },
    { name: "SGPA Calculator", path: "/sgpa-calculator" },
  ];

  return (
    <footer className="bg-indigo-950 text-indigo-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-bold text-white shrink-0">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/30">
            <GraduationCap size={16} />
          </span>
          <span className="tracking-tight">
            Result<span className="text-amber-300">Hub</span>
          </span>
        </NavLink>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="hover:text-amber-300 transition-colors duration-200"
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-indigo-400 shrink-0">
          © {year} ResultHub · IET DAVV
        </p>
      </div>
    </footer>
  );
};

export default Footer;
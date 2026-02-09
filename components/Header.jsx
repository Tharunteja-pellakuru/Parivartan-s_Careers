import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Logo from "../assets/Logo.svg";
import Patch from "../assets/patch.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navClasses = ({ isActive }) =>
    `font-medium text-base transition-colors whitespace-nowrap hover:text-brand-500 ${
      isActive ? "text-brand-500 font-semibold" : "text-slate-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-100 relative">
      {/* Decorative Patch */}
      <img
        src={Patch}
        alt="Patch"
        className="absolute top-0 right-0 h-12 w-auto object-contain pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-90 transition-opacity">
            <NavLink to="/" className="flex items-center gap-2">
              <img
                src={Logo}
                alt="eParivartan"
                className="h-12 md:h-14 lg:h-16 w-auto object-contain"
              />
            </NavLink>
          </div>

          {/* Desktop Menu - Visible only on Large screens (lg:flex) */}
          <div className="hidden lg:flex space-x-8 items-center font-heading lg:mr-16">
            <NavLink to="/" className={navClasses}>
              Home
            </NavLink>
            <NavLink to="/why-join" className={navClasses}>
              Why Join
            </NavLink>
            <NavLink to="/process" className={navClasses}>
              Process
            </NavLink>
            <NavLink to="/positions" className={navClasses}>
              Current Openings
            </NavLink>
          </div>

          {/* Mobile/Tablet Button - Visible up to Large screens (lg:hidden) */}
          <div className="lg:hidden flex items-center gap-4 mr-8">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-brand-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 animate-fade-in-up font-heading">
          <div className="px-4 pt-4 pb-6 space-y-2 sm:px-3">
            <NavLink
              to="/"
              className="block px-3 text-center py-3 rounded-md text-base font-medium text-slate-700 hover:text-brand-500 hover:bg-brand-50"
            >
              Home
            </NavLink>
            <NavLink
              to="/why-join"
              className="block px-3 text-center py-3 rounded-md text-base font-medium text-slate-700 hover:text-brand-500 hover:bg-brand-50"
            >
              Why Join
            </NavLink>
            <NavLink
              to="/process"
              className="block px-3 py-3 text-center rounded-md text-base font-medium text-slate-700 hover:text-brand-500 hover:bg-brand-50"
            >
              Process
            </NavLink>
            <NavLink
              to="/positions"
              className="block px-3 py-3 text-center rounded-md text-base font-medium text-slate-700 hover:text-brand-500 hover:bg-brand-50"
            >
              current Openings
            </NavLink>
            {/* <NavLink
              to="/positions"
              className="block w-full text-center mt-6 bg-brand-500 hover:bg-brand-600 text-white px-5 py-4 rounded-md font-bold shadow-lg"
            >
              APPLY NOW
            </NavLink> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

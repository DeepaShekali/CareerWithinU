import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, GraduationCap, Compass, BookOpen, Building2, Briefcase, User, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
              CareerWithin<span className="text-purple-600">U</span>
            </span>
            <span className="hidden sm:block text-[10px] text-purple-600 tracking-wider font-semibold uppercase -mt-1">
              AI Career Guidance Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Link to="/" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50/80 transition-colors">
            Home
          </Link>
          <Link to="/recommendations" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50/80 transition-colors flex items-center gap-1">
            <Compass className="w-4 h-4 text-purple-600" />
            Explore Careers
          </Link>
          <Link to="/colleges" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50/80 transition-colors flex items-center gap-1">
            <Building2 className="w-4 h-4 text-purple-600" />
            Colleges
          </Link>
          <Link to="/resources" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50/80 transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-purple-600" />
            Resources
          </Link>
          <Link to="/jobs" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50/80 transition-colors flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-purple-600" />
            Jobs & Internships
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm shadow-purple-500/25 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-xl text-sm font-medium text-purple-700 bg-purple-100/70 hover:bg-purple-200/70 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Log Out"
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm shadow-purple-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  FileCheck2,
  Building2,
  BookOpen,
  Compass,
  Map,
  User,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  Briefcase,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ className = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'AI Chat', path: '/dashboard', icon: MessageSquare, badge: 'Live AI' },
    { name: 'Assessments', path: '/assessment', icon: FileCheck2 },
    { name: 'Career Recommendations', path: '/recommendations', icon: Compass },
    { name: 'Learning Roadmap', path: '/roadmap', icon: Map, badge: '7 Phases' },
    { name: 'Progress Tracker', path: '/progress', icon: BarChart3 },
    { name: 'College Search', path: '/colleges', icon: Building2 },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Jobs & Internships', path: '/jobs', icon: Briefcase },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`w-64 bg-white border-r border-purple-100 flex flex-col justify-between h-screen sticky top-0 shadow-xs ${className}`}>
      {/* Top Branding */}
      <div>
        <div className="p-5 pb-4 border-b border-purple-50">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent leading-tight">
                CareerWithin<span className="text-purple-600">U</span>
              </h1>
              <p className="text-[11px] text-purple-600 font-semibold tracking-wide">
                AI Career Platform
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-100/80 text-purple-900 font-semibold shadow-xs'
                      : 'text-gray-600 hover:text-purple-900 hover:bg-purple-50/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-200/80 text-purple-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {user?.role === 'admin' && (
            <div className="pt-2">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-3 mb-1">
                Administration
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-900 font-semibold'
                      : 'text-gray-600 hover:text-indigo-900 hover:bg-indigo-50'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Admin Dashboard</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Profile & Logout */}
      <div className="p-3 border-t border-purple-100 bg-lavender-50/70">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-purple-100/70 shadow-xs mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.full_name?.charAt(0) || 'S'
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-900 truncate">{user?.full_name || 'Student'}</p>
              <p className="text-[10px] text-purple-600 truncate">{user?.profile?.target_role || user?.role || 'AI Aspirant'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 px-2 py-1">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </span>
          <span className="text-purple-600 font-medium">v2.0 Local</span>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Heart, Shield, HelpCircle, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-lavender-100/60 border-t border-purple-100 text-gray-700 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent">
                CareerWithin<span className="text-purple-600">U</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              AI-driven career discovery, dynamic skill gap analysis, personalized roadmaps, and intelligent mentorship empowering students to achieve their highest career potential.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[11px] font-semibold text-purple-800">
              <Sparkles className="w-3 h-3 text-purple-600" />
              Lavender Pastel Edition
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3.5">Platform Features</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/recommendations" className="hover:text-purple-700 transition-colors">AI Career Recommendation</Link></li>
              <li><Link to="/assessment" className="hover:text-purple-700 transition-colors">Psychometric & Aptitude Assessment</Link></li>
              <li><Link to="/roadmap" className="hover:text-purple-700 transition-colors">7-Phase Learning Roadmap</Link></li>
              <li><Link to="/progress" className="hover:text-purple-700 transition-colors">Skill Gap & Readiness Analysis</Link></li>
              <li><Link to="/dashboard" className="hover:text-purple-700 transition-colors">CareerWithinU AI Chatbot</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3.5">Student Hub</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/colleges" className="hover:text-purple-700 transition-colors">Colleges & Universities</Link></li>
              <li><Link to="/resources" className="hover:text-purple-700 transition-colors">Free Learning Resources</Link></li>
              <li><Link to="/jobs" className="hover:text-purple-700 transition-colors">Jobs & Internships</Link></li>
              <li><Link to="/login" className="hover:text-purple-700 transition-colors">Student Demo Account</Link></li>
              <li><Link to="/login" className="hover:text-purple-700 transition-colors">Admin Demo Account</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3.5">University Project Demo</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Built for live college project demonstration. Demonstrates full-stack AI recommendations, SQLite persistence, and interactive mentorship.
            </p>
            <div className="text-[11px] text-gray-500 bg-white/70 p-2.5 rounded-xl border border-purple-100">
              <span className="font-semibold text-purple-800">Quick Credentials:</span><br />
              Student: student@careerwithinu.com / student123<br />
              Admin: admin@careerwithinu.com / admin123
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-purple-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 CareerWithinU. All rights reserved. Built with React, Tailwind, and FastAPI.</p>
          <div className="flex items-center gap-4">
            <span className="text-purple-600 font-medium">Demonstration Project</span>
            <span>•</span>
            <span>Local AI Matching</span>
            <span>•</span>
            <span>Interactive Chatbot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

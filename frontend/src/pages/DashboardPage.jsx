import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MiddlePanel from '../components/MiddlePanel';
import ChatbotPanel from '../components/ChatbotPanel';
import { MessageSquare, LayoutDashboard, Menu, X } from 'lucide-react';

export default function DashboardPage() {
  const [mobileTab, setMobileTab] = useState('overview'); // 'overview' or 'chat'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-purple-100 z-30">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-purple-700 hover:bg-purple-50 rounded-xl"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <span className="text-sm font-bold bg-gradient-to-r from-purple-900 to-indigo-900 bg-clip-text text-transparent">
          CareerWithin<span className="text-purple-600">U</span>
        </span>

        {/* Mobile Tab Toggle */}
        <div className="flex rounded-xl bg-purple-50 p-1 border border-purple-100">
          <button
            onClick={() => setMobileTab('overview')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'overview'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setMobileTab('chat')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'chat'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-purple-700'
            }`}
          >
            AI Chat
          </button>
        </div>
      </div>

      {/* LEFT COLUMN: Sidebar */}
      <div
        className={`${
          mobileSidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden'
        } md:flex md:static shrink-0`}
      >
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
        )}
        <div className="relative z-10">
          <Sidebar />
        </div>
      </div>

      {/* MIDDLE COLUMN: Middle Panel */}
      <main
        className={`flex-1 overflow-hidden ${
          mobileTab === 'overview' ? 'flex' : 'hidden md:flex'
        }`}
      >
        <MiddlePanel />
      </main>

      {/* RIGHT COLUMN: AI Chatbot Panel */}
      <section
        className={`shrink-0 ${
          mobileTab === 'chat' ? 'flex w-full' : 'hidden lg:flex'
        }`}
      >
        <ChatbotPanel />
      </section>
    </div>
  );
}

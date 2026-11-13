import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import SkillRadarChart from '../components/SkillRadarChart';
import {
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Brain,
  Layers,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ProgressTrackerPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  async function loadProgressData() {
    try {
      setLoading(true);
      const [dash, sks, asmts] = await Promise.all([
        api.getDashboard(),
        api.getSkills(),
        api.getAssessmentHistory()
      ]);
      setDashboardData(dash);
      setSkills(sks);
      setAssessments(asmts);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    } finally {
      setLoading(false);
    }
  }

  const weeklyActivityData = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.0 },
    { day: 'Fri', hours: 4.5 },
    { day: 'Sat', hours: 6.0 },
    { day: 'Sun', hours: 3.0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
        <div className="hidden md:block shrink-0"><Sidebar /></div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Loading progress metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  const student = dashboardData?.student || {};
  const roadmap = dashboardData?.roadmap_progress || {};

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Real-time Learning & Competency Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Progress & Readiness Tracker
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Holistic view of completed milestones, psychometric scores, and continuous skill improvements.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Career Readiness</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{student.readiness_score || 88.5}%</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Top 10th Percentile</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Roadmap Progress</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{roadmap.progress_percentage || 0}%</div>
            <p className="text-[11px] text-purple-600 font-medium mt-1">Phase {roadmap.current_phase || 1} of {roadmap.total_phases || 7}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed Tasks</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{roadmap.completed_tasks || 0}</div>
            <p className="text-[11px] text-gray-500 font-medium mt-1">{roadmap.total_tasks ? roadmap.total_tasks - roadmap.completed_tasks : 0} remaining</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assessments Taken</span>
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{assessments.length || 2}</div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Average Score: 89.7%</p>
          </div>
        </div>

        {/* Charts Row: Radar + Weekly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Radar */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Skill Proficiency Radar</h3>
            <p className="text-xs text-gray-500 mb-4">Comparison of your registered proficiencies against industry benchmarks.</p>
            <SkillRadarChart skills={skills} />
          </div>

          {/* Weekly Learning Activity */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Weekly Learning Hours</h3>
            <p className="text-xs text-gray-500 mb-4">Dedicated hours spent on code milestones and course modules.</p>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4EEFF" />
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#EDE9FE',
                      borderRadius: '0.75rem',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="hours" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Assessment History Table */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Assessment History & Scores</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-lavender-50/70 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Evaluation Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Score Achieved</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-gray-700">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3 font-semibold text-gray-900">{a.title}</td>
                    <td className="p-3 capitalize">{a.assessment_type}</td>
                    <td className="p-3 font-bold text-purple-700">{a.score}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(a.completed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

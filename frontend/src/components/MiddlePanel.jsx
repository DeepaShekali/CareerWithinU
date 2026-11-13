import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookmarkCheck,
  Building2,
  Briefcase,
  TrendingUp,
  Brain,
  CheckSquare,
  Square,
  Award,
  Star
} from 'lucide-react';

export default function MiddlePanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingTaskId, setTogglingTaskId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Error fetching dashboard overview:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      setTogglingTaskId(taskId);
      await api.toggleRoadmapTask(taskId);
      // Reload dashboard to reflect updated progress
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    } finally {
      setTogglingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-purple-700 font-medium">Loading your personalized career dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-6">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
          Unable to load dashboard data. Please verify backend connection.
        </div>
      </div>
    );
  }

  const student = data.student || {};
  const assessmentCard = data.upcoming_assessment_card || {};
  const psychometric = data.psychometric_progress || {};
  const careerAssess = data.career_assessment_progress || {};
  const roadmap = data.roadmap_progress || {};
  const savedCareers = data.saved_careers || [];
  const shortlist = data.college_shortlist || [];
  const activities = data.upcoming_activities || [];

  return (
    <div className="flex-1 h-screen overflow-y-auto p-6 space-y-6 bg-[#F9F8FD]">
      {/* Top Welcome & Readiness Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white p-6 shadow-soft-lg">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wide text-purple-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Career Guidance Intelligence Active</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {student.name ? student.name.split(' ')[0] : 'Scholar'}!
            </h2>
            <p className="text-xs text-purple-100 mt-1 max-w-md leading-relaxed">
              Target Role: <strong className="text-white">{student.target_role || 'AI Engineer'}</strong> • {student.degree || 'B.Tech CS'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] text-purple-200 font-medium">Career Readiness Score</div>
              <div className="text-2xl font-extrabold text-white">{student.readiness_score || 88.5}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Assessment Card */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                  {assessmentCard.status || 'Scheduled'}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {assessmentCard.due_in || '2 Days Remaining'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mt-1">
                {assessmentCard.title || 'National Technical & Cognitive Aptitude Evaluation'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Duration: {assessmentCard.estimated_duration || '45 Mins'} • Reward: {assessmentCard.reward_points || '+250 XP'}
              </p>
            </div>
          </div>

          <Link
            to="/assessment"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm shadow-purple-500/20 transition-all text-center flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Progress Cards Row: Psychometric & Career Assessment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Psychometric Progress */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-900">Psychometric Progress</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {psychometric.status || 'Completed'}
            </span>
          </div>

          <div className="flex items-center justify-between my-2">
            <span className="text-2xl font-extrabold text-purple-900">{psychometric.score || 88.5}%</span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
              High Aptitude
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed mt-1 line-clamp-2">
            {psychometric.summary || 'Analytical, systematic problem solver with strong engineering instincts.'}
          </p>
        </div>

        {/* Career Assessment Progress */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-900">Career Assessment</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {careerAssess.status || 'In Progress'}
            </span>
          </div>

          <div className="flex items-center justify-between my-2">
            <span className="text-2xl font-extrabold text-purple-900">{careerAssess.progress_percent || 75}%</span>
            <span className="text-[11px] text-gray-500 font-medium">Phase 2 Completed</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${careerAssess.progress_percent || 75}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Career Roadmap Progress */}
      {roadmap && (
        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Active Learning Roadmap</span>
              <h3 className="text-sm font-bold text-gray-900">{roadmap.title || 'Career Learning Pathway'}</h3>
            </div>
            <Link
              to="/roadmap"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
            <span>Current: <strong>Phase {roadmap.current_phase || 3} of {roadmap.total_phases || 7}</strong></span>
            <span className="font-bold text-purple-700">{roadmap.progress_percentage || 42.8}% Done</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${roadmap.progress_percentage || 42.8}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>{roadmap.completed_tasks || 6} completed tasks</span>
            <span>{roadmap.total_tasks ? roadmap.total_tasks - roadmap.completed_tasks : 8} remaining</span>
          </div>
        </div>
      )}

      {/* Upcoming Learning Activities (Interactive Checklist) */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Upcoming Learning Activities</h3>
          </div>
          <span className="text-[10px] text-gray-500 font-medium">Click to mark complete</span>
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-gray-500 py-2">All immediate tasks completed! Great job.</p>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleToggleTask(act.id)}
                className="flex items-start gap-3 p-2.5 rounded-xl border border-purple-50 hover:border-purple-200 hover:bg-purple-50/40 transition-colors cursor-pointer group"
              >
                <button
                  type="button"
                  className="mt-0.5 text-purple-600 hover:text-purple-800 shrink-0"
                  disabled={togglingTaskId === act.id}
                >
                  <Square className="w-4 h-4 text-purple-400 group-hover:text-purple-600" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
                    {act.title}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {act.phase} • Est: {act.estimated_hours}h
                  </p>
                </div>
                {act.resource_url && (
                  <a
                    href={act.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-purple-600 hover:underline shrink-0"
                  >
                    Resource ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Careers Quick Grid */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Saved Careers</h3>
          </div>
          <Link to="/recommendations" className="text-xs text-purple-600 hover:underline font-medium">
            Explore All
          </Link>
        </div>

        {savedCareers.length === 0 ? (
          <p className="text-xs text-gray-500 py-2">No saved careers yet. Explore recommendations to bookmark careers!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {savedCareers.map((c) => (
              <Link
                key={c.id}
                to={`/recommendations`}
                className="p-3 rounded-xl border border-purple-100/80 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">{c.category}</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-900 truncate">{c.title}</h4>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">{c.average_salary}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* College Shortlist */}
      <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-soft">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Shortlisted Colleges</h3>
          </div>
          <Link to="/colleges" className="text-xs text-purple-600 hover:underline font-medium">
            Discover More
          </Link>
        </div>

        {shortlist.length === 0 ? (
          <p className="text-xs text-gray-500 py-2">No shortlisted colleges yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shortlist.map((col) => (
              <div key={col.id} className="p-3 rounded-xl border border-purple-100/80 bg-lavender-50/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">{col.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{col.location} • Rank #{col.ranking}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{col.rating}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

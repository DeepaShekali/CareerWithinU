import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import SkillRadarChart from '../components/SkillRadarChart';
import {
  Compass,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Map,
  X
} from 'lucide-react';

export default function CareerRecommendationsPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  async function loadRecommendations() {
    try {
      setLoading(true);
      const data = await api.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load career recommendations:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleSave = async (careerId) => {
    try {
      const res = await api.toggleSaveCareer(careerId);
      setRecommendations((prev) =>
        prev.map((item) =>
          item.career_id === careerId ? { ...item, is_saved: res.saved } : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle save career:', err);
    }
  };

  const handleOpenGapAnalysis = async (rec) => {
    setSelectedCareer(rec.career);
    setGapLoading(true);
    try {
      const gap = await api.getSkillGap(rec.career_id);
      setGapAnalysis(gap);
    } catch (err) {
      console.error('Error fetching skill gap:', err);
    } finally {
      setGapLoading(false);
    }
  };

  const handleStartRoadmap = (careerId) => {
    navigate(`/roadmap?career_id=${careerId}`);
  };

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-purple-600" />
            <span>Multi-Factor AI Recommendation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Top Recommended Career Pathways
          </h1>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
            Derived through multi-dimensional vector matching of your registered technical skills, academic degree, aptitude evaluation, and industry hiring benchmarks.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Computing your top career matches...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((item, idx) => {
              const c = item.career;
              return (
                <div
                  key={item.career_id}
                  className="rounded-3xl bg-white border border-purple-100/90 p-6 sm:p-7 shadow-soft hover:shadow-soft-lg transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-50">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-purple-500/20">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                            {c.category}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {c.growth_rate} Growth
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{c.title}</h2>
                        <p className="text-xs text-gray-600 mt-0.5">{c.average_salary} • {c.required_education}</p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-purple-900 leading-none">
                          {item.match_percentage}%
                        </div>
                        <div className="text-[10px] text-purple-600 font-semibold tracking-wide uppercase mt-1">
                          Compatibility Match
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleSave(item.career_id)}
                        title={item.is_saved ? "Remove from saved" : "Save career"}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          item.is_saved
                            ? 'bg-purple-100 border-purple-300 text-purple-800'
                            : 'bg-white border-purple-100 text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        {item.is_saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Why Match Explanation */}
                  <div className="my-4 p-3.5 rounded-2xl bg-lavender-50/70 border border-purple-100/80 text-xs text-purple-950 leading-relaxed">
                    <strong className="text-purple-900">Why this matches you:</strong> {item.why_match}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {c.description}
                  </p>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Matching Verified Skills ({item.matching_skills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.matching_skills.length > 0 ? (
                          item.matching_skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-lg bg-emerald-100/80 text-emerald-800 text-[11px] font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-gray-500">Foundational general background</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-2">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span>Skills to Develop ({item.missing_skills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.missing_skills.length > 0 ? (
                          item.missing_skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 rounded-lg bg-amber-100/80 text-amber-800 text-[11px] font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-gray-500">Core requirements mastered!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tech stack & Actions */}
                  <div className="pt-4 border-t border-purple-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-gray-500">
                      <strong className="text-gray-700">Required Tech:</strong> {c.required_tech}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenGapAnalysis(item)}
                        className="px-4 py-2 rounded-xl font-bold text-purple-700 bg-purple-100/80 hover:bg-purple-200/80 transition-colors"
                      >
                        Skill Gap Analysis
                      </button>
                      <button
                        onClick={() => handleStartRoadmap(item.career_id)}
                        className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all flex items-center gap-1"
                      >
                        <span>View Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Skill Gap Analysis Drawer / Modal */}
        {selectedCareer && (
          <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-purple-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    Comprehensive Skill Gap Analysis
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCareer.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedCareer(null);
                    setGapAnalysis(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {gapLoading ? (
                <div className="py-16 text-center text-xs text-purple-700">
                  <div className="w-8 h-8 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                  Analyzing skill proficiencies against career benchmark...
                </div>
              ) : gapAnalysis ? (
                <div className="space-y-6">
                  {/* Readiness Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-lavender-50 border border-purple-100 text-center">
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Readiness Score</div>
                      <div className="text-2xl font-extrabold text-purple-900">{gapAnalysis.readiness_score}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Skills Verified</div>
                      <div className="text-2xl font-extrabold text-emerald-600">{gapAnalysis.existing_skills_count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Skills to Master</div>
                      <div className="text-2xl font-extrabold text-amber-600">{gapAnalysis.missing_skills_count}</div>
                    </div>
                  </div>

                  {/* Visual Radar Comparison */}
                  {gapAnalysis.gap_items && gapAnalysis.gap_items.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-purple-100">
                      <h4 className="text-xs font-bold text-gray-900 mb-2 text-center uppercase tracking-wider">
                        Proficiency vs Benchmark Radar
                      </h4>
                      <SkillRadarChart skills={gapAnalysis.gap_items} />
                    </div>
                  )}

                  {/* Skill Gap Table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Individual Skill Breakdown & Improvement Action
                    </h4>
                    <div className="space-y-2.5">
                      {gapAnalysis.gap_items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border border-purple-100/90 bg-white hover:bg-purple-50/30 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              {item.existing ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-amber-500" />
                              )}
                              <span className="text-xs font-bold text-gray-900">{item.skill_name}</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                item.priority === 'Critical'
                                  ? 'bg-red-100 text-red-800'
                                  : item.priority === 'High'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.priority === 'Medium'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.priority} Priority
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mb-2">
                            <div>Your Level: <strong className="text-gray-900">{item.student_level} ({item.student_score}%)</strong></div>
                            <div>Required: <strong className="text-purple-700">{item.required_level} ({item.required_score}%)</strong></div>
                          </div>

                          <p className="text-[11px] text-gray-600 bg-lavender-50/60 p-2 rounded-xl leading-relaxed">
                            💡 <span className="font-semibold text-purple-900">Recommended Action:</span> {item.improvement_tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap CTA */}
                  <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Ready to start closing these skill gaps?</span>
                    <button
                      onClick={() => handleStartRoadmap(selectedCareer.id)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm"
                    >
                      Open 7-Phase Learning Roadmap →
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

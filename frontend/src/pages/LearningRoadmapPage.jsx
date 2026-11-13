import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import {
  Map,
  CheckCircle2,
  Square,
  CheckSquare,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export default function LearningRoadmapPage() {
  const [searchParams] = useSearchParams();
  const careerIdParam = searchParams.get('career_id');

  const [roadmap, setRoadmap] = useState(null);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingTaskId, setTogglingTaskId] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({});

  useEffect(() => {
    loadCareersAndRoadmap();
  }, [careerIdParam]);

  async function loadCareersAndRoadmap() {
    try {
      setLoading(true);
      const allCareers = await api.getAllCareers();
      setCareers(allCareers);

      let activeRoadmapData = null;
      if (careerIdParam) {
        activeRoadmapData = await api.getCareerRoadmap(parseInt(careerIdParam));
      } else {
        activeRoadmapData = await api.getActiveRoadmap();
      }
      setRoadmap(activeRoadmapData);

      // Default expand all phases
      const exp = {};
      if (activeRoadmapData?.tasks) {
        activeRoadmapData.tasks.forEach((t) => {
          exp[t.phase_number] = true;
        });
      }
      setExpandedPhases(exp);
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      setTogglingTaskId(taskId);
      const res = await api.toggleRoadmapTask(taskId);
      setRoadmap((prev) => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map((t) =>
          t.id === taskId ? { ...t, is_completed: res.is_completed } : t
        );
        return {
          ...prev,
          progress_percentage: res.progress_percentage,
          current_phase: res.current_phase,
          tasks: updatedTasks
        };
      });
    } catch (err) {
      console.error('Failed to toggle roadmap task:', err);
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleSelectCareer = async (cId) => {
    try {
      setLoading(true);
      const newRoadmap = await api.getCareerRoadmap(cId);
      setRoadmap(newRoadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (phaseNum) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
        <div className="hidden md:block shrink-0"><Sidebar /></div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Loading roadmap curriculum...</p>
          </div>
        </div>
      </div>
    );
  }

  // Group tasks by phase
  const phases = {};
  if (roadmap?.tasks) {
    roadmap.tasks.forEach((task) => {
      if (!phases[task.phase_number]) {
        phases[task.phase_number] = {
          number: task.phase_number,
          title: task.phase_title,
          tasks: []
        };
      }
      phases[task.phase_number].tasks.push(task);
    });
  }

  const totalTasks = roadmap?.tasks?.length || 0;
  const completedTasks = roadmap?.tasks?.filter(t => t.is_completed).length || 0;

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto overflow-y-auto">
        {/* Header & Career Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
              <Map className="w-3.5 h-3.5 text-purple-600" />
              <span>7-Phase Structured Mastery Pathway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Personalized Learning Roadmap
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Step-by-step curriculum with curated tutorials, project exercises, and live completion tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-700 shrink-0">Roadmap for:</label>
            <select
              value={roadmap?.career_id || ''}
              onChange={(e) => handleSelectCareer(parseInt(e.target.value))}
              className="p-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none bg-white font-medium text-gray-900 shadow-2xs"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Tracker Overview Card */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Active Curriculum</span>
              <h2 className="text-base font-bold text-gray-900">{roadmap?.title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-purple-900">{roadmap?.progress_percentage || 0}%</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-semibold">
                Phase {roadmap?.current_phase || 1} of {roadmap?.total_phases || 7}
              </span>
            </div>
          </div>

          <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${roadmap?.progress_percentage || 0}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{completedTasks} of {totalTasks} milestones completed</span>
            <span>{totalTasks - completedTasks} milestones pending</span>
          </div>
        </div>

        {/* 7 Phases Accordion / List */}
        <div className="space-y-4">
          {Object.values(phases).map((phase) => {
            const isExpanded = expandedPhases[phase.number] !== false;
            const phaseDoneCount = phase.tasks.filter(t => t.is_completed).length;
            const phaseTotal = phase.tasks.length;
            const isPhaseCompleted = phaseDoneCount === phaseTotal && phaseTotal > 0;

            return (
              <div
                key={phase.number}
                className="rounded-2xl bg-white border border-purple-100 shadow-soft overflow-hidden transition-all"
              >
                {/* Phase Header */}
                <div
                  onClick={() => togglePhase(phase.number)}
                  className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-colors ${
                    isPhaseCompleted
                      ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                      : 'hover:bg-purple-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPhaseCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {isPhaseCompleted ? <CheckCircle2 className="w-5 h-5" /> : `P${phase.number}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                          Phase {phase.number}
                        </span>
                        {isPhaseCompleted && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">{phase.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500">
                      {phaseDoneCount} / {phaseTotal} Tasks
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Phase Tasks */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-purple-50 space-y-3 bg-lavender-50/20">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          task.is_completed
                            ? 'bg-white border-emerald-200 text-gray-500'
                            : 'bg-white border-purple-100 hover:border-purple-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            className="mt-0.5 text-purple-600 hover:text-purple-800 shrink-0"
                            disabled={togglingTaskId === task.id}
                          >
                            {task.is_completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-purple-400 hover:text-purple-600" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold ${
                                task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {task.task_title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Est. {task.estimated_hours} Hours
                              </span>
                            </div>
                          </div>
                        </div>

                        {task.resource_url && (
                          <a
                            href={task.resource_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 shrink-0 p-1 rounded-lg hover:bg-purple-50"
                          >
                            <span>Resource</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

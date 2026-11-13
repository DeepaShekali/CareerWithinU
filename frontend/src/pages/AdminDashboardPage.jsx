import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  Brain,
  Compass,
  Map,
  Plus,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Career Form
  const [showAddCareerModal, setShowAddCareerModal] = useState(false);
  const [careerForm, setCareerForm] = useState({
    title: '',
    category: 'Artificial Intelligence',
    description: '',
    average_salary: '$120,000 - $160,000',
    growth_rate: '+25% (High)',
    required_education: "Bachelor's in Computer Science",
    required_tech: 'Python, PyTorch, Docker'
  });
  const [submittingCareer, setSubmittingCareer] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      setLoading(true);
      const [statsData, studentsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminStudents()
      ]);
      setStats(statsData);
      setStudents(studentsData);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCareer = async (e) => {
    e.preventDefault();
    setSubmittingCareer(true);
    try {
      await api.addCareer(careerForm);
      setShowAddCareerModal(false);
      setCareerForm({
        title: '',
        category: 'Artificial Intelligence',
        description: '',
        average_salary: '$120,000 - $160,000',
        growth_rate: '+25% (High)',
        required_education: "Bachelor's in Computer Science",
        required_tech: 'Python, PyTorch, Docker'
      });
      await loadAdminData();
      alert('New career added successfully!');
    } catch (err) {
      alert('Error creating career: ' + err.message);
    } finally {
      setSubmittingCareer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
        <div className="hidden md:block shrink-0"><Sidebar /></div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Loading platform analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Administrative Operations & Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Platform Administration
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Real-time monitoring of student cohorts, assessment throughput, and career catalog management.
            </p>
          </div>

          <button
            onClick={() => setShowAddCareerModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Career Pathway</span>
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Registered Students</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{stats?.total_students || 0}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Active Accounts</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Assessments Taken</span>
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{stats?.total_assessments || 0}</div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Completed Evaluations</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Career Catalog</span>
              <Compass className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{stats?.total_careers || 0}</div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Curated Pathways</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Active Roadmaps</span>
              <Map className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-purple-900">{stats?.total_roadmaps_active || 0}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">7-Phase Curriculums</p>
          </div>
        </div>

        {/* Analytics Breakdown: In-Demand Skills & Top Careers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Top In-Demand Student Skills</h3>
            <div className="space-y-3">
              {stats?.top_skills_in_demand?.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-900">{s.skill} <span className="text-[10px] text-gray-400 font-normal">({s.category})</span></span>
                    <span className="text-purple-700">{s.demand}% Demand</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${s.demand}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Assessments Submitted</h3>
            <div className="space-y-2.5">
              {stats?.recent_assessments?.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-lavender-50/50 border border-purple-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{item.student_name}</div>
                    <div className="text-[10px] text-gray-500">{item.title} • {item.date}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs">
                    {item.score}% Score
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Registered Student Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-lavender-50/70 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Student Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Target Role</th>
                  <th className="p-3">Assessments</th>
                  <th className="p-3">Latest Score</th>
                  <th className="p-3 rounded-r-xl">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-gray-700">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3 font-semibold text-gray-900">{st.name}</td>
                    <td className="p-3 text-purple-700">{st.email}</td>
                    <td className="p-3 font-medium">{st.target_role}</td>
                    <td className="p-3 font-bold text-gray-900">{st.assessments_taken}</td>
                    <td className="p-3 font-bold text-emerald-600">{st.latest_score ? `${st.latest_score}%` : 'N/A'}</td>
                    <td className="p-3 text-gray-500">{st.registered_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Career Modal */}
        {showAddCareerModal && (
          <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-purple-100 max-w-lg w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-purple-50">
                Add New Technology Career Pathway
              </h3>
              <form onSubmit={handleCreateCareer} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Career Title</label>
                  <input
                    type="text"
                    required
                    value={careerForm.title}
                    onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                    placeholder="e.g. LLM Systems Architect"
                    className="w-full p-2 border border-purple-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={careerForm.category}
                    onChange={(e) => setCareerForm({ ...careerForm, category: e.target.value })}
                    className="w-full p-2 border border-purple-200 rounded-xl outline-none bg-white"
                  >
                    <option>Artificial Intelligence</option>
                    <option>Software Engineering</option>
                    <option>Data & Analytics</option>
                    <option>DevOps & Cloud</option>
                    <option>Cybersecurity</option>
                    <option>Product & Design</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={careerForm.description}
                    onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                    placeholder="Key overview of the role..."
                    className="w-full p-2 border border-purple-200 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={careerForm.average_salary}
                      onChange={(e) => setCareerForm({ ...careerForm, average_salary: e.target.value })}
                      className="w-full p-2 border border-purple-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Growth Rate</label>
                    <input
                      type="text"
                      value={careerForm.growth_rate}
                      onChange={(e) => setCareerForm({ ...careerForm, growth_rate: e.target.value })}
                      className="w-full p-2 border border-purple-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Required Technologies</label>
                  <input
                    type="text"
                    value={careerForm.required_tech}
                    onChange={(e) => setCareerForm({ ...careerForm, required_tech: e.target.value })}
                    className="w-full p-2 border border-purple-200 rounded-xl outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCareerModal(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCareer}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    {submittingCareer ? 'Saving...' : 'Add Career'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

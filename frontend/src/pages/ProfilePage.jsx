import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Target
} from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState({
    full_name: '',
    degree: '',
    specialization: '',
    graduation_year: 2026,
    bio: '',
    target_role: '',
    phone: '',
    college_name: '',
    city: ''
  });

  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New skill form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [addingSkill, setAddingSkill] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        degree: user.profile?.degree || 'B.Tech / B.E.',
        specialization: user.profile?.specialization || 'Computer Science & Engineering',
        graduation_year: user.profile?.graduation_year || 2026,
        bio: user.profile?.bio || '',
        target_role: user.profile?.target_role || 'AI Engineer',
        phone: user.profile?.phone || '+1 (555) 234-5678',
        college_name: user.profile?.college_name || '',
        city: user.profile?.city || 'San Francisco, CA'
      });
      loadSkills();
    }
  }, [user]);

  async function loadSkills() {
    try {
      const sks = await api.getSkills();
      setSkills(sks);
    } catch (err) {
      console.error(err);
    }
  }

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateProfile(profileData);
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setAddingSkill(true);
    const scoreMap = { 'Beginner': 60, 'Intermediate': 78, 'Advanced': 92 };
    try {
      await api.addSkill({
        skill_name: newSkillName.trim(),
        proficiency: newSkillProf,
        score: scoreMap[newSkillProf] || 75,
        category: newSkillCategory
      });
      setNewSkillName('');
      await loadSkills();
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.deleteSkill(skillId);
      await loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>Student Identity & Skill Passport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Student Profile
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Manage your academic background, target specialization, and verified skill inventory.
          </p>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and skills successfully saved!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Info */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-purple-100 shadow-soft">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-purple-50">
                Personal & Academic Details
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Account ID)</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full p-2.5 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Ideal Role</label>
                    <input
                      type="text"
                      name="target_role"
                      value={profileData.target_role}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Degree Program</label>
                    <input
                      type="text"
                      name="degree"
                      value={profileData.degree}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization / Major</label>
                    <input
                      type="text"
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Graduation Year</label>
                    <input
                      type="number"
                      name="graduation_year"
                      value={profileData.graduation_year}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">University / Institute</label>
                    <input
                      type="text"
                      name="college_name"
                      value={profileData.college_name}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City & State</label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Professional Bio & Ambitions</label>
                  <textarea
                    rows={3}
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Skills Manager */}
          <div>
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Skills Inventory ({skills.length})
              </h2>

              {/* Add Skill Mini Form */}
              <form onSubmit={handleAddSkill} className="space-y-2 mb-4 p-3 rounded-2xl bg-lavender-50/70 border border-purple-100">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Add skill (e.g. PyTorch)..."
                  className="w-full p-2 text-xs border border-purple-200 rounded-xl outline-none bg-white"
                />
                <div className="flex gap-2">
                  <select
                    value={newSkillProf}
                    onChange={(e) => setNewSkillProf(e.target.value)}
                    className="flex-1 p-1.5 text-xs border border-purple-200 rounded-xl bg-white outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <button
                    type="submit"
                    disabled={addingSkill || !newSkillName.trim()}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Skills List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl border border-purple-100 bg-white flex items-center justify-between hover:bg-purple-50/40 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900">{s.skill_name}</div>
                      <div className="text-[10px] text-purple-600 font-medium">
                        {s.proficiency} • {s.score}%
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

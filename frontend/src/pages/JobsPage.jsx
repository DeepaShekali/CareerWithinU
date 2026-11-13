import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchJobs();
  }, [typeFilter]);

  async function fetchJobs() {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter !== 'All') params.job_type = typeFilter;
      if (search.trim()) params.search = search.trim();
      const data = await api.getJobs(params);
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
            <span>Curated Career Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Jobs & Internship Suggestions
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Matching industry listings aligned with student skill profiles. <span className="italic text-purple-700 font-semibold">*Sample demonstration listings for project demonstration.</span>
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-soft mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title, company name, or technology..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none text-gray-900"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none bg-white text-gray-700 font-medium"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Loading opportunities...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      {job.job_type}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-lavender-100 text-purple-700">
                      {job.experience_level}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 font-medium">{job.posted_date}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 flex-wrap">
                    <span className="font-semibold text-purple-900">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">{job.salary_range}</span>
                  </div>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.skills_required.map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 rounded-lg bg-lavender-50 border border-purple-100 text-purple-800 text-[10px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center md:flex-col justify-end gap-2">
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import {
  Building2,
  Search,
  MapPin,
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Sparkles,
  DollarSign,
  Award
} from 'lucide-react';

export default function CollegeSearchPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');

  useEffect(() => {
    fetchColleges();
  }, [stateFilter, degreeFilter]);

  async function fetchColleges() {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (stateFilter !== 'All') params.state = stateFilter;
      if (degreeFilter !== 'All') params.degree = degreeFilter;
      const data = await api.searchColleges(params);
      setColleges(data);
    } catch (err) {
      console.error('Failed to load colleges:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchColleges();
  };

  const handleToggleShortlist = async (collegeId) => {
    try {
      const res = await api.toggleShortlistCollege(collegeId);
      setColleges((prev) =>
        prev.map((c) =>
          c.id === collegeId ? { ...c, is_shortlisted: res.shortlisted } : c
        )
      );
    } catch (err) {
      console.error('Failed to toggle college shortlist:', err);
    }
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
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Higher Education & Institution Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            College & University Search
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Explore premier institutions, academic programs, and acceptance prerequisites. <span className="italic text-purple-700 font-semibold">*Sample demonstration dataset.</span>
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-soft mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search college name, city, or keywords..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none text-gray-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="flex-1 sm:flex-initial p-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none bg-white text-gray-700"
              >
                <option value="All">All States</option>
                <option value="California">California</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Washington">Washington</option>
                <option value="Georgia">Georgia</option>
              </select>

              <select
                value={degreeFilter}
                onChange={(e) => setDegreeFilter(e.target.value)}
                className="flex-1 sm:flex-initial p-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 outline-none bg-white text-gray-700"
              >
                <option value="All">All Degrees</option>
                <option value="B.Tech">B.Tech / B.S.</option>
                <option value="M.Tech">M.Tech / M.S.</option>
                <option value="Ph.D">Ph.D.</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Filtering college database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colleges.map((col) => (
              <div
                key={col.id}
                className="rounded-3xl bg-white border border-purple-100 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Image banner */}
                  <div className="h-44 w-full bg-purple-100 relative overflow-hidden">
                    <img
                      src={col.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop'}
                      alt={col.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-bold text-purple-900 shadow-sm">
                      Rank #{col.ranking} National
                    </div>
                    <button
                      onClick={() => handleToggleShortlist(col.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md shadow-sm transition-colors ${
                        col.is_shortlisted
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/90 text-gray-500 hover:text-purple-700'
                      }`}
                    >
                      {col.is_shortlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" />
                        {col.location}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{col.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{col.name}</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {col.admission_info}
                    </p>

                    <div className="mt-4 pt-3 border-t border-purple-50 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold">Tuition Fees</span>
                        <div className="font-semibold text-gray-900 mt-0.5">{col.fees_per_year}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold">Acceptance Rate</span>
                        <div className="font-semibold text-gray-900 mt-0.5">{col.acceptance_rate}</div>
                      </div>
                    </div>

                    {/* Specializations pills */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {col.specializations.map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded-lg bg-lavender-50 text-purple-700 text-[10px] font-semibold border border-purple-100">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={col.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Visit College Portal</span>
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

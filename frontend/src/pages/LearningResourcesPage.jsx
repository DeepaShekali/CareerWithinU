import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import {
  BookOpen,
  Search,
  ExternalLink,
  Star,
  Clock,
  Sparkles,
  Layers,
  Video,
  FileText,
  Compass
} from 'lucide-react';

const CATEGORIES = [
  "All",
  "Python",
  "Web Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity",
  "Interview Preparation",
  "Resume Building",
  "Java"
];

export default function LearningResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, difficultyFilter]);

  async function fetchResources() {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (difficultyFilter !== "All") params.difficulty = difficultyFilter;
      if (search.trim()) params.search = search.trim();
      const data = await api.getResources(params);
      setResources(data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
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
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Curated Skill Building Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Learning Resources & Tutorials
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Hand-picked courses, documentation hubs, and practice platforms across core technical specializations.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-soft mb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, topics, or providers..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Categories Pill Scroll */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-2xs'
                    : 'bg-lavender-50 text-gray-700 hover:bg-purple-100/70 border border-purple-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-purple-700 font-medium">Loading learning resources...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-purple-100 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.provider}</p>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-50">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      {item.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-lavender-100 text-purple-800 font-semibold text-[10px]">
                      {item.difficulty}
                    </span>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-purple-100"
                  >
                    <span>Open Resource</span>
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

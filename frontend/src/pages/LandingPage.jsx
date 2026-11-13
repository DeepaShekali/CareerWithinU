import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Brain,
  Map,
  Building2,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronUp,
  Cpu,
  Code,
  Database,
  Cloud,
  Shield,
  Palette,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const careerCategories = [
    { title: "Artificial Intelligence", count: "12+ Paths", icon: Cpu, desc: "AI Engineer, ML Specialist, NLP Scientist", color: "from-purple-500 to-indigo-600" },
    { title: "Software Engineering", count: "18+ Paths", icon: Code, desc: "Full Stack, Backend, Mobile Developer", color: "from-indigo-500 to-blue-600" },
    { title: "Data Science & BI", count: "14+ Paths", icon: Database, desc: "Data Scientist, Analytics Engineer, BI Lead", color: "from-blue-500 to-cyan-600" },
    { title: "Cloud & DevOps", count: "10+ Paths", icon: Cloud, desc: "Cloud Architect, SRE, Platform Engineer", color: "from-cyan-500 to-teal-600" },
    { title: "Cybersecurity", count: "8+ Paths", icon: Shield, desc: "Security Analyst, Penetration Tester", color: "from-teal-500 to-emerald-600" },
    { title: "UI/UX & Product", count: "9+ Paths", icon: Palette, desc: "Product Designer, UX Researcher, Design Lead", color: "from-purple-500 to-pink-600" },
  ];

  const faqs = [
    {
      q: "How does the CareerWithinU AI recommendation engine work?",
      a: "Our platform evaluates your academic background, self-reported and assessed technical skills, problem-solving tendencies, and personal interests using a transparent weighted vector matching model. It ranks careers by match percentage and highlights exactly which skills you already have and which you should develop next."
    },
    {
      q: "Does this require paid external API keys or cloud services?",
      a: "No! CareerWithinU is engineered with a built-in local knowledge base and autonomous algorithmic matching engine that runs 100% locally and reliably without paid third-party dependencies."
    },
    {
      q: "Can I track my learning roadmap progress interactively?",
      a: "Yes! When you select or are recommended a career (such as Python Developer or AI Engineer), CareerWithinU generates a personalized 7-phase learning roadmap. You can check off weekly milestones, and your dashboard progress percentage updates automatically in real-time."
    },
    {
      q: "How does the Skill Gap Analysis help my career preparation?",
      a: "The Skill Gap module maps your current proficiency against industry benchmark expectations for your target role. It categorizes gaps by priority (Critical, High, Medium, Low) and suggests targeted project and tutorial actions to help you bridge them."
    },
    {
      q: "Are the colleges and job opportunities real or sample data?",
      a: "Colleges and opportunities on CareerWithinU are realistic demonstration datasets clearly labeled for academic and demonstration purposes, providing an authentic full-stack user experience."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-6 border border-purple-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI-Powered Career Intelligence for Students</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight md:leading-tight">
            Discover Your Future.{' '}
            <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Perfect Career.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Personalized career recommendations, psychometric skill analysis, 7-phase structured roadmaps, and an intelligent 24/7 AI Career Assistant designed for ambitious students.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/recommendations"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-purple-700 bg-white hover:bg-purple-50/80 border border-purple-200/90 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Explore Careers</span>
            </Link>
          </div>

          {/* Demo Quick Banner */}
          <div className="mt-6 text-xs text-gray-500 flex items-center justify-center gap-2">
            <span>✨ College Demonstration Ready:</span>
            <Link to="/login" className="text-purple-700 font-semibold underline hover:text-purple-900">
              One-Click Demo Student / Admin Sign In
            </Link>
          </div>

          {/* Dashboard Preview Illustration */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-purple-200/50 to-white/70 border border-purple-200 shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl overflow-hidden bg-white border border-purple-100 p-4 md:p-6 text-left shadow-soft">
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-semibold text-gray-400 ml-2">CareerWithinU – Student Intelligence Dashboard</span>
                </div>
                <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  Lavender-Purple UI
                </div>
              </div>

              {/* 3-Column Preview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 text-xs">
                {/* Left Mini Sidebar */}
                <div className="md:col-span-3 bg-lavender-50/70 p-3 rounded-xl border border-purple-100 space-y-2">
                  <div className="font-bold text-purple-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Navigation</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-200/70 text-purple-900 font-semibold">AI Chatbot</div>
                  <div className="p-1.5 rounded-lg text-gray-600">Assessments</div>
                  <div className="p-1.5 rounded-lg text-gray-600">Career Matches</div>
                  <div className="p-1.5 rounded-lg text-gray-600">Learning Roadmap</div>
                  <div className="p-1.5 rounded-lg text-gray-600">College Search</div>
                </div>

                {/* Middle Mini Panel */}
                <div className="md:col-span-5 space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <div className="font-bold text-sm">Welcome back, Alex!</div>
                    <div className="text-[11px] text-purple-100 mt-0.5">Readiness Score: 88.5% (High Aptitude)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-xs">
                    <div className="font-bold text-gray-900">Python Developer Roadmap</div>
                    <div className="w-full bg-purple-100 rounded-full h-1.5 mt-2">
                      <div className="bg-purple-600 h-1.5 rounded-full w-2/5"></div>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Phase 3 of 7 in progress</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-xs">
                    <div className="font-bold text-gray-900">Top Match: AI Engineer (94.5%)</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Strong Python & ML Foundation</div>
                  </div>
                </div>

                {/* Right Mini Chatbot */}
                <div className="md:col-span-4 bg-lavender-50/50 p-3 rounded-xl border border-purple-100 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-gray-900 flex items-center justify-between">
                      <span>CareerWithinU AI</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="mt-2 p-2 rounded-lg bg-white border border-purple-100 text-[11px] text-gray-700">
                      "Based on your profile, your top match is AI Engineer. Let's work on PyTorch next!"
                    </div>
                  </div>
                  <div className="mt-3 p-1.5 rounded-lg bg-white border border-purple-200 text-gray-400 text-[10px]">
                    Ask career questions...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-y border-purple-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Methodology</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">How CareerWithinU Empowers You</h2>
            <p className="text-sm text-gray-600 mt-2">
              A 4-step scientifically structured pathway from academic study to dream technology career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Skill & Aptitude Assessment",
                desc: "Complete our interactive evaluation covering technical proficiencies, soft skills, and personal interests.",
                icon: Brain
              },
              {
                step: "02",
                title: "Weighted AI Matching",
                desc: "Our transparent recommendation engine scores 10+ technology career domains against your specific profile.",
                icon: Compass
              },
              {
                step: "03",
                title: "7-Phase Learning Roadmap",
                desc: "Follow an actionable weekly roadmap with curated resources, practical milestones, and persistent tracking.",
                icon: Map
              },
              {
                step: "04",
                title: "AI Mentorship & Launch",
                desc: "Ask CareerWithinU AI for resume strategies, interview frameworks, college discovery, and industry insights.",
                icon: Sparkles
              }
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative p-6 rounded-2xl bg-lavender-50/50 border border-purple-100/90 shadow-soft hover:shadow-soft-lg transition-all group">
                  <div className="text-3xl font-extrabold text-purple-200 group-hover:text-purple-400 transition-colors mb-3">
                    {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Career Categories */}
      <section className="py-20 bg-lavender-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Career Catalog</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">High-Growth Tech Pathways</h2>
              <p className="text-sm text-gray-600 mt-1">Explore industry salary ranges, growth statistics, and required skill sets.</p>
            </div>
            <Link
              to="/recommendations"
              className="mt-4 sm:mt-0 text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 group"
            >
              <span>View All 10 Careers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-white border border-purple-100 shadow-soft hover:shadow-soft-lg transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md shadow-purple-500/15`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-900 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="mt-5 pt-4 border-t border-purple-50 flex items-center justify-between">
                    <Link
                      to="/recommendations"
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <span>Explore Requirements</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Testimonials (Clearly Marked as Sample Content) */}
      <section className="py-20 bg-white border-y border-purple-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Loved by Student Builders</h2>
            <p className="text-xs text-gray-500 mt-2 italic bg-purple-50 py-1 px-3 rounded-full inline-block border border-purple-100">
              * The testimonials below are sample demonstration profiles created for university project presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Rivera",
                role: "3rd Year CS Student",
                college: "Caltech",
                rating: 5,
                text: "The Skill Gap Analysis was an eye-opener. It pinpointed that I already had the foundations for AI Engineering and gave me an exact checklist for Docker and PyTorch.",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
              },
              {
                name: "Marcus Chen",
                role: "Software Engineering Senior",
                college: "UC Berkeley",
                rating: 5,
                text: "The 7-phase Python Developer roadmap gave structure to my semester. Checking off weekly milestones kept me motivated and ready for internship coding interviews.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              },
              {
                name: "Emily Watson",
                role: "Data Science Aspirant",
                college: "Georgia Tech",
                rating: 5,
                text: "The CareerWithinU AI chatbot feels like having a senior engineering mentor in my pocket 24/7. It answered all my questions on interview prep and portfolio projects.",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
              }
            ].map((t, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-lavender-50/50 border border-purple-100 shadow-soft">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-purple-200" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <p className="text-[11px] text-purple-600">{t.role} • {t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-lavender-50/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Help & FAQs</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-600 mt-1">Everything you need to know about the platform.</p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-purple-100 overflow-hidden shadow-soft transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900 hover:text-purple-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 leading-relaxed border-t border-purple-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Discover Your Ideal Career Path?
          </h2>
          <p className="mt-3 text-sm text-purple-100 max-w-xl mx-auto leading-relaxed">
            Take the career aptitude assessment today and unlock personalized recommendations, skill gap metrics, and weekly roadmaps.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-purple-900 bg-white hover:bg-purple-50 shadow-lg shadow-purple-950/20 transition-all flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all"
            >
              Sign In Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

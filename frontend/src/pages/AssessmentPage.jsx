import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Code,
  Target,
  Heart,
  Award,
  Star
} from 'lucide-react';

const TECH_SKILL_OPTIONS = [
  "Python", "JavaScript / TypeScript", "React.js", "SQL & Relational DBs",
  "Machine Learning", "Deep Learning", "FastAPI / Node.js", "Docker & Containers",
  "Cloud (AWS / GCP / Azure)", "Data Structures & Algorithms", "Cybersecurity Basics",
  "UI/UX Design & Figma", "Data Analysis & Pandas", "System Design"
];

const DOMAINS_LIST = [
  "Artificial Intelligence & LLMs", "Full Stack Web & Mobile", "Cloud Architecture & DevOps",
  "Big Data & Analytics", "Information Security & Defense", "UI/UX & Product Design",
  "Fintech & Quant Systems", "Healthcare & Biotech Tech"
];

const SOFT_SKILLS_LIST = [
  "Algorithmic Problem Solving", "Technical Communication", "Cross-functional Collaboration",
  "Adaptability to Emerging Tech", "Critical Thinking & Debugging", "Leadership & Initiative"
];

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    degree: 'B.Tech / B.E.',
    specialization: 'Computer Science & Engineering',
    graduation_year: 2026,
    college_name: '',
    selectedTechSkills: [
      { name: 'Python', proficiency: 'Advanced', score: 90 },
      { name: 'SQL & Relational DBs', proficiency: 'Intermediate', score: 80 },
      { name: 'Machine Learning', proficiency: 'Intermediate', score: 75 }
    ],
    problemSolvingAnswer: 'a',
    interests: ['Artificial Intelligence & LLMs', 'Full Stack Web & Mobile'],
    soft_skills: ['Algorithmic Problem Solving', 'Technical Communication'],
    career_goals: 'AI Engineer / Full Stack Developer',
    work_environment: 'High-Growth Tech Startup / AI Lab'
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleTechSkillToggle = (skillName) => {
    const exists = formData.selectedTechSkills.find(s => s.name === skillName);
    if (exists) {
      setFormData({
        ...formData,
        selectedTechSkills: formData.selectedTechSkills.filter(s => s.name !== skillName)
      });
    } else {
      setFormData({
        ...formData,
        selectedTechSkills: [
          ...formData.selectedTechSkills,
          { name: skillName, proficiency: 'Intermediate', score: 75 }
        ]
      });
    }
  };

  const handleProficiencyChange = (skillName, newProf) => {
    const scoreMap = { 'Beginner': 60, 'Intermediate': 78, 'Advanced': 92 };
    setFormData({
      ...formData,
      selectedTechSkills: formData.selectedTechSkills.map(s =>
        s.name === skillName ? { ...s, proficiency: newProf, score: scoreMap[newProf] || 75 } : s
      )
    });
  };

  const handleInterestToggle = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  const handleSoftSkillToggle = (skill) => {
    if (formData.soft_skills.includes(skill)) {
      setFormData({ ...formData, soft_skills: formData.soft_skills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, soft_skills: [...formData.soft_skills, skill] });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        title: "Comprehensive Career Aptitude & Technical Skill Assessment",
        assessment_type: "comprehensive",
        degree: formData.degree,
        specialization: formData.specialization,
        technical_skills: formData.selectedTechSkills,
        soft_skills: formData.soft_skills,
        interests: formData.interests,
        strengths: ["Problem Solving", "Systematic Research"],
        preferred_industries: formData.interests,
        career_goals: formData.career_goals,
        answers: {
          problem_solving_approach: formData.problemSolvingAnswer,
          work_environment: formData.work_environment,
          graduation_year: formData.graduation_year
        }
      };
      const res = await api.submitAssessment(payload);
      setResult(res);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      alert('Failed to submit assessment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#F9F8FD] flex flex-col md:flex-row">
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5 text-purple-600" />
            <span>Interactive Multi-Step Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Career Aptitude & Skill Assessment
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Complete all 5 stages to calibrate the AI Recommendation Engine and benchmark your career readiness.
          </p>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
              <span>Step {currentStep} of {totalSteps}</span>
              <span className="text-purple-700">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Assessment Card */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-soft">
          {/* STEP 1: Academic Background */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Stage 1: Educational Foundation</h2>
                  <p className="text-xs text-gray-500">Provide your current academic degree and focus area.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Degree Program</label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-white"
                  >
                    <option>B.Tech / B.E. (Engineering)</option>
                    <option>B.S. / B.Sc (Computer Science / IT)</option>
                    <option>M.S. / M.Tech (Computer Science / AI)</option>
                    <option>BCA / MCA</option>
                    <option>High School / Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization / Major</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Artificial Intelligence, Software Engineering"
                    className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                  >
                  </input>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expected Graduation Year</label>
                  <select
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
                    className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-white"
                  >
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">College / University Name</label>
                  <input
                    type="text"
                    value={formData.college_name}
                    onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                    placeholder="e.g. Caltech, Berkeley, MIT..."
                    className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Skills */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Stage 2: Technical Skills & Proficiency</h2>
                  <p className="text-xs text-gray-500">Tap skills you have worked with, then select your proficiency level.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Select Your Technologies:</label>
                <div className="flex flex-wrap gap-2">
                  {TECH_SKILL_OPTIONS.map((skill) => {
                    const isSelected = formData.selectedTechSkills.some(s => s.name === skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleTechSkillToggle(skill)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 font-semibold shadow-xs'
                            : 'bg-white text-gray-700 border-purple-100 hover:border-purple-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.selectedTechSkills.length > 0 && (
                <div className="mt-5 pt-4 border-t border-purple-50">
                  <label className="block text-xs font-semibold text-gray-700 mb-2.5">
                    Set Proficiency Levels ({formData.selectedTechSkills.length} selected):
                  </label>
                  <div className="space-y-2.5">
                    {formData.selectedTechSkills.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-lavender-50/60 border border-purple-100">
                        <span className="text-xs font-bold text-gray-900">{item.name}</span>
                        <div className="flex gap-1">
                          {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleProficiencyChange(item.name, lvl)}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                                item.proficiency === lvl
                                  ? 'bg-purple-700 text-white font-bold'
                                  : 'bg-white text-gray-600 hover:bg-purple-100/70 border border-purple-200'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Problem Solving Traits */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Stage 3: Engineering Mindset & Aptitude</h2>
                  <p className="text-xs text-gray-500">Understanding how you approach complex, ambiguous engineering challenges.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-lavender-50/50 border border-purple-100">
                <p className="text-xs font-bold text-gray-900 mb-3">
                  Scenario: You are tasked with architecting a new high-throughput feature where standard tutorials don't apply. What is your initial approach?
                </p>
                <div className="space-y-2">
                  {[
                    { id: 'a', label: "Break the challenge down to mathematical/algorithmic first principles and pseudocode.", trait: "High Algorithmic Depth" },
                    { id: 'b', label: "Quickly build a prototype sandbox and run iterative trial-and-error experiments.", trait: "Agile Rapid Prototyper" },
                    { id: 'c', label: "Read official API specs, whitepapers, and benchmarking reports comprehensively.", trait: "Systematic Systems Thinker" },
                    { id: 'd', label: "Consult peer engineers and user journey metrics to clarify scope and tradeoffs.", trait: "Product & Collaborative" }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, problemSolvingAnswer: opt.id })}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.problemSolvingAnswer === opt.id
                          ? 'bg-purple-100/70 border-purple-600 text-purple-950 font-medium'
                          : 'bg-white border-purple-100 hover:bg-purple-50/40 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="problem_solving"
                        checked={formData.problemSolvingAnswer === opt.id}
                        onChange={() => {}}
                        className="mt-0.5 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="text-xs">
                        <div>{opt.label}</div>
                        <span className="text-[10px] text-purple-600 font-semibold mt-0.5 block">Trait: {opt.trait}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Soft Skills & Working Strengths:</label>
                <div className="flex flex-wrap gap-2">
                  {SOFT_SKILLS_LIST.map((skill) => {
                    const isSelected = formData.soft_skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSoftSkillToggle(skill)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-white text-gray-700 border-purple-100 hover:border-purple-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Domains & Interests */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Stage 4: Domain Passions & Industries</h2>
                  <p className="text-xs text-gray-500">Select domains where you are passionate about building future solutions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DOMAINS_LIST.map((domain) => {
                  const isSelected = formData.interests.includes(domain);
                  return (
                    <div
                      key={domain}
                      onClick={() => handleInterestToggle(domain)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-100/70 border-purple-500 text-purple-900 font-bold shadow-2xs'
                          : 'bg-white border-purple-100 hover:bg-purple-50/40 text-gray-700'
                      }`}
                    >
                      <span className="text-xs">{domain}</span>
                      <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-gray-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Goals & Review */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-50">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Stage 5: Career Aspirations & Final Submission</h2>
                  <p className="text-xs text-gray-500">Define your target objectives and review your assessment inputs.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Ideal Role</label>
                <input
                  type="text"
                  value={formData.career_goals}
                  onChange={(e) => setFormData({ ...formData, career_goals: e.target.value })}
                  placeholder="e.g. AI Engineer, Full Stack Developer, Data Scientist"
                  className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Work Environment</label>
                <select
                  value={formData.work_environment}
                  onChange={(e) => setFormData({ ...formData, work_environment: e.target.value })}
                  className="w-full p-2.5 text-xs border border-purple-200 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-white"
                >
                  <option>High-Growth Tech Startup / AI Lab</option>
                  <option>Global Enterprise / Big Tech</option>
                  <option>Remote-First Distributed Team</option>
                  <option>Academic Research / R&D Institute</option>
                </select>
              </div>

              {/* Summary Review Pill */}
              <div className="p-4 rounded-2xl bg-lavender-50 border border-purple-100 text-xs space-y-1.5 text-gray-700">
                <div className="font-bold text-purple-900 mb-2">Ready to Submit:</div>
                <div>• Degree: <strong>{formData.degree} ({formData.specialization})</strong></div>
                <div>• Technical Skills: <strong>{formData.selectedTechSkills.map(s => s.name).join(', ') || 'None selected'}</strong></div>
                <div>• Domain Interests: <strong>{formData.interests.join(', ')}</strong></div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-5 border-t border-purple-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Stage</span>
              </button>
            ) : <div></div>}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm shadow-purple-500/20 flex items-center gap-1.5"
              >
                <span>Continue to Stage {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/25 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? 'Analyzing Responses...' : 'Submit & Calculate Career Matches'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Modal */}
        {result && (
          <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
                <Award className="w-7 h-7 text-amber-300" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900">Assessment Completed!</h3>
              <p className="text-xs text-gray-600 text-center mt-1">
                Your answers have been analyzed by the CareerWithinU matching engine.
              </p>

              <div className="my-5 p-4 rounded-2xl bg-lavender-50 border border-purple-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Top Recommended Career Match</span>
                <div className="text-2xl font-extrabold text-purple-900 mt-0.5">{result.top_career}</div>
                <div className="text-sm font-bold text-emerald-600 mt-1">
                  {result.top_match_percentage}% Career Compatibility Match
                </div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/recommendations')}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
                >
                  View Recommendations
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

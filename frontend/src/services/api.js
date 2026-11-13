function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return 'https://careerwithinu.onrender.com/api';
  }
  const cleaned = envUrl.trim().replace(/\/+$/, '');
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
}

const API_BASE_URL = resolveApiBaseUrl();

function getAuthHeaders() {
  const token = localStorage.getItem('careerwithinu_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred.';
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || JSON.stringify(errData);
    } catch (e) {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(data) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async demoLogin(role = 'student') {
    const res = await fetch(`${API_BASE_URL}/auth/demo-login/${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(res);
  },

  // Student Dashboard & Profile
  async getDashboard() {
    const res = await fetch(`${API_BASE_URL}/student/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/student/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  async getSkills() {
    const res = await fetch(`${API_BASE_URL}/student/skills`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async addSkill(skill) {
    const res = await fetch(`${API_BASE_URL}/student/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skill)
    });
    return handleResponse(res);
  },

  async deleteSkill(skillId) {
    const res = await fetch(`${API_BASE_URL}/student/skills/${skillId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Assessments
  async getAssessmentQuestions() {
    const res = await fetch(`${API_BASE_URL}/assessments/questions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async submitAssessment(data) {
    const res = await fetch(`${API_BASE_URL}/assessments/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getAssessmentHistory() {
    const res = await fetch(`${API_BASE_URL}/assessments/history`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Recommendations & Gap Analysis
  async getRecommendations() {
    const res = await fetch(`${API_BASE_URL}/recommendations`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAllCareers() {
    const res = await fetch(`${API_BASE_URL}/recommendations/careers`);
    return handleResponse(res);
  },

  async getCareerById(careerId) {
    const res = await fetch(`${API_BASE_URL}/recommendations/careers/${careerId}`);
    return handleResponse(res);
  },

  async getSkillGap(careerId) {
    const res = await fetch(`${API_BASE_URL}/recommendations/gap-analysis/${careerId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async toggleSaveCareer(careerId) {
    const res = await fetch(`${API_BASE_URL}/recommendations/save/${careerId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getSavedCareers() {
    const res = await fetch(`${API_BASE_URL}/recommendations/saved`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Roadmaps
  async getActiveRoadmap() {
    const res = await fetch(`${API_BASE_URL}/roadmaps/active`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getCareerRoadmap(careerId) {
    const res = await fetch(`${API_BASE_URL}/roadmaps/career/${careerId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async toggleRoadmapTask(taskId) {
    const res = await fetch(`${API_BASE_URL}/roadmaps/tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Colleges
  async searchColleges(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/colleges?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async toggleShortlistCollege(collegeId) {
    const res = await fetch(`${API_BASE_URL}/colleges/shortlist/${collegeId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Resources
  async getResources(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/resources?${query}`);
    return handleResponse(res);
  },

  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/jobs?${query}`);
    return handleResponse(res);
  },

  // Chatbot
  async getChatHistory(sessionId = 'default') {
    const res = await fetch(`${API_BASE_URL}/chat/history?session_id=${sessionId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async sendChatMessage(message, sessionId = 'default') {
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, session_id: sessionId })
    });
    return handleResponse(res);
  },

  async clearChat(sessionId = 'default') {
    const res = await fetch(`${API_BASE_URL}/chat/clear?session_id=${sessionId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAdminStudents() {
    const res = await fetch(`${API_BASE_URL}/admin/students`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async addCareer(careerData) {
    const res = await fetch(`${API_BASE_URL}/admin/careers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(careerData)
    });
    return handleResponse(res);
  }
};

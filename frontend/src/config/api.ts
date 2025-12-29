// API Configuration
// This file centralizes all API endpoints for easy management

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  
  // Projects
  PROJECTS: `${API_URL}/api/projects`,
  PROJECT_BY_ID: (id: string) => `${API_URL}/api/projects/${id}`,
  
  // Certificates
  CERTIFICATES: `${API_URL}/api/certificates`,
  CERTIFICATE_BY_ID: (id: string) => `${API_URL}/api/certificates/${id}`,
  
  // Badges
  BADGES: `${API_URL}/api/badges`,
  BADGE_BY_ID: (id: string) => `${API_URL}/api/badges/${id}`,
  
  // Internships
  INTERNSHIPS: `${API_URL}/api/internships`,
  INTERNSHIP_BY_ID: (id: string) => `${API_URL}/api/internships/${id}`,
}

export default API_ENDPOINTS

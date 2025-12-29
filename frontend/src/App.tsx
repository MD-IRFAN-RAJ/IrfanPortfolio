import React, { useEffect } from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import CertificatesPage from './pages/CertificatesPage'
import BadgesPage from './pages/BadgesPage'
import InternshipsPage from './pages/InternshipsPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'

const App: React.FC = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // Track page views on route change
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname })
  }, [location.pathname])

  const mainClass = isAdmin ? 'app-main' : 'app-main page-bg'

  return (
    <div className="app-root">
      <NavBar />
      <main className={mainClass}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

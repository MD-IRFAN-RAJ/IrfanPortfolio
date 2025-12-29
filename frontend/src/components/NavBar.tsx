import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaProjectDiagram, FaCertificate, FaAward, FaUniversity, FaUserShield, FaBars, FaTimes } from 'react-icons/fa'

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
      isActive 
        ? 'bg-[#1b263b] text-white shadow-lg shadow-[#1b263b]/25' 
        : 'text-[#cbd5e0] hover:bg-[#0d1b2a] hover:text-white'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
      isActive 
        ? 'bg-[#1b263b] text-white shadow-lg shadow-[#1b263b]/25' 
        : 'text-[#cbd5e0] hover:bg-[#0d1b2a] hover:text-white'
    }`

  return (
    <nav className="bg-[#0a1628]/95 backdrop-blur-lg border-b border-[#1b263b] sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="signature-font text-2xl bg-gradient-to-r from-[#3b6ea5] to-[#2c5282] bg-clip-text text-transparent">
              Md Irfan Raj
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1">
            <ul className="flex items-center justify-center space-x-0.5">
              <li>
                <NavLink to="/" className={linkClass}>
                  <FaHome className="text-base" />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" className={linkClass}>
                  <FaProjectDiagram className="text-base" />
                  <span>Projects</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/internships" className={linkClass}>
                  <FaUniversity className="text-base" />
                  <span>Internships</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/certificates" className={linkClass}>
                  <FaCertificate className="text-base" />
                  <span>Certificates</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/badges" className={linkClass}>
                  <FaAward className="text-base" />
                  <span>Badges</span>
                </NavLink>
              </li>
              
              
              <li>
                <NavLink to="/admin" className={linkClass}>
                  <FaUserShield className="text-base" />
                  <span>Admin</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#cbd5e0] hover:bg-[#0d1b2a] hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#1b263b] bg-[#0d1b2a]">
            <ul className="space-y-2">
              <li>
                <NavLink 
                  to="/" 
                  className={mobileLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaHome className="text-lg" />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/projects" 
                  className={mobileLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaProjectDiagram className="text-lg" />
                  <span>Projects</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/certificates" 
                  className={mobileLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaCertificate className="text-lg" />
                  <span>Certificates</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/badges" 
                  className={mobileLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaAward className="text-lg" />
                  <span>Badges</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/internships" 
                  className={mobileLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUniversity className="text-lg" />
                  <span>Internships</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin" 
                  className={mobileLinkClass}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUserShield className="text-lg" />
                  <span>Admin</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar
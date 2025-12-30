import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaUsers, FaStar, FaSearch, FaFilter, FaExternalLinkAlt, FaLaptopCode, FaChartLine, FaGraduationCap, FaTimes, FaCertificate } from 'react-icons/fa'
import API_ENDPOINTS from '../config/api'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

type Internship = {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  duration: string
  description: string
  responsibilities: string[]
  achievements: string[]
  skills: string[]
  technologies: string[]
  category: 'software' | 'data-science' | 'research' | 'business' | 'design'
  companyLogo?: string
  supervisor?: string
  recommendation?: string
  projectUrl?: string
  certificateUrl?: string
  paid: boolean
  remote: boolean
  impact: string
}

const InternshipsPage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  const categories = ['all', 'software', 'data-science', 'research', 'business', 'design']
  const types = ['all', 'remote', 'onsite']

  useEffect(() => {
    fetchInternships()
  }, [])

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_ENDPOINTS.INTERNSHIPS)
      if (res.ok) {
        const data = await res.json()
        // Map API data to component format
        const formattedData = data.map((internship: any) => ({
          id: internship._id,
          company: internship.company,
          position: internship.position,
          location: internship.location || 'Not specified',
          startDate: internship.startDate,
          endDate: internship.endDate,
          duration: internship.duration || calculateDuration(internship.startDate, internship.endDate),
          description: internship.description || '',
          responsibilities: internship.responsibilities || [],
          achievements: internship.achievements || [],
          skills: internship.skills || [],
          technologies: internship.technologies || [],
          category: internship.category || 'software',
          paid: internship.paid !== false,
          remote: internship.remote !== false,
          impact: internship.impact || '',
          supervisor: internship.supervisor,
          recommendation: internship.recommendation,
          projectUrl: internship.projectUrl,
          certificateUrl: internship.certificateUrl
        }))
        setInternships(formattedData)
      } else {
        console.error('Failed to fetch internships')
      }
    } catch (err) {
      console.error('Error fetching internships:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    if (months === 1) return '1 month'
    return `${months} months`
  }

  useEffect(() => {
    filterInternships()
  }, [internships, searchTerm, selectedCategory, selectedType])

  useEffect(() => {
    if (filteredInternships.length > 0) {
      animateInternships()
    }
  }, [filteredInternships])

  const filterInternships = () => {
    let filtered = internships

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(internship => internship.category === selectedCategory)
    }

    if (selectedType === 'remote') {
      filtered = filtered.filter(internship => internship.remote)
    } else if (selectedType === 'onsite') {
      filtered = filtered.filter(internship => !internship.remote)
    }

    setFilteredInternships(filtered)
  }

  const animateInternships = () => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'software': return 'from-[#1e3a5f] to-[#2c5282]'
      case 'data-science': return 'from-[#312e81] to-[#4338ca]'
      case 'research': return 'from-[#14532d] to-[#166534]'
      case 'business': return 'from-[#7c2d12] to-[#9a3412]'
      case 'design': return 'from-[#6b21a8] to-[#7e22ce]'
      default: return 'from-[#1f2937] to-[#111827]'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'software': return <FaLaptopCode />
      case 'data-science': return <FaChartLine />
      case 'research': return <FaGraduationCap />
      case 'business': return <FaBriefcase />
      case 'design': return <FaStar />
      default: return <FaBriefcase />
    }
  }

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  const handleCardHover = (index: number, isHovering: boolean) => {
    if (cardsRef.current[index]) {
      gsap.to(cardsRef.current[index], {
        y: isHovering ? -10 : 0,
        scale: isHovering ? 1.02 : 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const openInternshipDetails = (internship: Internship) => {
    setSelectedInternship(internship)
  }

  const closeModal = () => {
    setSelectedInternship(null)
  }

  const getCompanyLogo = (company: string) => {
    const logos: { [key: string]: string } = {
      'Google': '🔍',
      'Meta': '📱',
      'Microsoft': '🪟',
      'Apple': '🍎',
      'NASA Jet Propulsion Laboratory': '🚀'
    }
    return logos[company] || '🏢'
  }

  return (
    <div className="min-h-screen bg-[url('/bgblk.avif')] bg-cover bg-center bg-fixed py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2c5282] to-[#1e3a5f] rounded-3xl mb-6 shadow-lg">
            <FaBriefcase className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Professional <span className="text-[#3b6ea5]">Internships</span>
          </h1>
          <p className="text-xl text-[#a0aec0] max-w-3xl mx-auto">
            Hands-on experience at leading tech companies, building real-world solutions and developing professional skills.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center border border-[#1b263b]">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">{internships.length}</div>
            <div className="text-[#a0aec0]">Total Internships</div>
          </div>
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center border border-[#1b263b]">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">
              {new Set(internships.map(i => i.company)).size}
            </div>
            <div className="text-[#a0aec0]">Companies</div>
          </div>
          
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center border border-[#1b263b]">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">
              {new Set(internships.flatMap(i => i.skills)).size}
            </div>
            <div className="text-[#a0aec0]">Skills Gained</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 mb-12 border border-[#1b263b]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0aec0]" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#1b263b] rounded-xl bg-[#0d1b2a] text-[#e2e8f0] focus:ring-2 focus:ring-[#3b6ea5] focus:border-transparent placeholder:text-gray-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <FaFilter className="text-[#a0aec0]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-3 border border-[#1b263b] rounded-xl bg-[#0d1b2a] text-[#e2e8f0] focus:ring-2 focus:ring-[#3b6ea5] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-[#1b263b] rounded-xl bg-[#0d1b2a] text-[#e2e8f0] focus:ring-2 focus:ring-[#3b6ea5] focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Internships Grid */}
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-16">
              <div className="text-[#a0aec0] text-3xl">Loading internships...</div>
            </div>
          ) : filteredInternships.length > 0 ? (
            filteredInternships.map((internship, index) => (
              <div
                key={internship.id}
                ref={addToCardsRef}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                className="bg-[#0d1b2a] rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-[#1b263b]"
                onClick={() => openInternshipDetails(internship)}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${getCategoryColor(internship.category)} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-900/20 rounded-2xl flex items-center justify-center text-white text-xl">
                        {getCompanyLogo(internship.company)}
                      </div>
                      <div className="flex gap-2">
                        {internship.remote && (
                          <span className="bg-gray-900/20 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Remote
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{internship.position}</h3>
                    <p className="text-white/90 font-medium">{internship.company}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Location and Duration */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-[#a0aec0]">
                      <FaMapMarkerAlt className="text-[#3b6ea5]" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#a0aec0]">
                      <FaCalendar className="text-[#38a169]" />
                      <span>{internship.duration} • {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#a0aec0]">
                      {getCategoryIcon(internship.category)}
                      <span className="text-sm capitalize">{internship.category.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#cbd5e0] text-sm mb-4 line-clamp-3">
                    {internship.description}
                  </p>

                  {/* Key Achievements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#a0aec0] mb-2">Key Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.achievements.slice(0, 2).map((achievement, idx) => (
                        <span
                          key={idx}
                          className="bg-[#1b263b] text-[#cbd5e0] px-2 py-1 rounded-lg text-xs font-medium line-clamp-1"
                        >
                          {achievement}
                        </span>
                      ))}
                      {internship.achievements.length > 2 && (
                        <span className="bg-[#0d1b2a] text-[#a0aec0] px-2 py-1 rounded-lg text-xs font-medium border border-[#1b263b]">
                          +{internship.achievements.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {internship.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-[#1b263b] text-[#cbd5e0] px-2 py-1 rounded-lg text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {internship.technologies.length > 3 && (
                      <span className="bg-[#0d1b2a] text-[#a0aec0] px-2 py-1 rounded-lg text-xs border border-[#1b263b]">
                        +{internship.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Certificate Preview Link */}
                  {internship.certificateUrl && (
                    <div className="pt-4 border-t border-[#1b263b]">
                      <a
                        href={internship.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white px-4 py-2.5 rounded-xl font-semibold hover:from-[#2c5282] hover:to-[#1e3a5f] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <FaCertificate className="text-xl" />
                        <span>📜 Preview Certificate</span>
                        <FaExternalLinkAlt className="text-sm ml-auto" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-[#a0aec0] text-6xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-[#a0aec0] mb-2">No internships found</h3>
              <p className="text-[#a0aec0]">
                {searchTerm || selectedCategory !== 'all' || selectedType !== 'all'
                  ? "Try adjusting your search or filter criteria."
                  : "No internship records available yet."
                }
              </p>
            </div>
          )}
        </div>

        {/* Internship Detail Modal */}
        {selectedInternship && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div ref={modalRef} className="bg-[#0d1b2a] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#1b263b]">
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-[#0d1b2a]/90 hover:bg-[#0d1b2a] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 transition-all hover:scale-110"
                >
                  <FaTimes />
                </button>

                {/* Header */}
                <div className={`bg-gradient-to-r ${getCategoryColor(selectedInternship.category)} p-8 rounded-t-3xl text-white`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedInternship.position}</h2>
                      <p className="text-xl opacity-90">{selectedInternship.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl mb-2">
                        {getCompanyLogo(selectedInternship.company)}
                      </div>
                      <div className="flex gap-2">
                        {selectedInternship.remote && (
                          <span className="bg-gray-900/20 px-3 py-1 rounded-full text-sm font-semibold">
                            Remote
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Internship Details */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FaBriefcase className="text-[#3b6ea5]" />
                        Internship Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-[#1b263b]">
                          <span className="text-[#a0aec0]">Location</span>
                          <span className="font-semibold text-white">{selectedInternship.location}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1b263b]">
                          <span className="text-[#a0aec0]">Duration</span>
                          <span className="font-semibold text-white">{selectedInternship.duration}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1b263b]">
                          <span className="text-[#a0aec0]">Period</span>
                          <span className="font-semibold text-white">
                            {new Date(selectedInternship.startDate).toLocaleDateString()} - {new Date(selectedInternship.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1b263b]">
                          <span className="text-[#a0aec0]">Category</span>
                          <span className="font-semibold text-white capitalize">{selectedInternship.category.replace('-', ' ')}</span>
                        </div>
                        {selectedInternship.supervisor && (
                          <div className="flex justify-between items-center py-2 border-b border-[#1b263b]">
                            <span className="text-[#a0aec0]">Supervisor</span>
                            <span className="font-semibold text-white">{selectedInternship.supervisor}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Impact */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FaChartLine className="text-green-500" />
                        Impact & Scope
                      </h3>
                      <p className="text-[#cbd5e0] mb-4">{selectedInternship.impact}</p>
                      
                      <h4 className="font-semibold text-[#e2e8f0] mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInternship.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="bg-[#1b263b] text-[#cbd5e0] px-3 py-1 rounded-lg text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Key Responsibilities</h3>
                    <ul className="space-y-3">
                      {selectedInternship.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#3b6ea5] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-[#e2e8f0]">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Achievements */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Notable Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInternship.achievements.map((achievement, index) => (
                        <div key={index} className="bg-[#1b263b] border border-[#1b263b] rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaStar className="text-[#fbbf24]" />
                            <span className="font-semibold text-[#e2e8f0]">Achievement</span>
                          </div>
                          <p className="text-[#cbd5e0] text-sm">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Gained */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Skills Developed</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedInternship.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-[#1b263b] text-[#cbd5e0] px-4 py-2 rounded-xl font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certificate Preview */}
                  {selectedInternship.certificateUrl && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4">Certificate/Completion Letter</h3>
                      <div className="bg-[#0d1b2a] rounded-2xl p-4 border border-[#1b263b]">
                        {selectedInternship.certificateUrl.endsWith('.pdf') ? (
                          <div className="flex items-center justify-between bg-[#1b263b] p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="text-4xl">📄</div>
                              <div>
                                <p className="text-white font-semibold">Certificate Document</p>
                                <p className="text-[#a0aec0] text-sm">PDF File</p>
                              </div>
                            </div>
                            <a
                              href={selectedInternship.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#1e3a5f] text-white px-4 py-2 rounded-lg hover:bg-[#2c5282] transition-colors flex items-center gap-2"
                            >
                              <FaExternalLinkAlt />
                              View PDF
                            </a>
                          </div>
                        ) : (
                          <img 
                            src={selectedInternship.certificateUrl} 
                            alt="Certificate" 
                            className="w-full h-auto rounded-xl border border-[#1b263b] cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open(selectedInternship.certificateUrl, '_blank')}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {selectedInternship.projectUrl && (
                      <a
                        href={selectedInternship.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3 px-6 rounded-2xl hover:bg-[#2c5282] transition-colors font-semibold"
                      >
                        <FaExternalLinkAlt />
                        View Project
                      </a>
                    )}
                    {selectedInternship.recommendation && (
                      <button className="flex-1 flex items-center justify-center gap-2 bg-[#166534] text-white py-3 px-6 rounded-2xl hover:bg-[#15803d] transition-colors font-semibold">
                        <FaUsers />
                        {selectedInternship.recommendation}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InternshipsPage
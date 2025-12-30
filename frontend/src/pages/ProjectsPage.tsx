import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import {
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
  FaSpinner,
  FaSearch,
  FaFilter,
} from 'react-icons/fa'
import API_ENDPOINTS, { getImageUrl } from '../config/api'

type Project = {
  _id: string
  title: string
  summary?: string
  images?: string[]
  technologies?: string[]
  category?: string
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const projectsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchTerm, selectedCategory])

  useEffect(() => {
    if (!loading && filteredProjects.length > 0) {
      animateProjects()
    }
  }, [filteredProjects, loading])

  /* -------------------- Data -------------------- */

  async function fetchProjects() {
    try {
      setLoading(true)
      const res = await fetch(API_ENDPOINTS.PROJECTS)
      const data: Project[] = await res.json()
      setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function filterProjects() {
    let filtered = [...projects]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(term) ||
          project.summary?.toLowerCase().includes(term) ||
          project.technologies?.some(tech =>
            tech.toLowerCase().includes(term)
          )
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        project => project.category === selectedCategory
      )
    }

    setFilteredProjects(filtered)
  }

  /* -------------------- Animations -------------------- */

  const animateProjects = () => {
    if (cardsRef.current.length) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        }
      )
    }
  }

  const handleCardHover = (index: number, isHovering: boolean) => {
    const card = cardsRef.current[index]
    if (!card) return

    gsap.to(card, {
      y: isHovering ? -10 : 0,
      scale: isHovering ? 1.02 : 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  /* -------------------- FIXED CATEGORY LOGIC -------------------- */

  const categories: string[] = [
    'all',
    ...Array.from(
      new Set(
        projects
          .map(p => p.category)
          .filter((cat): cat is string => typeof cat === 'string')
      )
    ),
  ]

  /* -------------------- Loading -------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#3b6ea5] mx-auto mb-4" />
          <p className="text-[#a0aec0]">Loading projects...</p>
        </div>
      </div>
    )
  }

  /* -------------------- Render -------------------- */

  return (
    <div className="min-h-screen bg-[url('/bgblk.avif')] bg-cover bg-center bg-fixed py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            My <span className="text-[#3b6ea5]">Projects</span>
          </h1>
          <p className="text-xl text-[#a0aec0] max-w-3xl mx-auto">
            A collection of my work showcasing various technologies and solutions
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-12 bg-[#0d1b2a] rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0aec0]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#1b263b] rounded-lg focus:ring-2 focus:ring-[#3b6ea5]"
              />
            </div>

            <div className="flex items-center gap-4">
              <FaFilter className="text-[#a0aec0]" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-[#1b263b] rounded-lg focus:ring-2 focus:ring-[#3b6ea5]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.length ? (
            filteredProjects.map((project, index) => (
              <div
                key={project._id}
                ref={addToCardsRef}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                className="bg-[#0d1b2a] rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-[#2c5282] to-[#1e3a5f] flex items-center justify-center">
                  {project.images?.[0] ? (
                    <img
                      src={getImageUrl(project.images[0])}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <FaCode className="text-white text-4xl opacity-80" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-[#a0aec0] mb-4 line-clamp-3">
                    {project.summary}
                  </p>

                  {project.technologies?.length && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="bg-[#1e3a5f] text-[#cbd5e0] px-3 py-1 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#1b263b]">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3b6ea5] flex items-center gap-2"
                      >
                        <FaExternalLinkAlt /> Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a0aec0] flex items-center gap-2"
                      >
                        <FaGithub /> Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-[#a0aec0]">
              No projects found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage

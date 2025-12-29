import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaAward, FaExternalLinkAlt, FaSync, FaSearch } from 'react-icons/fa'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

type Badge = {
  _id: string
  name: string
  imageUrl: string
  issueDate: string
  issuer: string
  credentialUrl?: string
}

const BadgesPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([])
  const [filteredBadges, setFilteredBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  // Simplified filters: only search by name or issuer
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    fetchBadges()
  }, [])

  useEffect(() => {
    filterBadges()
  }, [badges, searchTerm])

  useEffect(() => {
    if (filteredBadges.length > 0 && !loading) {
      animateBadges()
    }
  }, [filteredBadges, loading])

  const fetchBadges = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/badges')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setBadges(data)
    } catch (err) {
      console.error('Error fetching badges:', err)
      setError('Failed to load badges. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Removed Credly transformation helpers; using backend data directly

  const filterBadges = () => {
    let filtered = badges

    if (searchTerm) {
      filtered = filtered.filter(badge =>
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.skill.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredBadges(filtered)
  }

  const animateBadges = () => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        {
          opacity: 0,
          y: 60,
          rotationY: 10
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
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

  const addToCardsRef = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  // Removed level-based styling and icons

  const handleCardHover = (index: number, isHovering: boolean) => {
    if (cardsRef.current[index]) {
      gsap.to(cardsRef.current[index], {
        y: isHovering ? -10 : 0,
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#0d1b2a]">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-[#3b6ea5] mx-auto mb-4" />
          <p className="text-[#a0aec0]">Loading badges...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#0d1b2a]">
        <div className="text-center">
          <div className="text-[#2c5282] text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-[#e2e8f0] mb-2">Failed to Load Badges</h3>
          <p className="text-[#a0aec0] mb-4">{error}</p>
          <button
            onClick={fetchBadges}
            className="bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2c5282] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('/bgblk.avif')] bg-cover bg-center bg-fixed py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2c5282] to-[#1e3a5f] rounded-3xl mb-6 shadow-lg">
            <FaAward className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-[#3b6ea5]">Badges</span>
          </h1>
          <p className="text-xl text-[#a0aec0] max-w-3xl mx-auto">
            Verified badges fetched from the portfolio backend
          </p>
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">{badges.length}</div>
            <div className="text-[#a0aec0]">Total Badges</div>
          </div>
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">
              {new Set(badges.map(b => b.issuer)).size}
            </div>
            <div className="text-[#a0aec0]">Issuing Organizations</div>
          </div>
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">
              {badges.filter(b => !!b.credentialUrl).length}
            </div>
            <div className="text-[#a0aec0]">With Credential Link</div>
          </div>
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">
              {badges.length > 0 ? new Date(badges[0].issueDate).toLocaleDateString() : '-'}
            </div>
            <div className="text-gray-400">Latest Issue Date</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0aec0]" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#1b263b] rounded-xl focus:ring-2 focus:ring-[#3b6ea5] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredBadges.length > 0 ? (
            filteredBadges.map((badge, index) => (
              <div
                key={badge._id}
                ref={addToCardsRef}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                className="bg-gray-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Badge Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://via.placeholder.com/80x80/FFA500/FFFFFF?text=🏆'
                        }}
                      />
                    </div>
                    
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {badge.name}
                  </h3>
                  
                </div>

                {/* Badge Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#a0aec0]">Issuer</span>
                      <span className="font-semibold text-[#e2e8f0]">{badge.issuer}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#a0aec0]">Issued</span>
                      <span className="font-semibold text-[#e2e8f0]">
                        {new Date(badge.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {badge.credentialUrl ? (
                    <a
                      href={badge.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3 px-4 rounded-xl hover:bg-[#2c5282] transition-colors font-semibold group/btn"
                    >
                      <FaExternalLinkAlt className="group-hover/btn:translate-x-1 transition-transform" />
                      View Credential
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 bg-[#1b263b] text-[#a0aec0] py-3 px-4 rounded-xl">
                      No credential link
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-[#a0aec0] text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-[#a0aec0] mb-2">No badges found</h3>
              <p className="text-[#a0aec0]">
                {searchTerm
                  ? "Try adjusting your search or filter criteria."
                  : "No badges available at the moment."
                }
              </p>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-12">
          <button
            onClick={fetchBadges}
            className="inline-flex items-center gap-2 bg-[#0d1b2a] text-[#cbd5e0] border border-[#1b263b] px-6 py-3 rounded-xl font-semibold hover:bg-[#1b263b] transition-colors"
          >
            <FaSync />
            Refresh Badges
          </button>
        </div>
      </div>
    </div>
  )
}

export default BadgesPage
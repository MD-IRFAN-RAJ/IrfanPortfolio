import React, { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { FaCertificate, FaDownload } from 'react-icons/fa'

type Certificate = {
  _id: string
  image: string
  createdAt: string
}

const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/certificates')
      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (certificates.length > 0) {
      gsap.fromTo('.certificate-card',
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      )
    }
  }, [certificates])

  return (
    <div className="min-h-screen bg-[url('/bgblk.avif')] bg-cover bg-center bg-fixed py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2c5282] to-[#1e3a5f] rounded-3xl mb-6 shadow-lg">
            <FaCertificate className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            My <span className="text-[#3b6ea5]">Certificates</span>
          </h1>
          <p className="text-xl text-[#a0aec0] max-w-3xl mx-auto">
            Professional certifications and achievements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">{certificates.length}</div>
            <div className="text-[#a0aec0]">Total Certificates</div>
          </div>
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">
              {new Date().getFullYear()}
            </div>
            <div className="text-[#a0aec0]">Current Year</div>
          </div>
          <div className="bg-[#0d1b2a] rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#3b6ea5] mb-2">100%</div>
            <div className="text-[#a0aec0]">Verified</div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#3b6ea5] mb-4"></div>
              <p className="text-[#a0aec0] text-lg">Loading certificates...</p>
            </div>
          ) : certificates.length > 0 ? (
            certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="certificate-card bg-[#0d1b2a] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-[#1b263b]"
              >
                <div 
                  className="relative cursor-pointer overflow-hidden"
                  onClick={() => setSelectedImage(certificate.image)}
                >
                  <img
                    src={certificate.image}
                    alt="Certificate"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view full size
                    </span>
                  </div>
                </div>
                
                {/* Download Button */}
                <div className="p-4 flex justify-center">
                  <a
                    href={certificate.image}
                    download
                    className="flex items-center gap-2 bg-[#3b6ea5] text-white px-4 py-2 hover:bg-[#2c5282] transition-colors"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-[#a0aec0] text-6xl mb-4">📜</div>
              <h3 className="text-2xl font-bold text-[#a0aec0] mb-2">No certificates found</h3>
              <p className="text-[#a0aec0]">No certificates available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Size Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full mx-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-[#3b6ea5] transition-colors bg-black/40 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Certificate Full Size"
                className="max-h-[80vh] w-auto object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificatesPage

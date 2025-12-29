import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaProjectDiagram, FaCertificate, FaAward, FaBriefcase } from 'react-icons/fa'

type Project = { _id: string; title: string; summary?: string; images?: string[]; technologies?: string[]; repoLink?: string; liveLink?: string; imageUrl?: string }
type Certificate = { _id: string; image: string; createdAt: string }
type Badge = { _id: string; name: string; issuer: string; issueDate: string; imageUrl: string }
type Internship = { 
  _id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate: string
  duration?: string
  description?: string
  responsibilities?: string[]
  achievements?: string[]
  skills?: string[]
  technologies?: string[]
  category?: string
  supervisor?: string
  recommendation?: string
  projectUrl?: string
  certificateUrl?: string
  paid?: boolean
  remote?: boolean
  impact?: string
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'badges' | 'internships'>('projects')
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const navigate = useNavigate()

  // Projects State
  const [projects, setProjects] = useState<Project[]>([])
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectForm, setProjectForm] = useState({ title: '', summary: '', technologies: '', repoLink: '', liveLink: '' })
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null)
  const [projectImagePreview, setProjectImagePreview] = useState<string>('')
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editProjectForm, setEditProjectForm] = useState({ title: '', summary: '', technologies: '', repoLink: '', liveLink: '' })
  const [editProjectImageFile, setEditProjectImageFile] = useState<File | null>(null)
  const [editProjectImagePreview, setEditProjectImagePreview] = useState<string>('')

  // Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [certificateImageFile, setCertificateImageFile] = useState<File | null>(null)
  const [certificateImagePreview, setCertificateImagePreview] = useState<string>('')
  const [editingCertificate, setEditingCertificate] = useState<string | null>(null)
  const [editCertificateImageFile, setEditCertificateImageFile] = useState<File | null>(null)
  const [editCertificateImagePreview, setEditCertificateImagePreview] = useState<string>('')

  // Badges State
  const [badges, setBadges] = useState<Badge[]>([])
  const [badgeForm, setBadgeForm] = useState({ name: '', issuer: '', issueDate: '', credentialUrl: '' })
  const [badgeImageFile, setBadgeImageFile] = useState<File | null>(null)
  const [badgeImagePreview, setBadgeImagePreview] = useState<string>('')

  // Internships State
  const [internships, setInternships] = useState<Internship[]>([])
  const [internshipForm, setInternshipForm] = useState({ 
    company: '', 
    position: '', 
    location: '',
    startDate: '', 
    endDate: '',
    duration: '',
    description: '',
    responsibilities: '',
    achievements: '',
    skills: '',
    technologies: '',
    category: 'software',
    supervisor: '',
    recommendation: '',
    projectUrl: '',
    paid: true,
    remote: false,
    impact: ''
  })
  const [internshipCertificateFile, setInternshipCertificateFile] = useState<File | null>(null)
  const [internshipCertificatePreview, setInternshipCertificatePreview] = useState<string>('')
  const [editingInternship, setEditingInternship] = useState<string | null>(null)
  const [editInternshipForm, setEditInternshipForm] = useState({
    company: '', 
    position: '', 
    location: '',
    startDate: '', 
    endDate: '',
    duration: '',
    description: '',
    responsibilities: '',
    achievements: '',
    skills: '',
    technologies: '',
    category: 'software',
    supervisor: '',
    recommendation: '',
    projectUrl: '',
    paid: true,
    remote: false,
    impact: ''
  })
  const [editInternshipCertificateFile, setEditInternshipCertificateFile] = useState<File | null>(null)
  const [editInternshipCertificatePreview, setEditInternshipCertificatePreview] = useState<string>('')

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      navigate('/login')
    } else {
      fetchAllData()
    }
  }, [navigate])

  const fetchAllData = async () => {
    setProjectLoading(true)
    try {
      const [projectsRes, certificatesRes, badgesRes, internshipsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/certificates'),
        fetch('/api/badges'),
        fetch('/api/internships')
      ])

      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (certificatesRes.ok) setCertificates(await certificatesRes.json())
      if (badgesRes.ok) setBadges(await badgesRes.json())
      if (internshipsRes.ok) setInternships(await internshipsRes.json())
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setProjectLoading(false)
    }
  }

  const requireAuthToken = () => {
    const t = token || localStorage.getItem('token')
    if (!t) throw new Error('Not authenticated')
    return t
  }

  // Project CRUD
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const t = requireAuthToken()
      const formData = new FormData()
      formData.append('title', projectForm.title)
      formData.append('summary', projectForm.summary || '')
      formData.append('technologies', JSON.stringify(projectForm.technologies ? projectForm.technologies.split(',').map(tech => tech.trim()).filter(t => t) : []))
      formData.append('githubUrl', projectForm.repoLink || '')
      formData.append('liveUrl', projectForm.liveLink || '')
      formData.append('repoLink', projectForm.repoLink || '')
      formData.append('liveLink', projectForm.liveLink || '')
      if (projectImageFile) {
        formData.append('images', projectImageFile)
      }
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Create failed')
      }
      const created = await res.json()
      setProjects(p => [created, ...p])
      setProjectForm({ title: '', summary: '', technologies: '', repoLink: '', liveLink: '' })
      setProjectImageFile(null)
      setProjectImagePreview('')
    } catch (err) {
      console.error('Create error:', err)
      alert(err instanceof Error ? err.message : 'Create failed')
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project._id)
    setEditProjectForm({
      title: project.title,
      summary: project.summary || '',
      technologies: project.technologies?.join(', ') || '',
      repoLink: project.repoLink || '',
      liveLink: project.liveLink || ''
    })
    setEditProjectImageFile(null)
    setEditProjectImagePreview(project.images?.[0] || '')
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    try {
      const t = requireAuthToken()
      const formData = new FormData()
      formData.append('title', editProjectForm.title)
      formData.append('summary', editProjectForm.summary || '')
      formData.append('technologies', JSON.stringify(editProjectForm.technologies ? editProjectForm.technologies.split(',').map(tech => tech.trim()).filter(t => t) : []))
      formData.append('githubUrl', editProjectForm.repoLink || '')
      formData.append('liveUrl', editProjectForm.liveLink || '')
      formData.append('repoLink', editProjectForm.repoLink || '')
      formData.append('liveLink', editProjectForm.liveLink || '')
      if (editProjectImageFile) {
        formData.append('images', editProjectImageFile)
      }
      const res = await fetch(`/api/projects/${editingProject}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setProjects(prev => prev.map(p => p._id === updated._id ? updated : p))
      setEditingProject(null)
      setEditProjectImageFile(null)
      setEditProjectImagePreview('')
    } catch (err) {
      console.error('Update error:', err)
      alert(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      const t = requireAuthToken()
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } })
      if (!res.ok) throw new Error('Delete failed')
      setProjects(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // Certificate CRUD
  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const t = requireAuthToken()
      if (!certificateImageFile) {
        alert('Please select a certificate image')
        return
      }
      const formData = new FormData()
      formData.append('image', certificateImageFile)
      
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Create failed')
      }
      const created = await res.json()
      setCertificates(prev => [created, ...prev])
      setCertificateImageFile(null)
      setCertificateImagePreview('')
    } catch (err) {
      console.error('Create error:', err)
      alert(err instanceof Error ? err.message : 'Create failed')
    }
  }

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate._id)
    setEditCertificateImageFile(null)
    setEditCertificateImagePreview(certificate.image)
  }

  const handleUpdateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCertificate) return
    try {
      const t = requireAuthToken()
      if (!editCertificateImageFile) {
        alert('Please select a new certificate image')
        return
      }
      const formData = new FormData()
      formData.append('image', editCertificateImageFile)
      
      const res = await fetch(`/api/certificates/${editingCertificate}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setCertificates(prev => prev.map(c => c._id === updated._id ? updated : c))
      setEditingCertificate(null)
      setEditCertificateImageFile(null)
      setEditCertificateImagePreview('')
    } catch (err) {
      console.error('Update error:', err)
      alert(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Delete this certificate?')) return
    try {
      const t = requireAuthToken()
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } })
      if (!res.ok) throw new Error('Delete failed')
      setCertificates(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // Badge create (multipart)
  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const t = requireAuthToken()
      const formData = new FormData()
      formData.append('name', badgeForm.name)
      formData.append('issuer', badgeForm.issuer)
      formData.append('issueDate', badgeForm.issueDate)
      formData.append('credentialUrl', badgeForm.credentialUrl)
      if (badgeImageFile) formData.append('image', badgeImageFile)

      const res = await fetch('/api/badges', {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Create failed')
      }
      const created = await res.json()
      setBadges(prev => [created, ...prev])
      setBadgeForm({ name: '', issuer: '', issueDate: '', credentialUrl: '' })
      setBadgeImageFile(null)
      setBadgeImagePreview('')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Create failed')
    }
  }

  const handleDeleteBadge = async (id: string) => {
    if (!confirm('Delete this badge?')) return
    try {
      const t = requireAuthToken()
      const res = await fetch(`/api/badges/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } })
      if (!res.ok) throw new Error('Delete failed')
      setBadges(prev => prev.filter(b => b._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  // Internship CRUD
  const handleCreateInternship = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const t = requireAuthToken()
      const formData = new FormData()
      formData.append('company', internshipForm.company)
      formData.append('position', internshipForm.position)
      formData.append('location', internshipForm.location)
      formData.append('startDate', internshipForm.startDate)
      formData.append('endDate', internshipForm.endDate)
      formData.append('duration', internshipForm.duration)
      formData.append('description', internshipForm.description)
      formData.append('responsibilities', JSON.stringify(internshipForm.responsibilities.split('\n').filter(x => x.trim())))
      formData.append('achievements', JSON.stringify(internshipForm.achievements.split('\n').filter(x => x.trim())))
      formData.append('skills', JSON.stringify(internshipForm.skills.split(',').map(s => s.trim()).filter(x => x)))
      formData.append('technologies', JSON.stringify(internshipForm.technologies.split(',').map(s => s.trim()).filter(x => x)))
      formData.append('category', internshipForm.category)
      formData.append('supervisor', internshipForm.supervisor)
      formData.append('recommendation', internshipForm.recommendation)
      formData.append('projectUrl', internshipForm.projectUrl)
      formData.append('paid', String(internshipForm.paid))
      formData.append('remote', String(internshipForm.remote))
      formData.append('impact', internshipForm.impact)
      
      if (internshipCertificateFile) {
        formData.append('certificate', internshipCertificateFile)
      }

      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Create failed')
      }
      
      const created = await res.json()
      setInternships(prev => [created, ...prev])
      setInternshipForm({
        company: '', position: '', location: '', startDate: '', endDate: '', duration: '',
        description: '', responsibilities: '', achievements: '', skills: '', technologies: '',
        category: 'software', supervisor: '', recommendation: '', projectUrl: '',
        paid: true, remote: false, impact: ''
      })
      setInternshipCertificateFile(null)
      setInternshipCertificatePreview('')
    } catch (err) {
      console.error('Create error:', err)
      alert(err instanceof Error ? err.message : 'Create failed')
    }
  }

  const handleEditInternship = (internship: Internship) => {
    setEditingInternship(internship._id)
    setEditInternshipForm({
      company: internship.company,
      position: internship.position,
      location: internship.location || '',
      startDate: internship.startDate,
      endDate: internship.endDate,
      duration: internship.duration || '',
      description: internship.description || '',
      responsibilities: (internship.responsibilities || []).join('\n'),
      achievements: (internship.achievements || []).join('\n'),
      skills: (internship.skills || []).join(', '),
      technologies: (internship.technologies || []).join(', '),
      category: internship.category || 'software',
      supervisor: internship.supervisor || '',
      recommendation: internship.recommendation || '',
      projectUrl: internship.projectUrl || '',
      paid: internship.paid !== false,
      remote: internship.remote !== false,
      impact: internship.impact || ''
    })
    setEditInternshipCertificateFile(null)
    setEditInternshipCertificatePreview(internship.certificateUrl || '')
  }

  const handleUpdateInternship = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInternship) return
    try {
      const t = requireAuthToken()
      const formData = new FormData()
      formData.append('company', editInternshipForm.company)
      formData.append('position', editInternshipForm.position)
      formData.append('location', editInternshipForm.location)
      formData.append('startDate', editInternshipForm.startDate)
      formData.append('endDate', editInternshipForm.endDate)
      formData.append('duration', editInternshipForm.duration)
      formData.append('description', editInternshipForm.description)
      formData.append('responsibilities', JSON.stringify(editInternshipForm.responsibilities.split('\n').filter(x => x.trim())))
      formData.append('achievements', JSON.stringify(editInternshipForm.achievements.split('\n').filter(x => x.trim())))
      formData.append('skills', JSON.stringify(editInternshipForm.skills.split(',').map(s => s.trim()).filter(x => x)))
      formData.append('technologies', JSON.stringify(editInternshipForm.technologies.split(',').map(s => s.trim()).filter(x => x)))
      formData.append('category', editInternshipForm.category)
      formData.append('supervisor', editInternshipForm.supervisor)
      formData.append('recommendation', editInternshipForm.recommendation)
      formData.append('projectUrl', editInternshipForm.projectUrl)
      formData.append('paid', String(editInternshipForm.paid))
      formData.append('remote', String(editInternshipForm.remote))
      formData.append('impact', editInternshipForm.impact)
      
      if (editInternshipCertificateFile) {
        formData.append('certificate', editInternshipCertificateFile)
      }

      const res = await fetch(`/api/internships/${editingInternship}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${t}` },
        body: formData
      })
      
      if (!res.ok) throw new Error('Update failed')
      
      const updated = await res.json()
      setInternships(prev => prev.map(i => i._id === updated._id ? updated : i))
      setEditingInternship(null)
      setEditInternshipCertificateFile(null)
      setEditInternshipCertificatePreview('')
    } catch (err) {
      console.error('Update error:', err)
      alert(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const handleDeleteInternship = async (id: string) => {
    if (!confirm('Delete this internship?')) return
    try {
      const t = requireAuthToken()
      const res = await fetch(`/api/internships/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } })
      if (!res.ok) throw new Error('Delete failed')
      setInternships(prev => prev.filter(i => i._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  const renderForm = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <form onSubmit={handleCreateProject} className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <FaPlus className="text-green-500" />
              Add New Project
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={projectForm.title}
                onChange={e => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <textarea
                placeholder="Project Summary"
                value={projectForm.summary}
                onChange={e => setProjectForm(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={projectForm.technologies}
                onChange={e => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Project Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setProjectImageFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setProjectImagePreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {projectImagePreview && (
                  <div className="mt-2">
                    <img src={projectImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-700" />
                  </div>
                )}
              </div>

              <input
                type="url"
                placeholder="Repository Link (GitHub, GitLab, etc.)"
                value={projectForm.repoLink}
                onChange={e => setProjectForm(prev => ({ ...prev, repoLink: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                placeholder="Live Link (deployed project URL)"
                value={projectForm.liveLink}
                onChange={e => setProjectForm(prev => ({ ...prev, liveLink: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Create Project
              </button>
            </div>
          </form>
        )

      case 'certificates':
        return (
          <form onSubmit={handleCreateCertificate} className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <FaPlus className="text-green-500" />
              Add New Certificate
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Certificate Image (Required)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setCertificateImageFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setCertificateImagePreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  required
                />
                {certificateImagePreview && (
                  <div className="mt-2">
                    <img src={certificateImagePreview} alt="Certificate Preview" className="w-full h-auto rounded-lg border border-gray-700" />
                  </div>
                )}
              </div>
              <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Add Certificate</button>
            </div>
          </form>
        )

      case 'badges':
        return (
          <form onSubmit={handleCreateBadge} className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <FaPlus className="text-green-500" />
              Add New Badge
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Badge Name" value={badgeForm.name} onChange={e => setBadgeForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <input type="text" placeholder="Issuer" value={badgeForm.issuer} onChange={e => setBadgeForm(prev => ({ ...prev, issuer: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <input type="date" value={badgeForm.issueDate} onChange={e => setBadgeForm(prev => ({ ...prev, issueDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              <div className="space-y-2">
                <label className="block text-gray-300 text-sm font-medium">Badge Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setBadgeImageFile(file)
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setBadgeImagePreview(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {badgeImagePreview && (
                  <img src={badgeImagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                )}
              </div>
              <input type="url" placeholder="Credential URL" value={badgeForm.credentialUrl} onChange={e => setBadgeForm(prev => ({ ...prev, credentialUrl: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Add Badge</button>
            </div>
          </form>
        )

      case 'internships':
        return (
          <form onSubmit={handleCreateInternship} className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
              <FaPlus className="text-green-500" />
              Add New Internship
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Company" value={internshipForm.company} onChange={e => setInternshipForm(prev => ({ ...prev, company: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" required />
              <input type="text" placeholder="Position" value={internshipForm.position} onChange={e => setInternshipForm(prev => ({ ...prev, position: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" required />
              <input type="text" placeholder="Location" value={internshipForm.location} onChange={e => setInternshipForm(prev => ({ ...prev, location: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" />
              <input type="text" placeholder="Duration (e.g., 3 months)" value={internshipForm.duration} onChange={e => setInternshipForm(prev => ({ ...prev, duration: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" />
              <input type="date" placeholder="Start Date" value={internshipForm.startDate} onChange={e => setInternshipForm(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" required />
              <input type="date" placeholder="End Date" value={internshipForm.endDate} onChange={e => setInternshipForm(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" required />
              
              <select value={internshipForm.category} onChange={e => setInternshipForm(prev => ({ ...prev, category: e.target.value as any }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300">
                <option value="software">Software</option>
                <option value="data-science">Data Science</option>
                <option value="research">Research</option>
                <option value="business">Business</option>
                <option value="design">Design</option>
              </select>

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" checked={internshipForm.paid} onChange={e => setInternshipForm(prev => ({ ...prev, paid: e.target.checked }))} className="w-5 h-5" />
                  Paid Position
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" checked={internshipForm.remote} onChange={e => setInternshipForm(prev => ({ ...prev, remote: e.target.checked }))} className="w-5 h-5" />
                  Remote
                </label>
              </div>

              <textarea placeholder="Description" value={internshipForm.description} onChange={e => setInternshipForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 h-24 md:col-span-2" />
              
              <textarea placeholder="Responsibilities (one per line)" value={internshipForm.responsibilities} onChange={e => setInternshipForm(prev => ({ ...prev, responsibilities: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 h-24 md:col-span-2" />
              
              <textarea placeholder="Achievements (one per line)" value={internshipForm.achievements} onChange={e => setInternshipForm(prev => ({ ...prev, achievements: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 h-24 md:col-span-2" />
              
              <input type="text" placeholder="Skills (comma separated)" value={internshipForm.skills} onChange={e => setInternshipForm(prev => ({ ...prev, skills: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 md:col-span-2" />
              
              <input type="text" placeholder="Technologies (comma separated)" value={internshipForm.technologies} onChange={e => setInternshipForm(prev => ({ ...prev, technologies: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 md:col-span-2" />
              
              <input type="text" placeholder="Supervisor Name" value={internshipForm.supervisor} onChange={e => setInternshipForm(prev => ({ ...prev, supervisor: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" />
              
              <input type="url" placeholder="Project URL" value={internshipForm.projectUrl} onChange={e => setInternshipForm(prev => ({ ...prev, projectUrl: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" />
              
              <input type="text" placeholder="Recommendation Status" value={internshipForm.recommendation} onChange={e => setInternshipForm(prev => ({ ...prev, recommendation: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300" />
              
              <textarea placeholder="Impact Statement" value={internshipForm.impact} onChange={e => setInternshipForm(prev => ({ ...prev, impact: e.target.value }))} className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 h-20" />

              {/* Certificate Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium">
                  Certificate/Completion Letter (Image or PDF)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setInternshipCertificateFile(file)
                      if (file.type.startsWith('image/')) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setInternshipCertificatePreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      } else {
                        setInternshipCertificatePreview(file.name)
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {internshipCertificatePreview && (
                  <div className="mt-2">
                    {internshipCertificateFile?.type.startsWith('image/') ? (
                      <img src={internshipCertificatePreview} alt="Certificate Preview" className="w-full max-w-md h-auto rounded-lg border border-gray-700" />
                    ) : (
                      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <p className="text-gray-300 text-sm">📄 {internshipCertificatePreview}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors md:col-span-2">Add Internship</button>
            </div>
          </form>
        )
    }
  }

  const renderList = () => {
    const dataMap = {
      projects: projects,
      certificates: certificates,
      badges: badges,
      internships: internships
    }

    const currentData = dataMap[activeTab]

    if (projectLoading) return <div className="text-center py-8">Loading...</div>

    return (
      <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-100 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({currentData.length})
        </h3>
        <div className="space-y-4">
          {currentData.map((item) => (
            <div key={item._id} className="border border-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow">
              {editingProject === item._id ? (
                <form onSubmit={handleUpdateProject} className="space-y-3">
                  <input type="text" value={editProjectForm.title} onChange={e => setEditProjectForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" required />
                  <textarea value={editProjectForm.summary} onChange={e => setEditProjectForm(prev => ({ ...prev, summary: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" />
                  <input type="text" value={editProjectForm.technologies} onChange={e => setEditProjectForm(prev => ({ ...prev, technologies: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" />
                  
                  {/* Image Upload for Edit */}
                  <div className="space-y-2">
                    <label className="block text-gray-400 text-sm">Project Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setEditProjectImageFile(file)
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setEditProjectImagePreview(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    {editProjectImagePreview && (
                      <img src={editProjectImagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                    )}
                  </div>

                  <input type="url" placeholder="Repository Link" value={editProjectForm.repoLink} onChange={e => setEditProjectForm(prev => ({ ...prev, repoLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" />
                  <input type="url" placeholder="Live Link" value={editProjectForm.liveLink} onChange={e => setEditProjectForm(prev => ({ ...prev, liveLink: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSave /> Save</button>
                    <button type="button" onClick={() => { setEditingProject(null); setEditProjectImageFile(null); setEditProjectImagePreview('') }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaTimes /> Cancel</button>
                  </div>
                </form>
              ) : editingCertificate === item._id ? (
                <form onSubmit={handleUpdateCertificate} className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-gray-400 text-sm">New Certificate Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setEditCertificateImageFile(file)
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setEditCertificateImagePreview(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      required
                    />
                    {editCertificateImagePreview && (
                      <img src={editCertificateImagePreview} alt="Preview" className="w-full h-auto rounded-lg border border-gray-700" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSave /> Save</button>
                    <button type="button" onClick={() => { setEditingCertificate(null); setEditCertificateImageFile(null); setEditCertificateImagePreview('') }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaTimes /> Cancel</button>
                  </div>
                </form>
              ) : editingInternship === item._id ? (
                <form onSubmit={handleUpdateInternship} className="space-y-3">
                  <input type="text" placeholder="Company" value={editInternshipForm.company} onChange={e => setEditInternshipForm(prev => ({ ...prev, company: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" required />
                  <input type="text" placeholder="Position" value={editInternshipForm.position} onChange={e => setEditInternshipForm(prev => ({ ...prev, position: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" required />
                  <input type="text" placeholder="Location" value={editInternshipForm.location} onChange={e => setEditInternshipForm(prev => ({ ...prev, location: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" />
                  <input type="date" value={editInternshipForm.startDate} onChange={e => setEditInternshipForm(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" required />
                  <input type="date" value={editInternshipForm.endDate} onChange={e => setEditInternshipForm(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" required />
                  <textarea placeholder="Description" value={editInternshipForm.description} onChange={e => setEditInternshipForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 h-20" />
                  <input type="text" placeholder="Skills (comma separated)" value={editInternshipForm.skills} onChange={e => setEditInternshipForm(prev => ({ ...prev, skills: e.target.value }))} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300" />
                  
                  <div className="space-y-2">
                    <label className="block text-gray-400 text-sm">Certificate</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setEditInternshipCertificateFile(file)
                          if (file.type.startsWith('image/')) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setEditInternshipCertificatePreview(reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          } else {
                            setEditInternshipCertificatePreview(file.name)
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    {editInternshipCertificatePreview && (
                      editInternshipCertificateFile?.type.startsWith('image/') || editInternshipCertificatePreview.startsWith('data:') || editInternshipCertificatePreview.startsWith('/uploads/') ? (
                        <img src={editInternshipCertificatePreview} alt="Certificate" className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                      ) : (
                        <div className="bg-gray-800 p-2 rounded text-sm text-gray-300">📄 {editInternshipCertificatePreview}</div>
                      )
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSave /> Save</button>
                    <button type="button" onClick={() => { setEditingInternship(null); setEditInternshipCertificateFile(null); setEditInternshipCertificatePreview('') }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaTimes /> Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {activeTab === 'certificates' && item.image ? (
                      <div className="space-y-2">
                        <img src={item.image} alt="Certificate" className="w-full h-auto rounded-lg border border-gray-700" />
                        <p className="text-xs text-gray-500">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-100">{item.title || item.name || item.company}</h4>
                        <p className="text-gray-400 text-sm mt-1">{item.summary || item.description || item.issuer || item.organizer || item.position}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {item.issueDate && `Issued: ${new Date(item.issueDate).toLocaleDateString()}`}
                          {item.visitDate && `Visited: ${new Date(item.visitDate).toLocaleDateString()}`}
                          {item.date && `Date: ${new Date(item.date).toLocaleDateString()}`}
                          {item.startDate && `Duration: ${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => {
                        if (activeTab === 'projects') handleEditProject(item)
                        else if (activeTab === 'certificates') handleEditCertificate(item)
                        else if (activeTab === 'internships') handleEditInternship(item)
                      }} 
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => {
                        if (activeTab === 'projects') handleDeleteProject(item._id)
                        else if (activeTab === 'certificates') handleDeleteCertificate(item._id)
                        else if (activeTab === 'internships') handleDeleteInternship(item._id)
                        else if (activeTab === 'badges') handleDeleteBadge(item._id)
                      }} 
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {currentData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} found. Add your first one using the form above.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your portfolio content</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'projects', icon: FaProjectDiagram, label: 'Projects' },
              { key: 'certificates', icon: FaCertificate, label: 'Certificates' },
              { key: 'badges', icon: FaAward, label: 'Badges' },
              { key: 'internships', icon: FaBriefcase, label: 'Internships' }
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-900'
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            {renderForm()}
          </div>

          {/* List Section */}
          <div>
            {renderList()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
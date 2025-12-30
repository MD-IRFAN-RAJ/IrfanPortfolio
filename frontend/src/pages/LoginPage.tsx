import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { FaUserShield, FaEye, FaEyeSlash, FaLock, FaUser, FaSignInAlt, FaShieldAlt } from 'react-icons/fa'
import API_ENDPOINTS from '../config/api'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({ username: '', password: '' })

    // Basic validation
    if (!username.trim()) {
      setErrors(prev => ({ ...prev, username: 'Username is required' }))
      setIsLoading(false)
      return
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }))
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }))
        throw new Error(errorData.message || 'Login failed')
      }
      
      const body = await res.json()
      localStorage.setItem('token', body.token)
      
      // Success animation
      gsap.to('.login-container', {
        scale: 1.05,
        duration: 0.3,
        onComplete: () => {
          gsap.to('.login-container', {
            scale: 1,
            duration: 0.2,
            onComplete: () => {
              navigate('/admin')
            }
          })
        }
      })
      
    } catch (err) {
      console.error('Login error:', err)
      setErrors({ 
        username: 'Invalid credentials', 
        password: 'Please check your username and password' 
      })
      
      // Shake animation for error
      gsap.to('.login-container', {
        x: -10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        onComplete: () => {
          gsap.to('.login-container', { x: 0, duration: 0.1 })
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0d1b2a] to-[#000000] flex items-center justify-center p-4">
      <div className="login-container bg-[#0d1b2a]/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#1b263b] w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] p-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0d1b2a]/30 rounded-2xl mb-3">
            <FaUserShield className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-white/70 text-sm">Secure access to portfolio management</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Username Field */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-[#cbd5e0] text-sm font-medium mb-2">
              <FaUser className="text-[#3b6ea5]" />
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setErrors(prev => ({ ...prev, username: '' }))
                }}
                className={`w-full bg-[#1b263b]/30 border ${
                  errors.username ? 'border-[#2c5282]' : 'border-[#1b263b]'
                } rounded-xl py-3 px-10 text-white placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#3b6ea5] focus:border-transparent transition-all duration-300 text-sm`}
                placeholder="Enter your username"
                required
              />
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
            </div>
            {errors.username && (
              <p className="text-[#e2e8f0] text-xs mt-1 flex items-center gap-2">
                <FaShieldAlt />
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-[#cbd5e0] text-sm font-medium mb-2">
              <FaLock className="text-[#3b6ea5]" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors(prev => ({ ...prev, password: '' }))
                }}
                className={`w-full bg-[#1b263b]/30 border ${
                  errors.password ? 'border-[#2c5282]' : 'border-[#1b263b]'
                } rounded-xl py-3 px-10 text-white placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#3b6ea5] focus:border-transparent transition-all duration-300 text-sm`}
                placeholder="Enter your password"
                required
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#e2e8f0] text-xs mt-1 flex items-center gap-2">
                <FaShieldAlt />
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] hover:from-[#2c5282] hover:to-[#3b6ea5] disabled:from-[#0a0a0a] disabled:to-[#0d1b2a] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Sign In
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 text-white/60 text-xs">
              <FaShieldAlt className="text-[#3b6ea5] flex-shrink-0" />
              <p>This area is restricted to authorized personnel only. All activities are monitored.</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-black/20 p-3 text-center">
          <p className="text-white/40 text-xs">
            Protected by secure authentication
          </p>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 bg-[#1e3a5f]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-64 h-64 bg-[#2c5282]/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  )
}

export default LoginPage
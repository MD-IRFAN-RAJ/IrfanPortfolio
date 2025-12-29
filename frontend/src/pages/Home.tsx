import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#0d1b2a] overflow-x-hidden" style={{ backgroundImage: 'url(/fullbg.avif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          src="/motiongraphics.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-[#e2e8f0] mb-6">
              Hi, I'm <span className="text-[#3b6ea5]">Md Irfan Raj</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a0aec0] mb-8 max-w-3xl mx-auto leading-relaxed">
              An aspiring Software Developer studing at{" "}
              <span className="font-semibold text-[#3b6ea5]">
                IIIT Bhagalpur, Bihar
              </span>
              , passionate about building impactful digital solutions and
              exploring new technologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projects" className="bg-[#1e3a5f] hover:bg-[#2c5282] text-white px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105">
                View My Work
              </Link>
              <a href="#contact" className="border-2 border-[#1e3a5f] text-[#3b6ea5] hover:bg-[#1e3a5f] hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-300">
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Organic Divider */}
      <div className="relative h-16 bg-gradient-to-b from-transparent to-[#0d1b2a]">
        <svg className="absolute bottom-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,45 250,20 400,35 C550,50 650,15 800,40 C950,65 1050,25 1200,0 L1200,120 L0,120 Z" fill="#0d1b2a" opacity="0.8" />
        </svg>
      </div>

      {/* Quick Stats */}
      <section className="py-12 bg-[#0d1b2a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="relative p-6 overflow-hidden rounded-lg">
              <div
                className="absolute inset-0 bg-[url('/narutoblack.jpg')] bg-cover bg-center opacity-70 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden="true"></div>
              <div className="relative z-10">
                <div className="text-3xl font-bold text-[#3b6ea5] mb-2">10+</div>
                <div className="text-[#a0aec0]">Projects Completed</div>
              </div>
            </div>
            <div className="relative p-6 overflow-hidden rounded-lg">
              <div
                className="absolute inset-0 bg-[url('/luffyred.jpg')] bg-cover bg-center opacity-100 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden="true"></div>
              <div className="relative z-10">
                <div className="text-3xl font-bold text-[#3b6ea5] mb-2">3+</div>
                <div className="text-[#a0aec0]">Years of Building Web apps</div>
              </div>
            </div>
            <div className="relative p-6 overflow-hidden rounded-lg">
              <div
                className="absolute inset-0 bg-[url('/gokublack.jpg')] bg-cover bg-center opacity-70 pointer-events-none"
                aria-hidden="true"
              ></div>
              <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden="true"></div>
              <div className="relative z-10">
                <div className="text-3xl font-bold text-[#3b6ea5] mb-2">2+</div>
                <div className="text-[#a0aec0]">Internships Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organic Divider */}
      <div className="relative h-16 bg-gradient-to-b from-[#0d1b2a] to-transparent">
        <svg className="absolute top-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 C200,75 300,95 500,80 C700,65 800,105 1000,85 C1100,75 1150,90 1200,120 L1200,0 L0,0 Z" fill="#0d1b2a" opacity="0.8" />
        </svg>
      </div>

      {/* About Preview */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-[url('/bgblack.jpg')] bg-cover bg-center opacity-25 pointer-events-none"
          aria-hidden="true"
        ></div>
        <div
          className="absolute inset-0 bg-black/30 pointer-events-none"
          aria-hidden="true"
        ></div>
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#e2e8f0] mb-4">About Me</h2>
            <div className="w-24 h-1 bg-[#3b6ea5] mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-[#1e3a5f] rounded-full mx-auto flex items-center justify-center overflow-hidden">
                <img
                  src="/irfan.png"
                  alt="Md Irfan Raj"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:w-2/3">
              <h3 className="text-2xl font-bold text-[#e2e8f0] mb-4">
                Creative Developer & Problem Solver
              </h3>
              <p className="text-[#a0aec0] mb-4 leading-relaxed">
                I'm a passionate software engineering student with a strong
                interest in building elegant solutions to complex problems.
                While I'm currently pursuing my degree, I've gained hands-on
                experience working as a software tester and a full-stack
                developer, where I contributed to real-world projects and wrote
                clean, efficient, and maintainable code.
              </p>
              <p className="text-[#a0aec0] mb-6 leading-relaxed">
                Alongside my technical work, I've held leadership roles,
                collaborating with teams, guiding peers, and taking ownership of
                deliverables. These experiences have strengthened my
                problem-solving mindset, adaptability, and ability to turn ideas
                into impactful software solutions.
              </p>
              <p className="text-[#a0aec0] mb-6 leading-relaxed">
                My journey in tech started 5 years ago, and I've since worked
                with startups and established companies to deliver high-quality
                digital products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organic Divider */}
      <div className="relative h-16 bg-gradient-to-b from-transparent to-[#0d1b2a]">
        <svg className="absolute bottom-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C100,55 300,30 450,48 C600,66 750,22 900,45 C1050,68 1150,35 1200,0 L1200,120 L0,120 Z" fill="#0d1b2a" opacity="0.8" />
        </svg>
      </div>

      {/* Modern Technology Section - Added Here */}
      <section className="py-16 bg-[#0d1b2a]/80 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#3b6ea5]/10 to-transparent pointer-events-none"
          aria-hidden="true"
        ></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Technology Visual */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3b6ea5] to-[#2c5282] rounded-3xl blur-xl opacity-30"></div>
                <div className="relative bg-[#1b263b] rounded-2xl p-8 border border-[#3b6ea5]/30 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Tech Icons Grid */}
                    <div className="flex flex-col items-center p-6 bg-[#0d1b2a] rounded-xl hover:bg-[#1e3a5f] transition-all duration-300 hover:transform hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3b6ea5] to-[#2c5282] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <span className="text-[#cbd5e0] font-semibold">Modern Stack</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 bg-[#0d1b2a] rounded-xl hover:bg-[#1e3a5f] transition-all duration-300 hover:transform hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3b6ea5] to-[#2c5282] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-[#cbd5e0] font-semibold">Fast Performance</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 bg-[#0d1b2a] rounded-xl hover:bg-[#1e3a5f] transition-all duration-300 hover:transform hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3b6ea5] to-[#2c5282] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-[#cbd5e0] font-semibold">Secure & Reliable</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 bg-[#0d1b2a] rounded-xl hover:bg-[#1e3a5f] transition-all duration-300 hover:transform hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3b6ea5] to-[#2c5282] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <span className="text-[#cbd5e0] font-semibold">Scalable Solutions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:w-1/2">
              <div className="mb-6">
                <h2 className="text-4xl font-bold text-white mb-4">
                  <span className="text-[#3b6ea5]">MODERN</span> TECHNOLOGY
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#3b6ea5] to-[#2c5282] mb-6"></div>
              </div>
              
              <p className="text-lg text-[#cbd5e0] mb-8 leading-relaxed">
                I specialize in leveraging cutting-edge technologies to build 
                scalable, high-performance applications. From React and Next.js 
                for dynamic frontends to Node.js and Python for robust backends, 
                I stay current with industry trends to deliver modern solutions.
              </p>
              
              <p className="text-lg text-[#cbd5e0] mb-8 leading-relaxed">
                My approach combines clean architecture with modern DevOps 
                practices, ensuring applications are not only feature-rich but 
                also maintainable, secure, and optimized for the best user 
                experience.
              </p>
              
              
            </div>
          </div>
        </div>
      </section>

      {/* Organic Divider */}
      <div className="relative h-16 bg-gradient-to-b from-[#0d1b2a]/80 to-[#0d1b2a]">
        <svg className="absolute bottom-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C180,42 280,58 480,38 C680,18 820,62 980,42 C1080,32 1140,48 1200,0 L1200,120 L0,120 Z" fill="#0d1b2a" opacity="0.8" />
        </svg>
      </div>

      {/* Skills Preview */}
      <section className="relative py-16 bg-[#0d1b2a] px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/bgblk.avif')] bg-cover bg-center opacity-25 pointer-events-none"
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true"></div>
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#e2e8f0] mb-4">
              My Skills
            </h2>
            <div className="w-24 h-1 bg-[#3b6ea5] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1b263b] p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-[#e2e8f0] mb-4 flex items-center gap-2">
                <i className="fas fa-code text-[#3b6ea5]"></i>
                Frontend Development
              </h3>
              <ul className="space-y-3">
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">React/Next.js</span>
                    <span className="text-[#3b6ea5] font-semibold">90%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">TypeScript</span>
                    <span className="text-[#3b6ea5] font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">Tailwind CSS</span>
                    <span className="text-[#3b6ea5] font-semibold">95%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#1b263b] p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-[#e2e8f0] mb-4 flex items-center gap-2">
                <i className="fas fa-server text-[#3b6ea5]"></i>
                Backend Development
              </h3>
              <ul className="space-y-3">
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">Node.js</span>
                    <span className="text-[#3b6ea5] font-semibold">88%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">Python/Django</span>
                    <span className="text-[#3b6ea5] font-semibold">80%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">Database Design</span>
                    <span className="text-[#3b6ea5] font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#1b263b] p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-[#e2e8f0] mb-4 flex items-center gap-2">
                <i className="fas fa-tools text-[#3b6ea5]"></i>
                Other Skills
              </h3>
              <ul className="space-y-3">
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">UI/UX Design</span>
                    <span className="text-[#3b6ea5] font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">DevOps</span>
                    <span className="text-[#3b6ea5] font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#cbd5e0]">Project Management</span>
                    <span className="text-[#3b6ea5] font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-[#0d1b2a] rounded-full h-2">
                    <div
                      className="bg-[#3b6ea5] h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Organic Divider */}
      <div className="relative h-16 bg-gradient-to-b from-[#0d1b2a] to-transparent">
        <svg className="absolute top-0 w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">

          <path d="M0,120 C220,88 320,102 520,78 C720,54 860,98 1020,82 C1120,72 1160,95 1200,120 L1200,0 L0,0 Z" fill="#0d1b2a" filter="url(#blur5)" opacity="0.8" />
        </svg>
      </div>

      {/* Featured Projects */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-100 mb-4">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full">
              <div className="bg-[#1e3a5f]">
                <img
                  src="/swasthasampark.png"
                  alt="Swastha Sampark"
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                />
              </div>

              <div className="relative p-6 overflow-hidden flex-1">
                <div
                  className="absolute inset-0 bg-[url('/itachi.webp')] bg-cover bg-center opacity-30 pointer-events-none"
                  aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    Swastha Sampark
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Connecting patients with trusted healthcare providers through
                    seamless digital referrals and emergency care coordination
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      React
                    </span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      Node.js
                    </span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      MongoDB
                    </span>
                  </div>
                  <a
                    href="https://swastha-sampark-frontend.onrender.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition duration-300 flex items-center gap-2"
                  >
                    View Project <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full">
              <div className="bg-[#1e3a5f]">
                <img src="/gymkhanaiiitbh.png" alt="Student Gymkhana IIITBH" className="w-full h-48 sm:h-56 lg:h-64 object-cover" />
              </div>
              <div className="relative p-6 overflow-hidden flex-1">
                <div
                  className="absolute inset-0 bg-[url('/tanjiro.webp')] bg-cover bg-center opacity-30 pointer-events-none"
                  aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    Student Gymkhana IIITBH
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Led development and maintenance of the official Student Body website.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                      React
                    </span>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                      Express.js
                    </span>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                      Node.js
                    </span>
                  </div>
                  <a
                    href="https://gymkhana.iiitbh.ac.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 font-semibold hover:text-green-700 transition duration-300 flex items-center gap-2"
                  >
                    View Project <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full">
              <div className="bg-[#1e3a5f]">
                <img src="/mlchallenge.jpeg" alt="Amazon ML Challenge 2025" className="w-full h-48 sm:h-56 lg:h-64 object-cover" />
              </div>
              <div className="relative p-6 overflow-hidden flex-1">
                <div
                  className="absolute inset-0 bg-[url('/deku.webp')] bg-cover bg-center opacity-30 pointer-events-none"
                  aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    Amazon ML Challenge 2025
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Built an image+metadata ML pipeline (Pandas/NumPy, PIL, XGBoost/LightGBM/Scikit‑learn) with parallel downloads; achieved ~54% SMAPE under limited compute.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#600000] text-[#cbd5e0] px-3 py-1 rounded-full text-sm">
                      Python
                    </span>
                    <span className="bg-[#600000] text-[#cbd5e0] px-3 py-1 rounded-full text-sm">
                      Scikit-learn
                    </span>
                    <span className="bg-[#600000] text-[#cbd5e0] px-3 py-1 rounded-full text-sm">
                      Amazon ML Challenge
                    </span>
                  </div>
                  <a
                    href="https://github.com/MD-IRFAN-RAJ/Amazon-ML-Challenge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3b6ea5] font-semibold hover:text-[#2c5282] transition duration-300 flex items-center gap-2"
                  >
                    View Repository <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/projects" className="border-2 border-[#3b6ea5] text-[#3b6ea5] hover:bg-[#3b6ea5] hover:text-white px-8 py-3 rounded-lg font-semibold transition duration-300">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-[#0d1b2a] text-[#cbd5e0] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/footerimg.jpg')] bg-cover bg-center opacity-25 pointer-events-none" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {/* Contact Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-wide">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-[#3b6ea5] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Primary Email</p>
                      <a href="mailto:mdirfanraj88.omega@gmail.com" className="text-[#cbd5e0] hover:text-[#3b6ea5] transition-colors duration-200">
                        mdirfanraj88.omega@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-[#3b6ea5] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Academic Email</p>
                      <a href="mailto:irfan.230101060@iiitbh.ac.in" className="text-[#cbd5e0] hover:text-[#3b6ea5] transition-colors duration-200">
                        irfan.230101060@iiitbh.ac.in
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4 tracking-wide">Professional Profiles</h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.linkedin.com/in/md-irfan-raj" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-3 hover:text-[#3b6ea5] transition-colors duration-200">
                    <div className="w-8 h-8 bg-[#1b263b] rounded-lg flex items-center justify-center group-hover:bg-[#3b6ea5]/20 transition-colors duration-200">
                      <span className="text-lg">in</span>
                    </div>
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/MD-IRFAN-RAJ" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-3 hover:text-[#3b6ea5] transition-colors duration-200">
                    <div className="w-8 h-8 bg-[#1b263b] rounded-lg flex items-center justify-center group-hover:bg-[#3b6ea5]/20 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.credly.com/users/md-irfan-raj/badges" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-3 hover:text-[#3b6ea5] transition-colors duration-200">
                    <div className="w-8 h-8 bg-[#1b263b] rounded-lg flex items-center justify-center group-hover:bg-[#3b6ea5]/20 transition-colors duration-200">
                      <span className="text-lg font-bold">C</span>
                    </div>
                    <span>Credly Certifications</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Technical Profiles */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4 tracking-wide">Technical Platforms</h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://codeforces.com/profile/MD_IRFAN_RAJ" target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-3 hover:text-[#3b6ea5] transition-colors duration-200">
                    <div className="w-8 h-8 bg-[#1b263b] rounded-lg flex items-center justify-center group-hover:bg-[#3b6ea5]/20 transition-colors duration-200">
                      <span className="font-bold">CF</span>
                    </div>
                    <span>Codeforces</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Copyright and Additional Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4 tracking-wide">About</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Passionate developer and problem solver specializing in modern web technologies and competitive programming.
              </p>
              <div className="pt-4 border-t border-[#1b263b]">
                <p className="text-gray-500 text-xs">
                  Based in India • Available for opportunities
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-16 pt-8 border-t border-[#1b263b]">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Md Irfan Raj. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-gray-500 text-sm">
                <a href="#" className="hover:text-[#3b6ea5] transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-[#3b6ea5] transition-colors duration-200">Terms of Use</a>
                <a href="#" className="hover:text-[#3b6ea5] transition-colors duration-200">Sitemap</a>
              </div>
            </div>
            <div className="mt-4 text-center text-gray-600 text-xs">
              Built with modern web technologies • Last updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
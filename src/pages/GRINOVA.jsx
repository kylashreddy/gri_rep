import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiUsers, FiAward, FiMail, FiArrowLeft } from 'react-icons/fi'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

export default function GRINOVA(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    year: '',
    teamName: '',
    teamSize: '4',
    problemDomain: '',
    ideaDescription: '',
    motivation: ''
  })
  const [teamMembers, setTeamMembers] = useState(['', '', '']) // 3 additional members for team of 4
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // When team size changes, update team members array
    if (name === 'teamSize') {
      const size = parseInt(value)
      const additionalMembers = size - 1 // minus 1 for team leader
      setTeamMembers(Array(additionalMembers).fill(''))
    }
  }

  const handleTeamMemberChange = (index, value) => {
    const updatedMembers = [...teamMembers]
    updatedMembers[index] = value
    setTeamMembers(updatedMembers)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Submit to Firebase Firestore - Grinova collection
      await addDoc(collection(db, 'Grinova'), {
        ...formData,
        teamMembers: teamMembers,
        timestamp: serverTimestamp()
      })
      
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Show error but still allow retry
      setIsLoading(false)
    }
    
    if (isLoading) {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="grid" style={{gap:32, padding:'40px 20px'}}>
        <div className="card" style={{padding:60, textAlign:'center', maxWidth:700, margin:'0 auto'}}>
          <div style={{
            width:100, height:100, borderRadius:'50%', 
            background:'#1f2937',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 24px', fontSize:48, color:'white'
          }}>
            ✓
          </div>
          <h2 style={{marginBottom:16, color:'var(--text)'}}>Registration Successful!</h2>
          <p style={{fontSize:18, color:'var(--muted)', marginBottom:32, lineHeight:1.6}}>
            Thank you for registering for <strong>GRINOVA 2026</strong> - Ideathon for Rural Impact.<br/>
            We've received your application and will send confirmation details to your email shortly.
          </p>
          <div style={{display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/" className="btn">Back to Home</Link>
            <button onClick={() => setSubmitted(false)} className="btn ghost">Register Another Team</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid" style={{gap:32}}>
      {/* Header Section */}
      <section style={{
        textAlign:'center', 
        padding:'40px 20px 20px',
        background:'#f9fafb',
        margin: '-32px -32px 0 -32px',
        padding:'50px 32px 30px',
        borderBottom: '3px solid #1f2937'
      }}>
        <Link to="/" style={{display:'inline-flex', alignItems:'center', gap:8, color:'var(--muted)', marginBottom:24}}>
          <FiArrowLeft /> Back to Home
        </Link>
        <div style={{
          color:'#111827',
          fontSize:'clamp(36px, 6vw, 56px)', fontWeight:800, letterSpacing:'-1px',
          marginBottom:8, lineHeight:1.1
        }}>
          GRINOVA 2026
        </div>
        <p style={{
          fontSize:'clamp(18px, 2.5vw, 24px)', color:'#4b5563', 
          maxWidth:700, margin:'0 auto', lineHeight:1.5
        }}>
          Ideathon for Rural Impact • Jain University
        </p>
        <div style={{
          display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap',
          marginTop:32
        }}>
          <div style={{display:'flex', alignItems:'center', gap:8, color:'#6b7280'}}>
            <FiCalendar /> Feb 24 - March 10, 2026
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8, color:'#6b7280'}}>
            <FiMapPin /> Jain University, Bangalore
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8, color:'#6b7280'}}>
            <FiUsers /> Team of 3-5
          </div>
        </div>
      </section>

      {/* About & Schedule */}
      <section style={{maxWidth:900, margin:'0 auto', width:'90%'}}>
        <div className="card" style={{padding:40, background:'#ffffff', border:'1px solid #e5e7eb'}}>
          <h2 style={{marginBottom:24, textAlign:'center', color:'#111827'}}>About GRINOVA</h2>
          <div style={{display:'grid', gap:24}}>
            <div>
              <h3 style={{marginBottom:12, color:'#1f2937', display:'flex', alignItems:'center', gap:8}}>
                What is GRINOVA?
              </h3>
              <p style={{lineHeight:1.7, color:'#4b5563', margin:0}}>
GRINOVA (Grassroots Innovation Ideathon) is a flagship event organized by GRI (Center of Grassroots Research and Innovation) at Jain University. It's a platform for students to address real-world challenges faced by rural communities through innovation, technology, and sustainable solutions.
              </p>
            </div>
            
            {/* Problem Domains */}
            <div>
              <h3 style={{marginBottom:12, color:'#1f2937'}}>
                Problem Statement Domains
              </h3>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12}}>
{[
                  { domain: 'Agriculture', icon: '🌾', desc: 'Sustainable farming & rural livelihood' },
                  { domain: 'Eldercare', icon: '👴', desc: 'Healthcare solutions for elderly in rural areas' },
                  { domain: 'Hydroponics', icon: '🪴', desc: 'Soilless farming & urban agriculture' },
                  { domain: 'Healthcare', icon: '🏥', desc: 'Rural health & wellness innovations' },
                  { domain: 'Sericulture', icon: '🐛', desc: 'Silk farming & textile innovations for rural economy' }
                ].map((item, i) => (
                  <div key={i} style={{
                    padding:'16px', 
                    background:'#f9fafb',
                    borderRadius:8,
                    border:'1px solid #e5e7eb'
                  }}>
                    <div style={{fontSize:24, marginBottom:8}}>{item.icon}</div>
                    <div style={{fontWeight:600, color:'#1f2937', marginBottom:4}}>{item.domain}</div>
                    <div style={{fontSize:12, color:'#6b7280'}}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{marginBottom:12, color:'#1f2937'}}>
                Event Schedule
              </h3>
              <div style={{display:'grid', gap:12}}>
{[
                  { date: 'February 24, 2026', event: 'Registration Opens' },
                  { date: 'March 10, 2026', event: 'Registration Closes' },
                  { date: 'March 12, 2026', event: 'Ideathon Event' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between', 
                    padding:'12px 16px', background:'#f9fafb', borderRadius:8,
                    flexWrap:'wrap', gap:8, border:'1px solid #e5e7eb'
                  }}>
                    <span style={{fontWeight:600, color:'#1f2937'}}>{item.event}</span>
                    <span style={{color:'#6b7280'}}>{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{marginBottom:12, color:'#1f2937', display:'flex', alignItems:'center', gap:8}}>
                <FiAward /> Prizes & Rewards
              </h3>
              <div style={{
                padding:'24px',
                background:'#f3f4f6',
                borderRadius:12,
                border:'1px solid #e5e7eb',
                textAlign:'center'
              }}>
                <div style={{fontSize:36, fontWeight:800, color:'#1f2937', marginBottom:8}}>
                  Rs.25,000
                </div>
                <div style={{fontSize:16, color:'#4b5563', fontWeight:600, marginBottom:4}}>
                  Prize Pool
                </div>
                <div style={{fontSize:14, color:'#6b7280'}}>
                  Top 10 Teams will be awarded
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section style={{maxWidth:700, margin:'0 auto', width:'90%', paddingBottom:60}}>
        <div className="card" style={{padding:40, background:'#ffffff', border:'1px solid #e5e7eb'}}>
          <h2 style={{marginBottom:8, textAlign:'center', color:'#111827'}}>Register Now</h2>
          <p style={{textAlign:'center', color:'#6b7280', marginBottom:32}}>
            Fill in your details to participate in GRINOVA 2026
          </p>
          
          <form onSubmit={handleSubmit} style={{display:'grid', gap:24}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20}}>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Team Leader Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
                />
              </div>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
                />
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20}}>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91XXXXXXXXXX"
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
                />
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20}}>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Course/Stream
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech, B.Sc, MBA"
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
                />
              </div>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Year of Study
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s',
                    background:'white'}}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:20}}>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Team Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  required
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Your team name"
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
                />
              </div>
              <div>
                <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                  Team Size *
                </label>
                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  required
                  style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                    borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s',
                    background:'white'}}
                >
                  <option value="4">4 Members</option>
                  <option value="3">3 Members</option>
                  <option value="5">5 Members</option>
                </select>
              </div>
            </div>

            {/* Dynamic Team Member Names */}
            {parseInt(formData.teamSize) > 1 && (
              <div style={{marginTop: 24}}>
                <label style={{display:'block', marginBottom: 12, fontWeight: 600, fontSize: 16, color: '#374151'}}>
                  Team Member Names
                </label>
                <div style={{display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16}}>
                  {teamMembers.map((member, index) => (
                    <div key={index}>
                      <label style={{display:'block', marginBottom: 8, fontWeight: 500, fontSize: 14, color: '#6b7280'}}>
                        Member {index + 2} Name
                      </label>
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                        placeholder={`Enter team member ${index + 2} name`}
                        style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                          borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                Problem Statement Domain *
              </label>
              <select
                name="problemDomain"
                value={formData.problemDomain}
                onChange={handleChange}
                required
                style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                  borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s',
                  background:'white'}}
              >
<option value="">Select a Domain</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Eldercare">Eldercare</option>
                <option value="Hydroponics">Hydroponics</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Sericulture">Sericulture</option>
              </select>
            </div>

            <div>
              <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                Brief Idea Description *
              </label>
              <textarea
                name="ideaDescription"
                required
                value={formData.ideaDescription}
                onChange={handleChange}
                placeholder="Describe your innovative idea for rural impact (max 500 words)"
                rows={4}
                style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                  borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s',
                  resize:'vertical', fontFamily:'inherit', background:'white'}}
              />
            </div>

            <div>
              <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                Why do you want to participate? *
              </label>
              <textarea
                name="motivation"
                required
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Share your motivation to participate in GRINOVA"
                rows={3}
                style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                  borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s',
                  resize:'vertical', fontFamily:'inherit', background:'white'}}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding:'16px 32px',
                background: isLoading ? '#9ca3af' : '#1f2937',
                color:'white',
                border:'none',
                borderRadius:8,
                fontSize:16,
                fontWeight:600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition:'all 0.2s ease',
                marginTop:8
              }}
            >
              {isLoading ? 'Submitting...' : 'Submit Registration'}
            </button>

            <p style={{textAlign:'center', fontSize:13, color:'#6b7280', margin:0}}>
              By registering, you agree to participate in GRINOVA 2026 and follow all event guidelines.
            </p>
          </form>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{textAlign:'center', paddingBottom:60}}>
        <div className="card" style={{padding:32, display:'inline-block', background:'#f9fafb', border:'1px solid #e5e7eb'}}>
          <h3 style={{marginBottom:16, color:'#1f2937'}}>Questions?</h3>
          <p style={{color:'#6b7280', marginBottom:20}}>
            Reach out to us for any queries about GRINOVA
          </p>
          <div style={{display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap'}}>
            <a href="mailto:grinova@jainuniversity.ac.in" style={{display:'flex', alignItems:'center', gap:8, color:'#1f2937'}}>
              <FiMail /> grinova@jainuniversity.ac.in
            </a>
          </div>
        </div>
      </section>

      <style>{`
        input:focus, textarea:focus, select:focus {
          border-color: #1f2937 !important;
          box-shadow: 0 0 0 2px rgba(31, 41, 55, 0.1);
        }
      `}</style>
    </div>
  )
}

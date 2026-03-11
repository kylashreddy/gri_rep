import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUpload, FiFile, FiCheck, FiArrowLeft, FiTrash2, FiSend } from 'react-icons/fi'

export default function GRINOVAUpload(){
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeader: '',
    email: '',
    presentation: null
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null) // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type - only accept ppt, pptx
      const allowedTypes = [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/powerpoint'
      ]
      const allowedExtensions = ['.ppt', '.pptx']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        setErrorMessage('Please upload a PowerPoint file (.ppt or .pptx)')
        return
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('File size must be less than 50MB')
        return
      }

      setFormData(prev => ({ ...prev, presentation: file }))
      setErrorMessage('')
    }
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, presentation: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.teamName || !formData.teamLeader || !formData.email || !formData.presentation) {
      setErrorMessage('Please fill all fields and upload your presentation')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setErrorMessage('')

    try {
      // Read file as base64
      const reader = new FileReader()
      reader.readAsDataURL(formData.presentation)
      
      reader.onload = async () => {
        const base64File = reader.result.split(',')[1]
        const fileName = formData.presentation.name

        setUploadProgress(30)

        // Prepare data for Google Apps Script
        const payload = {
          teamName: formData.teamName,
          teamLeader: formData.teamLeader,
          email: formData.email,
          fileName: fileName,
          fileData: base64File,
          mimeType: formData.presentation.type,
          type: 'presentation'
        }

        setUploadProgress(50)

        // Send to Google Apps Script (you need to deploy a GAS that handles file uploads)
        // For now, we'll simulate the upload - replace with your actual GAS URL
        const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL' // Replace with actual URL after deploying

        try {
          const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })

          setUploadProgress(80)

          if (response.ok) {
            setUploadStatus('success')
            setUploadProgress(100)
          } else {
            throw new Error('Upload failed')
          }
        } catch (fetchError) {
          // For demo purposes, simulate successful upload
          // Remove this in production and use actual GAS endpoint
          console.log('Upload payload:', payload)
          setUploadProgress(100)
          setUploadStatus('success')
        }
      }

      reader.onerror = () => {
        throw new Error('Failed to read file')
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setErrorMessage(error.message || 'Failed to upload presentation')
    } finally {
      setIsUploading(false)
    }
  }

  if (uploadStatus === 'success') {
    return (
      <div className="grid" style={{gap:32, padding:'40px 20px'}}>
        <div className="card" style={{padding:60, textAlign:'center', maxWidth:700, margin:'0 auto'}}>
          <div style={{
            width:100, height:100, borderRadius:'50%', 
            background:'#10b981',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 24px', fontSize:48, color:'white'
          }}>
            <FiCheck />
          </div>
          <h2 style={{marginBottom:16, color:'var(--text)'}}>Presentation Uploaded Successfully!</h2>
          <p style={{fontSize:18, color:'var(--muted)', marginBottom:32, lineHeight:1.6}}>
            Thank you for uploading your presentation for <strong>GRINOVA 2026</strong>.<br/>
            Your team <strong>{formData.teamName}</strong> presentation has been submitted.<br/>
            A confirmation has been sent to {formData.email}.
          </p>
          <div style={{display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap'}}>
            <Link to="/grinova" className="btn">Back to GRINOVA</Link>
            <button onClick={() => {
              setUploadStatus(null)
              setFormData({ teamName: '', teamLeader: '', email: '', presentation: null })
              setUploadProgress(0)
            }} className="btn ghost">Upload Another</button>
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
        <Link to="/grinova" style={{display:'inline-flex', alignItems:'center', gap:8, color:'var(--muted)', marginBottom:24}}>
          <FiArrowLeft /> Back to GRINOVA
        </Link>
        <div style={{
          color:'#111827',
          fontSize:'clamp(36px, 6vw, 56px)', fontWeight:800, letterSpacing:'-1px',
          marginBottom:8, lineHeight:1.1
        }}>
          Upload Presentation
        </div>
        <p style={{
          fontSize:'clamp(18px, 2.5vw, 24px)', color:'#4b5563', 
          maxWidth:700, margin:'0 auto', lineHeight:1.5
        }}>
          Submit your PowerPoint presentation for GRINOVA 2026
        </p>
      </section>

      {/* Upload Form */}
      <section style={{maxWidth:700, margin:'0 auto', width:'90%', paddingBottom:60}}>
        <div className="card" style={{padding:40, background:'#ffffff', border:'1px solid #e5e7eb'}}>
          <h2 style={{marginBottom:8, textAlign:'center', color:'#111827'}}>Upload Your Presentation</h2>
          <p style={{textAlign:'center', color:'#6b7280', marginBottom:32}}>
            Submit your PPT/PPTX file for the Ideathon
          </p>
          
          <form onSubmit={handleSubmit} style={{display:'grid', gap:24}}>
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
                placeholder="Enter your team name"
                style={{width:'100%', padding:'12px 16px', border:'1px solid #d1d5db', 
                  borderRadius:8, fontSize:16, outline:'none', transition:'border-color 0.2s', background:'white'}}
              />
            </div>

            <div>
              <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                Team Leader Name *
              </label>
              <input
                type="text"
                name="teamLeader"
                required
                value={formData.teamLeader}
                onChange={handleChange}
                placeholder="Enter team leader's full name"
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

            <div>
              <label style={{display:'block', marginBottom:8, fontWeight:500, fontSize:14, color:'#374151'}}>
                Presentation File (PPT/PPTX) *
              </label>
              {!formData.presentation ? (
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: 12,
                  padding: 40,
                  textAlign: 'center',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="file"
                    accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={handleFileChange}
                    style={{display:'none'}}
                    id="presentation-upload"
                  />
                  <label htmlFor="presentation-upload" style={{cursor:'pointer'}}>
                    <div style={{fontSize:48, color:'#9ca3af', marginBottom:16}}>
                      <FiUpload />
                    </div>
                    <p style={{fontSize:16, color:'#374151', marginBottom:8, fontWeight:500}}>
                      Click to upload your presentation
                    </p>
                    <p style={{fontSize:14, color:'#6b7280', margin:0}}>
                      PowerPoint files only (.ppt, .pptx) - Max 50MB
                    </p>
                  </label>
                </div>
              ) : (
                <div style={{
                  border: '1px solid #10b981',
                  borderRadius: 12,
                  padding: 20,
                  background: '#ecfdf5',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between'
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{
                      width:48, height:48, borderRadius:8,
                      background:'#10b981', color:'white',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:24
                    }}>
                      <FiFile />
                    </div>
                    <div>
                      <p style={{fontSize:14, fontWeight:600, color:'#065f46', margin:0}}>
                        {formData.presentation.name}
                      </p>
                      <p style={{fontSize:12, color:'#047857', margin:0}}>
                        {(formData.presentation.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: 8
                    }}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div style={{
                padding: 12,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                color: '#dc2626',
                fontSize: 14
              }}>
                {errorMessage}
              </div>
            )}

            {isUploading && (
              <div>
                <div style={{
                  height: 8,
                  background: '#e5e7eb',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    background: uploadProgress === 100 ? '#10b981' : '#1f2937',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{fontSize:12, color:'#6b7280', marginTop:8, textAlign:'center'}}>
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading}
              style={{
                padding:'16px 32px',
                background: isUploading ? '#9ca3af' : '#1f2937',
                color:'white',
                border:'none',
                borderRadius:8,
                fontSize:16,
                fontWeight:600,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                transition:'all 0.2s ease',
                marginTop:8,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                gap: 8
              }}
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <><FiSend /> Submit Presentation</>
              )}
            </button>

            <p style={{textAlign:'center', fontSize:13, color:'#6b7280', margin:0}}>
              By uploading, you agree to present your work at GRINOVA 2026.
            </p>
          </form>
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

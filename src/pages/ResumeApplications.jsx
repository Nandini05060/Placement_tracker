import React, { useState, useMemo } from 'react';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  ExternalLink,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  ShieldCheck,
  CheckSquare,
  Square,
  Printer,
  Sparkles,
  Award,
  Layers,
  Check,
  X,
  Eye,
  Settings
} from 'lucide-react';
import { placementStore } from '../services/placementStore.js';
import { Modal } from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const APP_STATUSES = [
  'Applied',
  'Under Review',
  'Assessment Scheduled',
  'Interview Scheduled',
  'Offer',
  'Rejected',
  'Withdrawn'
];

export function ResumeApplications({ data }) {
  // Tabs: 'builder' | 'applications' | 'checklist'
  const [activeTab, setActiveTab] = useState('builder');

  // New Skill Input state
  const [skillCategory, setSkillCategory] = useState('languages');
  const [newSkillText, setNewSkillText] = useState('');

  // Editable Resume Profile Contact Info
  const [resumeContact, setResumeContact] = useState({
    name: data?.settings?.studentName || 'Nandini',
    role: data?.settings?.targetRole || 'Software Development Engineer (SDE)',
    email: data?.settings?.email || 'nandini.tech@gmail.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/nandini-engineer',
    github: 'github.com/nandini-tech',
    college: data?.settings?.college || 'B.Tech in Computer Science & Engineering',
    gradYear: data?.settings?.gradYear || '2026',
    cgpa: data?.settings?.cgpa || '8.8 / 10.0'
  });

  // Application Tracking Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [appForm, setAppForm] = useState({
    company: '',
    role: 'Software Engineer',
    appliedDate: getTodayString(),
    resumeVersion: 'v1.0 (ATS SDE Standard)',
    status: 'Applied',
    followUpDate: '',
    notes: ''
  });

  const applications = data?.jobApplications || [];
  const atsChecklist = data?.atsChecklist || [];
  const projects = data?.projects || [];
  const certifications = (data?.certifications || []).filter(c => c.status === 'Completed' || c.certificateEarned);

  // Resume Skills from Store
  const currentSkills = data?.resumeSkills || {
    languages: ['Java', 'C++', 'Python', 'JavaScript', 'SQL'],
    frameworks: ['React', 'Node.js', 'Express', 'Spring Boot', 'Tailwind CSS'],
    coreCs: ['Operating Systems', 'DBMS', 'Computer Networks', 'OOPs', 'System Design'],
    tools: ['Git', 'GitHub', 'VS Code', 'Postman', 'Docker', 'Vercel', 'Render'],
    softSkills: ['STAR Framework', 'Active Listening', 'Technical Explanation', 'Team Collaboration']
  };

  // Add a skill to category
  function handleAddSkill(e) {
    e.preventDefault();
    if (!newSkillText.trim()) return;

    const list = currentSkills[skillCategory] || [];
    if (!list.includes(newSkillText.trim())) {
      const updatedList = [...list, newSkillText.trim()];
      placementStore.updateResumeSkills(skillCategory, updatedList);
      audioService.playSuccess();
    }
    setNewSkillText('');
  }

  // Remove a skill
  function handleRemoveSkill(cat, skillToRemove) {
    const list = currentSkills[cat] || [];
    const updatedList = list.filter(s => s !== skillToRemove);
    placementStore.updateResumeSkills(cat, updatedList);
    audioService.playClick();
  }

  // Calculate Real-Time ATS Score
  const totalSkillsCount = Object.values(currentSkills).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  const atsScore = useMemo(() => {
    let score = 50; // base structure
    if (totalSkillsCount >= 15) score += 15;
    else score += Math.round((totalSkillsCount / 15) * 15);

    if (projects.length >= 2) score += 15;
    else if (projects.length === 1) score += 8;

    if (certifications.length >= 1) score += 10;

    if (resumeContact.email && resumeContact.linkedin && resumeContact.github) score += 10;

    return Math.min(98, score);
  }, [totalSkillsCount, projects, certifications, resumeContact]);

  // Print ATS Resume
  function handlePrintResume() {
    window.print();
  }

  // Application Modal handlers
  const handleOpenAddApp = () => {
    setSelectedApp(null);
    setAppForm({
      company: '',
      role: 'Software Engineer',
      appliedDate: getTodayString(),
      resumeVersion: 'v1.0 (ATS SDE Standard)',
      status: 'Applied',
      followUpDate: '',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditApp = (app) => {
    setSelectedApp(app);
    setAppForm({
      company: app.company || '',
      role: app.role || '',
      appliedDate: app.appliedDate || '',
      resumeVersion: app.resumeVersion || app.resumeUsed || 'v1.0',
      status: app.status || 'Applied',
      followUpDate: app.followUpDate || '',
      notes: app.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveApp = (e) => {
    e.preventDefault();
    if (!appForm.company.trim()) return;

    if (selectedApp) {
      placementStore.updateJobApplication(selectedApp.id, {
        ...appForm,
        resumeUsed: appForm.resumeVersion
      });
    } else {
      placementStore.addJobApplication({
        ...appForm,
        resumeUsed: appForm.resumeVersion
      });
    }

    audioService.playSuccess();
    setIsAddModalOpen(false);
  };

  const handleDeleteApp = (id, comp) => {
    if (window.confirm(`Delete application for ${comp}?`)) {
      placementStore.deleteJobApplication(id);
      audioService.playClick();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Top Header */}
      <div className="card no-print" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">ATS Resume Engine</span>
              <span className="badge badge-lavender">Real-Time Sync</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              Resume Builder & Applications Pipeline
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              Add skills and project achievements to see instant changes on your ATS-optimized resume. Download single-column ATS PDF for corporate portals.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handlePrintResume}>
              <Printer size={16} /> Print / Export ATS PDF
            </button>
            <button className="btn btn-primary" onClick={handleOpenAddApp}>
              <Plus size={16} /> Track New Application
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="no-print" style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '2px' }}>
        <button
          className={`btn ${activeTab === 'builder' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('builder')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 700 }}
        >
          <FileText size={16} />
          <span>Interactive ATS Resume & Skills Sync</span>
        </button>

        <button
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('applications')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 700 }}
        >
          <Briefcase size={16} />
          <span>Application Pipeline ({applications.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'checklist' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('checklist')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 700 }}
        >
          <ShieldCheck size={16} />
          <span>ATS Readiness Audit</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: INTERACTIVE ATS RESUME & SKILLS BUILDER            */}
      {/* ========================================================= */}
      {activeTab === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '22px' }}>
          {/* Left Column: Skills Manager & ATS Score */}
          <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ATS Score Card */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-success">ATS Parsing Score</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>
                  {atsScore}/100
                </span>
              </div>
              <div className="progress-track" style={{ height: '7px' }}>
                <div className="progress-fill" style={{ width: `${atsScore}%`, background: 'var(--color-success)' }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Standard single-column ATS layout. No nested graphical tables. All section headers are scanner compliant.
              </div>
            </div>

            {/* Live Skills Adder */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                  Add / Manage Technical Skills
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
                Any skill you add or remove here is dynamically reflected in real time on the ATS Resume preview!
              </p>

              {/* Add Skill Form */}
              <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <select
                    className="form-select"
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="languages">Languages</option>
                    <option value="frameworks">Frameworks</option>
                    <option value="coreCs">Core CS Subjects</option>
                    <option value="tools">Developer Tools</option>
                    <option value="softSkills">Soft Skills</option>
                  </select>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Next.js, Redis, AWS"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Skill to Resume
                </button>
              </form>

              {/* Skills Category Lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries({
                  languages: 'Languages',
                  frameworks: 'Frameworks & Libraries',
                  coreCs: 'Core CS Fundamentals',
                  tools: 'Developer Tools',
                  softSkills: 'Soft Skills'
                }).map(([catKey, label]) => {
                  const skills = currentSkills[catKey] || [];

                  return (
                    <div key={catKey}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {label} ({skills.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {skills.map(s => (
                          <span
                            key={s}
                            className="badge badge-primary"
                            style={{ fontSize: '0.72rem', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <span>{s}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(catKey, s)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex', alignItems: 'center' }}
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact Editor */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.98rem', margin: '0 0 10px 0', fontWeight: 700 }}>
                Header & Contact Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={resumeContact.name}
                  onChange={(e) => setResumeContact(prev => ({ ...prev, name: e.target.value }))}
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Target Role"
                  value={resumeContact.role}
                  onChange={(e) => setResumeContact(prev => ({ ...prev, role: e.target.value }))}
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Email"
                  value={resumeContact.email}
                  onChange={(e) => setResumeContact(prev => ({ ...prev, email: e.target.value }))}
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="LinkedIn URL"
                  value={resumeContact.linkedin}
                  onChange={(e) => setResumeContact(prev => ({ ...prev, linkedin: e.target.value }))}
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="GitHub URL"
                  value={resumeContact.github}
                  onChange={(e) => setResumeContact(prev => ({ ...prev, github: e.target.value }))}
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live ATS Resume Preview (Printable) */}
          <div
            className="ats-print-container"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              padding: '36px 40px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid #E2E8F0',
              fontFamily: "'Inter', -apple-system, sans-serif",
              lineHeight: 1.5,
              fontSize: '0.88rem'
            }}
          >
            {/* Header / Contact */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '14px', marginBottom: '18px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0', color: '#0F172A', letterSpacing: '-0.02em' }}>
                {resumeContact.name}
              </h1>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                {resumeContact.role}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span>{resumeContact.email}</span>
                <span>•</span>
                <span>{resumeContact.phone}</span>
                <span>•</span>
                <span>{resumeContact.location}</span>
                <span>•</span>
                <span style={{ color: '#2563EB' }}>{resumeContact.linkedin}</span>
                <span>•</span>
                <span style={{ color: '#2563EB' }}>{resumeContact.github}</span>
              </div>
            </div>

            {/* SECTION: EDUCATION */}
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: '3px', marginBottom: '8px' }}>
                Education
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{resumeContact.college}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>CGPA: {resumeContact.cgpa}</div>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                  Batch of {resumeContact.gradYear}
                </div>
              </div>
            </div>

            {/* SECTION: TECHNICAL SKILLS (DYNAMICALLY REFLECTS USER CHANGES!) */}
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: '3px', marginBottom: '8px' }}>
                Technical Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.84rem' }}>
                <div>
                  <strong style={{ color: '#0F172A' }}>Languages: </strong>
                  <span style={{ color: '#334155' }}>{(currentSkills.languages || []).join(', ')}</span>
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Frameworks & Libraries: </strong>
                  <span style={{ color: '#334155' }}>{(currentSkills.frameworks || []).join(', ')}</span>
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Core CS Fundamentals: </strong>
                  <span style={{ color: '#334155' }}>{(currentSkills.coreCs || []).join(', ')}</span>
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Tools & Platforms: </strong>
                  <span style={{ color: '#334155' }}>{(currentSkills.tools || []).join(', ')}</span>
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Professional Competencies: </strong>
                  <span style={{ color: '#334155' }}>{(currentSkills.softSkills || []).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* SECTION: PROJECTS (DYNAMICALLY PULLED FROM PROJECTS TRACKER!) */}
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: '3px', marginBottom: '8px' }}>
                Engineering Projects
              </h2>
              {projects.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                  No projects added yet. Go to Projects tab to add your projects.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {projects.map(proj => (
                    <div key={proj.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{proj.title}</strong>
                          {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                            <span style={{ fontSize: '0.8rem', color: '#475569', marginLeft: '6px' }}>
                              | {proj.techStack.join(', ')}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 600 }}>
                          {proj.demoUrl ? 'Live Deployed' : proj.githubUrl ? 'GitHub' : 'Completed'}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '14px' }}>
                        • {proj.description || 'Engineered full-stack responsive web platform with microservices architecture.'}
                      </div>
                      {Array.isArray(proj.milestones) && proj.milestones.length > 0 && (
                        <div style={{ fontSize: '0.82rem', color: '#334155', paddingLeft: '14px' }}>
                          • {proj.milestones.map(m => m.title).join('; ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION: CERTIFICATIONS (DYNAMICALLY PULLED FROM CERTIFICATIONS TRACKER!) */}
            <div>
              <h2 style={{ fontSize: '0.98rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0F172A', borderBottom: '1px solid #CBD5E1', paddingBottom: '3px', marginBottom: '8px' }}>
                Certifications & Accreditations
              </h2>
              {certifications.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                  No certifications added yet. Go to Certifications tab to add your credentials.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
                  {certifications.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#0F172A', fontWeight: 600 }}>
                        {c.name} — <span style={{ color: '#475569', fontWeight: 400 }}>{c.provider}</span>
                      </span>
                      <span style={{ color: '#64748B', fontSize: '0.8rem' }}>
                        {c.issueDate || 'Verified'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: APPLICATION TRACKER PIPELINE                       */}
      {/* ========================================================= */}
      {activeTab === 'applications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>Active Job Applications</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track submission dates, resumes used, and interview follow-up schedules.</div>
            </div>

            <button className="btn btn-primary btn-sm" onClick={handleOpenAddApp}>
              <Plus size={15} /> Add Application
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {applications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Briefcase size={36} style={{ opacity: 0.35, marginBottom: '10px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)' }}>No active applications tracked yet</div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Click "Add Application" to track on-campus or off-campus company applications.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-card-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px 18px' }}>Company</th>
                      <th style={{ padding: '12px 14px' }}>Role</th>
                      <th style={{ padding: '12px 14px' }}>Applied Date</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {app.company}
                        </td>
                        <td style={{ padding: '14px 14px', color: 'var(--text-secondary)' }}>
                          {app.role || 'Software Engineer'}
                        </td>
                        <td style={{ padding: '14px 14px', color: 'var(--text-muted)' }}>
                          {app.appliedDate || '—'}
                        </td>
                        <td style={{ padding: '14px 14px' }}>
                          <span className={`badge ${
                            app.status === 'Offer' ? 'badge-success' :
                            app.status === 'Interview Scheduled' ? 'badge-primary' :
                            app.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleOpenEditApp(app)}
                            style={{ padding: '6px' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteApp(app.id, app.company)}
                            style={{ padding: '6px', color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ATS READINESS CHECKLIST                            */}
      {/* ========================================================= */}
      {activeTab === 'checklist' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0' }}>
            Comprehensive ATS Format Verification
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {atsChecklist.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: item.checked ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card-subtle)',
                  border: item.checked ? '1px solid var(--color-success-border)' : '1px solid var(--border-soft)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  placementStore.toggleAtsItem(item.id);
                  audioService.playClick();
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    background: item.checked ? 'var(--color-success)' : 'transparent',
                    border: `2px solid ${item.checked ? 'var(--color-success)' : 'var(--border-soft)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  {item.checked && <Check size={13} strokeWidth={3} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: item.checked ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                    {item.label}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Add/Edit Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={selectedApp ? 'Edit Application' : 'Track Job Application'}
        >
          <form onSubmit={handleSaveApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Google, Microsoft, TCS Digital"
                value={appForm.company}
                onChange={(e) => setAppForm(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={appForm.role}
                  onChange={(e) => setAppForm(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={appForm.status}
                  onChange={(e) => setAppForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Application Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={appForm.appliedDate}
                  onChange={(e) => setAppForm(prev => ({ ...prev, appliedDate: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Follow-up / Assessment Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={appForm.followUpDate}
                  onChange={(e) => setAppForm(prev => ({ ...prev, followUpDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notes & Referral Info</label>
              <textarea
                className="form-textarea"
                placeholder="Referral name, job ID, or assessment notes..."
                value={appForm.notes}
                onChange={(e) => setAppForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedApp ? 'Update Application' : 'Save Application'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  GitBranch,
  Globe,
  Code2,
  CheckCircle2,
  Check,
  Sparkles,
  Layers
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

export function ProjectsTracker({ data, store }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full Stack Web');
  const [description, setDescription] = useState('');
  const [techStackString, setTechStackString] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState(''); // Vercel / Render Link
  const [status, setStatus] = useState('Completed');
  const [milestonesString, setMilestonesString] = useState('');

  const projects = data?.projects || [];

  function handleOpenAdd() {
    setEditingProject(null);
    setTitle('');
    setCategory('Full Stack Web');
    setDescription('');
    setTechStackString('');
    setGithubUrl('');
    setDemoUrl('');
    setStatus('Completed');
    setMilestonesString('');
    setIsModalOpen(true);
  }

  function handleOpenEdit(proj) {
    setEditingProject(proj);
    setTitle(proj.title || '');
    setCategory(proj.category || 'Full Stack Web');
    setDescription(proj.description || '');
    setTechStackString(Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (proj.techStack || ''));
    setGithubUrl(proj.githubUrl || '');
    setDemoUrl(proj.demoUrl || '');
    setStatus(proj.status || 'Completed');
    setMilestonesString((proj.milestones || []).map(m => m.title).join('\n'));
    setIsModalOpen(true);
  }

  function handleSaveProject(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const techArray = techStackString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const milestoneLines = milestonesString
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const milestoneObjects = milestoneLines.map((mText, idx) => ({
      id: 'm_' + Date.now() + '_' + idx,
      title: mText,
      status: 'Completed'
    }));

    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      techStack: techArray,
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim(),
      status,
      milestones: milestoneObjects.length > 0 ? milestoneObjects : (editingProject?.milestones || [
        { id: 'm1', title: 'System Architecture & Schema Design', status: 'Completed' },
        { id: 'm2', title: 'Core RESTful APIs & Business Logic', status: 'Completed' },
        { id: 'm3', title: 'Frontend UI & Responsive Design', status: 'Completed' },
        { id: 'm4', title: 'Live Cloud Deployment on Vercel/Render', status: 'Completed' }
      ])
    };

    if (editingProject) {
      store.updateProject(editingProject.id, payload);
    } else {
      store.addProject(payload);
    }

    audioService.playSuccess();
    setIsModalOpen(false);
  }

  function handleDelete(id, projTitle) {
    if (window.confirm(`Are you sure you want to delete project "${projTitle}"?`)) {
      store.deleteProject(id);
      audioService.playClick();
    }
  }

  function handleToggleMilestone(projectId, milestoneId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updated = (project.milestones || []).map(m => {
      if (m.id === milestoneId) {
        return { ...m, status: m.status === 'Completed' ? 'Not Started' : 'Completed' };
      }
      return m;
    });

    store.updateProject(projectId, { milestones: updated });
    audioService.playClick();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header & Overview */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Engineering Portfolio</span>
              <span className="badge badge-lavender">GitHub & Vercel / Render Live Demos</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              Projects & Deployed Demos
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              Showcase your technical projects with direct links to GitHub repositories and live deployments (Vercel, Render, AWS). These populate automatically on your ATS resume.
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* Stats */}
        <div className="stat-grid-4" style={{ marginTop: '22px', marginBottom: 0 }}>
          <div className="stat-card">
            <span className="stat-card-label">Total Projects</span>
            <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
              {projects.length}
            </div>
            <div className="stat-card-sub">Engineering portfolio apps</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Live Deployed Demos</span>
            <div className="stat-card-value" style={{ color: 'var(--color-success)' }}>
              {projects.filter(p => p.demoUrl).length}
            </div>
            <div className="stat-card-sub">Hosted on Vercel / Render</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Public Repositories</span>
            <div className="stat-card-value" style={{ color: 'var(--color-accent-violet)' }}>
              {projects.filter(p => p.githubUrl).length}
            </div>
            <div className="stat-card-sub">Verified GitHub source code</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Production Ready</span>
            <div className="stat-card-value">
              {projects.filter(p => p.status === 'Completed').length}
            </div>
            <div className="stat-card-sub">Interview discussion ready</div>
          </div>
        </div>
      </div>

      {/* 2. Projects Cards Grid */}
      {projects.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <FolderGit2 size={48} style={{ opacity: 0.35, color: 'var(--color-primary)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            No Projects Added Yet
          </h3>
          <p style={{ fontSize: '0.86rem', maxWidth: '480px', margin: '0 auto 20px auto' }}>
            Add your engineering projects with their GitHub and Vercel/Render links to display on your resume and interview portfolio.
          </p>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Your First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
          {projects.map(proj => {
            const isCompleted = proj.status === 'Completed';

            return (
              <div
                key={proj.id}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: '1px solid var(--border-soft)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-primary-blush)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(99, 102, 241, 0.25)'
                        }}
                      >
                        <Code2 size={20} />
                      </div>

                      <span className="badge badge-lavender" style={{ fontSize: '0.72rem' }}>
                        {proj.category || 'Full Stack'}
                      </span>
                    </div>

                    <span className={`badge ${isCompleted ? 'badge-success' : 'badge-warning'}`}>
                      {proj.status || 'Completed'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.55 }}>
                    {proj.description || 'Full stack application built with scalable architecture and modern frameworks.'}
                  </p>

                  {/* Tech Stack Tags */}
                  {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {proj.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="badge badge-primary"
                          style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Milestones / Key Features */}
                  {Array.isArray(proj.milestones) && proj.milestones.length > 0 && (
                    <div style={{ background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Architecture Deliverables
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {proj.milestones.map(m => (
                          <div
                            key={m.id}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}
                            onClick={() => handleToggleMilestone(proj.id, m.id)}
                          >
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                background: m.status === 'Completed' ? 'var(--color-success)' : 'transparent',
                                border: `1.5px solid ${m.status === 'Completed' ? 'var(--color-success)' : 'var(--border-soft)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                flexShrink: 0
                              }}
                            >
                              {m.status === 'Completed' && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span style={{ color: m.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-main)', textDecoration: m.status === 'Completed' ? 'line-through' : 'none' }}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with GitHub & Vercel / Render Live Links */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', gap: '5px' }}
                      >
                        <GitBranch size={13} />
                        <span>GitHub</span>
                      </a>
                    )}

                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.78rem', gap: '5px' }}
                      >
                        <Globe size={13} />
                        <span>Live Demo (Vercel/Render)</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleOpenEdit(proj)}
                      style={{ padding: '6px' }}
                      title="Edit project"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(proj.id, proj.title)}
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject ? 'Edit Project' : 'Add Engineering Project'}
        >
          <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. FindIt - Lost & Found Campus Portal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Full Stack Web">Full Stack Web</option>
                  <option value="Backend & Distributed">Backend & Distributed</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Completed">Completed & Deployed</option>
                  <option value="In Progress">In Development</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Project Description / STAR Impact</label>
              <textarea
                className="form-textarea"
                placeholder="Engineered lost-and-found management portal with real-time notifications and image verification..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: '65px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Tech Stack (Comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS, Vercel"
                value={techStackString}
                onChange={(e) => setTechStackString(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">GitHub Repository URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Live Demo URL (Vercel / Render)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://my-app.vercel.app or onrender.com"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Key Deliverables (One per line)</label>
              <textarea
                className="form-textarea"
                placeholder="REST API implementation&#10;JWT authentication & role-based access&#10;Deployed on Vercel with CI/CD"
                value={milestonesString}
                onChange={(e) => setMilestonesString(e.target.value)}
                style={{ minHeight: '70px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingProject ? 'Save Changes' : 'Add Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

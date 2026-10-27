import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Calendar,
  Check,
  ShieldCheck,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const PROVIDERS = [
  'AWS',
  'Oracle',
  'Google Cloud',
  'Microsoft Azure',
  'Coursera',
  'Udemy',
  'NPTEL / SWAYAM',
  'HackerRank',
  'LeetCode',
  'Cisco',
  'Meta',
  'Other'
];

export function CertificationsTracker({ data, store }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Completed' | 'In Progress' | 'Planned'

  // Form State
  const [name, setName] = useState('');
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [status, setStatus] = useState('Completed');
  const [issueDate, setIssueDate] = useState(getTodayString());
  const [credentialId, setCredentialId] = useState('');
  const [officialUrl, setOfficialUrl] = useState('');
  const [skillsString, setSkillsString] = useState('');
  const [badgeUrl, setBadgeUrl] = useState('');

  const certs = data?.certifications || [];

  const completedCount = certs.filter(c => c.status === 'Completed' || c.certificateEarned).length;
  const inProgressCount = certs.filter(c => c.status === 'In Progress').length;
  const plannedCount = certs.filter(c => c.status === 'Planned').length;

  const filteredCerts = certs.filter(c => {
    if (filterStatus === 'Completed') return c.status === 'Completed' || c.certificateEarned;
    if (filterStatus === 'In Progress') return c.status === 'In Progress';
    if (filterStatus === 'Planned') return c.status === 'Planned';
    return true;
  });

  function handleOpenAdd() {
    setEditingCert(null);
    setName('');
    setProvider(PROVIDERS[0]);
    setStatus('Completed');
    setIssueDate(getTodayString());
    setCredentialId('');
    setOfficialUrl('');
    setSkillsString('');
    setBadgeUrl('');
    setIsModalOpen(true);
  }

  function handleOpenEdit(c) {
    setEditingCert(c);
    setName(c.name || '');
    setProvider(c.provider || PROVIDERS[0]);
    setStatus(c.status || (c.certificateEarned ? 'Completed' : 'Planned'));
    setIssueDate(c.targetCompletion || c.issueDate || '');
    setCredentialId(c.certificateRef || c.credentialId || '');
    setOfficialUrl(c.officialUrl || '');
    setSkillsString(Array.isArray(c.skills) ? c.skills.join(', ') : (c.skills || ''));
    setBadgeUrl(c.badgeUrl || '');
    setIsModalOpen(true);
  }

  function handleSaveCert(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const skillsArray = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      provider,
      status,
      issueDate,
      credentialId: credentialId.trim(),
      certificateRef: credentialId.trim(),
      officialUrl: officialUrl.trim(),
      skills: skillsArray,
      badgeUrl: badgeUrl.trim(),
      certificateEarned: status === 'Completed'
    };

    if (editingCert) {
      store.updateCertification(editingCert.id, payload);
    } else {
      store.addCertification(payload);
    }

    audioService.playSuccess();
    setIsModalOpen(false);
  }

  function handleDelete(id, certTitle) {
    if (window.confirm(`Are you sure you want to remove "${certTitle}"?`)) {
      store.deleteCertification(id);
      audioService.playClick();
    }
  }

  function handleClearAll() {
    if (certs.length === 0) return;
    if (window.confirm('Are you sure you want to remove all certificates and start fresh?')) {
      store.clearCertifications();
      audioService.playClick();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header & Overview */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary">Verified Credentials</span>
              <span className="badge badge-lavender">Personal Certifications</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.0rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Certifications & Badges
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, maxWidth: '700px', lineHeight: 1.55 }}>
              Add and track your verified industry certifications, cloud badges, and coursework credentials. These reflect automatically on your ATS resume.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {certs.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={handleClearAll} style={{ color: 'var(--color-danger)' }}>
                <Trash2 size={15} /> Remove All
              </button>
            )}
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Add Certificate
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stat-grid-4" style={{ marginTop: '22px', marginBottom: 0 }}>
          <div className="stat-card">
            <span className="stat-card-label">Earned Credentials</span>
            <div className="stat-card-value" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.0rem', fontWeight: 600, color: 'var(--color-success)' }}>
              {completedCount}
            </div>
            <div className="stat-card-sub">Verified & completed</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">In Progress</span>
            <div className="stat-card-value" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.0rem', fontWeight: 600, color: 'var(--color-warning)' }}>
              {inProgressCount}
            </div>
            <div className="stat-card-sub">Currently enrolled courses</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Planned Next</span>
            <div className="stat-card-value" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.0rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              {plannedCount}
            </div>
            <div className="stat-card-sub">Target certifications</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Total Portfolio</span>
            <div className="stat-card-value" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.0rem', fontWeight: 600 }}>{certs.length}</div>
            <div className="stat-card-sub">Overall tracked certifications</div>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className={`btn btn-sm ${filterStatus === 'All' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('All')}
        >
          All ({certs.length})
        </button>
        <button
          className={`btn btn-sm ${filterStatus === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('Completed')}
        >
          Completed ({completedCount})
        </button>
        <button
          className={`btn btn-sm ${filterStatus === 'In Progress' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('In Progress')}
        >
          In Progress ({inProgressCount})
        </button>
        <button
          className={`btn btn-sm ${filterStatus === 'Planned' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterStatus('Planned')}
        >
          Planned ({plannedCount})
        </button>
      </div>

      {/* 3. Certificates Cards Grid */}
      {filteredCerts.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Award size={48} style={{ opacity: 0.35, color: 'var(--color-primary)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            No Certificates Added Yet
          </h3>
          <p style={{ fontSize: '0.86rem', maxWidth: '480px', margin: '0 auto 20px auto' }}>
            Add your AWS, Oracle, NPTEL, Coursera, or HackerRank certificates here. Only certificates you add will be tracked.
          </p>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Your First Certificate
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredCerts.map(cert => {
            const isCompleted = cert.status === 'Completed' || cert.certificateEarned;

            return (
              <div
                key={cert.id}
                className="card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  border: isCompleted ? '1px solid var(--color-success-border)' : '1px solid var(--border-soft)'
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
                          backgroundColor: isCompleted ? 'var(--color-success-bg)' : 'var(--color-primary-blush)',
                          color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${isCompleted ? 'var(--color-success-border)' : 'rgba(99, 102, 241, 0.25)'}`
                        }}
                      >
                        <Award size={20} />
                      </div>

                      <div>
                        <span className="badge badge-lavender" style={{ fontSize: '0.72rem' }}>
                          {cert.provider || 'Credential'}
                        </span>
                      </div>
                    </div>

                    <span className={`badge ${isCompleted ? 'badge-success' : cert.status === 'In Progress' ? 'badge-warning' : 'badge-lavender'}`}>
                      {cert.status || 'Planned'}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    {cert.name}
                  </h3>

                  {cert.issueDate && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Calendar size={12} /> {isCompleted ? `Issued: ${cert.issueDate}` : `Target: ${cert.issueDate}`}
                    </div>
                  )}

                  {cert.credentialId && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'monospace' }}>
                      ID: {cert.credentialId}
                    </div>
                  )}

                  {/* Skills tags */}
                  {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                      {cert.skills.map((s, i) => (
                        <span key={i} className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  {cert.officialUrl ? (
                    <a
                      href={cert.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.76rem', gap: '5px' }}
                    >
                      <span>Verify Credential</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>No URL provided</span>
                  )}

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleOpenEdit(cert)}
                      style={{ padding: '6px' }}
                      title="Edit certificate"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(cert.id, cert.name)}
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                      title="Delete certificate"
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

      {/* Add / Edit Certificate Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCert ? 'Edit Certificate' : 'Add Certification'}
        >
          <form onSubmit={handleSaveCert} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Certificate Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS Certified Cloud Practitioner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Issuing Organization / Platform</label>
                <select
                  className="form-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Completed">Completed (Earned)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Date (Issue / Target)</label>
                <input
                  type="date"
                  className="form-input"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Credential ID (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AWS-9482103"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Verification / Credential URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.credly.com/badges/..."
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Skills Verified (Comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cloud Architecture, S3, EC2, IAM"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCert ? 'Save Changes' : 'Add Certificate'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

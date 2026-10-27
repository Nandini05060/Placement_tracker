import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Target,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  User,
  Camera,
  Trash2,
  Mail,
  Bell,
  Sparkles,
  ExternalLink,
  Send,
  Award,
  BookOpen
} from 'lucide-react';
import { placementStore } from '../services/placementStore.js';
import { audioService } from '../services/audioService.js';
import { Modal } from '../components/Modal.jsx';

export function SettingsPage({ data }) {
  const currentSettings = data?.settings || {};

  // Form state
  const [formSettings, setFormSettings] = useState({
    studentName: currentSettings.studentName || 'Nandini',
    targetRole: currentSettings.targetRole || 'Software Development Engineer (SDE)',
    college: currentSettings.college || 'B.Tech Computer Science & Engineering',
    gradYear: currentSettings.gradYear || '2026',
    cgpa: currentSettings.cgpa || '8.8 / 10.0',
    targetPackage: currentSettings.targetPackage || '18–35 LPA',
    bio: currentSettings.bio || 'Aspiring Software Development Engineer (SDE). Focused on Data Structures, Algorithms, Core CS Fundamentals, and Full-Stack Systems.',
    profilePic: currentSettings.profilePic || '',
    email: currentSettings.email || 'nandini.tech@gmail.com',
    emailNotifications: currentSettings.emailNotifications !== false,
    notifyDailyTasks: currentSettings.notifyDailyTasks !== false,
    notifyCertifications: currentSettings.notifyCertifications !== false,
    notifyPractice: currentSettings.notifyPractice !== false,
    notifyCompanies: currentSettings.notifyCompanies !== false,
    targetDeadline: currentSettings.targetDeadline || '2026-12-31',
    dailyTargetMinutes: currentSettings.dailyTargetMinutes || 120,
    weeklyHoursGoal: currentSettings.weeklyHoursGoal || 14,
    dsaTarget: currentSettings.dsaTarget || 80,
    theme: currentSettings.theme || 'dark',
    soundEnabled: currentSettings.soundEnabled !== false,
    readinessWeights: {
      dsa: currentSettings.readinessWeights?.dsa ?? 25,
      coreCs: currentSettings.readinessWeights?.coreCs ?? 20,
      projects: currentSettings.readinessWeights?.projects ?? 20,
      aptitude: currentSettings.readinessWeights?.aptitude ?? 15,
      softSkills: currentSettings.readinessWeights?.softSkills ?? 10,
      certs: currentSettings.readinessWeights?.certs ?? 10
    }
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mailSentStatus, setMailSentStatus] = useState(null);

  // Ready preset avatars
  const presetAvatars = [
    {
      id: 'avatar-tech-1',
      name: 'Cyber Dev',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'avatar-tech-2',
      name: 'Code Geek',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'avatar-tech-3',
      name: 'Abstract Violet',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&auto=format&fit=crop&q=80'
    }
  ];

  // Sum of weights validation
  const totalWeight = Object.values(formSettings.readinessWeights).reduce((a, b) => a + Number(b), 0);

  const handleWeightChange = (key, val) => {
    setFormSettings(prev => ({
      ...prev,
      readinessWeights: {
        ...prev.readinessWeights,
        [key]: parseInt(val, 10) || 0
      }
    }));
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setFormSettings(prev => ({ ...prev, profilePic: base64 }));
        audioService.playSuccess();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    if (totalWeight !== 100) {
      alert(`Category weights must sum to 100%. Current total: ${totalWeight}%`);
      return;
    }

    placementStore.updateSettings(formSettings);
    audioService.setEnabled(formSettings.soundEnabled);
    audioService.playSuccess();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Send Email Digest / Test Notification
  const handleSendEmailDigest = () => {
    const targetEmail = formSettings.email || 'student@placement.edu';
    const pendingTasks = (data.dailyTasks || []).filter(t => !t.completed);
    const pendingCerts = (data.certifications || []).filter(c => c.status !== 'Completed');
    const companiesInPipe = (data.targetCompanies || []).filter(c => c.status === 'Applied' || c.status === 'OA Shortlisted' || c.status === 'Interview Scheduled');
    const studiedMins = placementStore.getTodayStudiedMinutes();

    const subject = encodeURIComponent(`[Placement Tracker] Daily Digest for ${formSettings.studentName} - ${new Date().toLocaleDateString()}`);

    const bodyText = `Hi ${formSettings.studentName},

Here is your automated Placement Preparation Digest:

🎯 DAILY TARGETS & FOCUS:
• Studied Today: ${studiedMins} mins (Daily Goal: ${formSettings.dailyTargetMinutes} mins)
• Pending Tasks for Today (${pendingTasks.length}):
${pendingTasks.length > 0 ? pendingTasks.slice(0, 5).map(t => `  - [ ] ${t.text} (${t.category})`).join('\n') : '  - All daily tasks completed! Great work.'}

📚 CERTIFICATIONS & COURSES:
${pendingCerts.length > 0 ? pendingCerts.map(c => `  - ${c.title} (${c.provider}) - Status: ${c.status}`).join('\n') : '  - All certifications completed!'}

🏢 ACTIVE COMPANY PIPELINE:
${companiesInPipe.length > 0 ? companiesInPipe.map(c => `  - ${c.name}: ${c.role} (${c.status})`).join('\n') : '  - No active OAs scheduled.'}

💡 Keep up the momentum! Open your Placement Tracker to continue:
${window.location.origin}${window.location.pathname}

Best regards,
Placement Tracker System`;

    // 1. Try Desktop Web Notification if supported
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🎯 Placement Tracker Digest for ${formSettings.studentName}`, {
          body: `You have ${pendingTasks.length} pending tasks and ${pendingCerts.length} active courses. Keep studying!`,
          icon: formSettings.profilePic || undefined
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(`🎯 Placement Tracker Digest for ${formSettings.studentName}`, {
              body: `You have ${pendingTasks.length} pending tasks today.`,
              icon: formSettings.profilePic || undefined
            });
          }
        });
      }
    }

    // 2. Open prefilled mailto link for direct sending
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    window.open(mailtoUrl, '_blank');

    audioService.playSuccess();
    setMailSentStatus(`Digest created for ${targetEmail}! Opened your default email client with all pending tasks & certification reminders.`);
    setTimeout(() => setMailSentStatus(null), 6000);
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = placementStore.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formSettings.studentName.toLowerCase()}_placement_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    audioService.playClick();
  };

  // Import JSON
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const res = placementStore.importBackupJSON(content);
        if (res.success) {
          setImportStatus({ type: 'success', message: 'Data backup imported and restored successfully!' });
          audioService.playSuccess();
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus({ type: 'error', message: res.error || 'Failed to parse JSON backup.' });
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: 'Invalid JSON file format.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Hard Reset Data
  const handleConfirmReset = () => {
    placementStore.resetAllData();
    setIsResetModalOpen(false);
    audioService.playClick();
    window.location.reload();
  };

  const initial = (formSettings.studentName || 'N').charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Header Banner */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary">Candidate Profile & Config</span>
              <span className="badge badge-lavender">Email Alerts & Safety</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.0rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
              Settings & Profile Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '720px', margin: 0, lineHeight: 1.55 }}>
              Customize your candidate profile, upload custom avatar, configure email reminders for daily tasks & certifications, and manage your placement goals.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {saveSuccess && (
              <div className="badge badge-success animate-fade-in" style={{ fontSize: '0.86rem', padding: '8px 14px', gap: '6px' }}>
                <CheckCircle2 size={16} /> Saved Successfully
              </div>
            )}
            <button type="button" onClick={handleSaveSettings} className="btn btn-primary btn-md">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* SECTION 1: CANDIDATE PROFILE & AVATAR UPLOAD */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <User size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              1. Candidate Profile & Picture
            </h3>
          </div>

          {/* Avatar Preview & Actions Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', padding: '16px 20px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: formSettings.profilePic ? 'none' : 'var(--color-primary-blush)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '2.2rem',
                border: '2px solid var(--color-primary-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              {formSettings.profilePic ? (
                <img
                  src={formSettings.profilePic}
                  alt={formSettings.studentName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                {formSettings.studentName || 'Student Name'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Upload your professional photo. Appears in the top navigation bar, sidebar, and dashboard.
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <Camera size={14} /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>

                {formSettings.profilePic && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setFormSettings({ ...formSettings, profilePic: '' })}
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <Trash2 size={13} /> Remove Photo
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Presets:</span>
                  {presetAvatars.map(av => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setFormSettings({ ...formSettings, profilePic: av.url })}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: formSettings.profilePic === av.url ? '2px solid var(--color-primary)' : '1px solid var(--border-soft)',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title={av.name}
                    >
                      <img src={av.url} alt={av.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                className="input-field"
                value={formSettings.studentName}
                onChange={(e) => setFormSettings({ ...formSettings, studentName: e.target.value })}
                placeholder="e.g. Nandini"
              />
            </div>

            <div>
              <label className="label">Target Job Role</label>
              <input
                type="text"
                required
                className="input-field"
                value={formSettings.targetRole}
                onChange={(e) => setFormSettings({ ...formSettings, targetRole: e.target.value })}
                placeholder="e.g. Software Development Engineer (SDE)"
              />
            </div>

            <div>
              <label className="label">College / Degree Track</label>
              <input
                type="text"
                className="input-field"
                value={formSettings.college}
                onChange={(e) => setFormSettings({ ...formSettings, college: e.target.value })}
                placeholder="e.g. 3rd Year • B.Tech CSE"
              />
            </div>

            <div>
              <label className="label">Graduation Year</label>
              <input
                type="text"
                className="input-field"
                value={formSettings.gradYear}
                onChange={(e) => setFormSettings({ ...formSettings, gradYear: e.target.value })}
                placeholder="e.g. 2026"
              />
            </div>

            <div>
              <label className="label">Current CGPA</label>
              <input
                type="text"
                className="input-field"
                value={formSettings.cgpa}
                onChange={(e) => setFormSettings({ ...formSettings, cgpa: e.target.value })}
                placeholder="e.g. 8.8 / 10.0"
              />
            </div>

            <div>
              <label className="label">Target CTC / Package</label>
              <input
                type="text"
                className="input-field"
                value={formSettings.targetPackage}
                onChange={(e) => setFormSettings({ ...formSettings, targetPackage: e.target.value })}
                placeholder="e.g. 18–35 LPA"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Candidate Bio & Placement Statement</label>
              <textarea
                rows={2}
                className="input-field"
                value={formSettings.bio}
                onChange={(e) => setFormSettings({ ...formSettings, bio: e.target.value })}
                placeholder="Brief summary of your technical focus and career aspirations..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: EMAIL NOTIFICATIONS & REMINDERS */}
        <div className="card" style={{ padding: '24px', borderLeft: '3px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} style={{ color: 'var(--color-primary)' }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  2. Email Notifications & Progress Reminders
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  Receive periodic reminders to complete daily tasks, 30-min aptitude drills, certifications, and target company deadlines.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleSendEmailDigest}
              title="Dispatches an immediate digest of current tasks and certifications"
              style={{ gap: '6px' }}
            >
              <Send size={14} /> Send Test Email Digest
            </button>
          </div>

          {mailSentStatus && (
            <div
              className="card animate-fade-in"
              style={{
                padding: '12px 16px',
                marginBottom: '16px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: 'var(--text-main)',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <span>{mailSentStatus}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div>
              <label className="label">Primary Notification Email</label>
              <input
                type="email"
                required
                className="input-field"
                value={formSettings.email}
                onChange={(e) => setFormSettings({ ...formSettings, email: e.target.value })}
                placeholder="e.g. nandini.tech@gmail.com"
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Target address for digests, task completions, and alert summaries.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label className="label">Notification Preferences</label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.84rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formSettings.notifyDailyTasks}
                  onChange={(e) => setFormSettings({ ...formSettings, notifyDailyTasks: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                <span>Daily Task Reminders (Pending Planner Tasks)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.84rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formSettings.notifyCertifications}
                  onChange={(e) => setFormSettings({ ...formSettings, notifyCertifications: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                <span>Certifications & Course Completion Alerts</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.84rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formSettings.notifyPractice}
                  onChange={(e) => setFormSettings({ ...formSettings, notifyPractice: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                <span>30-min Aptitude Drill & Striver's DSA Practice Reminders</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.84rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formSettings.notifyCompanies}
                  onChange={(e) => setFormSettings({ ...formSettings, notifyCompanies: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                <span>Target Company OA & Interview Schedules</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: PLACEMENT GOALS & SCHEDULE */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Target size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              3. Placement Goals & Schedule
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label className="label">Target Placement Deadline</label>
              <input
                type="date"
                required
                className="input-field"
                value={formSettings.targetDeadline}
                onChange={(e) => setFormSettings({ ...formSettings, targetDeadline: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Daily Study Target (Minutes)</label>
              <input
                type="number"
                min="30"
                max="480"
                required
                className="input-field"
                value={formSettings.dailyTargetMinutes}
                onChange={(e) => setFormSettings({ ...formSettings, dailyTargetMinutes: parseInt(e.target.value, 10) || 120 })}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Default: 120 minutes (2 hours per day)</span>
            </div>

            <div>
              <label className="label">Target Unique DSA Questions</label>
              <input
                type="number"
                min="20"
                max="500"
                required
                className="input-field"
                value={formSettings.dsaTarget}
                onChange={(e) => setFormSettings({ ...formSettings, dsaTarget: parseInt(e.target.value, 10) || 80 })}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Default: 80 unique questions</span>
            </div>

            <div>
              <label className="label">Weekly Goal (Hours)</label>
              <input
                type="number"
                min="5"
                max="60"
                required
                className="input-field"
                value={formSettings.weeklyHoursGoal}
                onChange={(e) => setFormSettings({ ...formSettings, weeklyHoursGoal: parseInt(e.target.value, 10) || 14 })}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Default: 14 hours per week</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: READINESS EVALUATION WEIGHTS */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} style={{ color: 'var(--color-primary)' }} />
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  4. Skill Readiness Formula Weights
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Adjust how much each area contributes to your overall readiness score. Must sum exactly to 100%.
                </p>
              </div>
            </div>

            <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: totalWeight === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: totalWeight === 100 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 800, fontSize: '0.9rem' }}>
              Sum: {totalWeight}% {totalWeight === 100 ? '✓ Valid' : '⚠ Must be 100%'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label className="label">DSA & Coding (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={formSettings.readinessWeights.dsa}
                onChange={(e) => handleWeightChange('dsa', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Core CS Subjects (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={formSettings.readinessWeights.coreCs}
                onChange={(e) => handleWeightChange('coreCs', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Projects & Portfolio (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={formSettings.readinessWeights.projects}
                onChange={(e) => handleWeightChange('projects', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Aptitude & Reasoning (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={formSettings.readinessWeights.aptitude}
                onChange={(e) => handleWeightChange('aptitude', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Soft Skills & HR (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={formSettings.readinessWeights.softSkills}
                onChange={(e) => handleWeightChange('softSkills', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Certifications (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input-field"
                value={formSettings.readinessWeights.certs}
                onChange={(e) => handleWeightChange('certs', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: APPEARANCE & SOUND */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 16px 0', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            5. Appearance & Sound
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div>
              <label className="label">Interface Theme</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className={`btn ${formSettings.theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormSettings({ ...formSettings, theme: 'light' })}
                >
                  <Sun size={16} /> Light Theme
                </button>
                <button
                  type="button"
                  className={`btn ${formSettings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => setFormSettings({ ...formSettings, theme: 'dark' })}
                >
                  <Moon size={16} /> Dark Theme
                </button>
              </div>
            </div>

            <div>
              <label className="label">Audio Chimes & Sound Effects</label>
              <button
                type="button"
                className={`btn ${formSettings.soundEnabled ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%' }}
                onClick={() => setFormSettings({ ...formSettings, soundEnabled: !formSettings.soundEnabled })}
              >
                {formSettings.soundEnabled ? <><Volume2 size={16} /> Sound Effects Enabled</> : <><VolumeX size={16} /> Sound Muted</>}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '200px' }}>
            <Save size={18} /> Save All Settings
          </button>
        </div>
      </form>

      {/* SECTION 6: DATA PERSISTENCE & JSON BACKUP */}
      <div className="card" style={{ padding: '24px', borderTop: '3px solid var(--color-sage)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          6. Data Safety, Backup & Reset
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
          All your DSA progress, customized roadmap milestones, R.S. Aggarwal practice logs, and resume details are kept in browser LocalStorage. Download regular backups to safeguard your progress across devices.
        </p>

        {importStatus && (
          <div
            className="card"
            style={{
              padding: '12px 16px',
              marginBottom: '16px',
              background: importStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: importStatus.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
              border: 'none',
              fontSize: '0.85rem'
            }}
          >
            {importStatus.message}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={handleExportJSON}>
            <Download size={16} /> Export JSON Backup
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Import JSON Backup
            <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
          </label>

          <button
            className="btn btn-danger"
            style={{ marginLeft: 'auto' }}
            onClick={() => setIsResetModalOpen(true)}
          >
            <RotateCcw size={16} /> Reset All Data to Initial State
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {isResetModalOpen && (
        <Modal title="Confirm Data Reset" onClose={() => setIsResetModalOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <AlertTriangle size={24} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                <strong>Warning: This action is destructive and cannot be undone.</strong>
                <br />
                All logged study sessions, task completions, custom target companies, and practice journal entries will be reset to default starter data.
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Export a JSON backup before proceeding if you wish to keep a copy of your progress.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setIsResetModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmReset}>
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SettingsPage;

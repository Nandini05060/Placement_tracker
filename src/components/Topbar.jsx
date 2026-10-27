import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Calendar,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import audioService from '../services/audioService.js';

export function Topbar({
  activeView,
  daysRemaining,
  streakInfo,
  todayStudiedMinutes,
  dailyTargetMinutes,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  setIsMobileOpen,
  onNavigate,
  settings
}) {
  const studentName = settings?.studentName || 'Nandini';
  const initial = studentName.charAt(0).toUpperCase() || 'N';
  const profilePic = settings?.profilePic;
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const titles = {
    dashboard: { title: 'Overview', breadcrumb: 'Career Launchpad' },
    planner: { title: 'Daily Planner', breadcrumb: 'Daily Execution' },
    timer: { title: 'Study Timer', breadcrumb: 'Focus Studio' },
    roadmap: { title: 'Placement Roadmap', breadcrumb: '24-Week Curriculum' },
    dsa: { title: 'DSA Practice', breadcrumb: 'Problem Solving' },
    aptitude: { title: 'Aptitude & Reasoning', breadcrumb: 'Speed Drills' },
    'core-cs': { title: 'Core Subjects', breadcrumb: 'CS Fundamentals' },
    'soft-skills': { title: 'Soft Skills', breadcrumb: 'Communication & HR' },
    certifications: { title: 'Certifications', breadcrumb: 'Verified Credentials' },
    projects: { title: 'Projects Portfolio', breadcrumb: 'Engineering Work' },
    companies: { title: 'Target Companies', breadcrumb: 'Career Readiness' },
    resumes: { title: 'Resume & Applications', breadcrumb: 'ATS & Pipeline' },
    'mock-interviews': { title: 'Mock Interviews', breadcrumb: 'Rehearsal Studio' },
    revision: { title: 'Revision Center', breadcrumb: 'Spaced Memory' },
    analytics: { title: 'Analytics', breadcrumb: 'Executive Insights' },
    settings: { title: 'Settings', breadcrumb: 'Preferences & Safety' }
  };

  const currentInfo = titles[activeView] || { title: 'Placement Journey', breadcrumb: 'Overview' };

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    audioService.playClick();
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioService.setEnabled(next);
    if (next) audioService.playSuccess();
  }

  // Sample real deadline notifications
  const notifications = [
    { id: 1, title: 'Roadmap Milestone', text: 'Week 1 Java Foundations tasks due this Sunday', time: '2 days left', type: 'roadmap' },
    { id: 2, title: 'TCS Digital Drive', text: 'College TPO portal registration is now active', time: 'Upcoming', type: 'companies' },
    { id: 3, title: 'Daily Study Target', text: `${Math.max(0, dailyTargetMinutes - todayStudiedMinutes)} minutes remaining today`, time: 'Today', type: 'planner' }
  ];

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        padding: '0 28px',
        backgroundColor: 'var(--bg-topbar)',
        backdropFilter: 'blur(16px) saturate(180%)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-soft)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setIsMobileOpen(prev => !prev)}
          style={{ display: 'none', padding: '6px' }}
          id="mobile-menu-btn"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-primary-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {currentInfo.breadcrumb}
            </span>
          </div>
          <h2 style={{ fontSize: '1.28rem', fontWeight: 600, margin: '1px 0 0 0', letterSpacing: '-0.01em', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            {currentInfo.title}
          </h2>
        </div>
      </div>

      {/* Center: Search Control */}
      <div style={{ position: 'relative', width: '280px', display: 'none' }} id="topbar-search-box">
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input-field"
          placeholder="Search subjects, problems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            paddingLeft: '34px',
            paddingRight: '36px',
            paddingTop: '7px',
            paddingBottom: '7px',
            fontSize: '0.82rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-card-subtle)'
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.68rem',
            padding: '2px 6px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-soft)',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            fontWeight: 700
          }}
        >
          /
        </span>
      </div>

      {/* Right: Status Pills & Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        {/* Days Countdown Pill */}
        <div
          className="badge badge-primary"
          style={{ padding: '5px 11px', fontSize: '0.76rem', gap: '5px', cursor: 'default' }}
          title="Days until target placement drive deadline"
        >
          <Calendar size={13} />
          <span>{daysRemaining} Days</span>
        </div>

        {/* Streak Pill */}
        <div
          className="badge badge-warning"
          style={{ padding: '5px 11px', fontSize: '0.76rem', gap: '5px', cursor: 'default' }}
          title="Daily study streak"
        >
          <Flame size={13} />
          <span>{streakInfo.currentStreak}d Streak</span>
        </div>

        {/* Study Time Pill - Muted Botanical Sage */}
        <div
          className="badge badge-success"
          style={{ padding: '5px 11px', fontSize: '0.76rem', gap: '5px', cursor: 'default' }}
          title="Today's studied time vs daily goal"
        >
          <Clock size={13} />
          <span>{todayStudiedMinutes}m / {dailyTargetMinutes}m</span>
        </div>

        {/* Notifications Popover Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            title="Deadlines & Alerts"
            aria-label="Deadlines and alerts"
            style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={17} />
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)'
              }}
            />
          </button>

          {isNotificationsOpen && (
            <div
              className="card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                padding: '16px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>Upcoming Deadlines</span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '2px' }}
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (onNavigate) onNavigate(n.type);
                      setIsNotificationsOpen(false);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                      <span>{n.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-text)' }}>{n.time}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>{n.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sound Toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          style={{ padding: '8px', borderRadius: '50%' }}
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* Theme Toggle */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          aria-label={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          style={{ padding: '8px', borderRadius: '50%' }}
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Profile Avatar Pill */}
        <button
          className="btn btn-ghost"
          style={{ padding: '3px', borderRadius: '50%', marginLeft: '4px' }}
          onClick={() => onNavigate && onNavigate('settings')}
          title={`${studentName} • Settings`}
          aria-label={`${studentName} Settings`}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: profilePic ? 'none' : 'linear-gradient(135deg, var(--color-primary-blush) 0%, var(--color-primary) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.84rem',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
              overflow: 'hidden',
              border: '1.5px solid var(--border-soft)'
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt={studentName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}

export default Topbar;

import React from 'react';
import {
  BarChart3,
  Clock,
  Code2,
  Brain,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  BookOpen,
  FolderGit2,
  Briefcase
} from 'lucide-react';
import { placementStore } from '../services/placementStore.js';
import { STRIVERS_A2Z_STEPS } from '../data/striversDsaData.js';
import { RS_AGGARWAL_SECTIONS } from '../data/rsAggarwalAptitudeData.js';

export function AnalyticsReports({ data }) {
  const prepCompletion = placementStore.getPreparationCompletion();
  const skillReadiness = placementStore.getSkillReadiness();
  const totalHours = placementStore.getTotalStudiedHours();
  const todayMins = placementStore.getTodayStudiedMinutes();
  const dailyTarget = data?.settings?.dailyTargetMinutes || 120;
  const streakInfo = placementStore.getStreakInfo();

  // Striver DSA Metrics
  const striversProgress = data?.striversProgress || {};
  let totalStriversCount = 0;
  let solvedStriversCount = 0;
  STRIVERS_A2Z_STEPS.forEach(s => {
    s.topics.forEach(t => {
      t.problems.forEach(p => {
        totalStriversCount++;
        if (striversProgress[p.id]?.status === 'Solved') solvedStriversCount++;
      });
    });
  });

  const customProblems = data?.dsaProblems || [];
  const customSolved = customProblems.filter(p => p.status === 'Solved').length;
  const totalDsaSolved = solvedStriversCount + customSolved;

  // Aptitude Metrics (R.S. Aggarwal)
  const aptitudeProgress = data?.aptitudeChapterProgress || {};
  let totalRsChapters = 0;
  let masteredRsChapters = 0;
  RS_AGGARWAL_SECTIONS.forEach(sec => {
    sec.chapters.forEach(c => {
      totalRsChapters++;
      if (aptitudeProgress[c.id]?.status === 'Mastered') masteredRsChapters++;
    });
  });

  // Core CS Metrics
  const coreSubjects = data?.coreSubjects || {};
  const coreSubjectCount = Object.keys(coreSubjects).length;
  let totalCoreTopics = 0;
  let readyCoreTopics = 0;
  Object.values(coreSubjects).forEach(sub => {
    (sub.topics || []).forEach(t => {
      totalCoreTopics++;
      if (t.status === 'Interview-Ready') readyCoreTopics++;
    });
  });

  // Roadmap Metrics
  const roadmapMilestones = data?.roadmap || [];
  const completedMilestones = roadmapMilestones.filter(m => m.completed).length;

  // Applications Funnel
  const applications = data?.jobApplications || [];
  const offerCount = applications.filter(a => a.status === 'Offer').length;
  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;
  const assessmentCount = applications.filter(a => a.status === 'Assessment Scheduled').length;
  const appliedCount = applications.filter(a => a.status === 'Applied').length;

  // 7-day study time history
  const timerSessions = data?.timerSessions || [];
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const daySecs = timerSessions
      .filter(s => s.dateStr === dateStr)
      .reduce((sum, s) => sum + (s.durationSeconds || (s.durationMinutes || 0) * 60), 0);
    const dayMins = Math.round(daySecs / 60);
    last7Days.push({ dateStr, dayName, mins: dayMins });
  }

  const maxDayMins = Math.max(120, ...last7Days.map(d => d.mins));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Top Header */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-primary">Preparation Analytics</span>
          <span className="badge badge-success">Progress Journal</span>
        </div>
        <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
          Placement Preparation Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
          Unified preparation intelligence aggregating Striver's A2Z DSA sheet progress, R.S. Aggarwal aptitude mastery, custom roadmap velocity, and job application outcomes.
        </p>

        {/* High-level KPI Row */}
        <div className="stat-grid-4" style={{ marginTop: '22px', marginBottom: 0 }}>
          <div className="stat-card">
            <span className="stat-card-label">Overall Readiness</span>
            <div className="stat-card-value" style={{ color: 'var(--color-primary-text)' }}>
              {skillReadiness.overallScore}%
            </div>
            <div className="stat-card-sub">Placement interview preparedness</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Total DSA Solved</span>
            <div className="stat-card-value" style={{ color: 'var(--color-sage)' }}>
              {totalDsaSolved}
            </div>
            <div className="stat-card-sub">{solvedStriversCount} Striver + {customSolved} Custom</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Aptitude Mastered</span>
            <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
              {masteredRsChapters} / {totalRsChapters}
            </div>
            <div className="stat-card-sub">R.S. Aggarwal chapters</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Total Study Time</span>
            <div className="stat-card-value" style={{ color: 'var(--color-primary-text)' }}>
              {totalHours} hrs
            </div>
            <div className="stat-card-sub">{streakInfo.currentStreak} day study streak</div>
          </div>
        </div>
      </div>

      {/* 2. Visual Study Velocity: Last 7 Days Histogram */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              7-Day Study Duration Velocity
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Daily recorded focus sprint minutes vs daily {dailyTarget}m target
            </div>
          </div>

          <span className="badge badge-primary">
            Goal: {dailyTarget} mins/day
          </span>
        </div>

        {/* Bar Chart Container */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '16px 8px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)', gap: '12px' }}>
          {last7Days.map((d, idx) => {
            const barHeightPct = Math.min(100, Math.round((d.mins / maxDayMins) * 100));
            const hitTarget = d.mins >= dailyTarget;

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: hitTarget ? 'var(--color-sage)' : 'var(--text-secondary)' }}>
                  {d.mins}m
                </span>

                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${Math.max(6, barHeightPct)}%`,
                    backgroundColor: hitTarget ? 'var(--color-sage)' : 'var(--color-primary)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />

                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {d.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Deep-Dive Domain Matrices */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
        {/* DSA & Striver Sheet Telemetry */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Code2 size={18} color="var(--color-primary-text)" />
            <h3 style={{ fontSize: '1.18rem', margin: 0, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              DSA & TakeUForward Matrix
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Striver A2Z Sheet Completion</span>
                <strong style={{ color: 'var(--color-primary)' }}>{Math.round((solvedStriversCount / (totalStriversCount || 1)) * 100)}%</strong>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-fill" style={{ width: `${Math.round((solvedStriversCount / (totalStriversCount || 1)) * 100)}%` }} />
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {solvedStriversCount} of {totalStriversCount} problems solved across 18 Steps
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Custom Logged</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{customProblems.length}</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total Solved</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-success)' }}>{totalDsaSolved}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Aptitude & Core CS Matrix */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Brain size={18} color="var(--color-accent-violet)" />
            <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Aptitude & Core CS Readiness
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>R.S. Aggarwal Syllabus Covered</span>
                <strong style={{ color: 'var(--color-accent-violet)' }}>{Math.round((masteredRsChapters / (totalRsChapters || 1)) * 100)}%</strong>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div className="progress-fill" style={{ width: `${Math.round((masteredRsChapters / (totalRsChapters || 1)) * 100)}%`, background: 'var(--color-accent-violet)' }} />
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {masteredRsChapters} of {totalRsChapters} chapters mastered across Arithmetic & DI
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
              <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Core Subjects</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{coreSubjectCount} Subjects</strong>
              </div>

              <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Interview Ready</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-success)' }}>{readyCoreTopics} Topics</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Job Applications Funnel */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Briefcase size={18} color="var(--color-success)" />
            <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Application Conversion Pipeline
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <span>Total Applications Sent</span>
              <strong>{applications.length}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <span>Online Assessments (OA)</span>
              <strong style={{ color: 'var(--color-warning)' }}>{assessmentCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
              <span>Interviews Scheduled</span>
              <strong style={{ color: 'var(--color-primary)' }}>{interviewCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', border: '1px solid var(--color-success-border)' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>Final Offers Received</span>
              <strong style={{ color: 'var(--color-success)' }}>{offerCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

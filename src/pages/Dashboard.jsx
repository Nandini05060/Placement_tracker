import React, { useState } from 'react';
import {
  Clock,
  Code2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Brain,
  Briefcase,
  Layers,
  Award,
  Play,
  Flame,
  Plus,
  RefreshCw
} from 'lucide-react';
import audioService from '../services/audioService.js';
import { placementStore } from '../services/placementStore.js';
import { getTodayString } from '../data/defaultData.js';

export function Dashboard({ data, store = placementStore, onNavigate, setActiveView }) {
  const navigate = onNavigate || setActiveView || (() => {});
  const todayStr = getTodayString();

  // Dynamic greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  const todayDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // State metrics
  const streakInfo = store.getStreakInfo();
  const todayStudiedMinutes = store.getTodayStudiedMinutes();
  const dailyTargetMinutes = data.settings?.dailyTargetMinutes || 120;
  const remainingMinutes = Math.max(0, dailyTargetMinutes - todayStudiedMinutes);
  const studyPct = Math.min(100, Math.round((todayStudiedMinutes / dailyTargetMinutes) * 100));

  const daysRemaining = store.getDaysRemaining();
  const solvedDsa = store.getUniqueSolvedDsaCount();
  const dsaTarget = data.settings?.dsaTarget || 80;
  const dsaPct = Math.min(100, Math.round((solvedDsa / dsaTarget) * 100));

  const prepCompletion = store.getPreparationCompletion();
  const skillReadiness = store.getSkillReadiness();

  // Tasks
  const dailyTasks = data.dailyTasks || [];
  const todayTasks = dailyTasks.filter(t => t.date === todayStr);

  function handleCompleteTask(taskId) {
    store.updateTask(taskId, { completed: true, completedAt: new Date().toISOString() });
    audioService.playSuccess();
  }

  const studentName = data?.settings?.studentName || 'Nandini';

  // Custom user-defined roadmap handling
  const customRoadmap = data.roadmap || [];
  const totalMilestones = customRoadmap.length;
  const completedMilestones = customRoadmap.filter(m => m.completed).length;
  const roadmapPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : prepCompletion.percentage;
  const nextMilestone = customRoadmap.find(m => !m.completed);

  // Next Upcoming Task (from custom roadmap or default)
  const defaultNextAction = store.getRecommendedNextAction();
  const activeNextTitle = nextMilestone ? nextMilestone.title : defaultNextAction.taskText;
  const activeNextCategory = nextMilestone ? (nextMilestone.category || 'Roadmap Milestone') : defaultNextAction.subjectKey;
  const activeNextDetail = nextMilestone ? (nextMilestone.description || `Target: ${nextMilestone.targetDate || 'Upcoming'}`) : 'First uncompleted syllabus milestone.';

  // Striver's DSA solved count
  const striverSolvedCount = Object.values(data.striversProgress || {}).filter(Boolean).length;

  // R.S. Aggarwal mastered chapters count
  const rsAggarwalMastered = Object.values(data.aptitudeChapterProgress || {}).filter(c => c.status === 'Mastered').length;

  // 7 Structured Preparation Categories (Deterministic from state)
  const dsaProgress = dsaTarget > 0 ? Math.min(100, Math.round((solvedDsa / dsaTarget) * 100)) : 0;

  const aptiSessions = data.aptitudeSessions || [];
  const aptiAttempted = aptiSessions.reduce((sum, s) => sum + (parseInt(s.attempted, 10) || 0), 0);
  const aptiCorrect = aptiSessions.reduce((sum, s) => sum + (parseInt(s.correct, 10) || 0), 0);
  const aptiProgress = skillReadiness.breakdown?.aptitude?.score || (aptiAttempted > 0 ? Math.round((aptiCorrect / aptiAttempted) * 100) : 0);

  let totalCoreTopics = 0;
  let completedCoreTopics = 0;
  Object.values(data.coreSubjects || {}).forEach(sub => {
    (sub.topics || []).forEach(t => {
      totalCoreTopics++;
      if (t.status === 'Interview-Ready' && t.interviewReadyAssessed) completedCoreTopics++;
    });
  });
  const coreProgress = skillReadiness.breakdown?.coreCs?.score || (totalCoreTopics > 0 ? Math.round((completedCoreTopics / totalCoreTopics) * 100) : 0);

  let totalProjMilestones = 0;
  let completedProjMilestones = 0;
  (data.projects || []).forEach(p => {
    (p.milestones || []).forEach(m => {
      totalProjMilestones++;
      if (m.status === 'Completed') completedProjMilestones++;
    });
  });
  const projectProgress = skillReadiness.breakdown?.projects?.score || (totalProjMilestones > 0 ? Math.round((completedProjMilestones / totalProjMilestones) * 100) : 0);

  const softSkillsList = data.softSkills || [];
  const totalSoftSkills = softSkillsList.length;
  const softPracticedCount = softSkillsList.filter(s => s.lastPractice && s.confidence > 0).length;
  const softProgress = skillReadiness.breakdown?.softSkills?.score || 0;

  const atsList = data.atsChecklist || [];
  const atsCheckedCount = atsList.filter(a => a.checked).length;
  const mockInterviewCount = (data.mockInterviews?.sessions || []).length;
  const resumeProgress = atsList.length > 0 ? Math.round((atsCheckedCount / atsList.length) * 100) : 0;

  const certs = data.certifications || [];
  const totalCerts = certs.length;
  const coursesCompleted = certs.filter(c => c.status === 'Completed' || (c.modulesCompleted > 0 && c.modulesCompleted === c.totalModules)).length;
  const certsEarned = certs.filter(c => c.certificateEarned).length;
  const certProgress = skillReadiness.breakdown?.certs?.score || (totalCerts > 0 ? Math.round((certsEarned / totalCerts) * 100) : 0);

  const categoriesProgress = [
    {
      name: 'Striver A2Z & DSA',
      score: dsaProgress,
      detail: `${solvedDsa} custom • ${striverSolvedCount} Striver sheet solved`,
      icon: Code2,
      route: 'dsa'
    },
    {
      name: 'Aptitude (R.S. Aggarwal)',
      score: aptiProgress,
      detail: `${rsAggarwalMastered}/39 chapters mastered • 30m daily timer`,
      icon: Brain,
      route: 'aptitude'
    },
    {
      name: 'Core CS Subjects',
      score: coreProgress,
      detail: `${completedCoreTopics} of ${totalCoreTopics} topics interview-ready`,
      icon: BookOpen,
      route: 'core-cs'
    },
    {
      name: 'Project Engineering',
      score: projectProgress,
      detail: `${completedProjMilestones} of ${totalProjMilestones} milestones completed`,
      icon: Layers,
      route: 'projects'
    },
    {
      name: 'Soft Skills & HR',
      score: softProgress,
      detail: `${softPracticedCount} of ${totalSoftSkills} competencies practiced`,
      icon: Users,
      route: 'soft-skills'
    },
    {
      name: 'Resume & Interviews',
      score: resumeProgress,
      detail: `${atsCheckedCount} of ${atsList.length} ATS items verified`,
      icon: Briefcase,
      route: 'resumes'
    },
    {
      name: 'Courses & Certifications',
      score: certProgress,
      detail: `${coursesCompleted} completed • ${certsEarned} earned`,
      icon: Award,
      route: 'certifications'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* 1. EDITORIAL WELCOME CARD WITH PHOTOGRAPHY */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          background: 'var(--bg-card)'
        }}
      >
        <div style={{ flex: '1 1 340px', minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {studentName} • Placement Journal
            </span>
            <span style={{ color: 'var(--border-soft)' }}>•</span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{todayDateFormatted}</span>
            <span className="badge badge-lavender" style={{ fontSize: '0.72rem', fontStyle: 'italic' }}>
              🌿 small steps, meaningful progress • go at your own pace
            </span>
          </div>

          <h1 style={{ fontSize: '2.15rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 6px 0', letterSpacing: '-0.015em', fontFamily: 'var(--font-heading)', lineHeight: 1.15 }}>
            {greeting}, {studentName}.
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', fontWeight: 400, maxWidth: '580px', lineHeight: 1.55 }}>
            Here is your daily preparation overview. Consistent, gentle practice is the foundation of placement success.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                backgroundColor: 'var(--bg-card-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-soft)'
              }}
            >
              <div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>
                  Target Placement Window
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                  {daysRemaining} Days
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-soft)', paddingLeft: '12px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Target: {data.settings?.targetDeadline || '2026-12-31'}
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('planner')}
              style={{ fontSize: '0.78rem' }}
            >
              <Calendar size={13} />
              <span>Today's Journal</span>
            </button>
          </div>
        </div>

        {/* Sunlit Study Desk Photograph Frame */}
        <div
          style={{
            position: 'relative',
            width: '280px',
            maxWidth: '100%',
            height: '155px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}
        >
          <img
            src="/images/dashboard_study_desk.jpg"
            alt="Sunlit study desk with open notebook, flowers, coffee, and morning light"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            loading="eager"
          />
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(255, 252, 248, 0.88)',
              backdropFilter: 'blur(6px)',
              padding: '3px 9px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.68rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              border: '1px solid rgba(232, 222, 212, 0.7)'
            }}
          >
            ☕ Morning focus
          </div>
        </div>
      </div>

      {/* 2. FIVE ESSENTIAL KPIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        {/* KPI 1: Roadmap Completion */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Roadmap Completion
          </div>
          <div style={{ fontSize: '2.05rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            {roadmapPct}%
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {totalMilestones > 0 ? `${completedMilestones} of ${totalMilestones} custom milestones` : `${prepCompletion.completedWeeks} of 24 curriculum weeks`}
          </div>
          <div className="progress-bar-bg" style={{ height: '4px', marginTop: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${roadmapPct}%`, backgroundColor: 'var(--color-primary)' }} />
          </div>
        </div>

        {/* KPI 2: Skill Readiness */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Skill Readiness
          </div>
          <div style={{ fontSize: '2.05rem', fontWeight: 600, color: skillReadiness.isAssessed ? 'var(--color-sage)' : 'var(--text-muted)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            {skillReadiness.isAssessed ? `${skillReadiness.overallScore}%` : 'Not Assessed'}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {skillReadiness.isAssessed ? 'Demonstrated scores' : 'Requires verified assessments'}
          </div>
          <div className="progress-bar-bg" style={{ height: '4px', marginTop: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${skillReadiness.overallScore || 0}%`, backgroundColor: 'var(--color-sage)' }} />
          </div>
        </div>

        {/* KPI 3: Study Time Today */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Study Time Today
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              {dailyTargetMinutes}m Goal
            </span>
          </div>
          <div style={{ fontSize: '2.05rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            {todayStudiedMinutes} / {dailyTargetMinutes}m
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {remainingMinutes > 0 ? `${remainingMinutes}m remaining` : 'Daily goal achieved!'}
          </div>
          <div className="progress-bar-bg" style={{ height: '4px', marginTop: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${studyPct}%`, backgroundColor: studyPct >= 100 ? 'var(--color-sage)' : 'var(--color-primary)' }} />
          </div>
        </div>

        {/* KPI 4: DSA Questions Solved */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DSA Questions Solved
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              Target: {dsaTarget}
            </span>
          </div>
          <div style={{ fontSize: '2.05rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
            {solvedDsa} / {dsaTarget}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {dsaPct}% completed
          </div>
          <div className="progress-bar-bg" style={{ height: '4px', marginTop: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${dsaPct}%`, backgroundColor: 'var(--color-sage)' }} />
          </div>
        </div>

        {/* KPI 5: Current Streak */}
        <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Current Streak
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={22} style={{ color: streakInfo.currentStreak > 0 ? '#C48E48' : 'var(--text-muted)' }} />
            <span style={{ fontSize: '2.05rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
              {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Best record: {streakInfo.bestStreak || 0} days
          </div>
          <div className="progress-bar-bg" style={{ height: '4px', marginTop: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, (streakInfo.currentStreak / 7) * 100)}%`, backgroundColor: 'var(--color-warning)' }} />
          </div>
        </div>
      </div>

      {/* 3. TWO CLEAN OPERATIONAL CARDS: Today's Study Plan (Left) & Next Upcoming Task (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* LEFT: Today's Study Plan */}
        <div className="card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.24rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 2px 0', fontFamily: 'var(--font-heading)' }}>
                Today's Study Plan
              </h2>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {todayTasks.filter(t => t.completed).length} of {todayTasks.length} tasks completed
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('planner')}>
                <Plus size={13} />
                <span>Add Task</span>
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('timer')} title="Open Focus Timer">
                <Play size={12} fill="currentColor" />
                <span>Timer</span>
              </button>
            </div>
          </div>

          {todayTasks.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)', margin: 'auto 0' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--color-sage)', marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>No pending tasks for today</div>
              <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>Click "Add Task" to plan today's focus topics.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: task.completed ? 'transparent' : 'var(--bg-main)',
                    border: '1px solid var(--border-soft)',
                    opacity: task.completed ? 0.6 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={task.completed}
                      style={{ padding: '2px', color: task.completed ? 'var(--color-sage)' : 'var(--border-soft)' }}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 500,
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden'
                        }}
                      >
                        {task.text}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {task.category} • {task.plannedMinutes || 30} mins
                      </div>
                    </div>
                  </div>

                  {!task.completed && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate('timer')}
                      title="Start Timer"
                      style={{ color: 'var(--color-primary-text)', padding: '4px' }}
                    >
                      <Play size={13} fill="currentColor" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Next Upcoming Task */}
        <div className="card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.24rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 2px 0', fontFamily: 'var(--font-heading)' }}>
                Next Upcoming Milestone
              </h2>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                {totalMilestones > 0 ? 'Your personal placement roadmap' : 'Placement curriculum milestone'}
              </div>
            </div>
            <span className="badge badge-primary">{nextMilestone ? `Milestone #${nextMilestone.id}` : `Week ${defaultNextAction.weekNum}`}</span>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-soft)',
              marginBottom: '14px'
            }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-primary-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {activeNextCategory}
            </div>
            <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.35, fontFamily: 'var(--font-heading)' }}>
              {activeNextTitle}
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 16px 0' }}>
            {activeNextDetail}
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('roadmap')}
              style={{ flex: 1 }}
            >
              <span>Open Roadmap Manager</span>
              <ArrowRight size={14} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('timer')}
              title="Start timed study session"
            >
              <Clock size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ONE SIMPLE OVERALL PROGRESS VISUALIZATION (Clean & minimal) */}
      <div className="card" style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 2px 0', fontFamily: 'var(--font-heading)' }}>
              Overall Preparation Progress
            </h2>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Milestone completion across all 7 placement preparation tracks
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('analytics')}>
            <span>Full Analytics Report</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {categoriesProgress.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => navigate(cat.route)}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon size={14} style={{ color: 'var(--color-primary-text)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-main)' }}>{cat.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', color: cat.score >= 50 ? 'var(--color-sage)' : 'var(--color-primary-text)', fontFamily: 'var(--font-heading)' }}>
                    {cat.score}%
                  </span>
                </div>

                <div className="progress-bar-bg" style={{ height: '4px', marginBottom: '6px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${cat.score}%`,
                      backgroundColor: cat.score >= 50 ? 'var(--color-sage)' : 'var(--color-primary)'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {cat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

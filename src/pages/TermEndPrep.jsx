import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Timer,
  Sparkles,
  BookOpen,
  Award,
  Search,
  FileText,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  Filter,
  Layers,
  Cpu,
  Code2,
  Brain,
  Leaf,
  HeartHandshake,
  Edit3,
  Save,
  Coffee,
  Lightbulb,
  CheckSquare,
  Square,
  BarChart2,
  ArrowRight
} from 'lucide-react';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';
import {
  TERM_END_SUBJECTS,
  MOTIVATIONAL_EXAM_QUOTES
} from '../data/termEndSyllabusData.js';

export function TermEndPrep({ data, store, onNavigate }) {
  // Persistence state from placementStore
  const termEndState = data?.termEndPrep || {
    completedExams: {},
    completedTopics: {},
    completedUnits: {},
    unitConfidence: {},
    subjectNotes: {},
    examTargetNotes: {}
  };

  const completedExams = termEndState.completedExams || {};
  const completedTopics = termEndState.completedTopics || {};
  const completedUnits = termEndState.completedUnits || {};
  const unitConfidence = termEndState.unitConfidence || {};
  const subjectNotes = termEndState.subjectNotes || {};

  // Active Subject selection for Syllabus
  const [selectedSubjectId, setSelectedSubjectId] = useState('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUnits, setExpandedUnits] = useState({
    ai_u1: true,
    ai_u2: true,
    se_u1: true,
    os_u1: true,
    ivp_u2: true,
    ivp_u8: true,
    set_u1: true,
    lls_u1: true
  });

  // Timetable view mode: 'cards' or 'compact-table'
  const [timetableView, setTimetableView] = useState('cards');

  // Active Tab for extra sections: 'syllabus' | 'blueprint' | 'notepad' | 'checklist'
  const [activeTab, setActiveTab] = useState('syllabus');

  // Study Timer State
  const [isTimerOpen, setIsTimerOpen] = useState(true);
  const [timerSubjectId, setTimerSubjectId] = useState('ai');
  const [timerUnitId, setTimerUnitId] = useState('all');
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [timerRemaining, setTimerRemaining] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isBreakMode, setIsBreakMode] = useState(false);
  const [sessionsCompletedToday, setSessionsCompletedToday] = useState(0);
  const timerAnchorRef = useRef(null);

  // Subject Notes State
  const [notesDraft, setNotesDraft] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  // Sync draft notes when subject changes
  useEffect(() => {
    setNotesDraft(subjectNotes[selectedSubjectId] || '');
  }, [selectedSubjectId, subjectNotes]);

  // Current Subject Object
  const currentSubject = TERM_END_SUBJECTS.find(s => s.id === selectedSubjectId) || TERM_END_SUBJECTS[0];

  // Timer execution with drift immunity
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      if (!timerAnchorRef.current) {
        timerAnchorRef.current = {
          start: Date.now(),
          initialRemaining: timerRemaining
        };
      }

      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerAnchorRef.current.start) / 1000);
        const nextRemaining = timerAnchorRef.current.initialRemaining - elapsed;

        if (nextRemaining <= 0) {
          setTimerRemaining(0);
          setIsTimerRunning(false);
          timerAnchorRef.current = null;
          handleTimerSessionComplete();
        } else {
          setTimerRemaining(nextRemaining);
        }
      }, 500);
    } else {
      timerAnchorRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  function handleTimerSessionComplete() {
    audioService.playTimerBell();

    if (isBreakMode) {
      setIsBreakMode(false);
      setTimerDuration(25 * 60);
      setTimerRemaining(25 * 60);
    } else {
      const subjectObj = TERM_END_SUBJECTS.find(s => s.id === timerSubjectId) || currentSubject;
      const unitObj = subjectObj.units.find(u => u.id === timerUnitId);
      const sessionMinutes = Math.round(timerDuration / 60);

      // Record in store so it reflects in overall study stats & streak
      store.addTimerSession({
        subject: `Semester V: ${subjectObj.name}`,
        taskName: unitObj ? `${unitObj.title}` : `Exam Prep: ${subjectObj.name}`,
        durationMinutes: sessionMinutes,
        durationSeconds: timerDuration,
        dateStr: getTodayString()
      });

      setSessionsCompletedToday(prev => prev + 1);
      setIsBreakMode(true);
      setTimerDuration(5 * 60);
      setTimerRemaining(5 * 60);
    }
  }

  function startTimer() {
    audioService.playClick();
    setIsTimerRunning(true);
  }

  function pauseTimer() {
    audioService.playClick();
    setIsTimerRunning(false);
  }

  function resetTimer() {
    audioService.playClick();
    setIsTimerRunning(false);
    timerAnchorRef.current = null;
    setTimerRemaining(timerDuration);
  }

  function setPresetMinutes(mins) {
    audioService.playClick();
    setIsTimerRunning(false);
    setIsBreakMode(false);
    timerAnchorRef.current = null;
    const secs = mins * 60;
    setTimerDuration(secs);
    setTimerRemaining(secs);
  }

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Exam completion toggle
  function handleToggleExam(subjectId) {
    store.toggleTermEndExamCompleted(subjectId);
    audioService.playSuccess();
  }

  // Topic completion toggle
  function handleToggleTopic(topicKey) {
    audioService.playClick();
    store.toggleTermEndTopic(topicKey);
  }

  // Unit completion toggle (checks/unchecks all topics in unit)
  function handleToggleUnit(unit) {
    const isCurrentlyDone = !!completedUnits[unit.id];
    const targetState = !isCurrentlyDone;
    const topicKeys = unit.topics.map((_, idx) => `${unit.id}_t${idx}`);

    store.toggleTermEndUnit(unit.id, topicKeys, targetState);
    if (targetState) {
      audioService.playSuccess();
    } else {
      audioService.playClick();
    }
  }

  // Save notes
  function handleSaveNotes() {
    store.updateTermEndSubjectNotes(selectedSubjectId, notesDraft);
    audioService.playSuccess();
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2500);
  }

  // Calculate Days Remaining to an exam date
  function getDaysToExam(dateStr) {
    const examDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Calculate Overall Statistics
  let totalExamsCount = TERM_END_SUBJECTS.length;
  let clearedExamsCount = 0;
  let totalUnitsCount = 0;
  let completedUnitsCount = 0;
  let totalTopicsCount = 0;
  let completedTopicsCount = 0;

  TERM_END_SUBJECTS.forEach(sub => {
    if (completedExams[sub.id]) clearedExamsCount++;
    (sub.units || []).forEach(unit => {
      totalUnitsCount++;
      let unitTopicsDone = 0;
      (unit.topics || []).forEach((_, tIdx) => {
        totalTopicsCount++;
        const tKey = `${unit.id}_t${tIdx}`;
        if (completedTopics[tKey]) {
          completedTopicsCount++;
          unitTopicsDone++;
        }
      });
      if (completedUnits[unit.id] || (unit.topics.length > 0 && unitTopicsDone === unit.topics.length)) {
        completedUnitsCount++;
      }
    });
  });

  const overallSyllabusPct = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;
  const examCompletionPct = Math.round((clearedExamsCount / totalExamsCount) * 100);

  // Subject-specific completion stats
  function getSubjectProgress(sub) {
    let tCount = 0;
    let tDone = 0;
    let uDone = 0;

    (sub.units || []).forEach(u => {
      let thisUnitDone = 0;
      (u.topics || []).forEach((_, idx) => {
        tCount++;
        if (completedTopics[`${u.id}_t${idx}`]) {
          tDone++;
          thisUnitDone++;
        }
      });
      if (completedUnits[u.id] || (u.topics.length > 0 && thisUnitDone === u.topics.length)) {
        uDone++;
      }
    });

    const pct = tCount > 0 ? Math.round((tDone / tCount) * 100) : 0;
    return { tCount, tDone, uDone, totalUnits: sub.units.length, pct };
  }

  // Filtered units based on search query
  const filteredUnits = (currentSubject.units || []).filter(unit => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchUnitTitle = unit.title.toLowerCase().includes(query);
    const matchDesc = unit.description?.toLowerCase().includes(query);
    const matchTopics = unit.topics.some(t => t.toLowerCase().includes(query));
    return matchUnitTitle || matchDesc || matchTopics;
  });

  // Motivational quote of the day
  const quoteOfTheDay = MOTIVATIONAL_EXAM_QUOTES[0];

  return (
    <div className="term-end-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Banner with Soft Botanical Aesthetic */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(201, 143, 136, 0.14) 0%, rgba(139, 150, 124, 0.12) 100%)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-xs)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-pale)',
                  color: 'var(--color-primary-text)',
                  border: '1px solid var(--color-primary-blush)'
                }}
              >
                Semester V • End-Sem War Room 🌸
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Official Syllabus & Schedule
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--text-main)',
                margin: '0 0 6px 0',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}
            >
              Term End Preparation Hub
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
              Your cute command center for all 6 semester papers. Track exam dates, tick off syllabus units topic-by-topic, and study with focused sprint timers.
            </p>
          </div>

          {/* Quick Metrics Cluster */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Exams Cleared */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                minWidth: '120px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Exams Done
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-sage)', marginTop: '2px' }}>
                {clearedExamsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalExamsCount}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {examCompletionPct}% Cleared
              </div>
            </div>

            {/* Syllabus Coverage */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                minWidth: '135px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Syllabus Done
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-primary-text)', marginTop: '2px' }}>
                {overallSyllabusPct}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {completedTopicsCount} / {totalTopicsCount} topics
              </div>
            </div>

            {/* First Exam Countdown */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                minWidth: '130px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                First Exam
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#C48E48', marginTop: '2px' }}>
                {Math.max(0, getDaysToExam('2026-11-19'))} <span style={{ fontSize: '0.85rem' }}>Days</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                19 Nov • AI
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote Strip */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px dashed var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            fontFamily: 'var(--font-accent)'
          }}
        >
          <Sparkles size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span>{quoteOfTheDay}</span>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: CUTE TIMETABLE (WITH EXAM DATES & TICK WHEN COMPLETED)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-soft)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>📅</span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--text-main)',
                  margin: 0,
                  fontWeight: 700
                }}
              >
                Cute Term End Timetable
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Tick the checkbox in front of each subject once your exam is complete. Click any card to explore its syllabus!
            </p>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => {
                audioService.playClick();
                setTimetableView('cards');
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-soft)',
                cursor: 'pointer',
                backgroundColor: timetableView === 'cards' ? 'var(--color-primary-pale)' : 'transparent',
                color: timetableView === 'cards' ? 'var(--color-primary-text)' : 'var(--text-secondary)'
              }}
            >
              Cute Cards 🌸
            </button>
            <button
              onClick={() => {
                audioService.playClick();
                setTimetableView('compact-table');
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-soft)',
                cursor: 'pointer',
                backgroundColor: timetableView === 'compact-table' ? 'var(--color-primary-pale)' : 'transparent',
                color: timetableView === 'compact-table' ? 'var(--color-primary-text)' : 'var(--text-secondary)'
              }}
            >
              Table View 📋
            </button>
          </div>
        </div>

        {/* Timetable Progress Bar */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>Exam Schedule Progress</span>
            <span style={{ fontWeight: 600 }}>{clearedExamsCount} of {totalExamsCount} Exams Completed ({examCompletionPct}%)</span>
          </div>
          <div
            style={{
              height: '8px',
              backgroundColor: 'var(--bg-card-elevated)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${examCompletionPct}%`,
                backgroundColor: 'var(--color-sage)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* 1. CARDS VIEW */}
        {timetableView === 'cards' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}
          >
            {TERM_END_SUBJECTS.map((sub, index) => {
              const isCleared = !!completedExams[sub.id];
              const daysLeft = getDaysToExam(sub.examDate);
              const isSelected = selectedSubjectId === sub.id;
              const subProgress = getSubjectProgress(sub);

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setTimerSubjectId(sub.id);
                  }}
                  style={{
                    backgroundColor: isCleared
                      ? 'var(--color-sage-bg)'
                      : isSelected
                      ? 'var(--bg-card)'
                      : 'var(--bg-card)',
                    border: isCleared
                      ? '1px solid var(--color-sage-border)'
                      : isSelected
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--border-soft)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)'
                  }}
                >
                  {/* Top Row: TICK OPTION + DATE BADGE */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    
                    {/* Cute Tick Button in front */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExam(sub.id);
                      }}
                      title={isCleared ? 'Mark as Not Completed' : 'Mark Exam as Cleared!'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: isCleared
                          ? '1px solid var(--color-sage)'
                          : '1px solid var(--border-soft)',
                        backgroundColor: isCleared ? 'var(--color-sage)' : 'var(--bg-input)',
                        color: isCleared ? '#FFFFFF' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isCleared ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>Cleared! 🎉</span>
                        </>
                      ) : (
                        <>
                          <Square size={13} strokeWidth={2} />
                          <span>Tick when done</span>
                        </>
                      )}
                    </button>

                    {/* Cute Date Pill */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: sub.accentBg,
                        border: `1px solid ${sub.accentBorder}`,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: sub.color
                      }}
                    >
                      <Calendar size={13} />
                      <span>{sub.displayDate}</span>
                    </div>
                  </div>

                  {/* Subject Name & Details */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{sub.iconEmoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          color: isCleared ? 'var(--text-secondary)' : 'var(--text-main)',
                          textDecoration: isCleared ? 'line-through' : 'none'
                        }}
                      >
                        {sub.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {sub.code} • {sub.dayName} • {sub.timeSlot}
                      </div>
                    </div>
                  </div>

                  {/* Special Weightage Badge (e.g. IVP marks note) */}
                  {sub.weightageNote && (
                    <div
                      style={{
                        margin: '8px 0',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--color-warning-bg)',
                        border: '1px solid var(--color-warning-border)',
                        color: '#9E6A1B',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Sparkles size={12} />
                      <span>{sub.weightageNote} (High Scoring!)</span>
                    </div>
                  )}

                  {/* Syllabus Progress Mini-bar */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Syllabus Covered</span>
                      <span style={{ fontWeight: 600 }}>{subProgress.pct}% ({subProgress.uDone}/{subProgress.totalUnits} Units)</span>
                    </div>
                    <div
                      style={{
                        height: '5px',
                        backgroundColor: 'var(--bg-card-elevated)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${subProgress.pct}%`,
                          backgroundColor: sub.color,
                          borderRadius: 'var(--radius-full)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Footer: Countdown or Status */}
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '10px',
                      borderTop: '1px dashed var(--border-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>
                      {sub.units.length} Units • {subProgress.tCount} Topics
                    </span>

                    {isCleared ? (
                      <span style={{ color: 'var(--color-sage)', fontWeight: 700 }}>
                        Exam Finished ✨
                      </span>
                    ) : daysLeft > 0 ? (
                      <span
                        style={{
                          fontWeight: 700,
                          color: daysLeft <= 7 ? 'var(--color-danger)' : 'var(--text-secondary)',
                          backgroundColor: daysLeft <= 7 ? 'var(--color-danger-bg)' : 'var(--bg-card-elevated)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)'
                        }}
                      >
                        ⏳ {daysLeft} Days to go
                      </span>
                    ) : daysLeft === 0 ? (
                      <span style={{ fontWeight: 700, color: 'var(--color-primary-text)' }}>
                        🔥 Exam is Today!
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Exam Passed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. COMPACT TABLE VIEW */}
        {timetableView === 'compact-table' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-soft)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 14px', width: '130px' }}>Status / Done</th>
                  <th style={{ padding: '10px 14px' }}>Date</th>
                  <th style={{ padding: '10px 14px' }}>Subject</th>
                  <th style={{ padding: '10px 14px' }}>Time Slot</th>
                  <th style={{ padding: '10px 14px' }}>Syllabus</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Countdown</th>
                </tr>
              </thead>
              <tbody>
                {TERM_END_SUBJECTS.map((sub) => {
                  const isCleared = !!completedExams[sub.id];
                  const daysLeft = getDaysToExam(sub.examDate);
                  const subProgress = getSubjectProgress(sub);

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      style={{
                        borderBottom: '1px solid var(--border-soft)',
                        backgroundColor: isCleared ? 'var(--color-sage-bg)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Checkbox Tick Column */}
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExam(sub.id);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            border: isCleared ? '1px solid var(--color-sage)' : '1px solid var(--border-soft)',
                            backgroundColor: isCleared ? 'var(--color-sage)' : 'var(--bg-input)',
                            color: isCleared ? '#FFFFFF' : 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {isCleared ? <Check size={12} strokeWidth={3} /> : <Square size={12} />}
                          <span>{isCleared ? 'Cleared' : 'Mark done'}</span>
                        </button>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: sub.color }}>
                        {sub.displayDate} ({sub.dayName.slice(0, 3)})
                      </td>

                      {/* Subject Name */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{sub.iconEmoji}</span>
                          <span style={{ fontWeight: 600, textDecoration: isCleared ? 'line-through' : 'none' }}>
                            {sub.name}
                          </span>
                          {sub.weightageNote && (
                            <span style={{ fontSize: '0.72rem', color: '#9E6A1B', backgroundColor: 'var(--color-warning-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                              ±5 Margin
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {sub.timeSlot}
                      </td>

                      {/* Syllabus Progress */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 600, color: sub.color }}>{subProgress.pct}%</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '6px' }}>
                          ({subProgress.uDone}/{subProgress.totalUnits} Units)
                        </span>
                      </td>

                      {/* Countdown */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {isCleared ? (
                          <span style={{ color: 'var(--color-sage)', fontWeight: 600 }}>Cleared 🎉</span>
                        ) : (
                          <span style={{ fontWeight: 600, color: daysLeft <= 7 ? 'var(--color-danger)' : 'var(--text-main)' }}>
                            {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? 'Today!' : 'Passed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 2: CUTE STUDY TIMER (CUSTOMIZABLE, SUBJECT-LINKED, AUDIBLE)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-soft)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isTimerOpen ? '20px' : 0,
            cursor: 'pointer'
          }}
          onClick={() => setIsTimerOpen(!isTimerOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-pale)',
                color: 'var(--color-primary-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              <Timer size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  color: 'var(--text-main)',
                  margin: 0,
                  fontWeight: 700
                }}
              >
                End-Sem Focus Study Timer
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isBreakMode ? '☕ Break Time — Relax your eyes!' : `Focus Sprint for ${currentSubject.name}`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {sessionsCompletedToday > 0 && (
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--color-sage)',
                  backgroundColor: 'var(--color-sage-bg)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                ✨ {sessionsCompletedToday} Sprints Completed Today
              </span>
            )}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              {isTimerOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {isTimerOpen && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              alignItems: 'center',
              paddingTop: '8px'
            }}
          >
            {/* Left: Timer Display & Controls */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-main)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-soft)'
              }}
            >
              {/* Timer Digits */}
              <div
                style={{
                  fontSize: '3.6rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: isBreakMode ? 'var(--color-sage)' : 'var(--color-primary-text)',
                  letterSpacing: '2px',
                  lineHeight: 1
                }}
              >
                {formatTime(timerRemaining)}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {isBreakMode
                  ? '🌸 Short restorative break'
                  : `Currently Studying: ${TERM_END_SUBJECTS.find(s => s.id === timerSubjectId)?.name || 'Semester Subject'}`}
              </div>

              {/* Play / Pause / Reset Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px' }}>
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Play size={18} fill="#FFFFFF" />
                    <span>Start Focus</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 24px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#C48E48',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Pause size={18} />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={resetTimer}
                  title="Reset Timer"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Presets Row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                {[
                  { label: '25m Sprint 🌸', mins: 25 },
                  { label: '45m Deep Dive 🍵', mins: 45 },
                  { label: '60m Marathon 📚', mins: 60 },
                  { label: '90m End-Sem ⚡', mins: 90 }
                ].map((preset) => (
                  <button
                    key={preset.mins}
                    onClick={() => setPresetMinutes(preset.mins)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-soft)',
                      backgroundColor: timerDuration === preset.mins * 60 && !isBreakMode ? 'var(--color-primary-pale)' : 'var(--bg-card)',
                      color: timerDuration === preset.mins * 60 && !isBreakMode ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Timer Options & Subject Linking */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Choose Subject to Study:
                </label>
                <select
                  value={timerSubjectId}
                  onChange={(e) => {
                    setTimerSubjectId(e.target.value);
                    setSelectedSubjectId(e.target.value);
                    setTimerUnitId('all');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-soft)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  {TERM_END_SUBJECTS.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.iconEmoji} {sub.name} ({sub.displayDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Specific Unit (Optional):
                </label>
                <select
                  value={timerUnitId}
                  onChange={(e) => setTimerUnitId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-soft)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                >
                  <option value="all">Entire Subject / General Revision</option>
                  {(TERM_END_SUBJECTS.find(s => s.id === timerSubjectId)?.units || []).map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Tip Box */}
              <div
                style={{
                  backgroundColor: 'var(--color-sage-bg)',
                  border: '1px solid var(--color-sage-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)'
                }}
              >
                <Lightbulb size={18} color="var(--color-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-botanical-dark)', marginBottom: '2px' }}>
                    Active Recall Technique:
                  </div>
                  <span>
                    Spend the first 20 minutes memorizing and deriving, then close your notebook and try writing the concept from memory for 5 minutes!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: SUBJECT WISE UNIT NAME & SYLLABUS EXPLORER (CORE REQUEST)
          ========================================================================= */}
      <section
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-soft)',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {/* Navigation Tabs for Subjects */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>📖</span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--text-main)',
                  margin: 0,
                  fontWeight: 700
                }}
              >
                Subject-wise Syllabus & Unit Tracker
              </h2>
            </div>

            {/* Quick Section Switcher */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('syllabus');
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'syllabus' ? 'var(--color-primary-pale)' : 'transparent',
                  color: activeTab === 'syllabus' ? 'var(--color-primary-text)' : 'var(--text-secondary)'
                }}
              >
                Units & Topics 📚
              </button>
              <button
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('blueprint');
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'blueprint' ? 'var(--color-primary-pale)' : 'transparent',
                  color: activeTab === 'blueprint' ? 'var(--color-primary-text)' : 'var(--text-secondary)'
                }}
              >
                Weightage & Strategy 🎯
              </button>
              <button
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('notepad');
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'notepad' ? 'var(--color-primary-pale)' : 'transparent',
                  color: activeTab === 'notepad' ? 'var(--color-primary-text)' : 'var(--text-secondary)'
                }}
              >
                My Exam Notes 📝
              </button>
              <button
                onClick={() => {
                  audioService.playClick();
                  setActiveTab('checklist');
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'checklist' ? 'var(--color-primary-pale)' : 'transparent',
                  color: activeTab === 'checklist' ? 'var(--color-primary-text)' : 'var(--text-secondary)'
                }}
              >
                Exam Day Prep 🎒
              </button>
            </div>
          </div>

          {/* Subject Horizontal Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--border-soft)'
            }}
          >
            {TERM_END_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjectId === sub.id;
              const subProg = getSubjectProgress(sub);

              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    audioService.playClick();
                    setSelectedSubjectId(sub.id);
                    setTimerSubjectId(sub.id);
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? `2px solid ${sub.color}` : '1px solid var(--border-soft)',
                    backgroundColor: isSelected ? sub.accentBg : 'var(--bg-main)',
                    color: isSelected ? sub.color : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{sub.iconEmoji}</span>
                  <span>{sub.shortName}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isSelected ? sub.color : 'var(--bg-card-elevated)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700
                    }}
                  >
                    {subProg.pct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: SYLLABUS UNITS & TOPICS */}
        {activeTab === 'syllabus' && (
          <div>
            {/* Subject Banner & Search Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
                padding: '16px 20px',
                backgroundColor: currentSubject.accentBg,
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${currentSubject.accentBorder}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{currentSubject.iconEmoji}</span>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    {currentSubject.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-card)',
                      color: currentSubject.color,
                      border: '1px solid var(--border-soft)'
                    }}
                  >
                    {currentSubject.code}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {currentSubject.summary}
                </div>
              </div>

              {/* Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--bg-input)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-soft)',
                  width: '280px'
                }}
              >
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search topics (e.g. Otsu, A*, CMMI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Units List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredUnits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No topics matching "{searchQuery}". Try another keyword!
                </div>
              ) : (
                filteredUnits.map((unit) => {
                  const isUnitDone = !!completedUnits[unit.id];
                  const isExpanded = expandedUnits[unit.id] !== false;
                  const unitTopics = unit.topics || [];
                  const completedTopicsInUnit = unitTopics.filter((_, idx) => completedTopics[`${unit.id}_t${idx}`]).length;
                  const unitProgressPct = unitTopics.length > 0 ? Math.round((completedTopicsInUnit / unitTopics.length) * 100) : 0;

                  return (
                    <div
                      key={unit.id}
                      style={{
                        backgroundColor: isUnitDone ? 'var(--color-sage-bg)' : 'var(--bg-card)',
                        border: isUnitDone
                          ? '1px solid var(--color-sage-border)'
                          : '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        boxShadow: 'var(--shadow-xs)'
                      }}
                    >
                      {/* Unit Header Bar */}
                      <div
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px',
                          borderBottom: isExpanded ? '1px solid var(--border-soft)' : 'none',
                          backgroundColor: isUnitDone ? 'rgba(139, 150, 124, 0.08)' : 'var(--bg-card-elevated)'
                        }}
                      >
                        {/* Left: Unit Checkbox & Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
                          <button
                            onClick={() => handleToggleUnit(unit)}
                            title={isUnitDone ? 'Mark Unit Incomplete' : 'Mark Whole Unit Complete'}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: isUnitDone ? 'var(--color-sage)' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {isUnitDone ? (
                              <CheckCircle2 size={22} fill="var(--color-sage)" color="#FFFFFF" />
                            ) : (
                              <Square size={20} strokeWidth={1.8} />
                            )}
                          </button>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: '1rem',
                                  color: isUnitDone ? 'var(--text-secondary)' : 'var(--text-main)',
                                  textDecoration: isUnitDone ? 'line-through' : 'none'
                                }}
                              >
                                {unit.title}
                              </span>

                              {/* Marks Badge (especially for IVP) */}
                              {unit.marksBadge && (
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: unit.isHeavyweight ? 'var(--color-primary-pale)' : 'var(--bg-card)',
                                    color: unit.isHeavyweight ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                                    border: unit.isHeavyweight ? '1px solid var(--color-primary-blush)' : '1px solid var(--border-soft)'
                                  }}
                                >
                                  {unit.marksBadge}
                                </span>
                              )}
                            </div>

                            {unit.description && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {unit.description}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Progress & Expand Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                              {completedTopicsInUnit}/{unitTopics.length} Topics
                            </div>
                            <div
                              style={{
                                width: '80px',
                                height: '5px',
                                backgroundColor: 'var(--border-soft)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden',
                                marginTop: '4px'
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${unitProgressPct}%`,
                                  backgroundColor: isUnitDone ? 'var(--color-sage)' : currentSubject.color,
                                  borderRadius: 'var(--radius-full)'
                                }}
                              />
                            </div>
                          </div>

                          {/* Quick Study with Timer button */}
                          <button
                            onClick={() => {
                              audioService.playClick();
                              setTimerSubjectId(currentSubject.id);
                              setTimerUnitId(unit.id);
                              setIsTimerOpen(true);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            title="Study this unit with timer"
                            style={{
                              padding: '5px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-soft)',
                              backgroundColor: 'var(--bg-card)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Timer size={13} />
                            <span>Study</span>
                          </button>

                          <button
                            onClick={() => {
                              setExpandedUnits(prev => ({
                                ...prev,
                                [unit.id]: !isExpanded
                              }));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Unit Topics Checklist (Visible when expanded) */}
                      {isExpanded && (
                        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {unitTopics.map((topic, tIdx) => {
                            const topicKey = `${unit.id}_t${tIdx}`;
                            const isTopicDone = !!completedTopics[topicKey];

                            return (
                              <div
                                key={topicKey}
                                onClick={() => handleToggleTopic(topicKey)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '12px',
                                  padding: '8px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: isTopicDone ? 'rgba(139, 150, 124, 0.05)' : 'var(--bg-card)',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.15s ease'
                                }}
                              >
                                <div style={{ paddingTop: '2px', flexShrink: 0 }}>
                                  {isTopicDone ? (
                                    <CheckCircle2 size={16} fill="var(--color-sage)" color="#FFFFFF" />
                                  ) : (
                                    <Square size={16} color="var(--text-muted)" />
                                  )}
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.88rem',
                                    color: isTopicDone ? 'var(--text-muted)' : 'var(--text-main)',
                                    textDecoration: isTopicDone ? 'line-through' : 'none',
                                    lineHeight: 1.45
                                  }}
                                >
                                  {topic}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WEIGHTAGE & EXAM STRATEGY BLUEPRINT */}
        {activeTab === 'blueprint' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* IVP Highlight Banner */}
            <div
              style={{
                backgroundColor: 'var(--color-pale-rose)',
                border: '1px solid var(--color-primary-blush)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🖼️</span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-primary-text)', fontWeight: 700 }}>
                  Image & Video Processing — Official Marks Distribution (+-5 Margin)
                </h3>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                The syllabus specifies explicit marks weightage. Master the heavyweights first to lock in 50+ marks immediately!
              </p>

              {/* IVP Units Breakdown Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
                }}
              >
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '2px solid var(--color-primary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-text)' }}>TIER 1 • SUPER HEAVYWEIGHT (50M)</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>Unit 2 & Unit 8</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    • Enhancement (25 Marks)<br />
                    • Video Compression (25 Marks)
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-sage-border)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sage)' }}>TIER 2 • CORE PILLARS (60M)</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>Units 4, 6, & 7</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    • Morphology (20 Marks)<br />
                    • Segmentation (20 Marks)<br />
                    • Colour Processing (20 Marks)
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TIER 3 • FAST SCORERS (30M)</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>Units 1, 3, & 5</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    • Fundamentals (10 Marks)<br />
                    • Transforms (10 Marks)<br />
                    • Edge Detection (10 Marks)
                  </div>
                </div>
              </div>
            </div>

            {/* High Yield Tips for All 6 Subjects */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
                🌟 High-Yield Examination Strategies (Subject-by-Subject)
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px'
                }}
              >
                {TERM_END_SUBJECTS.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      backgroundColor: 'var(--bg-card-elevated)',
                      border: '1px solid var(--border-soft)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px 20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{sub.iconEmoji}</span>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{sub.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{sub.displayDate}</span>
                    </div>

                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {(sub.highYieldTips || []).map((tip, idx) => (
                        <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MY EXAM REVISION NOTEPAD */}
        {activeTab === 'notepad' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Personal Revision Notes: {currentSubject.name} 📝
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Jot down formulas to memorize, questions your professor emphasized in class, or quick revision reminders.
                </p>
              </div>

              <button
                onClick={handleSaveNotes}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Save size={15} />
                <span>{isNotesSaved ? 'Saved! ✨' : 'Save Notes'}</span>
              </button>
            </div>

            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder={`Write your formula notes, diagrams to practice, or high-probability exam questions for ${currentSubject.name}...`}
              rows={12}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-soft)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.6,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* TAB 4: EXAM DAY CHECKLIST */}
        {activeTab === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Exam Hall Essentials & Readiness Checklist 🎒
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Make sure you have everything packed the night before so exam morning is calm and confident!
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}
            >
              {[
                {
                  title: 'Mandatory Documents',
                  items: ['Hall Ticket / Admit Card (Printed & Signed)', 'College Identity Card', 'Aadhar / Photo ID backup']
                },
                {
                  title: 'Stationery Kit',
                  items: ['2 Blue / Black Ballpoint Pens (tested)', 'Pencils, Sharpener & Soft Eraser', 'Clear 30cm Ruler (for neat UML diagrams & tables)']
                },
                {
                  title: 'Calculators & Tools',
                  items: ['Scientific Calculator (Fx-991ES or approved model)', 'Fresh batteries check', 'Clear transparent exam pouch']
                },
                {
                  title: 'Personal Comfort',
                  items: ['Transparent Water Bottle (hydrated brain!)', 'Analog Wristwatch (keep track of 180 mins)', 'Hair clip / rubber band & light jacket']
                }
              ].map((category, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-soft)',
                    padding: '18px 20px'
                  }}
                >
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {category.title}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Exam Hall Time Budgeting Strategy */}
            <div
              style={{
                backgroundColor: 'var(--color-sage-bg)',
                border: '1px solid var(--color-sage-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                fontSize: '0.88rem',
                color: 'var(--text-main)'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--color-botanical-dark)', marginBottom: '4px' }}>
                💡 180-Minute Exam Hall Time Budget Strategy:
              </div>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', lineHeight: 1.5 }}>
                <li><strong>First 10 Mins:</strong> Read the entire question paper calmly. Mark questions you know best with a light dot.</li>
                <li><strong>Next 140 Mins:</strong> Write your answers. Spend approximately 25-30 minutes per long question. Draw large, clean diagrams with pencil.</li>
                <li><strong>Final 30 Mins:</strong> Re-read every numerical calculation, verify question numbering, check all subparts (a, b, c), and underline key conclusions!</li>
              </ul>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

export default TermEndPrep;


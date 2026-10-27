import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Star,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Clock,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const SUBJECT_COLORS = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#3B82F6'  // Blue
];

const DEFAULT_INTERVIEW_QUESTIONS = {
  'DBMS': [
    { q: 'Explain ACID properties in DBMS with real banking example.', a: 'Atomicity (all-or-nothing), Consistency (integrity constraints preserved), Isolation (concurrent transactions do not interfere, serializability), Durability (committed changes persist despite crash).' },
    { q: 'What is the difference between Primary Key, Unique Key, and Foreign Key?', a: 'Primary Key uniquely identifies row and cannot be NULL. Unique Key enforces uniqueness but allows one NULL. Foreign Key references primary key in another table enforcing referential integrity.' },
    { q: 'Explain Database Normalization (1NF to BCNF).', a: '1NF eliminates repeating groups/multivalued attributes. 2NF removes partial dependency. 3NF removes transitive dependencies. BCNF ensures every determinant is a super key.' }
  ],
  'Operating Systems': [
    { q: 'Difference between Process and Thread?', a: 'A Process is an executing program with its own dedicated memory space, file handles, and PCB. A Thread is a lightweight sub-unit of execution within a process that shares the code, data, and heap with peer threads, but has its own stack and registers.' },
    { q: 'What are the 4 Coffman conditions for Deadlock?', a: 'Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If any one condition is broken, deadlock cannot occur.' },
    { q: 'What is Virtual Memory, Paging, and Thrashing?', a: 'Virtual memory creates illusion of large memory by swapping pages between RAM and disk. Paging divides memory into fixed-size frames and pages. Thrashing happens when CPU spends more time page swapping than executing instructions due to high page fault frequency.' }
  ],
  'Computer Networks': [
    { q: 'TCP vs UDP: Key differences and use cases?', a: 'TCP is connection-oriented, reliable (acknowledgments, retransmissions), ordered, and implements flow/congestion control (HTTP, HTTPS, FTP). UDP is connectionless, fast, unreliable (no ACK overhead) suited for real-time gaming, live audio, DNS.' },
    { q: 'What happens when you type a URL in the browser and press Enter?', a: '1. DNS lookup (browser cache -> OS -> router -> recursive resolver). 2. TCP 3-Way Handshake (SYN, SYN-ACK, ACK) + TLS handshake if HTTPS. 3. Browser sends HTTP GET request. 4. Server processes and responds (200 OK + HTML/CSS/JS). 5. Browser parses DOM, CSSOM, renders page.' }
  ],
  'OOP': [
    { q: 'Explain the 4 Pillars of OOP with real-world examples.', a: 'Encapsulation: Bundling data and methods with private accessors (Capsule). Abstraction: Hiding internal complexity behind interfaces (Car steering). Inheritance: Reusing base class capabilities (Dog inherits Animal). Polymorphism: Method overloading (compile-time) and method overriding (runtime).' }
  ]
};

export function CoreCsTracker({ data, store }) {
  // If a subject is selected, activeSubjectKey is set and renders dedicated Subject Dashboard!
  const [activeSubjectKey, setActiveSubjectKey] = useState(null);

  // Add / Edit Subject Modal
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [editingSubjectKey, setEditingSubjectKey] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState(SUBJECT_COLORS[0]);

  // Inside Dashboard: Add Subtopic Input
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // Subject Study Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Reveal Interview Questions Accordion
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const coreSubjects = data.coreSubjects || {};
  const subjectKeys = Object.keys(coreSubjects);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            audioService.playTimerBell();
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  function handleTimerComplete() {
    if (!activeSubjectKey) return;
    const studiedMins = 25;
    store.addTimerSession({
      subject: `Core CS: ${activeSubjectKey}`,
      taskName: `Core CS Revision Sprint: ${activeSubjectKey}`,
      durationMinutes: studiedMins,
      durationSeconds: studiedMins * 60,
      dateStr: getTodayString()
    });

    const sub = coreSubjects[activeSubjectKey];
    if (sub) {
      store.updateCoreSubject(activeSubjectKey, {
        studyHours: ((sub.studyHours || 0) + (studiedMins / 60)).toFixed(1)
      });
    }

    alert(`🎉 25-minute deep focus session completed for ${activeSubjectKey}!`);
    setTimerSeconds(25 * 60);
  }

  // Open Subject Dashboard
  function handleOpenSubjectDashboard(key) {
    setActiveSubjectKey(key);
    const sub = coreSubjects[key];
    setEditingNotes(sub?.notes || '');
    setTimerSeconds(25 * 60);
    setIsTimerRunning(false);
  }

  // Add / Save Core Subject
  function handleSaveSubject(e) {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    if (editingSubjectKey) {
      store.updateCoreSubject(editingSubjectKey, {
        name: newSubjectName.trim(),
        description: newSubjectDesc.trim(),
        color: newSubjectColor
      });
    } else {
      store.addCoreSubject(newSubjectName.trim(), {
        name: newSubjectName.trim(),
        description: newSubjectDesc.trim() || 'Core technical interview preparation subject',
        color: newSubjectColor,
        studyHours: 0,
        topics: [
          { id: 'top_' + Date.now() + '_1', title: 'Fundamental Concepts & Core Definitions', status: 'Not Started', confidence: 3 },
          { id: 'top_' + Date.now() + '_2', title: 'Top 10 Frequently Asked Interview Questions', status: 'Not Started', confidence: 3 }
        ],
        notes: ''
      });
    }

    audioService.playSuccess();
    setIsAddSubjectModalOpen(false);
    setNewSubjectName('');
    setNewSubjectDesc('');
    setEditingSubjectKey(null);
  }

  function handleDeleteSubject(key) {
    if (window.confirm(`Are you sure you want to delete core subject "${key}"?`)) {
      store.deleteCoreSubject(key);
      if (activeSubjectKey === key) setActiveSubjectKey(null);
      audioService.playClick();
    }
  }

  // Add Subtopic inside active subject
  function handleAddSubtopic(e) {
    e.preventDefault();
    if (!newSubtopicTitle.trim() || !activeSubjectKey) return;

    store.addCoreTopic(activeSubjectKey, {
      title: newSubtopicTitle.trim(),
      status: 'Not Started',
      confidence: 3
    });

    audioService.playSuccess();
    setNewSubtopicTitle('');
  }

  // Toggle Subtopic Completion
  function handleToggleSubtopicStatus(topic) {
    const nextStatus = topic.status === 'Interview-Ready' ? 'Not Started' : 'Interview-Ready';
    store.updateCoreTopic(activeSubjectKey, topic.id, {
      status: nextStatus,
      interviewReadyAssessed: nextStatus === 'Interview-Ready'
    });
    if (nextStatus === 'Interview-Ready') audioService.playSuccess();
    else audioService.playClick();
  }

  // Delete Subtopic
  function handleDeleteSubtopic(topicId) {
    store.deleteCoreTopic(activeSubjectKey, topicId);
    audioService.playClick();
  }

  // Save Notes inside active subject
  function handleSaveNotes() {
    if (!activeSubjectKey) return;
    store.updateCoreSubject(activeSubjectKey, { notes: editingNotes.trim() });
    audioService.playSuccess();
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2500);
  }

  // Time format
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const formattedTimer = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const currentSubject = activeSubjectKey ? coreSubjects[activeSubjectKey] : null;

  // Compute active subject progress
  const currentTopics = currentSubject?.topics || [];
  const completedTopicsCount = currentTopics.filter(t => t.status === 'Interview-Ready').length;
  const subjectProgressPct = currentTopics.length > 0 ? Math.round((completedTopicsCount / currentTopics.length) * 100) : 0;

  // Top Questions for active subject
  const subjectQuestions = activeSubjectKey
    ? DEFAULT_INTERVIEW_QUESTIONS[activeSubjectKey] || [
        { q: `What are the core foundational principles of ${activeSubjectKey}?`, a: `Explain key theoretical definitions, architecture layers, trade-offs, and practical industry applications of ${activeSubjectKey}.` },
        { q: `What are common edge cases or pitfalls in ${activeSubjectKey}?`, a: `Discuss concurrency, resource contention, failure modes, and recovery patterns.` }
      ]
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* ========================================================================= */}
      {/* VIEW A: DEDICATED SUBJECT DASHBOARD (WHEN A SUBJECT CARD IS CLICKED)     */}
      {/* ========================================================================= */}
      {activeSubjectKey && currentSubject ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Dashboard Header Bar */}
          <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveSubjectKey(null)}
                style={{ fontWeight: 700 }}
              >
                <ArrowLeft size={16} /> All Core Subjects
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-primary">
                  {completedTopicsCount} / {currentTopics.length} Topics Ready
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDeleteSubject(activeSubjectKey)}
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={15} /> Delete Subject
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: currentSubject.color || 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem'
                }}
              >
                <BookOpen size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                  {currentSubject.name} Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0 }}>
                  {currentSubject.description || 'Master key conceptual interview questions, track subtopics, and run focus sprints.'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Interview Readiness</span>
                <span style={{ fontWeight: 700, color: subjectProgressPct === 100 ? 'var(--color-success)' : 'var(--color-primary)' }}>
                  {subjectProgressPct}% Completed
                </span>
              </div>
              <div className="progress-track" style={{ height: '8px' }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${subjectProgressPct}%`,
                    background: subjectProgressPct === 100 ? 'var(--color-success)' : 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent-violet) 100%)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Grid Layout: Timer & Subtopics Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Subject Specific Timer Card */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
              <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
                <Clock size={12} /> {currentSubject.name} Focus Sprint
              </span>

              <div
                style={{
                  fontSize: '3.2rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: isTimerRunning ? 'var(--color-primary)' : 'var(--text-main)',
                  margin: '8px 0'
                }}
              >
                {formattedTimer}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                {!isTimerRunning ? (
                  <button className="btn btn-primary" onClick={() => setIsTimerRunning(true)}>
                    <Play size={16} fill="currentColor" /> Start Focus (25m)
                  </button>
                ) : (
                  <button className="btn btn-secondary" onClick={() => setIsTimerRunning(false)}>
                    <Pause size={16} /> Pause Timer
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => { setIsTimerRunning(false); setTimerSeconds(25 * 60); }}
                >
                  <RotateCcw size={15} />
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                Total Studied: <strong style={{ color: 'var(--text-main)' }}>{currentSubject.studyHours || 0} hrs</strong>
              </div>
            </div>

            {/* Subtopics Checklist Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 14px 0' }}>
                Subtopics & Concepts Checklist
              </h2>

              {/* Add Subtopic Form */}
              <form onSubmit={handleAddSubtopic} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Add new subtopic (e.g. Transactions & Locking)..."
                  value={newSubtopicTitle}
                  onChange={(e) => setNewSubtopicTitle(e.target.value)}
                  style={{ fontSize: '0.84rem' }}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add
                </button>
              </form>

              {/* Subtopics List */}
              {currentTopics.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  No subtopics added yet. Type a topic above to start your checklist.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                  {currentTopics.map(top => {
                    const isDone = top.status === 'Interview-Ready';

                    return (
                      <div
                        key={top.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isDone ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card-subtle)',
                          border: isDone ? '1px solid var(--color-success-border)' : '1px solid var(--border-soft)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <button
                            onClick={() => handleToggleSubtopicStatus(top)}
                            style={{
                              background: isDone ? 'var(--color-success)' : 'transparent',
                              border: `2px solid ${isDone ? 'var(--color-success)' : 'var(--border-soft)'}`,
                              borderRadius: '6px',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          >
                            {isDone && <Check size={14} strokeWidth={3} />}
                          </button>

                          <span
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 600,
                              color: isDone ? 'var(--text-muted)' : 'var(--text-main)',
                              textDecoration: isDone ? 'line-through' : 'none'
                            }}
                          >
                            {top.title}
                          </span>
                        </div>

                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeleteSubtopic(top.id)}
                          style={{ padding: '4px', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Subject Revision Notes Editor */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800 }}>
                  Revision Notes & Concept Summary
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Personalized cheat-sheet and important definitions saved directly to your workspace.
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleSaveNotes}>
                {notesSavedAlert ? '✓ Notes Saved!' : 'Save Notes'}
              </button>
            </div>

            <textarea
              className="form-textarea"
              style={{ minHeight: '140px', fontSize: '0.86rem', lineHeight: 1.6 }}
              placeholder={`Write quick recall notes for ${currentSubject.name}...`}
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
            />
          </div>

          {/* Top Interview Questions & Model Answers */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', margin: '0 0 14px 0', fontWeight: 800 }}>
              Frequently Asked Interview Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {subjectQuestions.map((qa, idx) => {
                const isRevealed = Boolean(expandedQuestions[idx]);

                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-soft)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'var(--bg-card-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setExpandedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-primary)' }}>Q{idx + 1}:</span>
                        <span>{qa.q}</span>
                      </div>

                      {isRevealed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>

                    {isRevealed && (
                      <div style={{ padding: '16px 18px', background: 'var(--bg-card)', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
                        <strong style={{ color: 'var(--color-success)', display: 'block', marginBottom: '4px' }}>Model Answer / Key Points:</strong>
                        {qa.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW B: ALL CORE SUBJECTS CARDS (DEFAULT OVERVIEW)                        */
        /* ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Header */}
          <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-primary">Technical Fundamentals</span>
                  <span className="badge badge-lavender">Custom Curriculum</span>
                </div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  Core Computer Science Subjects
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
                  Manage the core subjects required for your placement interviews. Click any subject card to launch its dedicated study dashboard, timer, and notes.
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingSubjectKey(null);
                  setNewSubjectName('');
                  setNewSubjectDesc('');
                  setIsAddSubjectModalOpen(true);
                }}
              >
                <Plus size={16} /> Add Core Subject
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {subjectKeys.map(key => {
              const sub = coreSubjects[key];
              const topics = sub.topics || [];
              const readyCount = topics.filter(t => t.status === 'Interview-Ready').length;
              const pct = topics.length > 0 ? Math.round((readyCount / topics.length) * 100) : 0;

              return (
                <div
                  key={key}
                  className="card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenSubjectDashboard(key)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: 'var(--radius-md)',
                          background: sub.color || 'var(--color-primary)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem'
                        }}
                      >
                        <BookOpen size={20} />
                      </div>

                      <span className={`badge ${pct === 100 ? 'badge-success' : pct > 0 ? 'badge-warning' : 'badge-lavender'}`}>
                        {pct === 100 ? 'Ready' : pct > 0 ? `${pct}% Ready` : 'Not Started'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                      {sub.name || key}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 14px 0', minHeight: '38px', lineHeight: 1.5 }}>
                      {sub.description || 'Core technical interview preparation subject.'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>{readyCount} of {topics.length} topics mastered</span>
                      <span>{sub.studyHours || 0} hrs studied</span>
                    </div>

                    <div className="progress-track" style={{ height: '6px', marginTop: '8px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? 'var(--color-success)' : sub.color || 'var(--color-primary)'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      Open Dashboard →
                    </span>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubject(key);
                      }}
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                      title="Delete subject"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Core Subject */}
      {isAddSubjectModalOpen && (
        <Modal
          isOpen={isAddSubjectModalOpen}
          onClose={() => setIsAddSubjectModalOpen(false)}
          title={editingSubjectKey ? 'Edit Core Subject' : 'Add Required Core Subject'}
        >
          <form onSubmit={handleSaveSubject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subject Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. System Design, Compiler Design, Software Engineering"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description / Interview Focus</label>
              <textarea
                className="form-textarea"
                placeholder="Key concepts to master for technical rounds..."
                value={newSubjectDesc}
                onChange={(e) => setNewSubjectDesc(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Card Accent Color</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                {SUBJECT_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewSubjectColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: newSubjectColor === c ? '3px solid #FFFFFF' : 'none',
                      boxShadow: newSubjectColor === c ? '0 0 0 2px var(--color-primary)' : 'none',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddSubjectModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Subject
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

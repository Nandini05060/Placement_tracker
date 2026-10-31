import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  BookOpen,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Check,
  FileText,
  ListOrdered,
  Square
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';
import { RS_AGGARWAL_SECTIONS } from '../data/rsAggarwalAptitudeData.js';

export function AptitudeTracker({ data, store }) {
  const [activeSectionTab, setActiveSectionTab] = useState('all'); // 'all', 'section-1', 'section-2'
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 30-Min Daily Practice Sprint Timer State
  const [timerSeconds, setTimerSeconds] = useState(30 * 60); // 30 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedSprintChapter, setSelectedSprintChapter] = useState('Number System');
  const [sprintAttempted, setSprintAttempted] = useState(15);
  const [sprintCorrect, setSprintCorrect] = useState(12);
  const timerAnchorRef = useRef(null);

  // Formula Sheet Modal
  const [formulaModalChapter, setFormulaModalChapter] = useState(null);

  // Log Speed Drill Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logChapter, setLogChapter] = useState('Number System');
  const [logAttempted, setLogAttempted] = useState(20);
  const [logCorrect, setLogCorrect] = useState(16);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNotes, setLogNotes] = useState('');

  const chapterProgress = data?.aptitudeChapterProgress || {};
  const sessions = data?.aptitudeSessions || [];

  // Precision 30-min timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      if (!timerAnchorRef.current) {
        timerAnchorRef.current = {
          start: Date.now(),
          initialSecs: timerSeconds
        };
      }

      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerAnchorRef.current.start) / 1000);
        const next = timerAnchorRef.current.initialSecs - elapsed;
        if (next <= 0) {
          setTimerSeconds(0);
          setIsTimerRunning(false);
          timerAnchorRef.current = null;
          handleTimerFinished();
        } else {
          setTimerSeconds(next);
        }
      }, 500);
    } else {
      timerAnchorRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  function handleStartTimer() {
    audioService.playClick();
    setIsTimerRunning(true);
  }

  function handlePauseTimer() {
    audioService.playClick();
    setIsTimerRunning(false);
  }

  function handleResetTimer() {
    audioService.playClick();
    setIsTimerRunning(false);
    timerAnchorRef.current = null;
    setTimerSeconds(30 * 60);
  }

  function handleStopAndSaveTimer() {
    audioService.playSuccess();
    setIsTimerRunning(false);
    timerAnchorRef.current = null;
    const elapsedSeconds = Math.max(0, 30 * 60 - timerSeconds);
    const sessionMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    if (elapsedSeconds >= 10) {
      store.addTimerSession({
        subject: 'Aptitude & Reasoning (R.S. Aggarwal)',
        taskName: `Speed Drill: ${selectedSprintChapter} (${sessionMinutes}m saved)`,
        durationMinutes: sessionMinutes,
        durationSeconds: elapsedSeconds,
        dateStr: getTodayString()
      });
    }
    setTimerSeconds(30 * 60);
  }

  function handleTimerFinished() {
    audioService.playTimerBell();
    // Log the 30-min study sprint
    store.addTimerSession({
      subject: 'Aptitude & Reasoning (R.S. Aggarwal)',
      taskName: `30-Min Speed Drill: ${selectedSprintChapter}`,
      durationMinutes: 30,
      durationSeconds: 30 * 60,
      dateStr: getTodayString()
    });

    store.addAptitudeSession({
      category: selectedSprintChapter,
      attempted: sprintAttempted,
      correct: sprintCorrect,
      timeMinutes: 30,
      mistakesNotes: '30-Minute Daily Practice Sprint'
    });

    // Update chapter solved count
    const chObj = findChapterByTitle(selectedSprintChapter);
    if (chObj) {
      const cur = chapterProgress[chObj.id] || {};
      store.updateAptitudeChapterProgress(chObj.id, {
        status: (cur.questionsSolved || 0) + sprintAttempted >= 40 ? 'Mastered' : 'Practicing',
        questionsSolved: (cur.questionsSolved || 0) + sprintAttempted
      });
    }

    alert(`🎉 30-Minute Aptitude Drill Complete! Logged ${sprintCorrect}/${sprintAttempted} correct questions for ${selectedSprintChapter}.`);
    handleResetTimer();
  }

  function findChapterByTitle(title) {
    for (const sec of RS_AGGARWAL_SECTIONS) {
      const found = sec.chapters.find(c => c.title.toLowerCase() === title.toLowerCase());
      if (found) return found;
    }
    return null;
  }

  // Update Chapter Status
  function handleToggleChapterStatus(chapterId, currentStatus) {
    const nextStatus = currentStatus === 'Mastered' ? 'Not Started' : currentStatus === 'Practicing' ? 'Mastered' : 'Practicing';
    store.updateAptitudeChapterProgress(chapterId, { status: nextStatus });
    if (nextStatus === 'Mastered') audioService.playSuccess();
    else audioService.playClick();
  }

  // Save manual drill log
  function handleSaveLog(e) {
    e.preventDefault();
    const att = parseInt(logAttempted, 10) || 0;
    const corr = parseInt(logCorrect, 10) || 0;
    if (att <= 0) return;
    if (corr > att) {
      alert('Correct questions cannot exceed attempted questions!');
      return;
    }

    store.addAptitudeSession({
      category: logChapter,
      attempted: att,
      correct: corr,
      timeMinutes: parseInt(logMinutes, 10) || 30,
      mistakesNotes: logNotes.trim()
    });

    const chObj = findChapterByTitle(logChapter);
    if (chObj) {
      const cur = chapterProgress[chObj.id] || {};
      store.updateAptitudeChapterProgress(chObj.id, {
        status: (cur.questionsSolved || 0) + att >= 40 ? 'Mastered' : 'Practicing',
        questionsSolved: (cur.questionsSolved || 0) + att
      });
    }

    audioService.playSuccess();
    setIsLogModalOpen(false);
    setLogNotes('');
  }

  // Compute stats across all 39 R.S. Aggarwal chapters
  const allChapters = [];
  RS_AGGARWAL_SECTIONS.forEach(sec => {
    sec.chapters.forEach(c => allChapters.push({ ...c, sectionName: sec.name }));
  });

  const totalChapters = allChapters.length;
  const masteredCount = allChapters.filter(c => chapterProgress[c.id]?.status === 'Mastered').length;
  const practicingCount = allChapters.filter(c => chapterProgress[c.id]?.status === 'Practicing').length;
  const totalQuestionsPracticed = allChapters.reduce((sum, c) => sum + (chapterProgress[c.id]?.questionsSolved || 0), 0);

  // Time format MM:SS
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header & R.S. Aggarwal Info Banner */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">R.S. Aggarwal Quantitative Aptitude</span>
              <span className="badge badge-success">30-Min Daily Practice</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              Quantitative Aptitude & Reasoning
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              Master all 39 chapters from R.S. Aggarwal Quantitative Aptitude book. Arithmetical Ability (1–35) and Data Interpretation (36–39) tested in campus placement online assessments.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setIsLogModalOpen(true)}>
            <Plus size={16} /> Log Speed Practice Session
          </button>
        </div>

        {/* Aptitude Metrics Grid */}
        <div className="stat-grid-4" style={{ marginTop: '22px', marginBottom: 0 }}>
          <div className="stat-card">
            <span className="stat-card-label">Mastered Chapters</span>
            <div className="stat-card-value" style={{ color: 'var(--color-sage)' }}>
              {masteredCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalChapters}</span>
            </div>
            <div className="stat-card-sub">{Math.round((masteredCount / totalChapters) * 100)}% syllabus mastery</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Currently Practicing</span>
            <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
              {practicingCount}
            </div>
            <div className="stat-card-sub">Active speed drill focus</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Questions Solved</span>
            <div className="stat-card-value" style={{ color: 'var(--color-primary-text)' }}>
              {totalQuestionsPracticed}
            </div>
            <div className="stat-card-sub">Quantitative & DI drills</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Total Chapters</span>
            <div className="stat-card-value">39 Chapters</div>
            <div className="stat-card-sub">35 Arithmetic + 4 DI</div>
          </div>
        </div>
      </div>

      {/* 2. Dedicated 30-Minute Daily Practice Sprint Arena */}
      <div
        className="card"
        style={{
          padding: '24px',
          background: 'var(--bg-card)',
          border: isTimerRunning ? '1px solid var(--color-primary)' : '1px solid var(--border-soft)',
          boxShadow: isTimerRunning ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
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
                justifyContent: 'center'
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                30-Minute Daily Aptitude Practice Sprint
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Daily speed drills are key to clearing campus OA time cut-offs (1–2 minutes per question).
              </div>
            </div>
          </div>

          <span className={`badge ${isTimerRunning ? 'badge-primary' : 'badge-lavender'}`}>
            {isTimerRunning ? '⚡ Sprint in Progress' : '30 Min Countdown Target'}
          </span>
        </div>

        {/* Sprint Timer Controls & Display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '18px 24px',
            backgroundColor: 'var(--bg-card-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-soft)'
          }}
        >
          {/* Big Time Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                fontSize: '3.0rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-heading)',
                fontVariantNumeric: 'tabular-nums',
                color: isTimerRunning ? 'var(--color-primary-text)' : 'var(--text-main)'
              }}
            >
              {formattedTime}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {!isTimerRunning ? (
                <button
                  className="btn btn-primary"
                  onClick={handleStartTimer}
                  style={{ padding: '8px 20px', fontWeight: 700 }}
                >
                  <Play size={15} fill="currentColor" /> {30 * 60 - timerSeconds > 0 ? 'Resume Sprint' : 'Start 30m Sprint'}
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={handlePauseTimer}
                  style={{ padding: '8px 20px', fontWeight: 700 }}
                >
                  <Pause size={15} /> Pause
                </button>
              )}

              {(isTimerRunning || 30 * 60 - timerSeconds > 0) ? (
                <button
                  className="btn-stop-green"
                  style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}
                  onClick={handleStopAndSaveTimer}
                  title="Stop early and log your studied minutes"
                >
                  <Square size={13} fill="#FFFFFF" /> Stop & Save ({Math.max(1, Math.round((30 * 60 - timerSeconds) / 60))}m)
                </button>
              ) : (
                <button
                  className="btn-stop-green"
                  disabled={true}
                  style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}
                >
                  <Square size={13} fill="#FFFFFF" /> Stop & Save
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={handleResetTimer}
                title="Reset timer without saving"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Sprint Settings & Counters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                Target Topic for Sprint:
              </span>
              <select
                className="form-select"
                value={selectedSprintChapter}
                onChange={(e) => setSelectedSprintChapter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.82rem', padding: '5px 10px' }}
                disabled={isTimerRunning}
              >
                {allChapters.map(c => (
                  <option key={c.id} value={c.title}>
                    Ch {c.chapterNo}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Attempted:
                </span>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="50"
                  value={sprintAttempted}
                  onChange={(e) => setSprintAttempted(parseInt(e.target.value, 10) || 0)}
                  style={{ width: '68px', fontSize: '0.82rem', padding: '5px 8px' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                  Correct:
                </span>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="50"
                  value={sprintCorrect}
                  onChange={(e) => setSprintCorrect(parseInt(e.target.value, 10) || 0)}
                  style={{ width: '68px', fontSize: '0.82rem', padding: '5px 8px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Filter Tabs & Search Bar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeSectionTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSectionTab('all')}
          >
            All 39 Chapters
          </button>
          <button
            className={`btn btn-sm ${activeSectionTab === 'section-1' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSectionTab('section-1')}
          >
            Section I: Arithmetical Ability (1–35)
          </button>
          <button
            className={`btn btn-sm ${activeSectionTab === 'section-2' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveSectionTab('section-2')}
          >
            Section II: Data Interpretation (36–39)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.82rem', paddingTop: '6px', paddingBottom: '6px' }}
            />
          </div>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '0.82rem', padding: '6px 10px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Mastered">Mastered</option>
            <option value="Practicing">Practicing</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {/* 4. R.S. Aggarwal Chapters Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {RS_AGGARWAL_SECTIONS.filter(sec => activeSectionTab === 'all' || sec.id === activeSectionTab).map(section => {
          const filteredChapters = section.chapters.filter(ch => {
            const prog = chapterProgress[ch.id] || { status: 'Not Started' };
            const matchStatus = statusFilter === 'All' || prog.status === statusFilter;
            const matchSearch = !searchQuery.trim() ||
              ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              String(ch.chapterNo).includes(searchQuery);
            return matchStatus && matchSearch;
          });

          if (filteredChapters.length === 0) return null;

          return (
            <div key={section.id} className="card" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderBottom: '1px solid var(--border-soft)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.08rem', margin: 0, fontWeight: 800 }}>
                    {section.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {section.description} (Book Pages: {section.pages})
                  </div>
                </div>

                <span className="badge badge-primary">
                  {filteredChapters.length} Chapters
                </span>
              </div>

              {/* Chapters Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '10px 18px', width: '50px' }}>#</th>
                      <th style={{ padding: '10px 14px' }}>Chapter Title</th>
                      <th style={{ padding: '10px 14px' }}>Book Pages</th>
                      <th style={{ padding: '10px 14px' }}>Questions Solved</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 18px', textAlign: 'right' }}>Formulas & Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChapters.map(ch => {
                      const prog = chapterProgress[ch.id] || { status: 'Not Started', questionsSolved: 0 };
                      const isMastered = prog.status === 'Mastered';
                      const isPracticing = prog.status === 'Practicing';

                      return (
                        <tr
                          key={ch.id}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: isMastered ? 'rgba(16, 185, 129, 0.04)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '12px 18px', fontWeight: 800, color: 'var(--color-primary)' }}>
                            {ch.chapterNo}
                          </td>

                          <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{ch.title}</span>
                              {isMastered && (
                                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                                  ✓ Mastered
                                </span>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            pp. {ch.pages}
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 700 }}>{prog.questionsSolved || 0}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>solved</span>
                            </div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            <button
                              onClick={() => handleToggleChapterStatus(ch.id, prog.status)}
                              className={`badge ${isMastered ? 'badge-success' : isPracticing ? 'badge-warning' : 'badge-lavender'
                                }`}
                              style={{ cursor: 'pointer', border: 'none' }}
                              title="Click to cycle status"
                            >
                              {prog.status}
                            </button>
                          </td>

                          <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setFormulaModalChapter(ch)}
                              style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                            >
                              <BookOpen size={13} /> Key Formulas
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula Cheat Sheet Modal */}
      {formulaModalChapter && (
        <Modal
          isOpen={Boolean(formulaModalChapter)}
          onClose={() => setFormulaModalChapter(null)}
          title={`Chapter ${formulaModalChapter.chapterNo}: ${formulaModalChapter.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">R.S. Aggarwal Pages: {formulaModalChapter.pages}</span>
            </div>

            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-soft)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'var(--text-main)',
                fontFamily: 'monospace'
              }}
            >
              {formulaModalChapter.formulas}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedSprintChapter(formulaModalChapter.title);
                  setFormulaModalChapter(null);
                }}
              >
                Practice in 30m Sprint
              </button>
              <button className="btn btn-secondary" onClick={() => setFormulaModalChapter(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual Log Modal */}
      {isLogModalOpen && (
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log Speed Drill Session"
        >
          <form onSubmit={handleSaveLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">R.S. Aggarwal Topic</label>
              <select
                className="form-select"
                value={logChapter}
                onChange={(e) => setLogChapter(e.target.value)}
              >
                {allChapters.map(c => (
                  <option key={c.id} value={c.title}>
                    Ch {c.chapterNo}: {c.title} (pp. {c.pages})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Questions Attempted</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="200"
                  value={logAttempted}
                  onChange={(e) => setLogAttempted(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Questions Correct</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="200"
                  value={logCorrect}
                  onChange={(e) => setLogCorrect(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Time Spent (Minutes)</label>
              <input
                type="number"
                className="form-input"
                min="5"
                max="180"
                value={logMinutes}
                onChange={(e) => setLogMinutes(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Mistake Notes & Traps</label>
              <textarea
                className="form-textarea"
                placeholder="What mistakes or shortcut traps did you encounter?"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Practice Session
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

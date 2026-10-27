import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Clock,
  Trash2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Flame,
  Plus,
  Minus
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const SUBJECTS = [
  'Java and DSA',
  'Core CS - Operating Systems',
  'Core CS - DBMS & SQL',
  'Core CS - Computer Networks',
  'Core CS - OOP with Java/C++',
  'Aptitude & Reasoning (R.S. Aggarwal)',
  'Soft Skills & HR Mock',
  'Full Stack Project Engineering',
  'Revision & Spaced Practice'
];

export function StudyTimer({ data, store }) {
  // Modes: 'pomodoro', 'aptitude', 'deep-focus', 'marathon', 'custom', 'stopwatch'
  const [mode, setMode] = useState('pomodoro');
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Timer durations in seconds
  const [durationSeconds, setDurationSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // Subject & Task Linking
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Target anchor for drift immunity
  const timerAnchorRef = useRef(null);

  // Ambient sound synthesizer state
  const [ambientSound, setAmbientSound] = useState('off'); // 'off', 'rain', 'whitenoise'
  const audioContextRef = useRef(null);
  const noiseNodeRef = useRef(null);

  // Manual Session Log Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logSubject, setLogSubject] = useState(SUBJECTS[0]);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNotes, setLogNotes] = useState('');

  // Active tasks for today
  const todayTasks = (data.dailyTasks || []).filter(t => t.date === getTodayString() && !t.completed);

  // Precision interval effect with Date.now() timestamp drift immunity
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      if (!timerAnchorRef.current) {
        timerAnchorRef.current = {
          start: Date.now(),
          initialRemaining: secondsRemaining,
          initialStopwatch: stopwatchSeconds
        };
      }

      interval = setInterval(() => {
        const elapsedSecs = Math.floor((Date.now() - timerAnchorRef.current.start) / 1000);

        if (mode === 'stopwatch') {
          setStopwatchSeconds(timerAnchorRef.current.initialStopwatch + elapsedSecs);
        } else {
          const nextRemaining = timerAnchorRef.current.initialRemaining - elapsedSecs;
          if (nextRemaining <= 0) {
            setSecondsRemaining(0);
            setIsRunning(false);
            timerAnchorRef.current = null;
            handleSessionComplete();
          } else {
            setSecondsRemaining(nextRemaining);
          }
        }
      }, 500);
    } else {
      timerAnchorRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode]);

  // Ambient Noise Synthesizer via Web Audio API
  useEffect(() => {
    if (ambientSound === 'off' || !isRunning) {
      if (noiseNodeRef.current) {
        try { noiseNodeRef.current.stop(); } catch (e) {}
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Buffer size
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05; // soft pinkish noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Filter for gentle rain tone
      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = ambientSound === 'rain' ? 800 : 1200;

      whiteNoise.connect(filter);
      filter.connect(ctx.destination);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }

    return () => {
      if (noiseNodeRef.current) {
        try { noiseNodeRef.current.stop(); } catch (e) {}
        noiseNodeRef.current = null;
      }
    };
  }, [ambientSound, isRunning]);

  function switchMode(newMode) {
    setIsRunning(false);
    setIsBreak(false);
    timerAnchorRef.current = null;
    setMode(newMode);

    if (newMode === 'pomodoro') {
      setDurationSeconds(25 * 60);
      setSecondsRemaining(25 * 60);
    } else if (newMode === 'aptitude') {
      setDurationSeconds(30 * 60);
      setSecondsRemaining(30 * 60);
    } else if (newMode === 'deep-focus') {
      setDurationSeconds(45 * 60);
      setSecondsRemaining(45 * 60);
    } else if (newMode === 'marathon') {
      setDurationSeconds(60 * 60);
      setSecondsRemaining(60 * 60);
    } else if (newMode === 'custom') {
      // Keep current custom duration
    } else if (newMode === 'stopwatch') {
      setStopwatchSeconds(0);
    }
  }

  function adjustMinutes(delta) {
    if (mode === 'stopwatch') return;
    const newMins = Math.max(5, Math.min(180, Math.floor(secondsRemaining / 60) + delta));
    setDurationSeconds(newMins * 60);
    setSecondsRemaining(newMins * 60);
    setMode('custom');
  }

  function handleStart() {
    audioService.playClick();
    setIsRunning(true);
  }

  function handlePause() {
    audioService.playClick();
    setIsRunning(false);
  }

  function handleReset() {
    audioService.playClick();
    setIsRunning(false);
    setIsBreak(false);
    timerAnchorRef.current = null;
    if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setSecondsRemaining(durationSeconds);
    }
  }

  function handleSkipBreak() {
    audioService.playClick();
    setIsBreak(false);
    setIsRunning(false);
    timerAnchorRef.current = null;
    setSecondsRemaining(durationSeconds);
  }

  function handleSessionComplete() {
    audioService.playTimerBell();

    if (isBreak) {
      setIsBreak(false);
      setDurationSeconds(25 * 60);
      setSecondsRemaining(25 * 60);
    } else {
      const sessionMinutes = Math.round(durationSeconds / 60);
      const linkedTask = todayTasks.find(t => t.id === selectedTaskId);

      store.addTimerSession({
        subject: selectedSubject,
        taskName: linkedTask ? linkedTask.text : `${mode.toUpperCase()} study focus session`,
        durationMinutes: sessionMinutes,
        durationSeconds: durationSeconds,
        dateStr: getTodayString()
      });

      if (linkedTask) {
        store.updateTask(linkedTask.id, { completed: true, completedAt: new Date().toISOString() });
      }

      // If in Pomodoro mode, offer short 5m break
      if (mode === 'pomodoro') {
        setIsBreak(true);
        setDurationSeconds(5 * 60);
        setSecondsRemaining(5 * 60);
      } else {
        setSecondsRemaining(durationSeconds);
      }
    }
  }

  function handleSaveManualLog(e) {
    e.preventDefault();
    store.addTimerSession({
      subject: logSubject,
      taskName: logNotes.trim() || 'Manual study session log',
      durationMinutes: parseInt(logMinutes, 10) || 30,
      durationSeconds: (parseInt(logMinutes, 10) || 30) * 60,
      dateStr: getTodayString()
    });

    audioService.playSuccess();
    setIsLogModalOpen(false);
    setLogNotes('');
  }

  // Format MM:SS
  const displaySecs = mode === 'stopwatch' ? stopwatchSeconds : secondsRemaining;
  const mins = Math.floor(displaySecs / 60);
  const secs = displaySecs % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // SVG Progress calculation
  const timerProgress = mode === 'stopwatch'
    ? Math.min(1, (stopwatchSeconds % 3600) / 3600)
    : Math.min(1, Math.max(0, (durationSeconds - secondsRemaining) / (durationSeconds || 1)));
  const radius = 112;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * timerProgress);

  // Sessions History
  const sessions = data.timerSessions || [];
  const todaySessions = sessions.filter(s => s.dateStr === getTodayString());
  const todayMinutes = store.getTodayStudiedMinutes();
  const dailyTarget = data.settings?.dailyTargetMinutes || 120;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header Overview */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Focus Studio</span>
              <span className="badge badge-lavender">Deep Work Timer</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              Study Timer & Focus Sprint
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Eliminate distractions and log focused preparation sprints across DSA, Core CS, Aptitude, and Projects.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Quiet Study Vignette */}
            <div
              style={{
                width: '120px',
                height: '76px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}
            >
              <img
                src="/images/study_timer_vignette.jpg"
                alt="Quiet study corner with books and warm light"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsLogModalOpen(true)}
            >
              <Plus size={15} /> Log Offline Session
            </button>
          </div>
        </div>

        {/* Daily Target Progress Strip */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>Today's Deep Focus Target</span>
            <span style={{ fontWeight: 600, color: todayMinutes >= dailyTarget ? 'var(--color-sage)' : 'var(--color-primary-text)' }}>
              {todayMinutes}m / {dailyTarget}m ({Math.min(100, Math.round((todayMinutes / dailyTarget) * 100))}%)
            </span>
          </div>
          <div className="progress-track" style={{ height: '6px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, (todayMinutes / dailyTarget) * 100)}%`,
                backgroundColor: todayMinutes >= dailyTarget ? 'var(--color-sage)' : 'var(--color-primary)'
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Main High-Tech Timer Arena */}
      <div
        className="card"
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          width: '100%',
          padding: '36px 24px',
          textAlign: 'center',
          background: 'var(--bg-card)',
          border: isRunning ? '1px solid var(--color-primary)' : '1px solid var(--border-soft)',
          boxShadow: isRunning ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
          borderRadius: 'var(--radius-lg)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Presets Mode Selector */}
        <div
          style={{
            display: 'inline-flex',
            gap: '6px',
            backgroundColor: 'var(--bg-card-subtle)',
            padding: '6px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-soft)',
            marginBottom: '26px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '100%'
          }}
        >
          <button
            className={`btn btn-sm ${mode === 'pomodoro' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => switchMode('pomodoro')}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
          >
            Pomodoro (25m)
          </button>
          <button
            className={`btn btn-sm ${mode === 'aptitude' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => switchMode('aptitude')}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
          >
            Aptitude Drill (30m)
          </button>
          <button
            className={`btn btn-sm ${mode === 'deep-focus' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => switchMode('deep-focus')}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
          >
            Deep Focus (45m)
          </button>
          <button
            className={`btn btn-sm ${mode === 'marathon' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => switchMode('marathon')}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
          >
            Marathon (60m)
          </button>
          <button
            className={`btn btn-sm ${mode === 'stopwatch' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => switchMode('stopwatch')}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
          >
            Stopwatch
          </button>
        </div>

        {/* Subject & Task Linking Selectors */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto 28px auto',
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-soft)'
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Active Subject:
            </label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isRunning}
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Link Today's Task (Optional):
            </label>
            <select
              className="form-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isRunning}
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              <option value="">-- No specific task --</option>
              {todayTasks.map(t => <option key={t.id} value={t.id}>{t.text}</option>)}
            </select>
          </div>
        </div>

        {/* Circular Display Ring with Glowing SVG Progress */}
        <div
          style={{
            position: 'relative',
            width: '280px',
            height: '280px',
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}
          >
            <circle cx="140" cy="140" r="116" fill="none" stroke="var(--border-soft)" strokeWidth="8" />
            <circle
              cx="140"
              cy="140"
              r="116"
              fill="none"
              stroke={isBreak ? 'var(--color-sage)' : 'var(--color-primary)'}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 116}
              strokeDashoffset={(2 * Math.PI * 116) - ((2 * Math.PI * 116) * timerProgress)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>

          {/* Time & State Indicator (Carefully Centered and Truncated) */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '220px',
              padding: '0 10px'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isBreak ? 'var(--color-sage)' : 'var(--color-primary-text)',
                marginBottom: '4px'
              }}
            >
              {isBreak ? '☕ Rest & Recharge' : isRunning ? '⚡ In Deep Focus' : 'Ready to Sprint'}
            </span>

            <div
              style={{
                fontSize: '3.8rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-heading)',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--text-main)',
                lineHeight: 1.05,
                margin: '2px 0'
              }}
            >
              {formattedTime}
            </div>

            <div
              title={selectedSubject}
              style={{
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                maxWidth: '190px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginTop: '6px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-soft)'
              }}
            >
              {selectedSubject}
            </div>

            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {mode === 'stopwatch' ? 'Elapsed' : `${Math.round(timerProgress * 100)}% complete`}
            </span>
          </div>
        </div>

        {/* Quick Minute Adjusters (+/- 5m) */}
        {!isRunning && mode !== 'stopwatch' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => adjustMinutes(-5)}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Minus size={13} /> 5m
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Adjust Duration
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => adjustMinutes(5)}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Plus size={13} /> 5m
            </button>
          </div>
        )}

        {/* Primary Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {!isRunning ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStart}
              style={{
                padding: '12px 36px',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Play size={18} fill="currentColor" />
              <span>Start Session</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-lg"
              onClick={handlePause}
              style={{
                padding: '12px 36px',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <Pause size={18} />
              <span>Pause Timer</span>
            </button>
          )}

          <button
            className="btn btn-secondary btn-lg"
            onClick={handleReset}
            title="Reset timer"
            style={{ padding: '12px 22px', borderRadius: 'var(--radius-lg)' }}
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>

          {isBreak && (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSkipBreak}
              style={{ padding: '12px 22px', borderRadius: 'var(--radius-lg)' }}
            >
              <SkipForward size={18} />
              <span>Skip Break</span>
            </button>
          )}
        </div>

        {/* Ambient Noise & Focus Utilities */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '28px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '18px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Focus Audio:
            </span>
            <select
              className="form-select"
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              style={{ width: 'auto', fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <option value="off">Off (Silent)</option>
              <option value="rain">Gentle Rain Noise</option>
              <option value="whitenoise">Calm White Noise</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Today's Completed Sessions Log */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Today's Focus Log ({todaySessions.length} sessions)
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Accredited study intervals logged automatically to your placement performance metrics.
            </div>
          </div>
        </div>

        {todaySessions.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Clock size={32} style={{ opacity: 0.35, marginBottom: '8px' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>No study sessions logged today yet</div>
            <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>Start the timer above to log your first focus sprint!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todaySessions.map((sess, idx) => (
              <div
                key={sess.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-soft)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-blush)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.78rem'
                    }}
                  >
                    {sess.durationMinutes || Math.round((sess.durationSeconds || 0) / 60)}m
                  </div>

                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {sess.subject}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      {sess.taskName || 'Focus session'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    <CheckCircle2 size={12} /> Logged
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => store.deleteTimerSession(sess.id)}
                    style={{ padding: '6px', color: 'var(--color-danger)' }}
                    title="Remove session log"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Log Modal */}
      {isLogModalOpen && (
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log Offline Study Session"
        >
          <form onSubmit={handleSaveManualLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={logSubject}
                onChange={(e) => setLogSubject(e.target.value)}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Minutes Studied</label>
              <input
                type="number"
                className="form-input"
                min="5"
                max="300"
                value={logMinutes}
                onChange={(e) => setLogMinutes(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Session Topic / Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Read R.S. Aggarwal HCF & LCM formulas"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Session
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Plus,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BookOpen,
  Sparkles,
  Code2,
  Check,
  Circle,
  Bookmark
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';
import { STRIVERS_A2Z_STEPS } from '../data/striversDsaData.js';

const CUSTOM_TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Searching',
  'Sorting',
  'Recursion',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees & BST',
  'Graphs',
  'Dynamic Programming',
  'Mixed Practice'
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES = ['All', 'Not Started', 'Attempted', 'Solved', 'Needs Revision'];

export function DsaTracker({ data, store }) {
  // Mode: 'strivers' | 'custom'
  const [activeTab, setActiveTab] = useState('strivers');

  // Striver Sheet View state
  const [expandedSteps, setExpandedSteps] = useState({ 'step-1': true, 'step-3': true });
  const [striverDifficultyFilter, setStriverDifficultyFilter] = useState('All');
  const [striverStatusFilter, setStriverStatusFilter] = useState('All');
  const [striverSearch, setStriverSearch] = useState('');
  
  // Custom Problems View state
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [customSearch, setCustomSearch] = useState('');

  // Modal & Form State for custom problems
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Easy');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('Attempted');
  const [notes, setNotes] = useState('');

  // Notes Modal for Striver's problems
  const [activeNoteProblem, setActiveNoteProblem] = useState(null);
  const [problemNoteText, setProblemNoteText] = useState('');

  const striversProgress = data?.striversProgress || {};
  const customProblems = data?.dsaProblems || [];
  const target = data?.settings?.dsaTarget || 80;

  // Compute Striver Sheet Metrics
  const allStriverProblems = useMemo(() => {
    const list = [];
    STRIVERS_A2Z_STEPS.forEach(s => {
      s.topics.forEach(t => {
        t.problems.forEach(p => {
          list.push({ ...p, stepId: s.stepId, stepTitle: s.title, topicTitle: t.title });
        });
      });
    });
    return list;
  }, []);

  const totalStriverCount = allStriverProblems.length;
  const solvedStriverCount = useMemo(() => {
    return allStriverProblems.filter(p => striversProgress[p.id]?.status === 'Solved').length;
  }, [allStriverProblems, striversProgress]);

  const attemptedStriverCount = useMemo(() => {
    return allStriverProblems.filter(p => striversProgress[p.id]?.status === 'Attempted').length;
  }, [allStriverProblems, striversProgress]);

  const revisionStriverCount = useMemo(() => {
    return allStriverProblems.filter(p => striversProgress[p.id]?.status === 'Needs Revision').length;
  }, [allStriverProblems, striversProgress]);

  // Total Unique Solved (Strivers + Custom)
  const totalSolvedOverall = solvedStriverCount + customProblems.filter(p => p.status === 'Solved').length;

  function toggleStepExpand(stepId) {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  }

  function handleToggleStriverStatus(problemId, currentStatus) {
    const nextStatus = currentStatus === 'Solved' ? 'Not Started' : 'Solved';
    store.updateStriversProgress(problemId, { status: nextStatus });
    if (nextStatus === 'Solved') {
      audioService.playSuccess();
    } else {
      audioService.playClick();
    }
  }

  function handleSetStriverStatus(problemId, newStatus) {
    store.updateStriversProgress(problemId, { status: newStatus });
    if (newStatus === 'Solved') audioService.playSuccess();
    else audioService.playClick();
  }

  function handleOpenNoteModal(prob) {
    setActiveNoteProblem(prob);
    setProblemNoteText(striversProgress[prob.id]?.notes || '');
  }

  function handleSaveNote() {
    if (activeNoteProblem) {
      store.updateStriversProgress(activeNoteProblem.id, { notes: problemNoteText.trim() });
      audioService.playSuccess();
      setActiveNoteProblem(null);
    }
  }

  // Filtered custom problems
  const filteredCustomProblems = useMemo(() => {
    return customProblems.filter(p => {
      const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
      const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      const matchStat = selectedStatus === 'All' || p.status === selectedStatus;
      const matchSearch = !customSearch.trim() || 
        p.title.toLowerCase().includes(customSearch.toLowerCase()) ||
        (p.company && p.company.toLowerCase().includes(customSearch.toLowerCase()));
      return matchTopic && matchDiff && matchStat && matchSearch;
    });
  }, [customProblems, selectedTopic, selectedDifficulty, selectedStatus, customSearch]);

  function handleSaveCustomProblem(e) {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingProblem) {
      store.updateDsaProblem(editingProblem.id, {
        title: title.trim(),
        topic,
        difficulty,
        company: company.trim(),
        url: url.trim(),
        status,
        notes: notes.trim()
      });
    } else {
      store.addDsaProblem({
        title: title.trim(),
        topic,
        difficulty,
        company: company.trim(),
        url: url.trim(),
        status,
        notes: notes.trim(),
        platform: 'LeetCode'
      });
    }

    audioService.playSuccess();
    setIsModalOpen(false);
    resetCustomForm();
  }

  function resetCustomForm() {
    setEditingProblem(null);
    setTitle('');
    setCompany('');
    setTopic('Arrays');
    setDifficulty('Easy');
    setUrl('');
    setStatus('Attempted');
    setNotes('');
  }

  function openEditCustom(prob) {
    setEditingProblem(prob);
    setTitle(prob.title || '');
    setCompany(prob.company || '');
    setTopic(prob.topic || 'Arrays');
    setDifficulty(prob.difficulty || 'Easy');
    setUrl(prob.url || '');
    setStatus(prob.status || 'Attempted');
    setNotes(prob.notes || '');
    setIsModalOpen(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header & TakeUForward Hero Banner */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-primary">DSA Practice Journal</span>
              <span className="badge badge-success">Striver's A2Z Sheet</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              Data Structures & Algorithms
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              Featuring Striver's A2Z DSA Sheet — the gold standard 18-step curriculum by Raj Vikramaditya (TakeUForward) for tech placement interviews.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Minimal Study Desk Photograph Vignette */}
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
                src="/images/dsa_minimal_desk.jpg"
                alt="Minimalist laptop and notebook desk setup"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>

            <a
              href="https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <span>Visit Striver's Official Sheet</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {/* Overall DSA Metrics Grid */}
        <div className="stat-grid-4" style={{ marginTop: '22px', marginBottom: 0 }}>
          <div className="stat-card">
            <span className="stat-card-label">Total Solved</span>
            <div className="stat-card-value" style={{ color: 'var(--color-primary-text)' }}>
              {totalSolvedOverall} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {target} target</span>
            </div>
            <div className="progress-track" style={{ height: '4px', marginTop: '6px' }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, (totalSolvedOverall / target) * 100)}%`, backgroundColor: 'var(--color-primary)' }} />
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Striver A2Z Progress</span>
            <div className="stat-card-value" style={{ color: 'var(--color-sage)' }}>
              {solvedStriverCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalStriverCount}</span>
            </div>
            <div className="stat-card-sub">{Math.round((solvedStriverCount / (totalStriverCount || 1)) * 100)}% syllabus completed</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">In Progress / Attempted</span>
            <div className="stat-card-value" style={{ color: 'var(--color-warning)' }}>
              {attemptedStriverCount}
            </div>
            <div className="stat-card-sub">Active solving pipeline</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Needs Revision</span>
            <div className="stat-card-value" style={{ color: revisionStriverCount > 0 ? 'var(--color-danger)' : 'var(--text-main)' }}>
              {revisionStriverCount}
            </div>
            <div className="stat-card-sub">Flagged for spaced repetition</div>
          </div>
        </div>
      </div>

      {/* 2. Mode Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '2px' }}>
        <button
          className={`btn ${activeTab === 'strivers' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('strivers')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 600 }}
        >
          <Sparkles size={15} />
          <span>Striver's A2Z DSA Sheet (18 Steps)</span>
          <span className="badge badge-primary" style={{ marginLeft: '4px' }}>{totalStriverCount}</span>
        </button>

        <button
          className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('custom')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 600 }}
        >
          <Code2 size={15} />
          <span>Custom Problem Log</span>
          <span className="badge badge-primary" style={{ marginLeft: '4px' }}>{customProblems.length}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: STRIVER'S A2Z DSA SHEET                            */}
      {/* ========================================================= */}
      {activeTab === 'strivers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls & Search */}
          <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search Striver problems, steps, algorithms..."
                  value={striverSearch}
                  onChange={(e) => setStriverSearch(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '0.84rem' }}
                />
              </div>

              <select
                className="form-select"
                value={striverDifficultyFilter}
                onChange={(e) => setStriverDifficultyFilter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.82rem' }}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                className="form-select"
                value={striverStatusFilter}
                onChange={(e) => setStriverStatusFilter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.82rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Needs Revision">Needs Revision</option>
                <option value="Not Started">Not Started</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const allExpanded = {};
                  STRIVERS_A2Z_STEPS.forEach(s => { allExpanded[s.stepId] = true; });
                  setExpandedSteps(allExpanded);
                }}
              >
                Expand All Steps
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setExpandedSteps({})}
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* 18 Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {STRIVERS_A2Z_STEPS.map(step => {
              // Collect problems for this step matching filter
              const stepProblems = [];
              step.topics.forEach(t => {
                t.problems.forEach(p => {
                  const pStat = striversProgress[p.id]?.status || 'Not Started';
                  const matchDiff = striverDifficultyFilter === 'All' || p.difficulty === striverDifficultyFilter;
                  const matchStat = striverStatusFilter === 'All' || pStat === striverStatusFilter;
                  const matchSearch = !striverSearch.trim() ||
                    p.title.toLowerCase().includes(striverSearch.toLowerCase()) ||
                    step.title.toLowerCase().includes(striverSearch.toLowerCase()) ||
                    t.title.toLowerCase().includes(striverSearch.toLowerCase());

                  if (matchDiff && matchStat && matchSearch) {
                    stepProblems.push({ ...p, topicTitle: t.title });
                  }
                });
              });

              // If filters active and no matching problem in step, hide unless search is empty
              if (stepProblems.length === 0 && (striverSearch.trim() || striverDifficultyFilter !== 'All' || striverStatusFilter !== 'All')) {
                return null;
              }

              // Overall step metrics
              let totalInStep = 0;
              let solvedInStep = 0;
              step.topics.forEach(t => {
                t.problems.forEach(p => {
                  totalInStep++;
                  if (striversProgress[p.id]?.status === 'Solved') solvedInStep++;
                });
              });
              const stepPct = totalInStep > 0 ? Math.round((solvedInStep / totalInStep) * 100) : 0;
              const isExpanded = Boolean(expandedSteps[step.stepId] || striverSearch.trim());

              return (
                <div key={step.stepId} className="card" style={{ overflow: 'hidden' }}>
                  {/* Step Header Accordion */}
                  <div
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isExpanded ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => toggleStepExpand(step.stepId)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: stepPct === 100 ? 'var(--color-success-bg)' : 'var(--color-primary-blush)',
                          color: stepPct === 100 ? 'var(--color-success)' : 'var(--color-primary-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          border: `1px solid ${stepPct === 100 ? 'var(--color-success-border)' : 'rgba(99, 102, 241, 0.25)'}`
                        }}
                      >
                        {step.stepNumber}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                            {step.title}
                          </h3>
                          {stepPct === 100 && (
                            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                              <Check size={11} /> Mastered
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {step.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {solvedInStep} / {totalInStep} Solved
                        </div>
                        <div style={{ width: '90px', height: '5px', backgroundColor: 'var(--border-soft)', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${stepPct}%`, height: '100%', backgroundColor: stepPct === 100 ? 'var(--color-success)' : 'var(--color-primary)' }} />
                        </div>
                      </div>

                      <div style={{ color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Step Problems Table */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border-soft)', padding: '8px 12px' }}>
                      {step.topics.map(topic => {
                        const topicProblems = topic.problems.filter(p => {
                          const pStat = striversProgress[p.id]?.status || 'Not Started';
                          const matchDiff = striverDifficultyFilter === 'All' || p.difficulty === striverDifficultyFilter;
                          const matchStat = striverStatusFilter === 'All' || pStat === striverStatusFilter;
                          const matchSearch = !striverSearch.trim() ||
                            p.title.toLowerCase().includes(striverSearch.toLowerCase()) ||
                            topic.title.toLowerCase().includes(striverSearch.toLowerCase());
                          return matchDiff && matchStat && matchSearch;
                        });

                        if (topicProblems.length === 0) return null;

                        return (
                          <div key={topic.topicId} style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', margin: '6px 0' }}>
                              {topic.title}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {topicProblems.map(prob => {
                                const prog = striversProgress[prob.id] || { status: 'Not Started', notes: '' };
                                const isSolved = prog.status === 'Solved';

                                return (
                                  <div
                                    key={prob.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '10px 14px',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: isSolved ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                      border: isSolved ? '1px solid var(--color-success-border)' : '1px solid transparent',
                                      transition: 'background-color 0.15s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                      {/* Checkbox */}
                                      <button
                                        onClick={() => handleToggleStriverStatus(prob.id, prog.status)}
                                        style={{
                                          background: isSolved ? 'var(--color-success)' : 'transparent',
                                          border: `2px solid ${isSolved ? 'var(--color-success)' : 'var(--border-soft)'}`,
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
                                        title={isSolved ? 'Mark as Not Solved' : 'Mark as Solved'}
                                      >
                                        {isSolved && <Check size={14} strokeWidth={3} />}
                                      </button>

                                      {/* Title */}
                                      <span
                                        style={{
                                          fontSize: '0.88rem',
                                          fontWeight: 600,
                                          color: isSolved ? 'var(--text-muted)' : 'var(--text-main)',
                                          textDecoration: isSolved ? 'line-through' : 'none'
                                        }}
                                      >
                                        {prob.title}
                                      </span>

                                      {/* Difficulty Badge */}
                                      <span
                                        className={`badge ${
                                          prob.difficulty === 'Easy' ? 'badge-success' :
                                          prob.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'
                                        }`}
                                        style={{ fontSize: '0.68rem', padding: '1px 7px' }}
                                      >
                                        {prob.difficulty}
                                      </span>

                                      {prog.notes && (
                                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                                          Note attached
                                        </span>
                                      )}
                                    </div>

                                    {/* Actions & Links */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {/* Status Selector Dropdown */}
                                      <select
                                        className="form-select"
                                        value={prog.status}
                                        onChange={(e) => handleSetStriverStatus(prob.id, e.target.value)}
                                        style={{ fontSize: '0.74rem', padding: '3px 8px', width: 'auto' }}
                                      >
                                        <option value="Not Started">Not Started</option>
                                        <option value="Attempted">Attempted</option>
                                        <option value="Solved">Solved</option>
                                        <option value="Needs Revision">Needs Revision</option>
                                      </select>

                                      {/* Note Button */}
                                      <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleOpenNoteModal(prob)}
                                        title="Add / Edit revision notes"
                                        style={{ padding: '6px' }}
                                      >
                                        <Bookmark size={15} color={prog.notes ? 'var(--color-primary)' : 'currentColor'} />
                                      </button>

                                      {/* TakeUForward Article Link */}
                                      {prob.tuf && (
                                        <a
                                          href={prob.tuf}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-ghost btn-sm"
                                          title="Read TakeUForward solution & video"
                                          style={{ padding: '6px', color: 'var(--color-accent-violet)' }}
                                        >
                                          <ExternalLink size={15} />
                                        </a>
                                      )}

                                      {/* LeetCode Link */}
                                      {prob.leetcode && (
                                        <a
                                          href={prob.leetcode}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-secondary btn-sm"
                                          title="Practice on LeetCode"
                                          style={{ fontSize: '0.74rem', padding: '3px 9px' }}
                                        >
                                          Practice
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CUSTOM PROBLEMS LOG                                */}
      {/* ========================================================= */}
      {activeTab === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls Bar */}
          <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search custom problems or company..."
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '0.84rem' }}
                />
              </div>

              <select
                className="form-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                style={{ width: 'auto', fontSize: '0.82rem' }}
              >
                {CUSTOM_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{ width: 'auto', fontSize: '0.82rem' }}
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => { resetCustomForm(); setIsModalOpen(true); }}
            >
              <Plus size={16} />
              <span>Log Custom Problem</span>
            </button>
          </div>

          {/* Custom Problems Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {filteredCustomProblems.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Code2 size={40} style={{ opacity: 0.35, marginBottom: '12px' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>No custom problems logged yet</div>
                <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>Log unique problems you solve across LeetCode, CodeChef, HackerRank, or on-campus OAs.</div>
                <button
                  className="btn btn-primary"
                  onClick={() => { resetCustomForm(); setIsModalOpen(true); }}
                  style={{ marginTop: '16px' }}
                >
                  <Plus size={15} /> Log Your First Problem
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-card-subtle)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px 18px' }}>Problem Title</th>
                      <th style={{ padding: '12px 14px' }}>Topic</th>
                      <th style={{ padding: '12px 14px' }}>Difficulty</th>
                      <th style={{ padding: '12px 14px' }}>Company</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomProblems.map(prob => (
                      <tr key={prob.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{prob.title}</span>
                            {prob.url && (
                              <a href={prob.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                          {prob.notes && (
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                              {prob.notes}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 14px' }}>{prob.topic}</td>
                        <td style={{ padding: '14px 14px' }}>
                          <span className={`badge ${prob.difficulty === 'Easy' ? 'badge-success' : prob.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td style={{ padding: '14px 14px', color: 'var(--text-secondary)' }}>
                          {prob.company || '—'}
                        </td>
                        <td style={{ padding: '14px 14px' }}>
                          <span className={`badge ${prob.status === 'Solved' ? 'badge-success' : prob.status === 'Attempted' ? 'badge-warning' : 'badge-danger'}`}>
                            {prob.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEditCustom(prob)}
                            style={{ padding: '6px' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              if (window.confirm(`Delete "${prob.title}"?`)) store.deleteDsaProblem(prob.id);
                            }}
                            style={{ padding: '6px', color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Note Editing Modal for Striver Problems */}
      {activeNoteProblem && (
        <Modal
          isOpen={Boolean(activeNoteProblem)}
          onClose={() => setActiveNoteProblem(null)}
          title={`Problem Notes: ${activeNoteProblem.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Write your key insights, edge cases, time/space complexity notes, or code templates.
            </div>
            <textarea
              className="form-textarea"
              style={{ minHeight: '140px' }}
              placeholder="e.g., Two pointer approach. Must handle negative numbers. Time: O(N), Space: O(1)..."
              value={problemNoteText}
              onChange={(e) => setProblemNoteText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveNoteProblem(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveNote}>
                Save Notes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Custom Problem */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProblem ? 'Edit Custom Problem' : 'Log Custom DSA Problem'}
        >
          <form onSubmit={handleSaveCustomProblem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Problem Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Trapping Rain Water"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Topic</label>
                <select className="form-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                  {CUSTOM_TOPICS.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Difficulty</label>
                <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Company (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Google, Amazon, TCS"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Attempted">Attempted</option>
                  <option value="Solved">Solved</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Problem URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://leetcode.com/problems/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notes & Edge Cases</label>
              <textarea
                className="form-textarea"
                placeholder="Key intuition, time & space complexity..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingProblem ? 'Update Problem' : 'Save Problem'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

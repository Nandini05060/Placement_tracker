import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  Layers
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const CATEGORIES = [
  'Data Structures & Algorithms',
  'Core Computer Science',
  'Full Stack & System Design',
  'Aptitude & Logical Reasoning',
  'Soft Skills & HR Preparation',
  'Mock Interviews & Company Sprints'
];

export function Roadmap({ data, store, onNavigate }) {
  const [expandedMilestones, setExpandedMilestones] = useState({});

  // Add / Edit Milestone Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [subtasksText, setSubtasksText] = useState('');

  // Subtask quick add inside card
  const [quickSubtaskInput, setQuickSubtaskInput] = useState({});

  const milestones = data.roadmap || [];

  // Calculate user-defined progress
  let totalTasks = 0;
  let completedTasks = 0;
  let completedMilestones = 0;

  milestones.forEach(m => {
    const tasks = m.defaultTasks || [];
    totalTasks += tasks.length;
    const doneTasks = tasks.filter(t => t.completed).length;
    completedTasks += doneTasks;
    if (m.completed || (tasks.length > 0 && doneTasks === tasks.length)) {
      completedMilestones++;
    }
  });

  const completionPct = milestones.length === 0
    ? 0
    : totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : Math.round((completedMilestones / milestones.length) * 100);

  function toggleExpand(id) {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function handleOpenAdd() {
    setEditingMilestone(null);
    setTitle('');
    setCategory(CATEGORIES[0]);
    setTargetDate('');
    setDescription('');
    setSubtasksText('');
    setIsModalOpen(true);
  }

  function handleOpenEdit(m) {
    setEditingMilestone(m);
    setTitle(m.title || '');
    setCategory(m.category || CATEGORIES[0]);
    setTargetDate(m.targetDate || '');
    setDescription(m.description || '');
    setSubtasksText((m.defaultTasks || []).map(t => t.text).join('\n'));
    setIsModalOpen(true);
  }

  function handleSaveMilestone(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const taskLines = subtasksText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const taskObjects = taskLines.map((line, idx) => ({
      id: 'task_' + Date.now() + '_' + idx,
      text: line,
      completed: false
    }));

    if (editingMilestone) {
      store.updateRoadmapMilestone(editingMilestone.id, {
        title: title.trim(),
        category,
        targetDate: targetDate.trim(),
        description: description.trim(),
        defaultTasks: taskObjects.length > 0 ? taskObjects : (editingMilestone.defaultTasks || [])
      });
    } else {
      store.addRoadmapMilestone({
        title: title.trim(),
        category,
        targetDate: targetDate.trim(),
        description: description.trim(),
        defaultTasks: taskObjects
      });
    }

    audioService.playSuccess();
    setIsModalOpen(false);
  }

  function handleDeleteMilestone(id, milestoneTitle) {
    if (window.confirm(`Are you sure you want to delete milestone "${milestoneTitle}"?`)) {
      store.deleteRoadmapMilestone(id);
      audioService.playClick();
    }
  }

  function handleToggleMilestoneStatus(m) {
    const nextCompleted = !m.completed;
    const updatedTasks = (m.defaultTasks || []).map(t => ({
      ...t,
      completed: nextCompleted
    }));
    store.updateRoadmapMilestone(m.id, {
      completed: nextCompleted,
      defaultTasks: updatedTasks,
      completedAt: nextCompleted ? getTodayString() : null
    });
    if (nextCompleted) audioService.playSuccess();
    else audioService.playClick();
  }

  function handleToggleSubtask(milestoneId, subtaskId) {
    store.toggleRoadmapTask(milestoneId, subtaskId);
    audioService.playClick();
  }

  function handleAddInlineSubtask(milestoneId) {
    const text = (quickSubtaskInput[milestoneId] || '').trim();
    if (!text) return;

    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const updatedTasks = [
      ...(milestone.defaultTasks || []),
      { id: 'st_' + Date.now(), text, completed: false }
    ];

    store.updateRoadmapMilestone(milestoneId, { defaultTasks: updatedTasks });
    setQuickSubtaskInput(prev => ({ ...prev, [milestoneId]: '' }));
    audioService.playSuccess();
  }

  function handleDeleteSubtask(milestoneId, subtaskId) {
    const milestone = milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const updatedTasks = (milestone.defaultTasks || []).filter(t => t.id !== subtaskId);
    store.updateRoadmapMilestone(milestoneId, { defaultTasks: updatedTasks });
    audioService.playClick();
  }

  function handleClearAll() {
    if (milestones.length === 0) return;
    if (window.confirm('Are you sure you want to remove all roadmap items and start with a blank roadmap?')) {
      store.clearRoadmap();
      audioService.playClick();
    }
  }

  function handleLoadTemplate() {
    if (milestones.length > 0 && !window.confirm('This will replace your current roadmap with a suggested 4-phase placement template. Proceed?')) {
      return;
    }

    const template = [
      {
        id: 'mile_template_1',
        title: 'Phase 1: DSA Foundations & Language Mastery',
        category: 'Data Structures & Algorithms',
        targetDate: 'Weeks 1–4',
        description: 'Complete Java/C++ syntax, Striver Step 1 to Step 3 (Arrays, Sorting, Two Pointers).',
        completed: false,
        defaultTasks: [
          { id: 'st_t1_1', text: "Master Kadane's algorithm, 2Sum, and Dutch National Flag", completed: false },
          { id: 'st_t1_2', text: 'Practice 25 array problems on LeetCode', completed: false },
          { id: 'st_t1_3', text: 'Implement Quick Sort and Merge Sort from memory', completed: false }
        ]
      },
      {
        id: 'mile_template_2',
        title: 'Phase 2: Core CS Fundamentals (DBMS, OS & CN)',
        category: 'Core Computer Science',
        targetDate: 'Weeks 5–8',
        description: 'Prepare conceptual answers for technical interviews: ACID, Normalization, Process scheduling, TCP/IP.',
        completed: false,
        defaultTasks: [
          { id: 'st_t2_1', text: 'DBMS: Transactions, ACID, Indexing, and SQL Joins', completed: false },
          { id: 'st_t2_2', text: 'OS: Deadlocks, Virtual Memory, Paging, and Multi-threading', completed: false },
          { id: 'st_t2_3', text: 'CN: OSI model, TCP vs UDP, DNS, and HTTP/HTTPS protocol', completed: false }
        ]
      },
      {
        id: 'mile_template_3',
        title: 'Phase 3: Advanced DSA & Project Engineering',
        category: 'Full Stack & System Design',
        targetDate: 'Weeks 9–14',
        description: 'Trees, Graphs, Dynamic Programming, and building a deployed Full Stack portfolio project with live links.',
        completed: false,
        defaultTasks: [
          { id: 'st_t3_1', text: 'Solve Top 20 Binary Tree & BST problems', completed: false },
          { id: 'st_t3_2', text: 'Implement BFS, DFS, and Dijkstra on Graphs', completed: false },
          { id: 'st_t3_3', text: 'Deploy full stack web project on Vercel / Render with GitHub repository', completed: false }
        ]
      },
      {
        id: 'mile_template_4',
        title: 'Phase 4: Mock Interviews, Aptitude & Company Drives',
        category: 'Mock Interviews & Company Sprints',
        targetDate: 'Weeks 15–20',
        description: '30-minute daily R.S. Aggarwal speed drills, AI mock interviews, and applying to Target & Dream companies.',
        completed: false,
        defaultTasks: [
          { id: 'st_t4_1', text: 'Complete 30-min daily aptitude practice on R.S. Aggarwal topics', completed: false },
          { id: 'st_t4_2', text: 'Practice AI Mock Interview with speech feedback', completed: false },
          { id: 'st_t4_3', text: 'Tailor ATS resume and apply to Dream & Target companies', completed: false }
        ]
      }
    ];

    store.setRoadmap(template);
    audioService.playSuccess();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header & Roadmap Progress */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Personalized Roadmap</span>
              <span className="badge badge-lavender">Your Preparation Pathway</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              Placement Roadmap
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '700px' }}>
              Completely customizable according to your schedule, university timeline, and target companies. Add your own phases, topics, and milestones.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleLoadTemplate}>
              <Sparkles size={14} /> Load Suggested Template
            </button>
            {milestones.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={handleClearAll} style={{ color: 'var(--color-danger)' }}>
                <Trash2 size={14} /> Clear All
              </button>
            )}
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Add Milestone
            </button>
          </div>
        </div>

        {/* Live Progress Stats */}
        <div style={{ marginTop: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              Overall Roadmap Progress
            </span>
            <span style={{ fontWeight: 700, color: completionPct === 100 ? 'var(--color-success)' : 'var(--color-primary)' }}>
              {completionPct}% Completed ({completedMilestones} of {milestones.length} milestones finished)
            </span>
          </div>
          <div className="progress-track" style={{ height: '8px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${completionPct}%`,
                background: completionPct === 100 ? 'var(--color-success)' : 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent-violet) 100%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. User Roadmap Milestones List */}
      {milestones.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <MapPin size={48} style={{ opacity: 0.35, color: 'var(--color-primary)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Your Roadmap is a Blank Canvas
          </h3>
          <p style={{ fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 20px auto' }}>
            You have full control over your placement strategy. Add your own phases according to your goals, or load a recommended template to customize.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Create Your First Milestone
            </button>
            <button className="btn btn-secondary" onClick={handleLoadTemplate}>
              <Sparkles size={15} /> Load Suggested Template
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {milestones.map((m, index) => {
            const tasks = m.defaultTasks || [];
            const doneTasks = tasks.filter(t => t.completed).length;
            const isMilestoneDone = m.completed || (tasks.length > 0 && doneTasks === tasks.length);
            const isExpanded = Boolean(expandedMilestones[m.id]);

            return (
              <div
                key={m.id}
                className="card"
                style={{
                  border: isMilestoneDone ? '1px solid var(--color-success-border)' : '1px solid var(--border-soft)',
                  backgroundColor: isMilestoneDone ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-card)'
                }}
              >
                {/* Milestone Header */}
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                    {/* Checkbox for Milestone */}
                    <button
                      onClick={() => handleToggleMilestoneStatus(m)}
                      style={{
                        background: isMilestoneDone ? 'var(--color-success)' : 'transparent',
                        border: `2px solid ${isMilestoneDone ? 'var(--color-success)' : 'var(--border-soft)'}`,
                        borderRadius: '8px',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                      title={isMilestoneDone ? 'Mark as In Progress' : 'Mark as Completed'}
                    >
                      {isMilestoneDone && <Check size={16} strokeWidth={3} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                          Step {index + 1}
                        </span>
                        <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                          {m.category}
                        </span>
                        {m.targetDate && (
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {m.targetDate}
                          </span>
                        )}
                        {isMilestoneDone && (
                          <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                            Completed
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          margin: '6px 0 4px 0',
                          color: isMilestoneDone ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: isMilestoneDone ? 'line-through' : 'none'
                        }}
                      >
                        {m.title}
                      </h3>

                      {m.description && (
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
                          {m.description}
                        </p>
                      )}

                      {tasks.length > 0 && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={13} color="var(--color-success)" />
                          <span>{doneTasks} of {tasks.length} checklist items completed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => toggleExpand(m.id)}
                    >
                      <span>Checklist ({tasks.length})</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleOpenEdit(m)}
                      title="Edit milestone"
                      style={{ padding: '6px' }}
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteMilestone(m.id, m.title)}
                      title="Delete milestone"
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Subtasks Accordion */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border-soft)', padding: '16px 20px', background: 'var(--bg-card-subtle)' }}>
                    {/* Add Inline Subtask */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Add a checklist item (e.g. Master Binary Search on answers)..."
                        value={quickSubtaskInput[m.id] || ''}
                        onChange={(e) => setQuickSubtaskInput(prev => ({ ...prev, [m.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddInlineSubtask(m.id); }}
                        style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddInlineSubtask(m.id)}
                      >
                        <Plus size={14} /> Add Item
                      </button>
                    </div>

                    {/* Subtasks List */}
                    {tasks.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                        No checklist items yet. Add one above.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {tasks.map(task => (
                          <div
                            key={task.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                onClick={() => handleToggleSubtask(m.id, task.id)}
                                style={{
                                  background: task.completed ? 'var(--color-success)' : 'transparent',
                                  border: `2px solid ${task.completed ? 'var(--color-success)' : 'var(--border-soft)'}`,
                                  borderRadius: '5px',
                                  width: '18px',
                                  height: '18px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#FFFFFF',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                              >
                                {task.completed && <Check size={12} strokeWidth={3} />}
                              </button>

                              <span
                                style={{
                                  fontSize: '0.84rem',
                                  fontWeight: 500,
                                  color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                                  textDecoration: task.completed ? 'line-through' : 'none'
                                }}
                              >
                                {task.text}
                              </span>
                            </div>

                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleDeleteSubtask(m.id, task.id)}
                              style={{ padding: '4px', color: 'var(--color-danger)' }}
                              title="Delete checklist item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Adding/Editing Milestone */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMilestone ? 'Edit Milestone' : 'Add Custom Roadmap Milestone'}
        >
          <form onSubmit={handleSaveMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Milestone Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Month 1: DSA Foundations & Array Patterns"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Focus Area / Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Timeline / Target Date</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Weeks 1–3, or Nov 30"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description & Objectives</label>
              <textarea
                className="form-textarea"
                placeholder="What will you accomplish in this milestone?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: '70px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Checklist Items (One per line)</label>
              <textarea
                className="form-textarea"
                placeholder="Item 1: Master Two Pointers&#10;Item 2: Solve 20 LeetCode Mediums&#10;Item 3: Review Binary Search on answer space"
                value={subtasksText}
                onChange={(e) => setSubtasksText(e.target.value)}
                style={{ minHeight: '90px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingMilestone ? 'Update Milestone' : 'Add to Roadmap'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  RotateCcw,
  Check,
  Edit2,
  Filter,
  CheckSquare
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const CATEGORIES = [
  'Java and DSA',
  'Aptitude and reasoning',
  'Core computer science',
  'Soft skills',
  'Project development',
  'Certifications',
  'Revision and interview practice'
];

export function DailyPlanner({ data, store, onNavigate }) {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Pending' | 'Completed'

  // Quick inline add state
  const [quickText, setQuickText] = useState('');
  const [quickCategory, setQuickCategory] = useState(CATEGORIES[0]);
  const [quickPriority, setQuickPriority] = useState('Medium');
  const [quickMinutes, setQuickMinutes] = useState(30);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    text: '',
    category: CATEGORIES[0],
    priority: 'Medium',
    plannedMinutes: 30,
    startTime: '',
    dueTime: '',
    notes: ''
  });

  // Daily Reflection
  const reflections = data.dailyReflections || {};
  const currentReflection = reflections[selectedDate] || { well: '', tomorrow: '', mood: 'Steady Progress' };
  const [reflWell, setReflWell] = useState(currentReflection.well || '');
  const [reflTomorrow, setReflTomorrow] = useState(currentReflection.tomorrow || '');
  const [reflMood, setReflMood] = useState(currentReflection.mood || 'Steady Progress');
  const [reflSaved, setReflSaved] = useState(false);

  // Filter tasks for selected date
  const allTasks = data.dailyTasks || [];
  const dayTasks = allTasks.filter(t => t.date === selectedDate);
  const completedTasks = dayTasks.filter(t => t.completed);
  const pendingTasks = dayTasks.filter(t => !t.completed);
  const dayPct = dayTasks.length > 0 ? Math.round((completedTasks.length / dayTasks.length) * 100) : 0;
  const totalPlannedMinutes = dayTasks.reduce((sum, t) => sum + (parseInt(t.plannedMinutes, 10) || 0), 0);
  const todayStudiedMinutes = selectedDate === getTodayString() ? store.getTodayStudiedMinutes() : 0;

  // Filtered tasks display
  const displayedTasks = dayTasks.filter(t => {
    if (filterStatus === 'Pending') return !t.completed;
    if (filterStatus === 'Completed') return t.completed;
    return true;
  });

  // Quick Inline Add Task
  function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickText.trim()) return;

    store.addTask({
      date: selectedDate,
      text: quickText.trim(),
      category: quickCategory,
      priority: quickPriority,
      plannedMinutes: parseInt(quickMinutes, 10) || 30,
      completed: false
    });

    audioService.playSuccess();
    setQuickText('');
  }

  // Toggle Completion
  function handleToggleTask(taskId, currentStatus) {
    const nextStatus = !currentStatus;
    store.updateTask(taskId, {
      completed: nextStatus,
      completedAt: nextStatus ? new Date().toISOString() : null
    });
    if (nextStatus) {
      audioService.playSuccess();
    } else {
      audioService.playClick();
    }
  }

  // Delete Task
  function handleDeleteTask(taskId) {
    store.deleteTask(taskId);
    audioService.playClick();
  }

  // Open Edit Modal
  function handleOpenEdit(task) {
    setEditingTask(task);
    setEditForm({
      text: task.text || '',
      category: task.category || CATEGORIES[0],
      priority: task.priority || 'Medium',
      plannedMinutes: task.plannedMinutes || 30,
      startTime: task.startTime || '',
      dueTime: task.dueTime || '',
      notes: task.notes || ''
    });
    setIsEditModalOpen(true);
  }

  // Save Edit Modal
  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingTask || !editForm.text.trim()) return;

    store.updateTask(editingTask.id, {
      text: editForm.text.trim(),
      category: editForm.category,
      priority: editForm.priority,
      plannedMinutes: parseInt(editForm.plannedMinutes, 10) || 30,
      startTime: editForm.startTime,
      dueTime: editForm.dueTime,
      notes: editForm.notes
    });

    audioService.playSuccess();
    setIsEditModalOpen(false);
    setEditingTask(null);
  }

  // Save Reflection
  function handleSaveReflection() {
    if (!data.dailyReflections) data.dailyReflections = {};
    data.dailyReflections[selectedDate] = {
      well: reflWell.trim(),
      tomorrow: reflTomorrow.trim(),
      mood: reflMood
    };
    store.saveData();
    audioService.playSuccess();
    setReflSaved(true);
    setTimeout(() => setReflSaved(false), 2500);
  }

  // Clear completed tasks
  function handleClearCompleted() {
    if (completedTasks.length === 0) return;
    if (window.confirm(`Remove ${completedTasks.length} completed tasks from today?`)) {
      completedTasks.forEach(t => store.deleteTask(t.id));
      audioService.playClick();
    }
  }

  // 7-day strip calculation
  const calendarDays = [];
  const base = new Date(selectedDate + 'T00:00:00');
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    const isToday = dStr === getTodayString();
    const isSelected = dStr === selectedDate;
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayNum = d.getDate();
    calendarDays.push({ dStr, dayName, dayNum, isToday, isSelected });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header & Progress Overview */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Daily Execution</span>
              <span className="badge badge-success">Task & Time Studio</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              Daily Planner & Tasks
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Add, prioritize, and check off placement preparation tasks. Gentle consistency builds lasting confidence.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedDate(getTodayString())}
              style={{ fontWeight: 600 }}
            >
              Today ({getTodayString()})
            </button>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {/* 7-Day Quick Strip */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {calendarDays.map(cd => (
            <button
              key={cd.dStr}
              onClick={() => setSelectedDate(cd.dStr)}
              style={{
                flex: '1',
                minWidth: '85px',
                padding: '10px 8px',
                borderRadius: 'var(--radius-md)',
                border: cd.isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--border-soft)',
                background: cd.isSelected ? 'var(--color-primary-pale)' : 'var(--bg-card-subtle)',
                color: cd.isSelected ? 'var(--color-primary-text)' : 'var(--text-main)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                {cd.dayName} {cd.isToday && '•'}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                {cd.dayNum}
              </span>
            </button>
          ))}
        </div>

        {/* Day Stats Grid */}
        <div className="stat-grid-4" style={{ marginTop: '20px', marginBottom: 0 }}>
          <div className="stat-card">
            <span className="stat-card-label">Completion Velocity</span>
            <div className="stat-card-value" style={{ color: dayPct === 100 && dayTasks.length > 0 ? 'var(--color-sage)' : 'var(--color-primary-text)' }}>
              {dayPct}%
            </div>
            <div className="progress-track" style={{ height: '4px', marginTop: '6px' }}>
              <div className="progress-fill" style={{ width: `${dayPct}%`, backgroundColor: dayPct === 100 ? 'var(--color-sage)' : 'var(--color-primary)' }} />
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Tasks Finished</span>
            <div className="stat-card-value" style={{ color: 'var(--color-sage)' }}>
              {completedTasks.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {dayTasks.length}</span>
            </div>
            <div className="stat-card-sub">{pendingTasks.length} pending execution</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Planned Focus Time</span>
            <div className="stat-card-value">{totalPlannedMinutes}m</div>
            <div className="stat-card-sub">Estimated task duration</div>
          </div>

          <div className="stat-card">
            <span className="stat-card-label">Timer Studied</span>
            <div className="stat-card-value" style={{ color: 'var(--color-primary-text)' }}>
              {todayStudiedMinutes}m
            </div>
            <div className="stat-card-sub">Recorded deep study time</div>
          </div>
        </div>
      </div>

      {/* 2. Quick Task Addition Section (Direct & Frictionless) */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Plus size={18} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.18rem', margin: 0, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
            Quick Add Task for {selectedDate}
          </h2>
        </div>

        <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-field"
              placeholder="What do you want to achieve? (e.g., Solve 2 Binary Search problems, Revise OS Virtual Memory)"
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              style={{ flex: '1', minWidth: '260px' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontWeight: 700 }}>
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category:</span>
              <select
                className="form-select"
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                style={{ width: 'auto', fontSize: '0.8rem', padding: '5px 10px' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority:</span>
              <select
                className="form-select"
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value)}
                style={{ width: 'auto', fontSize: '0.8rem', padding: '5px 10px' }}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Time Est:</span>
              <select
                className="form-select"
                value={quickMinutes}
                onChange={(e) => setQuickMinutes(e.target.value)}
                style={{ width: 'auto', fontSize: '0.8rem', padding: '5px 10px' }}
              >
                <option value="15">15 mins</option>
                <option value="25">25 mins</option>
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">60 mins</option>
                <option value="90">90 mins</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Task List Section with Ticking and Removal */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${filterStatus === 'All' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterStatus('All')}
            >
              All Tasks ({dayTasks.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'Pending' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterStatus('Pending')}
            >
              Pending ({pendingTasks.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'Completed' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterStatus('Completed')}
            >
              Completed ({completedTasks.length})
            </button>
          </div>

          {completedTasks.length > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleClearCompleted}
              style={{ color: 'var(--color-danger)', fontSize: '0.78rem' }}
            >
              <Trash2 size={13} /> Clear Completed
            </button>
          )}
        </div>

        {/* Task Cards */}
        {displayedTasks.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CheckSquare size={36} style={{ opacity: 0.35, marginBottom: '10px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)' }}>
              {filterStatus === 'Completed' ? 'No tasks completed yet for this day' : 'No tasks scheduled for this day'}
            </div>
            <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
              {filterStatus === 'Pending' && dayTasks.length > 0 ? 'All tasks are completed! Great job!' : 'Type a task in the quick add bar above to plan your day.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayedTasks.map(task => {
              const isDone = task.completed;

              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isDone ? '1px solid var(--color-success-border)' : '1px solid var(--border-soft)',
                    backgroundColor: isDone ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card-subtle)',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {/* Left: Checkbox & Text */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <button
                      onClick={() => handleToggleTask(task.id, isDone)}
                      style={{
                        background: isDone ? 'var(--color-success)' : 'transparent',
                        border: `2px solid ${isDone ? 'var(--color-success)' : 'var(--border-soft)'}`,
                        borderRadius: '6px',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                      title={isDone ? 'Untick (Mark as Incomplete)' : 'Tick (Mark as Completed)'}
                    >
                      {isDone && <Check size={14} strokeWidth={3} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: isDone ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: isDone ? 'line-through' : 'none'
                        }}
                      >
                        {task.text}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                          {task.category}
                        </span>

                        <span
                          className={`badge ${
                            task.priority === 'High' ? 'badge-danger' :
                            task.priority === 'Medium' ? 'badge-warning' : 'badge-info'
                          }`}
                          style={{ fontSize: '0.68rem', padding: '1px 8px' }}
                        >
                          {task.priority}
                        </span>

                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {task.plannedMinutes || 30}m
                        </span>

                        {task.notes && (
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            • {task.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleOpenEdit(task)}
                      title="Edit task details"
                      style={{ padding: '6px' }}
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Remove task"
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Daily Reflection Section */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Daily Reflection & Plan for Tomorrow
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Calibrate your progress and set actionable intentions for {selectedDate}.
            </div>
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleSaveReflection}>
            {reflSaved ? '✓ Saved!' : 'Save Reflection'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">What went well today?</label>
            <textarea
              className="form-textarea"
              placeholder="e.g., Solved Kadane's algorithm without hints, maintained 45-min deep focus on DBMS."
              value={reflWell}
              onChange={(e) => setReflWell(e.target.value)}
              style={{ minHeight: '75px' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">What is the priority for tomorrow?</label>
            <textarea
              className="form-textarea"
              placeholder="e.g., Complete 30-min Aptitude drill on Time & Distance, practice 2 Mock HR answers."
              value={reflTomorrow}
              onChange={(e) => setReflTomorrow(e.target.value)}
              style={{ minHeight: '75px' }}
            />
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
        >
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Task Description *</label>
              <input
                type="text"
                className="form-input"
                value={editForm.text}
                onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Planned Minutes</label>
              <input
                type="number"
                className="form-input"
                min="5"
                max="300"
                value={editForm.plannedMinutes}
                onChange={(e) => setEditForm(prev => ({ ...prev, plannedMinutes: e.target.value }))}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notes & Checklist</label>
              <textarea
                className="form-textarea"
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Key focal points..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/**
 * Daily Study Planner & Execution Tracker
 * Configurable 120-minute daily goal, 6 structured placement categories,
 * planned vs actual study time tracking, reflections, and weekly review integration.
 */

class DailyPlannerManager {
  constructor() {
    this.selectedDate = null;
    this.editingTaskId = null;
  }

  init() {
    this.selectedDate = window.nandiniStore.getTodayString();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const datePicker = document.getElementById('planner-date-picker');
    if (datePicker) {
      datePicker.value = this.selectedDate;
      datePicker.addEventListener('change', (e) => {
        this.selectedDate = e.target.value;
        this.render();
      });
    }

    const prevDayBtn = document.getElementById('planner-btn-prev-day');
    const nextDayBtn = document.getElementById('planner-btn-next-day');
    const todayBtn = document.getElementById('planner-btn-today');

    if (prevDayBtn) prevDayBtn.addEventListener('click', () => this.shiftDay(-1));
    if (nextDayBtn) nextDayBtn.addEventListener('click', () => this.shiftDay(1));
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.selectedDate = window.nandiniStore.getTodayString();
        if (datePicker) datePicker.value = this.selectedDate;
        this.render();
      });
    }

    const addTaskBtn = document.getElementById('planner-btn-add-task');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => this.openTaskModal());
    }

    const taskForm = document.getElementById('planner-task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveTaskFromModal();
      });
    }

    const modal = document.getElementById('planner-task-modal');
    const closeBtn = document.getElementById('planner-task-modal-close');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    // Auto-save reflections
    const wellInput = document.getElementById('planner-refl-well');
    const focusInput = document.getElementById('planner-refl-focus');
    const plannedInput = document.getElementById('planner-refl-planned-mins');
    const moodSelect = document.getElementById('planner-refl-mood');

    [wellInput, focusInput, plannedInput].forEach(inp => {
      if (inp) inp.addEventListener('blur', () => this.saveReflection());
    });
    if (moodSelect) moodSelect.addEventListener('change', () => this.saveReflection());
  }

  shiftDay(delta) {
    const d = new Date(this.selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    this.selectedDate = d.toISOString().split('T')[0];
    const datePicker = document.getElementById('planner-date-picker');
    if (datePicker) datePicker.value = this.selectedDate;
    this.render();
  }

  render() {
    this.renderHeader();
    this.renderTimeComparison();
    this.renderTasks();
    this.renderReflection();
    this.renderDaySessions();
  }

  renderHeader() {
    const dateObj = new Date(this.selectedDate + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = dateObj.toLocaleDateString(undefined, options);

    const titleEl = document.getElementById('planner-date-heading');
    if (titleEl) {
      const isToday = this.selectedDate === window.nandiniStore.getTodayString();
      titleEl.innerHTML = `<span>${formatted}</span> ${isToday ? '<span class="badge-status-pill status-ready">Today</span>' : ''}`;
    }
  }

  renderTimeComparison() {
    const store = window.nandiniStore;
    const targetMins = store.data.settings.dailyTargetMinutes || 120;

    const sessions = (store.data.timerSessions || []).filter(s => s.dateStr === this.selectedDate);
    const studiedMins = Math.floor(
      sessions.reduce((sum, s) => sum + (s.durationSeconds || s.durationMinutes * 60 || 0), 0) / 60
    );

    const refl = (store.data.dailyReflections && store.data.dailyReflections[this.selectedDate]) || {};
    const plannedMins = refl.plannedMinutes || targetMins;

    const elTarget = document.getElementById('planner-metric-target');
    const elPlanned = document.getElementById('planner-metric-planned');
    const elStudied = document.getElementById('planner-metric-studied');
    const elBar = document.getElementById('planner-time-bar-fill');
    const elStreak = document.getElementById('planner-streak-count');

    if (elTarget) elTarget.textContent = `${targetMins}m`;
    if (elPlanned) elPlanned.textContent = `${plannedMins}m`;
    if (elStudied) elStudied.textContent = `${studiedMins}m`;

    const pct = Math.min(100, Math.round((studiedMins / plannedMins) * 100));
    if (elBar) elBar.style.width = `${pct}%`;

    const streak = store.getStreakInfo();
    if (elStreak) elStreak.textContent = `${streak.currentStreak} day study streak`;
  }

  renderTasks() {
    const listEl = document.getElementById('planner-tasks-list');
    const emptyEl = document.getElementById('planner-tasks-empty');
    const barEl = document.getElementById('planner-tasks-progress-fill');
    const statText = document.getElementById('planner-tasks-stat-text');

    if (!listEl) return;

    const store = window.nandiniStore;
    const tasks = (store.data.dailyTasks || []).filter(t => t.date === this.selectedDate);

    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    if (barEl) barEl.style.width = `${pct}%`;
    if (statText) statText.textContent = `${done} of ${total} tasks completed (${pct}%)`;

    if (tasks.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    listEl.innerHTML = tasks.map(t => {
      const isDone = !!t.completed;
      const prioClass = `prio-${(t.priority || 'medium').toLowerCase()}`;

      return `
        <div class="planner-task-item ${isDone ? 'task-done' : ''}" data-id="${t.id}">
          <label class="pookie-checkbox-label">
            <input type="checkbox" class="planner-task-chk" data-id="${t.id}" ${isDone ? 'checked' : ''}>
            <span class="checkmark"></span>
            <div style="display: flex; flex-direction: column;">
              <span class="task-text ${isDone ? 'strike' : ''}">${this.escapeHtml(t.text)}</span>
              <span class="subtext">${this.escapeHtml(t.category)}</span>
            </div>
          </label>

          <div class="task-meta-right">
            ${t.startTime ? `<span class="task-time-pill">${t.startTime}${t.dueTime ? ' - ' + t.dueTime : ''}</span>` : ''}
            <span class="badge-priority ${prioClass}">${t.priority || 'Medium'}</span>
            <button class="btn-sm btn-ghost btn-del-task" data-id="${t.id}">Delete</button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.planner-task-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.toggleTaskCompletion(id, e.target.checked);
      });
    });

    listEl.querySelectorAll('.btn-del-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteTask(id);
      });
    });
  }

  toggleTaskCompletion(id, isCompleted) {
    const store = window.nandiniStore;
    const task = store.data.dailyTasks.find(t => t.id === id);
    if (!task) return;

    task.completed = isCompleted;
    task.completedAt = isCompleted ? new Date().toISOString() : null;

    if (isCompleted && window.placementAudio) {
      window.placementAudio.playSuccess();
    }

    store.notify('TASKS_UPDATED');
    this.render();
  }

  deleteTask(id) {
    const store = window.nandiniStore;
    store.data.dailyTasks = store.data.dailyTasks.filter(t => t.id !== id);
    store.notify('TASKS_UPDATED');
    this.render();
  }

  openTaskModal() {
    const modal = document.getElementById('planner-task-modal');
    const form = document.getElementById('planner-task-form');
    if (!modal || !form) return;
    form.reset();
    form['planner-task-prio'].value = 'High';
    form['planner-task-cat'].value = 'Programming and DSA';
    modal.style.display = 'flex';
  }

  saveTaskFromModal() {
    const form = document.getElementById('planner-task-form');
    const modal = document.getElementById('planner-task-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const text = form['planner-task-text'].value.trim();
    if (!text) {
      alert('Please enter a task description.');
      return;
    }

    const newTask = {
      id: 'task_' + Date.now(),
      date: this.selectedDate,
      text,
      category: form['planner-task-cat'].value,
      priority: form['planner-task-prio'].value,
      startTime: form['planner-task-start'].value,
      dueTime: form['planner-task-due'].value,
      completed: false,
      completedAt: null
    };

    store.data.dailyTasks.push(newTask);
    store.notify('TASKS_UPDATED');

    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
    this.render();
  }

  renderReflection() {
    const store = window.nandiniStore;
    const refl = (store.data.dailyReflections && store.data.dailyReflections[this.selectedDate]) || {};

    const wellInput = document.getElementById('planner-refl-well');
    const focusInput = document.getElementById('planner-refl-focus');
    const plannedInput = document.getElementById('planner-refl-planned-mins');
    const moodSelect = document.getElementById('planner-refl-mood');

    if (wellInput) wellInput.value = refl.whatWentWell || '';
    if (focusInput) focusInput.value = refl.tomorrowFocus || '';
    if (plannedInput) plannedInput.value = refl.plannedMinutes || store.data.settings.dailyTargetMinutes || 120;
    if (moodSelect) moodSelect.value = refl.mood || 'Focused & Energetic';
  }

  saveReflection() {
    const store = window.nandiniStore;
    const wellInput = document.getElementById('planner-refl-well');
    const focusInput = document.getElementById('planner-refl-focus');
    const plannedInput = document.getElementById('planner-refl-planned-mins');
    const moodSelect = document.getElementById('planner-refl-mood');

    if (!store.data.dailyReflections) store.data.dailyReflections = {};

    store.data.dailyReflections[this.selectedDate] = {
      whatWentWell: wellInput ? wellInput.value.trim() : '',
      tomorrowFocus: focusInput ? focusInput.value.trim() : '',
      plannedMinutes: plannedInput ? parseInt(plannedInput.value, 10) || 120 : 120,
      mood: moodSelect ? moodSelect.value : 'Focused & Energetic'
    };

    store.notify('REFLECTION_UPDATED');
    this.renderTimeComparison();
  }

  renderDaySessions() {
    const container = document.getElementById('planner-sessions-history');
    if (!container) return;

    const store = window.nandiniStore;
    const sessions = (store.data.timerSessions || []).filter(s => s.dateStr === this.selectedDate);

    if (sessions.length === 0) {
      container.innerHTML = `<div class="empty-state-notice">No study timer sessions recorded on this date.</div>`;
      return;
    }

    container.innerHTML = sessions.map(s => {
      const mins = s.durationMinutes || Math.floor((s.durationSeconds || 0) / 60);
      return `
        <div class="session-history-pill">
          <div>
            <strong>${this.escapeHtml(s.subject)}</strong>
            <span class="subtext">Duration: ${mins} mins • Mode: ${s.mode}</span>
          </div>
          <button class="btn-sm btn-ghost btn-del-sess" data-id="${s.id}">Delete</button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-del-sess').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this mistakenly recorded study session?')) {
          store.deleteTimerSession(id);
          this.render();
        }
      });
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.nandiniPlanner = new DailyPlannerManager();

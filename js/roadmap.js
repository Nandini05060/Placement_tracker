/**
 * 24-Week Interactive Placement Roadmap Manager
 * Expandable weekly syllabus cards, editable tasks and subtasks,
 * resources, learning objectives, notes, and direct timer session integration.
 */

class PlacementRoadmapManager {
  constructor() {
    this.selectedMonth = 'all';
    this.expandedWeekId = 1;
    this.searchQuery = '';
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const pills = document.querySelectorAll('.roadmap-month-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.selectedMonth = pill.getAttribute('data-month');
        this.renderWeeks();
      });
    });

    const searchInp = document.getElementById('roadmap-search-input');
    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderWeeks();
      });
    }
  }

  getFilteredWeeks() {
    const store = window.nandiniStore;
    if (!store) return [];
    let list = store.data.roadmap || [];

    if (this.selectedMonth !== 'all') {
      const mNum = parseInt(this.selectedMonth, 10);
      list = list.filter(w => w.monthNumber === mNum);
    }

    if (this.searchQuery) {
      list = list.filter(w =>
        (w.title || '').toLowerCase().includes(this.searchQuery) ||
        (w.description || '').toLowerCase().includes(this.searchQuery) ||
        (w.subjectKey || '').toLowerCase().includes(this.searchQuery) ||
        (w.objectives || []).some(o => o.toLowerCase().includes(this.searchQuery))
      );
    }

    return list;
  }

  render() {
    this.renderRoadmapHeader();
    this.renderWeeks();
  }

  renderRoadmapHeader() {
    const store = window.nandiniStore;
    if (!store) return;

    const prog = store.getPreparationCompletion();
    const fillEl = document.getElementById('roadmap-progress-fill');
    const textEl = document.getElementById('roadmap-progress-text');
    const currentWeekInput = document.getElementById('roadmap-current-week-input');

    if (fillEl) fillEl.style.width = `${prog.percentage}%`;
    if (textEl) textEl.textContent = `${prog.completedWeeks} of ${prog.totalWeeks} Weeks Finished (${prog.percentage}% Weighted Completion)`;

    if (currentWeekInput) {
      currentWeekInput.value = store.data.settings.currentWeek || 1;
      currentWeekInput.onchange = (e) => {
        const val = Math.max(1, Math.min(24, parseInt(e.target.value, 10) || 1));
        store.data.settings.currentWeek = val;
        store.notify('SETTINGS_UPDATED');
      };
    }
  }

  renderWeeks() {
    const container = document.getElementById('roadmap-weeks-container');
    if (!container) return;

    const weeks = this.getFilteredWeeks();
    if (weeks.length === 0) {
      container.innerHTML = `<div class="empty-state-notice">No roadmap weeks match your search criteria.</div>`;
      return;
    }

    container.innerHTML = weeks.map(w => {
      const isExpanded = w.id === this.expandedWeekId;
      const tasks = w.defaultTasks || [];
      const totalTasks = tasks.length;
      const doneTasks = tasks.filter(t => t.completed).length;
      const taskPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      const isWeekDone = !!w.completed;

      return `
        <div class="roadmap-week-card ${isWeekDone ? 'week-completed' : ''} ${isExpanded ? 'week-expanded' : ''}" data-id="${w.id}">
          <div class="week-header-row" data-id="${w.id}">
            <div class="week-title-area">
              <span class="week-badge-num">Week ${w.weekNum}</span>
              <div class="week-title-details">
                <h3 class="week-heading">${this.escapeHtml(w.title)}</h3>
                <span class="subtext">${this.escapeHtml(w.monthTitle)} • <strong>${this.escapeHtml(w.subjectKey)}</strong> (Weight: ${w.weight || 4}%)</span>
              </div>
            </div>

            <div class="week-status-area">
              <div class="week-mini-progress">
                <span>${doneTasks}/${totalTasks} Tasks (${taskPct}%)</span>
                <div class="mini-bar-track">
                  <div class="mini-bar-fill" style="width: ${taskPct}%"></div>
                </div>
              </div>
              <button class="btn-sm btn-ghost btn-week-toggle" data-id="${w.id}">
                ${isExpanded ? 'Hide' : 'Details'}
              </button>
            </div>
          </div>

          <div class="week-body" style="${isExpanded ? 'display: block;' : 'display: none;'}">
            <p class="week-desc">${this.escapeHtml(w.description)}</p>

            <div class="week-objectives-box">
              <h4>Learning Objectives:</h4>
              <ul class="week-objectives-list">
                ${(w.objectives || []).map(obj => `<li>${this.escapeHtml(obj)}</li>`).join('')}
              </ul>
            </div>

            <div class="week-daily-target-box">
              <span class="subtext">Suggested Daily Target: <strong>${this.escapeHtml(w.suggestedDailyTarget)}</strong></span>
            </div>

            <div class="week-tasks-section">
              <div class="tasks-section-header">
                <h4>Weekly Checkpoints & Practice Problems:</h4>
                <button class="btn-sm btn-ghost btn-add-week-task" data-id="${w.id}">+ Add Task</button>
              </div>

              <div class="week-tasks-list">
                ${tasks.map(t => `
                  <div class="week-task-item ${t.completed ? 'task-done' : ''}">
                    <label class="pookie-checkbox-label">
                      <input type="checkbox" class="week-task-chk" data-week-id="${w.id}" data-task-id="${t.id}" ${t.completed ? 'checked' : ''}>
                      <span class="checkmark"></span>
                      <span class="${t.completed ? 'strike' : ''}">${this.escapeHtml(t.text)}</span>
                    </label>
                    <button class="btn-icon-tiny btn-del-week-task" data-week-id="${w.id}" data-task-id="${t.id}" title="Delete task">×</button>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="week-resources-section">
              <h4>Curated Resources & Documentation:</h4>
              <div class="resources-pills">
                ${(w.resources || []).map(r => `
                  <a href="${r.url}" target="_blank" rel="noopener" class="res-link-pill">
                    <span>${this.escapeHtml(r.title)}</span>
                    <span class="ext-arrow">↗</span>
                  </a>
                `).join('')}
              </div>
            </div>

            <div class="week-notes-section">
              <h4>Personal Notes & Tricky Interview Pointers:</h4>
              <textarea class="week-notes-textarea" data-id="${w.id}" placeholder="Record algorithmic edge cases, common pitfalls, and interview flashcard notes...">${this.escapeHtml(w.notes || '')}</textarea>
            </div>

            <div class="week-footer-actions">
              <button class="btn-primary btn-start-timer-for-week" data-subject="${this.escapeHtml(w.subjectKey)}">
                ⏱️ Start Study Session (${this.escapeHtml(w.subjectKey)})
              </button>
              <button class="btn-secondary btn-mark-week-complete ${isWeekDone ? 'is-complete' : ''}" data-id="${w.id}">
                ${isWeekDone ? '✓ Week Completed' : 'Mark Week as Completed'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.week-header-row').forEach(hdr => {
      hdr.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('input')) return;
        const id = parseInt(hdr.getAttribute('data-id'), 10);
        this.expandedWeekId = (this.expandedWeekId === id) ? null : id;
        this.renderWeeks();
      });
    });

    container.querySelectorAll('.btn-week-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        this.expandedWeekId = (this.expandedWeekId === id) ? null : id;
        this.renderWeeks();
      });
    });

    container.querySelectorAll('.week-task-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const weekId = parseInt(e.target.getAttribute('data-week-id'), 10);
        const taskId = e.target.getAttribute('data-task-id');
        this.toggleWeekTask(weekId, taskId, e.target.checked);
      });
    });

    container.querySelectorAll('.btn-add-week-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const weekId = parseInt(btn.getAttribute('data-id'), 10);
        const text = prompt('Enter a new task for this week:');
        if (text && text.trim()) {
          this.addWeekTask(weekId, text.trim());
        }
      });
    });

    container.querySelectorAll('.btn-del-week-task').forEach(btn => {
      btn.addEventListener('click', () => {
        const weekId = parseInt(btn.getAttribute('data-week-id'), 10);
        const taskId = btn.getAttribute('data-task-id');
        this.deleteWeekTask(weekId, taskId);
      });
    });

    container.querySelectorAll('.week-notes-textarea').forEach(txt => {
      txt.addEventListener('blur', (e) => {
        const weekId = parseInt(e.target.getAttribute('data-id'), 10);
        this.saveWeekNotes(weekId, e.target.value);
      });
    });

    container.querySelectorAll('.btn-mark-week-complete').forEach(btn => {
      btn.addEventListener('click', () => {
        const weekId = parseInt(btn.getAttribute('data-id'), 10);
        this.toggleWeekCompleted(weekId);
      });
    });

    container.querySelectorAll('.btn-start-timer-for-week').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.getAttribute('data-subject');
        this.jumpToTimerWithSubject(sub);
      });
    });
  }

  toggleWeekTask(weekId, taskId, isChecked) {
    const store = window.nandiniStore;
    const week = (store.data.roadmap || []).find(w => w.id === weekId);
    if (!week) return;

    const task = (week.defaultTasks || []).find(t => t.id === taskId);
    if (!task) return;

    task.completed = isChecked;
    if (isChecked && window.placementAudio) {
      window.placementAudio.playClick();
    }

    store.notify('ROADMAP_UPDATED');
    this.render();
  }

  addWeekTask(weekId, text) {
    const store = window.nandiniStore;
    const week = (store.data.roadmap || []).find(w => w.id === weekId);
    if (!week) return;

    week.defaultTasks = week.defaultTasks || [];
    week.defaultTasks.push({
      id: 'task_' + Date.now(),
      text,
      completed: false
    });

    store.notify('ROADMAP_UPDATED');
    this.render();
  }

  deleteWeekTask(weekId, taskId) {
    const store = window.nandiniStore;
    const week = (store.data.roadmap || []).find(w => w.id === weekId);
    if (!week) return;

    week.defaultTasks = (week.defaultTasks || []).filter(t => t.id !== taskId);
    store.notify('ROADMAP_UPDATED');
    this.render();
  }

  saveWeekNotes(weekId, notes) {
    const store = window.nandiniStore;
    const week = (store.data.roadmap || []).find(w => w.id === weekId);
    if (!week) return;
    week.notes = notes.trim();
    store.notify('ROADMAP_UPDATED');
  }

  toggleWeekCompleted(weekId) {
    const store = window.nandiniStore;
    const week = (store.data.roadmap || []).find(w => w.id === weekId);
    if (!week) return;

    week.completed = !week.completed;
    week.completedAt = week.completed ? store.getTodayString() : null;

    if (week.completed) {
      if (window.placementAudio) window.placementAudio.playSuccess();
      if (window.placementConfetti) window.placementConfetti.burst(60);
    }

    store.notify('ROADMAP_UPDATED');
    this.render();
  }

  jumpToTimerWithSubject(subjectName) {
    if (window.nandiniTimer) {
      window.nandiniTimer.selectSubject(subjectName);
    }
    if (window.nandiniApp) {
      window.nandiniApp.navigateTo('view-timer');
    }
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

window.nandiniRoadmap = new PlacementRoadmapManager();

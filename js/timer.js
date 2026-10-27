/**
 * Study Timer Engine
 * Background tab drift-free timing, Pomodoro work/break automation,
 * subject & task linkage, session correction, and persistence across refreshes.
 */

const TIMER_STORAGE_KEY = 'nandini_active_timer_v2';

class StudyTimerManager {
  constructor() {
    this.mode = 'pomodoro'; // 'pomodoro', 'custom', 'stopwatch'
    this.status = 'idle'; // 'idle', 'running', 'paused'
    this.isBreak = false;
    this.subject = 'Programming and DSA';
    this.linkedTaskId = null;

    this.workDuration = 25 * 60;
    this.breakDuration = 5 * 60;
    this.totalDuration = 25 * 60;
    this.remainingSeconds = 25 * 60;
    this.elapsedSeconds = 0;

    this.expectedEndTime = null;
    this.sessionStartTime = null;
    this.intervalId = null;

    this.circumference = 565.48; // 2 * PI * 90
    this.loadActiveState();
  }

  init() {
    this.bindElements();
    if (this.status === 'running') {
      this.resumeRunningInterval();
    } else {
      this.updateUI();
    }
  }

  bindElements() {
    this.displayEl = document.getElementById('timer-time-display');
    this.progressRingEl = document.getElementById('timer-progress-circle');
    this.statusBadgeEl = document.getElementById('timer-mode-badge');
    this.subjectSelectEl = document.getElementById('timer-subject-select');
    this.taskSelectEl = document.getElementById('timer-task-select');

    this.startBtn = document.getElementById('timer-btn-start');
    this.pauseBtn = document.getElementById('timer-btn-pause');
    this.resetBtn = document.getElementById('timer-btn-reset');
    this.skipBreakBtn = document.getElementById('timer-btn-skip-break');

    if (this.subjectSelectEl) {
      this.subjectSelectEl.value = this.subject;
      this.subjectSelectEl.addEventListener('change', (e) => {
        this.subject = e.target.value;
        this.saveActiveState();
      });
    }

    this.populateLinkedTasks();

    if (this.startBtn) this.startBtn.addEventListener('click', () => this.start());
    if (this.pauseBtn) this.pauseBtn.addEventListener('click', () => this.pause());
    if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.reset());
    if (this.skipBreakBtn) this.skipBreakBtn.addEventListener('click', () => this.skipBreak());
  }

  populateLinkedTasks() {
    if (!this.taskSelectEl || !window.nandiniStore) return;
    const todayStr = window.nandiniStore.getTodayString();
    const tasks = (window.nandiniStore.data.dailyTasks || []).filter(t => t.date === todayStr && !t.completed);

    this.taskSelectEl.innerHTML = `
      <option value="">-- No specific linked task --</option>
      ${tasks.map(t => `<option value="${t.id}">${this.escapeHtml(t.text)} (${t.category})</option>`).join('')}
    `;

    this.taskSelectEl.addEventListener('change', (e) => {
      this.linkedTaskId = e.target.value || null;
      if (this.linkedTaskId) {
        const found = tasks.find(t => t.id === this.linkedTaskId);
        if (found && this.subjectSelectEl) {
          this.subjectSelectEl.value = found.category;
          this.subject = found.category;
        }
      }
    });
  }

  setMode(mode, customSeconds = null) {
    if (this.status === 'running') {
      const confirmSwitch = confirm('A study session is currently running. Switch and reset?');
      if (!confirmSwitch) return;
      this.clearActiveTimer();
    }

    this.mode = mode;
    this.isBreak = false;
    this.status = 'idle';

    if (mode === 'pomodoro') {
      this.totalDuration = this.workDuration;
      this.remainingSeconds = this.workDuration;
    } else if (mode === 'custom') {
      const sec = customSeconds || 45 * 60;
      this.totalDuration = sec;
      this.remainingSeconds = sec;
    } else if (mode === 'stopwatch') {
      this.totalDuration = 0;
      this.remainingSeconds = 0;
      this.elapsedSeconds = 0;
    }

    this.saveActiveState();
    this.updateUI();
  }

  setCustomMinutes(mins) {
    const sec = Math.max(1, parseInt(mins, 10)) * 60;
    this.setMode('custom', sec);
  }

  selectSubject(subjectName) {
    this.subject = subjectName;
    if (this.subjectSelectEl) {
      this.subjectSelectEl.value = subjectName;
    }
    this.saveActiveState();
  }

  start() {
    if (this.status === 'running') return;
    if (window.placementAudio) window.placementAudio.playClick();

    if (!this.subject && this.subjectSelectEl) {
      this.subject = this.subjectSelectEl.value || 'Programming and DSA';
    }

    const now = Date.now();
    this.sessionStartTime = this.sessionStartTime || now;

    if (this.mode === 'stopwatch') {
      this.expectedEndTime = now - (this.elapsedSeconds * 1000);
    } else {
      this.expectedEndTime = now + (this.remainingSeconds * 1000);
    }

    this.status = 'running';
    this.saveActiveState();
    this.resumeRunningInterval();
    this.updateUI();
  }

  pause() {
    if (this.status !== 'running') return;
    if (window.placementAudio) window.placementAudio.playClick();

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.status = 'paused';

    if (this.mode === 'stopwatch') {
      this.elapsedSeconds = Math.max(0, Math.floor((Date.now() - this.expectedEndTime) / 1000));
    } else {
      this.remainingSeconds = Math.max(0, Math.round((this.expectedEndTime - Date.now()) / 1000));
    }

    this.saveActiveState();
    this.updateUI();
  }

  reset() {
    if (window.placementAudio) window.placementAudio.playClick();
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.status = 'idle';
    this.sessionStartTime = null;
    this.expectedEndTime = null;

    if (this.mode === 'pomodoro') {
      this.isBreak = false;
      this.totalDuration = this.workDuration;
      this.remainingSeconds = this.workDuration;
    } else if (this.mode === 'custom') {
      this.remainingSeconds = this.totalDuration;
    } else if (this.mode === 'stopwatch') {
      this.elapsedSeconds = 0;
      this.remainingSeconds = 0;
    }

    this.clearActiveTimer();
    this.updateUI();
  }

  skipBreak() {
    if (!this.isBreak) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isBreak = false;
    this.status = 'idle';
    this.totalDuration = this.workDuration;
    this.remainingSeconds = this.workDuration;
    this.clearActiveTimer();
    this.updateUI();
  }

  resumeRunningInterval() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const now = Date.now();

      if (this.mode === 'stopwatch') {
        this.elapsedSeconds = Math.max(0, Math.floor((now - this.expectedEndTime) / 1000));
        this.updateUI();
        this.saveActiveState();
      } else {
        const left = Math.max(0, Math.round((this.expectedEndTime - now) / 1000));
        this.remainingSeconds = left;
        this.updateUI();
        this.saveActiveState();

        if (left <= 0) {
          this.handleTimerFinished();
        }
      }
    }, 250);
  }

  handleTimerFinished() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.status = 'idle';

    if (window.placementAudio) window.placementAudio.playTimerDone();

    if (!this.isBreak) {
      const durationSeconds = this.totalDuration;
      const durationMins = Math.round(durationSeconds / 60);

      if (window.nandiniStore) {
        window.nandiniStore.addTimerSession({
          subject: this.subject || 'General Study',
          durationMinutes: durationMins,
          durationSeconds: durationSeconds,
          mode: this.mode,
          dateStr: window.nandiniStore.getTodayString(),
          linkedTaskId: this.linkedTaskId
        });
      }

      if (this.mode === 'pomodoro') {
        this.isBreak = true;
        this.totalDuration = this.breakDuration;
        this.remainingSeconds = this.breakDuration;
        this.status = 'idle';
        this.saveActiveState();
        this.updateUI();
        alert('Deep work focus session completed and logged! Initiating 5-minute restorative break.');
        return;
      } else {
        alert(`Study session complete: ${durationMins} minutes recorded for ${this.subject}.`);
      }
    } else {
      this.isBreak = false;
      this.totalDuration = this.workDuration;
      this.remainingSeconds = this.workDuration;
      this.status = 'idle';
      this.saveActiveState();
      this.updateUI();
      alert('Break time concluded. Ready for next study block.');
      return;
    }

    this.clearActiveTimer();
    this.updateUI();
  }

  formatTime(totalSec) {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    if (hours > 0) {
      const hh = String(hours).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  }

  updateUI() {
    const displayVal = this.mode === 'stopwatch'
      ? this.formatTime(this.elapsedSeconds)
      : this.formatTime(this.remainingSeconds);

    if (this.displayEl) {
      this.displayEl.textContent = displayVal;
    }

    if (this.progressRingEl) {
      let progressRatio = 0;
      if (this.mode === 'stopwatch') {
        progressRatio = (this.elapsedSeconds % 60) / 60;
      } else {
        if (this.totalDuration > 0) {
          progressRatio = (this.totalDuration - this.remainingSeconds) / this.totalDuration;
        }
      }
      const offset = this.circumference - (progressRatio * this.circumference);
      this.progressRingEl.style.strokeDashoffset = offset;

      if (this.isBreak) {
        this.progressRingEl.style.stroke = '#34D399';
      } else {
        this.progressRingEl.style.stroke = '#E11D48';
      }
    }

    if (this.statusBadgeEl) {
      if (this.isBreak) {
        this.statusBadgeEl.textContent = 'Rest Break (5m)';
        this.statusBadgeEl.className = 'badge-status-pill status-ready';
      } else if (this.mode === 'pomodoro') {
        this.statusBadgeEl.textContent = 'Pomodoro Deep Focus (25m)';
        this.statusBadgeEl.className = 'badge-status-pill';
      } else if (this.mode === 'custom') {
        this.statusBadgeEl.textContent = `Custom Focus (${Math.round(this.totalDuration / 60)}m)`;
        this.statusBadgeEl.className = 'badge-status-pill';
      } else {
        this.statusBadgeEl.textContent = 'Stopwatch Tracking';
        this.statusBadgeEl.className = 'badge-status-pill';
      }
    }

    if (this.startBtn) {
      this.startBtn.style.display = this.status === 'running' ? 'none' : 'inline-flex';
      this.startBtn.innerHTML = this.status === 'paused' ? '<span>▶ Resume</span>' : '<span>▶ Start Session</span>';
    }
    if (this.pauseBtn) {
      this.pauseBtn.style.display = this.status === 'running' ? 'inline-flex' : 'none';
    }
    if (this.skipBreakBtn) {
      this.skipBreakBtn.style.display = this.isBreak ? 'inline-flex' : 'none';
    }

    const todayMins = window.nandiniStore ? window.nandiniStore.getTodayStudiedMinutes() : 0;
    const targetMins = window.nandiniStore ? (window.nandiniStore.data.settings.dailyTargetMinutes || 120) : 120;
    const timerStatsEl = document.getElementById('timer-today-stats');
    if (timerStatsEl) {
      const pct = Math.min(100, Math.round((todayMins / targetMins) * 100));
      timerStatsEl.innerHTML = `
        <div class="timer-today-pill">
          <span>Today: <strong>${todayMins}m / ${targetMins}m</strong></span>
          <div class="mini-bar-track">
            <div class="mini-bar-fill" style="width: ${pct}%"></div>
          </div>
          <span><strong>${pct}%</strong> of daily 2-hour target</span>
        </div>
      `;
    }
  }

  saveActiveState() {
    const state = {
      mode: this.mode,
      status: this.status,
      isBreak: this.isBreak,
      subject: this.subject,
      linkedTaskId: this.linkedTaskId,
      workDuration: this.workDuration,
      breakDuration: this.breakDuration,
      totalDuration: this.totalDuration,
      remainingSeconds: this.remainingSeconds,
      elapsedSeconds: this.elapsedSeconds,
      expectedEndTime: this.expectedEndTime,
      sessionStartTime: this.sessionStartTime
    };
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  loadActiveState() {
    try {
      const raw = localStorage.getItem(TIMER_STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      this.mode = state.mode || 'pomodoro';
      this.isBreak = !!state.isBreak;
      this.subject = state.subject || 'Programming and DSA';
      this.linkedTaskId = state.linkedTaskId || null;
      this.workDuration = state.workDuration || 25 * 60;
      this.breakDuration = state.breakDuration || 5 * 60;
      this.totalDuration = state.totalDuration || 25 * 60;

      if (state.status === 'running' && state.expectedEndTime) {
        const now = Date.now();
        if (this.mode === 'stopwatch') {
          this.expectedEndTime = state.expectedEndTime;
          this.elapsedSeconds = Math.max(0, Math.floor((now - this.expectedEndTime) / 1000));
          this.status = 'running';
        } else {
          const diff = Math.round((state.expectedEndTime - now) / 1000);
          if (diff > 0) {
            this.expectedEndTime = state.expectedEndTime;
            this.remainingSeconds = diff;
            this.status = 'running';
          } else {
            this.status = 'idle';
            this.remainingSeconds = 0;
          }
        }
      } else {
        this.status = state.status || 'idle';
        this.remainingSeconds = state.remainingSeconds || this.totalDuration;
        this.elapsedSeconds = state.elapsedSeconds || 0;
      }
    } catch (e) {}
  }

  clearActiveTimer() {
    try {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    } catch (e) {}
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

window.nandiniTimer = new StudyTimerManager();

/**
 * Nandini | Placement Journey
 * Central Application Controller & SPA Router (nandiniApp)
 * Controls view navigation across all 14 placement preparation modules,
 * header quick metrics, theme management, and settings synchronization.
 */

class NandiniApp {
  constructor() {
    this.currentViewId = 'view-dashboard';
    this.validViews = [
      'view-dashboard',
      'view-planner',
      'view-timer',
      'view-roadmap',
      'view-dsa',
      'view-aptitude',
      'view-core',
      'view-skills',
      'view-certifications',
      'view-projects',
      'view-companies',
      'view-resumes',
      'view-analytics',
      'view-settings'
    ];
  }

  init() {
    const store = window.nandiniStore;
    if (!store) {
      console.error('NandiniStore not initialized');
      return;
    }

    // Apply saved theme
    this.applyTheme(store.data.settings?.theme || 'light');

    // Configure Web Audio state
    if (window.placementAudio) {
      window.placementAudio.setEnabled(store.data.settings?.soundEnabled !== false);
    }

    // Bind event listeners
    this.bindNavigation();
    this.bindSettings();
    this.bindGlobalModals();

    // Initialize all 14 sub-controllers if available
    this.initSubmodules();

    // Check URL hash for direct deep-linking
    const hash = window.location.hash.replace('#', '');
    if (hash && this.validViews.includes(hash)) {
      this.navigateTo(hash, false);
    } else {
      this.navigateTo('view-dashboard', false);
    }

    // Subscribe to store updates for real-time reactivity
    store.subscribe((event) => {
      this.renderHeaderBar();
      if (this.currentViewId === 'view-dashboard' && window.nandiniDashboard) {
        window.nandiniDashboard.render();
      }
    });

    this.renderHeaderBar();
  }

  initSubmodules() {
    try {
      if (window.nandiniDashboard) window.nandiniDashboard.init();
      if (window.nandiniPlanner) window.nandiniPlanner.init();
      if (window.nandiniTimer) window.nandiniTimer.init();
      if (window.nandiniRoadmap) window.nandiniRoadmap.init();
      if (window.nandiniDsa) window.nandiniDsa.init();
      if (window.nandiniAptitude) window.nandiniAptitude.init();
      if (window.nandiniCoreSubjects) window.nandiniCoreSubjects.init();
      if (window.nandiniSkills) window.nandiniSkills.init();
      if (window.nandiniCertifications) window.nandiniCertifications.init();
      if (window.nandiniProjects) window.nandiniProjects.init();
      if (window.nandiniCompanies) window.nandiniCompanies.init();
      if (window.nandiniResumes) window.nandiniResumes.init();
      if (window.nandiniAnalytics) window.nandiniAnalytics.init();
    } catch (err) {
      console.warn('Submodule initialization notice:', err);
    }
  }

  // --- SPA NAVIGATION & ROUTING ---

  bindNavigation() {
    // Navigation links (sidebar and in-page action links with data-view)
    document.addEventListener('click', (e) => {
      const navTarget = e.target.closest('[data-view]');
      if (navTarget) {
        e.preventDefault();
        const viewId = navTarget.getAttribute('data-view');
        if (viewId && this.validViews.includes(viewId)) {
          if (window.placementAudio) window.placementAudio.playClick();
          this.navigateTo(viewId);
          // Close mobile sidebar if open
          document.querySelector('.app-sidebar')?.classList.remove('mobile-open');
        }
      }
    });

    // Hash change listener (browser back / forward buttons)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.validViews.includes(hash) && hash !== this.currentViewId) {
        this.navigateTo(hash, false);
      }
    });

    // Mobile sidebar toggle
    const mobileToggleBtn = document.getElementById('sidebar-toggle-btn');
    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', () => {
        document.querySelector('.app-sidebar')?.classList.toggle('mobile-open');
      });
    }

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const store = window.nandiniStore;
        const curTheme = store?.data.settings?.theme || 'light';
        const nextTheme = curTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(nextTheme);
        if (store) {
          store.data.settings.theme = nextTheme;
          store.notify('THEME_CHANGED');
        }
        if (window.placementAudio) window.placementAudio.playClick();
      });
    }
  }

  navigateTo(viewId, updateHash = true) {
    if (!this.validViews.includes(viewId)) return;

    // Hide all views
    document.querySelectorAll('.page-view').forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
      target.style.display = 'block';
      target.classList.add('active');
      this.currentViewId = viewId;
      if (updateHash) {
        history.pushState(null, '', `#${viewId}`);
      }
    }

    // Update active state in sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      const isMatch = item.getAttribute('data-view') === viewId;
      item.classList.toggle('active', isMatch);
    });

    // Trigger re-render of active module
    this.refreshActiveView(viewId);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  refreshActiveView(viewId) {
    switch (viewId) {
      case 'view-dashboard':
        if (window.nandiniDashboard) window.nandiniDashboard.render();
        break;
      case 'view-planner':
        if (window.nandiniPlanner) window.nandiniPlanner.render();
        break;
      case 'view-timer':
        if (window.nandiniTimer) window.nandiniTimer.updateUI();
        break;
      case 'view-roadmap':
        if (window.nandiniRoadmap) window.nandiniRoadmap.render();
        break;
      case 'view-dsa':
        if (window.nandiniDsa) window.nandiniDsa.render();
        break;
      case 'view-aptitude':
        if (window.nandiniAptitude) window.nandiniAptitude.render();
        break;
      case 'view-core':
        if (window.nandiniCoreSubjects) window.nandiniCoreSubjects.render();
        break;
      case 'view-skills':
        if (window.nandiniSkills) window.nandiniSkills.render();
        break;
      case 'view-certifications':
        if (window.nandiniCertifications) window.nandiniCertifications.render();
        break;
      case 'view-projects':
        if (window.nandiniProjects) window.nandiniProjects.render();
        break;
      case 'view-companies':
        if (window.nandiniCompanies) window.nandiniCompanies.render();
        break;
      case 'view-resumes':
        if (window.nandiniResumes) window.nandiniResumes.render();
        break;
      case 'view-analytics':
        if (window.nandiniAnalytics) window.nandiniAnalytics.render();
        break;
      case 'view-settings':
        this.renderSettingsForm();
        break;
    }
  }

  // --- THEME MANAGEMENT ---

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    }

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><span>Light Theme</span>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><span>Dark Theme</span>`;
    }
  }

  // --- HEADER QUICK METRICS ---

  renderHeaderBar() {
    const store = window.nandiniStore;
    if (!store) return;

    const streakInfo = store.getStreakInfo();
    const todayMins = store.getTodayStudiedMinutes();
    const targetMins = store.data.settings?.dailyTargetMinutes || 120;
    const daysRemaining = store.getDaysRemaining();

    const streakEl = document.getElementById('header-streak-badge');
    const studyPillEl = document.getElementById('header-study-pill');
    const countdownEl = document.getElementById('header-countdown-pill');

    if (streakEl) {
      streakEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
        <span>${streakInfo.currentStreak} Day Streak</span>
      `;
    }

    if (studyPillEl) {
      studyPillEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${todayMins}m / ${targetMins}m Today</span>
      `;
    }

    if (countdownEl) {
      countdownEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>${daysRemaining} Days to Drive</span>
      `;
    }
  }

  // --- SETTINGS VIEW & STORAGE ---

  bindSettings() {
    const form = document.getElementById('settings-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }

    // Export backup
    const exportBtn = document.getElementById('settings-btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportBackup());
    }

    // Import backup
    const importInput = document.getElementById('settings-import-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => this.importBackup(e));
    }

    // Clear / Reset
    const clearBtn = document.getElementById('settings-btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.confirmResetData());
    }
  }

  renderSettingsForm() {
    const store = window.nandiniStore;
    if (!store) return;
    const s = store.data.settings;

    const elName = document.getElementById('set-student-name');
    const elRole = document.getElementById('set-target-role');
    const elDeadline = document.getElementById('set-placement-deadline');
    const elDailyMins = document.getElementById('set-daily-target');
    const elDsaTarget = document.getElementById('set-dsa-target');
    const elSound = document.getElementById('set-sound-enabled');
    const elTheme = document.getElementById('set-theme-select');

    if (elName) elName.value = s.userName || 'Nandini';
    if (elRole) elRole.value = s.targetRole || 'Software Development Engineer (SDE)';
    if (elDeadline) elDeadline.value = s.targetDeadline || '2026-12-31';
    if (elDailyMins) elDailyMins.value = s.dailyTargetMinutes || 120;
    if (elDsaTarget) elDsaTarget.value = s.dsaTarget || 80;
    if (elSound) elSound.checked = s.soundEnabled !== false;
    if (elTheme) elTheme.value = s.theme || 'light';

    // Readiness Weights
    const w = s.readinessWeights || { dsa: 25, coreCs: 20, projects: 20, aptitude: 15, softSkills: 10, certs: 10 };
    const wDsa = document.getElementById('set-weight-dsa');
    const wCore = document.getElementById('set-weight-core');
    const wProj = document.getElementById('set-weight-proj');
    const wApt = document.getElementById('set-weight-apt');
    const wSoft = document.getElementById('set-weight-soft');
    const wCerts = document.getElementById('set-weight-certs');

    if (wDsa) wDsa.value = w.dsa;
    if (wCore) wCore.value = w.coreCs;
    if (wProj) wProj.value = w.projects;
    if (wApt) wApt.value = w.aptitude;
    if (wSoft) wSoft.value = w.softSkills;
    if (wCerts) wCerts.value = w.certs;

    this.updateWeightsSumDisplay();
  }

  updateWeightsSumDisplay() {
    const wDsa = parseInt(document.getElementById('set-weight-dsa')?.value, 10) || 0;
    const wCore = parseInt(document.getElementById('set-weight-core')?.value, 10) || 0;
    const wProj = parseInt(document.getElementById('set-weight-proj')?.value, 10) || 0;
    const wApt = parseInt(document.getElementById('set-weight-apt')?.value, 10) || 0;
    const wSoft = parseInt(document.getElementById('set-weight-soft')?.value, 10) || 0;
    const wCerts = parseInt(document.getElementById('set-weight-certs')?.value, 10) || 0;

    const sum = wDsa + wCore + wProj + wApt + wSoft + wCerts;
    const sumEl = document.getElementById('set-weights-sum');
    if (sumEl) {
      sumEl.textContent = `${sum}%`;
      sumEl.style.color = sum === 100 ? 'var(--color-success, #059669)' : 'var(--color-danger, #E11D48)';
    }
  }

  saveSettings() {
    const store = window.nandiniStore;
    if (!store) return;

    const userName = document.getElementById('set-student-name')?.value.trim() || 'Nandini';
    const targetRole = document.getElementById('set-target-role')?.value.trim() || 'Software Development Engineer (SDE)';
    const targetDeadline = document.getElementById('set-placement-deadline')?.value || '2026-12-31';
    const dailyTargetMinutes = parseInt(document.getElementById('set-daily-target')?.value, 10) || 120;
    const dsaTarget = parseInt(document.getElementById('set-dsa-target')?.value, 10) || 80;
    const soundEnabled = document.getElementById('set-sound-enabled')?.checked ?? true;
    const theme = document.getElementById('set-theme-select')?.value || 'light';

    // Weights validation
    const wDsa = parseInt(document.getElementById('set-weight-dsa')?.value, 10) || 0;
    const wCore = parseInt(document.getElementById('set-weight-core')?.value, 10) || 0;
    const wProj = parseInt(document.getElementById('set-weight-proj')?.value, 10) || 0;
    const wApt = parseInt(document.getElementById('set-weight-apt')?.value, 10) || 0;
    const wSoft = parseInt(document.getElementById('set-weight-soft')?.value, 10) || 0;
    const wCerts = parseInt(document.getElementById('set-weight-certs')?.value, 10) || 0;

    const sum = wDsa + wCore + wProj + wApt + wSoft + wCerts;
    if (sum !== 100) {
      alert(`Readiness weights must add up to exactly 100%. Currently they total ${sum}%. Please adjust and re-save.`);
      return;
    }

    store.data.settings = {
      ...store.data.settings,
      userName,
      targetRole,
      targetDeadline,
      dailyTargetMinutes: Math.max(15, dailyTargetMinutes),
      dsaTarget: Math.max(10, dsaTarget),
      soundEnabled,
      theme,
      readinessWeights: {
        dsa: wDsa,
        coreCs: wCore,
        projects: wProj,
        aptitude: wApt,
        softSkills: wSoft,
        certs: wCerts
      }
    };

    if (window.placementAudio) window.placementAudio.setEnabled(soundEnabled);
    this.applyTheme(theme);
    store.notify('SETTINGS_SAVED');

    if (window.placementAudio) window.placementAudio.playSuccess();
    if (window.placementConfetti) window.placementConfetti.burst(30);

    alert('Placement journey settings successfully updated and saved.');
  }

  exportBackup() {
    const store = window.nandiniStore;
    if (!store) return;

    const jsonStr = store.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nandini-placement-journey-backup-${store.getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.placementAudio) window.placementAudio.playClick();
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const res = window.nandiniStore.importBackupJSON(content);
      if (res.success) {
        if (window.placementAudio) window.placementAudio.playSuccess();
        alert('Placement journey data successfully restored from backup file.');
        window.location.reload();
      } else {
        alert('Unable to import backup file: ' + res.error);
      }
    };
    reader.readAsText(file);
  }

  confirmResetData() {
    const firstPrompt = confirm('Warning: This will reset all your placement journey data, tasks, and problem logs to default starters. Continue?');
    if (!firstPrompt) return;

    const verify = prompt('To confirm permanent reset, type "RESET":');
    if (verify === 'RESET') {
      window.nandiniStore.clearAllData();
      alert('All placement journey data has been reset to defaults.');
      window.location.reload();
    } else {
      alert('Reset cancelled. Your data remains untouched.');
    }
  }

  bindGlobalModals() {
    // ESC key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.app-modal, .pookie-modal').forEach(m => {
          m.style.display = 'none';
        });
      }
    });

    // Close button / backdrop clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-modal]') || e.target.closest('[data-close-modal]')) {
        const modal = e.target.closest('.app-modal, .pookie-modal');
        if (modal) modal.style.display = 'none';
      } else if (e.target.classList.contains('app-modal') || e.target.classList.contains('pookie-modal')) {
        e.target.style.display = 'none';
      }
    });
  }
}

// Instantiate and initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.nandiniApp = new NandiniApp();
  window.placementApp = window.nandiniApp;
  window.nandiniApp.init();
});

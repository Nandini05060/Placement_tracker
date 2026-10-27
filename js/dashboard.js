/**
 * Executive Placement Preparation Dashboard
 * High-density metrics, preparation completion, weighted readiness score, and dream role progress.
 */

class PlacementDashboard {
  constructor() {
    this.container = null;
  }

  init() {
    this.render();
  }

  render() {
    const store = window.nandiniStore;
    if (!store) return;

    this.renderHeaderAndDeadlines(store);
    this.renderMainMetrics(store);
    this.renderReadinessAndDreamRole(store);
    this.renderPrioritiesAndRecommendations(store);
    this.renderSkillBreakdown(store);
  }

  renderHeaderAndDeadlines(store) {
    const elWeek = document.getElementById('dash-prep-week');
    const elDays = document.getElementById('dash-days-remaining');
    const elTargetDate = document.getElementById('dash-target-date-label');
    const elTodayTarget = document.getElementById('dash-target-hours');
    const elTodayStudied = document.getElementById('dash-studied-today');
    const elStudyBar = document.getElementById('dash-study-bar-fill');

    const curWeek = store.data.settings.currentWeek || 1;
    const daysLeft = store.getDaysRemaining();
    const deadlineStr = store.data.settings.targetDeadline || '2026-12-31';
    const deadlineObj = new Date(deadlineStr + 'T00:00:00');
    const deadlineFormatted = isNaN(deadlineObj.getTime())
      ? deadlineStr
      : deadlineObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    const targetMins = store.data.settings.dailyTargetMinutes || 120;
    const studiedMins = store.getTodayStudiedMinutes();
    const studyPct = Math.min(100, Math.round((studiedMins / targetMins) * 100));

    if (elWeek) elWeek.textContent = `Week ${curWeek} of 24`;
    if (elDays) elDays.textContent = `${daysLeft} days remaining`;
    if (elTargetDate) elTargetDate.textContent = `Target Deadline: ${deadlineFormatted}`;
    if (elTodayTarget) elTodayTarget.textContent = `${(targetMins / 60).toFixed(1).replace('.0', '')}h Target (${targetMins}m)`;
    if (elTodayStudied) elTodayStudied.textContent = `${studiedMins}m completed (${studyPct}%)`;
    if (elStudyBar) elStudyBar.style.width = `${studyPct}%`;
  }

  renderMainMetrics(store) {
    const prepCompletion = store.getPreparationCompletion();
    const readiness = store.getPlacementReadiness();
    const solvedDsa = store.getUniqueSolvedDsaCount();
    const dsaTarget = store.data.settings.dsaTarget || 80;
    const certs = store.data.certifications || [];
    const certsDone = certs.filter(c => c.earned || c.status === 'Completed').length;
    const streakInfo = store.getStreakInfo();

    // Projects completion
    const projects = store.data.projects || [];
    let totalM = 0;
    let doneM = 0;
    projects.forEach(p => {
      (p.milestones || []).forEach(m => {
        totalM++;
        if (m.status === 'Completed') doneM++;
      });
    });
    const projPct = totalM > 0 ? Math.round((doneM / totalM) * 100) : 0;

    const elPrepPct = document.getElementById('stat-prep-completion');
    const elPrepSub = document.getElementById('stat-prep-milestones');
    const elReadiness = document.getElementById('stat-readiness-score');
    const elReadinessTag = document.getElementById('stat-readiness-status');
    const elDsa = document.getElementById('stat-dsa-count');
    const elCerts = document.getElementById('stat-certs-count');
    const elProj = document.getElementById('stat-proj-pct');
    const elStreak = document.getElementById('stat-streak-val');

    if (elPrepPct) elPrepPct.textContent = `${prepCompletion.percentage}%`;
    if (elPrepSub) elPrepSub.textContent = `${prepCompletion.completedWeeks}/${prepCompletion.totalWeeks} weeks completed`;

    if (elReadiness) {
      if (!readiness.isAssessed) {
        elReadiness.textContent = 'Not assessed';
        elReadiness.style.fontSize = '1.25rem';
        if (elReadinessTag) elReadinessTag.textContent = 'Log sessions to compute';
      } else {
        elReadiness.textContent = `${readiness.overallScore}/100`;
        elReadiness.style.fontSize = '1.75rem';
        if (elReadinessTag) {
          if (readiness.overallScore >= 80) elReadinessTag.textContent = 'Interview-Ready Tier';
          else if (readiness.overallScore >= 50) elReadinessTag.textContent = 'Developing Foundation';
          else elReadinessTag.textContent = 'Early Preparation';
        }
      }
    }

    if (elDsa) elDsa.textContent = `${solvedDsa} / ${dsaTarget}`;
    if (elCerts) elCerts.textContent = `${certsDone} / ${certs.length}`;
    if (elProj) elProj.textContent = `${projPct}%`;
    if (elStreak) elStreak.textContent = `${streakInfo.currentStreak}d (Best: ${streakInfo.bestStreak}d)`;
  }

  renderReadinessAndDreamRole(store) {
    const dreamProgress = store.getDreamRoleProgress();
    const readiness = store.getPlacementReadiness();

    const elDreamRoleTitle = document.getElementById('dash-dream-role-title');
    const elDreamPct = document.getElementById('dash-dream-pct');
    const elDreamBar = document.getElementById('dash-dream-bar-fill');
    const elDreamDetails = document.getElementById('dash-dream-companies-summary');

    if (elDreamRoleTitle) elDreamRoleTitle.textContent = dreamProgress.targetRole;
    if (elDreamPct) elDreamPct.textContent = `${dreamProgress.percentage}% Prepared`;
    if (elDreamBar) elDreamBar.style.width = `${dreamProgress.percentage}%`;
    if (elDreamDetails) {
      elDreamDetails.textContent = `Tracking ${dreamProgress.dreamCount} Dream & ${dreamProgress.targetCount} Target Employers across ${dreamProgress.totalTracked} profiles.`;
    }

    const elReadinessDate = document.getElementById('dash-readiness-last-updated');
    if (elReadinessDate) elReadinessDate.textContent = `Last evaluated: ${readiness.lastUpdated}`;
  }

  renderPrioritiesAndRecommendations(store) {
    // 1. Today's Top Priorities
    const prioritiesContainer = document.getElementById('dash-priorities-list');
    const topTasks = store.getTopPriorities();

    if (prioritiesContainer) {
      if (topTasks.length === 0) {
        prioritiesContainer.innerHTML = `
          <div class="empty-priority-box">
            <span class="icon-subtle">✓</span>
            <div>
              <p><strong>All high-priority tasks completed!</strong></p>
              <span class="subtext">Add new tasks in your Daily Planner or continue with the roadmap.</span>
            </div>
          </div>
        `;
      } else {
        prioritiesContainer.innerHTML = topTasks.map(t => `
          <div class="priority-task-item prio-${t.priority.toLowerCase()}">
            <div class="priority-task-left">
              <span class="badge-priority badge-${t.priority.toLowerCase()}">${t.priority}</span>
              <div>
                <span class="priority-title">${this.escapeHtml(t.text)}</span>
                <span class="priority-cat">${this.escapeHtml(t.category)}</span>
              </div>
            </div>
            <button class="btn-sm btn-ghost btn-complete-priority" data-id="${t.id}">Done</button>
          </div>
        `).join('');

        prioritiesContainer.querySelectorAll('.btn-complete-priority').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const task = store.data.dailyTasks.find(x => x.id === id);
            if (task) {
              task.completed = true;
              task.completedAt = new Date().toISOString();
              if (window.placementAudio) window.placementAudio.playSuccess();
              store.notify('TASK_COMPLETED');
              this.render();
            }
          });
        });
      }
    }

    // 2. Recommended Next Action
    const recAction = store.getRecommendedNextAction();
    const elRecTitle = document.getElementById('dash-rec-action-title');
    const elRecText = document.getElementById('dash-rec-action-text');
    const elRecBtn = document.getElementById('dash-btn-start-recommended');

    if (elRecTitle) elRecTitle.textContent = `Week ${recAction.weekNum} — ${recAction.subjectKey}`;
    if (elRecText) elRecText.textContent = recAction.taskText;

    if (elRecBtn) {
      elRecBtn.onclick = () => {
        if (window.nandiniTimer) {
          window.nandiniTimer.selectSubject(recAction.subjectKey);
        }
        if (window.nandiniApp) {
          window.nandiniApp.navigateTo('view-timer');
        }
      };
    }
  }

  renderSkillBreakdown(store) {
    const container = document.getElementById('dash-skill-radar-bars');
    if (!container) return;

    const readiness = store.getPlacementReadiness();
    const bd = readiness.breakdown;

    const categories = [
      bd.dsa,
      bd.coreCs,
      bd.projects,
      bd.aptitude,
      bd.softSkills,
      bd.certs
    ];

    container.innerHTML = categories.map(c => `
      <div class="skill-category-row">
        <div class="skill-label-col">
          <span class="skill-name">${c.label}</span>
          <span class="skill-weight">Weight: ${c.weight}%</span>
        </div>
        <div class="skill-track-col">
          <div class="mini-bar-track">
            <div class="mini-bar-fill" style="width: ${c.score}%"></div>
          </div>
        </div>
        <div class="skill-score-col">
          <strong>${c.score}%</strong>
        </div>
      </div>
    `).join('');
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

window.nandiniDashboard = new PlacementDashboard();

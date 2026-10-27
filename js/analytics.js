/**
 * Nandini | Placement Journey
 * Analytics & Weekly Reviews Module (nandiniAnalytics)
 * Provides comprehensive multi-dimensional progress metrics across all 8 preparation areas,
 * SVG data visualizations (study time, subject distribution, DSA topics, core CS),
 * and an executive weekly reflection journal.
 */

class NandiniAnalytics {
  constructor() {
    this.selectedStudyRange = 7; // 7 days or 14 days
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // 7 vs 14 day range toggle
    const range7 = document.getElementById('analytics-range-7');
    const range14 = document.getElementById('analytics-range-14');

    if (range7 && range14) {
      range7.addEventListener('click', () => {
        this.selectedStudyRange = 7;
        range7.classList.add('active');
        range14.classList.remove('active');
        this.renderDailyStudyChart();
      });
      range14.addEventListener('click', () => {
        this.selectedStudyRange = 14;
        range14.classList.add('active');
        range7.classList.remove('active');
        this.renderDailyStudyChart();
      });
    }

    // Weekly review form submission
    const reviewForm = document.getElementById('weekly-review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveWeeklyReview();
      });
    }
  }

  render() {
    this.renderEightDimensions();
    this.renderDailyStudyChart();
    this.renderSubjectDonutChart();
    this.renderDsaTopicChart();
    this.renderCoreCsTopicChart();
    this.renderWeeklyReviewsList();
  }

  /**
   * Multi-dimensional scorecard across 8 areas of placement preparation
   */
  renderEightDimensions() {
    const store = window.nandiniStore;
    if (!store) return;

    // 1. Study Hours
    const totalHours = store.getTotalStudiedHoursFormatted();
    const streakInfo = store.getStreakInfo();
    const targetMins = store.data.settings?.dailyTargetMinutes || 120;
    const todayMins = store.getTodayStudiedMinutes();

    const elTotalHours = document.getElementById('an-stat-hours');
    const elStreak = document.getElementById('an-stat-streak');
    const elTodayMins = document.getElementById('an-stat-today-time');
    if (elTotalHours) elTotalHours.textContent = totalHours;
    if (elStreak) elStreak.textContent = `${streakInfo.currentStreak}d`;
    if (elTodayMins) elTodayMins.textContent = `${todayMins}m / ${targetMins}m`;

    // 2. DSA Solved
    const solvedUnique = store.getSolvedDsaCount();
    const dsaTarget = store.data.settings?.dsaTarget || 80;
    const dsaPct = Math.min(100, Math.round((solvedUnique / dsaTarget) * 100));
    const elDsa = document.getElementById('an-stat-dsa');
    const elDsaPct = document.getElementById('an-stat-dsa-pct');
    if (elDsa) elDsa.textContent = `${solvedUnique} / ${dsaTarget}`;
    if (elDsaPct) elDsaPct.textContent = `${dsaPct}% target`;

    // 3. Core CS
    const coreMetrics = store.getCoreCsProgress();
    const elCoreReady = document.getElementById('an-stat-core-ready');
    const elCoreTotal = document.getElementById('an-stat-core-total');
    if (elCoreReady) elCoreReady.textContent = `${coreMetrics.ready} Interview-Ready`;
    if (elCoreTotal) elCoreTotal.textContent = `${coreMetrics.completed} / ${coreMetrics.total} mastered`;

    // 4. Aptitude Accuracy
    const aptMetrics = store.getAptitudeMetrics();
    const elAptAcc = document.getElementById('an-stat-apt-acc');
    const elAptSolved = document.getElementById('an-stat-apt-solved');
    if (elAptAcc) elAptAcc.textContent = `${aptMetrics.accuracy}%`;
    if (elAptSolved) elAptSolved.textContent = `${aptMetrics.totalSolved} practiced`;

    // 5. Soft Skills
    const softMetrics = store.getSoftSkillsMetrics();
    const elSoftAvg = document.getElementById('an-stat-soft-avg');
    const elSpeaking = document.getElementById('an-stat-speaking-status');
    if (elSoftAvg) elSoftAvg.textContent = `${softMetrics.avgLevel} / 5.0`;
    if (elSpeaking) elSpeaking.textContent = softMetrics.speakingChallengeThisWeek ? 'Challenge Done' : 'Challenge Pending';

    // 6. Projects (FindIt & Others)
    const projectMetrics = store.getProjectMetrics();
    const elProjMilestones = document.getElementById('an-stat-proj-milestones');
    const elProjCount = document.getElementById('an-stat-proj-count');
    if (elProjMilestones) elProjMilestones.textContent = `${projectMetrics.findItCompleted} / ${projectMetrics.findItTotal} steps`;
    if (elProjCount) elProjCount.textContent = `${projectMetrics.totalProjects} Portfolio Projects`;

    // 7. Certifications
    const certMetrics = store.getCertificationsMetrics();
    const elCertEarned = document.getElementById('an-stat-cert-earned');
    const elCertActive = document.getElementById('an-stat-cert-active');
    if (elCertEarned) elCertEarned.textContent = `${certMetrics.earned} Earned`;
    if (elCertActive) elCertActive.textContent = `${certMetrics.inProgress} In-Progress`;

    // 8. Target Companies & Applications
    const compMetrics = store.getCompanyMetrics();
    const appMetrics = store.getApplicationMetrics();
    const elCompReady = document.getElementById('an-stat-comp-ready');
    const elAppApplied = document.getElementById('an-stat-app-applied');
    if (elCompReady) elCompReady.textContent = `${compMetrics.ready} Ready / ${compMetrics.total} tracked`;
    if (elAppApplied) elAppApplied.textContent = `${appMetrics.applied} Applied (${appMetrics.interviewing} Interviewing)`;
  }

  /**
   * Daily Study Time Bar Chart (Native responsive SVG)
   */
  renderDailyStudyChart() {
    const container = document.getElementById('chart-daily-study');
    if (!container) return;

    const store = window.nandiniStore;
    if (!store) return;

    const daysCount = this.selectedStudyRange;
    const now = new Date();
    const dates = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const sessions = store.data.timerSessions || [];
    const dataPoints = dates.map(dStr => {
      const daySessions = sessions.filter(s => s.dateStr === dStr);
      const secs = daySessions.reduce((sum, s) => sum + (s.durationSeconds || (s.durationMinutes || 0) * 60), 0);
      const mins = Math.round(secs / 60);
      const dObj = new Date(dStr + 'T00:00:00');
      const label = dObj.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
      return { date: dStr, label, mins };
    });

    const maxMins = Math.max(120, ...dataPoints.map(d => d.mins));
    const chartHeight = 190;
    const chartWidth = 560;
    const barWidth = Math.min(34, Math.floor((chartWidth - 70) / daysCount) - 6);

    const svgBars = dataPoints.map((dp, idx) => {
      const x = 55 + idx * ((chartWidth - 70) / daysCount) + 3;
      const barH = dp.mins > 0 ? Math.max(6, (dp.mins / maxMins) * (chartHeight - 48)) : 0;
      const y = chartHeight - 28 - barH;
      const isTargetMet = dp.mins >= (store.data.settings?.dailyTargetMinutes || 120);

      return `
        <g class="chart-bar-group" tabindex="0">
          <title>${dp.date}: ${dp.mins} mins studied</title>
          <rect class="chart-bar ${isTargetMet ? 'bar-target-met' : ''}" 
                x="${x}" y="${y}" width="${barWidth}" height="${barH}" 
                rx="4" fill="${isTargetMet ? 'url(#barGradientSuccess)' : 'url(#barGradientPrimary)'}" />
          ${dp.mins > 0 ? `<text class="chart-bar-val" x="${x + barWidth / 2}" y="${Math.max(14, y - 5)}" text-anchor="middle">${dp.mins}m</text>` : ''}
          <text class="chart-bar-lbl" x="${x + barWidth / 2}" y="${chartHeight - 8}" text-anchor="middle">${dp.label.split(' ')[0]}</text>
        </g>
      `;
    }).join('');

    const targetMinutes = store.data.settings?.dailyTargetMinutes || 120;
    const targetY = chartHeight - 28 - ((targetMinutes / maxMins) * (chartHeight - 48));

    container.innerHTML = `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="nandini-svg-chart" role="img" aria-label="Daily Study Time Chart">
        <defs>
          <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C08497" />
            <stop offset="100%" stop-color="#8E5572" />
          </linearGradient>
          <linearGradient id="barGradientSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#34D399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
        <!-- Horizontal grid line -->
        <line x1="45" y1="${chartHeight - 28}" x2="${chartWidth - 10}" y2="${chartHeight - 28}" stroke="rgba(142, 85, 114, 0.2)" stroke-width="1" />
        <!-- Target line -->
        ${targetY > 15 ? `
          <line x1="45" y1="${targetY}" x2="${chartWidth - 10}" y2="${targetY}" stroke="#C08497" stroke-width="1" stroke-dasharray="4,4" />
          <text x="${chartWidth - 12}" y="${targetY - 4}" text-anchor="end" font-size="10" fill="#8E5572" font-weight="600">Target: ${targetMinutes}m</text>
        ` : ''}
        ${svgBars}
      </svg>
    `;
  }

  /**
   * Subject Time Distribution Donut Chart
   */
  renderSubjectDonutChart() {
    const container = document.getElementById('chart-subject-donut');
    const legendEl = document.getElementById('donut-legend');
    if (!container) return;

    const store = window.nandiniStore;
    if (!store) return;

    const sessions = store.data.timerSessions || [];
    const subjectMap = {};

    sessions.forEach(s => {
      const sub = s.subject || 'General Study';
      const mins = (s.durationSeconds || (s.durationMinutes || 0) * 60) / 60;
      subjectMap[sub] = (subjectMap[sub] || 0) + mins;
    });

    const entries = Object.entries(subjectMap);
    const totalMins = entries.reduce((sum, [, mins]) => sum + mins, 0);

    const colors = ['#8E5572', '#B47B95', '#6D4C66', '#52796F', '#4A6FA5', '#E0A96D'];

    if (totalMins === 0) {
      container.innerHTML = `
        <div class="empty-chart-donut">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B47B95" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <p>No study sessions recorded yet. Start a study timer session to log subject time!</p>
        </div>
      `;
      if (legendEl) legendEl.innerHTML = '';
      return;
    }

    let cumulativeAngle = 0;
    const paths = entries.map(([sub, mins], idx) => {
      const fraction = mins / totalMins;
      const angle = fraction * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle = endAngle;

      const pathData = this.describeArc(100, 100, 75, 48, startAngle, endAngle);
      const color = colors[idx % colors.length];

      return `<path d="${pathData}" fill="${color}" class="donut-slice"><title>${sub}: ${Math.round(mins)}m (${Math.round(fraction * 100)}%)</title></path>`;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 200 200" class="donut-svg">
        ${paths}
        <circle cx="100" cy="100" r="45" fill="var(--bg-card, #FFFFFF)" />
        <text x="100" y="96" text-anchor="middle" font-size="11" fill="var(--text-muted, #6B5B6E)" font-weight="500">Total Study</text>
        <text x="100" y="114" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text-primary, #2A1E2D)">${Math.round(totalMins)}m</text>
      </svg>
    `;

    if (legendEl) {
      legendEl.innerHTML = entries.map(([sub, mins], idx) => {
        const pct = Math.round((mins / totalMins) * 100);
        const color = colors[idx % colors.length];
        return `
          <div class="legend-item">
            <span class="legend-dot" style="background: ${color}"></span>
            <span class="legend-name">${this.escapeHtml(sub)}</span>
            <span class="legend-pct">${pct}%</span>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * DSA Topics Solved Progress Bars
   */
  renderDsaTopicChart() {
    const container = document.getElementById('chart-dsa-topics');
    if (!container) return;

    const store = window.nandiniStore;
    if (!store) return;

    const problems = store.data.dsaProblems || [];
    const topics = [
      'Arrays', 'Strings', 'Hashing', 'Searching', 'Sorting',
      'Two Pointers', 'Sliding Window', 'Recursion', 'Linked Lists', 'Stacks'
    ];

    container.innerHTML = topics.map(t => {
      const topicProblems = problems.filter(p => p.topic === t);
      // Unique solved count
      const uniqueSolved = new Set(topicProblems.filter(p => p.status === 'Solved').map(p => p.title.toLowerCase().trim())).size;
      const benchmarkTarget = 10;
      const pct = Math.min(100, Math.round((uniqueSolved / benchmarkTarget) * 100));

      return `
        <div class="dsa-topic-bar-row">
          <div class="topic-lbl-wrap">
            <span class="topic-lbl">${t}</span>
            <span class="topic-num">${uniqueSolved} / ${benchmarkTarget} solved</span>
          </div>
          <div class="topic-bar-track">
            <div class="topic-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Core CS Subject Readiness Progress Bars
   */
  renderCoreCsTopicChart() {
    const container = document.getElementById('chart-core-cs-breakdown');
    if (!container) return;

    const store = window.nandiniStore;
    if (!store) return;

    const subjects = [
      { name: 'Java & OOP Concepts', key: 'Java/OOP' },
      { name: 'Database Management Systems & SQL', key: 'DBMS' },
      { name: 'Operating Systems', key: 'OS' },
      { name: 'Computer Networks', key: 'CN' }
    ];

    const allTopics = store.data.coreCsTopics || [];

    container.innerHTML = subjects.map(sub => {
      const subTopics = allTopics.filter(t => t.subject === sub.key || t.subject === sub.name);
      const total = subTopics.length || 1;
      const mastered = subTopics.filter(t => t.status === 'Interview-Ready' || t.status === 'Practised' || t.status === 'Mastered').length;
      const interviewReady = subTopics.filter(t => t.status === 'Interview-Ready').length;
      const pct = Math.round((mastered / total) * 100);

      return `
        <div class="dsa-topic-bar-row">
          <div class="topic-lbl-wrap">
            <span class="topic-lbl">${sub.name}</span>
            <span class="topic-num">${interviewReady} interview-ready (${mastered}/${total})</span>
          </div>
          <div class="topic-bar-track">
            <div class="topic-bar-fill core-cs-bar" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Save a weekly reflection journal entry
   */
  saveWeeklyReview() {
    const store = window.nandiniStore;
    if (!store) return;

    const weekInput = document.getElementById('rev-week-num');
    const compInput = document.getElementById('rev-completed');
    const strugInput = document.getElementById('rev-struggled');
    const weakInput = document.getElementById('rev-weakest');
    const prioInput = document.getElementById('rev-priority');

    if (!compInput || !strugInput || !prioInput) return;

    const review = {
      id: 'rev_' + Date.now(),
      weekNum: parseInt(weekInput?.value, 10) || 1,
      completed: compInput.value.trim(),
      struggled: strugInput.value.trim(),
      weakestTopics: weakInput ? weakInput.value.trim() : '',
      nextWeekPriority: prioInput.value.trim(),
      date: store.getTodayString()
    };

    if (!review.completed && !review.nextWeekPriority) {
      alert('Please fill out at least what you completed or your top priority for next week.');
      return;
    }

    store.data.weeklyReviews = store.data.weeklyReviews || [];
    store.data.weeklyReviews.unshift(review);
    store.notify('REVIEW_SAVED');

    if (window.placementAudio) window.placementAudio.playSuccess();
    if (window.placementConfetti) window.placementConfetti.burst(30);

    compInput.value = '';
    strugInput.value = '';
    if (weakInput) weakInput.value = '';
    prioInput.value = '';

    this.renderWeeklyReviewsList();
  }

  /**
   * Render past weekly review journal entries
   */
  renderWeeklyReviewsList() {
    const listEl = document.getElementById('weekly-reviews-history');
    if (!listEl) return;

    const store = window.nandiniStore;
    const reviews = (store ? store.data.weeklyReviews : []) || [];

    if (reviews.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <p>No weekly reflections saved yet. Writing a 5-minute Sunday review keeps your placement focus sharp and structured.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = reviews.map((r, idx) => `
      <div class="review-entry-card" data-rev-id="${r.id}">
        <div class="rev-card-header">
          <div class="rev-title-group">
            <span class="badge badge-primary">Week ${r.weekNum}</span>
            <span class="rev-entry-date">Logged on ${r.date}</span>
          </div>
          <button class="btn btn-sm btn-icon btn-ghost" onclick="window.nandiniAnalytics.deleteWeeklyReview('${r.id}')" title="Delete reflection">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        ${r.completed ? `<div class="rev-field"><span class="rev-field-label">Completed:</span><p>${this.escapeHtml(r.completed)}</p></div>` : ''}
        ${r.struggled ? `<div class="rev-field"><span class="rev-field-label">Struggles & Blockers:</span><p>${this.escapeHtml(r.struggled)}</p></div>` : ''}
        ${r.weakestTopics ? `<div class="rev-field"><span class="rev-field-label">Weakest Topics:</span><p>${this.escapeHtml(r.weakestTopics)}</p></div>` : ''}
        ${r.nextWeekPriority ? `<div class="rev-field"><span class="rev-field-label">Next Week Priority:</span><p class="rev-highlight-p">${this.escapeHtml(r.nextWeekPriority)}</p></div>` : ''}
      </div>
    `).join('');
  }

  deleteWeeklyReview(reviewId) {
    const store = window.nandiniStore;
    if (!store) return;
    if (!confirm('Are you sure you want to delete this weekly review entry?')) return;

    store.data.weeklyReviews = (store.data.weeklyReviews || []).filter(r => r.id !== reviewId);
    store.notify('REVIEW_DELETED');
    this.renderWeeklyReviewsList();
  }

  // Geometry helpers for SVG Donut
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, outerRadius, innerRadius, startAngle, endAngle) {
    if (endAngle - startAngle >= 360) {
      endAngle = startAngle + 359.999;
    }

    const startOuter = this.polarToCartesian(x, y, outerRadius, startAngle);
    const endOuter = this.polarToCartesian(x, y, outerRadius, endAngle);
    const startInner = this.polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = this.polarToCartesian(x, y, innerRadius, startAngle);

    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', outerRadius, outerRadius, 0, arcSweep, 1, endOuter.x, endOuter.y,
      'L', startInner.x, startInner.y,
      'A', innerRadius, innerRadius, 0, arcSweep, 0, endInner.x, endInner.y,
      'Z'
    ].join(' ');
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

window.nandiniAnalytics = new NandiniAnalytics();

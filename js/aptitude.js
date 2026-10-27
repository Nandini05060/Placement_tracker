/**
 * Aptitude and Reasoning Tracker
 * Tracks 10 quantitative, logical, and verbal categories with accuracy trends and weak topics analysis.
 */

class AptitudeTrackerManager {
  constructor() {
    this.topics = [
      'Percentages',
      'Ratios and Proportions',
      'Averages',
      'Profit and Loss',
      'Time and Work',
      'Time, Speed and Distance',
      'Probability & Permutations/Combinations',
      'Logical Reasoning',
      'Verbal Ability',
      'Data Interpretation'
    ];
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const addBtn = document.getElementById('apti-btn-log');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openLogModal());
    }

    const form = document.getElementById('apti-session-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSessionFromModal();
      });
    }

    const modal = document.getElementById('apti-modal');
    const closeBtn = document.getElementById('apti-modal-close');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  render() {
    this.renderStats();
    this.renderTopicCards();
    this.renderHistoryTable();
  }

  renderStats() {
    const store = window.nandiniStore;
    if (!store) return;
    const sessions = store.data.aptitudeSessions || [];

    const totalAttempted = sessions.reduce((sum, s) => sum + (parseInt(s.attempted, 10) || 0), 0);
    const totalCorrect = sessions.reduce((sum, s) => sum + (parseInt(s.correct, 10) || 0), 0);
    const totalTimeMins = sessions.reduce((sum, s) => sum + (parseInt(s.timeMinutes, 10) || 0), 0);
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    const elAttempted = document.getElementById('apti-stat-attempted');
    const elCorrect = document.getElementById('apti-stat-correct');
    const elAccuracy = document.getElementById('apti-stat-accuracy');
    const elTime = document.getElementById('apti-stat-time');

    if (elAttempted) elAttempted.textContent = totalAttempted;
    if (elCorrect) elCorrect.textContent = totalCorrect;
    if (elAccuracy) elAccuracy.textContent = `${overallAccuracy}%`;
    if (elTime) elTime.textContent = `${totalTimeMins}m`;

    const weakBanner = document.getElementById('apti-weak-topics-banner');
    if (weakBanner) {
      const topicStats = this.computeTopicStats();
      const weakTopics = Object.keys(topicStats).filter(t => {
        const item = topicStats[t];
        return item.attempted >= 5 && item.accuracy < 65;
      });

      if (weakTopics.length > 0) {
        weakBanner.style.display = 'block';
        weakBanner.innerHTML = `
          <div class="weak-topics-box">
            <span class="weak-icon">⚠️</span>
            <div>
              <strong>Topics Needing Focused Speed Drills:</strong>
              <div class="weak-pills">
                ${weakTopics.map(w => `<span class="pill-weak">${w} (${topicStats[w].accuracy}% accuracy)</span>`).join('')}
              </div>
              <p class="weak-tip">Recommendation: Practice 15 timed questions on these topics to raise accuracy above the 70% threshold required for Tier-1 online assessments.</p>
            </div>
          </div>
        `;
      } else {
        weakBanner.style.display = 'none';
      }
    }
  }

  computeTopicStats() {
    const store = window.nandiniStore;
    const stats = {};
    this.topics.forEach(t => {
      stats[t] = { attempted: 0, correct: 0, timeMinutes: 0, accuracy: 0, sessionsCount: 0 };
    });

    if (!store) return stats;
    (store.data.aptitudeSessions || []).forEach(s => {
      if (!stats[s.topic]) {
        stats[s.topic] = { attempted: 0, correct: 0, timeMinutes: 0, accuracy: 0, sessionsCount: 0 };
      }
      stats[s.topic].attempted += (parseInt(s.attempted, 10) || 0);
      stats[s.topic].correct += (parseInt(s.correct, 10) || 0);
      stats[s.topic].timeMinutes += (parseInt(s.timeMinutes, 10) || 0);
      stats[s.topic].sessionsCount++;
    });

    Object.keys(stats).forEach(t => {
      const it = stats[t];
      it.accuracy = it.attempted > 0 ? Math.round((it.correct / it.attempted) * 100) : 0;
    });

    return stats;
  }

  renderTopicCards() {
    const container = document.getElementById('apti-topic-cards-grid');
    if (!container) return;

    const stats = this.computeTopicStats();

    container.innerHTML = this.topics.map(t => {
      const data = stats[t] || { attempted: 0, correct: 0, accuracy: 0 };
      const accuracyColor = data.accuracy >= 75 ? 'acc-high' : (data.accuracy >= 55 ? 'acc-med' : 'acc-low');
      const isWeak = data.attempted >= 5 && data.accuracy < 65;

      return `
        <div class="apti-topic-card ${isWeak ? 'card-weak-alert' : ''}">
          <div class="apti-topic-title-row">
            <h4>${t}</h4>
            ${isWeak ? '<span class="tag-needs-practice">Weak Topic</span>' : ''}
          </div>
          <div class="apti-metric-row">
            <span>Accuracy: <strong class="${accuracyColor}">${data.attempted > 0 ? data.accuracy + '%' : 'Not assessed'}</strong></span>
            <span>Solved: <strong>${data.correct} / ${data.attempted}</strong></span>
          </div>
          <div class="mini-bar-track">
            <div class="mini-bar-fill ${accuracyColor}" style="width: ${data.accuracy}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderHistoryTable() {
    const tbody = document.getElementById('apti-history-tbody');
    const emptyState = document.getElementById('apti-empty-state');
    if (!tbody) return;

    const sessions = (window.nandiniStore ? window.nandiniStore.data.aptitudeSessions : []) || [];

    if (sessions.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const sorted = [...sessions].reverse();

    tbody.innerHTML = sorted.map(s => {
      const att = parseInt(s.attempted, 10) || 0;
      const corr = parseInt(s.correct, 10) || 0;
      const acc = att > 0 ? Math.round((corr / att) * 100) : 0;
      const accClass = acc >= 75 ? 'acc-high' : (acc >= 55 ? 'acc-med' : 'acc-low');

      return `
        <tr>
          <td><span class="subtext">${s.date || ''}</span></td>
          <td><strong>${this.escapeHtml(s.topic)}</strong></td>
          <td>${att}</td>
          <td>${corr}</td>
          <td><span class="badge-status-pill ${accClass}">${acc}%</span></td>
          <td>${s.timeMinutes || 0}m</td>
          <td class="mistakes-notes-cell">
            ${s.mistakes ? `<div class="mistake-text">⚠️ ${this.escapeHtml(s.mistakes)}</div>` : ''}
            ${s.explanations ? `<div class="explanation-text">💡 ${this.escapeHtml(s.explanations)}</div>` : ''}
          </td>
          <td>
            <button class="btn-sm btn-ghost btn-del-apti" data-id="${s.id}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-del-apti').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteSession(id);
      });
    });
  }

  openLogModal() {
    const modal = document.getElementById('apti-modal');
    const form = document.getElementById('apti-session-form');
    if (!modal || !form) return;

    form.reset();
    form['apti-date'].value = window.nandiniStore ? window.nandiniStore.getTodayString() : '';
    modal.style.display = 'flex';
  }

  saveSessionFromModal() {
    const form = document.getElementById('apti-session-form');
    const modal = document.getElementById('apti-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const topic = form['apti-topic'].value;
    const attempted = parseInt(form['apti-attempted'].value, 10) || 0;
    const correct = parseInt(form['apti-correct'].value, 10) || 0;
    const timeMinutes = parseInt(form['apti-time'].value, 10) || 0;
    const mistakes = form['apti-mistakes'].value.trim();
    const explanations = form['apti-explanations'].value.trim();
    const date = form['apti-date'].value || store.getTodayString();

    if (attempted <= 0) {
      alert('Please enter at least 1 attempted question.');
      return;
    }
    if (correct > attempted) {
      alert('Correct answers cannot exceed attempted questions.');
      return;
    }

    const session = {
      id: 'apti_' + Date.now(),
      topic,
      attempted,
      correct,
      timeMinutes,
      mistakes,
      explanations,
      date,
      createdAt: new Date().toISOString()
    };

    store.data.aptitudeSessions.push(session);
    store.notify('APTITUDE_UPDATED');

    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
    this.render();
  }

  deleteSession(id) {
    const store = window.nandiniStore;
    if (confirm('Delete this practice session record?')) {
      store.data.aptitudeSessions = store.data.aptitudeSessions.filter(s => s.id !== id);
      store.notify('APTITUDE_UPDATED');
      this.render();
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

window.nandiniAptitude = new AptitudeTrackerManager();

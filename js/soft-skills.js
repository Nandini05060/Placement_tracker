/**
 * Professional Soft Skills & Communication Development Module
 * Competencies across Communication, Interviews, Behavioral (STAR),
 * Presentation Confidence, and Professional Habits.
 */

class ProfessionalSkillsManager {
  constructor() {
    this.selectedCategory = 'All';
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const catSelect = document.getElementById('skills-category-filter');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.renderCompetencies();
      });
    }

    // Weekly challenge submission form
    const chalForm = document.getElementById('speaking-challenge-form');
    if (chalForm) {
      chalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSpeakingChallenge();
      });
    }

    // Mock interview evaluation rubric form
    const rubricForm = document.getElementById('mock-rubric-form');
    if (rubricForm) {
      rubricForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveMockEvaluation();
      });
    }
  }

  render() {
    this.renderStats();
    this.renderWeeklyChallenge();
    this.renderCompetencies();
    this.renderRubricsHistory();
  }

  renderStats() {
    const store = window.nandiniStore;
    if (!store) return;
    const comps = (store.data.softSkills && store.data.softSkills.competencies) || [];

    const total = comps.length;
    const confident = comps.filter(c => c.status === 'Confident').length;
    const inProgress = comps.filter(c => c.status === 'In Progress').length;
    const avgConfidence = total > 0
      ? (comps.reduce((s, c) => s + (parseInt(c.confidence, 10) || 1), 0) / total).toFixed(1)
      : '0.0';

    const elTotal = document.getElementById('sk-stat-total');
    const elConfident = document.getElementById('sk-stat-confident');
    const elInProgress = document.getElementById('sk-stat-inprogress');
    const elAvgRating = document.getElementById('sk-stat-avg-rating');

    if (elTotal) elTotal.textContent = total;
    if (elConfident) elConfident.textContent = confident;
    if (elInProgress) elInProgress.textContent = inProgress;
    if (elAvgRating) elAvgRating.textContent = `${avgConfidence} / 5.0`;
  }

  renderWeeklyChallenge() {
    const container = document.getElementById('speaking-challenge-card');
    if (!container) return;

    const store = window.nandiniStore;
    const challenges = (store.data.softSkills && store.data.softSkills.weeklySpeakingChallenges) || [];
    const currentWeek = store.data.settings.currentWeek || 1;

    let activeChallenge = challenges.find(c => c.week === currentWeek) || challenges[0];
    if (!activeChallenge) return;

    const elTopic = document.getElementById('chal-topic-title');
    const elGuide = document.getElementById('chal-guidelines');
    const elStatus = document.getElementById('chal-status-pill');
    const inputLink = document.getElementById('chal-recording-link');
    const inputEval = document.getElementById('chal-self-eval');

    if (elTopic) elTopic.textContent = activeChallenge.topic;
    if (elGuide) elGuide.textContent = activeChallenge.guidelines;
    if (elStatus) {
      elStatus.textContent = activeChallenge.completed ? '✓ Completed' : 'Pending Practice';
      elStatus.className = activeChallenge.completed ? 'badge-status-pill status-ready' : 'badge-status-pill status-pending';
    }
    if (inputLink) inputLink.value = activeChallenge.recordingLink || '';
    if (inputEval) inputEval.value = activeChallenge.selfEvaluation || '';
  }

  saveSpeakingChallenge() {
    const store = window.nandiniStore;
    const currentWeek = store.data.settings.currentWeek || 1;
    const challenges = store.data.softSkills.weeklySpeakingChallenges;
    const chal = challenges.find(c => c.week === currentWeek) || challenges[0];

    const inputLink = document.getElementById('chal-recording-link');
    const inputEval = document.getElementById('chal-self-eval');

    if (chal && inputLink && inputEval) {
      chal.recordingLink = inputLink.value.trim();
      chal.selfEvaluation = inputEval.value.trim();
      chal.completed = true;
      chal.dateCompleted = store.getTodayString();

      if (window.placementAudio) window.placementAudio.playSuccess();
      store.notify('SPEAKING_CHALLENGE_SAVED');
      alert('Speaking challenge recorded and saved to your practice logs!');
      this.renderWeeklyChallenge();
      this.renderStats();
    }
  }

  renderCompetencies() {
    const container = document.getElementById('skills-competencies-grid');
    if (!container) return;

    const store = window.nandiniStore;
    const all = (store.data.softSkills && store.data.softSkills.competencies) || [];

    const filtered = this.selectedCategory === 'All'
      ? all
      : all.filter(c => c.category === this.selectedCategory);

    container.innerHTML = filtered.map(c => `
      <div class="competency-card" data-id="${c.id}">
        <div class="comp-header">
          <span class="comp-category-tag">${this.escapeHtml(c.category)}</span>
          <select class="status-select-sm comp-status-select" data-id="${c.id}">
            <option value="Not Started" ${c.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
            <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Confident" ${c.status === 'Confident' ? 'selected' : ''}>Confident ✓</option>
          </select>
        </div>

        <h4 class="comp-title">${this.escapeHtml(c.title)}</h4>
        <p class="comp-notes-hint">${this.escapeHtml(c.notes)}</p>

        <div class="comp-meta-row">
          <div class="confidence-rating-box">
            <span class="meta-label">Confidence:</span>
            <select class="pookie-select-tiny comp-confidence-select" data-id="${c.id}">
              <option value="1" ${c.confidence == 1 ? 'selected' : ''}>1 - Low</option>
              <option value="2" ${c.confidence == 2 ? 'selected' : ''}>2 - Developing</option>
              <option value="3" ${c.confidence == 3 ? 'selected' : ''}>3 - Capable</option>
              <option value="4" ${c.confidence == 4 ? 'selected' : ''}>4 - Strong</option>
              <option value="5" ${c.confidence == 5 ? 'selected' : ''}>5 - Expert</option>
            </select>
          </div>

          <div class="practice-link-box">
            <input type="text" class="input-tiny comp-link-input" data-id="${c.id}" value="${this.escapeHtml(c.practiceLink || '')}" placeholder="Recording / Doc URL">
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.comp-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateCompetencyStatus(id, e.target.value);
      });
    });

    container.querySelectorAll('.comp-confidence-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateCompetencyConfidence(id, parseInt(e.target.value, 10));
      });
    });

    container.querySelectorAll('.comp-link-input').forEach(inp => {
      inp.addEventListener('blur', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateCompetencyLink(id, e.target.value.trim());
      });
    });
  }

  updateCompetencyStatus(id, newStatus) {
    const store = window.nandiniStore;
    const c = store.data.softSkills.competencies.find(x => x.id === id);
    if (c) {
      c.status = newStatus;
      c.lastPracticed = store.getTodayString();
      if (newStatus === 'Confident' && window.placementAudio) {
        window.placementAudio.playSuccess();
      }
      store.notify('COMPETENCY_UPDATED');
      this.renderStats();
    }
  }

  updateCompetencyConfidence(id, rating) {
    const store = window.nandiniStore;
    const c = store.data.softSkills.competencies.find(x => x.id === id);
    if (c) {
      c.confidence = rating;
      store.notify('COMPETENCY_UPDATED');
      this.renderStats();
    }
  }

  updateCompetencyLink(id, link) {
    const store = window.nandiniStore;
    const c = store.data.softSkills.competencies.find(x => x.id === id);
    if (c) {
      c.practiceLink = link;
      c.lastPracticed = store.getTodayString();
      store.notify('COMPETENCY_UPDATED');
    }
  }

  saveMockEvaluation() {
    const store = window.nandiniStore;
    const form = document.getElementById('mock-rubric-form');
    if (!form) return;

    const type = form['rubric-interview-type'].value;
    const clarity = parseInt(form['rubric-clarity'].value, 10) || 3;
    const structure = parseInt(form['rubric-structure'].value, 10) || 3;
    const relevance = parseInt(form['rubric-relevance'].value, 10) || 3;
    const confidence = parseInt(form['rubric-confidence'].value, 10) || 3;
    const notes = form['rubric-notes'].value.trim();

    const rubric = {
      id: 'rub_' + Date.now(),
      date: store.getTodayString(),
      type,
      scores: { clarity, structure, relevance, confidence },
      averageScore: ((clarity + structure + relevance + confidence) / 4).toFixed(1),
      notes
    };

    store.data.softSkills.mockRubrics = store.data.softSkills.mockRubrics || [];
    store.data.softSkills.mockRubrics.unshift(rubric);
    store.notify('RUBRIC_SAVED');

    if (window.placementAudio) window.placementAudio.playSuccess();
    form.reset();
    alert('Mock interview evaluation rubric logged successfully!');
    this.renderRubricsHistory();
  }

  renderRubricsHistory() {
    const listEl = document.getElementById('mock-rubrics-history');
    if (!listEl) return;

    const store = window.nandiniStore;
    const rubrics = (store.data.softSkills && store.data.softSkills.mockRubrics) || [];

    if (rubrics.length === 0) {
      listEl.innerHTML = `<div class="empty-state-notice">No mock evaluations logged yet. Complete a peer or self-mock interview and evaluate your performance!</div>`;
      return;
    }

    listEl.innerHTML = rubrics.map(r => `
      <div class="rubric-history-item">
        <div class="rubric-header">
          <strong>${this.escapeHtml(r.type)} Mock Assessment</strong>
          <span class="subtext">${r.date} • Average: <strong>${r.averageScore} / 5.0</strong></span>
        </div>
        <div class="rubric-scores-grid">
          <span>Clarity: ${r.scores.clarity}/5</span>
          <span>Structure (PREP/STAR): ${r.scores.structure}/5</span>
          <span>Relevance: ${r.scores.relevance}/5</span>
          <span>Confidence: ${r.scores.confidence}/5</span>
        </div>
        ${r.notes ? `<p class="rubric-notes">📝 ${this.escapeHtml(r.notes)}</p>` : ''}
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

window.nandiniSkills = new ProfessionalSkillsManager();

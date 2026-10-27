/**
 * Core Computer Science Subjects Tracker
 * Java & OOP, DBMS & SQL, Operating Systems, and Computer Networks.
 * 4-Stage lifecycle: Not Started -> Learning -> Practised -> Interview-Ready (with required self-assessment).
 */

class CoreSubjectsManager {
  constructor() {
    this.currentSubjectKey = 'java_oop';
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const tabButtons = document.querySelectorAll('.core-sub-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSubjectKey = btn.getAttribute('data-subject');
        this.render();
      });
    });

    const addTopicBtn = document.getElementById('core-btn-add-topic');
    if (addTopicBtn) {
      addTopicBtn.addEventListener('click', () => this.openAddTopicModal());
    }

    const form = document.getElementById('core-topic-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveCustomTopic();
      });
    }

    const modal = document.getElementById('core-modal');
    const closeBtn = document.getElementById('core-modal-close');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  render() {
    this.renderSummaryCards();
    this.renderTopicsList();
    this.renderRevisionQueue();
  }

  renderSummaryCards() {
    const store = window.nandiniStore;
    if (!store) return;
    const subjects = store.data.coreSubjects || {};

    const container = document.getElementById('core-subject-overview-cards');
    if (!container) return;

    const keys = ['java_oop', 'dbms_sql', 'os', 'cn'];

    container.innerHTML = keys.map(k => {
      const sub = subjects[k];
      if (!sub) return '';
      const total = (sub.topics || []).length;
      const ready = (sub.topics || []).filter(t => t.status === 'Interview-Ready').length;
      const practised = (sub.topics || []).filter(t => t.status === 'Practised').length;
      const pct = total > 0 ? Math.round(((ready + practised * 0.7) / total) * 100) : 0;
      const isSelected = k === this.currentSubjectKey ? 'card-selected' : '';

      return `
        <div class="core-summary-card ${isSelected}" data-key="${k}">
          <div class="core-card-header">
            <h4>${sub.name}</h4>
          </div>
          <div class="core-card-progress">
            <span>${ready} Ready • ${practised} Practised (${pct}%)</span>
            <div class="mini-bar-track">
              <div class="mini-bar-fill" style="width: ${pct}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.core-summary-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-key');
        this.currentSubjectKey = key;
        document.querySelectorAll('.core-sub-tab-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-subject') === key);
        });
        this.render();
      });
    });
  }

  renderTopicsList() {
    const listEl = document.getElementById('core-topics-container');
    const activeTitleEl = document.getElementById('core-active-subject-title');
    if (!listEl) return;

    const store = window.nandiniStore;
    if (!store) return;
    const sub = store.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;

    if (activeTitleEl) {
      activeTitleEl.textContent = `${sub.name} Topics`;
    }

    const topics = sub.topics || [];

    if (topics.length === 0) {
      listEl.innerHTML = `<div class="empty-state-notice">No topics in this subject yet. Click "+ Add Topic" to add one.</div>`;
      return;
    }

    listEl.innerHTML = topics.map(t => {
      const isReady = t.status === 'Interview-Ready';
      const conf = t.confidence || 3;

      return `
        <div class="core-topic-item ${isReady ? 'topic-interview-ready' : ''}" data-id="${t.id}">
          <div class="topic-main-row">
            <div class="topic-title-col">
              <strong class="topic-title-text">${this.escapeHtml(t.title)}</strong>
              ${t.resources ? `<span class="topic-res-hint">Resource: ${this.escapeHtml(t.resources)}</span>` : ''}
              ${t.selfAssessment ? `<span class="topic-assessment-badge">Assessment: ${this.escapeHtml(t.selfAssessment)}</span>` : ''}
            </div>

            <div class="topic-controls">
              <!-- 4-Stage Status Dropdown -->
              <div style="display: flex; flex-direction: column;">
                <span class="meta-label">Status:</span>
                <select class="status-select-sm core-stage-select" data-id="${t.id}">
                  <option value="Not Started" ${t.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                  <option value="Learning" ${t.status === 'Learning' ? 'selected' : ''}>Learning</option>
                  <option value="Practised" ${t.status === 'Practised' ? 'selected' : ''}>Practised</option>
                  <option value="Interview-Ready" ${t.status === 'Interview-Ready' ? 'selected' : ''}>Interview-Ready ⭐</option>
                </select>
              </div>

              <!-- Confidence Level -->
              <div style="display: flex; flex-direction: column;">
                <span class="meta-label">Confidence:</span>
                <select class="pookie-select-tiny core-conf-select" data-id="${t.id}">
                  <option value="1" ${conf == 1 ? 'selected' : ''}>1 - Low</option>
                  <option value="2" ${conf == 2 ? 'selected' : ''}>2 - Developing</option>
                  <option value="3" ${conf == 3 ? 'selected' : ''}>3 - Moderate</option>
                  <option value="4" ${conf == 4 ? 'selected' : ''}>4 - High</option>
                  <option value="5" ${conf == 5 ? 'selected' : ''}>5 - Mastered</option>
                </select>
              </div>

              <!-- Last Revised Date -->
              <div style="display: flex; flex-direction: column;">
                <span class="meta-label">Last Revised:</span>
                <input type="date" class="input-tiny core-rev-date-input" data-id="${t.id}" value="${t.lastRevised || ''}">
              </div>

              <!-- Next Revision Date -->
              <div style="display: flex; flex-direction: column;">
                <span class="meta-label">Next Revision:</span>
                <input type="date" class="input-tiny core-next-rev-input" data-id="${t.id}" value="${t.nextRevised || ''}">
              </div>

              <button class="btn-sm btn-ghost btn-assess-topic" data-id="${t.id}" title="Record mock test or self-assessment">Self-Assess</button>
              <button class="btn-sm btn-ghost btn-toggle-notes" data-id="${t.id}">Notes</button>
              <button class="btn-sm btn-ghost btn-del-topic" data-id="${t.id}">Delete</button>
            </div>
          </div>

          <div class="topic-notes-expand" id="notes-expand-${t.id}" style="${t.notes ? 'display:block;' : 'display:none;'}">
            <textarea class="core-topic-notes-area" data-id="${t.id}" placeholder="Interview questions, formulas, or tricky edge cases...">${this.escapeHtml(t.notes || '')}</textarea>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.core-stage-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateStage(id, e.target.value);
      });
    });

    listEl.querySelectorAll('.core-conf-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateConfidence(id, parseInt(e.target.value, 10));
      });
    });

    listEl.querySelectorAll('.core-rev-date-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateLastRevised(id, e.target.value);
      });
    });

    listEl.querySelectorAll('.core-next-rev-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateNextRevised(id, e.target.value);
      });
    });

    listEl.querySelectorAll('.btn-assess-topic').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.promptSelfAssessment(id);
      });
    });

    listEl.querySelectorAll('.btn-toggle-notes').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const box = document.getElementById(`notes-expand-${id}`);
        if (box) {
          box.style.display = box.style.display === 'none' ? 'block' : 'none';
        }
      });
    });

    listEl.querySelectorAll('.core-topic-notes-area').forEach(txt => {
      txt.addEventListener('blur', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateNotes(id, e.target.value);
      });
    });

    listEl.querySelectorAll('.btn-del-topic').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteTopic(id);
      });
    });
  }

  updateStage(id, newStatus) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    const topic = (sub.topics || []).find(t => t.id === id);
    if (!topic) return;

    if (newStatus === 'Interview-Ready' && !topic.selfAssessment) {
      const assessmentNotes = prompt(
        `To label "${topic.title}" as Interview-Ready, please record your self-assessment result (e.g. "Answered 5/5 verbal quiz questions without hesitation"):`
      );
      if (!assessmentNotes || !assessmentNotes.trim()) {
        alert('Topic remains in current status. Self-assessment verification is required for Interview-Ready status.');
        this.renderTopicsList();
        return;
      }
      topic.selfAssessment = assessmentNotes.trim();
    }

    topic.status = newStatus;
    if (newStatus === 'Interview-Ready' || newStatus === 'Practised') {
      topic.lastRevised = window.nandiniStore.getTodayString();
      if (window.placementAudio) window.placementAudio.playSuccess();
    }
    window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
    this.render();
  }

  promptSelfAssessment(id) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    const topic = (sub.topics || []).find(t => t.id === id);
    if (!topic) return;

    const res = prompt(`Record mock test / quiz result for "${topic.title}":`, topic.selfAssessment || '');
    if (res !== null) {
      topic.selfAssessment = res.trim();
      window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
      this.render();
    }
  }

  updateConfidence(id, rating) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    const topic = (sub.topics || []).find(t => t.id === id);
    if (!topic) return;
    topic.confidence = rating;
    window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
    this.renderRevisionQueue();
  }

  updateLastRevised(id, val) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    const topic = (sub.topics || []).find(t => t.id === id);
    if (!topic) return;
    topic.lastRevised = val;
    window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
  }

  updateNextRevised(id, val) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    const topic = (sub.topics || []).find(t => t.id === id);
    if (!topic) return;
    topic.nextRevised = val;
    window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
  }

  updateNotes(id, text) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    const topic = (sub.topics || []).find(t => t.id === id);
    if (!topic) return;
    topic.notes = text.trim();
    window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
  }

  renderRevisionQueue() {
    const queueEl = document.getElementById('core-revision-queue-list');
    if (!queueEl) return;

    const store = window.nandiniStore;
    if (!store) return;

    const needRevision = [];
    Object.keys(store.data.coreSubjects || {}).forEach(k => {
      const sub = store.data.coreSubjects[k];
      (sub.topics || []).forEach(t => {
        if (t.confidence <= 2 || t.status === 'Learning') {
          needRevision.push({ ...t, subjectName: sub.name });
        }
      });
    });

    if (needRevision.length === 0) {
      queueEl.innerHTML = `<div class="empty-state-notice">All core subjects topics have moderate or high confidence.</div>`;
      return;
    }

    queueEl.innerHTML = needRevision.slice(0, 8).map(item => `
      <div class="rev-queue-pill">
        <span class="subtext">${this.escapeHtml(item.subjectName)}</span>
        <strong>${this.escapeHtml(item.title)}</strong>
        <span class="badge-priority prio-high">Confidence: ${item.confidence}/5</span>
      </div>
    `).join('');
  }

  openAddTopicModal() {
    const modal = document.getElementById('core-modal');
    const form = document.getElementById('core-topic-form');
    if (!modal || !form) return;
    form.reset();
    form['core-subject-picker'].value = this.currentSubjectKey;
    modal.style.display = 'flex';
  }

  saveCustomTopic() {
    const form = document.getElementById('core-topic-form');
    const modal = document.getElementById('core-modal');
    if (!form || !modal) return;

    const title = form['core-topic-title'].value.trim();
    const subjectKey = form['core-subject-picker'].value;
    const confidence = parseInt(form['core-topic-confidence'].value, 10) || 3;
    const notes = form['core-topic-notes'].value.trim();

    if (!title) {
      alert('Please enter a topic title.');
      return;
    }

    const sub = window.nandiniStore.data.coreSubjects[subjectKey];
    if (sub) {
      sub.topics.push({
        id: 'top_' + Date.now(),
        title,
        status: 'Not Started',
        confidence,
        resources: '',
        selfAssessment: '',
        lastRevised: '',
        nextRevised: '',
        notes
      });
      window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
    }

    modal.style.display = 'none';
    this.currentSubjectKey = subjectKey;
    this.render();
  }

  deleteTopic(id) {
    const sub = window.nandiniStore.data.coreSubjects[this.currentSubjectKey];
    if (!sub) return;
    if (confirm('Delete this topic record?')) {
      sub.topics = sub.topics.filter(t => t.id !== id);
      window.nandiniStore.notify('CORE_SUBJECTS_UPDATED');
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

window.nandiniCoreSubjects = new CoreSubjectsManager();

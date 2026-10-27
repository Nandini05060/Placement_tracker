/**
 * Professional DSA Practice Tracker
 * Unique solved metrics, separate topic coverage, complexity tracking, and revision queue.
 */

class DsaTrackerManager {
  constructor() {
    this.filterTopic = 'All';
    this.filterDifficulty = 'All';
    this.filterStatus = 'All';
    this.searchQuery = '';
    this.onlyRevision = false;
    this.editingProblemId = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const searchInput = document.getElementById('dsa-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    const topicFilter = document.getElementById('dsa-filter-topic');
    if (topicFilter) {
      topicFilter.addEventListener('change', (e) => {
        this.filterTopic = e.target.value;
        this.renderTable();
      });
    }

    const diffFilter = document.getElementById('dsa-filter-difficulty');
    if (diffFilter) {
      diffFilter.addEventListener('change', (e) => {
        this.filterDifficulty = e.target.value;
        this.renderTable();
      });
    }

    const statusFilter = document.getElementById('dsa-filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.renderTable();
      });
    }

    const revisionTabBtn = document.getElementById('dsa-tab-revision');
    const allTabBtn = document.getElementById('dsa-tab-all');
    if (revisionTabBtn && allTabBtn) {
      revisionTabBtn.addEventListener('click', () => {
        this.onlyRevision = true;
        revisionTabBtn.classList.add('active');
        allTabBtn.classList.remove('active');
        this.renderTable();
      });
      allTabBtn.addEventListener('click', () => {
        this.onlyRevision = false;
        allTabBtn.classList.add('active');
        revisionTabBtn.classList.remove('active');
        this.renderTable();
      });
    }

    const addBtn = document.getElementById('dsa-btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openProblemModal());
    }

    const form = document.getElementById('dsa-problem-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProblemFromModal();
      });
    }

    const closeBtn = document.getElementById('dsa-modal-close');
    const modal = document.getElementById('dsa-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    const editTargetBtn = document.getElementById('dsa-btn-edit-target');
    if (editTargetBtn) {
      editTargetBtn.addEventListener('click', () => {
        const current = window.nandiniStore.data.settings.dsaTarget || 80;
        const newTarget = prompt('Enter your target number of unique DSA problems:', current);
        if (newTarget && !isNaN(newTarget) && parseInt(newTarget, 10) > 0) {
          window.nandiniStore.data.settings.dsaTarget = parseInt(newTarget, 10);
          window.nandiniStore.notify('SETTINGS_UPDATED');
          this.render();
        }
      });
    }
  }

  getFilteredProblems() {
    const list = window.nandiniStore ? window.nandiniStore.data.dsaProblems : [];
    return list.filter(p => {
      if (this.onlyRevision && !p.needsRevision) return false;
      if (this.filterTopic !== 'All' && p.topic !== this.filterTopic) return false;
      if (this.filterDifficulty !== 'All' && p.difficulty !== this.filterDifficulty) return false;
      if (this.filterStatus !== 'All' && p.status !== this.filterStatus) return false;
      if (this.searchQuery) {
        const titleMatch = (p.title || '').toLowerCase().includes(this.searchQuery);
        const notesMatch = (p.notes || '').toLowerCase().includes(this.searchQuery);
        const approachMatch = (p.approach || '').toLowerCase().includes(this.searchQuery);
        const topicMatch = (p.topic || '').toLowerCase().includes(this.searchQuery);
        if (!titleMatch && !notesMatch && !approachMatch && !topicMatch) return false;
      }
      return true;
    });
  }

  render() {
    this.renderStats();
    this.renderTable();
    this.renderTopicBars();
  }

  renderStats() {
    const store = window.nandiniStore;
    if (!store) return;
    const problems = store.data.dsaProblems || [];
    const uniqueSolved = problems.filter(p => p.status === 'Solved').length;
    const target = store.data.settings.dsaTarget || 80;
    const pct = Math.min(100, Math.round((uniqueSolved / target) * 100));
    const revisionCount = problems.filter(p => p.needsRevision).length;

    // Calculate unique topic coverage (how many distinct topics have at least 1 solved question)
    const solvedTopics = new Set();
    problems.filter(p => p.status === 'Solved').forEach(p => solvedTopics.add(p.topic));

    const countEl = document.getElementById('dsa-stats-solved-count');
    const targetEl = document.getElementById('dsa-stats-target-count');
    const barEl = document.getElementById('dsa-stats-progress-fill');
    const pctEl = document.getElementById('dsa-stats-percentage');
    const revBadge = document.getElementById('dsa-revision-badge-count');
    const topicCoverageEl = document.getElementById('dsa-stats-topic-coverage');

    if (countEl) countEl.textContent = uniqueSolved;
    if (targetEl) targetEl.textContent = target;
    if (barEl) barEl.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}% Target Achieved`;
    if (revBadge) revBadge.textContent = revisionCount;
    if (topicCoverageEl) topicCoverageEl.textContent = `${solvedTopics.size} of 12 Core Topics Covered`;
  }

  renderTable() {
    const tbody = document.getElementById('dsa-table-body');
    const emptyState = document.getElementById('dsa-empty-state');
    if (!tbody) return;

    const items = this.getFilteredProblems();

    if (items.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = items.map(p => {
      const diffClass = `diff-${p.difficulty.toLowerCase()}`;
      const revActive = p.needsRevision ? 'active' : '';

      return `
        <tr class="dsa-row ${p.needsRevision ? 'row-revision-flagged' : ''}">
          <td>
            <select class="status-select-sm dsa-status-select" data-id="${p.id}">
              <option value="Not Started" ${p.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
              <option value="Attempted" ${p.status === 'Attempted' ? 'selected' : ''}>Attempted</option>
              <option value="Solved" ${p.status === 'Solved' ? 'selected' : ''}>Solved ✓</option>
              <option value="Needs Revision" ${p.status === 'Needs Revision' ? 'selected' : ''}>Needs Revision</option>
            </select>
          </td>
          <td>
            <div class="problem-title-box">
              <a href="${p.url || '#'}" target="_blank" rel="noopener" class="problem-link">
                <strong>${this.escapeHtml(p.title)}</strong>
                ${p.url ? '<span class="ext-icon">↗</span>' : ''}
              </a>
              ${p.approach ? `<span class="problem-approach-tag">Approach: ${this.escapeHtml(p.approach)}</span>` : ''}
              ${p.timeComplexity ? `<span class="subtext">Time: ${this.escapeHtml(p.timeComplexity)} | Space: ${this.escapeHtml(p.spaceComplexity || 'O(1)')}</span>` : ''}
            </div>
          </td>
          <td><span class="dsa-topic-tag">${this.escapeHtml(p.topic)}</span></td>
          <td><span class="dsa-diff-tag ${diffClass}">${p.difficulty}</span></td>
          <td><span class="dsa-platform-tag">${this.escapeHtml(p.platform || 'LeetCode')}</span></td>
          <td>
            <div class="dsa-attempts-col">
              <span>${p.attempts || 0}</span>
              <button class="btn-tiny-icon btn-inc-attempt" data-id="${p.id}" title="Record additional practice attempt">+1</button>
            </div>
          </td>
          <td>
            <button class="btn-star-revision ${revActive}" data-id="${p.id}" title="Toggle revision flag">
              ${p.needsRevision ? '★ Flagged' : '☆ Revise'}
            </button>
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="btn-sm btn-ghost btn-edit-problem" data-id="${p.id}">Edit</button>
              <button class="btn-sm btn-ghost btn-del-problem" data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.dsa-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateStatus(id, e.target.value);
      });
    });

    tbody.querySelectorAll('.btn-star-revision').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.toggleRevision(id);
      });
    });

    tbody.querySelectorAll('.btn-inc-attempt').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.incrementAttempt(id);
      });
    });

    tbody.querySelectorAll('.btn-edit-problem').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openProblemModal(id);
      });
    });

    tbody.querySelectorAll('.btn-del-problem').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteProblem(id);
      });
    });
  }

  renderTopicBars() {
    const container = document.getElementById('dsa-topic-summary-grid');
    if (!container) return;

    const store = window.nandiniStore;
    if (!store) return;
    const problems = store.data.dsaProblems || [];

    const topics = [
      'Arrays', 'Strings', 'Hashing', 'Searching', 'Sorting',
      'Two Pointers', 'Sliding Window', 'Recursion', 'Linked Lists',
      'Stacks', 'Queues', 'Mixed Practice'
    ];

    container.innerHTML = topics.map(t => {
      const topicProblems = problems.filter(p => p.topic === t);
      const solvedCount = topicProblems.filter(p => p.status === 'Solved').length;
      const totalCount = topicProblems.length;
      const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

      return `
        <div class="topic-progress-card">
          <div class="topic-header">
            <span class="topic-name">${t}</span>
            <span class="topic-count">${solvedCount} / ${totalCount} solved</span>
          </div>
          <div class="mini-bar-track">
            <div class="mini-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  openProblemModal(id = null) {
    this.editingProblemId = id;
    const modal = document.getElementById('dsa-modal');
    const titleEl = document.getElementById('dsa-modal-title');
    const form = document.getElementById('dsa-problem-form');
    if (!modal || !form) return;

    if (id) {
      const problem = window.nandiniStore.data.dsaProblems.find(p => p.id === id);
      if (!problem) return;
      titleEl.textContent = 'Edit Coding Problem';
      form['problem-title'].value = problem.title || '';
      form['problem-topic'].value = problem.topic || 'Arrays';
      form['problem-difficulty'].value = problem.difficulty || 'Easy';
      form['problem-platform'].value = problem.platform || 'LeetCode';
      form['problem-url'].value = problem.url || '';
      form['problem-status'].value = problem.status || 'Not Started';
      form['problem-attempts'].value = problem.attempts || 0;
      form['problem-time-taken'].value = problem.timeTakenMinutes || 15;
      form['problem-time-complexity'].value = problem.timeComplexity || 'O(N)';
      form['problem-space-complexity'].value = problem.spaceComplexity || 'O(1)';
      form['problem-approach'].value = problem.approach || '';
      form['problem-notes'].value = problem.notes || '';
      form['problem-revision'].checked = !!problem.needsRevision;
    } else {
      titleEl.textContent = 'Add Coding Problem';
      form.reset();
      form['problem-attempts'].value = 0;
      form['problem-status'].value = 'Not Started';
      form['problem-time-taken'].value = 20;
      form['problem-time-complexity'].value = 'O(N)';
      form['problem-space-complexity'].value = 'O(1)';
    }

    modal.style.display = 'flex';
  }

  saveProblemFromModal() {
    const form = document.getElementById('dsa-problem-form');
    const modal = document.getElementById('dsa-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const title = form['problem-title'].value.trim();
    if (!title) {
      alert('Please enter a problem title.');
      return;
    }

    const payload = {
      title,
      topic: form['problem-topic'].value,
      difficulty: form['problem-difficulty'].value,
      platform: form['problem-platform'].value,
      url: form['problem-url'].value.trim(),
      status: form['problem-status'].value,
      attempts: parseInt(form['problem-attempts'].value, 10) || 0,
      timeTakenMinutes: parseInt(form['problem-time-taken'].value, 10) || 0,
      timeComplexity: form['problem-time-complexity'].value.trim(),
      spaceComplexity: form['problem-space-complexity'].value.trim(),
      approach: form['problem-approach'].value.trim(),
      notes: form['problem-notes'].value.trim(),
      needsRevision: form['problem-revision'].checked
    };

    if (this.editingProblemId) {
      const p = store.data.dsaProblems.find(item => item.id === this.editingProblemId);
      if (p) {
        const wasNotSolved = p.status !== 'Solved';
        Object.assign(p, payload);
        if (wasNotSolved && p.status === 'Solved') {
          p.dateSolved = store.getTodayString();
          if (window.placementAudio) window.placementAudio.playSuccess();
        }
      }
    } else {
      const newProblem = {
        id: 'dsa_' + Date.now(),
        ...payload,
        dateSolved: payload.status === 'Solved' ? store.getTodayString() : null,
        createdAt: new Date().toISOString()
      };
      store.data.dsaProblems.unshift(newProblem);
      if (newProblem.status === 'Solved' && window.placementAudio) {
        window.placementAudio.playSuccess();
      }
    }

    store.notify('DSA_UPDATED');
    modal.style.display = 'none';
    this.render();
  }

  updateStatus(id, newStatus) {
    const store = window.nandiniStore;
    const p = store.data.dsaProblems.find(item => item.id === id);
    if (!p) return;
    const wasNotSolved = p.status !== 'Solved';
    p.status = newStatus;
    if (newStatus === 'Solved') {
      p.dateSolved = store.getTodayString();
      if (wasNotSolved && window.placementAudio) {
        window.placementAudio.playSuccess();
      }
    }
    if (newStatus === 'Needs Revision') {
      p.needsRevision = true;
    }
    store.notify('DSA_UPDATED');
    this.render();
  }

  toggleRevision(id) {
    const store = window.nandiniStore;
    const p = store.data.dsaProblems.find(item => item.id === id);
    if (!p) return;
    p.needsRevision = !p.needsRevision;
    if (window.placementAudio) window.placementAudio.playClick();
    store.notify('DSA_UPDATED');
    this.render();
  }

  incrementAttempt(id) {
    const store = window.nandiniStore;
    const p = store.data.dsaProblems.find(item => item.id === id);
    if (!p) return;
    p.attempts = (p.attempts || 0) + 1;
    if (window.placementAudio) window.placementAudio.playClick();
    store.notify('DSA_UPDATED');
    this.renderTable();
  }

  deleteProblem(id) {
    const store = window.nandiniStore;
    const p = store.data.dsaProblems.find(item => item.id === id);
    if (!p) return;
    if (confirm(`Delete "${p.title}" from your DSA tracker?`)) {
      store.data.dsaProblems = store.data.dsaProblems.filter(item => item.id !== id);
      store.notify('DSA_UPDATED');
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

window.nandiniDsa = new DsaTrackerManager();

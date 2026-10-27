/**
 * Project Portfolio Manager
 * Supports multiple engineering projects, 12 structured milestones, technical challenges,
 * and comprehensive interview preparation checklists.
 */

class ProjectsPortfolioManager {
  constructor() {
    this.currentProjectIndex = 0;
    this.editingMilestoneId = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  getCurrentProject() {
    const store = window.nandiniStore;
    if (!store || !store.data.projects || store.data.projects.length === 0) return null;
    return store.data.projects[this.currentProjectIndex] || store.data.projects[0];
  }

  bindEvents() {
    // Project selection dropdown or switch
    const projSelect = document.getElementById('proj-selector-dropdown');
    if (projSelect) {
      projSelect.addEventListener('change', (e) => {
        this.currentProjectIndex = parseInt(e.target.value, 10) || 0;
        this.render();
      });
    }

    const addProjBtn = document.getElementById('proj-btn-add-new-project');
    if (addProjBtn) {
      addProjBtn.addEventListener('click', () => this.openNewProjectPrompt());
    }

    const addMileBtn = document.getElementById('proj-btn-add-milestone');
    if (addMileBtn) {
      addMileBtn.addEventListener('click', () => this.openMilestoneModal());
    }

    const form = document.getElementById('proj-milestone-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveMilestoneFromModal();
      });
    }

    const modal = document.getElementById('proj-milestone-modal');
    const closeBtn = document.getElementById('proj-modal-close');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    const chalForm = document.getElementById('proj-challenge-form');
    if (chalForm) {
      chalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addChallenge();
      });
    }

    const editInfoBtn = document.getElementById('proj-btn-edit-info');
    if (editInfoBtn) {
      editInfoBtn.addEventListener('click', () => this.editProjectMeta());
    }
  }

  render() {
    const project = this.getCurrentProject();
    if (!project) return;

    this.renderProjectSelector();
    this.renderProjectHeader(project);
    this.renderMilestones(project);
    this.renderInterviewChecklist(project);
    this.renderChallenges(project);
  }

  renderProjectSelector() {
    const select = document.getElementById('proj-selector-dropdown');
    if (!select) return;

    const store = window.nandiniStore;
    const projects = store.data.projects || [];

    select.innerHTML = projects.map((p, idx) => `
      <option value="${idx}" ${idx === this.currentProjectIndex ? 'selected' : ''}>
        ${this.escapeHtml(p.title)}
      </option>
    `).join('');
  }

  renderProjectHeader(project) {
    const titleEl = document.getElementById('proj-title');
    const descEl = document.getElementById('proj-desc');
    const problemEl = document.getElementById('proj-problem-solved');
    const techEl = document.getElementById('proj-tech-stack');
    const repoEl = document.getElementById('proj-repo-link');
    const liveEl = document.getElementById('proj-live-link');
    const progressFill = document.getElementById('proj-progress-fill');
    const progressText = document.getElementById('proj-progress-text');

    if (titleEl) titleEl.textContent = project.title;
    if (descEl) descEl.textContent = project.description;
    if (problemEl) problemEl.textContent = project.problemSolved || 'Centralize and verify lost items with security authentication.';

    if (techEl) {
      techEl.innerHTML = (project.techStack || []).map(t => `<span class="tech-tag">${this.escapeHtml(t)}</span>`).join('');
    }

    if (repoEl) {
      repoEl.href = project.repoUrl || '#';
      repoEl.textContent = project.repoUrl ? 'GitHub Repository ↗' : 'Add Repo Link';
    }

    if (liveEl) {
      liveEl.href = project.liveUrl || '#';
      liveEl.style.display = project.liveUrl ? 'inline-flex' : 'none';
    }

    const milestones = project.milestones || [];
    const total = milestones.length;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `${completed} of ${total} milestones completed (${pct}%)`;
  }

  renderMilestones(project) {
    const container = document.getElementById('proj-milestones-container');
    if (!container) return;

    const milestones = project.milestones || [];
    if (milestones.length === 0) {
      container.innerHTML = `<div class="empty-state-notice">No milestones defined for this project.</div>`;
      return;
    }

    container.innerHTML = milestones.map((m, idx) => {
      const isDone = m.status === 'Completed';
      const prioClass = `prio-${m.priority.toLowerCase()}`;

      return `
        <div class="milestone-card ${isDone ? 'milestone-done' : ''}" data-id="${m.id}">
          <div class="milestone-header-row">
            <div class="milestone-title-col">
              <span class="milestone-num">#${idx + 1}</span>
              <strong class="milestone-title ${isDone ? 'strike' : ''}">${this.escapeHtml(m.title)}</strong>
            </div>

            <div class="milestone-badges">
              <span class="badge-priority ${prioClass}">${m.priority}</span>
              <select class="status-select-sm milestone-status-select" data-id="${m.id}">
                <option value="Not Started" ${m.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                <option value="In Progress" ${m.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${m.status === 'Completed' ? 'selected' : ''}>Completed ✓</option>
              </select>
            </div>
          </div>

          <div class="milestone-details-row">
            <span class="subtext">Target Deadline: <strong>${m.deadline || 'Not set'}</strong></span>
            ${m.notes ? `<p class="milestone-notes">📝 ${this.escapeHtml(m.notes)}</p>` : ''}
          </div>

          <div class="milestone-actions-row">
            <button class="btn-sm btn-ghost btn-edit-mile" data-id="${m.id}">Edit</button>
            <button class="btn-sm btn-ghost btn-del-mile" data-id="${m.id}">Delete</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.milestone-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateMilestoneStatus(id, e.target.value);
      });
    });

    container.querySelectorAll('.btn-edit-mile').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openMilestoneModal(id);
      });
    });

    container.querySelectorAll('.btn-del-mile').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteMilestone(id);
      });
    });
  }

  renderInterviewChecklist(project) {
    const listEl = document.getElementById('proj-interview-checklist');
    if (!listEl) return;

    const checklist = project.interviewChecklist || [];
    listEl.innerHTML = checklist.map((item, idx) => `
      <label class="pookie-checkbox-label">
        <input type="checkbox" class="proj-ic-chk" data-idx="${idx}" ${item.checked ? 'checked' : ''}>
        <span class="checkmark"></span>
        <span class="${item.checked ? 'strike' : ''}">${this.escapeHtml(item.text)}</span>
      </label>
    `).join('');

    listEl.querySelectorAll('.proj-ic-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        project.interviewChecklist[idx].checked = e.target.checked;
        if (e.target.checked && window.placementAudio) window.placementAudio.playClick();
        window.nandiniStore.notify('PROJECT_UPDATED');
      });
    });
  }

  renderChallenges(project) {
    const listEl = document.getElementById('proj-challenges-list');
    if (!listEl) return;

    const challenges = project.challenges || [];
    if (challenges.length === 0) {
      listEl.innerHTML = `<div class="empty-state-notice">No engineering hurdles logged yet. Documenting hurdles ensures compelling answers to interview questions.</div>`;
      return;
    }

    listEl.innerHTML = challenges.map(c => `
      <div class="challenge-item-card">
        <div class="challenge-q">
          <span class="challenge-icon">⚠️</span>
          <div>
            <strong>Technical Hurdle:</strong>
            <p>${this.escapeHtml(c.challenge)}</p>
          </div>
        </div>
        <div class="challenge-a">
          <span class="challenge-icon">💡</span>
          <div>
            <strong>Engineering Solution (Interview Talking Point):</strong>
            <p>${this.escapeHtml(c.solution)}</p>
          </div>
        </div>
        <div class="challenge-footer">
          <span class="subtext">Documented: ${c.date || ''}</span>
          <button class="btn-sm btn-ghost btn-del-chal" data-id="${c.id}">Delete</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.btn-del-chal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteChallenge(id);
      });
    });
  }

  updateMilestoneStatus(id, newStatus) {
    const project = this.getCurrentProject();
    if (!project) return;
    const m = (project.milestones || []).find(item => item.id === id);
    if (!m) return;

    const wasNotDone = m.status !== 'Completed';
    m.status = newStatus;

    if (wasNotDone && newStatus === 'Completed') {
      if (window.placementAudio) window.placementAudio.playSuccess();
    }

    window.nandiniStore.notify('PROJECT_UPDATED');
    this.render();
  }

  openMilestoneModal(id = null) {
    this.editingMilestoneId = id;
    const modal = document.getElementById('proj-milestone-modal');
    const form = document.getElementById('proj-milestone-form');
    const titleEl = document.getElementById('proj-modal-title');
    if (!modal || !form) return;

    const project = this.getCurrentProject();
    if (!project) return;

    if (id) {
      const m = (project.milestones || []).find(item => item.id === id);
      if (!m) return;
      titleEl.textContent = 'Edit Project Milestone';
      form['mile-title'].value = m.title || '';
      form['mile-priority'].value = m.priority || 'High';
      form['mile-status'].value = m.status || 'Not Started';
      form['mile-deadline'].value = m.deadline || '';
      form['mile-notes'].value = m.notes || '';
    } else {
      titleEl.textContent = 'Add Milestone';
      form.reset();
      form['mile-priority'].value = 'High';
      form['mile-status'].value = 'Not Started';
    }

    modal.style.display = 'flex';
  }

  saveMilestoneFromModal() {
    const form = document.getElementById('proj-milestone-form');
    const modal = document.getElementById('proj-milestone-modal');
    const project = this.getCurrentProject();
    if (!form || !modal || !project) return;

    const title = form['mile-title'].value.trim();
    if (!title) {
      alert('Please enter a milestone title.');
      return;
    }

    const payload = {
      title,
      priority: form['mile-priority'].value,
      status: form['mile-status'].value,
      deadline: form['mile-deadline'].value,
      notes: form['mile-notes'].value.trim()
    };

    if (this.editingMilestoneId) {
      const m = (project.milestones || []).find(item => item.id === this.editingMilestoneId);
      if (m) {
        Object.assign(m, payload);
      }
    } else {
      project.milestones.push({
        id: 'mile_' + Date.now(),
        ...payload
      });
    }

    window.nandiniStore.notify('PROJECT_UPDATED');
    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
    this.render();
  }

  deleteMilestone(id) {
    const project = this.getCurrentProject();
    if (!project) return;
    if (confirm('Delete this milestone?')) {
      project.milestones = project.milestones.filter(m => m.id !== id);
      window.nandiniStore.notify('PROJECT_UPDATED');
      this.render();
    }
  }

  addChallenge() {
    const challengeInput = document.getElementById('proj-input-challenge');
    const solutionInput = document.getElementById('proj-input-solution');
    const project = this.getCurrentProject();
    if (!challengeInput || !solutionInput || !project) return;

    const challenge = challengeInput.value.trim();
    const solution = solutionInput.value.trim();

    if (!challenge || !solution) {
      alert('Please enter both the challenge encountered and how you resolved it.');
      return;
    }

    project.challenges = project.challenges || [];
    project.challenges.push({
      id: 'ch_' + Date.now(),
      challenge,
      solution,
      date: window.nandiniStore.getTodayString()
    });

    challengeInput.value = '';
    solutionInput.value = '';
    window.nandiniStore.notify('PROJECT_UPDATED');

    if (window.placementAudio) window.placementAudio.playSuccess();
    this.renderChallenges(project);
  }

  deleteChallenge(id) {
    const project = this.getCurrentProject();
    if (!project) return;
    if (confirm('Delete this technical challenge record?')) {
      project.challenges = project.challenges.filter(c => c.id !== id);
      window.nandiniStore.notify('PROJECT_UPDATED');
      this.renderChallenges(project);
    }
  }

  editProjectMeta() {
    const project = this.getCurrentProject();
    if (!project) return;
    const newRepo = prompt('Enter your GitHub repository URL:', project.repoUrl || '');
    if (newRepo !== null) {
      project.repoUrl = newRepo.trim();
      const newLive = prompt('Enter your Live Demo URL (optional):', project.liveUrl || '');
      if (newLive !== null) project.liveUrl = newLive.trim();
      window.nandiniStore.notify('PROJECT_UPDATED');
      this.render();
    }
  }

  openNewProjectPrompt() {
    const title = prompt('Enter the name of your new engineering project:');
    if (!title || !title.trim()) return;

    const desc = prompt('Enter a short description of the problem solved:');
    const newProj = {
      id: 'proj_' + Date.now(),
      title: title.trim(),
      description: desc ? desc.trim() : '',
      problemSolved: '',
      techStack: ['Java', 'MySQL', 'REST API'],
      repoUrl: '',
      liveUrl: '',
      startDate: window.nandiniStore.getTodayString(),
      targetCompletionDate: '',
      milestones: [
        { id: 'm1', title: 'System design and requirements definition', status: 'Not Started', deadline: '', priority: 'High', notes: '' },
        { id: 'm2', title: 'Core implementation and API development', status: 'Not Started', deadline: '', priority: 'High', notes: '' },
        { id: 'm3', title: 'Testing, documentation, and cloud deployment', status: 'Not Started', deadline: '', priority: 'High', notes: '' }
      ],
      challenges: [],
      interviewChecklist: [
        { id: 'ic_1', text: 'System Architecture & Data Flow diagram prepared', checked: false },
        { id: 'ic_2', text: 'Database Schema & Normalization verified', checked: false },
        { id: 'ic_3', text: 'API endpoints and security flow documented', checked: false }
      ]
    };

    window.nandiniStore.data.projects.push(newProj);
    this.currentProjectIndex = window.nandiniStore.data.projects.length - 1;
    window.nandiniStore.notify('PROJECT_UPDATED');
    this.render();
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

window.nandiniProjects = new ProjectsPortfolioManager();

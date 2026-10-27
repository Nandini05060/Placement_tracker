/**
 * Resume Versions & Job Applications Lifecycle Manager
 * Tracks tailored resumes, ATS compliance checklist, and actual submitted applications.
 */

class ResumeApplicationManager {
  constructor() {
    this.editingResumeId = null;
    this.editingAppId = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Add resume version
    const addResumeBtn = document.getElementById('res-btn-add');
    if (addResumeBtn) {
      addResumeBtn.addEventListener('click', () => this.openResumeModal());
    }

    const resForm = document.getElementById('res-modal-form');
    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveResumeFromModal();
      });
    }

    const resClose = document.getElementById('res-modal-close');
    const resModal = document.getElementById('res-modal');
    if (resClose && resModal) {
      resClose.addEventListener('click', () => resModal.style.display = 'none');
      resModal.addEventListener('click', (e) => {
        if (e.target === resModal) resModal.style.display = 'none';
      });
    }

    // Add job application
    const addAppBtn = document.getElementById('app-btn-add');
    if (addAppBtn) {
      addAppBtn.addEventListener('click', () => this.openAppModal());
    }

    const appForm = document.getElementById('app-modal-form');
    if (appForm) {
      appForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveAppFromModal();
      });
    }

    const appClose = document.getElementById('app-modal-close');
    const appModal = document.getElementById('app-modal');
    if (appClose && appModal) {
      appClose.addEventListener('click', () => appModal.style.display = 'none');
      appModal.addEventListener('click', (e) => {
        if (e.target === appModal) appModal.style.display = 'none';
      });
    }
  }

  render() {
    this.renderApplicationMetrics();
    this.renderResumeVersions();
    this.renderResumeChecklist();
    this.renderApplicationsTable();
  }

  renderApplicationMetrics() {
    const store = window.nandiniStore;
    if (!store) return;
    const apps = store.data.jobApplications || [];

    const total = apps.length;
    const assessments = apps.filter(a => a.status === 'Assessment Scheduled').length;
    const interviews = apps.filter(a => a.status === 'Interview Scheduled').length;
    const offers = apps.filter(a => a.status === 'Offer').length;

    const elTotal = document.getElementById('app-stat-total');
    const elAssessments = document.getElementById('app-stat-assessments');
    const elInterviews = document.getElementById('app-stat-interviews');
    const elOffers = document.getElementById('app-stat-offers');

    if (elTotal) elTotal.textContent = total;
    if (elAssessments) elAssessments.textContent = assessments;
    if (elInterviews) elInterviews.textContent = interviews;
    if (elOffers) elOffers.textContent = offers;
  }

  renderResumeVersions() {
    const container = document.getElementById('resume-versions-list');
    if (!container) return;

    const store = window.nandiniStore;
    const resumes = store.data.resumes || [];

    if (resumes.length === 0) {
      container.innerHTML = `<div class="empty-state-notice">No tailored resume versions logged yet.</div>`;
      return;
    }

    container.innerHTML = resumes.map(r => `
      <div class="resume-version-card">
        <div class="res-card-header">
          <div>
            <strong>${this.escapeHtml(r.name)}</strong>
            <span class="subtext">Target: ${this.escapeHtml(r.targetRole)} • Updated: ${r.lastUpdated}</span>
          </div>
          <button class="btn-sm btn-ghost btn-del-resume" data-id="${r.id}">Delete</button>
        </div>
        <div class="res-details-grid">
          <div><span class="meta-label">Skills:</span> <span class="res-val">${this.escapeHtml(r.skills)}</span></div>
          <div><span class="meta-label">Featured Projects:</span> <span class="res-val">${this.escapeHtml(r.projects)}</span></div>
          <div><span class="meta-label">Certifications:</span> <span class="res-val">${this.escapeHtml(r.certifications)}</span></div>
        </div>
        ${r.notes ? `<p class="res-notes-text">📝 ${this.escapeHtml(r.notes)}</p>` : ''}
      </div>
    `).join('');

    container.querySelectorAll('.btn-del-resume').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteResume(id);
      });
    });
  }

  renderResumeChecklist() {
    const listEl = document.getElementById('resume-checklist-container');
    if (!listEl) return;

    const store = window.nandiniStore;
    const items = store.data.resumeChecklist || [];

    listEl.innerHTML = items.map((item, idx) => `
      <label class="pookie-checkbox-label">
        <input type="checkbox" class="resume-chk-input" data-idx="${idx}" ${item.checked ? 'checked' : ''}>
        <span class="checkmark"></span>
        <span class="${item.checked ? 'strike' : ''}">${this.escapeHtml(item.text)}</span>
      </label>
    `).join('');

    listEl.querySelectorAll('.resume-chk-input').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        store.data.resumeChecklist[idx].checked = e.target.checked;
        if (e.target.checked && window.placementAudio) window.placementAudio.playClick();
        store.notify('RESUME_CHECKLIST_UPDATED');
        this.renderResumeChecklist();
      });
    });
  }

  renderApplicationsTable() {
    const tbody = document.getElementById('applications-table-body');
    const empty = document.getElementById('applications-empty-state');
    if (!tbody) return;

    const store = window.nandiniStore;
    const apps = store.data.jobApplications || [];

    if (apps.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }

    if (empty) empty.style.display = 'none';

    tbody.innerHTML = apps.map(a => `
      <tr>
        <td><strong>${this.escapeHtml(a.company)}</strong></td>
        <td>${this.escapeHtml(a.role)}</td>
        <td>${a.dateApplied || 'N/A'}</td>
        <td><span class="badge-skill-tag">${this.escapeHtml(a.resumeVersion || 'Default')}</span></td>
        <td><span class="status-pill status-${a.status.toLowerCase().replace(/\s+/g, '-')}">${a.status}</span></td>
        <td>${this.escapeHtml(a.nextStep || 'None')}</td>
        <td>${a.followUpDate || 'None'}</td>
        <td>
          <button class="btn-sm btn-ghost btn-del-app" data-id="${a.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-del-app').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteApplication(id);
      });
    });
  }

  openResumeModal() {
    const modal = document.getElementById('res-modal');
    const form = document.getElementById('res-modal-form');
    if (!modal || !form) return;
    form.reset();
    modal.style.display = 'flex';
  }

  saveResumeFromModal() {
    const form = document.getElementById('res-modal-form');
    const modal = document.getElementById('res-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const name = form['res-name'].value.trim();
    if (!name) {
      alert('Please enter a resume title or filename.');
      return;
    }

    store.data.resumes.push({
      id: 'res_' + Date.now(),
      name,
      targetRole: form['res-target-role'].value.trim() || 'Software Engineer',
      lastUpdated: store.getTodayString(),
      skills: form['res-skills'].value.trim(),
      projects: form['res-projects'].value.trim(),
      certifications: form['res-certs'].value.trim(),
      notes: form['res-notes'].value.trim()
    });

    store.notify('RESUME_UPDATED');
    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
    this.render();
  }

  deleteResume(id) {
    const store = window.nandiniStore;
    if (confirm('Delete this resume profile?')) {
      store.data.resumes = store.data.resumes.filter(r => r.id !== id);
      store.notify('RESUME_UPDATED');
      this.render();
    }
  }

  openAppModal() {
    const modal = document.getElementById('app-modal');
    const form = document.getElementById('app-modal-form');
    if (!modal || !form) return;
    form.reset();
    form['app-date'].value = window.nandiniStore.getTodayString();

    // Populate resume dropdown
    const resSelect = form['app-resume-version'];
    if (resSelect) {
      resSelect.innerHTML = (window.nandiniStore.data.resumes || []).map(r => `
        <option value="${this.escapeHtml(r.name)}">${this.escapeHtml(r.name)}</option>
      `).join('');
    }

    modal.style.display = 'flex';
  }

  saveAppFromModal() {
    const form = document.getElementById('app-modal-form');
    const modal = document.getElementById('app-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const company = form['app-company'].value.trim();
    const role = form['app-role'].value.trim();

    if (!company || !role) {
      alert('Please enter the company and role.');
      return;
    }

    store.data.jobApplications.push({
      id: 'app_' + Date.now(),
      company,
      role,
      url: form['app-url'].value.trim(),
      dateApplied: form['app-date'].value || store.getTodayString(),
      resumeVersion: form['app-resume-version'].value,
      eligibilityVerified: form['app-eligibility'].checked,
      status: form['app-status'].value,
      nextStep: form['app-next-step'].value.trim(),
      followUpDate: form['app-followup-date'].value,
      notes: form['app-notes'].value.trim()
    });

    store.notify('APPLICATIONS_UPDATED');
    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
    this.render();
  }

  deleteApplication(id) {
    const store = window.nandiniStore;
    if (confirm('Delete this application record?')) {
      store.data.jobApplications = store.data.jobApplications.filter(a => a.id !== id);
      store.notify('APPLICATIONS_UPDATED');
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

window.nandiniResumes = new ResumeApplicationManager();

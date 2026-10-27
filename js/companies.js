/**
 * Target Companies Preparation Dashboard
 * Starter profiles across Tier-1 Product & Tech Consulting firms,
 * company-specific readiness checklists, application lifecycles, and skill gap comparisons.
 */

class TargetCompaniesManager {
  constructor() {
    this.filterPriority = 'All';
    this.filterStatus = 'All';
    this.viewMode = 'cards'; // 'cards' or 'comparison'
    this.editingCompanyId = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const prioFilter = document.getElementById('comp-filter-priority');
    if (prioFilter) {
      prioFilter.addEventListener('change', (e) => {
        this.filterPriority = e.target.value;
        this.render();
      });
    }

    const statusFilter = document.getElementById('comp-filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.render();
      });
    }

    const viewToggleBtn = document.getElementById('comp-btn-toggle-view');
    if (viewToggleBtn) {
      viewToggleBtn.addEventListener('click', () => {
        this.viewMode = this.viewMode === 'cards' ? 'comparison' : 'cards';
        viewToggleBtn.textContent = this.viewMode === 'cards' ? '📊 Skill Gap Matrix' : '🗂️ Company Cards';
        this.render();
      });
    }

    const addBtn = document.getElementById('comp-btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openCompanyModal());
    }

    const form = document.getElementById('comp-modal-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveCompanyFromModal();
      });
    }

    const closeBtn = document.getElementById('comp-modal-close');
    const modal = document.getElementById('comp-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  render() {
    this.renderMetrics();
    if (this.viewMode === 'comparison') {
      this.renderComparisonMatrix();
    } else {
      this.renderCompanyCards();
    }
  }

  renderMetrics() {
    const store = window.nandiniStore;
    if (!store) return;
    const comps = store.data.companies || [];

    const total = comps.length;
    const dream = comps.filter(c => c.priority === 'Dream').length;
    const target = comps.filter(c => c.priority === 'Target').length;
    const backup = comps.filter(c => c.priority === 'Backup').length;
    const applied = comps.filter(c => ['Applied', 'Assessment Scheduled', 'Interview Scheduled', 'Offer'].includes(c.applicationStatus)).length;

    const elTotal = document.getElementById('comp-stat-total');
    const elDream = document.getElementById('comp-stat-dream');
    const elTarget = document.getElementById('comp-stat-target');
    const elApplied = document.getElementById('comp-stat-applied');

    if (elTotal) elTotal.textContent = total;
    if (elDream) elDream.textContent = dream;
    if (elTarget) elTarget.textContent = target;
    if (elApplied) elApplied.textContent = applied;
  }

  getFilteredCompanies() {
    const store = window.nandiniStore;
    const list = (store && store.data.companies) || [];

    return list.filter(c => {
      if (this.filterPriority !== 'All' && c.priority !== this.filterPriority) return false;
      if (this.filterStatus !== 'All' && c.applicationStatus !== this.filterStatus) return false;
      return true;
    });
  }

  computeCompanyReadiness(company) {
    const chk = company.readinessChecklist || [];
    let total = chk.length;
    let done = chk.filter(x => x.checked).length;

    total += 4;
    if (company.dsaPrepStatus === 'Ready') done++;
    else if (company.dsaPrepStatus === 'In Progress') done += 0.5;

    if (company.coreCsPrepStatus === 'Ready') done++;
    else if (company.coreCsPrepStatus === 'In Progress') done += 0.5;

    if (company.aptitudePrepStatus === 'Ready') done++;
    else if (company.aptitudePrepStatus === 'In Progress') done += 0.5;

    if (company.tailoredResumeStatus === 'Ready') done++;
    else if (company.tailoredResumeStatus === 'In Progress') done += 0.5;

    return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  }

  renderCompanyCards() {
    const container = document.getElementById('comp-cards-container');
    const matrixContainer = document.getElementById('comp-matrix-container');
    if (!container) return;

    container.style.display = 'grid';
    if (matrixContainer) matrixContainer.style.display = 'none';

    const items = this.getFilteredCompanies();
    if (items.length === 0) {
      container.innerHTML = `<div class="empty-state-notice">No company profiles match your current filter selection.</div>`;
      return;
    }

    container.innerHTML = items.map(c => {
      const readinessPct = this.computeCompanyReadiness(c);
      const prioClass = `prio-${c.priority.toLowerCase()}`;
      const appStatusClass = `app-status-${c.applicationStatus.toLowerCase().replace(/\s+/g, '-')}`;

      return `
        <div class="company-profile-card">
          <div class="comp-card-top-row">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h3 class="comp-name">${this.escapeHtml(c.name)}</h3>
                <span class="badge-priority ${prioClass}">${c.priority}</span>
              </div>
              <span class="comp-role-sub">${this.escapeHtml(c.targetRole)}</span>
            </div>
            ${c.officialCareersUrl ? `<a href="${c.officialCareersUrl}" target="_blank" rel="noopener" class="comp-careers-link">Official Careers ↗</a>` : ''}
          </div>

          <!-- Readiness Bar -->
          <div class="comp-readiness-box">
            <div class="readiness-label-row">
              <span>Preparation Readiness</span>
              <strong>${readinessPct}%</strong>
            </div>
            <div class="mini-bar-track">
              <div class="mini-bar-fill" style="width: ${readinessPct}%"></div>
            </div>
          </div>

          <!-- Prep Status Pillars -->
          <div class="comp-pillars-grid">
            <div class="pillar-box">
              <span class="pillar-label">DSA</span>
              <span class="pillar-val status-${c.dsaPrepStatus.toLowerCase().replace(/\s+/g, '-')}">${c.dsaPrepStatus}</span>
            </div>
            <div class="pillar-box">
              <span class="pillar-label">Aptitude</span>
              <span class="pillar-val status-${c.aptitudePrepStatus.toLowerCase().replace(/\s+/g, '-')}">${c.aptitudePrepStatus}</span>
            </div>
            <div class="pillar-box">
              <span class="pillar-label">Core CS</span>
              <span class="pillar-val status-${c.coreCsPrepStatus.toLowerCase().replace(/\s+/g, '-')}">${c.coreCsPrepStatus}</span>
            </div>
            <div class="pillar-box">
              <span class="pillar-label">Resume</span>
              <span class="pillar-val status-${c.tailoredResumeStatus.toLowerCase().replace(/\s+/g, '-')}">${c.tailoredResumeStatus}</span>
            </div>
          </div>

          <!-- Application Status Row -->
          <div class="comp-app-status-box">
            <label class="meta-label">Application Lifecycle:</label>
            <select class="status-select-sm comp-app-select" data-id="${c.id}">
              <option value="Not Researched" ${c.applicationStatus === 'Not Researched' ? 'selected' : ''}>Not Researched</option>
              <option value="Preparing" ${c.applicationStatus === 'Preparing' ? 'selected' : ''}>Preparing</option>
              <option value="Ready to Apply" ${c.applicationStatus === 'Ready to Apply' ? 'selected' : ''}>Ready to Apply</option>
              <option value="Applied" ${c.applicationStatus === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Assessment Scheduled" ${c.applicationStatus === 'Assessment Scheduled' ? 'selected' : ''}>Assessment Scheduled</option>
              <option value="Interview Scheduled" ${c.applicationStatus === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
              <option value="Offer" ${c.applicationStatus === 'Offer' ? 'selected' : ''}>Offer 🎉</option>
              <option value="Rejected" ${c.applicationStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
              <option value="On Hold" ${c.applicationStatus === 'On Hold' ? 'selected' : ''}>On Hold</option>
            </select>
          </div>

          <!-- Company Readiness Checklist -->
          <div class="comp-checklist-box">
            <span class="meta-label">Preparation Checklist:</span>
            <div class="comp-chk-items">
              ${(c.readinessChecklist || []).map((item, idx) => `
                <label class="pookie-checkbox-label comp-chk-label">
                  <input type="checkbox" class="comp-chk-input" data-comp-id="${c.id}" data-idx="${idx}" ${item.checked ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  <span class="${item.checked ? 'strike' : ''}">${this.escapeHtml(item.label)}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Notes & Footer -->
          ${c.notes ? `<p class="comp-notes-text">📝 ${this.escapeHtml(c.notes)}</p>` : ''}

          <div class="comp-footer-actions">
            <span class="comp-rounds-hint">${this.escapeHtml(c.interviewRounds || 'Rounds not specified')}</span>
            <button class="btn-sm btn-ghost btn-edit-comp" data-id="${c.id}">Edit</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.comp-app-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateApplicationStatus(id, e.target.value);
      });
    });

    container.querySelectorAll('.comp-chk-input').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const compId = e.target.getAttribute('data-comp-id');
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        this.toggleChecklistItem(compId, idx, e.target.checked);
      });
    });

    container.querySelectorAll('.btn-edit-comp').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openCompanyModal(id);
      });
    });
  }

  renderComparisonMatrix() {
    const container = document.getElementById('comp-cards-container');
    const matrixContainer = document.getElementById('comp-matrix-container');
    if (!matrixContainer) return;

    if (container) container.style.display = 'none';
    matrixContainer.style.display = 'block';

    const items = this.getFilteredCompanies();

    matrixContainer.innerHTML = `
      <div class="dsa-table-responsive">
        <table class="pookie-table">
          <thead>
            <tr>
              <th>Company & Priority</th>
              <th>Target Role</th>
              <th>Overall Prep</th>
              <th>DSA Status</th>
              <th>Aptitude</th>
              <th>Core CS</th>
              <th>Tailored Resume</th>
              <th>Application Status</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(c => `
              <tr>
                <td>
                  <strong>${this.escapeHtml(c.name)}</strong>
                  <span class="badge-priority prio-${c.priority.toLowerCase()}">${c.priority}</span>
                </td>
                <td>${this.escapeHtml(c.targetRole)}</td>
                <td><strong>${this.computeCompanyReadiness(c)}%</strong></td>
                <td><span class="status-pill status-${c.dsaPrepStatus.toLowerCase().replace(/\s+/g, '-')}">${c.dsaPrepStatus}</span></td>
                <td><span class="status-pill status-${c.aptitudePrepStatus.toLowerCase().replace(/\s+/g, '-')}">${c.aptitudePrepStatus}</span></td>
                <td><span class="status-pill status-${c.coreCsPrepStatus.toLowerCase().replace(/\s+/g, '-')}">${c.coreCsPrepStatus}</span></td>
                <td><span class="status-pill status-${c.tailoredResumeStatus.toLowerCase().replace(/\s+/g, '-')}">${c.tailoredResumeStatus}</span></td>
                <td><span class="status-pill">${c.applicationStatus}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  updateApplicationStatus(id, newStatus) {
    const store = window.nandiniStore;
    const c = store.data.companies.find(x => x.id === id);
    if (c) {
      c.applicationStatus = newStatus;
      store.notify('COMPANY_UPDATED');
      this.render();
    }
  }

  toggleChecklistItem(compId, idx, isChecked) {
    const store = window.nandiniStore;
    const c = store.data.companies.find(x => x.id === compId);
    if (c && c.readinessChecklist && c.readinessChecklist[idx]) {
      c.readinessChecklist[idx].checked = isChecked;
      if (isChecked && window.placementAudio) window.placementAudio.playClick();
      store.notify('COMPANY_UPDATED');
      this.render();
    }
  }

  openCompanyModal(id = null) {
    this.editingCompanyId = id;
    const modal = document.getElementById('comp-modal');
    const form = document.getElementById('comp-modal-form');
    const titleEl = document.getElementById('comp-modal-title');
    if (!modal || !form) return;

    if (id) {
      const c = window.nandiniStore.data.companies.find(x => x.id === id);
      if (!c) return;
      titleEl.textContent = 'Edit Company Target Profile';
      form['comp-name'].value = c.name || '';
      form['comp-careers-url'].value = c.officialCareersUrl || '';
      form['comp-role'].value = c.targetRole || '';
      form['comp-priority'].value = c.priority || 'Target';
      form['comp-app-status'].value = c.applicationStatus || 'Preparing';
      form['comp-dsa-status'].value = c.dsaPrepStatus || 'In Progress';
      form['comp-apti-status'].value = c.aptitudePrepStatus || 'In Progress';
      form['comp-core-status'].value = c.coreCsPrepStatus || 'In Progress';
      form['comp-resume-status'].value = c.tailoredResumeStatus || 'In Progress';
      form['comp-rounds'].value = c.interviewRounds || '';
      form['comp-notes'].value = c.notes || '';
    } else {
      titleEl.textContent = 'Add Target Company Profile';
      form.reset();
      form['comp-priority'].value = 'Target';
      form['comp-app-status'].value = 'Preparing';
    }

    modal.style.display = 'flex';
  }

  saveCompanyFromModal() {
    const form = document.getElementById('comp-modal-form');
    const modal = document.getElementById('comp-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const name = form['comp-name'].value.trim();
    if (!name) {
      alert('Please enter the company name.');
      return;
    }

    const payload = {
      name,
      officialCareersUrl: form['comp-careers-url'].value.trim(),
      targetRole: form['comp-role'].value.trim() || 'Software Engineer',
      priority: form['comp-priority'].value,
      applicationStatus: form['comp-app-status'].value,
      dsaPrepStatus: form['comp-dsa-status'].value,
      aptitudePrepStatus: form['comp-apti-status'].value,
      coreCsPrepStatus: form['comp-core-status'].value,
      tailoredResumeStatus: form['comp-resume-status'].value,
      interviewRounds: form['comp-rounds'].value.trim(),
      notes: form['comp-notes'].value.trim()
    };

    if (this.editingCompanyId) {
      const c = store.data.companies.find(x => x.id === this.editingCompanyId);
      if (c) {
        Object.assign(c, payload);
      }
    } else {
      store.data.companies.push({
        id: 'comp_' + Date.now(),
        ...payload,
        eligibilityCriteria: 'Verify role-specific requirements on official careers portal.',
        requiredSkills: ['Algorithms', 'Java', 'SQL', 'Problem Solving'],
        readinessChecklist: [
          { id: 'c_1', label: 'Company test syllabus researched', checked: false },
          { id: 'c_2', label: 'Relevant DSA topics practiced', checked: false },
          { id: 'c_3', label: 'Core CS interview questions reviewed', checked: false },
          { id: 'c_4', label: 'Resume tailored with matching keywords', checked: false }
        ]
      });
    }

    store.notify('COMPANY_UPDATED');
    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
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

window.nandiniCompanies = new TargetCompaniesManager();

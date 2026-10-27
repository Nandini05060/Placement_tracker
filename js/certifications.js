/**
 * Courses & Certifications Manager
 * Tracks online learning goals, proctored exam deadlines, modules, and certificate credentials.
 */

class CertificationsManager {
  constructor() {
    this.filterStatus = 'All';
    this.filterProvider = 'All';
    this.searchQuery = '';
    this.editingCertId = null;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    const searchInput = document.getElementById('cert-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    const statusFilter = document.getElementById('cert-filter-status');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.renderTable();
      });
    }

    const providerFilter = document.getElementById('cert-filter-provider');
    if (providerFilter) {
      providerFilter.addEventListener('change', (e) => {
        this.filterProvider = e.target.value;
        this.renderTable();
      });
    }

    const addBtn = document.getElementById('cert-btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openCertModal());
    }

    const form = document.getElementById('cert-modal-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveCertFromModal();
      });
    }

    const closeBtn = document.getElementById('cert-modal-close');
    const modal = document.getElementById('cert-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  }

  render() {
    this.renderStats();
    this.renderTable();
  }

  renderStats() {
    const store = window.nandiniStore;
    if (!store) return;
    const certs = store.data.certifications || [];

    const total = certs.length;
    const completed = certs.filter(c => c.status === 'Completed' || c.earned).length;
    const inProgress = certs.filter(c => c.status === 'In Progress').length;
    const examCerts = certs.filter(c => c.type === 'Certification Exam');
    const examsEarned = examCerts.filter(c => c.earned).length;

    const elTotal = document.getElementById('cert-stat-total');
    const elCompleted = document.getElementById('cert-stat-completed');
    const elInProgress = document.getElementById('cert-stat-inprogress');
    const elExams = document.getElementById('cert-stat-exams');

    if (elTotal) elTotal.textContent = total;
    if (elCompleted) elCompleted.textContent = completed;
    if (elInProgress) elInProgress.textContent = inProgress;
    if (elExams) elExams.textContent = `${examsEarned} / ${examCerts.length}`;
  }

  getFilteredCerts() {
    const store = window.nandiniStore;
    const list = (store && store.data.certifications) || [];

    return list.filter(c => {
      if (this.filterStatus !== 'All' && c.status !== this.filterStatus) return false;
      if (this.filterProvider !== 'All' && !c.provider.toLowerCase().includes(this.filterProvider.toLowerCase())) return false;
      if (this.searchQuery) {
        const titleMatch = (c.title || '').toLowerCase().includes(this.searchQuery);
        const skillMatch = (c.skill || '').toLowerCase().includes(this.searchQuery);
        const providerMatch = (c.provider || '').toLowerCase().includes(this.searchQuery);
        if (!titleMatch && !skillMatch && !providerMatch) return false;
      }
      return true;
    });
  }

  renderTable() {
    const tbody = document.getElementById('cert-table-body');
    const emptyState = document.getElementById('cert-empty-state');
    if (!tbody) return;

    const items = this.getFilteredCerts();

    if (items.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = items.map(c => {
      const statusClass = `status-${c.status.toLowerCase().replace(/\s+/g, '-')}`;
      const isEarned = !!c.earned;

      return `
        <tr>
          <td>
            <div class="cert-title-cell">
              <strong>${this.escapeHtml(c.title)}</strong>
              ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener" class="cert-ext-link">Official Link ↗</a>` : ''}
              ${c.isSample ? '<span class="pill-sample-tag">Starter Suggestion</span>' : ''}
            </div>
          </td>
          <td><span class="badge-provider">${this.escapeHtml(c.provider)}</span></td>
          <td><span class="badge-skill-tag">${this.escapeHtml(c.skill)}</span></td>
          <td>${this.escapeHtml(c.type)}</td>
          <td>
            <div class="cert-progress-cell">
              <span>${c.progress || 0}% (${c.modulesCompleted || 0}/${c.totalModules || 0} modules)</span>
              <div class="mini-bar-track">
                <div class="mini-bar-fill" style="width: ${c.progress || 0}%"></div>
              </div>
            </div>
          </td>
          <td>
            <select class="status-select-sm cert-status-select" data-id="${c.id}">
              <option value="Planned" ${c.status === 'Planned' ? 'selected' : ''}>Planned</option>
              <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${c.status === 'Completed' ? 'selected' : ''}>Completed ✓</option>
              <option value="On Hold" ${c.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
              <option value="Dropped" ${c.status === 'Dropped' ? 'selected' : ''}>Dropped</option>
            </select>
          </td>
          <td>
            <button class="btn-earn-toggle ${isEarned ? 'earned-true' : 'earned-false'}" data-id="${c.id}">
              ${isEarned ? '⭐ Earned' : 'Pending'}
            </button>
          </td>
          <td>
            <span class="cert-deadline-text">${c.targetCompletion || 'No target'}</span>
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="btn-sm btn-ghost btn-edit-cert" data-id="${c.id}">Edit</button>
              <button class="btn-sm btn-ghost btn-del-cert" data-id="${c.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.cert-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        this.updateStatus(id, e.target.value);
      });
    });

    tbody.querySelectorAll('.btn-earn-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.toggleEarned(id);
      });
    });

    tbody.querySelectorAll('.btn-edit-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openCertModal(id);
      });
    });

    tbody.querySelectorAll('.btn-del-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.deleteCert(id);
      });
    });
  }

  updateStatus(id, newStatus) {
    const store = window.nandiniStore;
    const cert = store.data.certifications.find(c => c.id === id);
    if (cert) {
      cert.status = newStatus;
      if (newStatus === 'Completed') {
        cert.progress = 100;
        cert.actualCompletion = store.getTodayString();
        if (window.placementAudio) window.placementAudio.playSuccess();
      }
      store.notify('CERT_UPDATED');
      this.render();
    }
  }

  toggleEarned(id) {
    const store = window.nandiniStore;
    const cert = store.data.certifications.find(c => c.id === id);
    if (cert) {
      cert.earned = !cert.earned;
      if (cert.earned) {
        cert.status = 'Completed';
        cert.progress = 100;
        cert.actualCompletion = store.getTodayString();
        if (window.placementAudio) window.placementAudio.playSuccess();
        if (window.placementConfetti) window.placementConfetti.burst(60);
      }
      store.notify('CERT_UPDATED');
      this.render();
    }
  }

  openCertModal(id = null) {
    this.editingCertId = id;
    const modal = document.getElementById('cert-modal');
    const form = document.getElementById('cert-modal-form');
    const titleEl = document.getElementById('cert-modal-title');
    if (!modal || !form) return;

    if (id) {
      const cert = window.nandiniStore.data.certifications.find(c => c.id === id);
      if (!cert) return;
      titleEl.textContent = 'Edit Course or Certification';
      form['cert-title'].value = cert.title || '';
      form['cert-provider'].value = cert.provider || 'Coursera';
      form['cert-skill'].value = cert.skill || '';
      form['cert-url'].value = cert.url || '';
      form['cert-type'].value = cert.type || 'Free Course';
      form['cert-status'].value = cert.status || 'Planned';
      form['cert-progress'].value = cert.progress || 0;
      form['cert-modules-done'].value = cert.modulesCompleted || 0;
      form['cert-modules-total'].value = cert.totalModules || 0;
      form['cert-target-date'].value = cert.targetCompletion || '';
      form['cert-certificate-url'].value = cert.certificateUrl || '';
      form['cert-notes'].value = cert.notes || '';
    } else {
      titleEl.textContent = 'Add Course or Certification Goal';
      form.reset();
      form['cert-progress'].value = 0;
      form['cert-status'].value = 'Planned';
    }

    modal.style.display = 'flex';
  }

  saveCertFromModal() {
    const form = document.getElementById('cert-modal-form');
    const modal = document.getElementById('cert-modal');
    const store = window.nandiniStore;
    if (!form || !modal || !store) return;

    const title = form['cert-title'].value.trim();
    if (!title) {
      alert('Please enter the course or certification name.');
      return;
    }

    const payload = {
      title,
      provider: form['cert-provider'].value.trim(),
      skill: form['cert-skill'].value.trim() || 'General Engineering',
      url: form['cert-url'].value.trim(),
      type: form['cert-type'].value,
      status: form['cert-status'].value,
      progress: parseInt(form['cert-progress'].value, 10) || 0,
      modulesCompleted: parseInt(form['cert-modules-done'].value, 10) || 0,
      totalModules: parseInt(form['cert-modules-total'].value, 10) || 0,
      targetCompletion: form['cert-target-date'].value,
      certificateUrl: form['cert-certificate-url'].value.trim(),
      notes: form['cert-notes'].value.trim(),
      isSample: false
    };

    if (this.editingCertId) {
      const c = store.data.certifications.find(x => x.id === this.editingCertId);
      if (c) {
        Object.assign(c, payload);
      }
    } else {
      store.data.certifications.push({
        id: 'cert_' + Date.now(),
        ...payload,
        plannedStart: store.getTodayString(),
        earned: payload.status === 'Completed',
        actualCompletion: payload.status === 'Completed' ? store.getTodayString() : ''
      });
    }

    store.notify('CERT_UPDATED');
    if (window.placementAudio) window.placementAudio.playSuccess();
    modal.style.display = 'none';
    this.render();
  }

  deleteCert(id) {
    const store = window.nandiniStore;
    if (confirm('Delete this certification record?')) {
      store.data.certifications = store.data.certifications.filter(c => c.id !== id);
      store.notify('CERT_UPDATED');
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

window.nandiniCertifications = new CertificationsManager();

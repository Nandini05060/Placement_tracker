/**
 * Collectible Achievement Badges 🏆🎀
 * Evaluates real progress metrics and celebrates unlocks with confetti and fanfares!
 */

class PookieAchievements {
  constructor() {
    this.container = null;
  }

  init() {
    this.container = document.getElementById('achievements-grid');
    this.render();
  }

  checkAll() {
    const store = window.pookieStore;
    if (!store) return;

    let newlyUnlocked = [];

    const totalSessions = (store.data.timerSessions || []).length;
    const streakInfo = store.getStreakInfo();
    const solvedDsa = store.getSolvedDsaCount();
    const aptiSessions = (store.data.aptitudeSessions || []).length;
    const hasMilestone = (store.data.projects || []).some(p =>
      (p.milestones || []).some(m => m.status === 'Completed')
    );
    const totalHours = store.getTotalStudiedMinutes() / 60;
    const roadmapDone = (store.data.roadmap || []).length === 24 &&
      store.data.roadmap.every(w => w.completed);

    const conditions = {
      ach_first_session: totalSessions >= 1,
      ach_streak_5: streakInfo.bestStreak >= 5 || streakInfo.currentStreak >= 5,
      ach_dsa_10: solvedDsa >= 10,
      ach_dsa_25: solvedDsa >= 25,
      ach_aptitude_first: aptiSessions >= 1,
      ach_milestone_first: hasMilestone,
      ach_hours_50: totalHours >= 50,
      ach_roadmap_complete: roadmapDone
    };

    (store.data.achievements || []).forEach(badge => {
      if (!badge.unlocked && conditions[badge.id]) {
        badge.unlocked = true;
        badge.unlockedAt = store.getTodayString();
        newlyUnlocked.push(badge);
      }
    });

    if (newlyUnlocked.length > 0) {
      store.notify('ACHIEVEMENTS_UPDATED');
      this.celebrateNewUnlocks(newlyUnlocked);
    }

    this.render();
  }

  celebrateNewUnlocks(badges) {
    if (window.pookieAudio) window.pookieAudio.playBadgeUnlocked();
    if (window.pookieConfetti) window.pookieConfetti.burst(100);

    const names = badges.map(b => b.title).join(', ');
    alert(`🎀 YAYYY POOKIE! Badge Unlocked: ${names}! So proud of your hard work! ⭐🎉`);
  }

  render() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;

    const store = window.pookieStore;
    if (!store) return;
    const badges = store.data.achievements || [];

    const unlockedCount = badges.filter(b => b.unlocked).length;
    const totalBadges = badges.length;
    const pct = Math.round((unlockedCount / totalBadges) * 100);

    const statCountEl = document.getElementById('ach-stat-count');
    const statBarEl = document.getElementById('ach-stat-bar');

    if (statCountEl) statCountEl.textContent = `${unlockedCount} of ${totalBadges} Badges Collected (${pct}%)`;
    if (statBarEl) statBarEl.style.width = `${pct}%`;

    container.innerHTML = badges.map(b => {
      const isUnlocked = !!b.unlocked;

      return `
        <div class="achievement-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
          <div class="badge-icon-box">
            <span class="badge-emoji">${b.icon || '🎀'}</span>
            ${isUnlocked ? '<span class="badge-sparkle">✨</span>' : '<span class="badge-lock-icon">🔒</span>'}
          </div>
          <h4 class="badge-title">${this.escapeHtml(b.title)}</h4>
          <p class="badge-desc">${this.escapeHtml(b.desc)}</p>
          <div class="badge-status-pill ${isUnlocked ? 'pill-unlocked' : 'pill-locked'}">
            ${isUnlocked ? `⭐ Unlocked ${b.unlockedAt || ''}` : 'Locked'}
          </div>
        </div>
      `;
    }).join('');
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

window.pookieAchievements = new PookieAchievements();

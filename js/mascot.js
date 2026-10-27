/**
 * Pookie Motivational Mascot 🐰🎀
 * Friendly, sweet, never guilt-tripping!
 * Adapts messages based on state: idle, studying, session done, streak, and target reached.
 */

class PookieMascot {
  constructor() {
    this.container = null;
    this.messageEl = null;
    this.avatarEl = null;
    this.currentMood = 'happy'; // 'happy', 'studying', 'celebrating', 'gentle', 'sleepy'

    this.idleQuotes = [
      "Hey Pookie! Ready to become placement-ready? 🎀",
      "One concept at a time, bestie! You're making progress every single day! 🌸",
      "Believe in yourself! Big tech and dream companies are waiting for you! ✨",
      "Consistency is cuter than burnout. Take steady steps! 💖",
      "Your future self will thank you for today's DSA practice! 💻✨",
      "Hydrate, sit up straight, and let's conquer today's goals! 💧🎀",
      "Even 25 minutes of deep focus is a huge win! 🍰"
    ];

    this.studyingQuotes = [
      "Focus mode on! You and code against the world! 🎀💻",
      "Locking in! Proud of you for sitting down to work! ✨",
      "Deep breaths! The algorithmic magic is happening! 🧠🌸",
      "Shhh... Pookie is quietly cheering you on! 🐰🤍"
    ];

    this.completedSessionQuotes = [
      "OMG, amazing focus! That was so satisfying! 🌸🎉",
      "Session complete! Time to stretch and grab some water, bestie! 💧✨",
      "Another session checked off! You're getting stronger by the hour! 🎀",
      "Gold star for you! That focus was immaculate! ⭐💖"
    ];

    this.targetReachedQuotes = [
      "YAYYY! You reached your 2-hour daily study goal! You're an absolute star! 🌟🎉",
      "Daily target achieved! Look at that dedication! Bestie is unstoppable! 🎀✨",
      "Mission accomplished for today! Proud of your discipline! 💖🐰"
    ];

    this.gentleEncouragementQuotes = [
      "Some days are lighter than others, and that's totally okay! Be kind to yourself! 🌸",
      "Progress isn't always linear. You're showing up, and that's what counts! 🤍",
      "Small steps still move you forward, sweet friend! 🎀"
    ];
  }

  init(containerSelector = '#mascot-widget') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    this.messageEl = this.container.querySelector('.mascot-message');
    this.avatarEl = this.container.querySelector('.mascot-avatar');

    if (this.avatarEl) {
      this.avatarEl.addEventListener('click', () => {
        if (window.pookieAudio) window.pookieAudio.playClick();
        this.poke();
      });
    }

    this.evaluateState();
  }

  setMessage(text, mood = 'happy') {
    this.currentMood = mood;
    if (this.messageEl) {
      this.messageEl.style.opacity = '0';
      setTimeout(() => {
        this.messageEl.textContent = text;
        this.messageEl.style.opacity = '1';
      }, 150);
    }
    if (this.avatarEl) {
      this.avatarEl.className = `mascot-avatar mood-${mood}`;
    }
  }

  poke() {
    // Random cute quote when user taps the mascot
    const pool = [...this.idleQuotes, ...this.gentleEncouragementQuotes];
    const quote = pool[Math.floor(Math.random() * pool.length)];
    this.setMessage(quote, 'happy');

    // Add bounce animation
    if (this.avatarEl) {
      this.avatarEl.classList.remove('poked');
      void this.avatarEl.offsetWidth; // trigger reflow
      this.avatarEl.classList.add('poked');
    }
  }

  onTimerStart(subject) {
    const text = subject
      ? `Locking in for ${subject}! You've got this, Pookie! 🎀💻`
      : this.studyingQuotes[Math.floor(Math.random() * this.studyingQuotes.length)];
    this.setMessage(text, 'studying');
  }

  onTimerComplete() {
    const quote = this.completedSessionQuotes[Math.floor(Math.random() * this.completedSessionQuotes.length)];
    this.setMessage(quote, 'celebrating');
  }

  evaluateState() {
    if (!window.pookieStore) return;
    const studiedMins = window.pookieStore.getTodayStudiedMinutes();
    const target = window.pookieStore.data.settings.dailyTargetMinutes || 120;

    if (studiedMins >= target && target > 0) {
      this.setMessage(this.targetReachedQuotes[Math.floor(Math.random() * this.targetReachedQuotes.length)], 'celebrating');
    } else {
      const quote = this.idleQuotes[Math.floor(Math.random() * this.idleQuotes.length)];
      this.setMessage(quote, 'happy');
    }
  }
}

window.pookieMascot = new PookieMascot();

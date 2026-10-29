/**
 * Placement Preparation Data Access Layer (DAL)
 * Wraps localStorage with validation, listeners, and comprehensive placement preparation formulas.
 * Can be transparently swapped with a backend REST or GraphQL API without altering React components.
 */

import { getDefaultData, getTodayString } from '../data/defaultData.js';

const STORAGE_KEY = 'nandini_placement_journey_react_v2';
const OLD_STORAGE_KEY = 'nandini_placement_journey_react_v1';

class PlacementStore {
  constructor() {
    this.listeners = new Set();
    this.data = this.loadData();
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
      const defaultData = getDefaultData();

      if (!raw) {
        this.saveDirect(defaultData);
        return defaultData;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.settings) {
        console.warn('Corrupt storage detected, initializing fresh profile');
        this.saveDirect(defaultData);
        return defaultData;
      }

      // Check version: if version < 6,
      // reset pre-defined roadmap and certifications to empty for full user custom control, while preserving settings!
      if (!parsed.version || parsed.version < 6) {
        console.info('Upgrading to version 6: empty user-defined roadmap and certifications');
        const updatedData = {
          ...defaultData,
          ...parsed,
          version: 6,
          roadmap: (parsed.roadmap && parsed.roadmap.length > 0 && parsed.roadmap[0].id?.startsWith('week_')) ? [] : (parsed.roadmap || []),
          certifications: (parsed.certifications && parsed.certifications.length > 0 && parsed.certifications[0].id === 'cert_1') ? [] : (parsed.certifications || []),
          settings: {
            ...defaultData.settings,
            ...(parsed.settings || {})
          }
        };
        localStorage.removeItem(OLD_STORAGE_KEY);
        this.saveDirect(updatedData);
        return updatedData;
      }

      return this.ensureSchema(parsed);
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      return getDefaultData();
    }
  }

  saveDirect(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  ensureSchema(loaded) {
    const defaultData = getDefaultData();
    return {
      ...defaultData,
      ...loaded,
      settings: { ...defaultData.settings, ...(loaded.settings || {}) },
      dailyTasks: Array.isArray(loaded.dailyTasks) ? loaded.dailyTasks : defaultData.dailyTasks,
      recurringHabits: Array.isArray(loaded.recurringHabits) ? loaded.recurringHabits : defaultData.recurringHabits,
      dsaProblems: Array.isArray(loaded.dsaProblems) ? loaded.dsaProblems : defaultData.dsaProblems,
      coreSubjects: loaded.coreSubjects || defaultData.coreSubjects,
      aptitudeCategories: Array.isArray(loaded.aptitudeCategories) ? loaded.aptitudeCategories : defaultData.aptitudeCategories,
      aptitudeSessions: Array.isArray(loaded.aptitudeSessions) ? loaded.aptitudeSessions : defaultData.aptitudeSessions,
      softSkills: Array.isArray(loaded.softSkills) ? loaded.softSkills : defaultData.softSkills,
      certifications: Array.isArray(loaded.certifications) ? loaded.certifications : defaultData.certifications,
      projects: Array.isArray(loaded.projects) ? loaded.projects : defaultData.projects,
      companies: Array.isArray(loaded.companies) ? loaded.companies : defaultData.companies,
      resumes: Array.isArray(loaded.resumes) ? loaded.resumes : defaultData.resumes,
      atsChecklist: Array.isArray(loaded.atsChecklist) ? loaded.atsChecklist : defaultData.atsChecklist,
      jobApplications: Array.isArray(loaded.jobApplications) ? loaded.jobApplications : defaultData.jobApplications,
      mockInterviews: loaded.mockInterviews || defaultData.mockInterviews,
      revisionQueue: Array.isArray(loaded.revisionQueue) ? loaded.revisionQueue : defaultData.revisionQueue,
      mistakeJournal: Array.isArray(loaded.mistakeJournal) ? loaded.mistakeJournal : defaultData.mistakeJournal,
      weeklyReviews: Array.isArray(loaded.weeklyReviews) ? loaded.weeklyReviews : defaultData.weeklyReviews,
      timerSessions: Array.isArray(loaded.timerSessions) ? loaded.timerSessions : defaultData.timerSessions,
      roadmap: Array.isArray(loaded.roadmap) ? loaded.roadmap : defaultData.roadmap,
      companyQuestionProgress: loaded.companyQuestionProgress || {},
      striversProgress: loaded.striversProgress || {},
      aptitudeChapterProgress: loaded.aptitudeChapterProgress || {},
      resumeSkills: loaded.resumeSkills || defaultData.resumeSkills,
      termEndPrep: {
        completedExams: {},
        completedTopics: {},
        completedUnits: {},
        unitConfidence: {},
        subjectNotes: {},
        examTargetNotes: {},
        ...(loaded.termEndPrep || {})
      }
    };
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, payload) {
    this.saveData();
    this.listeners.forEach(fn => {
      try {
        fn(eventType, payload);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  getData() {
    return this.data;
  }

  // --- TIME & STREAK CALCULATIONS ---

  getTodayStudiedMinutes() {
    const today = getTodayString();
    return (this.data.timerSessions || [])
      .filter(s => s.dateStr === today)
      .reduce((sum, s) => sum + (s.durationSeconds ? Math.round(s.durationSeconds / 60) : (s.durationMinutes || 0)), 0);
  }

  getTotalStudiedHours() {
    const totalSecs = (this.data.timerSessions || [])
      .reduce((sum, s) => sum + (s.durationSeconds || (s.durationMinutes || 0) * 60), 0);
    return (totalSecs / 3600).toFixed(1);
  }

  getDaysRemaining() {
    const deadlineStr = this.data.settings?.targetDeadline || '2026-12-31';
    const target = new Date(deadlineStr + 'T23:59:59');
    const now = new Date();
    const diffMs = target - now;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  getStreakInfo() {
    const activeDates = new Set();
    (this.data.timerSessions || []).forEach(s => {
      if (s.dateStr) activeDates.add(s.dateStr);
    });
    (this.data.dailyTasks || []).forEach(t => {
      if (t.completed && t.date) activeDates.add(t.date);
    });

    if (activeDates.size === 0) return { currentStreak: 0, bestStreak: 0 };

    const sortedDates = Array.from(activeDates).sort();
    let bestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    sortedDates.forEach(dStr => {
      const cur = new Date(dStr + 'T00:00:00');
      if (prevDate) {
        const diffDays = Math.round((cur - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) tempStreak++;
        else if (diffDays > 1) tempStreak = 1;
      } else {
        tempStreak = 1;
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      prevDate = cur;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = getTodayString();
    const yestStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;
    if (activeDates.has(todayStr)) {
      let checkDate = new Date(today);
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else break;
      }
    } else if (activeDates.has(yestStr)) {
      let checkDate = new Date(yesterday);
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else break;
      }
    }

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak)
    };
  }

  // --- THREE DISTINCT PLACEMENT PROGRESS METRICS ---

  /**
   * METRIC A: Preparation Completion
   * Strictly calculates syllabus progress from completed roadmap milestones and their defined weights.
   */
  getPreparationCompletion() {
    const weeks = this.data.roadmap || [];
    if (weeks.length === 0) return { percentage: 0, completedWeeks: 0, totalWeeks: 24, completedTasks: 0, totalTasks: 0 };

    let totalTasks = 0;
    let completedTasks = 0;
    let totalWeight = 0;
    let weightedCompleted = 0;

    weeks.forEach(w => {
      const wWeight = w.weight || 4;
      totalWeight += wWeight;

      const tasks = w.defaultTasks || [];
      const wTasksCount = tasks.length;
      const wTasksDone = tasks.filter(t => t.completed).length;

      totalTasks += wTasksCount;
      completedTasks += wTasksDone;

      if (w.completed) {
        weightedCompleted += wWeight;
      } else if (wTasksCount > 0) {
        weightedCompleted += wWeight * (wTasksDone / wTasksCount);
      }
    });

    const completedWeeks = weeks.filter(w => w.completed).length;
    const pct = totalWeight > 0 ? Math.round((weightedCompleted / totalWeight) * 100) : 0;

    return {
      percentage: Math.min(100, pct),
      completedWeeks,
      totalWeeks: weeks.length,
      completedTasks,
      totalTasks
    };
  }

  /**
   * METRIC B: Skill Readiness
   * Strictly calculates from actual assessments, demonstrated skills and verified self-assessments across 6 weighted categories.
   * If no evidence exists, reports isAssessed: false ("Not assessed").
   */
  getSkillReadiness() {
    const weights = this.data.settings?.readinessWeights || {
      dsa: 25, coreCs: 20, projects: 20, aptitude: 15, softSkills: 10, certs: 10
    };

    // 1. DSA Score (target unique solved)
    const solvedDsa = this.getUniqueSolvedDsaCount();
    const dsaTarget = this.data.settings?.dsaTarget || 80;
    const dsaScore = Math.min(100, Math.round((solvedDsa / dsaTarget) * 100));

    // 2. Core CS Score (verified assessment requirement)
    let totalCoreTopics = 0;
    let corePoints = 0;
    Object.values(this.data.coreSubjects || {}).forEach(sub => {
      (sub.topics || []).forEach(t => {
        totalCoreTopics++;
        if (t.status === 'Interview-Ready' && t.interviewReadyAssessed) corePoints += 1.0;
        else if (t.status === 'Practised') corePoints += 0.65;
        else if (t.status === 'Learning') corePoints += 0.3;
      });
    });
    const coreCsScore = totalCoreTopics > 0 ? Math.min(100, Math.round((corePoints / totalCoreTopics) * 100)) : 0;

    // 3. Projects Score (Milestones & Interview Checklist)
    const projects = this.data.projects || [];
    let projScore = 0;
    if (projects.length > 0) {
      let totalM = 0;
      let doneM = 0;
      projects.forEach(p => {
        (p.milestones || []).forEach(m => {
          totalM += 1;
          if (m.status === 'Completed') doneM += 1;
          else if (m.status === 'In Progress') doneM += 0.4;
        });
        (p.interviewChecklist || []).forEach(chk => {
          totalM += 0.5;
          if (chk.checked) doneM += 0.5;
        });
      });
      projScore = totalM > 0 ? Math.min(100, Math.round((doneM / totalM) * 100)) : 0;
    }

    // 4. Aptitude Score (Accuracy weighted with practice volume)
    const aptiSessions = this.data.aptitudeSessions || [];
    let aptiScore = 0;
    if (aptiSessions.length > 0) {
      const totalAtt = aptiSessions.reduce((s, x) => s + (parseInt(x.attempted, 10) || 0), 0);
      const totalCorr = aptiSessions.reduce((s, x) => s + (parseInt(x.correct, 10) || 0), 0);
      const acc = totalAtt > 0 ? (totalCorr / totalAtt) * 100 : 0;
      const volumeFactor = Math.min(1, aptiSessions.length / 5);
      aptiScore = Math.min(100, Math.round(acc * 0.7 + (volumeFactor * 100) * 0.3));
    }

    // 5. Soft Skills Score (Competency confidence levels - strictly requires practice)
    const competencies = this.data.softSkills || [];
    let softPoints = 0;
    let softPracticedCount = 0;
    competencies.forEach(c => {
      if (c.confidence && c.confidence > 0 && c.lastPractice) {
        softPoints += (c.confidence / 5.0);
        softPracticedCount++;
      }
    });
    const softScore = competencies.length > 0 && softPracticedCount > 0 ? Math.min(100, Math.round((softPoints / competencies.length) * 100)) : 0;

    // 6. Certifications Score (Exam passed / Earned)
    const certs = this.data.certifications || [];
    const earnedCount = certs.filter(c => c.certificateEarned).length;
    const certScore = certs.length > 0 ? Math.min(100, Math.round((earnedCount / certs.length) * 100)) : 0;

    const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0) || 100;
    const isAssessed = (solvedDsa > 0 || corePoints > 0 || projScore > 0 || aptiSessions.length > 0 || softPracticedCount > 0 || earnedCount > 0);

    const overallWeightedScore = isAssessed ? Math.round(
      (dsaScore * weights.dsa +
       coreCsScore * weights.coreCs +
       projScore * weights.projects +
       aptiScore * weights.aptitude +
       softScore * weights.softSkills +
       certScore * weights.certs) / totalWeights
    ) : 0;

    return {
      overallScore: Math.min(100, overallWeightedScore),
      isAssessed,
      breakdown: {
        dsa: { score: dsaScore, weight: weights.dsa, label: 'DSA & Coding' },
        coreCs: { score: coreCsScore, weight: weights.coreCs, label: 'Core Computer Science' },
        projects: { score: projScore, weight: weights.projects, label: 'Projects & Engineering' },
        aptitude: { score: aptiScore, weight: weights.aptitude, label: 'Aptitude & Reasoning' },
        softSkills: { score: softScore, weight: weights.softSkills, label: 'Soft Skills & HR' },
        certs: { score: certScore, weight: weights.certs, label: 'Certifications' }
      }
    };
  }

  /**
   * METRIC C: Target Company Preparation
   * Strictly calculates how much of each company's preparation checklist is completed.
   */
  getTargetCompanyPreparation() {
    const companies = this.data.companies || [];
    const dreamCompanies = companies.filter(c => c.priority === 'Dream');
    const targetCompanies = companies.filter(c => c.priority === 'Target');

    let totalPoints = 0;
    let earnedPoints = 0;

    companies.forEach(comp => {
      // 4 readiness pillars per company
      totalPoints += 4;
      if (comp.dsaPrepStatus === 'Ready') earnedPoints += 1;
      else if (comp.dsaPrepStatus === 'In Progress') earnedPoints += 0.5;

      if (comp.coreCsPrepStatus === 'Practised' || comp.coreCsPrepStatus === 'Ready') earnedPoints += 1;
      else if (comp.coreCsPrepStatus === 'Learning') earnedPoints += 0.5;

      if (comp.aptitudePrepStatus === 'Ready') earnedPoints += 1;
      if (comp.tailoredResumeStatus === 'Ready') earnedPoints += 1;
    });

    const pct = totalPoints > 0 ? Math.min(100, Math.round((earnedPoints / totalPoints) * 100)) : 0;

    return {
      percentage: pct,
      dreamCount: dreamCompanies.length,
      targetCount: targetCompanies.length,
      totalTracked: companies.length,
      companiesList: companies.map(c => {
        let cTotal = 4;
        let cEarned = 0;
        if (c.dsaPrepStatus === 'Ready') cEarned += 1;
        else if (c.dsaPrepStatus === 'In Progress') cEarned += 0.5;
        if (c.coreCsPrepStatus === 'Practised' || c.coreCsPrepStatus === 'Ready') cEarned += 1;
        else if (c.coreCsPrepStatus === 'Learning') cEarned += 0.5;
        if (c.aptitudePrepStatus === 'Ready') cEarned += 1;
        if (c.tailoredResumeStatus === 'Ready') cEarned += 1;
        return {
          id: c.id,
          name: c.name,
          priority: c.priority,
          percentage: Math.round((cEarned / cTotal) * 100)
        };
      })
    };
  }

  // --- TOP PRIORITIES & RECOMMENDED NEXT ACTION ---

  getTopPriorities() {
    const today = getTodayString();
    const tasks = (this.data.dailyTasks || []).filter(t => !t.completed);
    const sorted = [...tasks].sort((a, b) => {
      const prioOrder = { High: 3, Medium: 2, Low: 1 };
      const diffPrio = (prioOrder[b.priority] || 1) - (prioOrder[a.priority] || 1);
      if (diffPrio !== 0) return diffPrio;
      return (a.date === today ? -1 : 1);
    });
    return sorted.slice(0, 3);
  }

  getRecommendedNextAction() {
    const weeks = this.data.roadmap || [];
    for (const week of weeks) {
      if (!week.completed) {
        const tasks = week.defaultTasks || [];
        const incompleteTask = tasks.find(t => !t.completed);
        if (incompleteTask) {
          return {
            weekNum: week.weekNum,
            weekTitle: week.title,
            subjectKey: week.subjectKey,
            taskText: incompleteTask.text,
            action: `Week ${week.weekNum} (${week.subjectKey}): ${incompleteTask.text}`
          };
        }
      }
    }
    return {
      weekNum: 24,
      weekTitle: 'Final Placement Revision',
      subjectKey: 'Consolidation',
      taskText: 'Take a comprehensive mock interview simulation',
      action: 'All structured roadmap weeks complete! Focus on mock interview assessments.'
    };
  }

  getUniqueSolvedDsaCount() {
    // Only count unique titles marked Solved
    const solvedTitles = new Set(
      (this.data.dsaProblems || [])
        .filter(p => p.status === 'Solved')
        .map(p => p.title.toLowerCase().trim())
    );
    return solvedTitles.size;
  }

  // --- DATA MUTATION METHODS ---

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.notify('SETTINGS_UPDATED', this.data.settings);
  }

  // Tasks
  addTask(task) {
    const newTask = {
      id: 'task_' + Date.now(),
      date: getTodayString(),
      completed: false,
      plannedMinutes: 30,
      actualMinutes: 0,
      priority: 'Medium',
      category: 'Java and DSA',
      ...task
    };
    this.data.dailyTasks = [newTask, ...(this.data.dailyTasks || [])];
    this.notify('TASK_ADDED', newTask);
    return newTask;
  }

  updateTask(id, updates) {
    this.data.dailyTasks = (this.data.dailyTasks || []).map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.notify('TASK_UPDATED', { id, updates });
  }

  deleteTask(id) {
    this.data.dailyTasks = (this.data.dailyTasks || []).filter(t => t.id !== id);
    this.notify('TASK_DELETED', id);
  }

  // Habits
  toggleHabit(id) {
    const today = getTodayString();
    this.data.recurringHabits = (this.data.recurringHabits || []).map(h => {
      if (h.id === id) {
        const isDoneToday = h.lastDone === today;
        return {
          ...h,
          lastDone: isDoneToday ? null : today,
          streak: isDoneToday ? Math.max(0, h.streak - 1) : h.streak + 1
        };
      }
      return h;
    });
    this.notify('HABIT_TOGGLED', id);
  }

  // Timer sessions
  addTimerSession(session) {
    const newSession = {
      id: 'sess_' + Date.now(),
      dateStr: getTodayString(),
      timestamp: Date.now(),
      ...session
    };
    this.data.timerSessions = [newSession, ...(this.data.timerSessions || [])];
    this.notify('TIMER_SESSION_ADDED', newSession);
    return newSession;
  }

  deleteTimerSession(id) {
    this.data.timerSessions = (this.data.timerSessions || []).filter(s => s.id !== id);
    this.notify('TIMER_SESSION_DELETED', id);
  }

  updateTimerSession(id, updates) {
    this.data.timerSessions = (this.data.timerSessions || []).map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.notify('TIMER_SESSION_UPDATED', { id, updates });
  }

  // DSA Problems
  addDsaProblem(problem) {
    const newProb = {
      id: 'dsa_' + Date.now(),
      attempts: 1,
      dateSolved: problem.status === 'Solved' ? getTodayString() : null,
      ...problem
    };
    this.data.dsaProblems = [newProb, ...(this.data.dsaProblems || [])];
    this.notify('DSA_ADDED', newProb);
    return newProb;
  }

  updateDsaProblem(id, updates) {
    this.data.dsaProblems = (this.data.dsaProblems || []).map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.notify('DSA_UPDATED', { id, updates });
  }

  deleteDsaProblem(id) {
    this.data.dsaProblems = (this.data.dsaProblems || []).filter(p => p.id !== id);
    this.notify('DSA_DELETED', id);
  }

  // Roadmap tasks
  toggleRoadmapTask(weekId, taskId) {
    this.data.roadmap = (this.data.roadmap || []).map(week => {
      if (week.id === weekId) {
        const updatedTasks = (week.defaultTasks || []).map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allCompleted = updatedTasks.every(t => t.completed);
        return {
          ...week,
          defaultTasks: updatedTasks,
          completed: allCompleted,
          completedAt: allCompleted ? getTodayString() : null
        };
      }
      return week;
    });
    this.notify('ROADMAP_TASK_TOGGLED', { weekId, taskId });
  }

  // Custom User Roadmap Management
  addRoadmapMilestone(milestone) {
    const newMilestone = {
      id: 'mile_' + Date.now(),
      weekNumber: (this.data.roadmap || []).length + 1,
      title: 'Custom Milestone',
      category: 'General Preparation',
      targetDate: '',
      description: '',
      weight: 4,
      completed: false,
      defaultTasks: [],
      ...milestone
    };
    this.data.roadmap = [...(this.data.roadmap || []), newMilestone];
    this.notify('ROADMAP_MILESTONE_ADDED', newMilestone);
    return newMilestone;
  }

  updateRoadmapMilestone(id, updates) {
    this.data.roadmap = (this.data.roadmap || []).map(m =>
      m.id === id ? { ...m, ...updates } : m
    );
    this.notify('ROADMAP_MILESTONE_UPDATED', { id, updates });
  }

  deleteRoadmapMilestone(id) {
    this.data.roadmap = (this.data.roadmap || []).filter(m => m.id !== id);
    this.notify('ROADMAP_MILESTONE_DELETED', id);
  }

  clearRoadmap() {
    this.data.roadmap = [];
    this.notify('ROADMAP_CLEARED', []);
  }

  setRoadmap(newRoadmap) {
    this.data.roadmap = newRoadmap;
    this.notify('ROADMAP_SET', newRoadmap);
  }

  // Striver's A2Z DSA Sheet Progress
  updateStriversProgress(problemId, updates) {
    if (!this.data.striversProgress) this.data.striversProgress = {};
    const existing = this.data.striversProgress[problemId] || {
      status: 'Not Started',
      notes: '',
      solvedAt: null
    };
    const updated = {
      ...existing,
      ...updates,
      lastUpdated: getTodayString()
    };
    if (updates.status === 'Solved' && !updated.solvedAt) {
      updated.solvedAt = getTodayString();
    }
    this.data.striversProgress[problemId] = updated;
    this.saveData();
    this.notify('STRIVERS_PROGRESS_UPDATED', { problemId, updated });
    return updated;
  }

  // R.S. Aggarwal Aptitude Chapter Progress
  updateAptitudeChapterProgress(chapterId, updates) {
    if (!this.data.aptitudeChapterProgress) this.data.aptitudeChapterProgress = {};
    const existing = this.data.aptitudeChapterProgress[chapterId] || {
      status: 'Not Started',
      questionsSolved: 0,
      accuracy: 0,
      notes: ''
    };
    const updated = {
      ...existing,
      ...updates,
      lastUpdated: getTodayString()
    };
    this.data.aptitudeChapterProgress[chapterId] = updated;
    this.saveData();
    this.notify('APTITUDE_CHAPTER_UPDATED', { chapterId, updated });
    return updated;
  }

  // Aptitude Sessions
  addAptitudeSession(session) {
    const newSession = {
      id: 'apts_' + Date.now(),
      date: getTodayString(),
      ...session
    };
    this.data.aptitudeSessions = [newSession, ...(this.data.aptitudeSessions || [])];
    
    // Update category attempted & correct
    this.data.aptitudeCategories = (this.data.aptitudeCategories || []).map(cat => {
      if (cat.name === session.category) {
        return {
          ...cat,
          questionsAttempted: (cat.questionsAttempted || 0) + (parseInt(session.attempted, 10) || 0),
          questionsCorrect: (cat.questionsCorrect || 0) + (parseInt(session.correct, 10) || 0)
        };
      }
      return cat;
    });

    this.notify('APTITUDE_SESSION_ADDED', newSession);
  }

  // Custom Core CS Subjects
  addCoreSubject(key, subjectData) {
    if (!this.data.coreSubjects) this.data.coreSubjects = {};
    this.data.coreSubjects[key] = {
      name: key,
      description: '',
      color: 'var(--color-primary)',
      studyHours: 0,
      topics: [],
      notes: '',
      ...subjectData
    };
    this.notify('CORE_SUBJECT_ADDED', { key, subjectData });
  }

  updateCoreSubject(key, updates) {
    if (!this.data.coreSubjects || !this.data.coreSubjects[key]) return;
    this.data.coreSubjects[key] = {
      ...this.data.coreSubjects[key],
      ...updates
    };
    this.notify('CORE_SUBJECT_UPDATED', { key, updates });
  }

  deleteCoreSubject(key) {
    if (!this.data.coreSubjects || !this.data.coreSubjects[key]) return;
    delete this.data.coreSubjects[key];
    this.notify('CORE_SUBJECT_DELETED', key);
  }

  addCoreTopic(subjectKey, topic) {
    const subject = this.data.coreSubjects?.[subjectKey];
    if (!subject) return;
    const newTopic = {
      id: 'top_' + Date.now(),
      title: 'New Topic',
      status: 'Not Started',
      confidence: 0,
      notes: '',
      ...topic
    };
    subject.topics = [...(subject.topics || []), newTopic];
    this.notify('CORE_TOPIC_ADDED', { subjectKey, newTopic });
    return newTopic;
  }

  deleteCoreTopic(subjectKey, topicId) {
    const subject = this.data.coreSubjects?.[subjectKey];
    if (!subject) return;
    subject.topics = (subject.topics || []).filter(t => t.id !== topicId);
    this.notify('CORE_TOPIC_DELETED', { subjectKey, topicId });
  }

  updateCoreTopic(subjectKey, topicId, updates) {
    const subject = this.data.coreSubjects?.[subjectKey];
    if (!subject) return;

    subject.topics = (subject.topics || []).map(t => {
      if (t.id === topicId) {
        return { ...t, ...updates, lastRevision: getTodayString() };
      }
      return t;
    });

    this.notify('CORE_TOPIC_UPDATED', { subjectKey, topicId });
  }

  // Resume ATS Skills
  updateResumeSkills(category, list) {
    if (!this.data.resumeSkills) this.data.resumeSkills = {};
    this.data.resumeSkills[category] = list;
    this.notify('RESUME_SKILLS_UPDATED', { category, list });
  }

  // Soft Skills
  updateSoftSkill(id, updates) {
    this.data.softSkills = (this.data.softSkills || []).map(sk =>
      sk.id === id ? { ...sk, ...updates, lastPractice: getTodayString() } : sk
    );
    this.notify('SOFT_SKILL_UPDATED', { id, updates });
  }

  // Certifications
  addCertification(cert) {
    const newCert = {
      id: 'cert_' + Date.now(),
      status: 'Planned',
      progressPct: 0,
      certificateEarned: false,
      ...cert
    };
    this.data.certifications = [newCert, ...(this.data.certifications || [])];
    this.notify('CERT_ADDED', newCert);
    return newCert;
  }

  updateCertification(id, updates) {
    this.data.certifications = (this.data.certifications || []).map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.notify('CERT_UPDATED', { id, updates });
  }

  deleteCertification(id) {
    this.data.certifications = (this.data.certifications || []).filter(c => c.id !== id);
    this.saveData();
    this.notify('CERT_DELETED', id);
  }

  clearCertifications() {
    this.data.certifications = [];
    this.saveData();
    this.notify('CERTS_CLEARED', []);
  }

  addProject(project) {
    const newProject = {
      id: 'proj_' + Date.now(),
      title: 'Untitled Project',
      description: '',
      techStack: [],
      githubUrl: '',
      demoUrl: '',
      milestones: [],
      ...project
    };
    this.data.projects = [newProject, ...(this.data.projects || [])];
    this.notify('PROJECT_ADDED', newProject);
    return newProject;
  }

  deleteProject(id) {
    this.data.projects = (this.data.projects || []).filter(p => p.id !== id);
    this.notify('PROJECT_DELETED', id);
  }

  updateProject(id, updates) {
    this.data.projects = (this.data.projects || []).map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.notify('PROJECT_UPDATED', { id, updates });
  }

  addProjectChallenge(projId, challenge) {
    this.data.projects = (this.data.projects || []).map(p => {
      if (p.id === projId) {
        const newCh = {
          id: 'ch_' + Date.now(),
          date: getTodayString(),
          ...challenge
        };
        return {
          ...p,
          challengesLog: [newCh, ...(p.challengesLog || [])]
        };
      }
      return p;
    });
    this.notify('CHALLENGE_ADDED', { projId });
  }

  // Companies
  updateCompany(id, updates) {
    this.data.companies = (this.data.companies || []).map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.notify('COMPANY_UPDATED', { id, updates });
  }

  addCompany(comp) {
    const newComp = {
      id: 'comp_' + Date.now(),
      priority: 'Target',
      dsaPrepStatus: 'In Progress',
      coreCsPrepStatus: 'Learning',
      aptitudePrepStatus: 'Preparing',
      tailoredResumeStatus: 'Preparing',
      applicationStatus: 'Preparing',
      ...comp
    };
    this.data.companies = [newComp, ...(this.data.companies || [])];
    this.notify('COMPANY_ADDED', newComp);
    return newComp;
  }

  // Job Applications
  addJobApplication(app) {
    const newApp = {
      id: 'app_' + Date.now(),
      appliedDate: getTodayString(),
      status: 'Applied',
      ...app
    };
    this.data.jobApplications = [newApp, ...(this.data.jobApplications || [])];
    this.notify('APPLICATION_ADDED', newApp);
    return newApp;
  }

  updateJobApplication(id, updates) {
    this.data.jobApplications = (this.data.jobApplications || []).map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    this.notify('APPLICATION_UPDATED', { id, updates });
  }

  deleteJobApplication(id) {
    this.data.jobApplications = (this.data.jobApplications || []).filter(a => a.id !== id);
    this.notify('APPLICATION_DELETED', id);
  }

  // Resumes & ATS Checklist
  toggleAtsItem(id) {
    this.data.atsChecklist = (this.data.atsChecklist || []).map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.notify('ATS_CHECKLIST_UPDATED', id);
  }

  // Mock Interviews
  addMockSession(session) {
    const newSession = {
      id: 'mock_' + Date.now(),
      date: getTodayString(),
      ...session
    };
    this.data.mockInterviews.sessions = [newSession, ...(this.data.mockInterviews.sessions || [])];
    this.notify('MOCK_SESSION_ADDED', newSession);
    return newSession;
  }

  // Revision Center
  addRevisionItem(item) {
    const newItem = {
      id: 'rev_' + Date.now(),
      scheduledDate: getTodayString(),
      reviewCount: 0,
      difficultyRating: 'Moderate',
      intervalDays: 1,
      ...item
    };
    this.data.revisionQueue = [newItem, ...(this.data.revisionQueue || [])];
    this.notify('REVISION_ITEM_ADDED', newItem);
    return newItem;
  }

  completeRevisionReview(id, difficulty) {
    const intervals = {
      Easy: 7,
      Moderate: 3,
      Difficult: 1
    };
    const daysToAdd = intervals[difficulty] || 3;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    this.data.revisionQueue = (this.data.revisionQueue || []).map(r => {
      if (r.id === id) {
        return {
          ...r,
          difficultyRating: difficulty,
          reviewCount: (r.reviewCount || 0) + 1,
          lastReviewed: getTodayString(),
          intervalDays: daysToAdd,
          scheduledDate: nextDateStr
        };
      }
      return r;
    });
    this.notify('REVISION_ITEM_REVIEWED', { id, difficulty });
  }

  addMistakeEntry(entry) {
    const newEntry = {
      id: 'mj_' + Date.now(),
      date: getTodayString(),
      ...entry
    };
    this.data.mistakeJournal = [newEntry, ...(this.data.mistakeJournal || [])];
    this.notify('MISTAKE_ADDED', newEntry);
    return newEntry;
  }

  // Weekly Reviews
  addWeeklyReview(review) {
    const newRev = {
      id: 'wrev_' + Date.now(),
      date: getTodayString(),
      ...review
    };
    this.data.weeklyReviews = [newRev, ...(this.data.weeklyReviews || [])];
    this.notify('WEEKLY_REVIEW_ADDED', newRev);
    return newRev;
  }

  deleteWeeklyReview(id) {
    this.data.weeklyReviews = (this.data.weeklyReviews || []).filter(r => r.id !== id);
    this.notify('WEEKLY_REVIEW_DELETED', id);
  }

  // --- EXPORT, IMPORT & RESET ---

  exportBackupJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importBackupJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON root format');
      }
      if (!parsed.settings || !Array.isArray(parsed.dsaProblems)) {
        throw new Error('Missing core placement preparation collections');
      }
      this.data = this.ensureSchema(parsed);
      this.saveData();
      this.notify('DATA_IMPORTED', this.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // --- COMPANY-WISE LEETCODE QUESTIONS TRACKING ---
  getCompanyQuestionProgress(companySlug) {
    const allProgress = this.data.companyQuestionProgress || {};
    return allProgress[companySlug] || {};
  }

  updateCompanyQuestionStatus(companySlug, questionId, statusUpdates) {
    if (!this.data.companyQuestionProgress) {
      this.data.companyQuestionProgress = {};
    }
    if (!this.data.companyQuestionProgress[companySlug]) {
      this.data.companyQuestionProgress[companySlug] = {};
    }
    const current = this.data.companyQuestionProgress[companySlug][questionId] || {
      status: 'Not Started',
      attempts: 0,
      dateSolved: null,
      timeSpentMinutes: 0,
      notes: '',
      revisionDate: null
    };

    const updated = {
      ...current,
      ...statusUpdates,
      lastUpdated: getTodayString()
    };

    if (statusUpdates.status === 'Solved' && !updated.dateSolved) {
      updated.dateSolved = getTodayString();
    }

    this.data.companyQuestionProgress[companySlug][questionId] = updated;

    if (statusUpdates.status === 'Needs Revision' && statusUpdates.revisionDate) {
      this.addToRevisionQueue({
        title: statusUpdates.title || `Problem #${questionId} (${companySlug})`,
        category: 'Company DSA Question',
        scheduledDate: statusUpdates.revisionDate,
        notes: statusUpdates.notes || `Company interview revision for ${companySlug}`
      });
    }

    this.saveData();
    this.notify('COMPANY_QUESTION_UPDATED', { companySlug, questionId, updated });
    return updated;
  }

  // --- TERM END (SEMESTER V) PREPARATION METHODS ---

  getTermEndPrep() {
    if (!this.data.termEndPrep) {
      this.data.termEndPrep = {
        completedExams: {},
        completedTopics: {},
        completedUnits: {},
        unitConfidence: {},
        subjectNotes: {},
        examTargetNotes: {}
      };
    }
    return this.data.termEndPrep;
  }

  toggleTermEndExamCompleted(subjectId) {
    const prep = this.getTermEndPrep();
    prep.completedExams = prep.completedExams || {};
    prep.completedExams[subjectId] = !prep.completedExams[subjectId];
    this.saveData();
    this.notify('TERM_END_EXAM_TOGGLED', { subjectId, completed: prep.completedExams[subjectId] });
    return prep.completedExams[subjectId];
  }

  toggleTermEndTopic(topicKey) {
    const prep = this.getTermEndPrep();
    prep.completedTopics = prep.completedTopics || {};
    prep.completedTopics[topicKey] = !prep.completedTopics[topicKey];
    this.saveData();
    this.notify('TERM_END_TOPIC_TOGGLED', { topicKey, completed: prep.completedTopics[topicKey] });
    return prep.completedTopics[topicKey];
  }

  toggleTermEndUnit(unitId, topicKeys = [], forceState = null) {
    const prep = this.getTermEndPrep();
    prep.completedUnits = prep.completedUnits || {};
    prep.completedTopics = prep.completedTopics || {};

    const newState = forceState !== null ? forceState : !prep.completedUnits[unitId];
    prep.completedUnits[unitId] = newState;

    topicKeys.forEach(tKey => {
      prep.completedTopics[tKey] = newState;
    });

    this.saveData();
    this.notify('TERM_END_UNIT_TOGGLED', { unitId, completed: newState });
    return newState;
  }

  setTermEndUnitConfidence(unitId, level) {
    const prep = this.getTermEndPrep();
    prep.unitConfidence = prep.unitConfidence || {};
    prep.unitConfidence[unitId] = level;
    this.saveData();
    this.notify('TERM_END_UNIT_CONFIDENCE', { unitId, level });
    return level;
  }

  updateTermEndSubjectNotes(subjectId, notes) {
    const prep = this.getTermEndPrep();
    prep.subjectNotes = prep.subjectNotes || {};
    prep.subjectNotes[subjectId] = notes;
    this.saveData();
    this.notify('TERM_END_NOTES_UPDATED', { subjectId, notes });
    return notes;
  }

  resetTermEndSubject(subjectId, topicKeys = [], unitIds = []) {
    const prep = this.getTermEndPrep();
    prep.completedExams = prep.completedExams || {};
    prep.completedTopics = prep.completedTopics || {};
    prep.completedUnits = prep.completedUnits || {};

    prep.completedExams[subjectId] = false;
    unitIds.forEach(uId => { prep.completedUnits[uId] = false; });
    topicKeys.forEach(tKey => { prep.completedTopics[tKey] = false; });

    this.saveData();
    this.notify('TERM_END_SUBJECT_RESET', { subjectId });
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
    this.data = getDefaultData();
    this.saveData();
    this.notify('DATA_RESET', this.data);
  }
}

export const placementStore = new PlacementStore();
export default placementStore;

import { DEFAULT_ROADMAP_WEEKS } from './roadmapData.js';

export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultData() {
  const todayStr = getTodayString();

  return {
    version: 6,
    createdAt: new Date().toISOString(),
    settings: {
      studentName: 'Nandini',
      targetRole: 'Software Development Engineer (SDE)',
      targetDeadline: '2026-12-31',
      dailyTargetMinutes: 120,
      weeklyHoursGoal: 14,
      dsaTarget: 80,
      theme: 'light',
      soundEnabled: true,
      college: 'B.Tech Computer Science & Engineering',
      gradYear: '2026',
      cgpa: '8.8 / 10.0',
      targetPackage: '18–35 LPA',
      bio: 'Aspiring Software Development Engineer (SDE). Focused on Data Structures, Algorithms, Core CS Fundamentals, and Full-Stack Systems.',
      profilePic: '',
      email: 'nandini.tech@gmail.com',
      emailNotifications: true,
      notifyDailyTasks: true,
      notifyCertifications: true,
      notifyPractice: true,
      notifyCompanies: true,
      readinessWeights: {
        dsa: 25,
        coreCs: 20,
        projects: 20,
        aptitude: 15,
        softSkills: 10,
        certs: 10
      }
    },

    // Dynamic Resume ATS Skills
    resumeSkills: {
      languages: ['Java', 'C++', 'Python', 'JavaScript', 'SQL'],
      frameworks: ['React', 'Node.js', 'Express', 'Spring Boot', 'Tailwind CSS'],
      coreCs: ['Operating Systems', 'DBMS', 'Computer Networks', 'OOPs', 'System Design'],
      tools: ['Git', 'GitHub', 'VS Code', 'Postman', 'Docker', 'Vercel', 'Render'],
      softSkills: ['STAR Framework', 'Active Listening', 'Technical Explanation', 'Team Collaboration']
    },

    // Striver's A2Z DSA Sheet Progress
    striversProgress: {},

    // R.S. Aggarwal Aptitude Progress
    aptitudeChapterProgress: {},

    // 1. Daily Planner & Habits (All uncompleted, ready for student)
    dailyTasks: [
      {
        id: 'task_init_1',
        date: todayStr,
        text: "Practice 2 Medium Array problems on LeetCode (Kadane's & Two Pointers)",
        category: 'Java and DSA',
        priority: 'High',
        plannedMinutes: 45,
        actualMinutes: 0,
        startTime: '09:00',
        dueTime: '10:30',
        completed: false,
        notes: 'Trace edge cases on paper before coding',
        subtasks: [
          { id: 'st1', text: 'Maximum Subarray sum', done: false },
          { id: 'st2', text: 'Two Sum II (sorted array)', done: false }
        ]
      },
      {
        id: 'task_init_2',
        date: todayStr,
        text: 'Review DBMS ACID properties & write real transaction examples',
        category: 'Core computer science',
        priority: 'High',
        plannedMinutes: 30,
        actualMinutes: 0,
        startTime: '11:00',
        dueTime: '11:45',
        completed: false,
        notes: 'Focus on Atomicity and Isolation levels in MySQL'
      },
      {
        id: 'task_init_3',
        date: todayStr,
        text: 'Speed drill on Time, Speed & Distance shortcuts',
        category: 'Aptitude and reasoning',
        priority: 'Medium',
        plannedMinutes: 25,
        actualMinutes: 0,
        startTime: '15:30',
        dueTime: '16:00',
        completed: false,
        notes: 'Target 15 questions in 25 mins'
      },
      {
        id: 'task_init_4',
        date: todayStr,
        text: '2-Minute Self-Introduction practice aloud (Mock HR)',
        category: 'Soft skills',
        priority: 'Medium',
        plannedMinutes: 20,
        actualMinutes: 0,
        startTime: '18:00',
        dueTime: '18:30',
        completed: false,
        notes: 'Record and self-evaluate pace and clarity'
      }
    ],

    recurringHabits: [
      { id: 'h1', text: 'Solve 1 DSA Problem Daily', category: 'Java and DSA', streak: 0, lastDone: null },
      { id: 'h2', text: '20-min Aptitude Speed Practice', category: 'Aptitude and reasoning', streak: 0, lastDone: null },
      { id: 'h3', text: 'Revise 1 Core CS Concept', category: 'Core computer science', streak: 0, lastDone: null },
      { id: 'h4', text: 'Speak 2 Minutes Aloud on Tech Topic', category: 'Soft skills', streak: 0, lastDone: null }
    ],

    dailyReflections: {},

    // 2. Study Timer Sessions (Fresh: 0 sessions)
    timerSessions: [],

    // 3. User-defined Placement Roadmap (Empty by default for user customization)
    roadmap: [],

    // 4. DSA Tracker (Curriculum preserved, 0 questions solved)
    dsaProblems: [
      {
        id: 'dsa_1',
        title: 'Two Sum',
        topic: 'Arrays',
        difficulty: 'Easy',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/two-sum/',
        status: 'Not Started',
        attempts: 0,
        dateSolved: null,
        timeTakenMinutes: null,
        approach: '',
        timeComplexity: '',
        spaceComplexity: '',
        notes: '',
        needsRevision: false,
        revisionSchedule: null
      },
      {
        id: 'dsa_2',
        title: 'Maximum Subarray (Kadane’s Algorithm)',
        topic: 'Arrays',
        difficulty: 'Medium',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/maximum-subarray/',
        status: 'Not Started',
        attempts: 0,
        dateSolved: null,
        timeTakenMinutes: null,
        approach: '',
        timeComplexity: '',
        spaceComplexity: '',
        notes: '',
        needsRevision: false,
        revisionSchedule: null
      },
      {
        id: 'dsa_3',
        title: 'Valid Palindrome',
        topic: 'Strings',
        difficulty: 'Easy',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/valid-palindrome/',
        status: 'Not Started',
        attempts: 0,
        dateSolved: null,
        timeTakenMinutes: null,
        approach: '',
        timeComplexity: '',
        spaceComplexity: '',
        notes: '',
        needsRevision: false,
        revisionSchedule: null
      },
      {
        id: 'dsa_4',
        title: 'Longest Substring Without Repeating Characters',
        topic: 'Sliding Window',
        difficulty: 'Medium',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        status: 'Not Started',
        attempts: 0,
        dateSolved: null,
        timeTakenMinutes: null,
        approach: '',
        timeComplexity: '',
        spaceComplexity: '',
        notes: '',
        needsRevision: false,
        revisionSchedule: null
      },
      {
        id: 'dsa_5',
        title: 'Reverse Linked List',
        topic: 'Linked Lists',
        difficulty: 'Easy',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        status: 'Not Started',
        attempts: 0,
        dateSolved: null,
        timeTakenMinutes: null,
        approach: '',
        timeComplexity: '',
        spaceComplexity: '',
        notes: '',
        needsRevision: false,
        revisionSchedule: null
      }
    ],

    // 5. Aptitude Tracker (9 topics preserved, 0 questions attempted)
    aptitudeCategories: [
      { id: 'apt_pct', name: 'Percentages', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_ratio', name: 'Ratios and averages', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_pl', name: 'Profit and loss', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_tw', name: 'Time and work', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_tsd', name: 'Time, speed and distance', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_prob', name: 'Probability', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_lr', name: 'Logical reasoning', domain: 'Reasoning', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_va', name: 'Verbal ability', domain: 'Verbal', questionsAttempted: 0, questionsCorrect: 0 },
      { id: 'apt_di', name: 'Data interpretation', domain: 'Quantitative', questionsAttempted: 0, questionsCorrect: 0 }
    ],

    aptitudeSessions: [],

    // 6. Core Computer Science Subjects (16 topics preserved, 0% completed)
    coreSubjects: {
      'Java/OOP': {
        name: 'Java and OOP',
        topics: [
          {
            id: 'oop_1',
            title: '4 Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://docs.oracle.com/javase/tutorial/java/concepts/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'oop_2',
            title: 'Abstract Classes vs Interfaces & Default Methods (Java 8)',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.baeldung.com/java-interface-default-methods',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'oop_3',
            title: 'Exception Handling: Checked vs Unchecked & try-with-resources',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.baeldung.com/java-exceptions',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'oop_4',
            title: 'Java Memory Model: Stack vs Heap & Garbage Collection (Mark-Sweep)',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.baeldung.com/java-stack-heap',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          }
        ]
      },
      'DBMS': {
        name: 'DBMS and SQL',
        topics: [
          {
            id: 'db_1',
            title: 'ACID Properties and Transaction Isolation Levels',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'db_2',
            title: 'Database Normalization (1NF, 2NF, 3NF, BCNF) with Anomalies',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/database-normalization-introduction/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'db_3',
            title: 'SQL Joins, Aggregations, GROUP BY, HAVING, and Subqueries',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.w3schools.com/sql/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'db_4',
            title: 'Indexing: B-Trees, B+ Trees, Clustered vs Non-Clustered Indexes',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://use-the-index-luke.com/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          }
        ]
      },
      'OS': {
        name: 'Operating Systems',
        topics: [
          {
            id: 'os_1',
            title: 'Process vs Thread, PCB, and Context Switching Overhead',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/difference-between-process-and-thread/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'os_2',
            title: 'CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'os_3',
            title: 'Deadlock 4 Coffman Conditions, Prevention, and Bankers Algorithm',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/deadlock-in-operating-system/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'os_4',
            title: 'Virtual Memory, Paging, Page Faults, and LRU Replacement',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          }
        ]
      },
      'CN': {
        name: 'Computer Networks',
        topics: [
          {
            id: 'cn_1',
            title: 'OSI 7 Layers vs TCP/IP 4 Layers Architecture & Responsibilities',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/layers-of-osi-model/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'cn_2',
            title: 'TCP vs UDP: 3-Way Handshake, Flow Control, and Congestion Control',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/tcp-3-way-handshake-process/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'cn_3',
            title: 'DNS Resolution, HTTP vs HTTPS (TLS/SSL Handshake), and Cookies vs Sessions',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          },
          {
            id: 'cn_4',
            title: 'IP Addressing, Subnetting (CIDR), NAT, and Routing Protocols',
            status: 'Not Started',
            confidence: 0,
            notes: '',
            resource: 'https://www.geeksforgeeks.org/ip-addressing-introduction/',
            lastRevision: null,
            nextRevision: null,
            interviewReadyAssessed: false
          }
        ]
      }
    },

    // 7. Soft Skills (10 checklist categories, initialized as Not Started, confidence 0)
    softSkills: [
      { id: 'sk_comm', category: 'Communication', title: 'Communication', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_intro', category: 'Self-introduction', title: 'Self-introduction', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_tech', category: 'Technical explanation', title: 'Technical explanation', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_team', category: 'Teamwork', title: 'Teamwork', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_lead', category: 'Leadership', title: 'Leadership', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_prob', category: 'Problem-solving', title: 'Problem-solving', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_time', category: 'Time management', title: 'Time management', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_email', category: 'Professional email writing', title: 'Professional email writing', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_pres', category: 'Presentation skills', title: 'Presentation skills', status: 'Not Started', confidence: 0, notes: '', lastPractice: null },
      { id: 'sk_behav', category: 'Behavioral interviews', title: 'Behavioral interviews', status: 'Not Started', confidence: 0, notes: '', lastPractice: null }
    ],

    speakingChallenges: [
      {
        id: 'spk_1',
        topic: 'Explain how HashMap works internally in Java',
        durationSeconds: 120,
        completed: false,
        notes: ''
      }
    ],

    // 8. User Courses & Certifications (Empty by default for user customization)
    certifications: [],

    // 9. Project Portfolio (FindIt preserved, 0 milestones completed)
    projects: [
      {
        id: 'proj_findit',
        title: 'FindIt — Lost and Found Portal',
        description: 'A full-stack campus Lost and Found management system with authenticated claims, image uploads, category search, and notification alerts.',
        role: 'Full Stack Developer',
        technologies: ['React', 'Node.js', 'Express', 'MySQL', 'JWT', 'Multer'],
        githubUrl: 'https://github.com/nandini/findit-lost-and-found',
        demoUrl: '',
        startDate: '2026-09-15',
        targetDate: '2026-11-30',
        milestones: [
          { id: 'm1', title: '1. Requirements & User Stories', status: 'Planned', notes: 'Define student, admin and finder personas' },
          { id: 'm2', title: '2. UI Design & Wireframes', status: 'Planned', notes: 'Figma wireframes for item feed and claim modal' },
          { id: 'm3', title: '3. Database Schema & ER Diagram', status: 'Planned', notes: 'Users, Items, Categories, Claims tables' },
          { id: 'm4', title: '4. Frontend Components & Routing', status: 'Planned', notes: 'Navbar, item cards, upload form' },
          { id: 'm5', title: '5. Backend REST APIs', status: 'Planned', notes: 'Auth, CRUD items, claim submission endpoints' },
          { id: 'm6', title: '6. Database Integration & ORM', status: 'Planned', notes: 'Connection pooling and transaction management' },
          { id: 'm7', title: '7. Search & Multi-Filter Queries', status: 'Planned', notes: 'Filtering by date, location, category' },
          { id: 'm8', title: '8. Validation & Error Handling', status: 'Planned', notes: 'Sanitizing inputs, Joi validation schema' },
          { id: 'm9', title: '9. Unit & Integration Testing', status: 'Planned', notes: 'Jest test suites for core API endpoints' },
          { id: 'm10', title: '10. Deployment (Vercel / Render)', status: 'Planned', notes: 'Environment variables and production build' },
          { id: 'm11', title: '11. Comprehensive README & Docs', status: 'Planned', notes: 'Architecture diagram and API documentation' },
          { id: 'm12', title: '12. Technical Interview Walkthrough', status: 'Planned', notes: '3-minute pitch, concurrency trade-offs, edge cases' }
        ],
        interviewChecklist: [
          { id: 'ic1', topic: 'Architecture & Tech Stack Rationale', checked: false, details: 'Why React + Node.js vs traditional MVC' },
          { id: 'ic2', topic: 'Database Schema & Foreign Key Constraints', checked: false, details: 'Normalized up to 3NF; indexing item_date and category_id' },
          { id: 'ic3', topic: 'Authentication & Authorization', checked: false, details: 'JWT stored in HTTP-only cookies vs LocalStorage' },
          { id: 'ic4', topic: 'Handling Concurrency on Claims', checked: false, details: 'Database transactions with row-level locks on claim confirmation' },
          { id: 'ic5', topic: 'File Upload Storage & Security', checked: false, details: 'Multer disk storage vs cloud bucket (AWS S3) trade-offs' },
          { id: 'ic6', topic: 'Toughest Bug Encountered & Resolution', checked: false, details: 'Asynchronous state desync during multi-image uploads' }
        ],
        challengesLog: []
      }
    ],

    // 10. Target Companies (10 company profiles preserved, 0% prepared)
    companies: [
      {
        id: 'comp_google',
        name: 'Google',
        tier: 'Aspirational (Product)',
        priority: 'Dream',
        careersUrl: 'https://careers.google.com/',
        targetRole: 'Software Engineer, University Graduate',
        eligibilityCriteria: 'B.Tech CS/IT with strong CS fundamentals; no active backlogs.',
        requiredSkills: ['Data Structures & Algorithms', 'System Design Basics', 'Clean Code in Java/C++', 'Time & Space Optimization'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'Online Assessment (2 coding questions) ➔ 3-4 Technical Coding & Problem Solving Rounds ➔ Googliness & Leadership',
        notes: 'Focus on graphs, dynamic programming, and articulating thought process out loud.'
      },
      {
        id: 'comp_amazon',
        name: 'Amazon',
        tier: 'Aspirational (Product)',
        priority: 'Dream',
        careersUrl: 'https://www.amazon.jobs/',
        targetRole: 'Software Development Engineer (SDE-1)',
        eligibilityCriteria: 'B.Tech Computer Engineering, 6.5+ CGPA or 65% equivalent.',
        requiredSkills: ['DSA (Trees, Graphs, DP)', '16 Leadership Principles (STAR)', 'OOP Design', 'DBMS & OS'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'Online Assessment (Debugging + 2 Coding + Work Style Simulation) ➔ 3 Technical & LP Rounds',
        notes: 'Prepare 2 solid STAR behavioral examples for each major Leadership Principle.'
      },
      {
        id: 'comp_jpmc',
        name: 'JPMorganChase',
        tier: 'Aspirational (FinTech)',
        priority: 'Dream',
        careersUrl: 'https://careers.jpmorgan.com/',
        targetRole: 'Software Engineer Analyst',
        eligibilityCriteria: 'B.Tech CSE/IT, 7.0+ CGPA, no standing backlogs.',
        requiredSkills: ['Java Core & OOP', 'SQL & Databases', 'Data Structures', 'Code for Good Hackathon'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'HireVue Coding & Video Assessment ➔ Code for Good Hackathon / Superday Technical Interviews',
        notes: 'High emphasis on clean Java code, relational database queries, and teamwork.'
      },
      {
        id: 'comp_msft',
        name: 'Microsoft',
        tier: 'Aspirational (Product)',
        priority: 'Dream',
        careersUrl: 'https://careers.microsoft.com/',
        targetRole: 'Software Engineer',
        eligibilityCriteria: 'B.Tech CSE/IT, 7.0+ CGPA, zero backlogs.',
        requiredSkills: ['DSA', 'Data Structures (Trees, Linked Lists, Graphs)', 'OS Concepts (Concurrency)', 'OOP'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'Codility OA (3 questions) ➔ 3-4 Rounds of Problem Solving, Design & Behavioral',
        notes: 'Write modular, testable code with clean variable naming.'
      },
      {
        id: 'comp_tcs',
        name: 'TCS (Digital / Prime)',
        tier: 'Core (IT Services)',
        priority: 'Target',
        careersUrl: 'https://www.tcs.com/careers',
        targetRole: 'System Engineer / Digital Cadre',
        eligibilityCriteria: '60% or 6.0 CGPA throughout 10th, 12th, and B.Tech. Up to 1 active backlog permitted in some drives.',
        requiredSkills: ['Aptitude & Logical Reasoning', 'Basic DSA (Arrays, Strings)', 'SQL Queries', 'OOP Basics'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'TCS NQT (Foundation + Advanced Section) ➔ Technical Interview ➔ HR / MR Interview',
        notes: 'NQT Advanced section score determines Digital (7 LPA) vs Ninja (3.5 LPA) cadre.'
      },
      {
        id: 'comp_infosys',
        name: 'Infosys (Specialist Programmer / DSE)',
        tier: 'Core (IT Services)',
        priority: 'Target',
        careersUrl: 'https://www.infosys.com/careers/',
        targetRole: 'Specialist Programmer (SP) / Digital Specialist (DSE)',
        eligibilityCriteria: '60% or 6.0 CGPA in graduation; eligible branches CS/IT/circuital.',
        requiredSkills: ['HackWithInfy Coding (Medium-Hard DSA)', 'Core CS Fundamentals', 'DBMS & SQL'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'HackWithInfy / InfyTQ / Campus OA (3 coding questions) ➔ Technical & HR Interview',
        notes: 'Solving 2 out of 3 questions in HackWithInfy qualifies for the Specialist Programmer (9.5 LPA) interview.'
      },
      {
        id: 'comp_accenture',
        name: 'Accenture',
        tier: 'Core (IT Services)',
        priority: 'Target',
        careersUrl: 'https://www.accenture.com/in-en/careers',
        targetRole: 'Advanced Associate Software Engineer (AASE)',
        eligibilityCriteria: '65% or 6.5 CGPA in B.Tech; no active backlogs.',
        requiredSkills: ['Cognitive Assessment', 'Technical Assessment (Pseudo Code, Cloud, Network Security)', 'Coding (2 problems)'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'Cognitive & Technical Assessment ➔ Coding Assessment ➔ Communication Assessment ➔ Interview',
        notes: 'Pseudo-code dry run section is key to clearing AASE (6.5 LPA) threshold.'
      },
      {
        id: 'comp_cognizant',
        name: 'Cognizant',
        tier: 'Core (IT Services)',
        priority: 'Target',
        careersUrl: 'https://careers.cognizant.com/',
        targetRole: 'GenC Next / GenC Elevate',
        eligibilityCriteria: '60% throughout academics; CS/IT preferred.',
        requiredSkills: ['Advanced Coding', 'Data Structures', 'Web Development / Java Fullstack', 'SQL'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'GenC Assessment ➔ Technical Interview ➔ HR Interview',
        notes: 'GenC Next (6.75 LPA) requires strong problem solving and project explanation.'
      },
      {
        id: 'comp_capgemini',
        name: 'Capgemini',
        tier: 'Core (IT Services)',
        priority: 'Target',
        careersUrl: 'https://www.capgemini.com/careers/',
        targetRole: 'Senior Analyst / Analyst',
        eligibilityCriteria: '60% or 6.0 CGPA in diploma / 10th / 12th / B.Tech.',
        requiredSkills: ['Pseudocode & Game-based Aptitude', 'Behavioral Profiling', 'Technical Coding (2 questions)'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'Pseudocode ➔ English Communication ➔ Game-based Aptitude ➔ Coding ➔ Technical & HR Interview',
        notes: 'Speed and accuracy in pseudocode output prediction is critical.'
      },
      {
        id: 'comp_wipro',
        name: 'Wipro',
        tier: 'Core (IT Services)',
        priority: 'Target',
        careersUrl: 'https://careers.wipro.com/',
        targetRole: 'Project Engineer (Elite / Turbo)',
        eligibilityCriteria: '60% or 6.0 CGPA; maximum 1 active backlog allowed at time of test.',
        requiredSkills: ['Quantitative & Logical Aptitude', 'Written Communication (Essay)', 'Coding (2 questions)'],
        dsaPrepStatus: 'Not Started',
        coreCsPrepStatus: 'Not Started',
        aptitudePrepStatus: 'Not Started',
        tailoredResumeStatus: 'Not Started',
        applicationStatus: 'Not Applied',
        assessmentDate: null,
        interviewRounds: 'National Talent Hunt (NTH OA) ➔ Technical Interview ➔ HR Interview',
        notes: 'Turbo upgrade test offered to top performers in onboarding.'
      }
    ],

    // 11. Resume & Applications Pipeline (Fresh: 0 ATS checks, 0 applications)
    resumes: [
      {
        id: 'res_general',
        title: 'General SDE Resume (Freshers)',
        version: 'v1.0',
        targetProfile: 'Full-Stack / SDE Freshers',
        lastUpdated: todayStr,
        skillsSummary: 'Java, Python, C++, Data Structures, Algorithms, MySQL, React, Node.js, Git',
        atsScore: 0,
        notes: 'Tailored for general SDE campus openings.'
      },
      {
        id: 'res_java',
        title: 'Java Backend Specialist Resume',
        version: 'v1.0',
        targetProfile: 'Java / Enterprise Backend Roles',
        lastUpdated: todayStr,
        skillsSummary: 'Core Java, OOP, Collections, Multi-threading basics, SQL, JDBC, Spring Boot basics, REST',
        atsScore: 0,
        notes: 'Emphasizes OOP design patterns, ACID properties, and relational schema normalization.'
      }
    ],

    atsChecklist: [
      { id: 'ats1', text: 'Clean single-column standard layout (No tables, graphics or columns that confuse parsers)', checked: false },
      { id: 'ats2', text: 'Clear section headers: Education, Technical Skills, Projects, Certifications, Achievements', checked: false },
      { id: 'ats3', text: 'Action verbs start every bullet point (Engineered, Architected, Designed, Implemented)', checked: false },
      { id: 'ats4', text: 'Quantified metrics included (e.g. "reduced latency by 25%", "8 normalized tables")', checked: false },
      { id: 'ats5', text: 'Keywords match job description (Java, Data Structures, OOP, SQL, REST APIs)', checked: false },
      { id: 'ats6', text: 'Live links provided for GitHub profile, LinkedIn, and deployed project demo', checked: false },
      { id: 'ats7', text: 'Standard contact details: Name, Phone, Professional Email, City, LinkedIn URL', checked: false },
      { id: 'ats8', text: 'No spelling, syntax, or grammatical errors', checked: false },
      { id: 'ats9', text: 'Projects list technologies used explicitly in subtitle or tags', checked: false },
      { id: 'ats10', text: 'Education specifies degree, college name, branch, expected grad year, CGPA', checked: false },
      { id: 'ats11', text: 'File saved and submitted as standard search-searchable PDF (not scanned image)', checked: false },
      { id: 'ats12', text: 'Length strictly 1 page for undergraduate campus placement applications', checked: false }
    ],

    jobApplications: [],

    // 12. Mock Interview Studio (Question bank preserved, 0 completed sessions)
    mockInterviews: {
      questionBank: [
        {
          id: 'mq_1',
          category: 'Technical - Java & OOP',
          question: 'What is the difference between an abstract class and an interface? When would you prefer one over the other in Java?',
          expectedKeyPoints: ['Abstract classes can have state and constructors', 'Interfaces provide multiple inheritance of type', 'Java 8 default methods', 'Is-A vs Can-Do relationship']
        },
        {
          id: 'mq_2',
          category: 'Technical - DBMS & SQL',
          question: 'Explain ACID properties with a concrete banking transaction example. What happens if Isolation is violated?',
          expectedKeyPoints: ['Atomicity: all or nothing', 'Consistency: valid database state', 'Isolation: concurrent transactions do not interfere', 'Durability: committed data persists', 'Dirty reads and phantom reads']
        },
        {
          id: 'mq_3',
          category: 'Technical - OS & Concurrency',
          question: 'What is the difference between a process and a thread? Why are threads called lightweight processes?',
          expectedKeyPoints: ['Processes have separate address spaces', 'Threads share heap, code, data but have private stack', 'Context switching overhead is lower for threads']
        },
        {
          id: 'mq_4',
          category: 'Technical - DSA',
          question: 'How does a HashMap work internally in Java? How are hash collisions resolved in Java 8+?',
          expectedKeyPoints: ['Array of buckets (Node<K,V>)', 'hashCode() and equals() contract', 'Separate chaining with linked lists', 'Treeification to Red-Black tree when bucket size >= 8']
        },
        {
          id: 'mq_5',
          category: 'HR - Behavioral',
          question: 'Tell me about yourself. (2-Minute Executive Introduction)',
          expectedKeyPoints: ['Current 3rd-year student status & specialization', 'Core technical strengths in Java, DSA & Fullstack', 'Flagship FindIt project highlight', 'Why eager to contribute to this company']
        },
        {
          id: 'mq_6',
          category: 'HR - STAR Behavioral',
          question: 'Describe a situation where you faced a tough technical roadblock or disagreement in a team project. How did you handle it?',
          expectedKeyPoints: ['Situation: project context', 'Task: your specific objective', 'Action: how you investigated, compromised or resolved it factually', 'Result: project delivered successfully and key learning']
        }
      ],
      sessions: []
    },

    // 13. Revision Center / Spaced Revision System (Fresh: 0 pending items)
    revisionQueue: [],

    mistakeJournal: [],

    // 14. Weekly Reflections History (Fresh: 0 entries)
    weeklyReviews: [],

    // 15. Company-wise LeetCode Questions Progress (Personal user practice records)
    companyQuestionProgress: {},

    // 16. Term End (Semester V) Examination Prep & Timetable
    termEndPrep: {
      completedExams: {},
      completedTopics: {},
      completedUnits: {},
      unitConfidence: {},
      subjectNotes: {},
      examTargetNotes: {}
    }
  };
}

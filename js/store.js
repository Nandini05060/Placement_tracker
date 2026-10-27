/**
 * Central State Store & Persistence Manager
 * Professional Placement Journey Dashboard for Nandini
 */

const STORAGE_KEY = 'nandini_placement_journey_v2';

class NandiniPlacementStore {
  constructor() {
    this.listeners = [];
    this.data = this.loadData();
    this.ensureSchema();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(changeType, payload) {
    this.saveData();
    this.listeners.forEach(cb => {
      try {
        cb(changeType, payload);
      } catch (e) {
        console.error('Store listener error:', e);
      }
    });
  }

  getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDefaultData() {
    const todayStr = this.getTodayString();

    return {
      version: 2,
      createdAt: new Date().toISOString(),
      settings: {
        userName: 'Nandini',
        theme: 'light', // 'light' or 'dark'
        soundEnabled: true,
        dailyTargetMinutes: 120, // 2 hours
        dsaTarget: 80,
        targetDeadline: '2026-12-31', // configurable deadline date
        currentWeek: 1,
        targetRole: 'Software Development Engineer (SDE)',
        readinessWeights: {
          dsa: 25,
          coreCs: 20,
          projects: 20,
          aptitude: 15,
          softSkills: 10,
          certs: 10
        }
      },
      dailyTasks: [
        {
          id: 'task_init_1',
          date: todayStr,
          text: 'Practice 2 Medium Array problems on LeetCode (Kadane & Two Pointers)',
          priority: 'High',
          category: 'Programming and DSA',
          startTime: '09:00',
          dueTime: '10:30',
          completed: false,
          completedAt: null
        },
        {
          id: 'task_init_2',
          date: todayStr,
          text: 'Review DBMS ACID properties and write real-world transaction examples',
          priority: 'High',
          category: 'Core Computer Science',
          startTime: '11:00',
          dueTime: '12:00',
          completed: false,
          completedAt: null
        },
        {
          id: 'task_init_3',
          date: todayStr,
          text: 'Complete 15-minute speed drill on Time, Speed & Distance shortcuts',
          priority: 'Medium',
          category: 'Aptitude and reasoning',
          startTime: '16:00',
          dueTime: '16:30',
          completed: false,
          completedAt: null
        },
        {
          id: 'task_init_4',
          date: todayStr,
          text: 'Practice 2-minute verbal self-introduction out loud without filler words',
          priority: 'Medium',
          category: 'Soft skills and communication',
          startTime: '17:30',
          dueTime: '18:00',
          completed: false,
          completedAt: null
        }
      ],
      dailyReflections: {
        [todayStr]: {
          whatWentWell: '',
          tomorrowFocus: '',
          plannedMinutes: 120,
          studiedMinutes: 0,
          mood: 'Focused & Energetic'
        }
      },
      timerSessions: [],
      roadmap: (window.DEFAULT_ROADMAP_WEEKS || []).map(w => JSON.parse(JSON.stringify(w))),
      dsaProblems: [
        {
          id: 'dsa_1',
          title: 'Two Sum',
          topic: 'Arrays',
          subtopic: 'Hash Map Lookup',
          difficulty: 'Easy',
          platform: 'LeetCode',
          url: 'https://leetcode.com/problems/two-sum/',
          status: 'Not Started',
          attempts: 0,
          dateSolved: null,
          timeTakenMinutes: 15,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          approach: 'Single-pass Hash Map storing complement indices.',
          notes: 'Handle duplicate values correctly. Target - current element lookup in constant time.',
          needsRevision: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'dsa_2',
          title: 'Valid Palindrome',
          topic: 'Strings',
          subtopic: 'Two Pointers',
          difficulty: 'Easy',
          platform: 'LeetCode',
          url: 'https://leetcode.com/problems/valid-palindrome/',
          status: 'Not Started',
          attempts: 0,
          dateSolved: null,
          timeTakenMinutes: 12,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          approach: 'Bidirectional two pointers inward scan ignoring non-alphanumeric chars.',
          notes: 'Use Character.isLetterOrDigit() and Character.toLowerCase() to handle case insensitivity.',
          needsRevision: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'dsa_3',
          title: 'Maximum Subarray (Kadane)',
          topic: 'Arrays',
          subtopic: 'Dynamic Programming',
          difficulty: 'Medium',
          platform: 'LeetCode',
          url: 'https://leetcode.com/problems/maximum-subarray/',
          status: 'Not Started',
          attempts: 0,
          dateSolved: null,
          timeTakenMinutes: 25,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          approach: 'Kadane algorithm: currMax = max(nums[i], currMax + nums[i]).',
          notes: 'Pay attention to all-negative array inputs where maximum single element must be returned.',
          needsRevision: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'dsa_4',
          title: 'Valid Parentheses',
          topic: 'Stacks',
          subtopic: 'LIFO Matching',
          difficulty: 'Easy',
          platform: 'LeetCode',
          url: 'https://leetcode.com/problems/valid-parentheses/',
          status: 'Not Started',
          attempts: 0,
          dateSolved: null,
          timeTakenMinutes: 15,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(N)',
          approach: 'Push expected matching closing bracket on opening token; pop and compare on closing.',
          notes: 'Check stack emptiness at end of traversal for unbalanced opening brackets.',
          needsRevision: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'dsa_5',
          title: 'Reverse Linked List',
          topic: 'Linked Lists',
          subtopic: 'Pointer Inversion',
          difficulty: 'Easy',
          platform: 'LeetCode',
          url: 'https://leetcode.com/problems/reverse-linked-list/',
          status: 'Not Started',
          attempts: 0,
          dateSolved: null,
          timeTakenMinutes: 18,
          timeComplexity: 'O(N)',
          spaceComplexity: 'O(1)',
          approach: 'Three-pointer iterative approach: prev, curr, nextNode.',
          notes: 'Always preserve nextNode before overriding curr.next to avoid losing rest of the list.',
          needsRevision: false,
          createdAt: new Date().toISOString()
        }
      ],
      aptitudeSessions: [],
      coreSubjects: {
        java_oop: {
          id: 'java_oop',
          name: 'Java & OOP',
          topics: [
            { id: 'j_1', title: 'Classes, Objects & Reference Variables', status: 'Not Started', confidence: 3, notes: '', resources: 'Oracle Docs', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_2', title: 'Constructors, "this" and "super" keyword semantics', status: 'Not Started', confidence: 3, notes: '', resources: 'Baeldung', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_3', title: 'The 4 Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism)', status: 'Not Started', confidence: 4, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_4', title: 'Method Overloading vs Overriding & Dynamic Method Dispatch', status: 'Not Started', confidence: 4, notes: '', resources: 'JavaTpoint', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_5', title: 'Interfaces vs Abstract Classes & Multiple Inheritance', status: 'Not Started', confidence: 3, notes: '', resources: 'Baeldung', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_6', title: 'String Pool, Immutability & StringBuilder vs StringBuffer', status: 'Not Started', confidence: 4, notes: '', resources: 'Baeldung', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_7', title: 'Exception Hierarchy (Checked vs Unchecked) & try-with-resources', status: 'Not Started', confidence: 3, notes: '', resources: 'Oracle Docs', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_8', title: 'Java Collections Framework (List, Set, Map, Queue internals)', status: 'Not Started', confidence: 3, notes: '', resources: 'Baeldung Collections', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'j_9', title: 'JVM Architecture: ClassLoader, Heap, Stack & Garbage Collection', status: 'Not Started', confidence: 2, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' }
          ]
        },
        dbms_sql: {
          id: 'dbms_sql',
          name: 'DBMS & SQL',
          topics: [
            { id: 'db_1', title: 'ACID Properties with Real-World Financial Transaction Examples', status: 'Not Started', confidence: 4, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_2', title: 'Relational Keys: Primary, Foreign, Candidate, Super & Composite Keys', status: 'Not Started', confidence: 4, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_3', title: 'Database Normalization: 1NF, 2NF, 3NF & BCNF Anomalies', status: 'Not Started', confidence: 3, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_4', title: 'SQL Querying: SELECT, GROUP BY, HAVING, ORDER BY & Execution Order', status: 'Not Started', confidence: 4, notes: '', resources: 'SQLBolt', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_5', title: 'Relational JOINs: INNER, LEFT, RIGHT, FULL OUTER & Self Joins', status: 'Not Started', confidence: 4, notes: '', resources: 'W3Schools SQL', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_6', title: 'Subqueries & Nested Queries (Correlated vs Non-Correlated)', status: 'Not Started', confidence: 3, notes: '', resources: 'LeetCode SQL', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_7', title: 'Database Indexing: B-Trees, Clustered vs Non-Clustered Indexes', status: 'Not Started', confidence: 2, notes: '', resources: 'Use The Index, Luke!', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'db_8', title: 'Concurrency Control, Locks & Transaction Isolation Levels', status: 'Not Started', confidence: 3, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' }
          ]
        },
        os: {
          id: 'os',
          name: 'Operating Systems',
          topics: [
            { id: 'os_1', title: 'Process vs Thread, PCB/TCB & Context Switching Overhead', status: 'Not Started', confidence: 4, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'os_2', title: 'Process Lifecycle & State Transition Model', status: 'Not Started', confidence: 4, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'os_3', title: 'CPU Scheduling Algorithms: FCFS, SJF, Round Robin & Priority', status: 'Not Started', confidence: 3, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'os_4', title: 'Process Synchronization: Critical Section, Mutex vs Semaphore', status: 'Not Started', confidence: 3, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'os_5', title: 'Deadlocks: 4 Coffman Conditions, Prevention & Banker\'s Algorithm', status: 'Not Started', confidence: 3, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'os_6', title: 'Memory Management: Paging, Segmentation, TLB & Page Faults', status: 'Not Started', confidence: 2, notes: '', resources: 'Gate Smashers', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'os_7', title: 'Virtual Memory & Page Replacement Algorithms (FIFO, LRU, Optimal)', status: 'Not Started', confidence: 3, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' }
          ]
        },
        cn: {
          id: 'cn',
          name: 'Computer Networks',
          topics: [
            { id: 'cn_1', title: 'OSI 7-Layer Model vs TCP/IP Protocol Stack Architecture', status: 'Not Started', confidence: 4, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'cn_2', title: 'TCP vs UDP: 3-Way Handshake, Flow Control & Reliability Mechanisms', status: 'Not Started', confidence: 4, notes: '', resources: 'Stanford CS', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'cn_3', title: 'IP Addressing: IPv4 Subnetting, CIDR Notation & Public/Private IPs', status: 'Not Started', confidence: 3, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'cn_4', title: 'DNS Resolution: Step-by-Step Recursive & Iterative Lookup Flow', status: 'Not Started', confidence: 4, notes: '', resources: 'Cloudflare Learning', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'cn_5', title: 'HTTP vs HTTPS: SSL/TLS Handshake, Encryption & Status Codes', status: 'Not Started', confidence: 3, notes: '', resources: 'MDN Web Docs', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'cn_6', title: 'Common Ports & Networking Protocols (HTTP, HTTPS, SSH, DNS, FTP)', status: 'Not Started', confidence: 4, notes: '', resources: 'GeeksforGeeks', selfAssessment: '', lastRevised: '', nextRevised: '' },
            { id: 'cn_7', title: 'What Happens When You Type a URL in the Browser (Full Request Flow)', status: 'Not Started', confidence: 3, notes: '', resources: 'GitHub Alex Repo', selfAssessment: '', lastRevised: '', nextRevised: '' }
          ]
        }
      },
      softSkills: {
        competencies: [
          // 1. Communication skills
          { id: 'sk_comm_1', category: 'Communication Skills', title: 'Professional Self-Introduction', status: 'In Progress', confidence: 3, practiceLink: '', notes: 'Practice 60-90 second introduction focusing on education, key skills, and engineering passions.', lastPracticed: '' },
          { id: 'sk_comm_2', category: 'Communication Skills', title: 'Explaining Technical Concepts in Simple English', status: 'Not Started', confidence: 2, practiceLink: '', notes: 'Explain how an API or HashMap works to someone without a CS background.', lastPracticed: '' },
          { id: 'sk_comm_3', category: 'Communication Skills', title: 'Speaking Clearly and Confidently', status: 'In Progress', confidence: 3, practiceLink: '', notes: 'Record voice memos to monitor pacing, vocal modulation, and enunciation.', lastPracticed: '' },
          { id: 'sk_comm_4', category: 'Communication Skills', title: 'Asking Thoughtful Clarifying Questions', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Formulate questions when receiving ambiguous coding problem statements.', lastPracticed: '' },
          { id: 'sk_comm_5', category: 'Communication Skills', title: 'Active Listening & Acknowledgment', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Practice summarizing what an interviewer asks before launching into an answer.', lastPracticed: '' },

          // 2. Interview skills
          { id: 'sk_int_1', category: 'Interview Skills', title: 'Tell Me About Yourself Narrative', status: 'In Progress', confidence: 3, practiceLink: '', notes: 'Structure: Present (3rd yr CE) -> Past (key projects/milestones) -> Future (why this role).', lastPracticed: '' },
          { id: 'sk_int_2', category: 'Interview Skills', title: 'Strengths & Genuine Areas for Improvement', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'State a real challenge (e.g. over-analyzing early design) with active steps being taken to mitigate it.', lastPracticed: '' },
          { id: 'sk_int_3', category: 'Interview Skills', title: 'Why Should We Hire You? (Value Proposition)', status: 'Not Started', confidence: 2, practiceLink: '', notes: 'Connect disciplined problem-solving and rapid learning to business needs.', lastPracticed: '' },
          { id: 'sk_int_4', category: 'Interview Skills', title: 'Why This Specific Company?', status: 'Not Started', confidence: 2, practiceLink: '', notes: 'Cite company engineering blogs, recent product releases, and technology culture.', lastPracticed: '' },
          { id: 'sk_int_5', category: 'Interview Skills', title: 'Explaining Projects & Technical Architectural Decisions', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Explain why MySQL was selected over NoSQL for FindIt.', lastPracticed: '' },

          // 3. Behavioral interview preparation (STAR)
          { id: 'sk_beh_1', category: 'Behavioral Preparation', title: 'Teamwork & Cross-functional Collaboration (STAR)', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Describe a college team project where tasks were split and integrated cleanly.', lastPracticed: '' },
          { id: 'sk_beh_2', category: 'Behavioral Preparation', title: 'Conflict Resolution & Differing Technical Opinions', status: 'Not Started', confidence: 2, practiceLink: '', notes: 'Detail how a disagreement on tech stack was settled through objective testing.', lastPracticed: '' },
          { id: 'sk_beh_3', category: 'Behavioral Preparation', title: 'Receiving Constructive Feedback Professionally', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Reflect on code review comments that improved system reliability.', lastPracticed: '' },
          { id: 'sk_beh_4', category: 'Behavioral Preparation', title: 'Adaptability Under Tight Deadlines', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'How a surprise assignment or bug was managed calmly and delivered on time.', lastPracticed: '' },
          { id: 'sk_beh_5', category: 'Behavioral Preparation', title: 'Learning From an Engineering Mistake', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Describe an unhandled edge case or deployment hiccup and the post-mortem takeaways.', lastPracticed: '' },

          // 4. Presentation and confidence
          { id: 'sk_pres_1', category: 'Presentation & Confidence', title: 'Delivering a Structured 2-Minute Elevator Pitch', status: 'In Progress', confidence: 3, practiceLink: '', notes: 'Keep time under 120 seconds while highlighting core competitive strengths.', lastPracticed: '' },
          { id: 'sk_pres_2', category: 'Presentation & Confidence', title: 'Explaining a Project in 3–5 Minutes', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Problem -> Architecture -> Your Contribution -> Difficult Hurdle -> Result.', lastPracticed: '' },
          { id: 'sk_pres_3', category: 'Presentation & Confidence', title: 'Reducing Filler Words (Um, Uh, Like, You Know)', status: 'In Progress', confidence: 2, practiceLink: '', notes: 'Practice comfortable 1-second pauses instead of vocal filler fillers.', lastPracticed: '' },
          { id: 'sk_pres_4', category: 'Presentation & Confidence', title: 'Structuring Technical Answers with PREP Method', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Point -> Reason -> Example -> Point re-statement.', lastPracticed: '' },

          // 5. Professional habits
          { id: 'sk_hab_1', category: 'Professional Habits', title: 'Professional Email & Communication Etiquette', status: 'Not Started', confidence: 4, practiceLink: '', notes: 'Concise subject lines, professional greetings, and actionable inquiries.', lastPracticed: '' },
          { id: 'sk_hab_2', category: 'Professional Habits', title: 'LinkedIn Outreach & Recruiter Messaging', status: 'Not Started', confidence: 3, practiceLink: '', notes: 'Personalized connection notes without copy-pasting generic requests.', lastPracticed: '' },
          { id: 'sk_hab_3', category: 'Professional Habits', title: 'Time Management & Accountability in Projects', status: 'In Progress', confidence: 4, practiceLink: '', notes: 'Maintaining disciplined daily milestones and communicating blockers early.', lastPracticed: '' }
        ],
        weeklySpeakingChallenges: [
          {
            id: 'spk_chal_1',
            week: 1,
            topic: 'Explain One Technical Topic Aloud: Why String is Immutable in Java',
            guidelines: 'Explain the concept in 2 minutes as if teaching a junior peer. Mention security, synchronization, and the String Constant Pool.',
            completed: false,
            recordingLink: '',
            selfEvaluation: '',
            dateCompleted: null
          },
          {
            id: 'spk_chal_2',
            week: 2,
            topic: 'Explain One Technical Topic Aloud: How a HashMap Resolves Collisions',
            guidelines: 'Walk through hashcode hashing, bucket index calculation, linked list chaining, and treeification at threshold 8.',
            completed: false,
            recordingLink: '',
            selfEvaluation: '',
            dateCompleted: null
          }
        ],
        mockRubrics: []
      },
      certifications: [
        {
          id: 'cert_1',
          title: 'Java Programming: Arrays, Lists, and Structured Data',
          provider: 'Coursera / Duke University',
          skill: 'Java & Algorithms',
          url: 'https://www.coursera.org/learn/java-programming-arrays-data-list',
          type: 'Learning Path',
          plannedStart: todayStr,
          targetCompletion: '2026-11-30',
          actualCompletion: '',
          status: 'Planned',
          progress: 0,
          modulesCompleted: 0,
          totalModules: 5,
          estimatedHoursRemaining: 18,
          notes: 'Focus on structured file parsing and object-oriented collections in Java.',
          examDetails: 'Course completion quiz and peer-graded assignment.',
          certificateUrl: '',
          earned: false,
          isSample: true
        },
        {
          id: 'cert_2',
          title: 'Relational Database Design and SQL Foundations',
          provider: 'Coursera / edX',
          skill: 'SQL & Database Architecture',
          url: 'https://www.coursera.org/specializations/databases-for-data-scientists',
          type: 'Free Course',
          plannedStart: '2026-11-01',
          targetCompletion: '2026-12-15',
          actualCompletion: '',
          status: 'Planned',
          progress: 0,
          modulesCompleted: 0,
          totalModules: 4,
          estimatedHoursRemaining: 15,
          notes: 'Solidify normalization, nested SQL queries, and ACID transaction rules.',
          examDetails: 'Hands-on schema normalization exercises.',
          certificateUrl: '',
          earned: false,
          isSample: true
        },
        {
          id: 'cert_3',
          title: 'Git and GitHub for Version Control',
          provider: 'Google / Coursera',
          skill: 'Version Control & Collaboration',
          url: 'https://www.coursera.org/learn/introduction-git-github',
          type: 'Free Course',
          plannedStart: '2026-11-15',
          targetCompletion: '2026-12-01',
          actualCompletion: '',
          status: 'Planned',
          progress: 0,
          modulesCompleted: 0,
          totalModules: 4,
          estimatedHoursRemaining: 10,
          notes: 'Learn branch workflows, rebasing, pull requests, and resolving merge conflicts.',
          examDetails: 'Practical command-line Git graded assessment.',
          certificateUrl: '',
          earned: false,
          isSample: true
        },
        {
          id: 'cert_4',
          title: 'NPTEL: Programming, Data Structures and Algorithms Using Java',
          provider: 'NPTEL / IIT',
          skill: 'Data Structures & Algorithms',
          url: 'https://nptel.ac.in/',
          type: 'Certification Exam',
          plannedStart: '2026-12-01',
          targetCompletion: '2027-01-30',
          actualCompletion: '',
          status: 'Planned',
          progress: 0,
          modulesCompleted: 0,
          totalModules: 8,
          estimatedHoursRemaining: 30,
          notes: 'Comprehensive academic rigor aligned with campus placement expectations.',
          examDetails: 'Proctored in-person examination.',
          certificateUrl: '',
          earned: false,
          isSample: true
        },
        {
          id: 'cert_5',
          title: 'AWS Certified Cloud Practitioner Learning Path',
          provider: 'AWS Skill Builder',
          skill: 'Cloud Foundations',
          url: 'https://explore.skillbuilder.aws/',
          type: 'Certification Exam',
          plannedStart: '2027-01-01',
          targetCompletion: '2027-02-15',
          actualCompletion: '',
          status: 'Planned',
          progress: 0,
          modulesCompleted: 0,
          totalModules: 6,
          estimatedHoursRemaining: 20,
          notes: 'Understand cloud computing concepts, S3, EC2, RDS, and security fundamentals.',
          examDetails: 'Official AWS Certification Exam (CLF-C02).',
          certificateUrl: '',
          earned: false,
          isSample: true
        }
      ],
      projects: [
        {
          id: 'proj_findit',
          title: 'FindIt — Lost and Found Campus Portal',
          description: 'A full-stack web application designed for university campuses to streamline lost and found item management, verified claim authentication, and notification tracking.',
          problemSolved: 'Students frequently lose laptops, IDs, and keys with no central, secure system. FindIt prevents fraud via hidden item detail verification before location handover.',
          techStack: ['Java Spring Boot / Node.js', 'MySQL', 'HTML5 / CSS / Vanilla JS', 'REST APIs', 'Git'],
          repoUrl: 'https://github.com/nandini-dev/findit-lost-found-portal',
          liveUrl: '',
          startDate: '2026-11-01',
          targetCompletionDate: '2027-01-20',
          actualCompletionDate: '',
          milestones: [
            { id: 'm1', title: 'Define functional requirements and user journey diagrams', status: 'Not Started', deadline: '2026-11-05', priority: 'High', notes: 'List core entities: Users, Items, Claims, Notifications.' },
            { id: 'm2', title: 'Design user interface wireframes and component layout', status: 'Not Started', deadline: '2026-11-12', priority: 'Medium', notes: 'Responsive grid, item detail modal, and report forms.' },
            { id: 'm3', title: 'Create normalized MySQL relational database schema', status: 'Not Started', deadline: '2026-11-20', priority: 'High', notes: 'DDL scripts, foreign keys, and indexes for category searches.' },
            { id: 'm4', title: 'Implement frontend pages and responsive UI elements', status: 'Not Started', deadline: '2026-11-30', priority: 'High', notes: 'Clean component structure and form validation.' },
            { id: 'm5', title: 'Build backend REST API endpoints (CRUD operations)', status: 'Not Started', deadline: '2026-12-10', priority: 'High', notes: 'Endpoints for creating, fetching, and updating items.' },
            { id: 'm6', title: 'Integrate MySQL database with backend connection pool', status: 'Not Started', deadline: '2026-12-18', priority: 'High', notes: 'HikariCP configuration and parameterized SQL queries.' },
            { id: 'm7', title: 'Add multi-attribute search and category filters', status: 'Not Started', deadline: '2026-12-25', priority: 'Medium', notes: 'Filter by location, date range, and keyword.' },
            { id: 'm8', title: 'Implement input validation and error handling pipeline', status: 'Not Started', deadline: '2027-01-02', priority: 'Medium', notes: 'Sanitize inputs, return standardized JSON error bodies.' },
            { id: 'm9', title: 'Test user journeys and resolve edge-case bugs', status: 'Not Started', deadline: '2027-01-08', priority: 'High', notes: 'Test multiple concurrent claims on identical item categories.' },
            { id: 'm10', title: 'Deploy application live on cloud platforms (Vercel / Render)', status: 'Not Started', deadline: '2027-01-15', priority: 'High', notes: 'Configure environment variables and production DB credentials.' },
            { id: 'm11', title: 'Author professional GitHub README with screenshots', status: 'Not Started', deadline: '2027-01-18', priority: 'High', notes: 'Add architectural diagrams, setup steps, and API contract.' },
            { id: 'm12', title: 'Prepare 3-minute technical interview walkthrough and pitch', status: 'Not Started', deadline: '2027-01-22', priority: 'High', notes: 'Rehearse technical decisions, trade-offs, and lessons learned.' }
          ],
          challenges: [
            {
              id: 'ch_1',
              challenge: 'Preventing fraudulent claims on high-value lost items (e.g., smart watches and wallets).',
              solution: 'Designed a two-tier verification workflow: the finder specifies a private verification question (e.g. lock screen wallpaper description), which the claimant must answer correctly before any direct contact details or exact locker coordinates are displayed.',
              date: '2026-10-21'
            }
          ],
          interviewChecklist: [
            { id: 'ic_1', text: 'System Architecture & Data Flow diagram prepared and explained', checked: false },
            { id: 'ic_2', text: 'Relational Database Schema & Foreign Key Constraints justified', checked: false },
            { id: 'ic_3', text: 'REST API endpoints and standardized HTTP status codes documented', checked: false },
            { id: 'ic_4', text: 'Input validation and SQL Injection prevention verified', checked: false },
            { id: 'ic_5', text: 'Engineering trade-offs (e.g. Relational DB vs NoSQL) explained clearly', checked: false },
            { id: 'ic_6', text: 'Future scalability improvements (caching with Redis, notifications) outlined', checked: false }
          ]
        }
      ],
      companies: [
        {
          id: 'comp_google',
          name: 'Google',
          officialCareersUrl: 'https://careers.google.com/',
          targetRole: 'Software Engineer (Campus / Early Career)',
          priority: 'Dream',
          eligibilityCriteria: 'B.Tech Computer Engineering / CS related, solid academic standing',
          requiredSkills: ['Data Structures & Algorithms', 'C++ / Java / Python', 'System Design Basics', 'Problem Solving'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'Ready',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'Online Assessment -> 2-3 Technical Coding Rounds -> Googliness & Leadership',
          notes: 'Heavy emphasis on clean algorithmic code, time/space complexity analysis, and edge cases.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'g_1', label: 'Solved at least 60 LeetCode Medium problems', checked: false },
            { id: 'g_2', label: 'Strong command over recursion, trees, and dynamic programming', checked: false },
            { id: 'g_3', label: 'Ability to dry-run algorithmic logic on a blank document', checked: false },
            { id: 'g_4', label: 'Prepared 3 STAR stories demonstrating collaborative problem solving', checked: false }
          ]
        },
        {
          id: 'comp_amazon',
          name: 'Amazon',
          officialCareersUrl: 'https://www.amazon.jobs/',
          targetRole: 'Software Development Engineer I (SDE-1)',
          priority: 'Dream',
          eligibilityCriteria: 'B.Tech Computer Engineering, minimum 6.5+ CGPA',
          requiredSkills: ['Java / OOP', 'Data Structures', 'System Design', 'Leadership Principles'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'Ready',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'OA (2 Coding + Work Style Simulation) -> 3 Technical & Behavioral SDE Rounds',
          notes: 'Every technical question is accompanied by deep dives into Amazon Leadership Principles.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'amz_1', label: 'Mastered Amazon Leadership Principles with 2 STAR stories each', checked: false },
            { id: 'amz_2', label: 'High proficiency in Strings, HashMaps, Trees, and Heaps', checked: false },
            { id: 'amz_3', label: 'Solid object-oriented design and design pattern awareness', checked: false },
            { id: 'amz_4', label: 'Flagship full-stack project explanation thoroughly rehearsed', checked: false }
          ]
        },
        {
          id: 'comp_jpmc',
          name: 'JPMorgan Chase & Co.',
          officialCareersUrl: 'https://careers.jpmorgan.com/',
          targetRole: 'Software Engineer Program (SEP)',
          priority: 'Dream',
          eligibilityCriteria: 'B.Tech Computer Engineering, 7.0+ CGPA preferred',
          requiredSkills: ['Java / Python', 'DBMS & SQL Queries', 'Data Structures', 'Fintech Awareness'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'Ready',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'Code for Good Hackathon / HackerRank OA -> Technical Interview -> Behavioral',
          notes: 'Strong focus on Core Java, OOP fundamentals, relational SQL queries, and teamwork.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'jpmc_1', label: 'Mastered Core Java Collections and Multi-threading basics', checked: false },
            { id: 'jpmc_2', label: 'Comfortable writing complex multi-table SQL JOIN queries', checked: false },
            { id: 'jpmc_3', label: 'Demonstrated collaboration in team hackathons or projects', checked: false }
          ]
        },
        {
          id: 'comp_microsoft',
          name: 'Microsoft',
          officialCareersUrl: 'https://careers.microsoft.com/',
          targetRole: 'Software Engineer',
          priority: 'Dream',
          eligibilityCriteria: 'B.Tech Computer Engineering, solid academic record',
          requiredSkills: ['Data Structures & Algorithms', 'C++ / Java / C#', 'Operating Systems', 'System Design'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'Ready',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'Codility OA (3 questions) -> 3-4 Rounds Technical & System Architecture',
          notes: 'Focus on clean, maintainable modular code and deep understanding of Operating Systems.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'ms_1', label: 'Solved classic algorithms across Arrays, Trees, and Graphs', checked: false },
            { id: 'ms_2', label: 'Deep understanding of OS processes, memory paging, and deadlocks', checked: false },
            { id: 'ms_3', label: 'Clear communication style during live collaborative coding', checked: false }
          ]
        },
        {
          id: 'comp_tcs',
          name: 'TCS (Tata Consultancy Services)',
          officialCareersUrl: 'https://www.tcs.com/careers',
          targetRole: 'Digital / Prime Engineer',
          priority: 'Target',
          eligibilityCriteria: 'B.Tech 60%+ throughout 10th, 12th, and Degree, no active backlogs',
          requiredSkills: ['Quantitative Aptitude', 'Advanced Coding in Java/C++', 'CS Fundamentals'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'In Progress',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'TCS NQT (Cognitive + Advanced Technical Coding) -> Technical & HR Interview',
          notes: 'NQT score determines entry into Prime (9 LPA) vs Digital (7 LPA) vs Ninja cadre.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'tcs_1', label: 'Aptitude speed drill practice (>75% accuracy)', checked: false },
            { id: 'tcs_2', label: 'Advanced coding section solved in under 45 minutes', checked: false },
            { id: 'tcs_3', label: 'Solid grasp of Java OOP and DBMS normalization concepts', checked: false }
          ]
        },
        {
          id: 'comp_infosys',
          name: 'Infosys',
          officialCareersUrl: 'https://www.infosys.com/careers/',
          targetRole: 'Specialist Programmer (SP) / Digital Specialist Engineer (DSE)',
          priority: 'Target',
          eligibilityCriteria: 'B.Tech 65%+ or 6.5+ CGPA',
          requiredSkills: ['Advanced DSA', 'Math & Logic', 'Core CS Fundamentals'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'In Progress',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'InfyTQ / HackWithInfy / Campus OA -> Technical Interview',
          notes: 'HackWithInfy coding competition offers direct Specialist Programmer offers (9.5 LPA).',
          followUpDate: '',
          readinessChecklist: [
            { id: 'inf_1', label: 'Participated in HackWithInfy or campus qualifier tests', checked: false },
            { id: 'inf_2', label: 'Practiced Dynamic Programming and Greedy algorithmic questions', checked: false }
          ]
        },
        {
          id: 'comp_accenture',
          name: 'Accenture',
          officialCareersUrl: 'https://www.accenture.com/in-en/careers',
          targetRole: 'Advanced Application Engineering Associate (AAEA)',
          priority: 'Target',
          eligibilityCriteria: 'B.Tech 65%+ or 6.5+ CGPA, no active backlogs',
          requiredSkills: ['Cognitive Assessment', 'Technical Assessment', 'Coding in Java'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'In Progress',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'Cognitive & Technical Assessment -> Coding -> Communication Assessment -> Interview',
          notes: 'Automated AI Communication Assessment tests oral clarity, fluency, and sentence mastery.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'acc_1', label: 'Practiced oral communication and paragraph reading aloud', checked: false },
            { id: 'acc_2', label: 'Reviewed networking and cloud computing multiple choice questions', checked: false }
          ]
        },
        {
          id: 'comp_cognizant',
          name: 'Cognizant',
          officialCareersUrl: 'https://careers.cognizant.com/',
          targetRole: 'GenC Elevate / GenC Next',
          priority: 'Target',
          eligibilityCriteria: 'B.Tech 60%+ throughout academic history',
          requiredSkills: ['Java Full Stack', 'SQL Queries', 'Algorithms'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'In Progress',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'GenC Next Skill Assessment -> Technical & HR Discussion',
          notes: 'GenC Next offers higher CTC for candidates demonstrating strong full-stack skills.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'cog_1', label: 'Demonstrated full-stack project code and database connections', checked: false },
            { id: 'cog_2', label: 'Comfortable writing basic RESTful endpoints and SQL queries', checked: false }
          ]
        },
        {
          id: 'comp_capgemini',
          name: 'Capgemini',
          officialCareersUrl: 'https://www.capgemini.com/careers/',
          targetRole: 'Senior Analyst / Software Engineer',
          priority: 'Backup',
          eligibilityCriteria: 'B.Tech 60%+ in 10th, 12th, and Diploma/Graduation',
          requiredSkills: ['Pseudocode Assessment', 'English Communication', 'Technical Coding'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'In Progress',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'Pseudocode Round -> English Assessment -> Game-based Aptitude -> Interview',
          notes: 'Pseudocode round tests code tracing and loop index debugging speed.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'cap_1', label: 'Practiced 20 pseudocode code tracing exercises', checked: false },
            { id: 'cap_2', label: 'Reviewed behavioral situational responses', checked: false }
          ]
        },
        {
          id: 'comp_wipro',
          name: 'Wipro',
          officialCareersUrl: 'https://careers.wipro.com/',
          targetRole: 'Elite National Talent Hunt (Project Engineer / Turbo)',
          priority: 'Backup',
          eligibilityCriteria: 'B.Tech 60%+ throughout 10th, 12th, and Engineering',
          requiredSkills: ['Aptitude & Reasoning', 'Written Communication (Essay)', 'Coding in Java'],
          dsaPrepStatus: 'In Progress',
          aptitudePrepStatus: 'In Progress',
          coreCsPrepStatus: 'In Progress',
          tailoredResumeStatus: 'In Progress',
          applicationStatus: 'Preparing',
          applicationDate: '',
          assessmentDate: '',
          interviewDate: '',
          interviewRounds: 'Wipro NLTH Assessment -> Technical Interview -> HR Round',
          notes: 'Essay writing tests grammatical accuracy and professional viewpoint structuring.',
          followUpDate: '',
          readinessChecklist: [
            { id: 'wip_1', label: 'Timed 20-minute essay writing practice with spell-check disabled', checked: false },
            { id: 'wip_2', label: 'Core Java syntax and exception handling questions prepared', checked: false }
          ]
        }
      ],
      resumes: [
        {
          id: 'res_1',
          name: 'Nandini_SDE_Core_Resume_v1.pdf',
          targetRole: 'Software Development Engineer',
          lastUpdated: todayStr,
          skills: 'Java, DSA, MySQL, Spring Boot, Git, JavaScript, OOP, OS, Networks',
          projects: 'FindIt — Lost and Found Portal',
          certifications: 'Java Programming Foundations, SQL Relational DB Design',
          link: '#',
          notes: 'ATS-formatted single-column resume with quantified bullet points and clean headers.'
        }
      ],
      resumeChecklist: [
        { id: 'rc_1', text: 'Clean single-column ATS-friendly layout with readable fonts', checked: false },
        { id: 'rc_2', text: 'Every project bullet point begins with a strong active verb', checked: false },
        { id: 'rc_3', text: 'Achievements and project contributions are quantified with metrics', checked: false },
        { id: 'rc_4', text: 'Working links included for GitHub profile, LinkedIn, and Live Demo', checked: false },
        { id: 'rc_5', text: 'Checked for zero spelling, grammatical, or punctuation errors', checked: false },
        { id: 'rc_6', text: 'Fits exactly on one clean, high-density page without overflow', checked: false }
      ],
      jobApplications: [],
      weeklyReviews: []
    };
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse placement data:', e);
    }
    return this.getDefaultData();
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to write placement data to localStorage:', e);
    }
  }

  ensureSchema() {
    const def = this.getDefaultData();
    let modified = false;

    if (!this.data.settings) {
      this.data.settings = def.settings;
      modified = true;
    } else {
      if (!this.data.settings.targetDeadline) {
        this.data.settings.targetDeadline = def.settings.targetDeadline;
        modified = true;
      }
      if (!this.data.settings.readinessWeights) {
        this.data.settings.readinessWeights = def.settings.readinessWeights;
        modified = true;
      }
      if (!this.data.settings.userName) {
        this.data.settings.userName = 'Nandini';
        modified = true;
      }
    }

    if (!this.data.roadmap || this.data.roadmap.length === 0) {
      this.data.roadmap = (window.DEFAULT_ROADMAP_WEEKS || []).map(w => JSON.parse(JSON.stringify(w)));
      modified = true;
    }

    if (!Array.isArray(this.data.dailyTasks)) {
      this.data.dailyTasks = def.dailyTasks;
      modified = true;
    }

    if (!this.data.dailyReflections) {
      this.data.dailyReflections = def.dailyReflections;
      modified = true;
    }

    if (!this.data.softSkills) {
      this.data.softSkills = def.softSkills;
      modified = true;
    }

    if (!Array.isArray(this.data.certifications)) {
      this.data.certifications = def.certifications;
      modified = true;
    }

    if (!Array.isArray(this.data.companies)) {
      this.data.companies = def.companies;
      modified = true;
    }

    if (!Array.isArray(this.data.resumes)) {
      this.data.resumes = def.resumes;
      modified = true;
    }

    if (!Array.isArray(this.data.resumeChecklist)) {
      this.data.resumeChecklist = def.resumeChecklist;
      modified = true;
    }

    if (!Array.isArray(this.data.jobApplications)) {
      this.data.jobApplications = def.jobApplications;
      modified = true;
    }

    if (!Array.isArray(this.data.timerSessions)) {
      this.data.timerSessions = [];
      modified = true;
    }

    if (!Array.isArray(this.data.weeklyReviews)) {
      this.data.weeklyReviews = [];
      modified = true;
    }

    if (modified) {
      this.saveData();
    }
  }

  // --- STATISTICAL & DERIVED METRICS ---

  getTodayStudiedMinutes() {
    const todayStr = this.getTodayString();
    const seconds = this.data.timerSessions
      .filter(s => s.dateStr === todayStr)
      .reduce((sum, s) => sum + (s.durationSeconds || s.durationMinutes * 60 || 0), 0);
    return Math.floor(seconds / 60);
  }

  getTotalStudiedMinutes() {
    return Math.floor(
      this.data.timerSessions.reduce((sum, s) => sum + (s.durationSeconds || s.durationMinutes * 60 || 0), 0) / 60
    );
  }

  getTotalStudiedHoursFormatted() {
    const mins = this.getTotalStudiedMinutes();
    const hrs = (mins / 60).toFixed(1);
    return hrs.endsWith('.0') ? parseInt(hrs, 10) : hrs;
  }

  getDaysRemaining() {
    const deadlineStr = this.data.settings.targetDeadline || '2026-12-31';
    const target = new Date(deadlineStr + 'T23:59:59');
    const now = new Date();
    const diffMs = target - now;
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  getUniqueSolvedDsaCount() {
    return this.data.dsaProblems.filter(p => p.status === 'Solved').length;
  }

  getSolvedDsaCount() {
    return this.getUniqueSolvedDsaCount();
  }

  getCoreCsProgress() {
    let total = 0;
    let ready = 0;
    let completed = 0;
    Object.values(this.data.coreSubjects || {}).forEach(sub => {
      (sub.topics || []).forEach(t => {
        total++;
        if (t.status === 'Interview-Ready') {
          ready++;
          completed++;
        } else if (t.status === 'Practised') {
          completed++;
        }
      });
    });
    return { total: total || 1, ready, completed };
  }

  getAptitudeMetrics() {
    const sessions = this.data.aptitudeSessions || [];
    const totalAtt = sessions.reduce((s, x) => s + (parseInt(x.attempted, 10) || 0), 0);
    const totalCorr = sessions.reduce((s, x) => s + (parseInt(x.correct, 10) || 0), 0);
    const acc = totalAtt > 0 ? Math.round((totalCorr / totalAtt) * 100) : 0;
    return {
      totalSolved: totalAtt,
      accuracy: acc,
      sessionCount: sessions.length
    };
  }

  getSoftSkillsMetrics() {
    const comps = (this.data.softSkills && this.data.softSkills.competencies) || [];
    const totalConf = comps.reduce((sum, c) => sum + (c.confidence || 3), 0);
    const avgLevel = comps.length > 0 ? (totalConf / comps.length).toFixed(1) : '3.0';
    const speakingDone = !!(this.data.softSkills && this.data.softSkills.weeklyChallengeCompleted);
    return {
      avgLevel,
      speakingChallengeThisWeek: speakingDone
    };
  }

  getProjectMetrics() {
    const projects = this.data.projects || [];
    const findIt = projects.find(p => p.id === 'proj_findit') || projects[0] || { milestones: [] };
    const findItMilestones = findIt.milestones || [];
    const findItDone = findItMilestones.filter(m => m.status === 'Completed').length;
    return {
      findItCompleted: findItDone,
      findItTotal: findItMilestones.length || 12,
      totalProjects: projects.length
    };
  }

  getCertificationsMetrics() {
    const certs = this.data.certifications || [];
    const earned = certs.filter(c => c.earned || c.status === 'Completed').length;
    const inProgress = certs.filter(c => c.status === 'In Progress').length;
    return {
      earned,
      inProgress,
      total: certs.length
    };
  }

  getCompanyMetrics() {
    const comps = this.data.companies || [];
    const ready = comps.filter(c => c.dsaPrepStatus === 'Ready' && c.coreCsPrepStatus === 'Ready').length;
    return {
      ready,
      total: comps.length
    };
  }

  getApplicationMetrics() {
    const apps = this.data.jobApplications || [];
    const applied = apps.length;
    const interviewing = apps.filter(a => a.status === 'Interviewing' || a.status === 'OA Cleared').length;
    return {
      applied,
      interviewing
    };
  }

  getStreakInfo() {
    const activeDates = new Set();
    this.data.timerSessions.forEach(s => {
      if (s.dateStr) activeDates.add(s.dateStr);
    });
    this.data.dailyTasks.forEach(t => {
      if (t.completed && t.date) activeDates.add(t.date);
    });

    if (activeDates.size === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    const sortedDates = Array.from(activeDates).sort();
    let bestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    sortedDates.forEach(dStr => {
      const cur = new Date(dStr + 'T00:00:00');
      if (prevDate) {
        const diffDays = Math.round((cur - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
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

    const todayStr = this.getTodayString();
    const yestStr = yesterday.toISOString().split('T')[0];

    let currentStreak = 0;
    if (activeDates.has(todayStr)) {
      let checkDate = new Date(today);
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else if (activeDates.has(yestStr)) {
      let checkDate = new Date(yesterday);
      while (true) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (activeDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak)
    };
  }

  // --- PREPARATION COMPLETION (Roadmap Milestones & Tasks) ---
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

  // --- WEIGHTED PLACEMENT READINESS SCORE ---
  getPlacementReadiness() {
    const weights = this.data.settings.readinessWeights || {
      dsa: 25,
      coreCs: 20,
      projects: 20,
      aptitude: 15,
      softSkills: 10,
      certs: 10
    };

    // 1. DSA Score (target 80 problems)
    const solvedDsa = this.getUniqueSolvedDsaCount();
    const dsaTarget = this.data.settings.dsaTarget || 80;
    const dsaScore = Math.min(100, Math.round((solvedDsa / dsaTarget) * 100));

    // 2. Core CS Score (topics Practised / Interview-Ready)
    let totalCoreTopics = 0;
    let corePoints = 0;
    Object.values(this.data.coreSubjects || {}).forEach(sub => {
      (sub.topics || []).forEach(t => {
        totalCoreTopics++;
        if (t.status === 'Interview-Ready') corePoints += 1.0;
        else if (t.status === 'Practised') corePoints += 0.7;
        else if (t.status === 'Learning') corePoints += 0.35;
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
          totalM++;
          if (m.status === 'Completed') doneM++;
          else if (m.status === 'In Progress') doneM += 0.4;
        });
        (p.interviewChecklist || []).forEach(chk => {
          totalM += 0.5;
          if (chk.checked) doneM += 0.5;
        });
      });
      projScore = totalM > 0 ? Math.min(100, Math.round((doneM / totalM) * 100)) : 0;
    }

    // 4. Aptitude Score (accuracy & practice sessions)
    const aptiSessions = this.data.aptitudeSessions || [];
    let aptiScore = 0;
    if (aptiSessions.length > 0) {
      const totalAtt = aptiSessions.reduce((s, x) => s + (parseInt(x.attempted, 10) || 0), 0);
      const totalCorr = aptiSessions.reduce((s, x) => s + (parseInt(x.correct, 10) || 0), 0);
      const acc = totalAtt > 0 ? (totalCorr / totalAtt) * 100 : 0;
      // Combine accuracy with session volume (capped)
      const volumeFactor = Math.min(1, aptiSessions.length / 5);
      aptiScore = Math.min(100, Math.round(acc * 0.7 + (volumeFactor * 100) * 0.3));
    }

    // 5. Soft Skills Score
    const competencies = (this.data.softSkills && this.data.softSkills.competencies) || [];
    let softPoints = 0;
    competencies.forEach(c => {
      if (c.status === 'Confident') softPoints += 1.0;
      else if (c.status === 'In Progress') softPoints += 0.5;
      if (c.confidence >= 4) softPoints += 0.2;
    });
    const softScore = competencies.length > 0 ? Math.min(100, Math.round((softPoints / (competencies.length * 1.2)) * 100)) : 0;

    // 6. Certifications Score (completed vs planned)
    const certs = this.data.certifications || [];
    const earnedCount = certs.filter(c => c.earned || c.status === 'Completed').length;
    const certScore = certs.length > 0 ? Math.min(100, Math.round((earnedCount / certs.length) * 100)) : 0;

    // Total weighted calculation
    const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0) || 100;
    const overallWeightedScore = Math.round(
      (dsaScore * weights.dsa +
       coreCsScore * weights.coreCs +
       projScore * weights.projects +
       aptiScore * weights.aptitude +
       softScore * weights.softSkills +
       certScore * weights.certs) / totalWeights
    );

    return {
      overallScore: Math.min(100, overallWeightedScore),
      isAssessed: (solvedDsa > 0 || corePoints > 0 || projScore > 0 || aptiSessions.length > 0),
      breakdown: {
        dsa: { score: dsaScore, weight: weights.dsa, label: 'DSA & Coding' },
        coreCs: { score: coreCsScore, weight: weights.coreCs, label: 'Core Computer Science' },
        projects: { score: projScore, weight: weights.projects, label: 'Projects & Engineering' },
        aptitude: { score: aptiScore, weight: weights.aptitude, label: 'Aptitude & Reasoning' },
        softSkills: { score: softScore, weight: weights.softSkills, label: 'Communication & HR' },
        certs: { score: certScore, weight: weights.certs, label: 'Courses & Certifications' }
      },
      lastUpdated: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }

  // --- PROGRESS TOWARD DREAM ROLE & TARGET COMPANIES ---
  getDreamRoleProgress() {
    const companies = this.data.companies || [];
    const dreamCompanies = companies.filter(c => c.priority === 'Dream');
    const targetCompanies = companies.filter(c => c.priority === 'Target');

    let totalChecklistItems = 0;
    let checkedItems = 0;

    companies.forEach(comp => {
      (comp.readinessChecklist || []).forEach(chk => {
        totalChecklistItems++;
        if (chk.checked) checkedItems++;
      });
      if (comp.dsaPrepStatus === 'Ready') checkedItems += 0.5;
      if (comp.coreCsPrepStatus === 'Ready') checkedItems += 0.5;
      if (comp.aptitudePrepStatus === 'Ready') checkedItems += 0.5;
      if (comp.tailoredResumeStatus === 'Ready') checkedItems += 0.5;
      totalChecklistItems += 2;
    });

    const prepPct = totalChecklistItems > 0 ? Math.min(100, Math.round((checkedItems / totalChecklistItems) * 100)) : 0;

    return {
      percentage: prepPct,
      targetRole: this.data.settings.targetRole || 'Software Development Engineer',
      dreamCount: dreamCompanies.length,
      targetCount: targetCompanies.length,
      totalTracked: companies.length
    };
  }

  // --- TOP UNFINISHED PRIORITIES ---
  getTopPriorities() {
    const todayStr = this.getTodayString();
    const tasks = (this.data.dailyTasks || []).filter(t => !t.completed);

    // Prioritize High priority, then today's date
    const sorted = [...tasks].sort((a, b) => {
      const prioOrder = { High: 3, Medium: 2, Low: 1 };
      const diffPrio = (prioOrder[b.priority] || 1) - (prioOrder[a.priority] || 1);
      if (diffPrio !== 0) return diffPrio;
      return (a.date === todayStr ? -1 : 1);
    });

    return sorted.slice(0, 3);
  }

  // --- RECOMMENDED NEXT ACTION (derived from actual incomplete roadmap) ---
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
      subjectKey: 'Mock Prep',
      taskText: 'Simulate full company-style placement assessment and review interview answers.',
      action: 'Simulate full company-style placement assessment and review interview answers.'
    };
  }

  // --- RECORDING ACTIONS ---

  addTimerSession(session) {
    session.id = 'sess_' + Date.now();
    session.createdAt = new Date().toISOString();
    session.dateStr = session.dateStr || this.getTodayString();
    this.data.timerSessions.push(session);
    this.notify('TIMER_SESSION_ADDED', session);
  }

  deleteTimerSession(id) {
    this.data.timerSessions = this.data.timerSessions.filter(s => s.id !== id);
    this.notify('TIMER_SESSION_DELETED', id);
  }

  exportBackupJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importBackupJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }
      if (!parsed.settings || !Array.isArray(parsed.dsaProblems)) {
        throw new Error('Missing core placement journey structures');
      }
      this.data = parsed;
      this.ensureSchema();
      this.saveData();
      this.notify('DATA_RESTORED');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.getDefaultData();
    this.saveData();
    this.notify('DATA_CLEARED');
  }
}

window.nandiniStore = new NandiniPlacementStore();

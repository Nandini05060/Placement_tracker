# Nandini | Placement Journey 🎓

A complete, fully functional, professional placement preparation web application built for **Nandini**, a third-year B.Tech Computer Engineering student preparing for software placements over the next 4–6 months.

Built with **React 19**, **Vite**, **Lucide Icons**, and a clean **Data Access Layer (DAL)** backed by persistent `localStorage`. The application combines an executive dashboard, 120-minute daily planner, drift-free study timer, 24-week placement syllabus, DSA problem tracker, aptitude engine, core CS evaluation, soft skills rehearsal studio, course and certification portfolio, 12-milestone project manager, 10 target company profiles (Dream vs Core Service tracks), ATS resume audit & application pipeline, mock interview studio, spaced repetition revision system, monthly executive reports, and settings.

---

## 🎨 1. Professional Design System

- **Design Philosophy:** Modern productivity dashboard with elegant, minimal, soft feminine SaaS aesthetics.
- **Color Palette:**
  - Background: `#FFF9FC`
  - Primary Blush Pink: `#E8A8C2`
  - Light Pink: `#FBE5EE`
  - Lavender Accent: `#E9E3FA`
  - White Cards: `#FFFFFF`
  - Main Text: `#332A35`
  - Secondary Text: `#766B79`
  - Success Indicator: Muted Emerald Green (`#10B981`)
  - Warning Indicator: Muted Amber (`#F59E0B`)
  - Danger / Overdue: Soft Crimson (`#EF4444`)
- **Typography:** Google Fonts `Inter` (body) and `Plus Jakarta Sans` (headings).
- **Themes:** Complete reactive support for **Light Theme** (soft feminine blush) and **Dark Theme** (charcoal mauve slate).
- **Aesthetic Guidelines Adhered to:** Zero childish cartoons, excessive hearts, glitter, or cliché motivational quotes. Clean rounded cards, subtle shadows, thin borders, and Lucide React icons.

---

## 💻 2. Technical Stack & Architecture

- **Framework:** React 19 + Vite (JavaScript / JSX).
- **Component Styling:** Organized CSS variables design tokens (`src/index.css`) with dark/light theme switching.
- **Icons:** `lucide-react`.
- **Data Access Layer (DAL):** `src/services/placementStore.js` implements a singleton store with subscriber event listeners, LocalStorage persistence, formula engines, and validation. The DAL can be transparently swapped with a backend REST or GraphQL API without rewriting React components.
- **Audio Synthesizer:** `src/services/audioService.js` synthesizes pleasant bell chimes and feedback clicks using the browser's native Web Audio API (zero external audio file dependencies).
- **Microphone Support:** Real browser `MediaRecorder` API support in Soft Skills and Mock Interview studios for speech rehearsal.
- **Export & Import:** Full JSON backup and restore with structure validation, error handling, and destructive clear-data confirmation dialog.

---

## 📱 3. Application Layout & The 16 Complete Navigation Views

The collapsible desktop sidebar and mobile navigation drawer provide 16 fully functional views:

1. **Dashboard** (`#view-dashboard`):
   - Welcome banner: *"Welcome back, Nandini."*
   - Current week out of 24, target placement date countdown, 120-min daily target meter.
   - **Three Distinct Metrics:**
     - **Metric A: Preparation Completion** (Roadmap milestone weights).
     - **Metric B: Skill Readiness** (Verified assessment scores across DSA, CS, Projects, Aptitude, Soft Skills, Certs; displays *"Not assessed"* when no data exists).
     - **Metric C: Target Company Preparation** (Specific checklist completion across selected companies).
     - *Integrity Rule: Metrics are never confused and never describe hiring probability.*
   - "Today's Top Priorities" list and "Recommended Next Action" card based on real unfinished work.

2. **Daily Planner** (`#view-planner`):
   - 120-minute daily study target with real-time progress bar.
   - 7 study categories: Java and DSA, Aptitude and reasoning, Core computer science, Soft skills, Project development, Certifications, Revision & interview practice.
   - Task creation, editing, deletion, priority tags, subtasks, notes.
   - Over-120-minute study warning to prevent student burnout.
   - Smart rule-based scheduler proposing daily tasks based on pending deadlines.
   - Recurring habits tracker with streak calculation.
   - Daily reflection and tomorrow's preparation notes.

3. **Study Timer** (`#view-timer`):
   - Drift-free timer using timestamps (`Date.now()`) ensuring accurate elapsed time even when browser tabs become inactive.
   - 25-minute Pomodoro, 5-minute short break, 15-minute long break, custom countdown, and stopwatch.
   - Subject and task selector to link sessions directly to planner tasks.
   - Circular countdown indicator, sound chimes, and session history log.
   - Strict rule: Break time never counts as study time.

4. **24-Week Roadmap** (`#view-roadmap`):
   - 6 structured phases across 24 weeks:
     - Weeks 1–4: Java Foundations (Variables, loops, methods, OOP)
     - Weeks 5–8: DSA Foundations (Arrays, hashing, searching, sorting, two pointers, sliding window)
     - Weeks 9–12: DSA & SQL (Linked lists, stacks, queues, SQL joins, normalization)
     - Weeks 13–16: Core CS & Project Foundation (Collections, DBMS, OS, Networks, Git)
     - Weeks 17–20: Project Development & Assessments (FindIt core features, APIs, testing, mock tests)
     - Weeks 21–24: Placement Readiness (Interviews, DSA revision, behavioral STAR prep, company mocks)
   - Objectives, weighted tasks, resource links, and one-click timer bridge.

5. **DSA Tracker** (`#view-dsa`):
   - Target benchmark of 80 unique questions.
   - 11 Topic filters: Arrays, Strings, Hashing, Searching, Sorting, Two Pointers, Sliding Window, Recursion, Linked Lists, Stacks, Queues.
   - Platform, difficulty, approach, time/space complexity, revision schedule, notes.
   - Strict rule: duplicate entries are never counted as additional unique solved questions.

6. **Aptitude Tracker** (`#view-aptitude`):
   - 9 Quantitative & Reasoning topics: Percentages, Ratios & Averages, Profit & Loss, Time & Work, Time Speed & Distance, Probability, Logical Reasoning, Verbal Ability, Data Interpretation.
   - Real accuracy calculations, weak-topic detection (<60%), speed drill practice logger.

7. **Core CS Subjects** (`#view-core-cs`):
   - Trackers for Java/OOP, DBMS/SQL, Operating Systems, and Computer Networks.
   - 4-stage lifecycle: Not Started, Learning, Practised, Interview-Ready.
   - Strict rule: topics cannot be marked "Interview-Ready" without completing a self-assessment quiz modal.

8. **Soft Skills & HR Communication** (`#view-soft-skills`):
   - 13 competencies: English communication, Self-introduction, Technical explanation, Active listening, Teamwork, Leadership, Problem-solving, Adaptability, Time management, Conflict resolution, Email writing, Presentation, Behavioral interviews.
   - 2-Minute speaking challenge studio with audio timer and optional microphone recording.
   - STAR-method answer builder (Situation, Task, Action, Result).

9. **Courses & Certifications** (`#view-certifications`):
   - Certification and course manager supporting NPTEL, Coursera, Google, Microsoft, AWS, Oracle, Cisco.
   - Strict separation of course completion from passing a proctored certification exam.
   - Verification links and credential IDs.

10. **Projects Tracker** (`#view-projects`):
    - Flagship project: **FindIt — Campus Lost and Found Portal** with all 12 suggested milestones.
    - Architecture rationale, relational database schema, JWT auth, and concurrency trade-offs.
    - Technical challenge log with problem and solution notes.

11. **Target Companies** (`#view-companies`):
    - 10 starter profiles:
      - **Aspirational / Dream (Product & FinTech):** Google, Amazon, JPMorganChase, Microsoft.
      - **Core Placement / Target (IT Services & Mass):** TCS, Infosys, Accenture, Cognizant, Capgemini, Wipro.
    - 4-pillar readiness scores (DSA, Core CS, Aptitude, Resume).
    - Card Grid and Comparison Matrix views.

12. **Resume & Applications** (`#view-resumes`):
    - Application pipeline tracker with company, role, applied date, status, follow-up dates.
    - Tailored resume version manager.
    - 12-point automated ATS compliance audit checklist.
    - Skill-evidence manager linking resume claims to real code and certificates.

13. **Mock Interview Studio** (`#view-mock-interviews`):
    - Technical and HR rehearsal modes.
    - Filterable question bank with expected key points.
    - 2-minute answer timer, live rehearsal notes, optional voice recording.
    - 4-factor self-evaluation rubric (Clarity, Technical Accuracy, Structure, Confidence).

14. **Revision Center** (`#view-revision`):
    - Spaced repetition queue with 1, 3, 7, and 14 day intervals.
    - Rating actions (Easy +7d, Moderate +3d, Difficult +1d) that dynamically recalculate the next scheduled date.
    - Searchable mistake journal documenting anti-patterns and code invariants.

15. **Analytics & Reports** (`#view-analytics`):
    - 7-day study volume visual chart.
    - DSA difficulty distribution meters.
    - Detailed skill readiness breakdown across 6 weighted categories.
    - Printable monthly executive briefing card with one-click print support (`window.print()`).

16. **Settings & Data Management** (`#view-settings`):
    - Target placement deadline date picker.
    - Daily study target (120m default) and unique DSA goal (80 default).
    - Category weights adjuster with mandatory 100% sum validation.
    - Theme selector (Light / Dark) and audio toggle.
    - Single-click JSON backup export and import with structure validation.
    - Safe clear-data confirmation dialog.

---

## 🛠️ 4. How to Run Locally

### Prerequisites
- Node.js (version 18 or higher recommended).
- npm (installed with Node.js).

### Installation & Startup
```bash
# 1. Clone or navigate to the project directory
cd "c:\Users\nandi\Desktop\placement tracker"

# 2. Install dependencies (React, Vite, Lucide React)
npm install

# 3. Start the Vite development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000/
```

### Production Build & Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 5. Data Privacy & Local Storage Notice

All data created in this application is stored exclusively in your browser's `localStorage` under the key:
```
nandini_placement_journey_react_v1
```
- **No external server required:** Your study logs, notes, and applications never leave your local device.
- **Backups:** Use the **Export JSON Backup** feature in the Settings page periodically to save a local `.json` copy of your progress.
- **Cross-device synchronization:** Because data is stored in the browser, to transfer progress to another laptop or browser, export your JSON backup and import it on the new device.

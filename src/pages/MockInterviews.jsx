import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareCode,
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  Star,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  UserCheck,
  Award,
  ChevronRight,
  Filter,
  Layers,
  History,
  AlertCircle,
  Volume2,
  VolumeX,
  Send,
  Bot,
  User,
  Check
} from 'lucide-react';
import { placementStore } from '../services/placementStore.js';
import { audioService } from '../services/audioService.js';
import { Modal } from '../components/Modal.jsx';
import { getTodayString } from '../data/defaultData.js';

const MOCK_QUESTION_BANK = [
  // 1. Introduction
  {
    id: 'mock_intro_1',
    category: 'Introduction & Resume',
    title: 'Candidate Introduction',
    question: 'Tell me about yourself, your academic background in Computer Science, and walk me through your engineering resume.',
    expectedPoints: ['Degree & university', 'Core programming strengths (Java/C++, DSA)', 'Flagship project & tech stack', 'Career vision in Software Engineering'],
    idealAnswer: "I am a 3rd-year Computer Science student passionate about backend systems, algorithms, and full-stack development. Over the last two years, I have strengthened my problem-solving skills across Data Structures and built production-ready applications like a campus Lost & Found system with automated notification pipelines. I am now looking to join a fast-paced engineering team where I can contribute to scalable microservices and distributed software."
  },
  {
    id: 'mock_intro_2',
    category: 'Introduction & Resume',
    title: 'Why This Company & Role',
    question: 'Why are you interested in joining our company as a Software Development Engineer (SDE)?',
    expectedPoints: ['Company tech stack alignment', 'Products/scale that excite you', 'How your skills provide immediate impact', 'Long term learning mindset'],
    idealAnswer: "I admire your platform's engineering scale and focus on resilient cloud architecture. With my foundation in Java, Spring Boot, and database indexing, I want to work on mission-critical backend systems while learning from seasoned senior engineers to deliver high-availability services."
  },

  // 2. Technical Core CS
  {
    id: 'mock_tech_1',
    category: 'Technical - DBMS & SQL',
    title: 'ACID Properties in Databases',
    question: 'Explain ACID properties in relational database management systems with a concrete banking transfer example.',
    expectedPoints: ['Atomicity (all or nothing)', 'Consistency (rules intact)', 'Isolation (concurrent transactions unaffected)', 'Durability (committed data safe)'],
    idealAnswer: "In a $100 fund transfer from Account A to B: Atomicity ensures debit and credit happen together or both rollback. Consistency enforces that total money in bank remains invariant and balances do not drop below minimum limits. Isolation ensures concurrent users do not read intermediate uncommitted balances. Durability ensures that once committed, power outage cannot erase the updated account balances."
  },
  {
    id: 'mock_tech_2',
    category: 'Technical - OS & Systems',
    title: 'Process vs Thread & Concurrency',
    question: 'What is the exact distinction between a Process and a Thread? How do they communicate?',
    expectedPoints: ['Memory space isolation vs shared heap/code', 'Context switching overhead', 'IPC (pipes, sockets) vs shared memory synchronization'],
    idealAnswer: "A Process has independent virtual address space, file descriptors, and security tokens. Threads are execution contexts within the same process sharing the heap, global variables, and code segment, but having independent registers and stack. Process context switching is heavier because MMU page tables must be flushed, whereas thread context switching is much lighter. Processes communicate via IPC (sockets, message queues), while threads communicate via shared memory with mutexes."
  },
  {
    id: 'mock_tech_3',
    category: 'Technical - Java & OOP',
    title: 'Polymorphism & JVM Memory Model',
    question: 'Explain Compile-time vs Runtime Polymorphism in Java, and how method overriding is resolved by the JVM.',
    expectedPoints: ['Method Overloading (static binding)', 'Method Overriding (dynamic binding via vtable)', 'Heap vs Stack memory allocation'],
    idealAnswer: "Compile-time polymorphism is achieved through method overloading where method signatures differ and the compiler binds the call. Runtime polymorphism is achieved via method overriding using inheritance; the JVM resolves calls at runtime using a virtual method table (vtable) based on the actual object instance on the heap, not the reference type."
  },
  {
    id: 'mock_tech_4',
    category: 'Technical - Networks',
    title: 'TCP 3-Way Handshake & Protocols',
    question: 'Describe what happens during the TCP 3-Way Handshake and why UDP cannot guarantee packet ordering.',
    expectedPoints: ['SYN, SYN-ACK, ACK sequence numbers', 'Connection establishment', 'UDP header simplicity with no sequence tracking'],
    idealAnswer: "In TCP: Client sends SYN packet with Initial Sequence Number (ISN). Server replies with SYN-ACK containing its own ISN and ACK for client. Client responds with ACK. This syncs sequence numbers bidirectionally. UDP lacks sequence numbers and acknowledgments, so packets travel independently and can arrive out of order or be lost without retransmission."
  },

  // 3. DSA & Problem Solving
  {
    id: 'mock_dsa_1',
    category: 'Technical - DSA',
    title: 'Optimizing Two Sum Problem',
    question: 'How do you solve the Two Sum problem? Walk me through your thought process from brute force to optimal.',
    expectedPoints: ['Brute force O(N^2) double loop', 'Optimal O(N) time with O(N) space using HashMap complement lookup', 'Edge cases (duplicates, negative values)'],
    idealAnswer: "Brute force checks every pair in O(N^2) time. To optimize, I iterate through the array maintaining a HashMap of seen values to indices. For each element X, I check if (Target - X) is present in the map in O(1) average time. If found, I return both indices; otherwise, I store X in the map. This achieves O(N) time and O(N) space."
  },
  {
    id: 'mock_dsa_2',
    category: 'Technical - DSA',
    title: 'Cycle Detection in Linked List',
    question: 'Explain how Floyd\'s Cycle-Finding Algorithm (Tortoise & Hare) works and prove why the slow and fast pointers must meet.',
    expectedPoints: ['Slow pointer moves 1 step, fast pointer moves 2 steps', 'Relative speed is 1 step/iteration inside cycle', 'O(N) time and O(1) auxiliary space'],
    idealAnswer: "We maintain slow pointer advancing 1 node and fast pointer advancing 2 nodes. If no cycle exists, fast pointer reaches null in O(N). If a cycle exists, once both pointers enter the loop, the relative distance between them decreases by exactly 1 node per iteration. Hence, they are mathematically guaranteed to meet in at most loop_length iterations without extra space."
  },

  // 4. HR & Behavioral STAR
  {
    id: 'mock_hr_1',
    category: 'HR - Behavioral',
    title: 'Handling Technical Conflict in Team',
    question: 'Tell me about a time you had a strong disagreement with a team member on a technical decision. How was it resolved?',
    expectedPoints: ['STAR: Situation, Task, Action, Result', 'Data-driven decision making', 'Empathy & team harmony', 'Positive end product'],
    idealAnswer: "During our final semester capstone project, my teammate wanted to use MongoDB for all data, while I advocated for PostgreSQL because our schema required complex relational joins between student, course, and grade entities. I scheduled a 30-minute whiteboard session where we benchmarked both with sample join queries. Seeing the 3x performance benefit and ACID guarantees for grades, my teammate agreed to PostgreSQL for relational tables, while we used MongoDB for unstructured log events. We delivered the project on time with an A grade."
  },
  {
    id: 'mock_hr_2',
    category: 'HR - Behavioral',
    title: 'Failure & Resilience',
    question: 'Describe a situation where a project or technical sprint did not go as planned. What did you learn?',
    expectedPoints: ['Honest reflection without blaming others', 'Root cause analysis', 'Proactive communication with stakeholders', 'Permanent process improvement'],
    idealAnswer: "In a hackathon, we spent 18 hours building advanced ML recommendation models before establishing our core user authentication and API endpoints. When demo time came, our backend could not communicate with the frontend. I learned the vital importance of building an end-to-end Minimum Viable Product (MVP) first before optimizing advanced sub-systems."
  }
];

export function MockInterviews({ data }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeQuestion, setActiveQuestion] = useState(MOCK_QUESTION_BANK[0]);
  
  // Timer for answer (2 minutes default)
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Spoken / Written Candidate Answer
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechDurationSecs, setSpeechDurationSecs] = useState(0);
  const [speechTimerActive, setSpeechTimerActive] = useState(false);

  // AI Feedback State
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recognitionRef = useRef(null);
  const speechIntervalRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        setCandidateAnswer(transcript.trim());
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Answer countdown timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            audioService.playTimerBell();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Track speaking duration for WPM calculation
  useEffect(() => {
    if (speechTimerActive) {
      speechIntervalRef.current = setInterval(() => {
        setSpeechDurationSecs(s => s + 1);
      }, 1000);
    } else {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    }
    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    };
  }, [speechTimerActive]);

  function toggleSpeechRecognition() {
    if (!recognitionRef.current) {
      alert('Microphone speech recognition is not supported in this browser. Please use Chrome or Edge, or type your answer directly in the box.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setSpeechTimerActive(false);
      audioService.playClick();
    } else {
      setCandidateAnswer('');
      setSpeechDurationSecs(0);
      setSpeechTimerActive(true);
      recognitionRef.current.start();
      setIsListening(true);
      if (!isTimerRunning) setIsTimerRunning(true);
      audioService.playSuccess();
    }
  }

  // AI Speech & Communication Analyzer
  function handleEvaluateAnswer() {
    const text = candidateAnswer.trim();
    if (!text) {
      alert('Please speak or type your answer before evaluating!');
      return;
    }

    setIsAnalyzing(true);
    if (isListening) toggleSpeechRecognition();
    setIsTimerRunning(false);

    setTimeout(() => {
      const words = text.split(/\s+/).filter(Boolean).length;
      const durationMins = Math.max(0.2, speechDurationSecs / 60);
      const wpm = Math.round(words / durationMins);

      // Filler words detection
      const fillerMatches = text.match(/\b(um|uh|like|basically|actually|you know|sort of|i mean)\b/gi) || [];
      const fillerCount = fillerMatches.length;

      // Pacing analysis
      let pacingRating = 'Ideal Pace';
      let pacingAdvice = 'Your speaking pace is natural, articulate, and well-metered for a corporate interview.';
      if (wpm < 110) {
        pacingRating = 'A bit slow / hesitant';
        pacingAdvice = 'Try to speak with more momentum. Minimize long pauses by practicing structured transition words.';
      } else if (wpm > 165) {
        pacingRating = 'Too fast / rushed';
        pacingAdvice = 'Slow down slightly. Take a breath between sentences so the panelist can absorb your key points.';
      }

      // Keyword coverage against expected points
      let matchedCount = 0;
      activeQuestion.expectedPoints.forEach(pt => {
        const keyTerms = pt.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        if (keyTerms.some(term => text.toLowerCase().includes(term))) {
          matchedCount++;
        }
      });

      const coveragePct = Math.round((matchedCount / activeQuestion.expectedPoints.length) * 100);

      const feedbackData = {
        wpm,
        pacingRating,
        pacingAdvice,
        wordCount: words,
        fillerCount,
        fillerExamples: Array.from(new Set(fillerMatches)).slice(0, 4),
        coveragePct: Math.max(30, coveragePct),
        clarityScore: fillerCount <= 1 ? 5 : fillerCount <= 3 ? 4 : 3,
        technicalScore: coveragePct >= 60 ? 5 : coveragePct >= 40 ? 4 : 3,
        idealModelAnswer: activeQuestion.idealAnswer
      };

      setAiFeedback(feedbackData);
      setIsAnalyzing(false);
      audioService.playSuccess();

      // Log session in store
      placementStore.addMockSession({
        questionTitle: activeQuestion.title,
        category: activeQuestion.category,
        wpm,
        clarityScore: feedbackData.clarityScore,
        technicalScore: feedbackData.technicalScore,
        wordCount: words
      });
    }, 800);
  }

  function handleSelectQuestion(q) {
    setActiveQuestion(q);
    setCandidateAnswer('');
    setAiFeedback(null);
    setTimerSeconds(120);
    setIsTimerRunning(false);
    setSpeechDurationSecs(0);
  }

  const categories = ['All', 'Introduction & Resume', 'Technical - DBMS & SQL', 'Technical - OS & Systems', 'Technical - Java & OOP', 'Technical - Networks', 'Technical - DSA', 'HR - Behavioral'];
  const filteredQuestions = MOCK_QUESTION_BANK.filter(q => selectedCategory === 'All' || q.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header Overview */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">AI Rehearsal Studio</span>
              <span className="badge badge-success">Speech & Pronunciation Coach</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              Mock Interview Simulator
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              Real-time AI voice interviewer that listens to your spoken answers and scores pronunciation, speaking speed (WPM), filler words, and technical depth.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Studio Grid: Question Bank Left, Interview Arena Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '22px' }}>
        {/* Left Column: Categorized Question Bank */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
              Question Bank ({MOCK_QUESTION_BANK.length})
            </h3>
          </div>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '0.8rem' }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
            {filteredQuestions.map(q => {
              const isSelected = activeQuestion.id === q.id;

              return (
                <div
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--border-soft)',
                    background: isSelected ? 'var(--color-primary-pale)' : 'var(--bg-card-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                    {q.category}
                  </span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: isSelected ? 'var(--color-primary-text)' : 'var(--text-main)', marginTop: '2px' }}>
                    {q.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Interview Arena & Speech Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Question Arena Card */}
          <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
            {/* AI Panelist Persona Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-pale)',
                    border: '1px solid var(--color-primary-blush)',
                    color: 'var(--color-primary-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>AI Technical Interviewer</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Listening & Evaluating live responses</div>
                </div>
              </div>

              {/* Timer Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${timerSeconds < 30 ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
                  <Clock size={13} /> {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <div style={{ marginBottom: '20px' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem', marginBottom: '6px' }}>
                Question Prompt
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
                "{activeQuestion.question}"
              </h2>

              <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Expected Key Themes:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeQuestion.expectedPoints.map((pt, i) => (
                    <span key={i} className="badge badge-lavender" style={{ fontSize: '0.72rem' }}>
                      • {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Candidate Microphone & Answer Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Your Spoken / Written Response:
                </span>

                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`btn btn-sm ${isListening ? 'btn-danger pulse-glow' : 'btn-primary'}`}
                  style={{ gap: '6px', fontWeight: 700 }}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  <span>{isListening ? 'Stop Listening' : 'Speak into Mic'}</span>
                </button>
              </div>

              <textarea
                className="form-textarea"
                style={{
                  minHeight: '140px',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  borderColor: isListening ? 'var(--color-primary)' : 'var(--border-soft)'
                }}
                placeholder={isListening ? '🎙️ Listening to you speaking... Say your answer clearly!' : 'Click "Speak into Mic" to answer aloud, or type your answer here...'}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Word Count: {candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0} words
                </span>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEvaluateAnswer}
                  disabled={!candidateAnswer.trim() || isAnalyzing}
                  style={{ padding: '8px 24px', fontWeight: 700 }}
                >
                  <Sparkles size={16} />
                  <span>{isAnalyzing ? 'Analyzing Speech...' : 'Analyze My Answer & Speech'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Feedback & Speech Analysis Card */}
          {aiFeedback && (
            <div className="card animate-fade-in" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Award size={20} color="var(--color-success)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  AI Speech & Communication Assessment
                </h3>
              </div>

              {/* Assessment Metrics Grid */}
              <div className="stat-grid-4" style={{ marginBottom: '18px' }}>
                <div className="stat-card" style={{ padding: '14px 16px' }}>
                  <span className="stat-card-label">Speaking Pace</span>
                  <div className="stat-card-value" style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }}>
                    {aiFeedback.wpm} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WPM</span>
                  </div>
                  <div className="stat-card-sub">{aiFeedback.pacingRating}</div>
                </div>

                <div className="stat-card" style={{ padding: '14px 16px' }}>
                  <span className="stat-card-label">Filler Words</span>
                  <div className="stat-card-value" style={{ fontSize: '1.4rem', color: aiFeedback.fillerCount === 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {aiFeedback.fillerCount}
                  </div>
                  <div className="stat-card-sub">{aiFeedback.fillerCount === 0 ? 'Flawless articulation' : aiFeedback.fillerExamples.join(', ')}</div>
                </div>

                <div className="stat-card" style={{ padding: '14px 16px' }}>
                  <span className="stat-card-label">Clarity Rating</span>
                  <div className="stat-card-value" style={{ fontSize: '1.4rem', color: 'var(--color-warning)' }}>
                    {aiFeedback.clarityScore} / 5 ⭐
                  </div>
                  <div className="stat-card-sub">Pronunciation & flow</div>
                </div>

                <div className="stat-card" style={{ padding: '14px 16px' }}>
                  <span className="stat-card-label">Technical Coverage</span>
                  <div className="stat-card-value" style={{ fontSize: '1.4rem', color: 'var(--color-success)' }}>
                    {aiFeedback.coveragePct}%
                  </div>
                  <div className="stat-card-sub">Key themes addressed</div>
                </div>
              </div>

              {/* Actionable Advice & Model Answer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '14px 16px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                    💡 Communication & Delivery Advice:
                  </strong>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {aiFeedback.pacingAdvice}
                  </div>
                </div>

                <div style={{ padding: '14px 16px', background: 'rgba(16, 185, 129, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-success-border)' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-success)', display: 'block', marginBottom: '4px' }}>
                    🏆 Benchmark Model Answer:
                  </strong>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    "{aiFeedback.idealModelAnswer}"
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

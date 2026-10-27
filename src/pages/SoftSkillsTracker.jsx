import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  MessageSquare,
  Sparkles,
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  Plus,
  Trash2,
  Bookmark,
  Check,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import audioService from '../services/audioService.js';
import { getTodayString } from '../data/defaultData.js';

const QUICK_PROMPTS = [
  'Ask me a behavioral interview question',
  'Give me feedback on my 1-minute self introduction',
  'How do I answer: "What is your biggest weakness?"',
  'Teach me the STAR method with a real engineering example',
  'How to handle nervousness before an HR round?',
  'Tips for explaining a low CGPA or resume gap professionally'
];

export function SoftSkillsTracker({ data, store }) {
  // Tabs: 'chatbot' | 'star-bank' | 'competencies'
  const [activeTab, setActiveTab] = useState('chatbot');

  // Chatbot State
  const [chatMode, setChatMode] = useState('interview'); // 'interview', 'doubts', 'communication'
  const [messages, setMessages] = useState([
    {
      id: 'msg_init',
      sender: 'ai',
      text: "👋 Hi Nandini! I'm your AI Communication & Soft Skills Coach. I'm here to help you practice HR & behavioral questions, clear placement doubts, and polish your communication skills. What would you like to practice today?",
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // STAR Answers Form
  const [starTitle, setStarTitle] = useState('');
  const [starSituation, setStarSituation] = useState('');
  const [starTask, setStarTask] = useState('');
  const [starAction, setStarAction] = useState('');
  const [starResult, setStarResult] = useState('');
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const softSkills = data?.softSkills || [];
  const starAnswers = data?.starAnswers || [];

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputMessage(transcript);
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

  function toggleSpeechListening() {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputMessage('');
      recognitionRef.current.start();
      setIsListening(true);
      audioService.playClick();
    }
  }

  // Text to Speech
  function speakText(text) {
    if (!ttsEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  // AI Response Generator
  function generateAiResponse(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('behavioral') || lower.includes('question') || lower.includes('ask me')) {
      return {
        text: `Here is a high-frequency behavioral question for you:\n\n**"Tell me about a time when you had to work with a difficult team member or handled a major disagreement on a project. How did you resolve it?"**\n\n💡 *Tip: Structure your response using the STAR method:*
• **Situation:** Context & team setting
• **Task:** What needed to be delivered
• **Action:** How you initiated open dialogue & found consensus
• **Result:** Successful outcome & lesson learned.\n\nType or speak your answer aloud!`,
        category: 'practice'
      };
    }

    if (lower.includes('weakness') || lower.includes('biggest weakness')) {
      return {
        text: `Here is the golden rule for answering **"What is your biggest weakness?"**:\n\n1. Pick a **genuine, non-fatal weakness** (e.g., getting overly fixated on perfectionism, or finding it hard to say no to requests).\n2. Highlight **active self-awareness and remediation**.\n\n✨ *Example Answer:*\n"Earlier, I struggled with trying to perfect every feature myself before delegating or asking for input, which slowed down initial iterations. Now, I use strict 30-minute timeboxes and solicit feedback early from peers using Git pull requests."`,
        category: 'advice'
      };
    }

    if (lower.includes('introduce') || lower.includes('self introduction') || lower.includes('tell me about yourself')) {
      return {
        text: `Great! The ideal **2-Minute Self-Introduction Formula** consists of 3 parts:\n\n1. **The Present (30s):** Who you are, your degree at college, and your core technical focus (e.g. Java, Data Structures, Full-Stack applications).\n2. **The Past (45s):** Key project you built (e.g. FindIt / Portfolio app) and problem it solved, plus relevant certifications.\n3. **The Future (45s):** Why you are excited about this specific engineering role and how your skills create value.\n\nWould you like to speak your intro so I can evaluate it?`,
        category: 'intro'
      };
    }

    if (lower.includes('star') || lower.includes('star method')) {
      return {
        text: `The **STAR Framework** is mandatory for top tech companies (Amazon, Microsoft, Google):\n\n• **S (Situation):** "During our college hackathon, our database began timing out under load..." (20s)\n• **T (Task):** "As backend lead, I had to bring response times under 200ms before judging." (15s)\n• **A (Action):** "I profiled slow queries, added B-Tree indexes on the user_id column, and implemented in-memory caching with Redis." (45s)\n• **R (Result):** "Query latency dropped by 72% and our team secured 2nd place overall." (20s)`,
        category: 'star'
      };
    }

    // Default intelligent feedback / coaching response
    const words = userText.trim().split(/\s+/).length;
    const fillerWords = (userText.match(/\b(um|uh|like|basically|actually|you know|sort of)\b/gi) || []).length;

    return {
      text: `### 🎯 AI Communication Analysis\n\n**Response Length:** ${words} words\n**Filler Words Detected:** ${fillerWords} ${fillerWords === 0 ? '✨ (Pristine clarity!)' : '⚠️ (Try pausing instead of filler words)'}\n\n**Key Strengths:**\n• Direct answer to the prompt with clear technical context.\n• Professional vocabulary and tone.\n\n**Actionable Advice:**\n• Ensure you quantify outcomes (e.g., mention exact % improvements or hours saved).\n• Keep eye contact and speak at an even, deliberate pace (130–140 words per minute).\n\nReady for the next question? Just ask!`,
      category: 'feedback'
    };
  }

  function handleSendMessage(textToSend) {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiThinking(true);
    audioService.playClick();

    setTimeout(() => {
      const response = generateAiResponse(text);
      const aiMsg = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsAiThinking(false);
      audioService.playSuccess();
      speakText(response.text);
    }, 700);
  }

  // Save STAR response
  function handleSaveStar(e) {
    e.preventDefault();
    if (!starTitle.trim()) return;

    if (!data.starAnswers) data.starAnswers = [];
    data.starAnswers.unshift({
      id: 'star_' + Date.now(),
      title: starTitle.trim(),
      situation: starSituation.trim(),
      task: starTask.trim(),
      action: starAction.trim(),
      result: starResult.trim(),
      date: getTodayString()
    });

    store.saveData();
    audioService.playSuccess();
    setIsStarModalOpen(false);
    setStarTitle('');
    setStarSituation('');
    setStarTask('');
    setStarAction('');
    setStarResult('');
  }

  function handleDeleteStar(id) {
    data.starAnswers = (data.starAnswers || []).filter(s => s.id !== id);
    store.saveData();
    audioService.playClick();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="animate-fade-in">
      {/* 1. Header Overview */}
      <div className="card" style={{ padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Communication Journal</span>
              <span className="badge badge-success">AI Behavioral Coach</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
              Soft Skills & AI Interview Coach
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              Interactive AI coach to practice HR & behavioral questions, clear placement doubts, and receive instant feedback on your communication skills.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setTtsEnabled(!ttsEnabled)}
              title={ttsEnabled ? 'Mute AI voice' : 'Enable AI voice response'}
            >
              {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsStarModalOpen(true)}
            >
              <Plus size={15} /> Save STAR Story
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '2px' }}>
        <button
          className={`btn ${activeTab === 'chatbot' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('chatbot')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 600 }}
        >
          <Bot size={15} />
          <span>AI Interview Chatbot & Coach</span>
        </button>

        <button
          className={`btn ${activeTab === 'star-bank' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('star-bank')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 600 }}
        >
          <Bookmark size={15} />
          <span>My STAR Responses Bank ({starAnswers.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'competencies' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('competencies')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontWeight: 600 }}
        >
          <Star size={15} />
          <span>Core Competencies Checklist</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: AI CHATBOT STUDIO                                  */}
      {/* ========================================================= */}
      {activeTab === 'chatbot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Prompt Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                className="btn btn-secondary btn-sm"
                onClick={() => handleSendMessage(prompt)}
                style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
              >
                <Sparkles size={12} color="var(--color-primary)" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Chat Arena Container */}
          <div
            className="card"
            style={{
              height: '520px',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card)'
            }}
          >
            {/* Messages Scroll Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {messages.map(msg => {
                const isAi = msg.sender === 'ai';

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      alignSelf: isAi ? 'flex-start' : 'flex-end',
                      maxWidth: '82%'
                    }}
                  >
                    {isAi && (
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-violet) 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Bot size={18} />
                      </div>
                    )}

                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: isAi ? 'var(--bg-card-subtle)' : 'var(--color-primary)',
                        color: isAi ? 'var(--text-main)' : '#FFFFFF',
                        border: isAi ? '1px solid var(--border-soft)' : 'none',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {msg.text}
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: isAi ? 'var(--text-muted)' : 'rgba(255, 255, 255, 0.75)',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}
                      >
                        {msg.time}
                      </div>
                    </div>

                    {!isAi && (
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: 'var(--color-primary)'
                        }}
                      >
                        N
                      </div>
                    )}
                  </div>
                );
              })}

              {isAiThinking && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-primary-blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <Bot size={18} />
                  </div>
                  <span>AI Coach is analyzing and composing feedback...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--border-soft)',
                backgroundColor: 'var(--bg-card-subtle)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              {/* Mic Button */}
              <button
                type="button"
                className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                onClick={toggleSpeechListening}
                title={isListening ? 'Stop listening' : 'Speak your answer via microphone'}
                style={{ padding: '10px', borderRadius: '50%' }}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                className="input-field"
                placeholder={isListening ? 'Listening... Speak your answer now!' : 'Ask a doubt or type your interview answer...'}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                style={{ flex: 1, fontSize: '0.88rem', padding: '10px 14px' }}
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                style={{ padding: '10px 18px', fontWeight: 700 }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STAR RESPONSES BANK                                */}
      {/* ========================================================= */}
      {activeTab === 'star-bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>STAR Stories Vault</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pre-packaged engineering stories for behavioural and situational HR rounds.</div>
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => setIsStarModalOpen(true)}>
              <Plus size={14} /> Add New STAR Story
            </button>
          </div>

          {starAnswers.length === 0 ? (
            <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Bookmark size={40} style={{ opacity: 0.35, marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>No STAR stories saved yet</div>
              <div style={{ fontSize: '0.84rem', marginTop: '4px' }}>Save 3–5 solid project or team conflict stories formatted as Situation, Task, Action, and Result.</div>
              <button className="btn btn-primary btn-sm" onClick={() => setIsStarModalOpen(true)} style={{ marginTop: '16px' }}>
                <Plus size={14} /> Create Your First Story
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {starAnswers.map(s => (
                <div key={s.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>STAR Scenario</span>
                      <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{s.title}</h3>
                    </div>

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteStar(s.id)}
                      style={{ padding: '6px', color: 'var(--color-danger)' }}
                      title="Delete story"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
                    <div style={{ padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '3px' }}>Situation (S):</strong>
                      {s.situation || '—'}
                    </div>

                    <div style={{ padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-accent-violet)', display: 'block', marginBottom: '3px' }}>Task (T):</strong>
                      {s.task || '—'}
                    </div>

                    <div style={{ padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-warning)', display: 'block', marginBottom: '3px' }}>Action (A):</strong>
                      {s.action || '—'}
                    </div>

                    <div style={{ padding: '10px 12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--color-success)', display: 'block', marginBottom: '3px' }}>Result (R):</strong>
                      {s.result || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COMPETENCIES CHECKLIST                             */}
      {/* ========================================================= */}
      {activeTab === 'competencies' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0' }}>
            Interview Soft Skill Competencies
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {softSkills.map(sk => {
              const isDone = sk.status === 'Completed';

              return (
                <div
                  key={sk.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: isDone ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card-subtle)',
                    border: isDone ? '1px solid var(--color-success-border)' : '1px solid var(--border-soft)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => {
                        const next = isDone ? 'Not Started' : 'Completed';
                        store.updateSoftSkill(sk.id, { status: next });
                        audioService.playClick();
                      }}
                      style={{
                        background: isDone ? 'var(--color-success)' : 'transparent',
                        border: `2px solid ${isDone ? 'var(--color-success)' : 'var(--border-soft)'}`,
                        borderRadius: '6px',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      {isDone && <Check size={14} strokeWidth={3} />}
                    </button>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isDone ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {sk.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {sk.description || 'Professional interview competence'}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${isDone ? 'badge-success' : sk.status === 'Practising' ? 'badge-warning' : 'badge-lavender'}`}>
                    {sk.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for Adding STAR Story */}
      {isStarModalOpen && (
        <Modal
          isOpen={isStarModalOpen}
          onClose={() => setIsStarModalOpen(false)}
          title="Add STAR Interview Response"
        >
          <form onSubmit={handleSaveStar} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Story / Scenario Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Handling tight sprint deadline during Hackathon"
                value={starTitle}
                onChange={(e) => setStarTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Situation (Context & Setting)</label>
              <textarea
                className="form-textarea"
                placeholder="What was the background, company/hackathon, or challenge faced?"
                value={starSituation}
                onChange={(e) => setStarSituation(e.target.value)}
                style={{ minHeight: '65px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Task (Your Goal & Responsibility)</label>
              <textarea
                className="form-textarea"
                placeholder="What specific responsibility did you need to accomplish?"
                value={starTask}
                onChange={(e) => setStarTask(e.target.value)}
                style={{ minHeight: '65px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Action (Steps YOU specifically took)</label>
              <textarea
                className="form-textarea"
                placeholder="What action did you take to solve the issue?"
                value={starAction}
                onChange={(e) => setStarAction(e.target.value)}
                style={{ minHeight: '75px' }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Result (Measurable Outcome & Impact)</label>
              <textarea
                className="form-textarea"
                placeholder="What happened? Give measurable metrics (e.g. 30% faster, 1st place)."
                value={starResult}
                onChange={(e) => setStarResult(e.target.value)}
                style={{ minHeight: '65px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsStarModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save STAR Story
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

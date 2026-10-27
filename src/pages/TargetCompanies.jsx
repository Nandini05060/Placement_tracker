import React, { useState, useMemo } from 'react';
import {
  Building2,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Edit3,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Sparkles,
  AlertCircle,
  Info,
  Calendar,
  Code2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { placementStore } from '../services/placementStore.js';
import { Modal } from '../components/Modal.jsx';
import {
  COMPANY_QUESTIONS_DATA,
  COMPANY_QUESTIONS_DATASET_META
} from '../data/companyQuestionsData.js';

const APPLICATION_STATUSES = [
  'Not Researched',
  'Preparing',
  'Ready to Apply',
  'Applied',
  'Assessment Scheduled',
  'Interview Scheduled',
  'Offer',
  'Rejected',
  'On Hold'
];

const QUESTION_STATUSES = ['Not Started', 'Attempted', 'Solved', 'Needs Revision'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const RECENCIES = ['All', 'All Time', 'Past 6 Months', 'Past 1 Year'];

// Map company name or id to dataset slug
function getCompanyDatasetSlug(companyName = '') {
  const norm = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm.includes('google')) return 'google';
  if (norm.includes('amazon')) return 'amazon';
  if (norm.includes('microsoft')) return 'microsoft';
  if (norm.includes('jpmorgan') || norm.includes('chase')) return 'jpmorganchase';
  if (norm.includes('tcs')) return 'tcs';
  if (norm.includes('infosys')) return 'infosys';
  if (norm.includes('accenture')) return 'accenture';
  if (norm.includes('cognizant')) return 'cognizant';
  if (norm.includes('capgemini')) return 'capgemini';
  if (norm.includes('wipro')) return 'wipro';
  if (norm.includes('apple')) return 'apple';
  if (norm.includes('meta')) return 'meta';
  if (norm.includes('netflix')) return 'netflix';
  if (norm.includes('uber')) return 'uber';
  if (norm.includes('goldman')) return 'goldmansachs';
  if (norm.includes('adobe')) return 'adobe';
  if (norm.includes('salesforce')) return 'salesforce';
  if (norm.includes('oracle')) return 'oracle';
  if (norm.includes('cisco')) return 'cisco';
  if (norm.includes('bloomberg')) return 'bloomberg';
  return null;
}

export function TargetCompanies({ data, onNavigate }) {
  // Main view tab: 'companies' | 'questions'
  const [activeTab, setActiveTab] = useState('companies');

  // Companies list state
  const [tierFilter, setTierFilter] = useState('all'); // all, dream, target
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Company questions view state
  const [selectedCompanySlug, setSelectedCompanySlug] = useState('google');
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Active question modal for logging practice
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [logFormData, setLogFormData] = useState({
    status: 'Not Started',
    attempts: 0,
    timeSpent: 0,
    solvedDate: '',
    revisionDate: '',
    notes: ''
  });

  // Company Edit/Add form
  const [formData, setFormData] = useState({
    name: '',
    tier: 'Core (IT Services)',
    priority: 'Target',
    careersUrl: '',
    targetRole: 'Software Engineer',
    dsaPrepStatus: 'Not Started',
    coreCsPrepStatus: 'Not Started',
    aptitudePrepStatus: 'Not Started',
    tailoredResumeStatus: 'Not Started',
    applicationStatus: 'Not Applied',
    notes: ''
  });

  const companies = data?.companies || [];

  // Personal prep progress calculation (0% if none ready)
  const calculatePersonalPrepProgress = (comp) => {
    let completedPoints = 0;
    if (comp.dsaPrepStatus === 'Ready') completedPoints += 25;
    else if (comp.dsaPrepStatus === 'In Progress') completedPoints += 10;

    if (comp.coreCsPrepStatus === 'Practised' || comp.coreCsPrepStatus === 'Ready') completedPoints += 25;
    else if (comp.coreCsPrepStatus === 'Learning') completedPoints += 10;

    if (comp.aptitudePrepStatus === 'Ready') completedPoints += 25;
    else if (comp.aptitudePrepStatus === 'In Progress') completedPoints += 10;

    if (comp.tailoredResumeStatus === 'Ready') completedPoints += 25;
    else if (comp.tailoredResumeStatus === 'Preparing') completedPoints += 10;

    return Math.min(100, completedPoints);
  };

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesTier =
        tierFilter === 'all' ||
        (tierFilter === 'dream' && c.priority === 'Dream') ||
        (tierFilter === 'target' && c.priority === 'Target');
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tier || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [companies, tierFilter, searchQuery]);

  // Available companies in dataset
  const datasetCompaniesList = useMemo(() => {
    return Object.keys(COMPANY_QUESTIONS_DATA).map(slug => ({
      slug,
      name: COMPANY_QUESTIONS_DATA[slug].name,
      questionCount: COMPANY_QUESTIONS_DATA[slug].questionCount
    }));
  }, []);

  // Selected company questions & user progress
  const currentCompanyData = COMPANY_QUESTIONS_DATA[selectedCompanySlug] || null;
  const userProgressForCompany = data?.companyQuestionProgress?.[selectedCompanySlug] || {};

  // Unique topics in current dataset
  const availableTopics = useMemo(() => {
    if (!currentCompanyData) return [];
    const set = new Set();
    currentCompanyData.questions.forEach(q => {
      if (q.topic) set.add(q.topic);
    });
    return Array.from(set).sort();
  }, [currentCompanyData]);

  // Company questions metrics
  const companyMetrics = useMemo(() => {
    if (!currentCompanyData) {
      return { total: 0, attempted: 0, solved: 0, revision: 0, remaining: 0, completionPct: 0 };
    }
    const questions = currentCompanyData.questions;
    let attempted = 0;
    let solved = 0;
    let revision = 0;

    questions.forEach(q => {
      const prog = userProgressForCompany[q.id];
      if (prog) {
        if (prog.status === 'Solved') solved++;
        else if (prog.status === 'Attempted') attempted++;
        else if (prog.status === 'Needs Revision') revision++;
      }
    });

    const total = questions.length;
    const remaining = Math.max(0, total - solved);
    const completionPct = total > 0 ? Math.round((solved / total) * 100) : 0;

    return { total, attempted, solved, revision, remaining, completionPct };
  }, [currentCompanyData, userProgressForCompany]);

  // Filtered questions for current selected company
  const filteredQuestions = useMemo(() => {
    if (!currentCompanyData) return [];
    return currentCompanyData.questions.filter(q => {
      const prog = userProgressForCompany[q.id] || { status: 'Not Started' };
      const currentStatus = prog.status || 'Not Started';

      const matchesSearch =
        q.title.toLowerCase().includes(questionSearch.toLowerCase()) ||
        (q.problemId && q.problemId.toString().includes(questionSearch)) ||
        (q.topic && q.topic.toLowerCase().includes(questionSearch.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === 'All' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesStatus =
        selectedStatusFilter === 'All' || currentStatus === selectedStatusFilter;

      const matchesTopic =
        selectedTopicFilter === 'All' || q.topic === selectedTopicFilter;

      return matchesSearch && matchesDifficulty && matchesStatus && matchesTopic;
    });
  }, [currentCompanyData, userProgressForCompany, questionSearch, selectedDifficulty, selectedStatusFilter, selectedTopicFilter]);

  // Paginated questions
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, page]);

  // Open Practice Questions for a specific company
  const handlePracticeCompanyQuestions = (companyName) => {
    const slug = getCompanyDatasetSlug(companyName);
    if (slug && COMPANY_QUESTIONS_DATA[slug]) {
      setSelectedCompanySlug(slug);
    } else {
      setSelectedCompanySlug('google');
    }
    setActiveTab('questions');
    setPage(1);
    setQuestionSearch('');
    setSelectedDifficulty('All');
    setSelectedStatusFilter('All');
    setSelectedTopicFilter('All');
  };

  // Open Log Modal for a Question
  const handleOpenLogModal = (question) => {
    setActiveQuestion(question);
    const prog = userProgressForCompany[question.id] || {
      status: 'Not Started',
      attempts: 0,
      timeSpent: 0,
      solvedDate: '',
      revisionDate: '',
      notes: ''
    };
    setLogFormData({
      status: prog.status || 'Not Started',
      attempts: prog.attempts || 0,
      timeSpent: prog.timeSpent || 0,
      solvedDate: prog.solvedDate || '',
      revisionDate: prog.revisionDate || '',
      notes: prog.notes || ''
    });
  };

  const handleSaveQuestionLog = (e) => {
    e.preventDefault();
    if (!activeQuestion) return;

    placementStore.updateCompanyQuestionStatus(selectedCompanySlug, activeQuestion.id, {
      status: logFormData.status,
      attempts: parseInt(logFormData.attempts, 10) || 0,
      timeSpent: parseInt(logFormData.timeSpent, 10) || 0,
      solvedDate: logFormData.status === 'Solved' ? (logFormData.solvedDate || new Date().toISOString().split('T')[0]) : null,
      revisionDate: logFormData.revisionDate || null,
      notes: logFormData.notes || ''
    });

    setActiveQuestion(null);
  };

  // Quick inline status change
  const handleQuickStatusChange = (question, newStatus) => {
    placementStore.updateCompanyQuestionStatus(selectedCompanySlug, question.id, {
      status: newStatus,
      solvedDate: newStatus === 'Solved' ? new Date().toISOString().split('T')[0] : null
    });
  };

  // Start study timer session for question
  const handleStartTimerSession = (question) => {
    if (onNavigate) {
      onNavigate('timer');
    } else {
      window.location.hash = '#view-timer';
    }
  };

  // Company management handlers
  const handleOpenEditCompany = (comp) => {
    setSelectedCompany(comp);
    setFormData({
      name: comp.name || '',
      tier: comp.tier || 'Core (IT Services)',
      priority: comp.priority || 'Target',
      careersUrl: comp.careersUrl || '',
      targetRole: comp.targetRole || '',
      dsaPrepStatus: comp.dsaPrepStatus || 'Not Started',
      coreCsPrepStatus: comp.coreCsPrepStatus || 'Not Started',
      aptitudePrepStatus: comp.aptitudePrepStatus || 'Not Started',
      tailoredResumeStatus: comp.tailoredResumeStatus || 'Not Started',
      applicationStatus: comp.applicationStatus || 'Not Applied',
      notes: comp.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleOpenAddCompany = () => {
    setFormData({
      name: '',
      tier: 'Core (IT Services)',
      priority: 'Target',
      careersUrl: '',
      targetRole: 'Software Engineer',
      dsaPrepStatus: 'Not Started',
      coreCsPrepStatus: 'Not Started',
      aptitudePrepStatus: 'Not Started',
      tailoredResumeStatus: 'Not Started',
      applicationStatus: 'Not Applied',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (selectedCompany) {
      placementStore.updateCompany(selectedCompany.id, formData);
      setIsEditModalOpen(false);
    } else {
      placementStore.addCompany(formData);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteCompany = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      placementStore.data.companies = (placementStore.data.companies || []).filter(c => c.id !== id);
      placementStore.notify('COMPANY_DELETED', id);
      if (selectedCompany?.id === id) setIsEditModalOpen(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Tab Switcher */}
      <div
        className="card"
        style={{
          padding: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Target Companies</span>
              <span className="badge badge-success">Company Research</span>
            </div>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 4px 0', fontFamily: 'var(--font-heading)' }}>
              Target Companies & Interview Questions
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Track preparation status for aspirational product leaders and core placement drivers. Practise curated interview questions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'companies' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('companies')}
            >
              <Building2 size={15} /> Target Companies ({companies.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'questions' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('questions')}
            >
              <Code2 size={15} /> Company-wise Questions
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TARGET COMPANIES LIST                              */}
      {/* ========================================================= */}
      {activeTab === 'companies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn btn-sm ${tierFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTierFilter('all')}
              >
                All ({companies.length})
              </button>
              <button
                className={`btn btn-sm ${tierFilter === 'dream' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTierFilter('dream')}
              >
                Dream Track
              </button>
              <button
                className={`btn btn-sm ${tierFilter === 'target' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTierFilter('target')}
              >
                Core Track
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search company or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
                />
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleOpenAddCompany}>
                <Plus size={15} /> Add Company
              </button>
            </div>
          </div>

          {/* Compact Companies Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredCompanies.map(comp => {
              const personalPrep = calculatePersonalPrepProgress(comp);
              const datasetSlug = getCompanyDatasetSlug(comp.name);
              const questionCount = datasetSlug ? COMPANY_QUESTIONS_DATA[datasetSlug]?.questionCount : null;

              return (
                <div
                  key={comp.id}
                  className="card"
                  style={{
                    padding: '16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                          {comp.name}
                        </h3>
                        {comp.careersUrl && (
                          <a
                            href={comp.careersUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center' }}
                            title="Official Careers Portal"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {comp.targetRole || 'Software Engineer'}
                      </div>
                    </div>

                    <span className={`badge ${comp.priority === 'Dream' ? 'badge-primary' : 'badge-lavender'}`} style={{ fontSize: '0.72rem' }}>
                      {comp.tier || comp.priority}
                    </span>
                  </div>

                  {/* Personal Preparation Progress */}
                  <div style={{ background: 'var(--bg-main)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Personal Preparation</span>
                      <span style={{ fontWeight: 800, color: personalPrep > 0 ? 'var(--color-primary-text)' : 'var(--text-secondary)' }}>
                        {personalPrep}%
                      </span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '5px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${personalPrep}%`,
                          backgroundColor: personalPrep >= 75 ? 'var(--color-success)' : 'var(--color-primary)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Preparation Checklist Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
                    <div style={{ padding: '6px 8px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', display: 'block' }}>DSA</span>
                      <span style={{ fontWeight: 600, color: comp.dsaPrepStatus === 'Ready' ? 'var(--color-success)' : 'var(--text-main)' }}>
                        {comp.dsaPrepStatus || 'Not Started'}
                      </span>
                    </div>
                    <div style={{ padding: '6px 8px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', display: 'block' }}>Core CS</span>
                      <span style={{ fontWeight: 600, color: comp.coreCsPrepStatus === 'Ready' || comp.coreCsPrepStatus === 'Practised' ? 'var(--color-success)' : 'var(--text-main)' }}>
                        {comp.coreCsPrepStatus || 'Not Started'}
                      </span>
                    </div>
                    <div style={{ padding: '6px 8px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', display: 'block' }}>Aptitude</span>
                      <span style={{ fontWeight: 600, color: comp.aptitudePrepStatus === 'Ready' ? 'var(--color-success)' : 'var(--text-main)' }}>
                        {comp.aptitudePrepStatus || 'Not Started'}
                      </span>
                    </div>
                    <div style={{ padding: '6px 8px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-soft)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', display: 'block' }}>Resume</span>
                      <span style={{ fontWeight: 600, color: comp.tailoredResumeStatus === 'Ready' ? 'var(--color-success)' : 'var(--text-main)' }}>
                        {comp.tailoredResumeStatus || 'Not Started'}
                      </span>
                    </div>
                  </div>

                  {/* Company Questions Practice Button */}
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderColor: 'var(--border-soft)',
                      background: 'var(--bg-main)'
                    }}
                    onClick={() => handlePracticeCompanyQuestions(comp.name)}
                  >
                    <Code2 size={14} style={{ color: 'var(--color-primary-text)' }} />
                    <span>Practice Company Questions</span>
                    {questionCount && (
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '1px 5px', marginLeft: 'auto' }}>
                        {questionCount} Qs
                      </span>
                    )}
                  </button>

                  {/* Footer: Application Status & Edit/Delete */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-soft)', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Status:</span>
                      <select
                        className="input-field"
                        style={{ fontSize: '0.75rem', padding: '2px 6px', height: '26px', width: 'auto' }}
                        value={comp.applicationStatus || 'Not Applied'}
                        onChange={(e) => placementStore.updateCompany(comp.id, { applicationStatus: e.target.value })}
                      >
                        {APPLICATION_STATUSES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '4px 6px' }}
                        onClick={() => handleOpenEditCompany(comp)}
                        title="Edit Company"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '4px 6px', color: 'var(--color-warning)' }}
                        onClick={() => handleDeleteCompany(comp.id, comp.name)}
                        title="Delete Company"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COMPANY-WISE LEETCODE QUESTIONS                    */}
      {/* ========================================================= */}
      {activeTab === 'questions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Dataset Info Strip */}
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Info size={16} style={{ color: 'var(--color-primary-text)' }} />
              <span>
                Dataset Source: <strong style={{ color: 'var(--text-main)' }}>GitHub (snehasishroy/leetcode-companywise-interview-questions)</strong>
              </span>
              <span style={{ color: 'var(--border-soft)' }}>|</span>
              <span>Snapshot: {COMPANY_QUESTIONS_DATASET_META.snapshotDate}</span>
              <span style={{ color: 'var(--border-soft)' }}>|</span>
              <span>Total Available: {COMPANY_QUESTIONS_DATASET_META.totalQuestions.toLocaleString()} Qs across {COMPANY_QUESTIONS_DATASET_META.totalCompanies} Companies</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              *Frequency % reflects historical interview reports, not guarantees.
            </div>
          </div>

          {/* Company Selector & Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '16px' }}>
            {/* Company Selector Box */}
            <div
              className="card"
              style={{
                padding: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Select Target Company
              </label>
              <select
                className="input-field"
                value={selectedCompanySlug}
                onChange={(e) => {
                  setSelectedCompanySlug(e.target.value);
                  setPage(1);
                }}
                style={{ height: '40px', fontSize: '0.9rem', fontWeight: 600 }}
              >
                {datasetCompaniesList.map(comp => (
                  <option key={comp.slug} value={comp.slug}>
                    {comp.name} ({comp.questionCount} questions)
                  </option>
                ))}
              </select>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Viewing verified questions for <strong>{currentCompanyData?.name}</strong>.
              </div>
            </div>

            {/* Company-wise Progress Metrics */}
            <div
              className="card"
              style={{
                padding: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {currentCompanyData?.name} Practice Progress
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>
                  {companyMetrics.completionPct}% Solved ({companyMetrics.solved} / {companyMetrics.total})
                </span>
              </div>

              <div className="progress-bar-bg" style={{ height: '6px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${companyMetrics.completionPct}%`,
                    backgroundColor: 'var(--color-primary)'
                  }}
                />
              </div>

              {/* 5 Compact Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Total Qs</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{companyMetrics.total}</div>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Attempted</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{companyMetrics.attempted}</div>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-success)' }}>Solved</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-success)' }}>{companyMetrics.solved}</div>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-warning)' }}>Revision Backlog</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warning)' }}>{companyMetrics.revision}</div>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: '8px 10px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Remaining</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{companyMetrics.remaining}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Filters Bar */}
          <div
            className="card"
            style={{
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Search title, ID, topic..."
                value={questionSearch}
                onChange={(e) => {
                  setQuestionSearch(e.target.value);
                  setPage(1);
                }}
                style={{ paddingLeft: '30px', height: '34px', fontSize: '0.82rem' }}
              />
            </div>

            {/* Difficulty Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Difficulty:</span>
              <select
                className="input-field"
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setPage(1);
                }}
                style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px', width: 'auto' }}
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status:</span>
              <select
                className="input-field"
                value={selectedStatusFilter}
                onChange={(e) => {
                  setSelectedStatusFilter(e.target.value);
                  setPage(1);
                }}
                style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px', width: 'auto' }}
              >
                <option value="All">All Statuses</option>
                {QUESTION_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            {availableTopics.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Topic:</span>
                <select
                  className="input-field"
                  value={selectedTopicFilter}
                  onChange={(e) => {
                    setSelectedTopicFilter(e.target.value);
                    setPage(1);
                  }}
                  style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px', width: 'auto', maxWidth: '140px' }}
                >
                  <option value="All">All Topics</option>
                  {availableTopics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Results count */}
            <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Showing {filteredQuestions.length} questions
            </div>
          </div>

          {/* Questions Table */}
          <div
            className="card"
            style={{
              padding: '0',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Question Title</th>
                    <th style={{ width: '90px' }}>Difficulty</th>
                    <th style={{ width: '110px' }}>Topic</th>
                    <th style={{ width: '90px' }}>Acceptance</th>
                    <th style={{ width: '90px' }}>Frequency</th>
                    <th style={{ width: '130px' }}>Practice Status</th>
                    <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                        No questions found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedQuestions.map((q) => {
                      const prog = userProgressForCompany[q.id] || { status: 'Not Started' };
                      const currentStatus = prog.status || 'Not Started';

                      return (
                        <tr key={q.id}>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {q.problemId}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <a
                                href={q.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontWeight: 600,
                                  color: 'var(--text-main)',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                title="Open on LeetCode"
                              >
                                <span>{q.title}</span>
                                <ExternalLink size={12} style={{ color: 'var(--text-secondary)' }} />
                              </a>
                            </div>
                            {prog.notes && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Note: {prog.notes}
                              </div>
                            )}
                          </td>
                          <td>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background:
                                  q.difficulty === 'Easy'
                                    ? 'rgba(114, 214, 160, 0.15)'
                                    : q.difficulty === 'Medium'
                                    ? 'rgba(242, 200, 121, 0.15)'
                                    : 'rgba(232, 168, 194, 0.2)',
                                color:
                                  q.difficulty === 'Easy'
                                    ? 'var(--color-success)'
                                    : q.difficulty === 'Medium'
                                    ? 'var(--color-warning)'
                                    : 'var(--color-primary-text)'
                              }}
                            >
                              {q.difficulty}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {q.topic || 'General'}
                          </td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {q.acceptance}
                          </td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {q.frequency}
                          </td>
                          <td>
                            <select
                              className="input-field"
                              value={currentStatus}
                              onChange={(e) => handleQuickStatusChange(q, e.target.value)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 6px',
                                height: '28px',
                                width: 'auto',
                                color:
                                  currentStatus === 'Solved'
                                    ? 'var(--color-success)'
                                    : currentStatus === 'Needs Revision'
                                    ? 'var(--color-warning)'
                                    : 'var(--text-main)'
                              }}
                            >
                              {QUESTION_STATUSES.map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                className="btn btn-ghost"
                                style={{ padding: '4px 6px' }}
                                onClick={() => handleOpenLogModal(q)}
                                title="Log attempts, notes & revision"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                className="btn btn-ghost"
                                style={{ padding: '4px 6px', color: 'var(--color-primary-text)' }}
                                onClick={() => handleStartTimerSession(q)}
                                title="Start Study Timer for this problem"
                              >
                                <Play size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Strip */}
            {totalPages > 1 && (
              <div
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-soft)',
                  background: 'var(--bg-main)'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Page {page} of {totalPages}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    style={{ padding: '4px 8px' }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    style={{ padding: '4px 8px' }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LOG QUESTION PRACTICE DETAILS                      */}
      {/* ========================================================= */}
      {activeQuestion && (
        <Modal
          isOpen={!!activeQuestion}
          onClose={() => setActiveQuestion(null)}
          title={`Log Practice — ${activeQuestion.title}`}
        >
          <form onSubmit={handleSaveQuestionLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '4px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Company: </span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{currentCompanyData?.name}</strong>
              </div>
              <a
                href={activeQuestion.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
              >
                Open on LeetCode <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Practice Status</label>
                <select
                  className="input-field"
                  value={logFormData.status}
                  onChange={(e) => setLogFormData({ ...logFormData, status: e.target.value })}
                >
                  {QUESTION_STATUSES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Attempts Made</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={logFormData.attempts}
                  onChange={(e) => setLogFormData({ ...logFormData, attempts: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Time Spent (Minutes)</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={logFormData.timeSpent}
                  onChange={(e) => setLogFormData({ ...logFormData, timeSpent: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Revision Schedule Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={logFormData.revisionDate}
                  onChange={(e) => setLogFormData({ ...logFormData, revisionDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Personal Notes / Approach Summary</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Key intuition, time/space complexity, edge cases..."
                value={logFormData.notes}
                onChange={(e) => setLogFormData({ ...logFormData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveQuestion(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Practice Record
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT COMPANY                                 */}
      {/* ========================================================= */}
      {(isEditModalOpen || isAddModalOpen) && (
        <Modal
          isOpen={isEditModalOpen || isAddModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setIsAddModalOpen(false);
          }}
          title={isEditModalOpen ? `Edit ${selectedCompany?.name}` : 'Add Target Company'}
        >
          <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="input-label">Company Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="input-label">Target Role</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label">Tier / Track</label>
                <select
                  className="input-field"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Dream">Dream (Product / FinTech)</option>
                  <option value="Target">Target (Core Placement)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="input-label">Careers Portal URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://careers..."
                value={formData.careersUrl}
                onChange={(e) => setFormData({ ...formData, careersUrl: e.target.value })}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Preparation Checklist States
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.72rem' }}>DSA Preparation</label>
                  <select
                    className="input-field"
                    style={{ fontSize: '0.78rem' }}
                    value={formData.dsaPrepStatus}
                    onChange={(e) => setFormData({ ...formData, dsaPrepStatus: e.target.value })}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.72rem' }}>Core CS Preparation</label>
                  <select
                    className="input-field"
                    style={{ fontSize: '0.78rem' }}
                    value={formData.coreCsPrepStatus}
                    onChange={(e) => setFormData({ ...formData, coreCsPrepStatus: e.target.value })}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Learning">Learning</option>
                    <option value="Practised">Practised</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.72rem' }}>Aptitude Preparation</label>
                  <select
                    className="input-field"
                    style={{ fontSize: '0.78rem' }}
                    value={formData.aptitudePrepStatus}
                    onChange={(e) => setFormData({ ...formData, aptitudePrepStatus: e.target.value })}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.72rem' }}>Tailored Resume</label>
                  <select
                    className="input-field"
                    style={{ fontSize: '0.78rem' }}
                    value={formData.tailoredResumeStatus}
                    onChange={(e) => setFormData({ ...formData, tailoredResumeStatus: e.target.value })}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Application Status</label>
              <select
                className="input-field"
                value={formData.applicationStatus}
                onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
              >
                {APPLICATION_STATUSES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditModalOpen ? 'Save Changes' : 'Add Company'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

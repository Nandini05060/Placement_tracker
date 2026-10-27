import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  BookOpen,
  Code2,
  Calendar,
  Sparkles,
  Trash2,
  Tag,
  ThumbsUp,
  BrainCircuit,
  Filter,
  Check
} from 'lucide-react';
import { placementStore } from '../services/placementStore.js';
import { audioService } from '../services/audioService.js';
import { Modal } from '../components/Modal.jsx';

export function RevisionCenter({ data }) {
  const [activeTab, setActiveTab] = useState('queue'); // queue, mistakes
  const [queueFilter, setQueueFilter] = useState('all'); // all, due, overdue, upcoming
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRevisionModalOpen, setIsAddRevisionModalOpen] = useState(false);
  const [isAddMistakeModalOpen, setIsAddMistakeModalOpen] = useState(false);

  // Forms
  const [revisionForm, setRevisionForm] = useState({
    title: '',
    category: 'DSA Problem',
    intervalDays: 1,
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [mistakeForm, setMistakeForm] = useState({
    topic: '',
    mistake: '',
    fix: ''
  });

  const queue = data?.revisionQueue || [];
  const mistakes = data?.mistakeJournal || [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Due / Overdue classification
  const overdueItems = queue.filter(item => item.scheduledDate < todayStr);
  const dueTodayItems = queue.filter(item => item.scheduledDate === todayStr);
  const upcomingItems = queue.filter(item => item.scheduledDate > todayStr);

  const filteredQueue = queue.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (queueFilter === 'due') return item.scheduledDate === todayStr;
    if (queueFilter === 'overdue') return item.scheduledDate < todayStr;
    if (queueFilter === 'upcoming') return item.scheduledDate > todayStr;
    return true;
  });

  const filteredMistakes = mistakes.filter(m =>
    m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.mistake.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.fix.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReviewComplete = (id, difficulty) => {
    audioService.playSuccess();
    placementStore.completeRevisionReview(id, difficulty);
  };

  const handleAddRevision = (e) => {
    e.preventDefault();
    placementStore.addRevisionItem(revisionForm);
    audioService.playSuccess();
    setIsAddRevisionModalOpen(false);
    setRevisionForm({
      title: '',
      category: 'DSA Problem',
      intervalDays: 1,
      scheduledDate: todayStr,
      notes: ''
    });
  };

  const handleAddMistake = (e) => {
    e.preventDefault();
    placementStore.addMistakeEntry(mistakeForm);
    audioService.playSuccess();
    setIsAddMistakeModalOpen(false);
    setMistakeForm({ topic: '', mistake: '', fix: '' });
  };

  const handleDeleteMistake = (id) => {
    if (window.confirm('Delete this mistake journal entry?')) {
      placementStore.data.mistakeJournal = (placementStore.data.mistakeJournal || []).filter(m => m.id !== id);
      placementStore.notify('MISTAKE_DELETED', id);
    }
  };

  const handleDeleteRevision = (id) => {
    if (window.confirm('Remove from revision schedule?')) {
      placementStore.data.revisionQueue = (placementStore.data.revisionQueue || []).filter(r => r.id !== id);
      placementStore.notify('REVISION_DELETED', id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--color-lavender-soft) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary">Spaced Repetition System</span>
              <span className="badge badge-lavender">1, 3, 7 & 14 Day Intervals</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              Revision Center & Mistake Journal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '720px', margin: 0 }}>
              Retain critical algorithms, database concepts, and coding edge cases through evidence-backed spaced intervals and intentional error analysis.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setIsAddMistakeModalOpen(true)}>
              <Plus size={16} /> Log Mistake
            </button>
            <button className="btn btn-primary" onClick={() => setIsAddRevisionModalOpen(true)}>
              <Plus size={16} /> Schedule Revision
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '20px' }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-text)', fontWeight: 600 }}>Due Today</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>{dueTodayItems.length}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: '0.75rem', color: overdueItems.length > 0 ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: 600 }}>
              Overdue Backlog
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: overdueItems.length > 0 ? 'var(--color-danger)' : 'var(--text-main)' }}>
              {overdueItems.length}
            </div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Upcoming Scheduled</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{upcomingItems.length}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: 600 }}>Mistakes Documented</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning)' }}>{mistakes.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('queue')}
          >
            <RotateCcw size={14} /> Revision Queue ({queue.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'mistakes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('mistakes')}
          >
            <BrainCircuit size={14} /> Mistake Journal ({mistakes.length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder={activeTab === 'queue' ? 'Search revision topics...' : 'Search mistakes, fixes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px' }}
          />
        </div>
      </div>

      {/* TAB 1: REVISION QUEUE */}
      {activeTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sub-Filters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`btn btn-sm ${queueFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQueueFilter('all')}
            >
              All ({queue.length})
            </button>
            <button
              className={`btn btn-sm ${queueFilter === 'due' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQueueFilter('due')}
            >
              Due Today ({dueTodayItems.length})
            </button>
            <button
              className={`btn btn-sm ${queueFilter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQueueFilter('overdue')}
            >
              Overdue ({overdueItems.length})
            </button>
            <button
              className={`btn btn-sm ${queueFilter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setQueueFilter('upcoming')}
            >
              Upcoming ({upcomingItems.length})
            </button>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>All Caught Up!</div>
              <p style={{ fontSize: '0.86rem', maxWidth: '420px', margin: '6px auto 16px auto' }}>
                No topics due in this filter. Add new topics or solve DSA problems to queue spaced reviews.
              </p>
              <button className="btn btn-primary" onClick={() => setIsAddRevisionModalOpen(true)}>
                <Plus size={15} /> Add Topic to Spaced Queue
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredQueue.map(item => {
                const isOverdue = item.scheduledDate < todayStr;
                const isDueToday = item.scheduledDate === todayStr;

                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px',
                      borderLeft: isOverdue ? '4px solid var(--color-danger)' : isDueToday ? '4px solid var(--color-primary)' : '4px solid var(--border-soft)'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '260px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-lavender" style={{ fontSize: '0.7rem' }}>
                          {item.category}
                        </span>
                        {isOverdue && (
                          <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>
                            Overdue by {Math.round((new Date(todayStr) - new Date(item.scheduledDate)) / (1000 * 60 * 60 * 24))}d
                          </span>
                        )}
                        {isDueToday && (
                          <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                            Due Today
                          </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Review #{item.reviewCount || 1} • Last rated: {item.difficultyRating || 'Moderate'}
                        </span>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                        {item.title}
                      </div>

                      {item.notes && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {item.notes}
                        </div>
                      )}
                    </div>

                    {/* Quick Review Completion Rating Buttons (Easy, Moderate, Difficult) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rate & Reschedule:</span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleReviewComplete(item.id, 'Easy')}
                        title="Mastered (+7 days interval)"
                      >
                        Easy (+7d)
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleReviewComplete(item.id, 'Moderate')}
                        title="Understood with effort (+3 days interval)"
                      >
                        Moderate (+3d)
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReviewComplete(item.id, 'Difficult')}
                        title="Struggled / Forgot (+1 day interval)"
                      >
                        Difficult (+1d)
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '6px', color: 'var(--text-muted)' }}
                        onClick={() => handleDeleteRevision(item.id)}
                        title="Remove from queue"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MISTAKE JOURNAL */}
      {activeTab === 'mistakes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredMistakes.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <BrainCircuit size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>No Mistakes Recorded</div>
              <p style={{ fontSize: '0.86rem', maxWidth: '420px', margin: '6px auto 16px auto' }}>
                Every bug or wrong logic encountered during LeetCode or mock interviews is a golden learning asset. Document your errors and fixes here.
              </p>
              <button className="btn btn-primary" onClick={() => setIsAddMistakeModalOpen(true)}>
                <Plus size={15} /> Log First Mistake & Fix
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
              {filteredMistakes.map(entry => (
                <div key={entry.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span className="badge badge-lavender" style={{ fontSize: '0.72rem' }}>{entry.topic}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{entry.date}</div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '4px', color: 'var(--color-danger)' }}
                      onClick={() => handleDeleteMistake(entry.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '4px', borderLeft: '3px solid var(--color-danger)', marginBottom: '10px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-danger)', marginBottom: '2px' }}>The Mistake / Anti-Pattern:</div>
                    <div style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{entry.mistake}</div>
                  </div>

                  <div style={{ background: 'var(--bg-main)', padding: '10px 12px', borderRadius: '4px', borderLeft: '3px solid var(--color-success)', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', marginBottom: '2px' }}>The Correct Pattern / Fix:</div>
                    <div style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{entry.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Revision Item Modal */}
      {isAddRevisionModalOpen && (
        <Modal title="Schedule Topic for Spaced Revision" onClose={() => setIsAddRevisionModalOpen(false)}>
          <form onSubmit={handleAddRevision} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label">Topic or Problem Title *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Kadane's Algorithm, MySQL Indexing, QuickSort"
                value={revisionForm.title}
                onChange={(e) => setRevisionForm({ ...revisionForm, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="label">Category</label>
                <select
                  className="input-field"
                  value={revisionForm.category}
                  onChange={(e) => setRevisionForm({ ...revisionForm, category: e.target.value })}
                >
                  <option value="DSA Problem">DSA Problem</option>
                  <option value="Core CS Subject">Core CS Subject</option>
                  <option value="Aptitude Formula">Aptitude Formula</option>
                  <option value="Project Architecture">Project Architecture</option>
                  <option value="HR Question">HR Question</option>
                </select>
              </div>

              <div>
                <label className="label">Next Scheduled Date</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={revisionForm.scheduledDate}
                  onChange={(e) => setRevisionForm({ ...revisionForm, scheduledDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Revision Notes & Key Reminders</label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="Boundary conditions, edge cases, or memory triggers..."
                value={revisionForm.notes}
                onChange={(e) => setRevisionForm({ ...revisionForm, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddRevisionModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add to Spaced Queue
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Mistake Entry Modal */}
      {isAddMistakeModalOpen && (
        <Modal title="Document Mistake in Journal" onClose={() => setIsAddMistakeModalOpen(false)}>
          <form onSubmit={handleAddMistake} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label">Topic / Area *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Binary Search Midpoint, SQL GROUP BY, Java Static Context"
                value={mistakeForm.topic}
                onChange={(e) => setMistakeForm({ ...mistakeForm, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="label">What was the mistake or erroneous assumption? *</label>
              <textarea
                required
                className="input-field"
                rows="3"
                placeholder="e.g. Calculated mid = (low + high) / 2 which caused integer overflow with large arrays..."
                value={mistakeForm.mistake}
                onChange={(e) => setMistakeForm({ ...mistakeForm, mistake: e.target.value })}
              />
            </div>

            <div>
              <label className="label">What is the correct fix and invariant? *</label>
              <textarea
                required
                className="input-field"
                rows="3"
                placeholder="e.g. Use mid = low + (high - low) / 2 instead..."
                value={mistakeForm.fix}
                onChange={(e) => setMistakeForm({ ...mistakeForm, fix: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAddMistakeModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save to Journal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

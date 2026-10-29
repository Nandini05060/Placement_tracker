import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Timer,
  Map,
  Code2,
  Brain,
  BookOpen,
  Users,
  Award,
  FolderGit2,
  Building2,
  FileText,
  MessageSquareCode,
  RotateCcw,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'DAILY EXECUTION',
    items: [
      { id: 'planner', label: 'Daily Planner', icon: Calendar },
      { id: 'timer', label: 'Study Timer', icon: Timer }
    ]
  },
  {
    title: 'PREPARATION',
    items: [
      { id: 'term-end', label: 'Term End Prep', icon: GraduationCap, badge: 'Sem V' },
      { id: 'roadmap', label: 'Placement Roadmap', icon: Map },
      { id: 'dsa', label: 'DSA Practice', icon: Code2 },
      { id: 'aptitude', label: 'Aptitude', icon: Brain },
      { id: 'core-cs', label: 'Core Subjects', icon: BookOpen },
      { id: 'soft-skills', label: 'Soft Skills', icon: Users },
      { id: 'revision', label: 'Revision Center', icon: RotateCcw }
    ]
  },
  {
    title: 'CAREER & PORTFOLIO',
    items: [
      { id: 'certifications', label: 'Certifications', icon: Award },
      { id: 'projects', label: 'Projects', icon: FolderGit2 },
      { id: 'companies', label: 'Target Companies', icon: Building2 },
      { id: 'resumes', label: 'Resume & Applications', icon: FileText },
      { id: 'mock-interviews', label: 'Mock Interviews', icon: MessageSquareCode }
    ]
  },
  {
    title: 'INSIGHTS',
    items: [
      { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export function Sidebar({ activeView, setActiveView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, settings }) {
  const studentName = settings?.studentName || 'Nandini';
  const collegeInfo = settings?.college ? `${settings.college}${settings.gradYear ? ` • Class of ${settings.gradYear}` : ''}` : '3rd Year • B.Tech CSE';
  const initial = studentName.charAt(0).toUpperCase() || 'N';
  const profilePic = settings?.profilePic;
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? '72px' : 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-soft)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease',
          transform: isMobileOpen ? 'translateX(0)' : undefined,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--topbar-height)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            {/* Custom Monogram N Logo */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-pale)',
                border: '1px solid var(--color-primary-blush)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.25rem',
                fontFamily: 'var(--font-heading)',
                boxShadow: 'var(--shadow-xs)',
                flexShrink: 0,
                position: 'relative'
              }}
            >
              <span>N</span>
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-sage)',
                  border: '2px solid var(--bg-sidebar)'
                }}
              />
            </div>

            {!isCollapsed && (
              <div style={{ lineHeight: 1.15 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    letterSpacing: '-0.01em',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  Nandini
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}
                >
                  Placement Journal
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Mobile Close Button */}
              {isMobileOpen && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsMobileOpen(false)}
                  style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
                  title="Close Navigation"
                  aria-label="Close Navigation"
                >
                  <X size={16} />
                </button>
              )}
              {/* Desktop Collapse Button */}
              <button
                className="btn btn-ghost"
                onClick={() => setIsCollapsed(true)}
                style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Collapsed Expand Trigger */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <button
              className="btn btn-ghost"
              onClick={() => setIsCollapsed(false)}
              style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <div
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    padding: '3px 10px 5px 10px'
                  }}
                >
                  {group.title}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        if (setIsMobileOpen) setIsMobileOpen(false);
                      }}
                      title={isCollapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '11px',
                        padding: isCollapsed ? '9px 0' : '8px 12px',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--color-primary-blush)' : 'transparent',
                        backgroundColor: isActive ? 'var(--color-primary-pale)' : 'transparent',
                        color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.16s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                          e.currentTarget.style.color = 'var(--text-main)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '22%',
                            bottom: '22%',
                            width: '3px',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: '0 3px 3px 0'
                          }}
                        />
                      )}
                      <Icon
                        size={16}
                        style={{
                          color: isActive ? 'var(--color-primary)' : 'currentColor',
                          flexShrink: 0
                        }}
                      />
                      {!isCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minWidth: 0 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-primary-pale)',
                                color: isActive ? '#FFFFFF' : 'var(--color-primary-text)',
                                border: isActive ? 'none' : '1px solid var(--color-primary-blush)',
                                flexShrink: 0,
                                marginLeft: '6px'
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile & Quick Status Footer */}
        <div
          style={{
            padding: isCollapsed ? '12px 6px' : '12px 14px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', minWidth: 0 }}
            onClick={() => setActiveView('settings')}
            title={isCollapsed ? `${studentName} • Settings` : undefined}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: profilePic ? 'none' : 'linear-gradient(135deg, var(--color-primary-blush) 0%, var(--bg-hover) 100%)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.86rem',
                border: '1.5px solid var(--border-soft)',
                flexShrink: 0,
                overflow: 'hidden'
              }}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={studentName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            {!isCollapsed && (
              <div style={{ lineHeight: 1.25, minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {studentName}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {collegeInfo}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              className="btn btn-ghost"
              style={{ padding: '6px', borderRadius: '50%' }}
              onClick={() => setActiveView('settings')}
              title="Settings"
              aria-label="Settings"
            >
              <Settings size={15} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

import React, { useState, useEffect } from 'react';
import { usePlacementData } from './hooks/usePlacementData.js';
import { placementStore } from './services/placementStore.js';
import { audioService } from './services/audioService.js';
import { Sidebar } from './components/Sidebar.jsx';
import { Topbar } from './components/Topbar.jsx';

// 16 Page Components
import { Dashboard } from './pages/Dashboard.jsx';
import { DailyPlanner } from './pages/DailyPlanner.jsx';
import { StudyTimer } from './pages/StudyTimer.jsx';
import { Roadmap } from './pages/Roadmap.jsx';
import { DsaTracker } from './pages/DsaTracker.jsx';
import { AptitudeTracker } from './pages/AptitudeTracker.jsx';
import { CoreCsTracker } from './pages/CoreCsTracker.jsx';
import { SoftSkillsTracker } from './pages/SoftSkillsTracker.jsx';
import { CertificationsTracker } from './pages/CertificationsTracker.jsx';
import { ProjectsTracker } from './pages/ProjectsTracker.jsx';
import { TargetCompanies } from './pages/TargetCompanies.jsx';
import { ResumeApplications } from './pages/ResumeApplications.jsx';
import { MockInterviews } from './pages/MockInterviews.jsx';
import { RevisionCenter } from './pages/RevisionCenter.jsx';
import { AnalyticsReports } from './pages/AnalyticsReports.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

export default function App() {
  const { data, loading } = usePlacementData();

  // Navigation view state with hash support
  const getInitialView = () => {
    const hash = window.location.hash.replace('#view-', '').replace('#', '');
    const validViews = [
      'dashboard', 'planner', 'timer', 'roadmap', 'dsa', 'aptitude',
      'core-cs', 'soft-skills', 'certifications', 'projects', 'companies',
      'resumes', 'mock-interviews', 'revision', 'analytics', 'settings'
    ];
    return validViews.includes(hash) ? hash : 'dashboard';
  };

  const [activeView, setActiveView] = useState(getInitialView);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Theme & Audio state
  const currentTheme = data?.settings?.theme || 'light';
  const soundEnabled = data?.settings?.soundEnabled !== false;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (newTheme) => {
    placementStore.updateSettings({ theme: newTheme });
  };

  const setSoundEnabled = (enabled) => {
    placementStore.updateSettings({ soundEnabled: enabled });
    audioService.setEnabled(enabled);
  };

  // Sync hash with active view
  useEffect(() => {
    window.location.hash = `view-${activeView}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#view-', '').replace('#', '');
      if (hash && hash !== activeView) {
        setActiveView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeView]);

  if (loading || !data) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-text)' }}>Nandini | Placement Journey</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Initializing preparation workspace...</div>
        </div>
      </div>
    );
  }

  // Calculate live values for Topbar
  const daysRemaining = placementStore.getDaysRemaining();
  const streakInfo = placementStore.getStreakInfo();
  const todayStudiedMinutes = placementStore.getTodayStudiedMinutes();
  const dailyTargetMinutes = data.settings?.dailyTargetMinutes || 120;

  // Render current view
  const renderView = () => {
    const commonProps = {
      data,
      store: placementStore,
      onNavigate: setActiveView,
      setActiveView
    };

    switch (activeView) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'planner':
        return <DailyPlanner {...commonProps} />;
      case 'timer':
        return <StudyTimer {...commonProps} />;
      case 'roadmap':
        return <Roadmap {...commonProps} />;
      case 'dsa':
        return <DsaTracker {...commonProps} />;
      case 'aptitude':
        return <AptitudeTracker {...commonProps} />;
      case 'core-cs':
        return <CoreCsTracker {...commonProps} />;
      case 'soft-skills':
        return <SoftSkillsTracker {...commonProps} />;
      case 'certifications':
        return <CertificationsTracker {...commonProps} />;
      case 'projects':
        return <ProjectsTracker {...commonProps} />;
      case 'companies':
        return <TargetCompanies {...commonProps} />;
      case 'resumes':
        return <ResumeApplications {...commonProps} />;
      case 'mock-interviews':
        return <MockInterviews {...commonProps} />;
      case 'revision':
        return <RevisionCenter {...commonProps} />;
      case 'analytics':
        return <AnalyticsReports {...commonProps} />;
      case 'settings':
        return <SettingsPage {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setIsMobileOpen(false);
        }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        settings={data.settings}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          marginLeft: isCollapsed ? '72px' : 'var(--sidebar-width)',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.25s ease'
        }}
      >
        <Topbar
          activeView={activeView}
          daysRemaining={daysRemaining}
          streakInfo={streakInfo}
          todayStudiedMinutes={todayStudiedMinutes}
          dailyTargetMinutes={dailyTargetMinutes}
          theme={currentTheme}
          setTheme={setTheme}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          setIsMobileOpen={setIsMobileOpen}
          onNavigate={setActiveView}
          settings={data.settings}
        />

        <main style={{ flex: 1, padding: '28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}

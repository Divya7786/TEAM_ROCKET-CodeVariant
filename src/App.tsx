import React, { useState } from 'react';
import { GraveyardProvider, useGraveyard } from './context/GraveyardContext';
import { GhostIntro } from './components/GhostIntro';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { BuryModal } from './components/BuryModal';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { Toast } from './components/Toast';

// Pages
import { Dashboard } from './pages/Dashboard';
import { DigitalGraveyard } from './pages/DigitalGraveyard';
import { RevivalAdvisor } from './pages/RevivalAdvisor';
import { ReuseEngine } from './pages/ReuseEngine';
import { RisenProjects } from './pages/RisenProjects';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useGraveyard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'graveyard':
        return <DigitalGraveyard />;
      case 'advisor':
        return <RevivalAdvisor />;
      case 'reuse':
        return <ReuseEngine />;
      case 'risen':
        return <RisenProjects />;
      case 'activity':
        return <ActivityPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Cinematic Scary Ghost Intro Overlay */}
      <GhostIntro />

      {/* Desktop / Drawer Sidebar */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
        <main className="page-content" id="main-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <BuryModal />
      <ProjectDetailsModal />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GraveyardProvider>
      <AppContent />
    </GraveyardProvider>
  );
};

export default App;

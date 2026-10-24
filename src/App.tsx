import React, { useState } from 'react';
import { AuthProvider, useAuth } from './auth/authContext';
import { GraveyardProvider, useGraveyard } from './context/GraveyardContext';
import { GhostIntro } from './components/GhostIntro';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { BuryModal } from './components/BuryModal';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { Toast } from './components/Toast';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Pages
import { Dashboard } from './pages/Dashboard';
import { DigitalGraveyard } from './pages/DigitalGraveyard';
import { RevivalAdvisor } from './pages/RevivalAdvisor';
import { ReuseEngine } from './pages/ReuseEngine';
import { RisenProjects } from './pages/RisenProjects';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';

// ── Main graveyard app (existing) ──────────────────────────────────────────
const GraveyardApp: React.FC = () => {
  const { activeTab } = useGraveyard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':   return <Dashboard />;
      case 'graveyard':  return <DigitalGraveyard />;
      case 'advisor':    return <RevivalAdvisor />;
      case 'reuse':      return <ReuseEngine />;
      case 'risen':      return <RisenProjects />;
      case 'activity':   return <ActivityPage />;
      case 'settings':   return <SettingsPage />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <GhostIntro />
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <div className="main-content-wrapper">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
        <main className="page-content" id="main-content">
          {renderActivePage()}
        </main>
      </div>
      <MobileNav />
      <BuryModal />
      <ProjectDetailsModal />
      <Toast />
    </div>
  );
};

// ── Auth-aware router ───────────────────────────────────────────────────────
const AppRouter: React.FC = () => {
  const { currentView } = useAuth();

  if (currentView === 'login') return <LoginPage />;
  if (currentView === 'admin') return <AdminDashboard />;
  return <GraveyardApp />;
};

// ── Root ────────────────────────────────────────────────────────────────────
export const App: React.FC = () => (
  <AuthProvider>
    <GraveyardProvider>
      <AppRouter />
    </GraveyardProvider>
  </AuthProvider>
);

export default App;

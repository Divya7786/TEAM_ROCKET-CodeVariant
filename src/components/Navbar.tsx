import React from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Palette,
  Menu,
  RotateCcw,
} from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    searchQuery,
    setSearchQuery,
    setIsBuryModalOpen,
    settings,
    setTheme,
    replayIntro,
    activeTab,
  } = useGraveyard();

  const handleNextTheme = () => {
    if (settings.theme === 'dark') setTheme('light');
    else if (settings.theme === 'light') setTheme('purple');
    else setTheme('dark');
  };

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    graveyard: 'Digital Graveyard',
    advisor: 'Revival Advisor',
    reuse: 'Reuse Engine',
    risen: 'Risen Projects',
    activity: 'Activity & Telemetry',
    settings: 'Settings & Preferences',
  };

  return (
    <header className="graveyard-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-breadcrumb">
          <span className="breadcrumb-root">Graveyard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{pageTitles[activeTab] || 'Overview'}</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="global-search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search buried projects, snippets, tech stacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="global-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {/* Quick Intro Replay button */}
        <button
          onClick={replayIntro}
          className="navbar-icon-btn"
          title="Replay Scary Ghost Intro"
          aria-label="Replay Scary Ghost Intro"
        >
          <RotateCcw size={16} />
          <span className="btn-label-desktop">Intro</span>
        </button>

        {/* Theme quick switcher */}
        <button
          onClick={handleNextTheme}
          className="navbar-icon-btn theme-toggle-btn"
          title={`Theme: ${settings.theme}. Click to switch theme.`}
          aria-label="Toggle Theme"
        >
          {settings.theme === 'dark' && <Moon size={16} className="theme-icon-dark" />}
          {settings.theme === 'light' && <Sun size={16} className="theme-icon-light" />}
          {settings.theme === 'purple' && <Palette size={16} className="theme-icon-purple" />}
          <span className="theme-badge-name">
            {settings.theme === 'dark' ? 'Dark' : settings.theme === 'light' ? 'Light' : 'Purple'}
          </span>
        </button>

        {/* Quick Bury Project CTA */}
        <button
          onClick={() => setIsBuryModalOpen(true)}
          className="btn-primary navbar-bury-cta"
          id="btn-nav-bury"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Bury a project</span>
        </button>
      </div>
    </header>
  );
};

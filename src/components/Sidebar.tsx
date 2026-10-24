import React from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import type { NavTab } from '../context/GraveyardContext';
import ghostMascot from '../assets/images/ghost-mascot.png';
import {
  LayoutDashboard,
  Archive,
  Compass,
  Boxes,
  Zap,
  Activity,
  Settings,
  Plus,
  Sparkles,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const {
    activeTab,
    setActiveTab,
    setIsBuryModalOpen,
    projects,
    settings,
  } = useGraveyard();

  const buriedCount = projects.filter((p) => p.status === 'buried').length;
  const risenCount = projects.filter((p) => p.status === 'risen').length;

  const navItems: { tab: NavTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      tab: 'graveyard',
      label: 'Digital Graveyard',
      icon: <Archive size={18} />,
      badge: buriedCount,
    },
    {
      tab: 'advisor',
      label: 'Revival Advisor',
      icon: <Compass size={18} />,
    },
    {
      tab: 'reuse',
      label: 'Reuse Engine',
      icon: <Boxes size={18} />,
    },
    {
      tab: 'risen',
      label: 'Risen',
      icon: <Zap size={18} />,
      badge: risenCount > 0 ? risenCount : undefined,
    },
    {
      tab: 'activity',
      label: 'Activity',
      icon: <Activity size={18} />,
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <Settings size={18} />,
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`graveyard-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand" onClick={() => handleNavClick('dashboard')}>
          <div className="brand-logo-icon">
            <img className="brand-logo-image" src={ghostMascot} alt="" />
          </div>
          <div className="brand-text">
            <div className="brand-name">THE PROJECT GRAVEYARD</div>
            <div className="brand-sub">Second life for code</div>
          </div>
        </div>

        {/* Action Button: + Bury a project */}
        <div className="sidebar-cta-wrap">
          <button
            onClick={() => setIsBuryModalOpen(true)}
            className="sidebar-bury-btn"
            id="btn-sidebar-bury"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Bury a project</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">SYSTEMS</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <li key={item.tab}>
                  <button
                    onClick={() => handleNavClick(item.tab)}
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    id={`nav-${item.tab}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`nav-badge ${isActive ? 'active-badge' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer: User profile */}
        <div className="sidebar-footer">
          <div
            className="user-profile-card"
            onClick={() => handleNavClick('settings')}
            title="Go to Settings"
          >
            <div className="user-avatar">
              <span>{settings.userName ? settings.userName.slice(0, 2).toUpperCase() : 'AL'}</span>
              <span className="online-indicator" />
            </div>
            <div className="user-info">
              <span className="user-name">{settings.userName}</span>
              <span className="user-role">{settings.userRole}</span>
            </div>
            <Sparkles size={14} className="user-glow-icon" />
          </div>
        </div>
      </aside>
    </>
  );
};

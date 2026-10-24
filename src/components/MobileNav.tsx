import React from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import type { NavTab } from '../context/GraveyardContext';
import {
  LayoutDashboard,
  Archive,
  Compass,
  Boxes,
  Settings,
} from 'lucide-react';
import './MobileNav.css';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGraveyard();

  const navItems: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { tab: 'graveyard', label: 'Graveyard', icon: <Archive size={20} /> },
    { tab: 'advisor', label: 'Advisor', icon: <Compass size={20} /> },
    { tab: 'reuse', label: 'Reuse', icon: <Boxes size={20} /> },
    { tab: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-nav-inner">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              id={`mobile-nav-${item.tab}`}
            >
              <div className="mobile-icon-wrap">
                {item.icon}
                {isActive && <div className="active-dot" />}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

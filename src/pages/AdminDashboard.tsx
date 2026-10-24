import React from 'react';
import {
  Ghost,
  Skull,
  Zap,
  Archive,
  Boxes,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Shield,
  Settings,
  RefreshCw,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { useAuth } from '../auth/authContext';
import { useGraveyard } from '../context/GraveyardContext';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const { session, logout, navigateToApp } = useAuth();
  const { projects, snippets, activities } = useGraveyard();

  const buried   = projects.filter((p) => p.status === 'buried');
  const risen    = projects.filter((p) => p.status === 'risen');
  const archived = projects.filter((p) => p.status === 'archived');

  const loginDate = session
    ? new Date(session.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="admin-page">
      {/* ── Top bar ── */}
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <div className="admin-topbar-icon">
            <Ghost size={18} color="#c084fc" strokeWidth={1.8} />
          </div>
          <div>
            <div className="admin-topbar-name">The Project Graveyard</div>
            <div className="admin-topbar-sub">Admin Portal</div>
          </div>
        </div>

        <div className="admin-topbar-actions">
          {session && (
            <div className="admin-topbar-user">
              <Shield size={13} />
              <span>{session.displayName}</span>
            </div>
          )}

          <button className="btn-secondary" onClick={navigateToApp}>
            <ExternalLink size={14} />
            Main Website
          </button>

          <button className="btn-danger" onClick={logout}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="admin-content">

        {/* ── Welcome banner ── */}
        <div className="admin-welcome-banner">
          <div className="welcome-avatar" aria-hidden>👻</div>
          <div className="welcome-text">
            <h2>Welcome back, {session?.displayName?.split('—')[0].trim() ?? 'Admin'}!</h2>
            <p>
              You have access to the Project Graveyard admin panel.
              Session started at {loginDate}.
            </p>
            <div className="welcome-badges">
              <span className="welcome-badge badge-admin">
                <Shield size={10} /> Admin
              </span>
              <span className="welcome-badge badge-demo">
                ⚠️ Demo Prototype
              </span>
            </div>
          </div>
          <div className="welcome-spacer" />
        </div>

        {/* ── Security notice ── */}
        <div className="admin-security-notice">
          <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>Demo only.</strong> This authentication is frontend-only and not production-safe.
            Route protection here hides UI; it does not protect data.
            Replace with <strong>Supabase Auth</strong> (or similar) for real deployments.
            See <code>src/auth/authContext.tsx</code> for migration instructions.
          </span>
        </div>

        {/* ── Stats ── */}
        <div>
          <div className="admin-section-header">
            <div>
              <h3 className="admin-section-title">Project Statistics</h3>
              <p className="admin-section-sub">Live data from localStorage — real project counts</p>
            </div>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon stat-icon-purple">
                <Ghost size={20} color="#c084fc" />
              </div>
              <div>
                <div className="admin-stat-num">{projects.length}</div>
                <div className="admin-stat-label">Total Projects</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon stat-icon-amber">
                <Skull size={20} color="#f59e0b" />
              </div>
              <div>
                <div className="admin-stat-num">{buried.length}</div>
                <div className="admin-stat-label">Buried</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon stat-icon-green">
                <Zap size={20} color="#80DC48" />
              </div>
              <div>
                <div className="admin-stat-num">{risen.length}</div>
                <div className="admin-stat-label">Risen / Revived</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon stat-icon-blue">
                <Archive size={20} color="#38bdf8" />
              </div>
              <div>
                <div className="admin-stat-num">{archived.length}</div>
                <div className="admin-stat-label">Archived</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon stat-icon-purple">
                <Boxes size={20} color="#c084fc" />
              </div>
              <div>
                <div className="admin-stat-num">{snippets.length}</div>
                <div className="admin-stat-label">Reusable Snippets</div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon stat-icon-green">
                <Activity size={20} color="#80DC48" />
              </div>
              <div>
                <div className="admin-stat-num">{activities.length}</div>
                <div className="admin-stat-label">Activity Events</div>
                <div className="admin-stat-demo">live data</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Projects table ── */}
        <div>
          <div className="admin-section-header">
            <div>
              <h3 className="admin-section-title">All Projects</h3>
              <p className="admin-section-sub">Sorted by revival score (highest first)</p>
            </div>
          </div>

          <div className="admin-projects-table">
            <div className="admin-table-header">
              <span>Project</span>
              <span>Category</span>
              <span>Status</span>
              <span>Score</span>
              <span>Last Updated</span>
            </div>
            {[...projects]
              .sort((a, b) => b.revivalScore - a.revivalScore)
              .map((proj) => (
                <div key={proj.id} className="admin-table-row">
                  <div>
                    <div className="admin-proj-name">{proj.name}</div>
                    <div className="admin-proj-cat">{proj.tagline.slice(0, 48)}{proj.tagline.length > 48 ? '…' : ''}</div>
                  </div>
                  <span className="admin-proj-cat">{proj.category}</span>
                  <span>
                    <span className={`admin-status-pill status-${proj.status}`}>
                      {proj.status}
                    </span>
                  </span>
                  <span className="admin-proj-score">{proj.revivalScore}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(proj.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div>
          <div className="admin-section-header">
            <div>
              <h3 className="admin-section-title">Quick Actions</h3>
              <p className="admin-section-sub">Navigate to main website sections</p>
            </div>
          </div>

          <div className="admin-actions-grid">
            <button className="admin-action-card" onClick={navigateToApp}>
              <div className="action-card-icon">
                <LayoutDashboard size={18} color="#c084fc" />
              </div>
              <div>
                <p className="action-card-title">Dashboard</p>
                <p className="action-card-desc">Return to the main graveyard app</p>
              </div>
            </button>

            <button className="admin-action-card" onClick={navigateToApp}>
              <div className="action-card-icon">
                <Skull size={18} color="#f87171" />
              </div>
              <div>
                <p className="action-card-title">Digital Graveyard</p>
                <p className="action-card-desc">Browse and manage buried projects</p>
              </div>
            </button>

            <button className="admin-action-card" onClick={navigateToApp}>
              <div className="action-card-icon">
                <RefreshCw size={18} color="#80DC48" />
              </div>
              <div>
                <p className="action-card-title">Revival Advisor</p>
                <p className="action-card-desc">AI-style revival recommendations</p>
              </div>
            </button>

            <button className="admin-action-card" onClick={navigateToApp}>
              <div className="action-card-icon">
                <Settings size={18} color="#38bdf8" />
              </div>
              <div>
                <p className="action-card-title">Settings</p>
                <p className="action-card-desc">Configure themes and preferences</p>
              </div>
            </button>
          </div>
        </div>

        {/* ── Recent activity ── */}
        <div>
          <div className="admin-section-header">
            <div>
              <h3 className="admin-section-title">Recent Activity</h3>
              <p className="admin-section-sub">Last 5 events from the crypt</p>
            </div>
          </div>

          <div className="admin-projects-table">
            <div className="admin-table-header" style={{ gridTemplateColumns: '1fr 2fr auto' }}>
              <span>Event</span>
              <span>Description</span>
              <span>Time</span>
            </div>
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="admin-table-row"
                style={{ gridTemplateColumns: '1fr 2fr auto' }}
              >
                <div className="admin-proj-name" style={{ fontSize: '0.82rem' }}>{act.title}</div>
                <div className="admin-proj-cat">{act.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {act.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

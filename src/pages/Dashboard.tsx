import React, { useRef, useState } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import ghostMascot from '../assets/images/ghost-mascot.png';
import {
  Skull,
  Zap,
  Clock,
  Boxes,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  GripVertical,
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const {
    projects,
    snippets,
    activities,
    settings,
    setActiveTab,
    setSelectedProjectId,
    setIsDetailModalOpen,
    setIsBuryModalOpen,
    reviveProject,
    showToast,
  } = useGraveyard();

  const buriedProjects = projects.filter((p) => p.status === 'buried');
  const risenProjects = projects.filter((p) => p.status === 'risen');
  const archivedProjects = projects.filter((p) => p.status === 'archived');

  // Sorted by revival score descending for the "Revival Radar"
  const revivalRadar = [...buriedProjects]
    .sort((a, b) => b.revivalScore - a.revivalScore)
    .slice(0, 3);

  // Recent buried projects
  const recentBuried = [...buriedProjects]
    .sort((a, b) => new Date(b.dateBuried).getTime() - new Date(a.dateBuried).getTime())
    .slice(0, 4);

  // DnD state for Revival Radar
  const [draggingRadarId, setDraggingRadarId] = useState<string | null>(null);
  const [reviveZoneActive, setReviveZoneActive] = useState(false);
  const [reviveZoneInvalid, setReviveZoneInvalid] = useState(false);
  const reviveEnterCount = useRef(0);

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="dashboard-page">
      {/* User Greeting */}
      <div className="dashboard-header">
        <h1 className="greeting-text">
          Good evening, <span className="greeting-name">{settings.userName}.</span>
        </h1>
        <p className="greeting-sub">Welcome back to your digital mausoleum of code and ideas.</p>
      </div>

      {/* Hero Banner with Supernatural Ghost */}
      <div className="dashboard-hero spectral-card">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} color="var(--accent-green)" />
            <span>SPECTRAL REVIVAL SYSTEM</span>
          </div>
          <h2 className="hero-title">
            Your unfinished projects deserve a second life.
          </h2>
          <p className="hero-desc">
            Don&apos;t let good architecture decay in private repos. Exhume buried code,
            harvest reusable hooks and components, or resurrect complete MVPs with
            rule-based revival checklists.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => setIsBuryModalOpen(true)}
              className="btn-primary"
              id="hero-bury-btn"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Bury a project</span>
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className="btn-secondary"
            >
              <span>Explore Advisor</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="hero-ghost-visual">
          <div className="ghost-ambient-glow" />
          <img
            className="dashboard-ghost-mascot"
            src={ghostMascot}
            alt="A spectral ghost wreathed in dark smoke and toxic-green energy"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-row-grid">
        <div className="stat-card spectral-card" onClick={() => setActiveTab('graveyard')}>
          <div className="stat-icon-wrap icon-buried">
            <Skull size={20} />
          </div>
          <div className="stat-details">
            <div className="stat-count">{buriedProjects.length}</div>
            <div className="stat-label">Buried Projects</div>
          </div>
          <ChevronRight size={16} className="stat-arrow" />
        </div>

        <div className="stat-card spectral-card" onClick={() => setActiveTab('risen')}>
          <div className="stat-icon-wrap icon-risen">
            <Zap size={20} />
          </div>
          <div className="stat-details">
            <div className="stat-count">{risenProjects.length}</div>
            <div className="stat-label">Revived &amp; Risen</div>
          </div>
          <ChevronRight size={16} className="stat-arrow" />
        </div>

        <div className="stat-card spectral-card" onClick={() => setActiveTab('risen')}>
          <div className="stat-icon-wrap icon-progress">
            <Clock size={20} />
          </div>
          <div className="stat-details">
            <div className="stat-count">{risenProjects.length}</div>
            <div className="stat-label">Active Reboot Sprints</div>
          </div>
          <ChevronRight size={16} className="stat-arrow" />
        </div>

        <div className="stat-card spectral-card" onClick={() => setActiveTab('reuse')}>
          <div className="stat-icon-wrap icon-snippets">
            <Boxes size={20} />
          </div>
          <div className="stat-details">
            <div className="stat-count">{snippets.length}</div>
            <div className="stat-label">Reusable Snippets</div>
          </div>
          <ChevronRight size={16} className="stat-arrow" />
        </div>
      </div>

      {/* Main Grid: Revival Radar + Activity */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Revival Radar & Cemetery Highlights */}
        <div className="dashboard-col-left">
          {/* Revival Radar */}
          <div className="section-header-row">
            <div>
              <h3 className="section-title">Revival Radar</h3>
              <p className="section-subtitle">Drag a candidate into the RESURRECT zone below</p>
            </div>
            <button
              onClick={() => setActiveTab('advisor')}
              className="btn-ghost"
            >
              Open Advisor <ArrowRight size={14} />
            </button>
          </div>

          {/* DnD hint */}
          {revivalRadar.length > 0 && (
            <div className="radar-dnd-banner">
              <GripVertical size={13} color="var(--text-muted)" />
              <span>Drag a radar card to the <strong>RESURRECT</strong> zone to revive it</span>
            </div>
          )}

          <div className="radar-cards-list">
            {revivalRadar.map((proj) => {
              const isDragging = draggingRadarId === proj.id;
              return (
                <div
                  key={proj.id}
                  className={`radar-card spectral-card ${isDragging ? 'radar-card-dragging' : ''}`}
                  draggable
                  onClick={() => handleOpenProject(proj.id)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', proj.id);
                    setDraggingRadarId(proj.id);
                  }}
                  onDragEnd={() => {
                    setDraggingRadarId(null);
                    setReviveZoneActive(false);
                    reviveEnterCount.current = 0;
                  }}
                >
                  <div className="radar-drag-grip" title="Drag to resurrect">
                    <GripVertical size={14} color="var(--text-muted)" />
                  </div>
                  <div className="radar-score-dial">
                    <span className="radar-score-num">{proj.revivalScore}</span>
                    <span className="radar-score-unit">/100</span>
                  </div>
                  <div className="radar-info">
                    <div className="radar-title-row">
                      <span className="radar-name">{proj.name}</span>
                      <span className="badge">{proj.category}</span>
                    </div>
                    <p className="radar-tagline">{proj.tagline}</p>
                    <div className="radar-reasoning-chip">
                      <TrendingUp size={12} color="var(--accent-green)" />
                      <span>{proj.revivalScores.reasoning}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESURRECT drop zone */}
          {revivalRadar.length > 0 && (
            <div
              className={[
                'radar-resurrect-zone',
                reviveZoneActive ? 'resurrect-zone-active' : '',
                reviveZoneInvalid ? 'resurrect-zone-invalid' : '',
              ].filter(Boolean).join(' ')}
              onDragEnter={(e) => {
                e.preventDefault();
                reviveEnterCount.current++;
                setReviveZoneActive(true);
                setReviveZoneInvalid(false);
              }}
              onDragLeave={() => {
                reviveEnterCount.current = Math.max(0, reviveEnterCount.current - 1);
                if (reviveEnterCount.current === 0) setReviveZoneActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                reviveEnterCount.current = 0;
                setReviveZoneActive(false);
                setDraggingRadarId(null);
                const projectId = e.dataTransfer.getData('text/plain');
                const proj = projects.find((p) => p.id === projectId);
                if (proj && proj.status === 'buried') {
                  reviveProject(proj.id);
                } else if (proj && proj.status === 'risen') {
                  showToast(`"${proj.name}" is already risen`, 'info');
                } else {
                  setReviveZoneInvalid(true);
                  setTimeout(() => setReviveZoneInvalid(false), 1400);
                  showToast('Drop a buried project here to revive it', 'warning');
                }
              }}
            >
              <Zap size={22} />
              <span className="resurrect-zone-label">RESURRECT</span>
              <span className="resurrect-zone-desc">
                {reviveZoneActive ? 'Release to revive!' : 'Drop a radar card here'}
              </span>
            </div>
          )}

          {/* From The Cemetery List */}
          <div className="section-header-row" style={{ marginTop: '28px' }}>
            <div>
              <h3 className="section-title">From the Cemetery</h3>
              <p className="section-subtitle">Recently abandoned repositories and tools</p>
            </div>
            <button
              onClick={() => setActiveTab('graveyard')}
              className="btn-ghost"
            >
              View All ({buriedProjects.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="cemetery-items-grid">
            {recentBuried.map((item) => {
              const comp = item.completedTasks?.length || 0;
              const tot = comp + (item.remainingTasks?.length || 0);
              const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;

              return (
                <div
                  key={item.id}
                  className="cemetery-card spectral-card"
                  onClick={() => handleOpenProject(item.id)}
                >
                  <div className="cemetery-top">
                    <div>
                      <h4 className="cemetery-name">{item.name}</h4>
                      <span className="cemetery-cat">{item.category}</span>
                    </div>
                    <span className="revival-pill">
                      {item.revivalScore}% Index
                    </span>
                  </div>
                  <p className="cemetery-desc">{item.description}</p>
                  <div className="cemetery-tech-row">
                    {item.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="tech-tag">
                        {t}
                      </span>
                    ))}
                    {item.technologies.length > 3 && (
                      <span className="tech-tag">+{item.technologies.length - 3}</span>
                    )}
                  </div>
                  <div className="cemetery-footer">
                    <div className="cemetery-progress">
                      <div className="progress-bar-track" style={{ height: '4px', margin: 0 }}>
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="cemetery-progress-label">{pct}% Done</span>
                    </div>
                    <span className="cemetery-reason">
                      Cause: <em>{item.abandonmentReason}</em>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Activity Timeline & The Archive Awaits */}
        <div className="dashboard-col-right">
          {/* Quick Stats / Vault status */}
          <div className="vault-status-panel spectral-card">
            <div className="vault-header">
              <span className="vault-title">Mausoleum Telemetry</span>
              <span className="live-pulse" />
            </div>
            <div className="vault-stats-list">
              <div className="vault-stat-row">
                <span className="vault-stat-k">Overall Resurrectability</span>
                <span className="vault-stat-v text-gradient">78% High</span>
              </div>
              <div className="vault-stat-row">
                <span className="vault-stat-k">Harvestable Assets</span>
                <span className="vault-stat-v">{snippets.length} Modules</span>
              </div>
              <div className="vault-stat-row">
                <span className="vault-stat-k">Archived to Cold Storage</span>
                <span className="vault-stat-v">{archivedProjects.length} Projects</span>
              </div>
              <div className="vault-stat-row">
                <span className="vault-stat-k">Storage Persistence</span>
                <span className="vault-stat-v">Local Browser Storage</span>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="section-header-row" style={{ marginTop: '24px' }}>
            <h3 className="section-title">Crypt Activity</h3>
            <button
              onClick={() => setActiveTab('activity')}
              className="btn-ghost"
            >
              Feed <ArrowRight size={14} />
            </button>
          </div>

          <div className="activity-timeline-card spectral-card">
            <div className="timeline-items-wrap">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="timeline-item">
                  <div className={`timeline-dot dot-${act.type}`} />
                  <div className="timeline-item-body">
                    <div className="timeline-item-title">{act.title}</div>
                    <div className="timeline-item-desc">{act.description}</div>
                    <div className="timeline-item-time">{act.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import {
  Activity,
  Skull,
  Zap,
  Layers,
  Clock,
  Archive,
} from 'lucide-react';
import './ActivityPage.css';

export const ActivityPage: React.FC = () => {
  const { activities, setSelectedProjectId, setIsDetailModalOpen } = useGraveyard();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = useMemo(() => {
    if (filterType === 'all') return activities;
    return activities.filter((a) => a.type === filterType);
  }, [activities, filterType]);

  // Weekly dummy distribution for visual parity with Figma screen 7
  const weeklyData = [
    { day: 'Mon', count: 3, height: '45%' },
    { day: 'Tue', count: 5, height: '70%' },
    { day: 'Wed', count: 2, height: '30%' },
    { day: 'Thu', count: 8, height: '95%', active: true },
    { day: 'Fri', count: 4, height: '55%' },
    { day: 'Sat', count: 1, height: '18%' },
    { day: 'Sun', count: 3, height: '40%' },
  ];

  const handleOpenProj = (projectId?: string) => {
    if (!projectId) return;
    setSelectedProjectId(projectId);
    setIsDetailModalOpen(true);
  };

  const icons = {
    buried: <Skull size={15} color="#94a3b8" />,
    revived: <Zap size={15} color="var(--accent-green)" />,
    harvested: <Layers size={15} color="#c084fc" />,
    updated: <Clock size={15} color="#38bdf8" />,
    archived: <Archive size={15} color="#f59e0b" />,
  };

  return (
    <div className="activity-page">
      {/* Header */}
      <div className="activity-header">
        <div>
          <h1 className="page-main-title">Activity & Telemetry</h1>
          <p className="page-main-sub">
            Audit log of exhumations, resurrections, asset extractions, and crypt events.
          </p>
        </div>
      </div>

      {/* Weekly Activity Chart Panel */}
      <div className="activity-chart-card spectral-card">
        <div className="chart-header">
          <div>
            <span className="chart-subtitle">Weekly Activity Rhythm</span>
            <h3 className="chart-title">&ldquo;A quiet week for second chances&rdquo;</h3>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" />
            <span className="legend-label">Resurrections & Extractions</span>
          </div>
        </div>

        {/* Custom Responsive CSS Bar Chart */}
        <div className="chart-bars-wrap">
          {weeklyData.map((d) => (
            <div key={d.day} className="chart-bar-col">
              <div className="bar-track">
                <div
                  className={`bar-fill ${d.active ? 'bar-peak' : ''}`}
                  style={{ height: d.height }}
                  title={`${d.day}: ${d.count} events`}
                />
              </div>
              <span className={`bar-day-label ${d.active ? 'active-day' : ''}`}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="activity-filter-bar">
        {['all', 'revived', 'buried', 'harvested', 'updated', 'archived'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`filter-pill-btn ${filterType === f ? 'active' : ''}`}
          >
            {f === 'all' ? 'All Activity' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="activity-list-container spectral-card">
        <div className="activity-list-header">
          <span className="act-header-title">Chronological Log ({filteredActivities.length})</span>
        </div>

        <div className="activity-feed">
          {filteredActivities.length === 0 ? (
            <div className="empty-activity">
              <p>No activity records found matching &ldquo;{filterType}&rdquo;</p>
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="act-feed-item">
                <div className={`act-icon-wrapper icon-type-${act.type}`}>
                  {icons[act.type] || <Activity size={15} />}
                </div>

                <div className="act-feed-content">
                  <div className="act-feed-title-row">
                    <span className="act-feed-title">{act.title}</span>
                    <span className="act-feed-time">{act.timestamp}</span>
                  </div>
                  <p className="act-feed-desc">{act.description}</p>
                  {act.projectId && (
                    <button
                      onClick={() => handleOpenProj(act.projectId)}
                      className="act-proj-link"
                    >
                      View &ldquo;{act.projectName}&rdquo; →
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

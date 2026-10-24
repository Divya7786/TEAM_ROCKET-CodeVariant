import React, { useRef, useState } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import {
  Zap,
  CheckCircle2,
  Circle,
  Archive,
  ArrowRight,
  Trophy,
  GripVertical,
  Skull,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './RisenProjects.css';

export const RisenProjects: React.FC = () => {
  const {
    projects,
    updateProject,
    buryAgainProject,
    setActiveTab,
    setSelectedProjectId,
    setIsDetailModalOpen,
    showToast,
  } = useGraveyard();

  const risenList = projects.filter((p) => p.status === 'risen');

  // DnD state for the RETURN TO CRYPT zone
  const [draggingRisenId, setDraggingRisenId] = useState<string | null>(null);
  const [cryptZoneActive, setCryptZoneActive] = useState(false);
  const [cryptZoneInvalid, setCryptZoneInvalid] = useState(false);
  const cryptEnterCount = useRef(0);

  const toggleMilestone = (projectId: string, milestoneIdx: number) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj || !proj.milestones) return;
    const updatedMilestones = proj.milestones.map((m, idx) =>
      idx === milestoneIdx ? { ...m, completed: !m.completed } : m
    );
    updateProject(projectId, { milestones: updatedMilestones });
    if (!proj.milestones[milestoneIdx].completed) {
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#80DC48', '#ffffff', '#a855f7'] }); } catch { /* ignore */ }
      showToast(`Milestone completed for "${proj.name}"!`, 'success');
    }
  };

  const handleCelebrateCompletion = (projName: string) => {
    try { confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ['#80DC48', '#38bdf8', '#f59e0b', '#ffffff'] }); } catch { /* ignore */ }
    showToast(`🏆 "${projName}" successfully graduated from the crypt!`, 'success');
  };

  return (
    <div className="risen-page">
      {/* Header */}
      <div className="risen-header">
        <div>
          <div className="risen-pill">
            <Zap size={14} fill="var(--accent-green)" />
            <span>RESURRECTION TRACKER</span>
          </div>
          <h1 className="page-main-title">Risen Projects</h1>
          <p className="page-main-sub">
            {risenList.length === 1
              ? 'One idea made it out of the graveyard'
              : `${risenList.length} ideas made it out of the graveyard`}
          </p>
        </div>
        <button onClick={() => setActiveTab('graveyard')} className="btn-secondary">
          <span>Graveyard Crypt</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Risen Projects List */}
      {risenList.length === 0 ? (
        <div className="risen-empty spectral-card">
          <Zap size={48} color="var(--accent-green)" />
          <h3>No projects have been resurrected yet</h3>
          <p>Visit the Digital Graveyard or Revival Advisor to bring a sleeping idea back to life!</p>
          <button onClick={() => setActiveTab('graveyard')} className="btn-primary" style={{ marginTop: '12px' }}>
            Browse Graveyard
          </button>
        </div>
      ) : (
        <>
          {/* DnD instructions */}
          <div className="risen-dnd-banner">
            <GripVertical size={14} color="var(--text-muted)" />
            <span>Drag a risen project card down to the <strong>RETURN TO CRYPT</strong> zone to re-bury it.</span>
          </div>

          <div className="risen-cards-stack">
            {risenList.map((project) => {
              const milestones = project.milestones || [];
              const doneMilestones = milestones.filter((m) => m.completed).length;
              const totalMilestones = milestones.length;
              const progressPct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 65;

              const isDragging = draggingRisenId === project.id;

              return (
                <div
                  key={project.id}
                  className={`risen-card spectral-card ${isDragging ? 'risen-card-dragging' : ''}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', project.id);
                    setDraggingRisenId(project.id);
                  }}
                  onDragEnd={() => {
                    setDraggingRisenId(null);
                    setCryptZoneActive(false);
                    cryptEnterCount.current = 0;
                  }}
                >
                  {/* Top Bar */}
                  <div className="risen-card-top">
                    <div className="risen-title-group">
                      <div className="risen-drag-grip" title="Drag to return to crypt">
                        <GripVertical size={16} color="var(--text-muted)" />
                      </div>
                      <div className="risen-sparkle-icon">
                        <Zap size={18} fill="var(--accent-green)" />
                      </div>
                      <div>
                        <div className="risen-name-row">
                          <h2 className="risen-project-title">{project.name}</h2>
                          <span className="badge">{project.category}</span>
                          {project.isSample && <span className="sample-badge">Sample</span>}
                        </div>
                        <p className="risen-tagline">{project.tagline}</p>
                      </div>
                    </div>

                    <div className="risen-top-actions">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProjectId(project.id); setIsDetailModalOpen(true); }}
                        className="btn-secondary"
                        title="Open post-mortem details"
                      >
                        Post-Mortem Details
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCelebrateCompletion(project.name); }}
                        className="btn-primary"
                        title="Celebrate milestone graduation"
                      >
                        <Trophy size={15} /> Graduate
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="risen-progress-container">
                    <div className="risen-progress-header">
                      <span className="risen-progress-title">Sprint Completion Velocity</span>
                      <span className="risen-progress-number">
                        {progressPct}% ({doneMilestones}/{totalMilestones} Milestones)
                      </span>
                    </div>
                    <div className="progress-bar-track" style={{ height: '8px' }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #43a027, #80DC48)' }} />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="milestones-section">
                    <h4 className="milestones-heading">Active Reboot Milestones</h4>
                    <div className="milestones-grid">
                      {milestones.map((ms, idx) => (
                        <div
                          key={idx}
                          className={`milestone-box ${ms.completed ? 'completed' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleMilestone(project.id, idx); }}
                        >
                          <div className="ms-checkbox">
                            {ms.completed ? <CheckCircle2 size={16} color="var(--accent-green)" /> : <Circle size={16} color="var(--text-muted)" />}
                          </div>
                          <div className="ms-info">
                            <span className="ms-title">{ms.title}</span>
                            {ms.dueDate && <span className="ms-due">Target: {ms.dueDate}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer: resurrected date */}
                  <div className="risen-card-footer">
                    <span className="risen-resurrected-date">
                      Resurrected on {new Date(project.dateRevived || project.lastUpdated).toLocaleDateString()}
                    </span>
                    <span className="risen-drag-hint-text">
                      <GripVertical size={12} /> drag card to return to crypt
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RETURN TO CRYPT drop zone */}
          <div
            className={[
              'risen-crypt-zone',
              cryptZoneActive ? 'crypt-zone-active' : '',
              cryptZoneInvalid ? 'crypt-zone-invalid' : '',
            ].filter(Boolean).join(' ')}
            onDragEnter={(e) => {
              e.preventDefault();
              cryptEnterCount.current++;
              setCryptZoneActive(true);
              setCryptZoneInvalid(false);
            }}
            onDragLeave={() => {
              cryptEnterCount.current = Math.max(0, cryptEnterCount.current - 1);
              if (cryptEnterCount.current === 0) setCryptZoneActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              cryptEnterCount.current = 0;
              setCryptZoneActive(false);
              setDraggingRisenId(null);
              const projectId = e.dataTransfer.getData('text/plain');
              const proj = projects.find((p) => p.id === projectId && p.status === 'risen');
              if (proj) {
                buryAgainProject(proj.id);
              } else {
                setCryptZoneInvalid(true);
                setTimeout(() => setCryptZoneInvalid(false), 1400);
                showToast('Only risen projects can be returned to the crypt', 'warning');
              }
            }}
          >
            <Skull size={24} />
            <span className="crypt-zone-label">RETURN TO CRYPT</span>
            <span className="crypt-zone-desc">
              {cryptZoneActive ? 'Release to re-bury!' : 'Drag a risen project here to abandon it'}
            </span>
            <Archive size={16} className="crypt-zone-archive-icon" />
          </div>
        </>
      )}
    </div>
  );
};

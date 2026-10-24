import React, { useState, useRef } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import {
  X,
  ExternalLink,
  GitBranch,
  Zap,
  Archive,
  Flame,
  Edit3,
  CheckCircle2,
  Circle,
  Share2,
  Clock,
  Layers,
  Skull,
  GripVertical,
  AlertTriangle,
  Save,
} from 'lucide-react';
import './ProjectDetailsModal.css';

type DetailZone = 'resurrect' | 'archive' | 'bury' | 'harvest' | 'delete' | 'save';

export const ProjectDetailsModal: React.FC = () => {
  const {
    selectedProjectId,
    isDetailModalOpen,
    setIsDetailModalOpen,
    projects,
    reviveProject,
    buryAgainProject,
    archiveProject,
    deleteProject,
    updateProject,
    toggleTaskCompletion,
    addSnippet,
    showToast,
    setActiveTab,
  } = useGraveyard();

  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // DnD state — project card drag
  const [isDraggingProject, setIsDraggingProject] = useState(false);
  const [detailActiveZone, setDetailActiveZone] = useState<DetailZone | null>(null);
  const [detailInvalidZone, setDetailInvalidZone] = useState<DetailZone | null>(null);
  const detailEnterCounts = useRef<Partial<Record<DetailZone, number>>>({});

  // DnD state — changes card drag (edit mode)
  const [isDraggingChanges, setIsDraggingChanges] = useState(false);
  const [saveZoneActive, setSaveZoneActive] = useState(false);
  const saveEnterCount = useRef(0);

  // DnD delete confirm
  const [showBurnConfirm, setShowBurnConfirm] = useState(false);
  const [isDraggingBurnCard, setIsDraggingBurnCard] = useState(false);
  const [burnZoneActive, setBurnZoneActive] = useState(false);

  const project = projects.find((p) => p.id === selectedProjectId);

  if (!isDetailModalOpen || !project) return null;

  const handleStartEdit = () => {
    setEditName(project.name);
    setEditTagline(project.tagline);
    setEditDescription(project.description);
    setEditNotes(project.notes || '');
    setIsEditing(true);
  };

  const doSaveEdit = () => {
    if (!editName.trim()) return;
    updateProject(project.id, {
      name: editName.trim(),
      tagline: editTagline.trim(),
      description: editDescription.trim(),
      notes: editNotes.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    doSaveEdit();
  };

  const handleHarvestSnippet = () => {
    addSnippet({
      title: `${project.name} Core Component`,
      description: `Harvested from ${project.name}: ${project.description.slice(0, 80)}...`,
      category: 'component',
      language: 'typescript',
      code: `// Harvested from ${project.name}\nexport function ${project.name.replace(/\s+/g, '')}Module() {\n  return {\n    name: "${project.name}",\n    tech: ${JSON.stringify(project.technologies)},\n  };\n}`,
      projectId: project.id,
      projectName: project.name,
      tags: project.technologies.map((t) => t.toLowerCase()),
    });
    showToast(`Harvested reusable asset from ${project.name}`, 'success');
  };

  // ── DnD helpers ──────────────────────────────────────────────────────────
  const getValidZones = (): DetailZone[] => {
    const zones: DetailZone[] = ['harvest', 'delete'];
    if (project.status === 'buried' || project.status === 'archived') zones.push('resurrect');
    if (project.status === 'buried' || project.status === 'risen') zones.push('archive');
    if (project.status === 'risen') zones.push('bury');
    return zones;
  };

  const validZones = getValidZones();

  const handleZoneDragEnter = (e: React.DragEvent, zone: DetailZone) => {
    e.preventDefault();
    detailEnterCounts.current[zone] = (detailEnterCounts.current[zone] ?? 0) + 1;
    if (validZones.includes(zone)) {
      setDetailActiveZone(zone);
      setDetailInvalidZone(null);
    } else {
      setDetailInvalidZone(zone);
      setDetailActiveZone(null);
    }
  };

  const handleZoneDragLeave = (_e: React.DragEvent, zone: DetailZone) => {
    detailEnterCounts.current[zone] = Math.max(0, (detailEnterCounts.current[zone] ?? 1) - 1);
    if ((detailEnterCounts.current[zone] ?? 0) === 0) {
      if (detailActiveZone === zone) setDetailActiveZone(null);
      if (detailInvalidZone === zone) setDetailInvalidZone(null);
    }
  };

  const handleDetailDrop = (e: React.DragEvent, zone: DetailZone) => {
    e.preventDefault();
    detailEnterCounts.current = {};
    setDetailActiveZone(null);
    setDetailInvalidZone(null);
    setIsDraggingProject(false);

    const data = e.dataTransfer.getData('text/plain');
    if (data !== 'project-detail-card') return;

    if (!validZones.includes(zone) && zone !== 'harvest' && zone !== 'delete') {
      showToast(`Cannot apply action to a "${project.status}" project`, 'warning');
      return;
    }

    switch (zone) {
      case 'resurrect':
        reviveProject(project.id);
        setIsDetailModalOpen(false);
        break;
      case 'archive':
        archiveProject(project.id);
        setIsDetailModalOpen(false);
        break;
      case 'bury':
        buryAgainProject(project.id);
        setIsDetailModalOpen(false);
        break;
      case 'harvest':
        handleHarvestSnippet();
        break;
      case 'delete':
        setShowBurnConfirm(true);
        break;
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const completedCount = project.completedTasks?.length || 0;
  const remainingCount = project.remainingTasks?.length || 0;
  const totalTasks = completedCount + remainingCount;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const scores = project.revivalScores;

  // ── Zone renderer ─────────────────────────────────────────────────────────
  const renderDetailZone = (zone: DetailZone, label: string, icon: React.ReactNode, zoneClass: string) => {
    const isActive = detailActiveZone === zone;
    const isInvalid = detailInvalidZone === zone;
    return (
      <div
        key={zone}
        className={['detail-action-zone', zoneClass, isActive ? 'dz-active' : '', isInvalid ? 'dz-invalid' : ''].filter(Boolean).join(' ')}
        onDragEnter={(e) => handleZoneDragEnter(e, zone)}
        onDragLeave={(e) => handleZoneDragLeave(e, zone)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDetailDrop(e, zone)}
        title={label}
      >
        <span className="dz-icon">{icon}</span>
        <span className="dz-label">{label}</span>
      </div>
    );
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDetailModalOpen(false)}>
      <div
        className="modal-content project-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="project-details-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="details-header-left">
            <span className="badge">{project.category}</span>
            {project.isSample ? (
              <span className="sample-badge">Sample Data</span>
            ) : (
              <span className="user-badge">User Created</span>
            )}
            <span className={`status-pill pill-${project.status}`}>
              {project.status.toUpperCase()}
            </span>
          </div>

          <div className="details-header-right">
            {!isEditing && (
              <button onClick={handleStartEdit} className="btn-ghost icon-only" title="Edit Project">
                <Edit3 size={16} />
              </button>
            )}
            <button onClick={() => setIsDetailModalOpen(false)} className="modal-close-btn" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="modal-body-scroll details-body">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="details-edit-form">
              <div>
                <label className="form-label">Project Name</label>
                <input type="text" className="form-input" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Tagline</label>
                <input type="text" className="form-input" value={editTagline} onChange={(e) => setEditTagline(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-textarea" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Post-Mortem Notes</label>
                <textarea rows={3} className="form-textarea" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
              </div>

              {/* DnD save: draggable changes card + SAVE CHANGES zone */}
              <div className="edit-dnd-row">
                <div className="edit-dnd-label">Drag changes card to save:</div>
                <div className="edit-dnd-controls">
                  <div
                    className={`changes-draft-card ${isDraggingChanges ? 'changes-card-dragging' : ''}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', 'save-changes');
                      setIsDraggingChanges(true);
                    }}
                    onDragEnd={() => {
                      setIsDraggingChanges(false);
                      setSaveZoneActive(false);
                      saveEnterCount.current = 0;
                    }}
                    title="Drag to SAVE CHANGES zone"
                  >
                    <GripVertical size={13} />
                    <Save size={14} />
                    <span>CHANGES DRAFT</span>
                  </div>

                  <div
                    className={`save-changes-zone ${saveZoneActive ? 'save-zone-active' : ''} ${isDraggingChanges ? 'save-zone-primed' : ''}`}
                    onDragEnter={(e) => { e.preventDefault(); saveEnterCount.current++; setSaveZoneActive(true); }}
                    onDragLeave={() => { saveEnterCount.current = Math.max(0, saveEnterCount.current - 1); if (saveEnterCount.current === 0) setSaveZoneActive(false); }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      saveEnterCount.current = 0;
                      setSaveZoneActive(false);
                      setIsDraggingChanges(false);
                      if (e.dataTransfer.getData('text/plain') === 'save-changes') doSaveEdit();
                    }}
                  >
                    <Save size={16} />
                    <span>SAVE CHANGES</span>
                  </div>
                </div>
              </div>

              <div className="edit-form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Title & Tagline Banner */}
              <div className="project-hero-section">
                <div>
                  <h2 id="project-details-title" className="project-title-text">{project.name}</h2>
                  <p className="project-tagline-text">{project.tagline}</p>
                </div>
                <div className="details-score-box">
                  <div className="score-num-big">{project.revivalScore}</div>
                  <div className="score-subtext">REVIVAL INDEX</div>
                </div>
              </div>

              {/* Links */}
              <div className="project-links-bar">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="link-chip">
                    <GitBranch size={14} /> Repository <ExternalLink size={12} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-chip">
                    <Share2 size={14} /> Live Demo <ExternalLink size={12} />
                  </a>
                )}
                <div className="abandoned-time-text">
                  <Clock size={13} /> Buried {new Date(project.dateBuried).toLocaleDateString()}
                </div>
              </div>

              {/* Description */}
              <div className="detail-card-panel">
                <h4 className="panel-title">Post-Mortem Abstract</h4>
                <p className="panel-content-text">{project.description}</p>
                {project.notes && (
                  <div className="post-mortem-notes-callout">
                    <div className="callout-label">Post-Mortem Takeaway</div>
                    <p>{project.notes}</p>
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="detail-card-panel">
                <h4 className="panel-title">Preserved Tech Stack</h4>
                <div className="tech-tags-list">
                  {project.technologies.map((t) => <span key={t} className="tech-tag">{t}</span>)}
                </div>
              </div>

              {/* Abandonment Reason */}
              <div className="reason-banner">
                <span className="reason-label">Why it was abandoned:</span>
                <span className="reason-value">{project.abandonmentReason}</span>
              </div>

              {/* Task Checklist */}
              <div className="detail-card-panel">
                <div className="progress-header">
                  <h4 className="panel-title">Task Completion Progress</h4>
                  <span className="progress-pct-label">{progressPercent}% Completed</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="tasks-subgroup">
                  <h5 className="subgroup-title">Completed Milestones ({completedCount})</h5>
                  <div className="task-checklist">
                    {project.completedTasks.map((t) => (
                      <div key={t.id} className="interactive-task completed" onClick={() => toggleTaskCompletion(project.id, t.id, true)} title="Click to toggle back to pending">
                        <CheckCircle2 size={16} color="var(--accent-green)" /><span>{t.text}</span>
                      </div>
                    ))}
                    {completedCount === 0 && <div className="empty-tasks-notice">No completed milestones recorded</div>}
                  </div>
                </div>
                <div className="tasks-subgroup">
                  <h5 className="subgroup-title">Unfinished Work / Blockers ({remainingCount})</h5>
                  <div className="task-checklist">
                    {project.remainingTasks.map((t) => (
                      <div key={t.id} className="interactive-task pending" onClick={() => toggleTaskCompletion(project.id, t.id, false)} title="Click to mark completed">
                        <Circle size={16} color="var(--accent-amber)" /><span>{t.text}</span>
                      </div>
                    ))}
                    {remainingCount === 0 && <div className="empty-tasks-notice">All milestones marked complete!</div>}
                  </div>
                </div>
              </div>

              {/* Advisor Preview */}
              <div className="detail-card-panel advisor-preview-card">
                <div className="advisor-header-row">
                  <div>
                    <h4 className="panel-title">Revival Advisor Assessment</h4>
                    <p className="advisor-rule-notice">
                      Deterministic Rule-Based Engine (Demo) • Verdict: <strong>{scores.verdict}</strong>
                    </p>
                  </div>
                  <button onClick={() => { setIsDetailModalOpen(false); setActiveTab('advisor'); }} className="btn-ghost">
                    View in Advisor →
                  </button>
                </div>
                <p className="advisor-reasoning">{scores.reasoning}</p>
                <div className="subscores-row">
                  <div className="subscore-stat"><span className="subscore-val">{scores.feasibility}%</span><span className="subscore-label">Feasibility</span></div>
                  <div className="subscore-stat"><span className="subscore-val">{scores.marketDemand}%</span><span className="subscore-label">Market Demand</span></div>
                  <div className="subscore-stat"><span className="subscore-val">{scores.effortRequired}%</span><span className="subscore-label">Effort Ratio</span></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* DnD Footer Actions (view mode only) */}
        {!isEditing && !showBurnConfirm && (
          <div className="modal-footer details-dnd-footer">
            <div className="detail-dnd-instructions">
              <GripVertical size={13} color="var(--text-muted)" />
              <span>Drag the project card to an action zone</span>
            </div>
            {/* Draggable project card handle */}
            <div
              className={`detail-drag-card ${isDraggingProject ? 'detail-card-dragging' : ''}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', 'project-detail-card');
                setIsDraggingProject(true);
              }}
              onDragEnd={() => {
                setIsDraggingProject(false);
                detailEnterCounts.current = {};
                setDetailActiveZone(null);
                setDetailInvalidZone(null);
              }}
              title={`Drag to apply action — ${project.name}`}
            >
              <GripVertical size={14} className="detail-grip" />
              <span className={`detail-status-dot dot-${project.status}`} />
              <span className="detail-drag-name">{project.name}</span>
              <span className={`detail-drag-status status-label-${project.status}`}>{project.status}</span>
            </div>

            {/* Action zones row */}
            <div className="detail-zones-row">
              {(project.status === 'buried' || project.status === 'archived') &&
                renderDetailZone('resurrect', 'RESURRECT', <Zap size={15} />, 'dz-resurrect')}
              {(project.status === 'buried' || project.status === 'risen') &&
                renderDetailZone('archive', 'ARCHIVE', <Archive size={15} />, 'dz-archive')}
              {project.status === 'risen' &&
                renderDetailZone('bury', 'RETURN TO CRYPT', <Skull size={15} />, 'dz-bury')}
              {renderDetailZone('harvest', 'HARVEST', <Layers size={15} />, 'dz-harvest')}
              {renderDetailZone('delete', 'DELETE', <Flame size={15} />, 'dz-delete')}
            </div>
          </div>
        )}

        {/* Delete confirmation — DnD only */}
        {!isEditing && showBurnConfirm && (
          <div className="modal-footer details-burn-confirm">
            <div className="burn-confirm-header">
              <AlertTriangle size={20} color="var(--accent-red)" />
              <span>Drag the tombstone to confirm permanent deletion</span>
            </div>
            <div className="burn-confirm-row">
              <div
                className={`burn-confirm-drag-card ${isDraggingBurnCard ? 'burn-card-dragging' : ''}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', 'confirm-detail-delete');
                  setIsDraggingBurnCard(true);
                }}
                onDragEnd={() => { setIsDraggingBurnCard(false); setBurnZoneActive(false); }}
                title="Drag to confirm delete"
              >
                <Flame size={13} />
                <span>{project.name}</span>
              </div>
              <div
                className={`burn-confirm-zone ${burnZoneActive ? 'burn-zone-over' : ''} ${isDraggingBurnCard ? 'burn-zone-primed' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setBurnZoneActive(true); }}
                onDragLeave={() => setBurnZoneActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setBurnZoneActive(false);
                  setIsDraggingBurnCard(false);
                  if (e.dataTransfer.getData('text/plain') === 'confirm-detail-delete') {
                    deleteProject(project.id);
                  }
                }}
              >
                <Flame size={16} />
                <span>DROP TO INCINERATE</span>
              </div>
            </div>
            <button onClick={() => setShowBurnConfirm(false)} className="btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

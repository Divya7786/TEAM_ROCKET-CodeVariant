import React, { useState, useRef } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import { Zap, Archive, Flame, Skull, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import type { Project } from '../types';
import './GraveyardCanvas.css';

type DropZoneId = 'resurrect' | 'repurpose' | 'archive' | 'burn' | 'bury' | 'save';

interface ZoneConfig {
  id: DropZoneId;
  label: string;
  icon: React.ReactNode;
  description: string;
  className: string;
  validStatuses: string[];
}

const MAIN_ZONES: ZoneConfig[] = [
  {
    id: 'resurrect',
    label: 'RESURRECT',
    icon: <Zap size={26} />,
    description: 'Bring back into active development',
    className: 'zone-resurrect',
    validStatuses: ['buried', 'archived'],
  },
  {
    id: 'repurpose',
    label: 'REPURPOSE',
    icon: <RefreshCw size={26} />,
    description: 'Extract & harvest assets, then archive',
    className: 'zone-repurpose',
    validStatuses: ['buried', 'risen', 'archived'],
  },
  {
    id: 'archive',
    label: 'ARCHIVE',
    icon: <Archive size={26} />,
    description: 'Move to cold vault storage',
    className: 'zone-archive',
    validStatuses: ['buried', 'risen'],
  },
  {
    id: 'burn',
    label: 'BURN / DELETE',
    icon: <Flame size={26} />,
    description: 'Permanently destroy all traces',
    className: 'zone-burn',
    validStatuses: ['buried', 'risen', 'archived'],
  },
];

const DRAFT_ZONES: ZoneConfig[] = [
  {
    id: 'bury',
    label: 'BURY PROJECT',
    icon: <Skull size={20} />,
    description: 'Drag a risen project here to re-bury it, or click to add a new one',
    className: 'zone-bury',
    validStatuses: ['risen'],
  },
  {
    id: 'save',
    label: 'SAVE CHANGES',
    icon: <Save size={20} />,
    description: 'Drag any project here to open its editor',
    className: 'zone-save',
    validStatuses: ['buried', 'risen', 'archived'],
  },
];

interface GraveyardCanvasProps {
  projects: Project[];
}

export const GraveyardCanvas: React.FC<GraveyardCanvasProps> = ({ projects }) => {
  const {
    reviveProject,
    archiveProject,
    deleteProject,
    buryAgainProject,
    setSelectedProjectId,
    setIsDetailModalOpen,
    setIsBuryModalOpen,
    showToast,
    addSnippet,
  } = useGraveyard();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<DropZoneId | null>(null);
  const [invalidZone, setInvalidZone] = useState<DropZoneId | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<{ zoneId: DropZoneId; label: string } | null>(null);
  const [isDraggingConfirmCard, setIsDraggingConfirmCard] = useState(false);
  const [confirmZoneActive, setConfirmZoneActive] = useState(false);
  const dragEnterCounts = useRef<Partial<Record<DropZoneId, number>>>({});

  const getDraggingProject = () => projects.find((p) => p.id === draggingId);

  const isValidDrop = (zoneId: DropZoneId, project: Project): boolean => {
    const zone = [...MAIN_ZONES, ...DRAFT_ZONES].find((z) => z.id === zoneId);
    return !!zone && zone.validStatuses.includes(project.status);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, projectId: string) => {
    setDraggingId(projectId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', projectId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setActiveZone(null);
    setInvalidZone(null);
    dragEnterCounts.current = {};
  };

  const handleZoneDragEnter = (e: React.DragEvent<HTMLDivElement>, zoneId: DropZoneId) => {
    e.preventDefault();
    dragEnterCounts.current[zoneId] = (dragEnterCounts.current[zoneId] ?? 0) + 1;
    const proj = getDraggingProject();
    if (!proj) return;
    if (isValidDrop(zoneId, proj)) {
      setActiveZone(zoneId);
      setInvalidZone(null);
    } else {
      setInvalidZone(zoneId);
      setActiveZone(null);
    }
  };

  const handleZoneDragLeave = (_e: React.DragEvent<HTMLDivElement>, zoneId: DropZoneId) => {
    dragEnterCounts.current[zoneId] = Math.max(0, (dragEnterCounts.current[zoneId] ?? 1) - 1);
    if ((dragEnterCounts.current[zoneId] ?? 0) === 0) {
      if (activeZone === zoneId) setActiveZone(null);
      if (invalidZone === zoneId) setInvalidZone(null);
    }
  };

  const handleZoneDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const triggerSuccess = (zoneId: DropZoneId, label: string) => {
    setLastSuccess({ zoneId, label });
    setTimeout(() => setLastSuccess(null), 2400);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, zoneId: DropZoneId) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    const project = projects.find((p) => p.id === projectId);

    dragEnterCounts.current = {};
    setActiveZone(null);
    setInvalidZone(null);
    setDraggingId(null);

    if (!project) return;

    if (!isValidDrop(zoneId, project)) {
      showToast(`Cannot ${zoneId} a "${project.status}" project`, 'warning');
      return;
    }

    switch (zoneId) {
      case 'resurrect':
        reviveProject(project.id);
        triggerSuccess(zoneId, project.name);
        break;

      case 'repurpose':
        archiveProject(project.id);
        addSnippet({
          title: `${project.name} — Repurposed`,
          description: `Extracted from ${project.name}: ${project.description.slice(0, 80)}`,
          category: 'component',
          language: 'typescript',
          code: `// Repurposed from: ${project.name}\n// Tech: ${project.technologies.join(', ')}\nexport function ${project.name.replace(/[^a-zA-Z0-9]/g, '')}Module() {\n  // Insert repurposed logic here\n}`,
          projectId: project.id,
          projectName: project.name,
          tags: project.technologies.map((t) => t.toLowerCase()),
        });
        triggerSuccess(zoneId, project.name);
        break;

      case 'archive':
        archiveProject(project.id);
        triggerSuccess(zoneId, project.name);
        break;

      case 'burn':
        setConfirmDeleteId(project.id);
        break;

      case 'bury':
        buryAgainProject(project.id);
        triggerSuccess(zoneId, project.name);
        break;

      case 'save':
        setSelectedProjectId(project.id);
        setIsDetailModalOpen(true);
        break;
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteProject(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const confirmProject = projects.find((p) => p.id === confirmDeleteId);

  const renderZone = (zone: ZoneConfig, isDraft = false) => {
    const isActive = activeZone === zone.id;
    const isInvalid = invalidZone === zone.id;
    const isSuccess = lastSuccess?.zoneId === zone.id;

    return (
      <div
        key={zone.id}
        className={[
          'canvas-drop-zone',
          zone.className,
          isDraft ? 'canvas-draft-zone' : '',
          isActive ? 'zone-active' : '',
          isInvalid ? 'zone-invalid' : '',
          isSuccess ? 'zone-success' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragEnter={(e) => handleZoneDragEnter(e, zone.id)}
        onDragLeave={(e) => handleZoneDragLeave(e, zone.id)}
        onDragOver={handleZoneDragOver}
        onDrop={(e) => handleDrop(e, zone.id)}
        onClick={() => {
          if (zone.id === 'bury') setIsBuryModalOpen(true);
        }}
        role={zone.id === 'bury' ? 'button' : undefined}
        tabIndex={zone.id === 'bury' ? 0 : undefined}
        aria-label={zone.id === 'bury' ? 'Open bury project form' : undefined}
      >
        <div className="zone-icon">{zone.icon}</div>
        <div className="zone-label">{zone.label}</div>
        <div className="zone-desc">{zone.description}</div>
        {isActive && <div className="zone-drop-hint">Drop here!</div>}
        {isInvalid && <div className="zone-invalid-hint">Wrong status — can't drop here</div>}
        {isSuccess && <div className="zone-success-msg">✓ {lastSuccess?.label}</div>}
      </div>
    );
  };

  return (
    <div className="graveyard-canvas">
      <div className="canvas-instructions spectral-card">
        <span className="canvas-tip-icon">🕸️</span>
        <span>
          Drag project cards from the staging area below into a fate zone. Cards rejected by an
          invalid zone will snap back with a warning.
        </span>
      </div>

      {/* Staging Area */}
      <div className="canvas-staging">
        <h3 className="staging-title">
          Staging Area
          <span className="staging-count">{projects.length} artifact{projects.length !== 1 ? 's' : ''}</span>
        </h3>
        <div className="canvas-cards-row">
          {projects.length === 0 ? (
            <div className="canvas-empty-note">No projects match your current filters.</div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className={[
                  'canvas-project-card',
                  'spectral-card',
                  `card-status-${project.status}`,
                  draggingId === project.id ? 'card-dragging' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                draggable
                onDragStart={(e) => handleDragStart(e, project.id)}
                onDragEnd={handleDragEnd}
                title={`Drag to assign fate — ${project.name} (${project.status})`}
              >
                <div className="canvas-card-top">
                  <span className="badge">{project.category}</span>
                  <span className={`canvas-status-dot dot-${project.status}`} />
                </div>
                <div className="canvas-card-name">{project.name}</div>
                <div className="canvas-card-tagline">{project.tagline}</div>
                <div className="canvas-card-bottom">
                  <span className="canvas-revival-pill">{project.revivalScore}%</span>
                  <span className={`canvas-status-chip chip-${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <div className="drag-handle">⠿</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Fate Zones */}
      <div className="canvas-zones-section">
        <div className="canvas-zones-label">Fate Zones</div>
        <div className="canvas-main-zones">{MAIN_ZONES.map((z) => renderZone(z))}</div>
      </div>

      {/* Draft / Utility Zones */}
      <div className="canvas-zones-section">
        <div className="canvas-zones-label">Project Actions</div>
        <div className="canvas-draft-zones">{DRAFT_ZONES.map((z) => renderZone(z, true))}</div>
      </div>

      {/* Delete Confirmation Overlay — final deletion is DnD only */}
      {confirmDeleteId && confirmProject && (
        <div
          className="canvas-confirm-overlay"
          onClick={() => { setConfirmDeleteId(null); setIsDraggingConfirmCard(false); setConfirmZoneActive(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm permanent deletion"
        >
          <div
            className="canvas-confirm-box spectral-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">
              <AlertTriangle size={32} color="var(--accent-red)" />
            </div>
            <h3>Drag to Confirm Deletion</h3>
            <p>
              Drag the tombstone card into the burn zone to permanently incinerate{' '}
              <strong>&ldquo;{confirmProject.name}&rdquo;</strong>. This cannot be undone.
            </p>

            {/* Draggable tombstone card */}
            <div
              className={`confirm-tombstone-card ${isDraggingConfirmCard ? 'confirm-card-dragging' : ''}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', 'confirm-delete');
                setIsDraggingConfirmCard(true);
              }}
              onDragEnd={() => {
                setIsDraggingConfirmCard(false);
                setConfirmZoneActive(false);
              }}
              title="Drag to the burn zone to confirm deletion"
            >
              <Flame size={14} />
              <span>{confirmProject.name}</span>
              <span className="confirm-drag-hint">⠿ drag to burn</span>
            </div>

            {/* Confirm burn drop zone */}
            <div
              className={`confirm-burn-zone ${confirmZoneActive ? 'confirm-zone-over' : ''} ${isDraggingConfirmCard ? 'confirm-zone-primed' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setConfirmZoneActive(true); }}
              onDragLeave={() => setConfirmZoneActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setConfirmZoneActive(false);
                setIsDraggingConfirmCard(false);
                if (e.dataTransfer.getData('text/plain') === 'confirm-delete') {
                  handleConfirmDelete();
                }
              }}
            >
              <Flame size={18} />
              <span>DROP HERE TO INCINERATE</span>
            </div>

            <button
              onClick={() => { setConfirmDeleteId(null); setIsDraggingConfirmCard(false); setConfirmZoneActive(false); }}
              className="btn-secondary"
              style={{ marginTop: '8px' }}
            >
              Cancel — Keep Ashes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

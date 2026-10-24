import React, { useState, useMemo, useRef } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import {
  Compass,
  Zap,
  Layers,
  Archive,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  Cpu,
  BarChart3,
  Clock,
  GripVertical,
  RefreshCw,
} from 'lucide-react';
import './RevivalAdvisor.css';

export const RevivalAdvisor: React.FC = () => {
  const {
    projects,
    reviveProject,
    archiveProject,
    addSnippet,
    showToast,
    setSelectedProjectId,
    setIsDetailModalOpen,
  } = useGraveyard();

  // Selected project for evaluation
  const [activeProjId, setActiveProjId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  // Track checked steps in the prioritized checklist locally
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // DnD state for advisor action zones
  type AdvisorZone = 'resurrect' | 'repurpose' | 'archive';
  const [isDraggingAdvisor, setIsDraggingAdvisor] = useState(false);
  const [advisorActiveZone, setAdvisorActiveZone] = useState<AdvisorZone | null>(null);
  const [advisorInvalidZone, setAdvisorInvalidZone] = useState<AdvisorZone | null>(null);
  const advisorEnterCounts = useRef<Partial<Record<AdvisorZone, number>>>({});

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjId) || projects[0];
  }, [projects, activeProjId]);

  if (!activeProject) {
    return (
      <div className="advisor-page">
        <div className="advisor-empty-state spectral-card">
          <Compass size={44} color="var(--accent-green)" />
          <h2>No projects available for evaluation</h2>
          <p>Bury a project into the crypt first to run the Revival Advisor.</p>
        </div>
      </div>
    );
  }

  const scores = activeProject.revivalScores;

  const toggleStep = (stepText: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepText]: !prev[stepText],
    }));
  };

  const handleRepurpose = () => {
    addSnippet({
      title: `${activeProject.name} Extracted Assets`,
      description: `Harvested core module bundle from ${activeProject.name}.`,
      category: 'component',
      language: 'typescript',
      code: `// Extracted from ${activeProject.name}\n// ${activeProject.description}\nexport const ReusableModule = {\n  project: "${activeProject.name}",\n  technologies: ${JSON.stringify(activeProject.technologies)},\n  salvagedDate: new Date().toISOString(),\n};`,
      projectId: activeProject.id,
      projectName: activeProject.name,
      tags: activeProject.technologies.map((t) => t.toLowerCase()),
    });
    showToast(`Harvested reusable components from "${activeProject.name}" into Reuse Engine`, 'success');
  };

  const handleAdvisorDrop = (e: React.DragEvent<HTMLDivElement>, zone: AdvisorZone) => {
    e.preventDefault();
    advisorEnterCounts.current = {};
    setAdvisorActiveZone(null);
    setAdvisorInvalidZone(null);
    setIsDraggingAdvisor(false);

    if (e.dataTransfer.getData('text/plain') !== 'advisor-project-card') return;

    switch (zone) {
      case 'resurrect':
        if (activeProject.status !== 'risen') {
          reviveProject(activeProject.id);
        } else {
          showToast(`"${activeProject.name}" is already risen`, 'info');
        }
        break;
      case 'repurpose':
        handleRepurpose();
        if (activeProject.status !== 'archived') archiveProject(activeProject.id);
        break;
      case 'archive':
        if (activeProject.status !== 'archived') {
          archiveProject(activeProject.id);
        } else {
          showToast(`"${activeProject.name}" is already archived`, 'info');
        }
        break;
    }
  };

  const advisorZoneConfig: { id: AdvisorZone; label: string; icon: React.ReactNode; cls: string; validStatuses: string[] }[] = [
    { id: 'resurrect', label: 'RESURRECT',  icon: <Zap size={20} />,        cls: 'adv-zone-resurrect', validStatuses: ['buried', 'archived'] },
    { id: 'repurpose', label: 'REPURPOSE',  icon: <RefreshCw size={20} />, cls: 'adv-zone-repurpose', validStatuses: ['buried', 'risen', 'archived'] },
    { id: 'archive',   label: 'ARCHIVE',    icon: <Archive size={20} />,   cls: 'adv-zone-archive',   validStatuses: ['buried', 'risen'] },
  ];

  return (
    <div className="advisor-page">
      {/* Page Header */}
      <div className="advisor-header">
        <div>
          <div className="advisor-pill">
            <Sparkles size={14} color="var(--accent-green)" />
            <span>DETERMINISTIC EVALUATION ENGINE</span>
          </div>
          <h1 className="advisor-title">Revival Advisor</h1>
          <p className="advisor-sub">
            Transparent, rule-based algorithmic recommendation for dormant projects.
          </p>
        </div>

        {/* Demo Disclaimer Badge */}
        <div className="rule-demo-callout">
          <HelpCircle size={15} color="var(--accent-green)" />
          <span>Rule-Based Demo (Not blackbox AI)</span>
        </div>
      </div>

      <div className="advisor-layout-grid">
        {/* Left Column: Project Selector List */}
        <div className="advisor-sidebar-col">
          <div className="selector-card spectral-card">
            <h3 className="selector-title">Select Project to Evaluate</h3>
            <div className="project-selector-list">
              {projects.map((proj) => {
                const isSelected = proj.id === activeProject.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setActiveProjId(proj.id)}
                    className={`selector-item-btn ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="selector-item-score">
                      <span>{proj.revivalScore}</span>
                    </div>
                    <div className="selector-item-info">
                      <div className="selector-item-name">{proj.name}</div>
                      <div className="selector-item-cat">{proj.category}</div>
                    </div>
                    <span className={`selector-verdict verdict-${proj.revivalScores.verdict.toLowerCase()}`}>
                      {proj.revivalScores.verdict}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth Evaluation Verdict */}
        <div className="advisor-main-col">
          {/* Main Verdict Card */}
          <div className="verdict-card spectral-card">
            <div className="verdict-top-section">
              {/* Glowing Revival Dial */}
              <div className="gauge-dial-container">
                <svg className="gauge-svg" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="var(--bg-input)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="var(--accent-green)"
                    strokeWidth="8"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * scores.overall) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                </svg>
                <div className="gauge-score-wrap">
                  <span className="gauge-score-num">{scores.overall}</span>
                  <span className="gauge-score-max">/100</span>
                </div>
              </div>

              {/* Verdict Text & Reasoning */}
              <div className="verdict-summary-wrap">
                <div className="verdict-badge-row">
                  <span className={`badge verdict-pill verdict-badge-${scores.verdict.toLowerCase()}`}>
                    RECOMMENDATION: {scores.verdict}
                  </span>
                  <span className="verdict-target-name">{activeProject.name}</span>
                </div>

                <h2 className="verdict-headline">
                  {scores.verdict === 'REVIVE' && `${activeProject.name} is worth bringing back.`}
                  {scores.verdict === 'REPURPOSE' && `${activeProject.name} has prime components to salvage.`}
                  {scores.verdict === 'ARCHIVE' && `${activeProject.name} is best archived to avoid distraction.`}
                </h2>

                <p className="verdict-reasoning-text">{scores.reasoning}</p>

                {/* DnD Action Protocol */}
                <div className="verdict-dnd-section">
                  <div className="verdict-dnd-instructions">
                    <GripVertical size={13} color="var(--text-muted)" />
                    <span>Drag the project card to a fate zone below</span>
                  </div>

                  {/* Draggable project card */}
                  <div
                    className={`advisor-drag-card ${isDraggingAdvisor ? 'advisor-card-dragging' : ''}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', 'advisor-project-card');
                      setIsDraggingAdvisor(true);
                    }}
                    onDragEnd={() => {
                      setIsDraggingAdvisor(false);
                      advisorEnterCounts.current = {};
                      setAdvisorActiveZone(null);
                      setAdvisorInvalidZone(null);
                    }}
                    title={`Drag to apply action — ${activeProject.name}`}
                  >
                    <GripVertical size={14} />
                    <Layers size={14} />
                    <span>{activeProject.name}</span>
                    <span className={`advisor-status-chip adv-chip-${activeProject.status}`}>
                      {activeProject.status}
                    </span>
                  </div>

                  {/* Fate zones */}
                  <div className="advisor-zones-row">
                    {advisorZoneConfig.map((zone) => {
                      const isActive = advisorActiveZone === zone.id;
                      const isInvalid = advisorInvalidZone === zone.id;
                      return (
                        <div
                          key={zone.id}
                          className={['advisor-drop-zone', zone.cls, isActive ? 'adv-zone-active' : '', isInvalid ? 'adv-zone-invalid' : ''].filter(Boolean).join(' ')}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            advisorEnterCounts.current[zone.id] = (advisorEnterCounts.current[zone.id] ?? 0) + 1;
                            if (zone.validStatuses.includes(activeProject.status)) {
                              setAdvisorActiveZone(zone.id);
                              setAdvisorInvalidZone(null);
                            } else {
                              setAdvisorInvalidZone(zone.id);
                              setAdvisorActiveZone(null);
                            }
                          }}
                          onDragLeave={(_e) => {
                            advisorEnterCounts.current[zone.id] = Math.max(0, (advisorEnterCounts.current[zone.id] ?? 1) - 1);
                            if ((advisorEnterCounts.current[zone.id] ?? 0) === 0) {
                              if (advisorActiveZone === zone.id) setAdvisorActiveZone(null);
                              if (advisorInvalidZone === zone.id) setAdvisorInvalidZone(null);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleAdvisorDrop(e, zone.id)}
                        >
                          <span className="adv-zone-icon">{zone.icon}</span>
                          <span className="adv-zone-label">{zone.label}</span>
                          {isActive && <span className="adv-zone-hint">Drop here!</span>}
                          {isInvalid && <span className="adv-zone-invalid-hint">Wrong status</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Scores Metric Bars */}
            <div className="metric-breakdown-row">
              <div className="metric-box">
                <div className="metric-box-header">
                  <span className="metric-title">
                    <Cpu size={14} color="var(--accent-green)" /> Technical Feasibility
                  </span>
                  <span className="metric-val">{scores.feasibility}%</span>
                </div>
                <div className="progress-bar-track" style={{ height: '6px', margin: '6px 0 0 0' }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${scores.feasibility}%` }}
                  />
                </div>
                <span className="metric-hint">Codebase health & task completion ratio</span>
              </div>

              <div className="metric-box">
                <div className="metric-box-header">
                  <span className="metric-title">
                    <BarChart3 size={14} color="var(--accent-blue)" /> Market Relevance
                  </span>
                  <span className="metric-val">{scores.marketDemand}%</span>
                </div>
                <div className="progress-bar-track" style={{ height: '6px', margin: '6px 0 0 0' }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${scores.marketDemand}%`, background: 'var(--accent-blue)' }}
                  />
                </div>
                <span className="metric-hint">Audience appetite & domain category score</span>
              </div>

              <div className="metric-box">
                <div className="metric-box-header">
                  <span className="metric-title">
                    <Clock size={14} color="var(--accent-amber)" /> Effort-to-MVP Ratio
                  </span>
                  <span className="metric-val">{scores.effortRequired}%</span>
                </div>
                <div className="progress-bar-track" style={{ height: '6px', margin: '6px 0 0 0' }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${scores.effortRequired}%`, background: 'var(--accent-amber)' }}
                  />
                </div>
                <span className="metric-hint">Remaining workload manageable in &lt;1 sprint</span>
              </div>
            </div>
          </div>

          {/* Prioritized Action Checklist */}
          <div className="checklist-card spectral-card">
            <div className="checklist-card-header">
              <div>
                <h3 className="section-title">Prioritized Action Checklist</h3>
                <p className="section-subtitle">
                  Step-by-step sequential blueprint calculated for {activeProject.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProjectId(activeProject.id);
                  setIsDetailModalOpen(true);
                }}
                className="btn-ghost"
              >
                Full Post-Mortem →
              </button>
            </div>

            <div className="advisor-steps-list">
              {scores.recommendedSteps.map((step, idx) => {
                const isDone = !!completedSteps[step];
                return (
                  <div
                    key={idx}
                    className={`step-item-card ${isDone ? 'step-done' : ''}`}
                    onClick={() => toggleStep(step)}
                  >
                    <div className="step-checkbox-wrap">
                      {isDone ? (
                        <CheckCircle2 size={18} color="var(--accent-green)" />
                      ) : (
                        <Circle size={18} color="var(--text-muted)" />
                      )}
                    </div>
                    <div className="step-content">
                      <div className="step-num">PHASE 0{idx + 1}</div>
                      <div className="step-instruction">{step}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import type { Project, AbandonmentReason, TaskItem } from '../types';
import { Plus, Trash2, X, Skull, CheckCircle, GripVertical } from 'lucide-react';
import './BuryModal.css';

const PRESET_REASONS: AbandonmentReason[] = [
  'Lost motivation',
  'Scope creep',
  'Technical roadblocks',
  'Time constraints',
  'Market changed',
  'Shiny object syndrome',
  'Solo burnout',
  'Other',
];

const CATEGORIES: Project['category'][] = [
  'Dev Tools',
  'AI Tools',
  'Web Apps',
  'Mobile',
  'Games',
  'CLI',
  'Utilities',
];

export const BuryModal: React.FC = () => {
  const { isBuryModalOpen, setIsBuryModalOpen, addProject, showToast } = useGraveyard();

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Project['category']>('Dev Tools');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['React', 'TypeScript']);
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [abandonmentReason, setAbandonmentReason] = useState<AbandonmentReason>('Scope creep');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [completedTasks, setCompletedTasks] = useState<TaskItem[]>([
    { id: '1', text: 'Scaffolded architecture and core layout', completed: true },
  ]);
  const [newCompletedInput, setNewCompletedInput] = useState('');
  const [remainingTasks, setRemainingTasks] = useState<TaskItem[]>([
    { id: '2', text: 'Complete backend API integration & authentication', completed: false },
  ]);
  const [newRemainingInput, setNewRemainingInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // DnD state for the "BURY PROJECT" drop zone
  const [isDraggingDraft, setIsDraggingDraft] = useState(false);
  const [buryZoneActive, setBuryZoneActive] = useState(false);
  const [buryZoneInvalid, setBuryZoneInvalid] = useState(false);
  const buryEnterCount = useRef(0);

  if (!isBuryModalOpen) return null;

  const resetForm = () => {
    setName('');
    setTagline('');
    setDescription('');
    setNotes('');
    setTechnologies(['React', 'TypeScript']);
    setErrors({});
    setCompletedTasks([{ id: '1', text: 'Scaffolded architecture and core layout', completed: true }]);
    setRemainingTasks([{ id: '2', text: 'Complete backend API integration & authentication', completed: false }]);
    setCustomReason('');
    setAbandonmentReason('Scope creep');
    buryEnterCount.current = 0;
    setBuryZoneActive(false);
    setBuryZoneInvalid(false);
    setIsDraggingDraft(false);
  };

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tag: string) => setTechnologies(technologies.filter((t) => t !== tag));

  const handleAddCompletedTask = () => {
    if (newCompletedInput.trim()) {
      setCompletedTasks([
        ...completedTasks,
        { id: Date.now().toString(), text: newCompletedInput.trim(), completed: true },
      ]);
      setNewCompletedInput('');
    }
  };

  const handleRemoveCompletedTask = (id: string) =>
    setCompletedTasks(completedTasks.filter((t) => t.id !== id));

  const handleAddRemainingTask = () => {
    if (newRemainingInput.trim()) {
      setRemainingTasks([
        ...remainingTasks,
        { id: Date.now().toString(), text: newRemainingInput.trim(), completed: false },
      ]);
      setNewRemainingInput('');
    }
  };

  const handleRemoveRemainingTask = (id: string) =>
    setRemainingTasks(remainingTasks.filter((t) => t.id !== id));

  const doSubmit = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Project name is required';
    if (!description.trim()) newErrors.description = 'Post-mortem description is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    const finalReason =
      abandonmentReason === 'Other' && customReason.trim()
        ? customReason.trim()
        : abandonmentReason;

    addProject({
      name: name.trim(),
      tagline: tagline.trim() || description.trim().slice(0, 60),
      description: description.trim(),
      category,
      technologies: technologies.length > 0 ? technologies : ['JavaScript'],
      status: 'buried',
      repoUrl: repoUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      completedTasks,
      remainingTasks,
      abandonmentReason: finalReason,
      notes: notes.trim() || undefined,
    });
    return true;
  };

  const handleDraftDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    buryEnterCount.current = 0;
    setBuryZoneActive(false);
    setIsDraggingDraft(false);

    const data = e.dataTransfer.getData('text/plain');
    if (data !== 'bury-draft') return;

    const ok = doSubmit();
    if (!ok) {
      setBuryZoneInvalid(true);
      showToast('Please fill in the required fields before burying', 'warning');
      setTimeout(() => setBuryZoneInvalid(false), 1600);
      return;
    }
    resetForm();
    setIsBuryModalOpen(false);
  };

  const isFormReady = name.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="modal-backdrop" onClick={() => setIsBuryModalOpen(false)}>
      <div
        className="modal-content bury-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="bury-modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="header-icon-grave">
              <Skull size={20} color="var(--accent-green)" />
            </div>
            <div>
              <h2 id="bury-modal-title">Bury a Project</h2>
              <p className="modal-header-sub">Fill in details, then drag the tombstone to lay it to rest</p>
            </div>
          </div>
          <button
            onClick={() => setIsBuryModalOpen(false)}
            className="modal-close-btn"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="modal-body-scroll">
          {/* General Info */}
          <div className="form-section">
            <div className="form-grid-2">
              <div>
                <label className="form-label" htmlFor="proj-name">
                  Project Name *
                </label>
                <input
                  id="proj-name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g., CryptCraft, VectorSync"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div>
                <label className="form-label" htmlFor="proj-category">
                  Category
                </label>
                <select
                  id="proj-category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Project['category'])}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="form-label" htmlFor="proj-tagline">
                One-line Tagline
              </label>
              <input
                id="proj-tagline"
                type="text"
                className="form-input"
                placeholder="e.g., High-throughput vector search in pure WebAssembly"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="form-label" htmlFor="proj-desc">
                Post-Mortem Description *
              </label>
              <textarea
                id="proj-desc"
                rows={3}
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="What was this project? What worked well before it was halted?"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          {/* Technologies */}
          <div className="form-section">
            <label className="form-label">Tech Stack</label>
            <div className="tech-input-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add technology and press Enter"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); }
                }}
              />
              <button type="button" onClick={handleAddTech} className="btn-secondary" style={{ padding: '8px 14px' }}>
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="tags-container">
              {technologies.map((t) => (
                <span key={t} className="tech-chip">
                  {t}
                  <button type="button" onClick={() => handleRemoveTech(t)} className="remove-chip-btn">✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="form-section form-grid-2">
            <div>
              <label className="form-label" htmlFor="proj-repo">Repository URL</label>
              <input id="proj-repo" type="url" className="form-input" placeholder="https://github.com/..." value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="proj-live">Live Preview URL</label>
              <input id="proj-live" type="url" className="form-input" placeholder="https://..." value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
            </div>
          </div>

          {/* Abandonment Reason */}
          <div className="form-section">
            <label className="form-label" htmlFor="proj-reason">Primary Reason for Abandonment</label>
            <select
              id="proj-reason"
              className="form-select"
              value={abandonmentReason}
              onChange={(e) => setAbandonmentReason(e.target.value as AbandonmentReason)}
            >
              {PRESET_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {abandonmentReason === 'Other' && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '10px' }}
                placeholder="Specify custom reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>

          {/* Completed Tasks */}
          <div className="form-section">
            <label className="form-label">Completed Milestones ({completedTasks.length})</label>
            <div className="task-adder-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add a milestone that was finished..."
                value={newCompletedInput}
                onChange={(e) => setNewCompletedInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompletedTask(); } }}
              />
              <button type="button" onClick={handleAddCompletedTask} className="btn-secondary"><Plus size={16} /></button>
            </div>
            <div className="task-items-list">
              {completedTasks.map((task) => (
                <div key={task.id} className="task-item-row completed-row">
                  <CheckCircle size={15} color="var(--accent-green)" />
                  <span className="task-text">{task.text}</span>
                  <button type="button" onClick={() => handleRemoveCompletedTask(task.id)} className="task-delete-btn"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Tasks */}
          <div className="form-section">
            <label className="form-label">Remaining / Unfinished Work ({remainingTasks.length})</label>
            <div className="task-adder-row">
              <input
                type="text"
                className="form-input"
                placeholder="What was left to complete?"
                value={newRemainingInput}
                onChange={(e) => setNewRemainingInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRemainingTask(); } }}
              />
              <button type="button" onClick={handleAddRemainingTask} className="btn-secondary"><Plus size={16} /></button>
            </div>
            <div className="task-items-list">
              {remainingTasks.map((task) => (
                <div key={task.id} className="task-item-row remaining-row">
                  <span className="task-bullet" />
                  <span className="task-text">{task.text}</span>
                  <button type="button" onClick={() => handleRemoveRemainingTask(task.id)} className="task-delete-btn"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <label className="form-label" htmlFor="proj-notes">Cemetery Notes & Key Takeaways</label>
            <textarea
              id="proj-notes"
              rows={2}
              className="form-textarea"
              placeholder="What lessons or architecture insights can be passed forward?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* DnD Footer — Tombstone Draft + BURY PROJECT Zone */}
        <div className="bury-dnd-footer">
          <div className="bury-dnd-instructions">
            <span>Fill in the required fields above, then drag the tombstone below into the zone to bury this project.</span>
          </div>

          <div className="bury-dnd-row">
            {/* Draggable tombstone draft card */}
            <div
              className={[
                'bury-draft-card',
                isDraggingDraft ? 'draft-card-dragging' : '',
                !isFormReady ? 'draft-card-incomplete' : '',
              ].filter(Boolean).join(' ')}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', 'bury-draft');
                setIsDraggingDraft(true);
              }}
              onDragEnd={() => {
                setIsDraggingDraft(false);
                setBuryZoneActive(false);
                buryEnterCount.current = 0;
              }}
              title={isFormReady ? 'Drag to BURY PROJECT zone to create this project' : 'Fill in required fields first'}
            >
              <GripVertical size={14} className="draft-grip" />
              <Skull size={16} />
              <div className="draft-card-info">
                <span className="draft-card-name">{name.trim() || 'Unnamed Project'}</span>
                <span className="draft-card-cat">{category}</span>
              </div>
              {!isFormReady && <span className="draft-incomplete-dot" title="Required fields missing" />}
            </div>

            {/* BURY PROJECT drop zone */}
            <div
              className={[
                'bury-project-zone',
                buryZoneActive ? 'bury-zone-active' : '',
                buryZoneInvalid ? 'bury-zone-invalid' : '',
              ].filter(Boolean).join(' ')}
              onDragEnter={(e) => {
                e.preventDefault();
                buryEnterCount.current++;
                setBuryZoneActive(true);
              }}
              onDragLeave={() => {
                buryEnterCount.current = Math.max(0, buryEnterCount.current - 1);
                if (buryEnterCount.current === 0) setBuryZoneActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDraftDrop}
              aria-label="Bury project drop zone"
            >
              <Skull size={20} />
              <span>BURY PROJECT</span>
              <span className="bury-zone-hint">
                {buryZoneActive ? 'Release to lay to rest!' : 'Drop tombstone here'}
              </span>
            </div>
          </div>

          <div className="bury-dnd-cancel-row">
            <button
              type="button"
              onClick={() => { resetForm(); setIsBuryModalOpen(false); }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

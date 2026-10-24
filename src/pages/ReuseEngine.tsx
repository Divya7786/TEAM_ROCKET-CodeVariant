import React, { useRef, useState, useMemo } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import type { ReusableAsset } from '../types';
import {
  Boxes,
  Copy,
  Check,
  Search,
  Plus,
  Trash2,
  Edit3,
  Tag,
  FolderGit2,
  X,
  FileCode,
  GripVertical,
  Save,
} from 'lucide-react';
import './ReuseEngine.css';

export const ReuseEngine: React.FC = () => {
  const {
    snippets,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    projects,
    showToast,
  } = useGraveyard();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSnippetId, setActiveSnippetId] = useState<string>(() => snippets[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<ReusableAsset | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<ReusableAsset['category']>('hook');
  const [formLang, setFormLang] = useState('typescript');
  const [formCode, setFormCode] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formProjectId, setFormProjectId] = useState('');

  // DnD state for delete zone (inspector area)
  const [draggingSnippetId, setDraggingSnippetId] = useState<string | null>(null);
  const [deleteZoneActive, setDeleteZoneActive] = useState(false);
  const [deleteZoneInvalid, setDeleteZoneInvalid] = useState(false);
  const deleteEnterCount = useRef(0);

  // DnD state for modal save zone
  const [isDraggingDraft, setIsDraggingDraft] = useState(false);
  const [saveZoneActive, setSaveZoneActive] = useState(false);
  const saveEnterCount = useRef(0);

  // Category counts
  const counts = useMemo(() => {
    return {
      total: snippets.length,
      components: snippets.filter((s) => s.category === 'component').length,
      hooks: snippets.filter((s) => s.category === 'hook').length,
      utilities: snippets.filter((s) => s.category === 'utility').length,
      ideas: snippets.filter((s) => s.category === 'idea').length,
    };
  }, [snippets]);

  // Filtered snippets
  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchDesc = s.description.toLowerCase().includes(q);
        const matchCode = s.code.toLowerCase().includes(q);
        const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchCode || matchTags;
      }
      return true;
    });
  }, [snippets, selectedCategory, searchQuery]);

  const activeSnippet = useMemo(() => {
    return (
      filteredSnippets.find((s) => s.id === activeSnippetId) ||
      filteredSnippets[0] ||
      null
    );
  }, [filteredSnippets, activeSnippetId]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingSnippet(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('hook');
    setFormLang('typescript');
    setFormCode('// Reusable function or component\n');
    setFormTags('react, util');
    setFormProjectId('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (snip: ReusableAsset) => {
    setEditingSnippet(snip);
    setFormTitle(snip.title);
    setFormDesc(snip.description);
    setFormCategory(snip.category);
    setFormLang(snip.language);
    setFormCode(snip.code);
    setFormTags(snip.tags.join(', '));
    setFormProjectId(snip.projectId || '');
    setIsModalOpen(true);
  };

  const doSaveModal = () => {
    if (!formTitle.trim() || !formCode.trim()) {
      showToast('Asset title and code are required', 'warning');
      return false;
    }
    const selectedProj = projects.find((p) => p.id === formProjectId);
    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editingSnippet) {
      updateSnippet(editingSnippet.id, {
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        language: formLang,
        code: formCode,
        tags: parsedTags,
        projectId: formProjectId || undefined,
        projectName: selectedProj ? selectedProj.name : undefined,
      });
    } else {
      addSnippet({
        title: formTitle.trim(),
        description: formDesc.trim(),
        category: formCategory,
        language: formLang,
        code: formCode,
        tags: parsedTags,
        projectId: formProjectId || undefined,
        projectName: selectedProj ? selectedProj.name : undefined,
      });
    }
    setIsModalOpen(false);
    return true;
  };

  const isFormReady = formTitle.trim().length > 0 && formCode.trim().length > 0;

  return (
    <div className="reuse-page">
      {/* Page Header */}
      <div className="reuse-header">
        <div>
          <h1 className="page-main-title">Reuse Engine</h1>
          <p className="page-main-sub">
            Harvest, search, and copy battle-tested snippets and components from buried repos.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary" id="btn-add-snippet">
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="reuse-stats-row">
        <div
          className={`reuse-stat-box spectral-card ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <div className="reuse-stat-num">{counts.total}</div>
          <div className="reuse-stat-label">Total Snippets</div>
        </div>
        <div
          className={`reuse-stat-box spectral-card ${selectedCategory === 'component' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('component')}
        >
          <div className="reuse-stat-num">{counts.components}</div>
          <div className="reuse-stat-label">Components</div>
        </div>
        <div
          className={`reuse-stat-box spectral-card ${selectedCategory === 'hook' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('hook')}
        >
          <div className="reuse-stat-num">{counts.hooks}</div>
          <div className="reuse-stat-label">Custom Hooks</div>
        </div>
        <div
          className={`reuse-stat-box spectral-card ${selectedCategory === 'utility' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('utility')}
        >
          <div className="reuse-stat-num">{counts.utilities}</div>
          <div className="reuse-stat-label">Utilities</div>
        </div>
        <div
          className={`reuse-stat-box spectral-card ${selectedCategory === 'idea' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('idea')}
        >
          <div className="reuse-stat-num">{counts.ideas}</div>
          <div className="reuse-stat-label">Project Ideas</div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="reuse-controls-bar spectral-card">
        <div className="reuse-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search snippets by name, tags, or code content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="reuse-search-input"
          />
        </div>

        <div className="reuse-category-tabs">
          {['all', 'component', 'hook', 'utility', 'idea'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`reuse-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat === 'all' ? 'All' : `${cat.charAt(0).toUpperCase() + cat.slice(1)}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: 2-Column Inspector */}
      <div className="reuse-workspace-grid">
        {/* Left Column: Snippet List */}
        <div className="snippet-list-pane spectral-card">
          <div className="pane-header">
            <span className="pane-title">Harvested Vault ({filteredSnippets.length})</span>
            <span className="pane-dnd-hint">
              <GripVertical size={12} /> drag to delete
            </span>
          </div>

          <div className="snippet-items-scroll">
            {filteredSnippets.length === 0 ? (
              <div className="empty-pane-notice">
                <FileCode size={32} color="var(--text-muted)" />
                <p>No reusable assets found matching criteria</p>
              </div>
            ) : (
              filteredSnippets.map((snip) => {
                const isSelected = activeSnippet?.id === snip.id;
                const isDragging = draggingSnippetId === snip.id;
                return (
                  <div
                    key={snip.id}
                    draggable
                    onClick={() => setActiveSnippetId(snip.id)}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', snip.id);
                      setDraggingSnippetId(snip.id);
                    }}
                    onDragEnd={() => {
                      setDraggingSnippetId(null);
                      setDeleteZoneActive(false);
                      deleteEnterCount.current = 0;
                    }}
                    className={`snippet-item-card ${isSelected ? 'active' : ''} ${isDragging ? 'snippet-card-dragging' : ''}`}
                  >
                    <div className="snippet-drag-grip">
                      <GripVertical size={13} color="var(--text-muted)" />
                    </div>
                    <div className="snippet-item-body">
                      <div className="snippet-item-top">
                        <span className="badge">{snip.category}</span>
                        <span className="snippet-lang-tag">{snip.language}</span>
                      </div>
                      <h4 className="snippet-item-title">{snip.title}</h4>
                      <p className="snippet-item-desc">{snip.description}</p>
                      <div className="snippet-item-footer">
                        {snip.projectName && (
                          <span className="origin-proj-chip">
                            <FolderGit2 size={12} /> {snip.projectName}
                          </span>
                        )}
                        <span className="snippet-date">{snip.dateAdded}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DELETE SNIPPET drop zone */}
          <div
            className={[
              'snippet-delete-zone',
              deleteZoneActive ? 'delete-zone-active' : '',
              deleteZoneInvalid ? 'delete-zone-invalid' : '',
            ].filter(Boolean).join(' ')}
            onDragEnter={(e) => {
              e.preventDefault();
              deleteEnterCount.current++;
              setDeleteZoneActive(true);
              setDeleteZoneInvalid(false);
            }}
            onDragLeave={() => {
              deleteEnterCount.current = Math.max(0, deleteEnterCount.current - 1);
              if (deleteEnterCount.current === 0) setDeleteZoneActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              deleteEnterCount.current = 0;
              setDeleteZoneActive(false);
              setDraggingSnippetId(null);
              const snippetId = e.dataTransfer.getData('text/plain');
              const snip = snippets.find((s) => s.id === snippetId);
              if (snip) {
                deleteSnippet(snip.id);
                if (activeSnippetId === snip.id) setActiveSnippetId('');
              } else {
                setDeleteZoneInvalid(true);
                setTimeout(() => setDeleteZoneInvalid(false), 1400);
                showToast('Drag a snippet from the list to delete it', 'warning');
              }
            }}
          >
            <Trash2 size={16} />
            <span>{deleteZoneActive ? 'Release to delete!' : 'DELETE SNIPPET'}</span>
          </div>
        </div>

        {/* Right Column: Code Viewer / Editor */}
        <div className="code-inspector-pane spectral-card">
          {activeSnippet ? (
            <>
              {/* Header */}
              <div className="inspector-header">
                <div>
                  <div className="inspector-cat-row">
                    <span className="badge">{activeSnippet.category}</span>
                    {activeSnippet.projectName && (
                      <span className="origin-badge">
                        From: <strong>{activeSnippet.projectName}</strong>
                      </span>
                    )}
                  </div>
                  <h2 className="inspector-title">{activeSnippet.title}</h2>
                  <p className="inspector-desc">{activeSnippet.description}</p>
                </div>

                <div className="inspector-actions">
                  <button
                    onClick={() => handleCopyCode(activeSnippet.code, activeSnippet.id)}
                    className="btn-primary"
                    title="Copy code snippet"
                  >
                    {copiedId === activeSnippet.id ? (
                      <>
                        <Check size={16} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(activeSnippet)}
                    className="btn-secondary"
                    title="Edit snippet"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              </div>

              {/* Tags Row */}
              <div className="inspector-tags-row">
                <Tag size={13} color="var(--text-muted)" />
                {activeSnippet.tags.map((t) => (
                  <span key={t} className="tech-tag">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Code Box */}
              <div className="code-viewer-container">
                <div className="code-viewer-topbar">
                  <span className="code-lang-label">{activeSnippet.language}</span>
                  <button
                    onClick={() => handleCopyCode(activeSnippet.code, activeSnippet.id)}
                    className="quick-copy-text-btn"
                  >
                    {copiedId === activeSnippet.id ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="inspector-empty">
              <Boxes size={48} color="var(--text-muted)" />
              <p>Select a snippet on the left to preview, edit, or copy</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Snippet Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content snippet-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingSnippet ? 'Edit Snippet' : 'Add Reusable Asset'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bury-form">
              <div className="modal-body-scroll">
                <div className="form-grid-2">
                  <div>
                    <label className="form-label">Asset Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., useDebounce, GlassCard"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formCategory}
                      onChange={(e) =>
                        setFormCategory(e.target.value as ReusableAsset['category'])
                      }
                    >
                      <option value="hook">Custom Hook</option>
                      <option value="component">Component</option>
                      <option value="utility">Utility Function</option>
                      <option value="idea">Project Idea</option>
                      <option value="config">Config / Shader</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Language / Syntax</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="typescript, css, json, rust, python..."
                    value={formLang}
                    onChange={(e) => setFormLang(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description of what this asset provides"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Origin Project</label>
                  <select
                    className="form-select"
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                  >
                    <option value="">None / Standalone</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="react, hooks, debounce, performance"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Code / Snippet Content *</label>
                  <textarea
                    rows={8}
                    className="form-textarea"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                  />
                </div>
              </div>

              {/* DnD Footer — drag draft card to SAVE ASSET zone */}
              <div className="bury-dnd-footer">
                <div className="bury-dnd-instructions">
                  Drag the asset card to <strong>SAVE ASSET</strong> to commit it
                </div>
                <div className="bury-dnd-row">
                  {/* Draggable draft card */}
                  <div
                    className={[
                      'bury-draft-card',
                      isDraggingDraft ? 'draft-card-dragging' : '',
                      !isFormReady ? 'draft-card-incomplete' : '',
                    ].filter(Boolean).join(' ')}
                    draggable={isFormReady}
                    onDragStart={(e) => {
                      if (!isFormReady) { e.preventDefault(); return; }
                      e.dataTransfer.setData('text/plain', 'snippet-draft');
                      setIsDraggingDraft(true);
                    }}
                    onDragEnd={() => {
                      setIsDraggingDraft(false);
                      setSaveZoneActive(false);
                      saveEnterCount.current = 0;
                    }}
                    title={isFormReady ? 'Drag to save' : 'Fill in title and code first'}
                  >
                    <GripVertical size={14} color="var(--text-muted)" className="draft-grip" />
                    <div className="draft-card-info">
                      <span className="draft-card-name">
                        {formTitle.trim() || 'Untitled Asset'}
                      </span>
                      <span className="draft-card-cat">{formCategory}</span>
                    </div>
                    {!isFormReady && <span className="draft-incomplete-dot" />}
                  </div>

                  {/* SAVE ASSET drop zone */}
                  <div
                    className={[
                      'bury-project-zone',
                      saveZoneActive ? 'bury-zone-active' : '',
                    ].filter(Boolean).join(' ')}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      saveEnterCount.current++;
                      setSaveZoneActive(true);
                    }}
                    onDragLeave={() => {
                      saveEnterCount.current = Math.max(0, saveEnterCount.current - 1);
                      if (saveEnterCount.current === 0) setSaveZoneActive(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      saveEnterCount.current = 0;
                      setSaveZoneActive(false);
                      setIsDraggingDraft(false);
                      if (e.dataTransfer.getData('text/plain') === 'snippet-draft') {
                        doSaveModal();
                      }
                    }}
                  >
                    <Save size={18} />
                    <span>{editingSnippet ? 'UPDATE ASSET' : 'SAVE ASSET'}</span>
                    <span className="bury-zone-hint">
                      {saveZoneActive ? 'Release to save!' : 'Drop here to commit'}
                    </span>
                  </div>
                </div>

                <div className="bury-dnd-cancel-row">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

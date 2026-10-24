import React, { useState, useMemo } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Skull,
  Zap,
  ArrowUpDown,
  Layers,
} from 'lucide-react';
import { GraveyardCanvas } from '../components/GraveyardCanvas';
import './DigitalGraveyard.css';

type SortOption = 'revival-desc' | 'revival-asc' | 'date-desc' | 'date-asc' | 'progress-desc' | 'name-asc';
type ViewMode = 'grid' | 'list' | 'canvas';

export const DigitalGraveyard: React.FC = () => {
  const {
    projects,
    searchQuery,
    setSearchQuery,
    setSelectedProjectId,
    setIsDetailModalOpen,
    setIsBuryModalOpen,
    reviveProject,
  } = useGraveyard();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('revival-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const categories = ['All', 'Dev Tools', 'AI Tools', 'Web Apps', 'Mobile', 'Utilities', 'Games', 'CLI'];

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Status filter
        if (selectedStatus === 'buried' && p.status !== 'buried') return false;
        if (selectedStatus === 'archived' && p.status !== 'archived') return false;
        if (selectedStatus === 'risen' && p.status !== 'risen') return false;

        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTagline = p.tagline?.toLowerCase().includes(q);
          const matchTech = p.technologies.some((t) => t.toLowerCase().includes(q));
          const matchReason = p.abandonmentReason.toLowerCase().includes(q);
          return matchName || matchDesc || matchTagline || matchTech || matchReason;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'revival-desc') return b.revivalScore - a.revivalScore;
        if (sortBy === 'revival-asc') return a.revivalScore - b.revivalScore;
        if (sortBy === 'date-desc') return new Date(b.dateBuried).getTime() - new Date(a.dateBuried).getTime();
        if (sortBy === 'date-asc') return new Date(a.dateBuried).getTime() - new Date(b.dateBuried).getTime();
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'progress-desc') {
          const aComp = (a.completedTasks?.length || 0) / ((a.completedTasks?.length || 0) + (a.remainingTasks?.length || 1));
          const bComp = (b.completedTasks?.length || 0) / ((b.completedTasks?.length || 0) + (b.remainingTasks?.length || 1));
          return bComp - aComp;
        }
        return 0;
      });
  }, [projects, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="graveyard-page">
      {/* Header & Stats bar */}
      <div className="graveyard-page-header">
        <div>
          <h1 className="page-main-title">Digital Graveyard</h1>
          <p className="page-main-sub">
            Browse, exhume, and inspect all dormant projects and repositories.
          </p>
        </div>

        <button
          onClick={() => setIsBuryModalOpen(true)}
          className="btn-primary"
          id="btn-graveyard-bury"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Bury a project</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="category-chips-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`cat-chip-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Controls Bar: Search, Status Filter, Sort, View Toggle */}
      <div className="graveyard-controls-bar spectral-card">
        <div className="controls-search-wrap">
          <Search size={16} className="controls-search-icon" />
          <input
            type="text"
            placeholder="Search cemetery by title, technology, or post-mortem reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="controls-search-input"
          />
        </div>

        <div className="controls-right-group">
          {/* Status selector */}
          <div className="select-with-icon">
            <Filter size={14} className="control-icon" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="controls-select"
            >
              <option value="all">All States</option>
              <option value="buried">Buried Only</option>
              <option value="risen">Risen / Active</option>
              <option value="archived">Archived Vault</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="select-with-icon">
            <ArrowUpDown size={14} className="control-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="controls-select"
            >
              <option value="revival-desc">Revival Score (Highest)</option>
              <option value="revival-asc">Revival Score (Lowest)</option>
              <option value="date-desc">Recently Buried</option>
              <option value="date-asc">Oldest Buried</option>
              <option value="progress-desc">Most Complete</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('canvas')}
              className={`view-btn ${viewMode === 'canvas' ? 'active' : ''}`}
              title="Canvas / Drag-and-Drop Mode"
            >
              <Layers size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-status-line">
        <span>Showing <strong>{filteredProjects.length}</strong> buried artifacts</span>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="clear-search-pill">
            Clear search &ldquo;{searchQuery}&rdquo; ✕
          </button>
        )}
      </div>

      {/* Canvas Mode */}
      {viewMode === 'canvas' && (
        <GraveyardCanvas projects={filteredProjects} />
      )}

      {/* Grid or List Display (hidden in canvas mode) */}
      {viewMode !== 'canvas' && (filteredProjects.length === 0 ? (
        <div className="empty-graveyard spectral-card">
          <Skull size={48} color="var(--text-muted)" />
          <h3>No buried artifacts matched your filters</h3>
          <p>Try clearing filters or search terms, or bury a new project.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const completed = project.completedTasks?.length || 0;
            const remaining = project.remainingTasks?.length || 0;
            const total = completed + remaining;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={project.id}
                className="project-grid-card spectral-card"
                onClick={() => handleOpenProject(project.id)}
              >
                {/* Top Row: Category + Revival Pill */}
                <div className="card-top-row">
                  <span className="badge">{project.category}</span>
                  <div className="revival-pill">
                    <Zap size={12} fill="var(--accent-green)" />
                    <span>{project.revivalScore}% Index</span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="card-project-title">{project.name}</h3>
                <p className="card-project-tagline">{project.tagline}</p>
                <p className="card-project-desc">{project.description}</p>

                {/* Tech Badges */}
                <div className="card-tech-badges">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="tech-tag">+{project.technologies.length - 4}</span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="card-progress-section">
                  <div className="card-progress-info">
                    <span className="progress-label">Milestone Progress</span>
                    <span className="progress-percent">{pct}% ({completed}/{total})</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: '4px', margin: '4px 0 0 0' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Abandonment Reason Callout */}
                <div className="card-reason-line">
                  <span className="reason-bullet" />
                  <span className="reason-text">Cause: {project.abandonmentReason}</span>
                </div>

                {/* Card Footer Actions */}
                <div className="card-action-footer" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenProject(project.id)}
                    className="btn-secondary card-view-btn"
                  >
                    Exhume Details
                  </button>
                  {project.status === 'buried' ? (
                    <button
                      onClick={() => reviveProject(project.id)}
                      className="btn-primary card-revive-btn"
                      title="Resurrect project"
                    >
                      <Zap size={14} /> Revive
                    </button>
                  ) : (
                    <span className="risen-status-chip">⚡ Risen</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="projects-list-table spectral-card">
          <div className="table-header-row">
            <span className="th-cell th-name">Project</span>
            <span className="th-cell th-category">Category</span>
            <span className="th-cell th-tech">Tech Stack</span>
            <span className="th-cell th-reason">Cause of Death</span>
            <span className="th-cell th-progress">Completion</span>
            <span className="th-cell th-score">Revival Index</span>
            <span className="th-cell th-actions">Action</span>
          </div>

          <div className="table-body">
            {filteredProjects.map((project) => {
              const completed = project.completedTasks?.length || 0;
              const total = completed + (project.remainingTasks?.length || 0);
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div
                  key={project.id}
                  className="table-item-row"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <div className="td-cell th-name">
                    <div className="table-proj-name">{project.name}</div>
                    <div className="table-proj-sub">{project.tagline}</div>
                  </div>

                  <div className="td-cell th-category">
                    <span className="badge">{project.category}</span>
                  </div>

                  <div className="td-cell th-tech">
                    <div className="tech-tags-list">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span key={t} className="tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="td-cell th-reason">
                    <span className="table-reason-text">{project.abandonmentReason}</span>
                  </div>

                  <div className="td-cell th-progress">
                    <div className="table-progress-wrap">
                      <div className="progress-bar-track" style={{ height: '4px', margin: 0, width: '60px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="table-pct">{pct}%</span>
                    </div>
                  </div>

                  <div className="td-cell th-score">
                    <span className="revival-pill">{project.revivalScore}%</span>
                  </div>

                  <div className="td-cell th-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="btn-ghost"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

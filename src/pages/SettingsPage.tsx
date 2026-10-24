import React, { useState } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import type { ThemeMode } from '../types';
import {
  Palette,
  RotateCcw,
  User,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    setTheme,
    updateSettings,
    replayIntro,
    resetToSampleData,
    clearAllUserData,
    exportData,
    importData,
  } = useGraveyard();

  // User profile local state
  const [nameInput, setNameInput] = useState(settings.userName);
  const [roleInput, setRoleInput] = useState(settings.userRole);

  // Confirm modals
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateSettings({
      userName: nameInput.trim(),
      userRole: roleInput.trim(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const themes: {
    id: ThemeMode;
    name: string;
    desc: string;
    bg: string;
    card: string;
    accent: string;
  }[] = [
    {
      id: 'dark',
      name: 'Graveyard Dark',
      desc: 'Near-black surfaces, glowing toxic neon green accents, and subtle mist.',
      bg: '#080810',
      card: '#0f101a',
      accent: '#80DC48',
    },
    {
      id: 'light',
      name: 'Ghost Light',
      desc: 'Crisp off-white surfaces with botanical green accents and high contrast.',
      bg: '#f4f6f9',
      card: '#ffffff',
      accent: '#3ea81e',
    },
    {
      id: 'purple',
      name: 'Spectral Purple',
      desc: 'Deep ethereal purple nocturnal surfaces with emerald neon runes.',
      bg: '#0d0718',
      card: '#170f2c',
      accent: '#a855f7',
    },
  ];

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1 className="page-main-title">Settings & Preferences</h1>
          <p className="page-main-sub">
            Customize visual themes, ghost intro behavior, and browser local storage.
          </p>
        </div>
      </div>

      <div className="settings-sections-stack">
        {/* Section 1: Themes & Visual Appearance */}
        <div className="settings-card spectral-card">
          <div className="settings-card-header">
            <div className="settings-icon-badge">
              <Palette size={18} color="var(--accent-green)" />
            </div>
            <div>
              <h2 className="settings-title">Visual Themes</h2>
              <p className="settings-desc">
                Select your preferred atmosphere. Persists automatically in browser storage.
              </p>
            </div>
          </div>

          <div className="theme-options-grid">
            {themes.map((t) => {
              const isCurrent = settings.theme === t.id;
              return (
                <div
                  key={t.id}
                  className={`theme-picker-card ${isCurrent ? 'selected' : ''}`}
                  onClick={() => setTheme(t.id)}
                >
                  <div
                    className="theme-preview-box"
                    style={{ background: t.bg, border: `1px solid ${t.card}` }}
                  >
                    <div
                      className="preview-card-mockup"
                      style={{ background: t.card }}
                    >
                      <div
                        className="preview-bar-mockup"
                        style={{ background: t.accent }}
                      />
                      <div className="preview-line-mockup" />
                    </div>
                  </div>

                  <div className="theme-info-row">
                    <div>
                      <h4 className="theme-name">{t.name}</h4>
                      <p className="theme-desc">{t.desc}</p>
                    </div>
                    {isCurrent && (
                      <span className="theme-active-tag">Active</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Scary Ghost Intro */}
        <div className="settings-card spectral-card">
          <div className="settings-card-header">
            <div className="settings-icon-badge">
              <Eye size={18} color="var(--accent-green)" />
            </div>
            <div>
              <h2 className="settings-title">Scary Ghost Intro</h2>
              <p className="settings-desc">
                Control the 3-second supernatural phantom cinematic and animations.
              </p>
            </div>
          </div>

          <div className="intro-controls-content">
            <div className="intro-actions-row">
              <button
                onClick={replayIntro}
                className="btn-primary"
                id="btn-replay-intro"
              >
                <RotateCcw size={16} />
                <span>Replay Ghost Intro (3s)</span>
              </button>
              <span className="intro-subtext">
                Renders original SVG phantom with glowing green eyes and dissolve wave.
              </span>
            </div>

            <div className="intro-toggles-list">
              <label className="toggle-label-row">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={settings.autoPlayIntro}
                  onChange={(e) =>
                    updateSettings({ autoPlayIntro: e.target.checked })
                  }
                />
                <div className="toggle-text">
                  <span className="toggle-title">Enable Intro on Fresh Visits</span>
                  <span className="toggle-sub">
                    Plays once on first visit, then remembers in localStorage.
                  </span>
                </div>
              </label>

              <label className="toggle-label-row">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) =>
                    updateSettings({ reducedMotion: e.target.checked })
                  }
                />
                <div className="toggle-text">
                  <span className="toggle-title">Force Reduced Motion</span>
                  <span className="toggle-sub">
                    Disable intense camera sweeps and particle effects.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: User Profile */}
        <div className="settings-card spectral-card">
          <div className="settings-card-header">
            <div className="settings-icon-badge">
              <User size={18} color="var(--accent-green)" />
            </div>
            <div>
              <h2 className="settings-title">Developer Profile</h2>
              <p className="settings-desc">
                Customize your name and role displayed across the mausoleum.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-grid-2">
              <div>
                <label className="form-label" htmlFor="settings-username">
                  Your Name
                </label>
                <input
                  id="settings-username"
                  type="text"
                  className="form-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g., Alex"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="settings-userrole">
                  Role / Specialization
                </label>
                <input
                  id="settings-userrole"
                  type="text"
                  className="form-input"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g., Senior Fullstack Engineer"
                />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button type="submit" className="btn-secondary">
                <CheckCircle size={15} /> Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Section 4: Data Management & Persistence */}
        <div className="settings-card spectral-card">
          <div className="settings-card-header">
            <div className="settings-icon-badge">
              <Database size={18} color="var(--accent-green)" />
            </div>
            <div>
              <h2 className="settings-title">Local Data & Backup</h2>
              <p className="settings-desc">
                Export, import, or manage all project post-mortems and reusable snippets.
              </p>
            </div>
          </div>

          <div className="data-management-grid">
            {/* Export JSON */}
            <div className="data-action-box">
              <div className="data-box-text">
                <h4>Export Graveyard Backup</h4>
                <p>Download all projects, snippets, and activities as a JSON file.</p>
              </div>
              <button onClick={exportData} className="btn-secondary">
                <Download size={15} /> Export JSON
              </button>
            </div>

            {/* Import JSON */}
            <div className="data-action-box">
              <div className="data-box-text">
                <h4>Import Graveyard Backup</h4>
                <p>Restore projects and snippets from a previously saved JSON file.</p>
              </div>
              <label className="btn-secondary file-upload-btn">
                <Upload size={15} /> Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Reset to Sample Data */}
            <div className="data-action-box">
              <div className="data-box-text">
                <h4>Reset Sample Data</h4>
                <p>Restore the default sample projects (Orbit Notes, Snippet Vault, etc.).</p>
              </div>
              <button
                onClick={() => setConfirmResetOpen(true)}
                className="btn-secondary"
              >
                <RefreshCw size={15} /> Reset Default Data
              </button>
            </div>

            {/* Purge All Data */}
            <div className="data-action-box danger-box">
              <div className="data-box-text">
                <h4 style={{ color: '#ef4444' }}>Clear All User Data</h4>
                <p>Permanently remove all projects, snippets, and activities.</p>
              </div>
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="btn-danger"
              >
                <Trash2 size={15} /> Purge Everything
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Reset Data */}
      {confirmResetOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmResetOpen(false)}>
          <div
            className="modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap warning">
              <RefreshCw size={24} color="var(--accent-amber)" />
            </div>
            <h3>Reset to Default Sample Data?</h3>
            <p>
              This will overwrite your existing projects and snippets with the
              original sample portfolio.
            </p>
            <div className="confirm-modal-actions">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setConfirmResetOpen(false);
                }}
                className="btn-primary"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear All Data */}
      {confirmClearOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmClearOpen(false)}>
          <div
            className="modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon-wrap danger">
              <ShieldAlert size={28} color="#ef4444" />
            </div>
            <h3>Are you absolutely sure?</h3>
            <p>
              This will permanently delete all projects, post-mortems, and
              reusable assets from your browser localStorage. This action cannot
              be undone.
            </p>
            <div className="confirm-modal-actions">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllUserData();
                  setConfirmClearOpen(false);
                }}
                className="btn-danger"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

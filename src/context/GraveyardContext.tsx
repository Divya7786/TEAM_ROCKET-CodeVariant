import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Project,
  ReusableAsset,
  ActivityItem,
  UserSettings,
  ThemeMode,
} from '../types';
import {
  initialProjects,
  initialSnippets,
  initialActivities,
  defaultSettings,
} from '../data/initialData';
import { calculateRevivalScore } from '../utils/revivalEngine';

export type NavTab =
  | 'dashboard'
  | 'graveyard'
  | 'advisor'
  | 'reuse'
  | 'risen'
  | 'activity'
  | 'settings';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface GraveyardContextType {
  projects: Project[];
  snippets: ReusableAsset[];
  activities: ActivityItem[];
  settings: UserSettings;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  isBuryModalOpen: boolean;
  setIsBuryModalOpen: (open: boolean) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isIntroActive: boolean;
  replayIntro: () => void;
  dismissIntro: () => void;

  // Data Actions
  addProject: (project: Omit<Project, 'id' | 'dateBuried' | 'lastUpdated' | 'revivalScore' | 'revivalScores'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reviveProject: (id: string) => void;
  buryAgainProject: (id: string) => void;
  archiveProject: (id: string) => void;
  toggleTaskCompletion: (projectId: string, taskId: string, isCompletedList: boolean) => void;

  // Reusable Snippets
  addSnippet: (snippet: Omit<ReusableAsset, 'id' | 'dateAdded'>) => void;
  updateSnippet: (id: string, updates: Partial<ReusableAsset>) => void;
  deleteSnippet: (id: string) => void;

  // Settings & Theme
  setTheme: (theme: ThemeMode) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetToSampleData: () => void;
  clearAllUserData: () => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
}

const GraveyardContext = createContext<GraveyardContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'project_graveyard_projects_v1',
  SNIPPETS: 'project_graveyard_snippets_v1',
  ACTIVITIES: 'project_graveyard_activities_v1',
  SETTINGS: 'project_graveyard_settings_v1',
  SEEDED: 'project_graveyard_seeded_v1',
};

// Write seed data once on first ever load; never overwrites existing user data after that.
function ensureSeeded() {
  if (localStorage.getItem(STORAGE_KEYS.SEEDED)) return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
  localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(initialSnippets));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
  localStorage.setItem(STORAGE_KEYS.SEEDED, '1');
}

export const GraveyardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Seed localStorage on first-ever run so counters are never all-zero
  ensureSeeded();

  // 1. Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return initialProjects;
  });

  // 2. Snippets
  const [snippets, setSnippets] = useState<ReusableAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load snippets from localStorage', e);
    }
    return initialSnippets;
  });

  // 3. Activities
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load activities from localStorage', e);
    }
    return initialActivities;
  });

  // 4. Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return defaultSettings;
  });

  // 5. Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isBuryModalOpen, setIsBuryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  // 6. Intro animation state
  // Check if first visit
  const [isIntroActive, setIsIntroActive] = useState<boolean>(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hasSeenIntro) return false;
      }
    } catch {
      // fallback
    }
    return true; // first time visitor!
  });

  // Persist projects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  }, [projects]);

  // Persist snippets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets));
    } catch (e) {
      console.error('Failed to save snippets', e);
    }
  }, [snippets]);

  // Persist activities
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities', e);
    }
  }, [activities]);

  // Persist settings & sync HTML class theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }

    // Apply theme to document root
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-purple');
    root.classList.add(`theme-${settings.theme}`);
  }, [settings]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const replayIntro = () => {
    setIsIntroActive(true);
  };

  const dismissIntro = () => {
    setIsIntroActive(false);
    setSettings((prev) => ({ ...prev, hasSeenIntro: true }));
  };

  const setTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
    showToast(`Switched to ${theme === 'dark' ? 'Graveyard Dark' : theme === 'light' ? 'Ghost Light' : 'Spectral Purple'} theme`, 'info');
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Preferences updated', 'success');
  };

  // Add Project
  const addProject = (projectData: Omit<Project, 'id' | 'dateBuried' | 'lastUpdated' | 'revivalScore' | 'revivalScores'>) => {
    const now = new Date().toISOString();
    const id = `proj-${Date.now()}`;
    const scores = calculateRevivalScore(projectData);

    const newProject: Project = {
      ...projectData,
      id,
      dateBuried: now,
      lastUpdated: now,
      revivalScore: scores.overall,
      revivalScores: scores,
      isSample: false,
    };

    setProjects((prev) => [newProject, ...prev]);

    // Add activity
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'buried',
      title: `Buried "${newProject.name}" in the cemetery`,
      description: `Post-mortem logged. Initial revival feasibility calculated at ${scores.overall}%.`,
      timestamp: 'Just now',
      projectId: id,
      projectName: newProject.name,
    };
    setActivities((prev) => [activity, ...prev]);

    showToast(`Project "${newProject.name}" has been laid to rest`, 'success');
  };

  // Update Project
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updates, lastUpdated: new Date().toISOString() };
        const updatedScores = calculateRevivalScore(merged);
        return {
          ...merged,
          revivalScore: updatedScores.overall,
          revivalScores: updatedScores,
        };
      })
    );
    showToast('Project details updated', 'success');
  };

  // Delete Project
  const deleteProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
      setIsDetailModalOpen(false);
    }

    if (proj) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'updated',
          title: `Project "${proj.name}" was permanently exhumed/deleted`,
          description: 'Removed from local database.',
          timestamp: 'Just now',
          projectName: proj.name,
        },
        ...prev,
      ]);
    }
    showToast('Project deleted permanently', 'info');
  };

  // Revive Project
  const reviveProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'risen',
              dateRevived: new Date().toISOString(),
              milestones: p.milestones || [
                { title: 'Kickoff MVP reboot sprint', completed: true, dueDate: 'Week 1' },
                { title: 'Resolve outstanding blocking tasks', completed: false, dueDate: 'Week 2' },
                { title: 'Internal testing & feedback', completed: false, dueDate: 'Week 3' },
                { title: 'Public resurrection release', completed: false, dueDate: 'Week 4' },
              ],
            }
          : p
      )
    );

    // Activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'revived',
        title: `⚡ Resurrected "${proj.name}"!`,
        description: 'Brought back from the graveyard into active development.',
        timestamp: 'Just now',
        projectId: id,
        projectName: proj.name,
      },
      ...prev,
    ]);

    // Fire celebratory spectral confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#80DC48', '#a855f7', '#ffffff', '#4ade80'],
      });
    } catch {
      // ignore
    }

    showToast(`⚡ "${proj.name}" has risen from the dead!`, 'success');
  };

  // Bury Again (from Risen)
  const buryAgainProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'buried',
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'buried',
        title: `Returned "${proj.name}" to the graveyard`,
        description: 'Placed back into slumber.',
        timestamp: 'Just now',
        projectId: id,
        projectName: proj.name,
      },
      ...prev,
    ]);

    showToast(`"${proj.name}" returned to the crypt`, 'info');
  };

  // Archive Project
  const archiveProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'archived',
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'archived',
        title: `Archived "${proj.name}"`,
        description: 'Moved to cold mausoleum storage.',
        timestamp: 'Just now',
        projectId: id,
        projectName: proj.name,
      },
      ...prev,
    ]);

    showToast(`"${proj.name}" archived to the crypt vault`, 'info');
  };

  // Toggle Task Completion
  const toggleTaskCompletion = (projectId: string, taskId: string, isCompletedList: boolean) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        let completed = [...proj.completedTasks];
        let remaining = [...proj.remainingTasks];

        if (isCompletedList) {
          // Move from completed to remaining
          const task = completed.find((t) => t.id === taskId);
          if (task) {
            completed = completed.filter((t) => t.id !== taskId);
            remaining.push({ ...task, completed: false });
          }
        } else {
          // Move from remaining to completed
          const task = remaining.find((t) => t.id === taskId);
          if (task) {
            remaining = remaining.filter((t) => t.id !== taskId);
            completed.push({ ...task, completed: true });
          }
        }

        const updated = {
          ...proj,
          completedTasks: completed,
          remainingTasks: remaining,
          lastUpdated: new Date().toISOString(),
        };
        const scores = calculateRevivalScore(updated);
        return {
          ...updated,
          revivalScore: scores.overall,
          revivalScores: scores,
        };
      })
    );
  };

  // Snippets
  const addSnippet = (snippetData: Omit<ReusableAsset, 'id' | 'dateAdded'>) => {
    const newSnippet: ReusableAsset = {
      ...snippetData,
      id: `snip-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      isSample: false,
    };
    setSnippets((prev) => [newSnippet, ...prev]);

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'harvested',
        title: `Harvested asset "${newSnippet.title}"`,
        description: `Saved reusable ${newSnippet.category} to the Reuse Engine.`,
        timestamp: 'Just now',
        projectName: newSnippet.projectName,
      },
      ...prev,
    ]);

    showToast(`Harvested "${newSnippet.title}" to Reuse Engine`, 'success');
  };

  const updateSnippet = (id: string, updates: Partial<ReusableAsset>) => {
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Snippet updated', 'success');
  };

  const deleteSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    showToast('Snippet deleted', 'info');
  };

  // Reset to sample data ("Reset demo data" button in Settings)
  const resetToSampleData = () => {
    setProjects(initialProjects);
    setSnippets(initialSnippets);
    setActivities(initialActivities);
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(initialSnippets));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.SEEDED, '1');
    showToast('Reset to default cemetery sample data', 'info');
  };

  // Clear all data
  const clearAllUserData = () => {
    setProjects([]);
    setSnippets([]);
    setActivities([]);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.SNIPPETS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    showToast('All cemetery data has been purged', 'warning');
  };

  // Export JSON
  const exportData = () => {
    const exportBundle = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      projects,
      snippets,
      activities,
      settings,
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-graveyard-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported cemetery backup JSON', 'success');
  };

  // Import JSON
  const importData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.projects)) setProjects(data.projects);
      if (Array.isArray(data.snippets)) setSnippets(data.snippets);
      if (Array.isArray(data.activities)) setActivities(data.activities);
      if (data.settings) setSettings(data.settings);
      showToast('Successfully imported cemetery backup', 'success');
      return true;
    } catch (e) {
      console.error(e);
      showToast('Failed to parse backup JSON file', 'warning');
      return false;
    }
  };

  return (
    <GraveyardContext.Provider
      value={{
        projects,
        snippets,
        activities,
        settings,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        isBuryModalOpen,
        setIsBuryModalOpen,
        isDetailModalOpen,
        setIsDetailModalOpen,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        isIntroActive,
        replayIntro,
        dismissIntro,
        addProject,
        updateProject,
        deleteProject,
        reviveProject,
        buryAgainProject,
        archiveProject,
        toggleTaskCompletion,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        setTheme,
        updateSettings,
        resetToSampleData,
        clearAllUserData,
        exportData,
        importData,
      }}
    >
      {children}
    </GraveyardContext.Provider>
  );
};

export const useGraveyard = () => {
  const context = useContext(GraveyardContext);
  if (!context) {
    throw new Error('useGraveyard must be used within a GraveyardProvider');
  }
  return context;
};

import type { Project, ReusableAsset, ActivityItem, UserSettings } from '../types';
import { calculateRevivalScore } from '../utils/revivalEngine';

const rawProjects: Omit<Project, 'revivalScore' | 'revivalScores'>[] = [
  {
    id: 'proj-orbit-notes',
    name: 'Orbit Notes',
    tagline: 'A markdown-based note taking app with bidirectional graph view',
    description: 'Clean, distraction-free markdown note-taking app with bidirectional links, local SQLite persistence, and interactive 2D mindmap visualization.',
    category: 'Dev Tools',
    technologies: ['React', 'TypeScript', 'SQLite', 'Tailwind', 'Zustand', 'D3.js'],
    status: 'buried',
    repoUrl: 'https://github.com/alexdev/orbit-notes',
    liveUrl: 'https://orbit-notes-preview.dev',
    completedTasks: [
      { id: 't1', text: 'Markdown parser and live split-pane editor', completed: true },
      { id: 't2', text: 'Local SQLite offline sync with OPFS', completed: true },
      { id: 't3', text: 'Dark mode theme system with CSS tokens', completed: true },
      { id: 't4', text: 'Bidirectional [[wiki-link]] indexing', completed: true },
      { id: 't5', text: 'D3 force-directed knowledge graph layout', completed: true },
    ],
    remainingTasks: [
      { id: 't6', text: 'End-to-end encrypted cloud backup sync', completed: false },
      { id: 't7', text: 'Export to PDF and static HTML bundle', completed: false },
    ],
    abandonmentReason: 'Scope creep',
    notes: 'Got bogged down trying to support multi-device CRDT sync instead of shipping the desktop MVP first. Core editor and graph engine are 100% complete.',
    dateBuried: '2026-07-14T10:30:00.000Z',
    lastUpdated: '2026-09-02T16:45:00.000Z',
    isSample: true,
  },
  {
    id: 'proj-snippet-vault',
    name: 'Snippet Vault',
    tagline: 'Developer micro-snippet manager with CLI sync and encryption',
    description: 'Blazing fast snippet manager with instantaneous global keyboard shortcut, syntax highlighting for 40+ languages, and CLI sync integration.',
    category: 'Dev Tools',
    technologies: ['Rust', 'React', 'Tauri', 'TypeScript', 'Tailwind'],
    status: 'buried',
    repoUrl: 'https://github.com/alexdev/snippet-vault',
    liveUrl: 'https://snippet-vault.dev',
    completedTasks: [
      { id: 'sv-1', text: 'Global keyboard shortcut listener in Rust Tauri', completed: true },
      { id: 'sv-2', text: 'AES-256 local encrypted storage vault', completed: true },
      { id: 'sv-3', text: 'Monaco editor lightweight integration', completed: true },
      { id: 'sv-4', text: 'Tags, categories, and fuzzy search palette', completed: true },
    ],
    remainingTasks: [
      { id: 'sv-5', text: 'Cross-platform CLI tool for bash/zsh integration', completed: false },
      { id: 'sv-6', text: 'GitHub Gist two-way automated sync', completed: false },
    ],
    abandonmentReason: 'Time constraints',
    notes: 'Busy with work deliverables. The desktop app is already compiled and stable for macOS & Windows.',
    dateBuried: '2026-08-20T14:15:00.000Z',
    lastUpdated: '2026-09-28T09:20:00.000Z',
    isSample: true,
  },
  {
    id: 'proj-task-ai',
    name: 'Task AI',
    tagline: 'Autonomous daily task prioritization assistant',
    description: 'Smart productivity dashboard that consumes your calendars and GitHub PRs to recommend the 3 highest leverage tasks to tackle each morning.',
    category: 'AI Tools',
    technologies: ['Next.js', 'TypeScript', 'OpenAI API', 'Tailwind', 'Prisma'],
    status: 'buried',
    repoUrl: 'https://github.com/alexdev/task-ai',
    liveUrl: 'https://task-ai-demo.dev',
    completedTasks: [
      { id: 'ta-1', text: 'Google Calendar and GitHub API webhooks integration', completed: true },
      { id: 'ta-2', text: 'Executive summary LLM prompt pipeline with fallback', completed: true },
      { id: 'ta-3', text: 'Sleek dark mode Kanban view with drag-and-drop', completed: true },
    ],
    remainingTasks: [
      { id: 'ta-4', text: 'Stripe subscription checkout & user tier limits', completed: false },
      { id: 'ta-5', text: 'Migrate OpenAI SDK to latest streaming interface', completed: false },
      { id: 'ta-6', text: 'Slack and Discord morning notification bot', completed: false },
    ],
    abandonmentReason: 'Lost motivation',
    notes: 'Prompt engineering costs became unpredictable during prototyping. With modern caching and lower token prices, this is prime for revival.',
    dateBuried: '2026-05-11T12:00:00.000Z',
    lastUpdated: '2026-08-15T11:00:00.000Z',
    isSample: true,
  },
  {
    id: 'proj-devdesk',
    name: 'DevDesk',
    tagline: 'All-in-one developer workspace dashboard with embedded terminal',
    description: 'Desktop hub that combines Docker container controls, local environment variables switcher, git status watcher, and custom scratchpads.',
    category: 'Dev Tools',
    technologies: ['Vue', 'Electron', 'Node.js', 'Pinia', 'XTerm.js'],
    status: 'buried',
    repoUrl: 'https://github.com/alexdev/devdesk',
    liveUrl: '',
    completedTasks: [
      { id: 'dd-1', text: 'Integrated XTerm.js with PTY backend communication', completed: true },
      { id: 'dd-2', text: 'Docker socket status watcher and restart actions', completed: true },
    ],
    remainingTasks: [
      { id: 'dd-3', text: 'Resolve Electron native build issues on Windows ARM', completed: false },
      { id: 'dd-4', text: 'Configurable widget layout with drag-to-dock', completed: false },
      { id: 'dd-5', text: 'Refactor state store to avoid high CPU usage', completed: false },
    ],
    abandonmentReason: 'Technical roadblocks',
    notes: 'Hit roadblocks with Electron memory footprints on large multi-monitor setups. Might be better suited as a Tauri or Web app rewrite.',
    dateBuried: '2026-03-04T08:30:00.000Z',
    lastUpdated: '2026-05-19T17:10:00.000Z',
    isSample: true,
  },
  {
    id: 'proj-echo-audio',
    name: 'Echo Audio',
    tagline: 'Spatial audio ambiance generator for deep focus coding',
    description: 'Generative binaural soundscapes generator using Web Audio API synthesis for rain, retro terminal keystrokes, and interstellar drone frequencies.',
    category: 'Web Apps',
    technologies: ['Web Audio API', 'Svelte', 'Tailwind', 'Canvas API'],
    status: 'buried',
    repoUrl: 'https://github.com/alexdev/echo-audio',
    liveUrl: 'https://echo-audio.dev',
    completedTasks: [
      { id: 'ea-1', text: 'Web Audio modular synthesizer graph', completed: true },
      { id: 'ea-2', text: 'Smooth cross-fader and spatial pan controls', completed: true },
      { id: 'ea-3', text: 'Canvas procedural visualizer for audio frequencies', completed: true },
    ],
    remainingTasks: [
      { id: 'ea-4', text: 'User presets saving to local indexedDB', completed: false },
      { id: 'ea-5', text: 'Pomodoro timer integration with chime triggers', completed: false },
    ],
    abandonmentReason: 'Market changed',
    notes: 'Several similar tools launched around the same time. The generative sound synthesis code and audio visualizer canvas are top-tier reusable assets.',
    dateBuried: '2026-06-19T18:00:00.000Z',
    lastUpdated: '2026-07-22T14:30:00.000Z',
    isSample: true,
  },
  {
    id: 'proj-look-dev',
    name: 'Look Dev',
    tagline: 'Real-time CSS layout previewer and design token inspector',
    description: 'Browser extension and web app to inspect and simulate CSS container queries, subgrid, and modern color spaces in live websites.',
    category: 'Dev Tools',
    technologies: ['React', 'Vite', 'PostCSS', 'TypeScript', 'CSS Modules'],
    status: 'buried',
    repoUrl: 'https://github.com/alexdev/look-dev',
    liveUrl: 'https://look-dev.dev',
    completedTasks: [
      { id: 'ld-1', text: 'Color palette contrast ratio & OKLCH color picker', completed: true },
      { id: 'ld-2', text: 'Container queries responsive breakpoint ruler', completed: true },
      { id: 'ld-3', text: 'Live CSS injection sandbox', completed: true },
    ],
    remainingTasks: [
      { id: 'ld-4', text: 'Chrome Web Store manifest v3 submission packaging', completed: false },
      { id: 'ld-5', text: 'Figma tokens import/export format support', completed: false },
    ],
    abandonmentReason: 'Time constraints',
    notes: '80% complete and working cleanly. Just needs Manifest v3 final manifest polishing to launch as a standalone extension.',
    dateBuried: '2026-09-05T15:20:00.000Z',
    lastUpdated: '2026-10-10T12:00:00.000Z',
    isSample: true,
  },
  {
    id: 'proj-git-pulse',
    name: 'GitPulse',
    tagline: 'GitHub developer streak motivator & productivity insights',
    description: 'Live interactive contribution graph and streak motivator that gamifies git commits, code reviews, and issue triage with retro achievements.',
    category: 'Dev Tools',
    technologies: ['React', 'Next.js', 'Tailwind', 'TypeScript', 'GitHub GraphQL'],
    status: 'risen',
    repoUrl: 'https://github.com/alexdev/git-pulse',
    liveUrl: 'https://gitpulse-live.dev',
    completedTasks: [
      { id: 'gp-1', text: 'OAuth login with GitHub and token refresh flow', completed: true },
      { id: 'gp-2', text: 'Isometric 3D contribution graph renderer', completed: true },
      { id: 'gp-3', text: 'Daily streak calculation and streak-freeze shields', completed: true },
      { id: 'gp-4', text: 'Public user profile shareable SVG cards', completed: true },
    ],
    remainingTasks: [
      { id: 'gp-5', text: 'Team leaderboard workspace view', completed: false },
    ],
    abandonmentReason: 'Lost motivation',
    notes: 'Resurrected from the graveyard 2 weeks ago! Revamped with modern Tailwind and isometric canvas. 85% to milestone goal.',
    dateBuried: '2026-02-14T09:00:00.000Z',
    dateRevived: '2026-10-10T11:00:00.000Z',
    lastUpdated: '2026-10-22T19:30:00.000Z',
    isSample: true,
    milestones: [
      { title: 'Core isometric graph engine', completed: true, dueDate: 'Oct 12' },
      { title: 'Public beta deployment on Vercel', completed: true, dueDate: 'Oct 18' },
      { title: 'Social preview open-graph automated generation', completed: false, dueDate: 'Nov 01' },
      { title: 'Product Hunt official launch', completed: false, dueDate: 'Nov 15' },
    ],
  },
  {
    id: 'proj-cache-flow',
    name: 'CacheFlow',
    tagline: 'Ultra-fast in-memory cache visualization & key debugger',
    description: 'Visual inspector for Redis, Dragonfly, and browser Cache Storage with TTL countdown meters and memory fragmentation alerts.',
    category: 'Utilities',
    technologies: ['TypeScript', 'React', 'Zustand', 'Vite', 'Tailwind'],
    status: 'risen',
    repoUrl: 'https://github.com/alexdev/cache-flow',
    liveUrl: 'https://cacheflow.dev',
    completedTasks: [
      { id: 'cf-1', text: 'Live key search with glob pattern matching', completed: true },
      { id: 'cf-2', text: 'TTL real-time countdown progress visualization', completed: true },
      { id: 'cf-3', text: 'JSON and binary payload preview decoder', completed: true },
    ],
    remainingTasks: [
      { id: 'cf-4', text: 'Cluster mode nodes topology viewer', completed: false },
    ],
    abandonmentReason: 'Time constraints',
    notes: 'Brought back from the dead. Currently tracking 70% progress with first alpha testers active.',
    dateBuried: '2026-04-01T10:00:00.000Z',
    dateRevived: '2026-10-15T14:00:00.000Z',
    lastUpdated: '2026-10-23T08:15:00.000Z',
    isSample: true,
    milestones: [
      { title: 'Standalone desktop wrapper package', completed: true, dueDate: 'Oct 16' },
      { title: 'TLS certificate authentication support', completed: false, dueDate: 'Nov 05' },
      { title: 'Telemetry export to Prometheus', completed: false, dueDate: 'Nov 20' },
    ],
  },
];

export const initialProjects: Project[] = rawProjects.map((p) => {
  const scores = calculateRevivalScore(p);
  return {
    ...p,
    revivalScore: scores.overall,
    revivalScores: scores,
  };
});

export const initialSnippets: ReusableAsset[] = [
  {
    id: 'snip-debounce',
    title: 'useDebounce with Cancel & Flush',
    description: 'Production-ready React hook to debounce expensive search or render functions with immediate flush and cancel controls.',
    category: 'hook',
    language: 'typescript',
    code: `import { useEffect, useRef, useCallback } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const latestCallback = useRef(callback);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const debounced = useCallback((...args: Parameters<T>) => {
    cancel();
    timerRef.current = setTimeout(() => {
      latestCallback.current(...args);
    }, delay);
  }, [cancel, delay]);

  return { debounced, cancel };
}`,
    projectId: 'proj-orbit-notes',
    projectName: 'Orbit Notes',
    tags: ['react', 'hooks', 'performance', 'debounce'],
    dateAdded: '2026-08-10',
    isSample: true,
  },
  {
    id: 'snip-glass-card',
    title: 'Frosted Spectral Glass Card',
    description: 'Ultra-modern glassmorphic card component with subtle glowing neon borders and GPU-accelerated backdrop blur.',
    category: 'component',
    language: 'css',
    code: `.spectral-card {
  background: rgba(15, 16, 25, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(128, 220, 72, 0.15);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.spectral-card:hover {
  border-color: rgba(128, 220, 72, 0.4);
  box-shadow: 0 12px 40px rgba(128, 220, 72, 0.08);
  transform: translateY(-2px);
}`,
    projectId: 'proj-look-dev',
    projectName: 'Look Dev',
    tags: ['css', 'glassmorphism', 'ui', 'cards'],
    dateAdded: '2026-09-02',
    isSample: true,
  },
  {
    id: 'snip-safefetch',
    title: 'safeFetch with Exponential Backoff',
    description: 'Resilient browser fetch utility that automatically handles transient 5xx/429 errors with jittered exponential retries.',
    category: 'utility',
    language: 'typescript',
    code: `export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoffMs = 400
): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (retries > 0 && (res.status >= 500 || res.status === 429)) {
        const jitter = Math.random() * 200;
        await new Promise((r) => setTimeout(r, backoffMs + jitter));
        return safeFetch<T>(url, options, retries - 1, backoffMs * 2);
      }
      throw new Error(\`Request failed with status \${res.status}\`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, backoffMs));
      return safeFetch<T>(url, options, retries - 1, backoffMs * 2);
    }
    throw err;
  }
}`,
    projectId: 'proj-task-ai',
    projectName: 'Task AI',
    tags: ['fetch', 'network', 'resilience', 'retry'],
    dateAdded: '2026-08-15',
    isSample: true,
  },
  {
    id: 'snip-audio-vis',
    title: 'Canvas Radial Frequency Visualizer',
    description: 'Lightweight canvas renderer that transforms AnalyserNode frequency data into dynamic glowing orbital arcs.',
    category: 'component',
    language: 'typescript',
    code: `export function renderRadialAudio(
  ctx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.6;
  const bars = dataArray.length;

  for (let i = 0; i < bars; i++) {
    const value = dataArray[i];
    const barHeight = (value / 255) * 50;
    const rad = ((Math.PI * 2) / bars) * i;

    const x1 = centerX + Math.cos(rad) * radius;
    const y1 = centerY + Math.sin(rad) * radius;
    const x2 = centerX + Math.cos(rad) * (radius + barHeight);
    const y2 = centerY + Math.sin(rad) * (radius + barHeight);

    ctx.strokeStyle = \`rgba(128, 220, 72, \${value / 255})\`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}`,
    projectId: 'proj-echo-audio',
    projectName: 'Echo Audio',
    tags: ['canvas', 'webaudio', 'visualization'],
    dateAdded: '2026-07-20',
    isSample: true,
  },
  {
    id: 'snip-use-localstorage',
    title: 'useLocalStorage with Cross-Tab Sync',
    description: 'Safe SSR-ready hook that syncs state across multiple browser windows using the storage event.',
    category: 'hook',
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}`,
    projectId: 'proj-snippet-vault',
    projectName: 'Snippet Vault',
    tags: ['react', 'storage', 'hooks', 'cross-tab'],
    dateAdded: '2026-08-25',
    isSample: true,
  },
  {
    id: 'snip-ghost-idea',
    title: 'Spectral AI Agent for Dead Repos',
    description: 'Concept architecture: A GitHub Action that runs every 90 days of inactivity to open a friendly resurrection pull request with updated dependencies.',
    category: 'idea',
    language: 'markdown',
    code: `### Spectral AI GitHub Action
1. Detect repositories with > 90 days without commits
2. Check for breaking npm/cargo dependency updates
3. Generate an automated PR: "👻 Spectral Maintenance: 3 dependencies patched"
4. Include a mini-postmortem prompt: "Do you want to archive or resurrect?"`,
    projectId: 'proj-orbit-notes',
    projectName: 'Orbit Notes',
    tags: ['idea', 'automation', 'github-actions', 'resurrection'],
    dateAdded: '2026-09-12',
    isSample: true,
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'revived',
    title: 'Orbit Notes marked for revival',
    description: 'Revival Advisor calculated score 92/100: High feasibility, clean codebase.',
    timestamp: '2 hours ago',
    projectId: 'proj-orbit-notes',
    projectName: 'Orbit Notes',
  },
  {
    id: 'act-2',
    type: 'harvested',
    title: 'Harvested reusable hook from Orbit Notes',
    description: 'Extracted "useDebounce with Cancel & Flush" into the Reuse Engine.',
    timestamp: '5 hours ago',
    projectId: 'proj-orbit-notes',
    projectName: 'Orbit Notes',
  },
  {
    id: 'act-3',
    type: 'buried',
    title: 'Buried Echo Audio with post-mortem',
    description: 'Recorded reason "Market changed". Extracted WebAudio canvas visualizer.',
    timestamp: '1 day ago',
    projectId: 'proj-echo-audio',
    projectName: 'Echo Audio',
  },
  {
    id: 'act-4',
    type: 'revived',
    title: 'GitPulse completed milestone',
    description: 'Shipped public beta deployment on Vercel (Milestone 2/4).',
    timestamp: '3 days ago',
    projectId: 'proj-git-pulse',
    projectName: 'GitPulse',
  },
  {
    id: 'act-5',
    type: 'harvested',
    title: 'Harvested safeFetch utility',
    description: 'Added exponential backoff network utility from Task AI.',
    timestamp: '4 days ago',
    projectId: 'proj-task-ai',
    projectName: 'Task AI',
  },
  {
    id: 'act-6',
    type: 'buried',
    title: 'Buried DevDesk into cemetery',
    description: 'Recorded reason "Technical roadblocks" due to Electron memory constraints.',
    timestamp: '6 days ago',
    projectId: 'proj-devdesk',
    projectName: 'DevDesk',
  },
];

export const defaultSettings: UserSettings = {
  userName: 'Alex',
  userRole: 'Senior Fullstack Engineer',
  theme: 'dark',
  autoPlayIntro: true,
  hasSeenIntro: false,
  reducedMotion: false,
};

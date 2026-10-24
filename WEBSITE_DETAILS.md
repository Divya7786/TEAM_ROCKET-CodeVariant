# TEAM_ROCKET CodeVariant — Website Details Document

## 1. Product Overview

This website is a futuristic, themed dashboard for developers to manage abandoned side projects, ideas, prototypes, and unfinished repositories. It is designed as a “digital mausoleum” for code: a place where users can bury dead projects, review whether they are worth reviving, salvage reusable pieces, and track resurrected work.

The product blends:
- project lifecycle management
- retrospective / post-mortem recording
- rule-based revival scoring
- reusable code asset management
- personal developer workflow tracking

It is built as a React + TypeScript + Vite application and stores all user data in the browser’s localStorage.

---

## 2. Core Idea

The website creates a metaphorical “graveyard” for ideas:
- a project gets “buried” when it is paused, abandoned, or no longer active
- the app evaluates the project using a revival score
- if the project has good structure or potential, it can be revived
- reusable code, hooks, utilities, and components can be extracted into a vault
- resurrected ideas move into an “Risen Projects” flow

This makes the app useful for developers who have many half-finished concepts and want a structured way to decide what to continue, archive, or repurpose.

---

## 3. Main User Value

The site helps developers answer five questions:
1. Which dead projects still have value?
2. Which ideas are worth reviving?
3. What components, hooks, or utilities can be reused?
4. What was the original reason for abandonment?
5. How do I keep a personal record of my experimentation pipeline?

---

## 4. Pages and Modules

### 4.1 Dashboard
The landing / home page acts as a central command center.

Features:
- greeting area with user profile name and role
- hero banner with ghost mascot and cinematic intro
- key metrics cards:
  - Buried Projects
  - Revived & Risen
  - Active Reboot Sprints
  - Reusable Snippets
- Revival Radar section highlighting the most promising buried projects
- recent cemetery highlights
- quick actions: bury project, open advisor, revive selected project

Purpose:
- gives an immediate overview of project health and momentum
- surfaces the best revival candidates first

---

### 4.2 Digital Graveyard
This is the project archive / listing page.

Features:
- searchable project list
- category filtering by type (Dev Tools, AI Tools, Web Apps, Mobile, Utilities, Games, CLI)
- state filter (All, Buried Only, Risen, Archived)
- sort options:
  - revival score descending / ascending
  - recently buried / oldest
  - progress completion
  - alphabetical
- view toggle: grid or list
- project cards showing:
  - name
  - tagline
  - category
  - technologies
  - completion progress
  - revival score
  - action buttons

Purpose:
- act as a searchable museum of all abandoned or active projects
- makes buried work easy to inspect and revive

---

### 4.3 Bury a Project
This is a modal form used to add a project to the graveyard.

Fields typically include:
- project name
- tagline
- description
- category
- tech stack
- status
- repository URL / live URL
- completed tasks
- remaining tasks
- abandonment reason
- notes
- takeaways

Purpose:
- stores post-mortem artifacts and lessons learned
- creates a structured system for documenting dead or sleeping projects

---

### 4.4 Revival Advisor
This page evaluates a buried project using a transparent, deterministic rule-based algorithm.

Features:
- select any project for evaluation
- visual circular score dial from 0 to 100
- metrics panel with sub-scores:
  - technical feasibility
  - market demand
  - effort required
  - overall recommendation
- verdicts:
  - REVIVE
  - REPURPOSE
  - ARCHIVE
- reasoning text explaining the recommendation
- prioritized step checklist
- action buttons:
  - revive project
  - repurpose components
  - archive project

The scoring logic is defined in src/utils/revivalEngine.ts and uses heuristics based on:
- completion ratio
- remaining tasks
- project category
- abandonment reason
- feasibility and effort weightings

This creates a simple “decision engine” without black-box AI.

---

### 4.5 Reuse Engine
This is the code asset vault.

Features:
- collects reusable assets such as:
  - components
  - hooks
  - utilities
  - ideas
  - config snippets
- search snippets by title, description, code content, or tags
- filter by category
- add/edit/delete snippets
- copy code to clipboard
- view snippet metadata and origin project

The idea is to allow developers to harvest useful code from dead projects and keep it in a centralized vault for later reuse.

---

### 4.6 Risen Projects
This area tracks projects that have been revived or resurrected.

Features:
- project progress cards
- milestone checklists
- revived project status tracking
- celebration / confetti effect after revival
- project graduation or status updates

Purpose:
- shows momentum after revival
- makes the “second life” journey visible and motivating

---

### 4.7 Activity & Telemetry
This page provides activity history.

Features:
- chronological activity feed
- events such as:
  - buried project
  - revived project
  - harvested snippets
  - project updates
  - archived entries
- weekly rhythm / usage bars (visual telemetry)

Purpose:
- gives a timeline of the user’s experimentation and progress
- helps identify patterns over time

---

### 4.8 Settings & Preferences
This is the configuration panel.

Features:
- visual theme selector:
  - Graveyard Dark
  - Ghost Light
  - Spectral Purple
- profile customization:
  - user name
  - role/title
- intro controls:
  - replay ghost intro
  - auto-play intro on fresh visits
  - reduced motion option
- data controls:
  - export all data as JSON
  - import data from JSON
  - reset sample data
  - clear all user data

Purpose:
- personalizes the experience
- keeps the app safe, portable, and easy to restore

---

## 5. Design Language

The website uses a dark, theatrical visual language.

### Theme system
There are three runtime themes:
- Graveyard Dark: near-black UI with toxic green accents
- Ghost Light: light neutral background with green highlights
- Spectral Purple: deep purple UI with neon green sections

This is applied via CSS classes on the document root and persisted in localStorage.

### Visual identity
- ghost mascot and glowing spectral illustrations
- smoky gradient backgrounds
- neon green accent palette
- glassmorphism-like cards and panels
- cinematic transitions and animated intro sequence

The UI intentionally feels atmospheric and premium, supporting the “developer mausoleum” concept.

---

## 6. State Management and Data Flow

The app uses a context provider, GraveyardContext, to manage:
- projects
- snippets
- activities
- settings
- navigation state
- selected project
- modal visibility
- toast notifications

This provider centralizes user data and actions such as:
- addProject
- updateProject
- deleteProject
- reviveProject
- buryAgainProject
- archiveProject
- toggleTaskCompletion
- addSnippet
- updateSnippet
- deleteSnippet
- setTheme
- exportData
- importData

The architecture is a single source of truth pattern for the app’s core state.

---

## 7. Persistence Model

The app does not use a backend database.

Instead, user data is stored in browser localStorage under keys such as:
- project_graveyard_projects_v1
- project_graveyard_snippets_v1
- project_graveyard_activities_v1
- project_graveyard_settings_v1

This allows:
- persistence across refreshes
- local backups via exported JSON
- manual import and restore

The data is designed to be user-owned and portable, which fits a personal developer side-project archive.

---

## 8. Data Structures

### Project model
A project includes:
- id
- name
- tagline
- description
- category
- technologies
- status
- repoUrl / liveUrl
- completedTasks
- remainingTasks
- abandonmentReason
- notes
- dates
- revivalScore
- revivalScores
- milestones

### Reusable asset model
A snippet includes:
- id
- title
- description
- category
- language
- code
- tags
- projectId / projectName
- dateAdded

### Activity model
An activity includes:
- id
- type
- title
- description
- timestamp
- project association

---

## 9. Revival Scoring Logic

The revival engine calculates a project’s score based on a mix of weighted heuristics:

- completion ratio = how much work is already done
- feasibility = how realistic it is to finish based on structure and remaining work
- effort required = whether the project is still practical to finish
- market demand = category-based heuristic and reason-based adjustment
- abandonment rationale = provides context to adjust score

The final verdict is one of:
- REVIVE: promising and worth bringing back
- REPURPOSE: strong components but not full project return
- ARCHIVE: better to avoid future effort

This gives the app a structured and explainable decision system instead of a vague AI prediction.

---

## 10. Key User Flow

A typical user journey looks like this:

1. User has an unfinished product or repo.
2. They “bury” it in the Digital Graveyard with notes and remaining tasks.
3. The app calculates a revival score using the advisor engine.
4. User reviews the verdict and recommended next steps.
5. The user decides to:
   - revive the project
   - repurpose components into the Reuse Engine
   - archive it
6. If revived, the project moves into the Risen Projects flow.
7. The user collects reusable snippets and continues building from the vault.

---

## 11. Distinctive Product Characteristics

This website stands out because it combines:
- personal development memory
- product post-mortem workflow
- code reuse collection
- decision support for project resurrection
- a strong thematic brand identity

It is not just a task tracker or project manager. It is a self-hosted creative archive for developers who want to keep their ideas alive without the clutter of a full toolchain.

---

## 12. Tech Stack

Frontend:
- React
- TypeScript
- Vite

UI / Styling:
- custom CSS
- component-level CSS files
- custom theme tokens
- Lucide React icons

Additional:
- canvas-confetti for revival celebrations
- browser localStorage for persistence

---

## 13. File Structure Overview

Core structure:
- src/App.tsx — top-level app shell and route-like page switching
- src/context/GraveyardContext.tsx — state and app logic
- src/data/initialData.ts — sample data seed
- src/utils/revivalEngine.ts — scoring logic
- src/pages/* — each major feature area
- src/components/* — modal, navbar, sidebar, ghost intro, toast, etc.
- src/types/index.ts — domain types

---

## 14. Summary

This website is a personal developer cemetery and revival platform that helps users:
- store abandoned code ideas
- decide what is worth reviving
- repurpose reusable work
- track momentum over time
- customize the experience with themes and local data management

It is a concept-heavy product designed for solo builders, indie hackers, and developers with many unfinished experiments.

---

## 15. Best One-Line Pitch

“An atmospheric developer graveyard where forgotten side projects can be evaluated, revived, repurposed, and turned into reusable code assets.”


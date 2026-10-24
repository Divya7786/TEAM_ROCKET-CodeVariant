import type { Project, RevivalScores } from '../types';

export function calculateRevivalScore(project: Partial<Project>): RevivalScores {
  const completedCount = project.completedTasks?.length || 0;
  const remainingCount = project.remainingTasks?.length || 0;
  const totalTasks = completedCount + remainingCount;
  const completionRatio = totalTasks > 0 ? completedCount / totalTasks : 0.5;

  // Feasibility based on completion ratio & remaining tasks
  let feasibility = Math.round(50 + completionRatio * 40);
  if (remainingCount <= 2 && remainingCount > 0) feasibility += 8;
  if (remainingCount > 8) feasibility -= 12;
  feasibility = Math.min(98, Math.max(25, feasibility));

  // Effort Required (Higher = Easier / Less work left)
  let effortScore = Math.round(completionRatio * 85 + (totalTasks < 5 ? 15 : 0));
  effortScore = Math.min(95, Math.max(20, effortScore));

  // Market Demand heuristic based on category and reason
  let marketDemand = 70;
  const category = project.category || 'Dev Tools';
  if (category === 'AI Tools' || category === 'Dev Tools') {
    marketDemand = 88;
  } else if (category === 'Web Apps') {
    marketDemand = 78;
  } else if (category === 'Mobile') {
    marketDemand = 74;
  } else {
    marketDemand = 65;
  }

  // Adjustments based on abandonment reason
  const reason = (project.abandonmentReason || '').toLowerCase();
  let reasoning = '';
  let verdict: 'REVIVE' | 'REPURPOSE' | 'ARCHIVE' = 'REVIVE';

  if (reason.includes('market') || reason.includes('no audience')) {
    marketDemand -= 25;
    reasoning = 'The original target market or distribution channel shifted. The core logic or UI is still salvageable for parts.';
  } else if (reason.includes('motivation') || reason.includes('shiny object')) {
    feasibility += 5;
    reasoning = 'Abandoned simply due to lost focus or competing priorities. The technical foundation remains solid and ready to ship.';
  } else if (reason.includes('roadblock') || reason.includes('technical')) {
    feasibility -= 18;
    effortScore -= 15;
    reasoning = 'Encountered architectural roadblocks. Recommend stripping down complex dependencies or extracting reusable modules.';
  } else if (reason.includes('scope creep')) {
    reasoning = 'Classic scope creep bloated the original goal. Ruthlessly cutting the backlog to an MVP makes this high-potential.';
  } else if (reason.includes('burnout') || reason.includes('time')) {
    reasoning = 'Time shortage stalled momentum. With 70%+ of the groundwork laid, a single weekend push could reach launch.';
  } else {
    reasoning = 'Codebase has substantial reusable components and clear path to completion with disciplined scoping.';
  }

  // Overall weighted score
  const overall = Math.round(
    feasibility * 0.45 + marketDemand * 0.3 + effortScore * 0.25
  );

  if (overall >= 72) {
    verdict = 'REVIVE';
  } else if (overall >= 46) {
    verdict = 'REPURPOSE';
  } else {
    verdict = 'ARCHIVE';
  }

  // Generate prioritized steps
  const steps: string[] = [];
  if (verdict === 'REVIVE') {
    steps.push('Audit dependencies and upgrade core packages to modern versions.');
    if (project.remainingTasks && project.remainingTasks.length > 0) {
      steps.push(`Tackle blocking task: "${project.remainingTasks[0].text}"`);
    } else {
      steps.push('Implement MVP test coverage and verify end-to-end user path.');
    }
    steps.push('Cut non-essential backlog items and define minimal public v1.0 release.');
    steps.push('Prepare launch announcement (Product Hunt / GitHub / Hacker News).');
  } else if (verdict === 'REPURPOSE') {
    steps.push('Inspect and extract polished UI components into the Reuse Engine.');
    steps.push('Decouple backend/API logic and export as standalone micro-utilities.');
    steps.push('Save the domain or concept notes into your ideas backlog.');
    steps.push('Move repository to an archival monorepo or template repository.');
  } else {
    steps.push('Document key architectural post-mortem lessons in project notes.');
    steps.push('Archive repository to keep your active workspace clutter-free.');
    steps.push('Extract any reusable authentication, configuration, or utility scripts.');
  }

  return {
    overall,
    marketDemand,
    feasibility,
    effortRequired: effortScore,
    verdict,
    reasoning,
    recommendedSteps: steps,
  };
}

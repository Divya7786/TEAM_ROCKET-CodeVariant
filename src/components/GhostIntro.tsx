import React, { useEffect, useState } from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import './GhostIntro.css';

const particles: readonly (readonly [number, number, number])[] = [
  [12, 72, 0],
  [20, 34, 120],
  [29, 61, 40],
  [39, 22, 220],
  [47, 78, 80],
  [57, 28, 180],
  [64, 68, 20],
  [73, 42, 260],
  [82, 74, 100],
  [90, 30, 160],
];

const Ghost: React.FC = () => (
  <svg
    className="intro-ghost"
    viewBox="0 0 420 520"
    role="img"
    aria-label="A shadowy figure with glowing green eyes"
  >
    <defs>
      <radialGradient id="intro-ghost-body" cx="50%" cy="28%" r="70%">
        <stop offset="0" stopColor="#191a20" />
        <stop offset=".55" stopColor="#09090e" />
        <stop offset="1" stopColor="#020204" stopOpacity=".1" />
      </radialGradient>
      <linearGradient id="intro-ghost-smoke" x1=".5" y1="0" x2=".5" y2="1">
        <stop stopColor="#09090e" />
        <stop offset=".72" stopColor="#07070b" stopOpacity=".86" />
        <stop offset="1" stopColor="#080810" stopOpacity="0" />
      </linearGradient>
      <filter id="intro-ghost-eye-glow" x="-250%" y="-250%" width="600%" height="600%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g className="intro-ghost-form">
      <path
        className="intro-outer-smoke"
        d="M91 408C48 364 82 323 53 289C28 260 57 224 95 210C82 130 129 55 210 49C295 56 334 130 323 213C373 236 386 281 354 315C330 342 371 381 333 427C304 462 268 444 247 489C234 454 214 456 198 506C183 457 157 463 140 486C130 447 114 437 91 408Z"
        fill="url(#intro-ghost-smoke)"
      />
      <path
        className="intro-hood"
        d="M112 231C101 139 141 74 210 71C279 75 318 141 307 232C295 330 270 384 210 408C149 382 124 330 112 231Z"
        fill="url(#intro-ghost-body)"
      />
      <path
        className="intro-face"
        d="M144 199C154 121 184 104 210 103C240 105 271 124 280 200C287 264 258 323 210 337C161 322 136 262 144 199Z"
        fill="#030306"
      />
      <path className="intro-eye intro-eye-left" d="M166 204C179 194 191 193 203 202C192 216 180 219 166 204Z" />
      <path className="intro-eye intro-eye-right" d="M217 202C230 193 243 194 255 204C241 219 229 216 217 202Z" />
      <g className="intro-cracks" fill="none" stroke="#80dc48" strokeLinecap="round">
        <path d="M151 252l17-9 10 7 15-20" />
        <path d="M272 258l-18-10-9 8-12-15" />
        <path d="M197 290l13-12 8 13-8 18" />
      </g>
      <path className="intro-tendril intro-t1" d="M126 333C54 379 109 437 47 470" />
      <path className="intro-tendril intro-t2" d="M285 339C361 378 296 436 373 468" />
      <path className="intro-tendril intro-t3" d="M165 386C128 428 169 450 137 507" />
      <path className="intro-tendril intro-t4" d="M250 386C288 426 248 461 284 508" />
    </g>
  </svg>
);

export const GhostIntro: React.FC = () => {
  const { isIntroActive, dismissIntro } = useGraveyard();
  const [animPhase, setAnimPhase] = useState<'emerge' | 'reveal' | 'charge' | 'dissolve'>('emerge');

  useEffect(() => {
    if (!isIntroActive) {
      setAnimPhase('emerge');
      return;
    }

    const t1 = setTimeout(() => setAnimPhase('reveal'), 600);
    const t2 = setTimeout(() => setAnimPhase('charge'), 1500);
    const t3 = setTimeout(() => setAnimPhase('dissolve'), 2400);
    const tEnd = setTimeout(() => {
      dismissIntro();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
    };
  }, [isIntroActive, dismissIntro]);

  if (!isIntroActive) return null;

  return (
    <div className={`ghost-intro-overlay phase-${animPhase}`} role="dialog" aria-modal="true" aria-label="Project Graveyard Cinematic Intro">
      <div className="intro-ambient-glow" />
      <div className="intro-fog intro-fog-one" />
      <div className="intro-fog intro-fog-two" />

      <div className="intro-particles" aria-hidden="true">
        {particles.map(([left, top, delay], index) => (
          <i
            key={index}
            style={
              {
                '--left': `${left}%`,
                '--top': `${top}%`,
                '--delay': `${delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <button
        onClick={dismissIntro}
        className="skip-intro-btn"
        aria-label="Skip Introduction"
      >
        Skip intro <span aria-hidden="true">→</span>
      </button>

      <section className="intro-stage" aria-labelledby="intro-title">
        <Ghost />
        <div className="intro-copy">
          <p className="intro-eyebrow">An afterlife for abandoned ideas</p>
          <h1 id="intro-title" className="intro-title">
            <span>The Project</span>
            <strong>Graveyard</strong>
          </h1>
          <div className="intro-neon-rule" aria-hidden="true">
            <span />
          </div>
          <p className="intro-tagline">Every unfinished idea deserves another life.</p>
        </div>
      </section>

      <div className="intro-energy-sweep" aria-hidden="true" />
      <div className="intro-final-blackout" aria-hidden="true" />
    </div>
  );
};

import React, { useId } from 'react';
import './GhostIllustration.css';

interface GhostIllustrationProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'intro';
  className?: string;
  label?: string;
}

export const GhostIllustration: React.FC<GhostIllustrationProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const bodyId = `grave-ghost-body-${id}`;
  const smokeId = `grave-ghost-smoke-${id}`;
  const energyId = `grave-ghost-energy-${id}`;
  const eyeId = `grave-ghost-eye-${id}`;
  const hazeId = `grave-ghost-haze-${id}`;

  return (
    <div className={`grave-ghost grave-ghost--${size} ${className}`.trim()}>
      <svg
        className="grave-ghost__art"
        viewBox="0 0 240 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <defs>
          <radialGradient id={bodyId} cx="50%" cy="28%" r="74%">
            <stop offset="0" stopColor="#1a211b" />
            <stop offset=".34" stopColor="#080d0a" />
            <stop offset=".78" stopColor="#030605" />
            <stop offset="1" stopColor="#020403" stopOpacity=".12" />
          </radialGradient>
          <linearGradient id={smokeId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#111813" stopOpacity=".9" />
            <stop offset=".48" stopColor="#030705" stopOpacity=".96" />
            <stop offset="1" stopColor="#080f09" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={energyId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#183a15" stopOpacity="0" />
            <stop offset=".38" stopColor="#67e52b" stopOpacity=".58" />
            <stop offset=".62" stopColor="#b4ff69" stopOpacity=".92" />
            <stop offset="1" stopColor="#43a027" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={eyeId}>
            <stop stopColor="#f1ffd9" />
            <stop offset=".24" stopColor="#c4ff77" />
            <stop offset=".58" stopColor="#80dc48" />
            <stop offset="1" stopColor="#52b627" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={hazeId}>
            <stop stopColor="#80dc48" stopOpacity=".18" />
            <stop offset="1" stopColor="#80dc48" stopOpacity="0" />
          </radialGradient>
          <filter id={`grave-ghost-glow-${id}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse className="grave-ghost__haze" cx="120" cy="133" rx="100" ry="124" fill={`url(#${hazeId})`} />

        <g className="grave-ghost__smoke">
          <path
            d="M55 157C29 139 40 112 56 97C42 68 65 46 89 51C96 25 128 18 145 39C169 22 195 43 188 68C218 80 221 111 198 128C220 153 202 177 185 184C199 209 179 229 160 226C148 251 122 256 108 236C84 251 61 232 72 211C45 205 39 178 55 157Z"
            fill={`url(#${smokeId})`}
          />
          <path d="M52 130C28 111 33 91 50 77C39 60 47 44 66 40C56 66 71 77 67 94C63 109 70 119 81 126Z" fill="#080d09" />
          <path d="M191 145C218 124 211 99 195 88C214 66 206 47 190 39C198 62 181 76 188 94C195 111 182 125 171 132Z" fill="#080d09" />
          <path d="M78 215C55 230 48 250 57 266C72 253 83 248 94 245Z" fill="#050906" />
          <path d="M163 219C188 230 197 248 188 265C173 254 162 249 149 246Z" fill="#050906" />
        </g>

        <path
          className="grave-ghost__body"
          d="M120 34C84 34 66 61 65 97C63 127 52 152 49 181C47 198 62 205 75 192C87 180 94 205 108 214C116 220 125 220 133 214C147 205 153 181 166 192C180 205 195 198 191 181C187 151 177 127 175 97C173 61 156 34 120 34Z"
          fill={`url(#${bodyId})`}
          stroke="#27462a"
          strokeOpacity=".48"
          strokeWidth="1.2"
        />

        <path
          d="M120 49C95 49 83 69 82 101C80 127 88 151 97 165C107 157 113 161 120 160C128 161 134 157 143 165C152 150 160 126 158 101C157 69 145 49 120 49Z"
          fill="#020403"
        />
        <path d="M91 105C100 95 111 95 118 104C111 116 101 120 91 105Z" fill="#000" />
        <path d="M122 104C130 95 141 95 150 105C140 120 130 116 122 104Z" fill="#000" />
        <path
          className="grave-ghost__eye"
          d="M94 105C101 98 110 98 116 105C110 112 101 114 94 105Z"
          fill={`url(#${eyeId})`}
          filter={`url(#grave-ghost-glow-${id})`}
        />
        <path
          className="grave-ghost__eye"
          d="M124 105C130 98 139 98 146 105C139 114 130 112 124 105Z"
          fill={`url(#${eyeId})`}
          filter={`url(#grave-ghost-glow-${id})`}
        />

        <g className="grave-ghost__ribbons">
          <path
            className="grave-ghost__ribbon grave-ghost__ribbon--one"
            d="M37 175C69 158 66 125 91 119C117 112 139 144 164 139C186 135 190 111 205 99"
            stroke={`url(#${energyId})`}
            strokeWidth="8"
          />
          <path
            className="grave-ghost__ribbon grave-ghost__ribbon--two"
            d="M41 194C69 212 81 187 99 172C118 156 142 160 155 178C171 200 185 198 205 181"
            stroke={`url(#${energyId})`}
            strokeWidth="5"
          />
          <path
            className="grave-ghost__ribbon-core"
            d="M37 175C69 158 66 125 91 119C117 112 139 144 164 139C186 135 190 111 205 99"
            stroke="#b8ff72"
            strokeWidth="1"
          />
        </g>

        <g className="grave-ghost__tendrils" strokeLinecap="round">
          <path d="M64 164C38 177 29 196 33 218C36 234 28 244 17 249" stroke="#090f0a" strokeWidth="9" />
          <path d="M176 161C199 171 210 192 204 211C199 227 207 241 223 247" stroke="#090f0a" strokeWidth="8" />
          <path d="M85 202C72 222 76 240 65 254" stroke="#080d09" strokeWidth="6" />
          <path d="M153 204C168 222 162 240 176 255" stroke="#080d09" strokeWidth="6" />
        </g>

        <g className="grave-ghost__sparks" aria-hidden="true">
          <circle cx="39" cy="119" r="1.8" />
          <circle cx="201" cy="143" r="1.5" />
          <circle cx="58" cy="224" r="1.4" />
          <circle cx="185" cy="75" r="1.7" />
          <circle cx="139" cy="238" r="1.2" />
        </g>
      </svg>
    </div>
  );
};

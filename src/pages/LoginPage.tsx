import React, { useState } from 'react';
import { Ghost, Mail, Lock, Eye, EyeOff, AlertCircle, Skull, Info } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../auth/authContext';
import './LoginPage.css';

// Tombstone SVG for atmospheric background decoration
const TombstoneSvg: React.FC<{ height: number; opacity?: number }> = ({ height, opacity = 1 }) => {
  const w = height * 0.65;
  return (
    <svg width={w} height={height} viewBox="0 0 65 100" fill="none" style={{ opacity }}>
      <rect x="10" y="40" width="45" height="58" rx="3" fill="#1a1a2e" stroke="#2d2d4e" strokeWidth="1.5" />
      <path d="M10 44 Q32.5 10 55 44" fill="#1a1a2e" stroke="#2d2d4e" strokeWidth="1.5" />
      <rect x="18" y="56" width="29" height="2" rx="1" fill="#2d2d4e" />
      <rect x="22" y="62" width="21" height="1.5" rx="0.75" fill="#2d2d4e" />
      <rect x="24" y="67" width="17" height="1.5" rx="0.75" fill="#2d2d4e" />
      <rect x="5" y="96" width="55" height="4" rx="2" fill="#12122a" />
    </svg>
  );
};

export const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [remember, setRemember]     = useState(false);
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your email/username and password.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(identifier, password, remember);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Login failed.');
    }
  };

  const fillDemo = () => {
    setIdentifier(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="login-page">
      {/* Atmospheric particles */}
      <div className="login-particles" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="login-particle" />
        ))}
      </div>

      {/* Ground fog */}
      <div className="login-fog" aria-hidden />

      {/* Decorative tombstones */}
      <div className="login-tombstones" aria-hidden>
        <TombstoneSvg height={88} opacity={0.9} />
        <TombstoneSvg height={110} opacity={0.75} />
        <TombstoneSvg height={70} opacity={0.6} />
        <TombstoneSvg height={95} opacity={0.8} />
        <TombstoneSvg height={80} opacity={0.65} />
        <TombstoneSvg height={105} opacity={0.85} />
        <TombstoneSvg height={72} opacity={0.7} />
      </div>

      {/* Login card */}
      <div className="login-card" role="main">
        {/* Header */}
        <div className="login-card-header">
          <div className="login-ghost-icon" aria-hidden>
            <Ghost size={30} color="#c084fc" strokeWidth={1.8} />
          </div>

          <span className="login-brand-pill">
            <Skull size={11} />
            Project Graveyard
          </span>

          <h1 className="login-title">
            Admin <span>Portal</span>
          </h1>
          <p className="login-subtitle">
            Enter the crypt — authenticate to manage your buried projects
          </p>
        </div>

        {/* Form */}
        <form className="login-card-body" onSubmit={handleSubmit} noValidate>
          {/* Error */}
          {error && (
            <div className="login-error-box" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Email / Username */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-identifier">
              Email or Username
            </label>
            <div className="login-input-wrap">
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                placeholder="admin@graveyard.dev"
                className={`login-input${error ? ' input-error' : ''}`}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                disabled={loading}
                style={{ paddingLeft: '42px' }}
              />
              <Mail size={16} className="login-input-icon" aria-hidden />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-input-wrap">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`login-input${error ? ' input-error' : ''}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                disabled={loading}
                style={{ paddingLeft: '42px', paddingRight: '44px' }}
              />
              <Lock size={16} className="login-input-icon" aria-hidden />
              <button
                type="button"
                className="login-pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="login-remember-row">
            <label className="login-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="login-spinner" aria-hidden />
                Summoning session…
              </>
            ) : (
              <>
                <Ghost size={17} strokeWidth={2} />
                Sign In to the Crypt
              </>
            )}
          </button>

          {/* Demo credentials */}
          <div className="login-divider">DEMO PROTOTYPE</div>

          <div className="login-demo-box">
            <div className="demo-box-title">
              <Info size={12} />
              Demo credentials — click values to auto-fill
            </div>
            <div className="demo-cred-row">
              <span className="demo-cred-label">Email</span>
              <span
                className="demo-cred-value"
                onClick={fillDemo}
                title="Click to fill"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fillDemo()}
              >
                {DEMO_CREDENTIALS.email}
              </span>
            </div>
            <div className="demo-cred-row">
              <span className="demo-cred-label">Password</span>
              <span
                className="demo-cred-value"
                onClick={fillDemo}
                title="Click to fill"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fillDemo()}
              >
                {DEMO_CREDENTIALS.password}
              </span>
            </div>
            <p className="demo-warning">
              ⚠️ Frontend-only demo. Not secure for production use.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="login-card-footer">
          The Project Graveyard — Admin Portal &nbsp;·&nbsp; Demo Prototype
        </div>
      </div>
    </div>
  );
};

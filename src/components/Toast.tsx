import React from 'react';
import { useGraveyard } from '../context/GraveyardContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useGraveyard();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="var(--accent-green)" />,
    info: <Info size={18} color="var(--accent-blue)" />,
    warning: <AlertTriangle size={18} color="var(--accent-amber)" />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px var(--accent-green-glow)',
        color: 'var(--text-primary)',
        fontSize: '0.88rem',
        fontWeight: 600,
        animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      {icons[toast.type]}
      <span>{toast.message}</span>
    </div>
  );
};

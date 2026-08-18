import { type ReactNode, useEffect } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md';
}

export function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-white rounded-2xl shadow-xl w-full ${size === 'sm' ? 'max-w-sm' : 'max-w-lg'} mx-4 p-6`}>
        {children}
      </div>
    </div>
  );
}

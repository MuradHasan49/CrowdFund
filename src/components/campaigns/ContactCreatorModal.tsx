'use client';

import { Button } from '@/components/ui/Button';
import { X, Mail } from 'lucide-react';

interface ContactCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
}

export function ContactCreatorModal({ isOpen, onClose, creatorName }: ContactCreatorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--cf-border)] bg-[var(--cf-surface-2)] p-4">
          <h2 className="text-lg font-bold text-[var(--cf-text)] flex items-center gap-2">
            <Mail className="h-5 w-5 text-[var(--cf-primary)]" /> Contact Creator
          </h2>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface)] hover:text-[var(--cf-text)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cf-primary)]/10">
            <Mail className="h-8 w-8 text-[var(--cf-primary)]" />
          </div>
          <h3 className="mb-2 text-xl font-extrabold text-[var(--cf-text)]">Coming Soon!</h3>
          <p className="mb-8 text-[var(--cf-text-muted)] leading-relaxed">
            The direct messaging feature to contact <strong className="text-[var(--cf-text)]">{creatorName}</strong> is currently under development. Stay tuned for updates!
          </p>
          <Button onClick={onClose} className="w-full" size="lg">
            Got it, thanks!
          </Button>
        </div>
      </div>
    </div>
  );
}

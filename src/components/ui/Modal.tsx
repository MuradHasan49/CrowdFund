'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modal Component
 * 
 * Accessible dialog primitive rendered via React Portal.
 * Includes focus trap, escape to close, and framer-motion transitions.
 * 
 * Props:
 * - isOpen: boolean controls visibility
 * - onClose: function called when modal is dismissed
 * - title: optional title rendered in the header
 * - maxWidth: controls the max-width of the modal container
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md', className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscape);
      };
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, type: 'spring', bounce: 0 }}
            className={cn(
              "relative w-full rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-2xl z-10 flex flex-col max-h-[90vh]",
              {
                'max-w-sm': maxWidth === 'sm',
                'max-w-md': maxWidth === 'md',
                'max-w-lg': maxWidth === 'lg',
                'max-w-xl': maxWidth === 'xl',
              },
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-[var(--cf-border)] bg-[var(--cf-surface-2)] p-4 rounded-t-xl shrink-0">
                <h2 id="modal-title" className="text-lg font-bold text-[var(--cf-text)]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface)] hover:text-[var(--cf-text)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-primary)]"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

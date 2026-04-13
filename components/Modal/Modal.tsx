'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import css from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  fallbackHref?: string;
}

export default function Modal({
  children,
  fallbackHref = '/notes',
}: ModalProps) {
  const router = useRouter();

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  });

  return (
    <div
      className={css.backdrop}
      onClick={closeModal}
      role="presentation"
      aria-hidden="true"
    >
      <div
        className={css.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            border: 'none',
            background: 'transparent',
            fontSize: '24px',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

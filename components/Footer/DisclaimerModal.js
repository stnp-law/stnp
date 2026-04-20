'use client';

import { useEffect, useRef } from 'react';
import { ShieldWarning, X } from '@phosphor-icons/react';
import styles from './DisclaimerModal.module.css';

export default function DisclaimerModal({ isOpen, onClose, dict }) {
  const modalRef = useRef(null);
  const d = dict?.footer?.disclaimerFull || {};

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      
      window.addEventListener('keydown', handleEscape);
      
      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // If the click happened on the backdrop (not inside the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        tabIndex={-1}
      >
        <button className={styles.closeIcon} onClick={onClose} aria-label="Close">
          <X size={18} weight="bold" />
        </button>

        <div className={styles.header}>
          <ShieldWarning size={44} className={styles.icon} weight="light" />
          <h2 id="disclaimer-title" className={styles.title}>{d.title}</h2>
        </div>

        <div className={styles.content}>
          <p>{d.p1}</p>
          <p>{d.p2}</p>
          
          <div className={styles.callout}>
            <strong className={styles.calloutTitle}>
              {d.confidentialityTitle}
            </strong>
            <p>{d.confidentiality}</p>
          </div>

          <p>{d.p3}</p>
          <p>{d.p4}</p>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            {d.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
}

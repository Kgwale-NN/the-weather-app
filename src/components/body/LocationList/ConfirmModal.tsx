import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme?: 'light' | 'dark';
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  theme = 'light'
}) => {
  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`}>
      <div className={`${styles.modal} ${theme === 'dark' ? styles.dark : ''}`}>
        <div className={styles.iconContainer}>
          <AlertTriangle size={48} className={styles.icon} />
        </div>
        
        <h3 className={`${styles.title} ${theme === 'dark' ? styles.dark : ''}`}>
          {title}
        </h3>
        
        <p className={`${styles.message} ${theme === 'dark' ? styles.dark : ''}`}>
          {message}
        </p>
        
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancel} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.confirm} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

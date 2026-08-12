import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './Notification.module.css';

type NotificationType = 'success' | 'error' | 'info';

type NotificationProps = {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className={styles.icon} />;
      case 'error':
        return <AlertCircle size={20} className={styles.icon} />;
      case 'info':
        return <Info size={20} className={styles.icon} />;
      default:
        return <CheckCircle size={20} className={styles.icon} />;
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]} ${isVisible ? styles.visible : styles.hidden}`}>
      {getIcon()}
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        <X size={16} />
      </button>
    </div>
  );
};

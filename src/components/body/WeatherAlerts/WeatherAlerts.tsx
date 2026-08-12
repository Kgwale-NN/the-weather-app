import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import styles from './WeatherAlerts.module.css';

type WeatherAlert = {
  id: string;
  type: 'warning' | 'watch' | 'advisory' | 'moderate' | 'severe' | 'extreme' | 'minor';
  title: string;
  description: string;
  time: string;
};

type WeatherAlertsProps = {
  alerts: WeatherAlert[] | undefined;
  onDismiss: (alertId: string) => void;
  theme?: 'light' | 'dark';
};

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ 
  alerts, 
  onDismiss,
  theme = 'light' 
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
      case 'moderate':
      case 'severe':
      case 'extreme':
        return <AlertTriangle size={20} />;
      case 'watch':
        return <AlertTriangle size={20} />;
      case 'advisory':
      case 'minor':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className={styles.weatherAlerts}>
        <p className={`${styles.emptyState} ${theme === 'dark' ? styles.dark : ''}`}>
          No weather alerts
        </p>
      </div>
    );
  }

  return (
    <div className={styles.weatherAlerts}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${styles.alertCard} ${styles[alert.type]} ${theme === 'dark' ? styles.dark : ''}`}
        >
          <div className={styles.alertContent}>
            <div className={styles.alertHeader}>
              <span className={`${styles.alertType} ${styles[alert.type]}`}>
                {alert.type}
              </span>
              {getAlertIcon(alert.type)}
            </div>
            <h4 className={`${styles.alertTitle} ${theme === 'dark' ? styles.dark : ''}`}>
              {alert.title}
            </h4>
            <p className={`${styles.alertDescription} ${theme === 'dark' ? styles.dark : ''}`}>
              {alert.description.length > 200 ? alert.description.substring(0, 200) + '...' : alert.description}
            </p>
            <p className={`${styles.alertTime} ${theme === 'dark' ? styles.dark : ''}`}>
              {alert.time}
            </p>
          </div>
          
          <button
            className={`${styles.dismissButton} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={() => onDismiss(alert.id)}
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};
import { useState} from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from 'lucide-react';
import styles from './Forecast.module.css';
import { weatherAPI } from '../../../services/weatherAPI';

type ForecastItem = {
  time: string;
  temperature: number;
  condition: string;
  icon?: string;
};

type ForecastProps = {
  forecastData: ForecastItem[];
  unit?: 'celsius' | 'fahrenheit';
  theme?: 'light' | 'dark';
  location?: string;
};

export const Forecast: React.FC<ForecastProps> = ({ 
  forecastData, 
  unit = 'celsius', 
  theme = 'light',
  location = ''
}) => {
  const [view, setView] = useState<'hourly' | 'daily'>('hourly');
  const [dailyForecast, setDailyForecast] = useState<ForecastItem[]>([]);
const displayData = view === 'daily' ? dailyForecast : forecastData;
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const convertTemperature = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return <Sun size={32} className={styles.weatherIcon} />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
      return <CloudRain size={32} className={styles.weatherIcon} />;
    } else if (conditionLower.includes('cloud') && !conditionLower.includes('rain')) {
      return <Cloud size={32} className={styles.weatherIcon} />;
    } else if (conditionLower.includes('snow')) {
      return <CloudSnow size={32} className={styles.weatherIcon} />;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
      return <CloudLightning size={32} className={styles.weatherIcon} />;
    } else if (conditionLower.includes('drizzle')) {
      return <CloudDrizzle size={32} className={styles.weatherIcon} />;
    } else {
      return <Cloud size={32} className={styles.weatherIcon} />;
    }
  };

const handleViewChange = async (newView: 'hourly' | 'daily') => {
  setView(newView);
  setLoading(true);
  setIsAnimating(true);

  try {
    if (newView === 'daily' && location) {
      const dailyData = await weatherAPI.getDailyForecast(location);
      setDailyForecast(dailyData);
    } else {
      setView('hourly');
    }
  } catch (error) {
    console.error('Error switching forecast view:', error);
    setView('hourly');
  } finally {
    setLoading(false);
    setTimeout(() => setIsAnimating(false), 300);
  }
};



  return (
    <div className={`${styles.forecast} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h3 className={`${styles.title} ${theme === 'dark' ? styles.dark : ''}`}>
          Forecast
        </h3>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${view === 'hourly' ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={() => handleViewChange('hourly')}
            disabled={loading}
          >
            Hourly
          </button>
          <button
            className={`${styles.toggleButton} ${view === 'daily' ? styles.active : ''} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={() => handleViewChange('daily')}
            disabled={loading}
          >
            Daily
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading forecast...</div>
      ) : (
        <div className={`${styles.forecastList} ${isAnimating ? styles.fadeIn : ''}`}>
          {displayData.map((item, index) => (
            <div key={index} className={`${styles.forecastCard} ${theme === 'dark' ? styles.dark : ''}`}>
              <div className={`${styles.time} ${theme === 'dark' ? styles.dark : ''}`}>
                {item.time}
              </div>
              <div className={styles.icon}>
                {getWeatherIcon(item.condition)}
              </div>
              <div className={`${styles.temperature} ${theme === 'dark' ? styles.dark : ''}`}>
                {convertTemperature(item.temperature)}°
              </div>
              <div className={`${styles.condition} ${theme === 'dark' ? styles.dark : ''}`}>
                {item.condition}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
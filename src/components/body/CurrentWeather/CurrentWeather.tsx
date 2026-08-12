import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Droplets, Wind ,Heart} from 'lucide-react';
import styles from './CurrentWeather.module.css';

type WeatherData = {

  location: string,
  temperature: number,
  condition: string,
  humidity: number,
  windSpeed: number,

};

type CurrentWeatherProps = {

  weatherData: WeatherData,
  unit?: 'celsius' | 'fahrenheit',
  theme?: 'light' | 'dark',
  onSave?: () => void

};

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, unit = 'celsius', theme = 'light' ,onSave}) => {

  const convertTemperature = (temp: number) => {

    if (unit === 'fahrenheit') {

      return Math.round((temp * 9/5) + 32);

    }

    return temp;

  };

  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    
    if (condition.includes('sun') || condition.includes('clear')) {
      return <Sun size={80} className={styles.weatherIcon} />;
    } else if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) {
      return <CloudRain size={80} className={styles.weatherIcon} />;
    } else if (condition.includes('cloud') && !condition.includes('rain')) {
      return <Cloud size={80} className={styles.weatherIcon} />;
    } else if (condition.includes('snow') || condition.includes('sleet')) {
      return <CloudSnow size={80} className={styles.weatherIcon} />;
    } else if (condition.includes('thunder') || condition.includes('lightning')) {
      return <CloudLightning size={80} className={styles.weatherIcon} />;
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return <CloudDrizzle size={80} className={styles.weatherIcon} />;
    } else {
      return <Sun size={80} className={styles.weatherIcon} />;
    }
  };


  return (

    <div className={`${styles.currentWeather} ${theme === 'dark' ? styles.dark : ''}`}>

      <h2 className={`${styles.location} ${theme === 'dark' ? styles.dark : ''}`}>
        {weatherData.location}
      </h2>

      {onSave && (

      <button 
    className={`${styles.saveButton} ${theme === 'dark' ? styles.dark : ''}`}
    onClick={onSave}
    >
    <Heart size={20} />
    Save Location
    </button>
     )}
      
      <div className={styles.weatherIcon}>
        {getWeatherIcon()}
      </div>
      
      <div className={styles.temperature}>
        {convertTemperature(weatherData.temperature)}°{unit === 'celsius' ? 'C' : 'F'}
      </div>
      
      <p className={`${styles.condition} ${theme === 'dark' ? styles.dark : ''}`}>
        {weatherData.condition}
      </p>
      
      <div className={styles.details}>


        <div className={`${styles.detailItem} ${theme === 'dark' ? styles.dark : ''}`}>


        <Droplets className={styles.detailIcon} size={24} />

        <div>

            <div className={`${styles.detailLabel} ${theme === 'dark' ? styles.dark : ''}`}>Humidity</div>
            <div className={`${styles.detailValue} ${theme === 'dark' ? styles.dark : ''}`}>{weatherData.humidity}%</div>

        </div>


        </div>
        
        <div className={`${styles.detailItem} ${theme === 'dark' ? styles.dark : ''}`}>

          <Wind className={styles.detailIcon} size={24} />

          <div>
            
            <div className={`${styles.detailLabel} ${theme === 'dark' ? styles.dark : ''}`}>Wind Speed</div>
            <div className={`${styles.detailValue} ${theme === 'dark' ? styles.dark : ''}`}>{weatherData.windSpeed} km/h</div>

          </div>

        </div>


      </div>


    </div>
  );
};
import { useRef, useEffect } from 'react';
import { Header } from './components/header/Header';
import { Body } from './components/body/Body';
import { Footer } from './components/footer/Footer';
import { SearchBar } from './components/ui/searchBar/SearchBar'
import { CurrentWeather } from './components/body/CurrentWeather/CurrentWeather';
import { Forecast } from './components/body/Forecast/Forecast';
import { LocationList } from './components/body/LocationList/LocationList';
import { WeatherAlerts } from './components/body/WeatherAlerts/WeatherAlerts';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeolocation } from './hooks/useGeolocation';
import { type Location } from './types/weather.types';
import { Notification } from './components/ui/notification/Notification'
import { useNotification } from './hooks/useNotification';

import './App.css';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [unit, setUnit] = useLocalStorage<'celsius' | 'fahrenheit'>('unit', 'celsius');
  const [locations, setLocations] = useLocalStorage<Location[]>('locations', []);
  const { weatherData, forecastData, dailyForecastData, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();
  const requestedLocation = useRef(Boolean(weatherData));
  const { notifications, showNotification, removeNotification } = useNotification();
  const { location: userLocation } = useGeolocation();

  // Restore saved weather first; a late geolocation result must not replace a user's search.
  useEffect(() => {
    if (userLocation && !requestedLocation.current && navigator.onLine) {
      requestedLocation.current = true;
      void fetchWeatherByCoords(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, fetchWeatherByCoords]);

  const handleSearch = (location: string) => {
    requestedLocation.current = true;
    void fetchWeather(location);
  };

  const handleSelectLocation = handleSearch;

  const handleDeleteLocation = (location: string) => {
    const updatedLocations = locations.filter(loc => loc.name !== location);
    setLocations(updatedLocations);
  };

  const handleDismissAlert = (alertId: string) => {
    console.log('Dismissed alert:', alertId);
  };

  const handleSaveLocation = () => {
    if (weatherData && !locations.find(loc => loc.name === weatherData.location)) {
      const newLocation: Location = {
        name: weatherData.location,
        country: weatherData.country || 'Unknown'
      };
      setLocations([...locations, newLocation]);
      showNotification(`${weatherData.location} saved to favorites!`, 'success');
    } else if (weatherData) {
      showNotification(`${weatherData.location} is already in your favorites!`, 'info');
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        unit={unit}
        onUnitToggle={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
      />

      <Body theme={theme}>
        <SearchBar
          onSearch={handleSearch}
          theme={theme}
          placeholder="Search for a city... "

        />

        {loading ? (
          <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>{error}</div>
        ) : weatherData ? (
          <>
            <CurrentWeather
              weatherData={weatherData}
              unit={unit}
              theme={theme}
              onSave={handleSaveLocation}

            />

            <Forecast
              forecastData={forecastData}
              dailyForecastData={dailyForecastData}
              unit={unit}
              theme={theme}
              key={weatherData.location}
            />


            <LocationList
              locations={locations}
              currentLocation={weatherData?.location || ''}
              onSelectLocation={handleSelectLocation}
              onDeleteLocation={handleDeleteLocation}
              theme={theme}
            />
          </>
        ) : (
          <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
            Search for a city to see weather
          </div>
        )}



        <WeatherAlerts
          alerts={weatherData?.alerts || []}
          onDismiss={handleDismissAlert}
          theme={theme}
        />

        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </Body>

      <Footer theme={theme} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
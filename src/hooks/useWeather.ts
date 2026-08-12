import { useState } from 'react';
import { weatherAPI } from '../services/weatherAPI';
import { type WeatherData, type ForecastItem } from '../types/weather.types';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast] = await Promise.all([
        weatherAPI.getCurrentWeather(location),
        weatherAPI.getForecast(location),
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast] = await Promise.all([
        weatherAPI.getWeatherByCoords(lat, lon),
        weatherAPI.getForecastByCoords(lat, lon),
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
      return weather;
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeather,
    fetchWeatherByCoords,
  };
};
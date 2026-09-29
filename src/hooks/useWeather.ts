import { useCallback, useEffect, useRef, useState } from 'react';
import { weatherAPI } from '../services/weatherAPI';
import { findCachedWeather, readWeatherCache, saveWeatherCache, type CachedWeather } from '../services/weatherCache';

// Bound waiting time even when the browser reports online but the connection has stalled.
async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Weather request timed out')), 12000);
    })]);
  } finally {
    clearTimeout(timer);
  }
}

export const useWeather = () => {
  const [snapshot, setSnapshot] = useState<CachedWeather | null>(() => readWeatherCache()[0] ?? null);
  const [cachedLocations, setCachedLocations] = useState(readWeatherCache);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [isCached, setIsCached] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const requestId = useRef(0);
  const activeQuery = useRef(snapshot?.query ?? '');

  const loadWeather = useCallback(async (query: string, coordinates?: [number, number]) => {
    const id = ++requestId.current;
    activeQuery.current = query;
    setLoading(true);
    setError(null);
    setNotice('');
    try {
      if (!navigator.onLine) throw new Error('Offline');
      const [weather, hourly, daily] = await withTimeout(Promise.all([
        coordinates ? weatherAPI.getWeatherByCoords(...coordinates) : weatherAPI.getCurrentWeather(query),
        coordinates ? weatherAPI.getForecastByCoords(...coordinates) : weatherAPI.getForecast(query),
        // Current weather remains useful when the daily endpoint is unavailable.
        withTimeout(weatherAPI.getDailyForecast(query)).catch(() => []),
      ]));
      if (id !== requestId.current) return null;
      const entry: CachedWeather = { query, weather, hourly, daily, savedAt: Date.now() };
      const saved = saveWeatherCache(entry);
      setSnapshot(entry);
      setCachedLocations(readWeatherCache());
      setIsCached(false);
      if (!saved) setNotice('Weather loaded, but browser storage is unavailable. This result cannot be saved for offline use.');
      return weather;
    } catch {
      if (id !== requestId.current) return null;
      const cached = findCachedWeather(query);
      if (cached) {
        const saved = saveWeatherCache(cached); // Remember selection without changing its timestamp.
        setSnapshot(cached);
        setCachedLocations(readWeatherCache());
        setIsCached(true);
        setNotice(saved ? 'Could not get live weather. Showing the last saved forecast.' : 'Showing saved weather. Browser storage is unavailable.');
        return cached.weather;
      }
      setError(`No saved weather for "${query}". Connect to the internet and load this location first.`);
      return null;
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const offline = () => setIsOffline(true);
    const online = () => {
      setIsOffline(false);
      if (activeQuery.current) void loadWeather(activeQuery.current);
    };
    window.addEventListener('offline', offline);
    window.addEventListener('online', online);
    const pendingRequests = requestId;
    return () => {
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', online);
      pendingRequests.current++;
    };
  }, [loadWeather]);

  const fetchWeather = useCallback((query: string) => loadWeather(query.trim()), [loadWeather]);
  const fetchWeatherByCoords = useCallback((lat: number, lon: number) =>
    loadWeather(`${lat},${lon}`, [lat, lon]), [loadWeather]);

  return {
    weatherData: snapshot?.weather ?? null,
    forecastData: snapshot?.hourly ?? [],
    dailyForecastData: snapshot?.daily ?? [],
    savedAt: snapshot?.savedAt,
    cachedLocations, isCached, isOffline, notice,
    loading, error, fetchWeather, fetchWeatherByCoords,
  };
};

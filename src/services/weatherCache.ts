import type { ForecastItem, WeatherData } from '../types/weather.types';

export interface CachedWeather {
  query: string;
  weather: WeatherData;
  hourly: ForecastItem[];
  daily: ForecastItem[];
  savedAt: number;
}

const STORAGE_KEY = 'weather-offline-v1';
const LIMIT = 20;
const normalise = (value: string) => value.trim().toLowerCase();
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);

function isForecast(value: unknown): value is ForecastItem[] {
  return Array.isArray(value) && value.every(item => isRecord(item) &&
    typeof item.time === 'string' && isNumber(item.temperature) && typeof item.condition === 'string');
}

function isEntry(value: unknown): value is CachedWeather {
  if (!isRecord(value) || !isRecord(value.weather)) return false;
  const weather = value.weather;
  return typeof value.query === 'string' && isNumber(value.savedAt) &&
    typeof weather.location === 'string' && typeof weather.condition === 'string' &&
    ['temperature', 'humidity', 'windSpeed', 'feelsLike'].every(key => isNumber(weather[key])) &&
    isForecast(value.hourly) && isForecast(value.daily);
}

export function readWeatherCache(): CachedWeather[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter(isEntry).slice(0, LIMIT) : [];
  } catch {
    // Private browsing, malformed JSON, and blocked storage must not break weather requests.
    return [];
  }
}

export function findCachedWeather(query: string): CachedWeather | undefined {
  const key = normalise(query);
  return readWeatherCache().find(entry => normalise(entry.query) === key ||
    normalise(entry.weather.location) === key ||
    normalise(`${entry.weather.location}, ${entry.weather.country || ''}`) === key);
}

export function saveWeatherCache(entry: CachedWeather): boolean {
  try {
    const others = readWeatherCache().filter(item =>
      normalise(item.query) !== normalise(entry.query) &&
      !(item.weather.location === entry.weather.location && item.weather.country === entry.weather.country));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...others].slice(0, LIMIT)));
    return true;
  } catch {
    return false;
  }
}

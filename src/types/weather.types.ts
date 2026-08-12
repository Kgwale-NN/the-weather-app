export interface WeatherData {
  location: string;
  country?: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  pressure?: number;
  visibility?: number;
  alerts?: WeatherAlert[];
}

export interface ForecastItem {
  time: string;
  temperature: number;
  condition: string;
  icon?: string;
}

export interface Location {
  name: string;
  country: string;
  lat?: number;
  lon?: number;
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory' | 'moderate' | 'severe' | 'extreme' | 'minor';
  title: string;
  description: string;
  time: string;
}

export interface SearchLocation {
  name: string;
  country: string;
  region?: string;
  lat: number;
  lon: number;
  displayName?: string;
}

export interface WeatherAPIResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}
import { type WeatherData, type ForecastItem, type SearchLocation } from '../types/weather.types';
import { type WeatherAlert } from '../types/weather.types';

type ApiSearchLocation = {
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
};

type ApiWeatherAlert = {
  headline: string;
  severity: string;
  desc: string;
  effective: string;
};

type ApiForecastHour = {
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
};

type ApiForecastDay = {
  date: string;
  day: {
    avgtemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

// WeatherAPI.com (accurate weather data)
const API_KEY = 'da1aeea5a0e14797a80111302260608';
const BASE_URL = 'https://api.weatherapi.com/v1';

export const weatherAPI = {
  // Search for locations (for dropdown)
  searchLocation: async (query: string): Promise<SearchLocation[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.map((item: ApiSearchLocation) => ({
        name: item.name,
        country: item.country,
        region: item.region,
        lat: item.lat,
        lon: item.lon,
        displayName: `${item.name}, ${item.region}, ${item.country}`,
      }));
    } catch (error) {
      console.error('Error searching location:', error);
      throw new Error('Failed to search location', { cause: error });
    }
  },
  // Get current weather for a location
  getCurrentWeather: async (location: string): Promise<WeatherData> => {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no&alerts=yes`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const current = data.current;
      const locationData = data.location;

      // Process alerts if available
      const alerts: WeatherAlert[] = (data.alerts?.alert ?? []).map(
        (alert: ApiWeatherAlert) => ({
          id: `${alert.headline}-${alert.effective}`,
          type: alert.severity.toLowerCase() as WeatherAlert['type'],
          title: alert.headline,
          description: alert.desc,
          time: new Date(alert.effective).toLocaleString(),
        })
      );

      return {
        location: locationData.name,
        country: locationData.country,
        temperature: Math.round(current.temp_c),
        condition: current.condition.text,
        humidity: current.humidity,
        windSpeed: Math.round(current.wind_kph),
        feelsLike: Math.round(current.feelslike_c),
        pressure: current.pressure_mb,
        visibility: current.vis_km,
        alerts: alerts,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather data', { cause: error });
    }
  },

  // Get weather forecast (hourly)
  getForecast: async (location: string): Promise<ForecastItem[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&hours=24&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const forecastHours: ApiForecastHour[] =
        data.forecast.forecastday[0].hour;
      const currentHour = new Date().getHours();

      // Get next 24 hours of forecast starting from current hour
      const forecast: ForecastItem[] = [];
      let startIndex = forecastHours.findIndex((hour) => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
      });

      if (startIndex === -1) startIndex = 0;

      for (let i = 0; i < 24 && startIndex + i < forecastHours.length; i++) {
        const hour = forecastHours[startIndex + i];
        forecast.push({
          time: new Date(hour.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          temperature: Math.round(hour.temp_c),
          condition: hour.condition.text,
          icon: hour.condition.icon,
        });
      }

      return forecast;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast data', { cause: error });
    }
  },

  // Get daily forecast
  getDailyForecast: async (location: string): Promise<ForecastItem[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const forecastDays: ApiForecastDay[] = data.forecast.forecastday;

      const forecast: ForecastItem[] = forecastDays.map((day) => ({
        time: new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        temperature: Math.round(day.day.avgtemp_c),
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
      }));

      return forecast;
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      throw new Error('Failed to fetch daily forecast data', { cause: error });
    }
  },

  // Get weather by coordinates
  getWeatherByCoords: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no&alerts=yes`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const current = data.current;
      const locationData = data.location;

      // Process alerts if available
      const alerts: WeatherAlert[] = (data.alerts?.alert ?? []).map(
        (alert: ApiWeatherAlert) => ({
          id: `${alert.headline}-${alert.effective}`,
          type: alert.severity.toLowerCase() as WeatherAlert['type'],
          title: alert.headline,
          description: alert.desc,
          time: new Date(alert.effective).toLocaleString(),
        })
      );

      return {
        location: locationData.name,
        country: locationData.country,
        temperature: Math.round(current.temp_c),
        condition: current.condition.text,
        humidity: current.humidity,
        windSpeed: Math.round(current.wind_kph),
        feelsLike: Math.round(current.feelslike_c),
        pressure: current.pressure_mb,
        visibility: current.vis_km,
        alerts: alerts,
      };
    } catch (error) {
      console.error('Error fetching weather by coords:', error);
      throw new Error('Failed to fetch weather data');
    }
  },

  // Get forecast by coordinates
  getForecastByCoords: async (lat: number, lon: number): Promise<ForecastItem[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&hours=8&aqi=no`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const forecastHours = data.forecast.forecastday[0].hour;
      const currentHour = new Date().getHours();

      const forecast: ForecastItem[] = [];
      let startIndex = forecastHours.findIndex((hour: any) => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
      });

      if (startIndex === -1) startIndex = 0;

      for (let i = 0; i < 8 && startIndex + i < forecastHours.length; i++) {
        const hour = forecastHours[startIndex + i];
        forecast.push({
          time: new Date(hour.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          temperature: Math.round(hour.temp_c),
          condition: hour.condition.text,
          icon: hour.condition.icon,
        });
      }

      return forecast;
    } catch (error) {
      console.error('Error fetching forecast by coords:', error);
      throw new Error('Failed to fetch forecast data');
    }
  },
};
export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9) / 5 + 32);
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round(((fahrenheit - 32) * 5) / 9);
};

export const convertTemperature = (
  temperature: number,
  unit: 'celsius' | 'fahrenheit'
): number => {
  if (unit === 'fahrenheit') {
    return celsiusToFahrenheit(temperature);
  }
  return temperature;
};

export const getTemperatureSymbol = (unit: 'celsius' | 'fahrenheit'): string => {
  return unit === 'celsius' ? '°C' : '°F';
};
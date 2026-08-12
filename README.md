Weather App

- A modern, responsive weather application built with React and TypeScript that provides real-time weather information for any location worldwide.

Features

- Real-time Weather Data: Display current weather conditions including temperature, humidity, and wind speed
- Hourly & Daily Forecasts: Toggle between hourly and daily weather predictions
- Location-Based Forecasting:
- Automatic detection of user's current location
- Search functionality for any location worldwide
- Multiple Locations: Save and switch between multiple favorite locations
- Weather Alerts: Push notifications for severe weather conditions
- Theme Customization: Switch between light and dark modes
- Unit Conversion: Toggle between Celsius and Fahrenheit
- Offline Access: Cached weather data for offline viewing
- Responsive Design: Optimized for mobile, tablet, and desktop devices
- Technologies Used
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- React Router DOM v6 - Routing
- Lucide React - Icon library
- Axios - HTTP client for API calls
- CSS Modules - Component styling

  Installation

  
1. Clone the repository:

bash

git clone https://github.com/Kgwale-NN/the-weather-app.git


2. Navigate to the project directory:

bash

cd the-weather-app


3. Install dependencies:

bash

npm install


4. Start the development server:

bash

npm run dev


Usage


- Open the application in your browser
- Allow location access for automatic weather detection
- Search for any location using the search bar
- Save locations to your favorites for quick access
- Toggle between Celsius/Fahrenheit using the header button
- Switch between light/dark theme using the theme toggle
- Project Structure

  Project Structure


  src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button/
│   │   ├── TextInput/
│   │   └── SearchBar/
│   ├── header/          # Header component
│   ├── body/            # Main content components
│   │   ├── CurrentWeather/
│   │   ├── Forecast/
│   │   ├── LocationList/
│   │   └── WeatherAlerts/
│   └── footer/          # Footer component
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── context/             # React Context providers
├── App.tsx              # Main application component
└── main.tsx             # Application entry point

API Used

- This application uses the OpenWeatherMap API for weather data. You will need to obtain a free API key from OpenWeatherMap.

Deployment

- The application is deployed on Vercel: https://the-weather-app-2ir3.vercel.app

Contributing

- This project was developed as part of a React TypeScript learning assignment.

License

- This project is for educational purposes.

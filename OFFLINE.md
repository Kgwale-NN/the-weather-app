# Offline weather

The app saves current conditions, hourly forecasts, and available daily forecasts for up to 20 recently loaded locations in localStorage (weather-offline-v1). The last successfully viewed cached location is restored on launch. Timestamps are preserved when cached data is viewed; saved forecasts may be stale.

Use the existing search or saved locations to switch previously downloaded locations. Favourites and downloaded weather are separate: saving a favourite does not permanently pin its cache, and deleting a favourite does not delete downloaded weather. New searches and live updates require internet. Cached severe weather alerts are not treated as current warnings.

Failed requests fall back to saved data, including when the browser reports online. Reconnecting refreshes the selected query. Storage failures do not prevent live weather from displaying . Clearing browser site data removes downloaded weather and the offline shell.

## Test offline page loading

1. Run npm run build, then npm run preview.
2. Open the preview URL online and load a city. Verify both forecast tabs.
3. In browser developer tools, under Application > Service Workers, wait for sw.js to activate. The initial visit needs internet to download the app shell.
4. Load another city and save it using the existing favourites control.
5. Disable network access (or select Offline in developer tools), reload the page, and switch between downloaded cities and hourly/daily views.
6. Search for a city that was not downloaded. An explanatory error should appear using the existing error display; search for a previously downloaded city to recover.
7. Restore connectivity. Weather should refresh, and its timestamp should update.

The service worker runs only in production builds on HTTPS or localhost. npm run dev supports weather-data caching while open, but does not provide offline reloads. For a new deployment, close existing app tabs and reopen online so a waiting worker can activate safely. Assets are precached from the build output; external API responses and API-key URLs are never put in the service worker cache.

## Implementation

- src/services/weatherCache.ts: validated, bounded local storage cache.
- src/hooks/useWeather.ts: live requests, saved fallback, connection state, and request ordering.
- vite.config.ts: generates a versioned service worker and precaches the production assets.
- src/offlineRegistration.ts: registers the production worker.

The previously deferred ThemeContext.tsx Fast Refresh lint issue is outside this feature.

import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = () => {
  const isSupported =
    typeof navigator !== 'undefined' && !!navigator.geolocation;

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(
    isSupported ? null : 'Geolocation is not supported by your browser'
  );

  const [loading, setLoading] = useState(isSupported);

  const requestLocation = useCallback(() => {
    if (!isSupported) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  }, [isSupported]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const getCurrentLocation = () => {
    if (!isSupported) return;

    setLoading(true);
    setError(null);
    requestLocation();
  };

  return { location, error, loading, getCurrentLocation };
};
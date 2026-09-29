// Keep Vite development/HMR uncached; test offline reloads with build + preview.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(error => console.warn('Offline app loading could not be enabled:', error));
  });
}

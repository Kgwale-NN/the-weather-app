import { createHash } from 'node:crypto';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Generate a versioned app-shell cache from the actual production output.
function offlineShell(): Plugin {
  return {
    name: 'weather-offline-shell',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle).filter(name => !name.endsWith('.map'));
      const hash = createHash('sha256');
      for (const name of files.sort()) {
        const item = bundle[name];
        hash.update(name);
        hash.update(item.type === 'chunk' ? item.code : item.source);
      }
      const version = hash.digest('hex').slice(0, 12);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const PREFIX = 'weather-shell-' + self.registration.scope;
const CACHE = PREFIX + '${version}';
const FILES = ${JSON.stringify(files)}.map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate' && url.href.startsWith(self.registration.scope)) {
    event.respondWith(caches.open(CACHE).then(async cache =>
      (await cache.match(new URL('index.html', self.registration.scope).href)) || fetch(event.request)));
  } else if (FILES.includes(url.href)) {
    event.respondWith(caches.open(CACHE).then(async cache =>
      (await cache.match(event.request)) || fetch(event.request)));
  }
});
` });
    },
  };
}

export default defineConfig({ plugins: [react(), offlineShell()] });

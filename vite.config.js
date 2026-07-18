import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Bind to 0.0.0.0 (not just localhost) so the dev server is reachable from a phone/tablet
  // on the same WiFi - pairs with the backend's CORS config, which allows private LAN-IP
  // origins in development (see backend/config/cors.js).
  server: { host: true }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        gallery: 'https://gallery-mfe-fe.vercel.app/assets/remoteEntry.js',
        web_links: 'https://web-links-mfe-fe.vercel.app/assets/remoteEntry.js',
        video: 'https://video-mfr-fe.vercel.app/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
});
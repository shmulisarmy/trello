import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  base: '/trello/', // Replace 'repo-name' with your GitHub repository name
  server: {
    port: 3000, // Development server runs on port 3000
  },
  build: {
    target: 'esnext', // Ensures compatibility with modern browsers
  },
});

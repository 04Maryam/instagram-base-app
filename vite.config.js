import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/instagram-base-app/',
  plugins: [react()],
  base: "./",
  define: {
    "process.env": {},
  },
});

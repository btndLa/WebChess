import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
    server: {
        proxy: {
            '/api': {
                target: "https://localhost:7280",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        },
    },
})

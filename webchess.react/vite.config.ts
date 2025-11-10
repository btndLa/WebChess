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
                target: "https://webchess-tgu8.onrender.com",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/signalr': {
                target: 'https://webchess-tgu8.onrender.com',
                ws: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/signalr/, '')
            },
        },
    },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/WebChess/',
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },
    server: {
        proxy: {
            '/api': {
                target: "https://btndla.github.io",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/signalr': {
                target: 'https://btndla.github.io',
                ws: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/signalr/, '')
            },
        },
    },
})

import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const entry = [resolve(__dirname, './index.ts'), resolve(__dirname, './src/shared.ts'), resolve(__dirname, './src/fetch.ts')];

export default defineConfig({
    build: {
        lib: {
            entry,
            name: 'cloudflareTools'
        },
        target: ['es2022'],
        minify: true,
        rollupOptions: {
            output: {
                exports: 'named'
            }
        }
    },

    plugins: [
        dts({
            outDir: 'dist/types',
            copyDtsFiles: true,
            include: ['src/**/*', 'index.ts']
        })
    ]
});

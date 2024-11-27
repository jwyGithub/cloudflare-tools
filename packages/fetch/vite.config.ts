import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'CloudflareFetch'
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

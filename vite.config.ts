/// <reference types="vite/client" />

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { version: klinechartsProVersion } = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf8')
) as { version: string }

export default defineConfig({
  define: {
    __KLINECHARTS_PRO_VERSION__: JSON.stringify(klinechartsProVersion),
  },
  plugins: [solidPlugin()],
  build: {
    cssTarget: 'chrome61',
    sourcemap: true,
    rollupOptions: {
      external: ['klinecharts'],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') {
            return 'klinecharts-pro.css'
          }
        },
        globals: {
          klinecharts: 'klinecharts'
        },
      },
    },
    lib: {
      entry: './src/index.ts',
      name: 'klinechartspro',
      fileName: (format) => {
        if (format === 'es') {
          return 'klinecharts-pro.js'
        }
        if (format === 'umd') {
          return 'klinecharts-pro.umd.js'
        }
      }
    }
  }
})

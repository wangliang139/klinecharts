import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const { version: klinechartsProVersion } = JSON.parse(
  readFileSync(path.join(repoRoot, 'package.json'), 'utf8')
) as { version: string }

export default defineConfig({
  define: {
    __KLINECHARTS_PRO_VERSION__: JSON.stringify(klinechartsProVersion),
  },
  plugins: [solid()],
  resolve: {
    alias: {
      '@wangliang139/klinecharts-pro': path.join(repoRoot, 'src/index.ts'),
    },
    dedupe: ['solid-js'],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
})

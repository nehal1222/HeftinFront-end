import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  // viteSingleFile inlines the built JS and CSS directly into index.html —
  // no external <script src> at all. This matters because Chrome/Edge block
  // loading JS modules from file:// pages (a browser security restriction);
  // a separate assets/*.js file would silently fail to load if this page is
  // opened by double-clicking it, with `base: './'` alone not being enough
  // to fix that. Inlining sidesteps the restriction entirely.
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: resolve(__dirname, '../dashboard'),
    emptyOutDir: true, // required since outDir is outside this project's root
    // Background images used in CSS are under ~110KB — raise the inline limit
    // (default 4KB) so they're base64-embedded too, keeping the single-file
    // build (and the file:// fix above) intact instead of splitting them out
    // into a separate assets/*.jpg the page would need to fetch.
    assetsInlineLimit: 200000,
  },
})

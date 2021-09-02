import { removeSync } from 'fs-extra'
import { appConfig } from './package.json'
import svelte from 'rollup-plugin-svelte-hot'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import Hmr from 'rollup-plugin-hot'
import livereload from 'rollup-plugin-livereload'

const { distDir, buildDir, assetsDir } = appConfig
const production = process.env['NODE_ENV'] === 'production'
const isNollup = !!process.env.NOLLUP

// clear previous builds
removeSync(distDir)

export default {
  preserveEntrySignatures: false,
  input: [`src/main.js`],
  output: {
    sourcemap: true,
    format: 'esm',
    dir: buildDir,
    chunkFileNames: `[name]${(production && '-[hash]') || ''}.js`
  },
  plugins: [
    svelte({
      preprocess: []
    }),
    resolve({
      browser: true,
      dedupe: importee => !!importee.match(/svelte(\/|$)/)
    }),
    commonjs(),
    production && terser(),
    !production && livereload(distDir), // refresh entire window when code is updated,
    !production && isNollup && Hmr({ inMemory: true, public: assetsDir }), //, refresh only updated code,
    !production && !isNollup && livereload(distDir) // refresh entire window when code is updated
  ],
  watch: {
    clearScreen: false,
    buildDelay: 100
  }
}

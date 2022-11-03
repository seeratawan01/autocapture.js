import cleanup from 'rollup-plugin-cleanup'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { swc } from 'rollup-plugin-swc3'
import { terser } from 'rollup-plugin-terser'
import strip from '@rollup/plugin-strip'
import dts from 'rollup-plugin-dts'
import { readFileSync } from 'fs'

const { version, homepage, author } = JSON.parse(readFileSync('./package.json'))

const banner = `/*!
 * autocapture.js v${version}
 * ${homepage}
 * ${author} (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} autocapture.js
 * Released under the MIT License
 */`
const extensions = ['.js', '.ts']

const prod = process.env.NODE_ENV === 'production'

const plugins = (minify) =>
  [
    json(),
    resolve({
      extensions
    }),
    swc({
      jsc: {
        parser: {
          syntax: 'typescript'
        },
        target: 'es2022'
      },
      module: {
        type: 'es6'
      },
      sourceMaps: true
    }),
    prod && strip({
      include: '**/*.ts',
    }),
    minify
      ? terser({
        output: {
          preamble: banner,
          comments: false
        }
      })
      : cleanup({
        comments: ['some', /__PURE__/]
      })
  ]

const outputConfig = [
  // UMD build
  // dist/autocapture.umd.js
  {
    input: 'src/index.umd.ts',
    plugins: plugins(true),
    output: {
      name: 'AutoCapture',
      file: 'dist/autocapture.umd.js',
      format: 'umd',
      indent: false,
      sourcemap: true
    }
  },
  // ES6 builds
  // dist/autocapture.js
  {
    input: {
      'dist/autocapture': 'src/index.ts'
    },
    plugins: plugins(),
    output: {
      dir: './',
      chunkFileNames: 'dist/chunks/[name].js',
      entryFileNames: '[name].js',
      banner,
      format: 'esm',
      indent: false,
      sourcemap: true
    }
  },

  // Types
  // dist/types.d.ts
  {
    input: {
      'dist/types': 'src/types.ts'
    },
    plugins: [dts()],
    output: {
      dir: './',
      chunkFileNames: 'dist/chunks/[name].d.ts',
      entryFileNames: '[name].d.ts',
      format: 'es'
    }
  }
]

if (prod) {
  outputConfig.push({
    input: 'src/index.umd.ts',
    plugins: plugins(true),
    output: {
      name: 'AutoCapture',
      file: 'example/dist/autocapture.umd.js',
      format: 'umd',
      indent: false,
      sourcemap: true
    }
  })
}

export default outputConfig

import minimist from 'minimist'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import {OutputOptions, rollup} from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const argv = minimist(process.argv.slice(2))
const formats = ['amd', 'cjs', 'es', 'iife', 'system', 'umd']

async function buildCli(format: string) {
  if (!formats.includes(format))
    return
  const inputOptions = {
    input: './bin/index.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      typescript({
        exclude: ['packages/web/*.ts'],
      }),
      commonjs(),
      terser(),
      json(),
    ],
    external: ['eslint']
  }

  const outputOptions: OutputOptions  = {
    dir: 'dist',
    format: 'cjs',
    banner: '#! /usr/bin/env node\nconst navigator = {}',
  }
  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)
}

async function scriptBuild() {
  for (const key of Object.keys(argv)){
    buildCli(key);
  }

}

scriptBuild()

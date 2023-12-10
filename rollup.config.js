'use strict';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  external: ['lodash'],
  input: 'src/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
  },
  plugins: [resolve({ rootDir: 'src' }), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
};

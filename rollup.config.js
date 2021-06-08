import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import { babel } from '@rollup/plugin-babel';

export default {
  input: "./src/js/main.js",
  output: [
    {
      file: "./site/js/main.js",
      format: "iife",
      sourcemap: true,
      plugins: [ terser() ],
    }
  ],
  plugins: [
    nodeResolve(),
    babel({ babelHelpers: 'bundled' })
  ]
};
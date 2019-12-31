// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

const wdir = "./Counter/";

export default {
    input: wdir + "dist/Counter/src/Counter.js",
    output: {
      file: wdir + '/dist/bundle.js',
      format: 'iife'
    },
    plugins: [resolve()]
  };

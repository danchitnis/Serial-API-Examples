// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

const wdir = "./Echo/";

export default {
    input: wdir + "dist/Echo/src/Echo.js",
    output: {
      file: wdir + '/dist/bundle.js',
      format: 'iife'
    },
    plugins: [resolve()]
  };

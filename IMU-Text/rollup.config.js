// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

const wdir = "./IMU-Text/";

export default {
    input: wdir + "dist/IMU-Text/src/IMU-Text.js",
    output: {
      file: wdir + '/dist/bundle.js',
      format: 'iife'
    },
    plugins: [resolve()]
  };

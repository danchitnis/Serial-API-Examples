// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

const wdir = "./IMU-Text-Plot/";

export default {
    input: wdir + "dist/IMU-Text-Plot/src/IMU-Text-Plot.js",
    output: {
      file: wdir + '/dist/bundle.js',
      format: 'iife'
    },
    plugins: [resolve()]
  };
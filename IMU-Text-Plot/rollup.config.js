// rollup.config.js
const wdir = "./IMU-Text-Plot/";

export default {
    input: wdir + "dist/IMU-Text-Plot.js",
    output: {
      file: wdir + '/dist/bundle.js',
      format: 'iife'
    }
  };
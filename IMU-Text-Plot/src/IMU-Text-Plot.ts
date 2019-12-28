/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 * chrome://flags/#enable-experimental-web-platform-features
 * 
 * https://codelabs.developers.google.com/codelabs/web-serial/#3
 */

import {IMU} from "./IMU";
import {ComPort} from "../../ComPort/src/ComPort";
import {WebGLplot, WebglLine, ColorRGBA} from "webgl-plot";

{
 

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const canvas = document.getElementById("display") as HTMLCanvasElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;

 let port: ComPort;

let lines: WebglLine[];

const numX = 1000;

let wglp: WebGLplot;

 log("Ready...\n");

 init();



 btConnect.addEventListener("click", () => {
    port = new ComPort();
    port.connect(115200);
    port.addEventListener("rx-msg", eventRxMsg);
    port.addEventListener("rx", eventRxIMU );
    console.log("here1 🍔");
    
    //start animation
    window.requestAnimationFrame(newFrame);

 });

 btStop.addEventListener("click", () => {
    port.disconnect();
  
  
 });

 function newFrame(): void {

  update();
  wglp.scaleY = 0.9;
  wglp.update();
  
  window.requestAnimationFrame(newFrame);
 }

 

 function update(): void {
   //nothing to do
 }

 function init(): void {
  lines = [];
  
  lines.push(new WebglLine(new ColorRGBA(1, 0, 0, 0.5), numX));
  lines.push(new WebglLine(new ColorRGBA(0, 1, 0, 0.5), numX));
  lines.push(new WebglLine(new ColorRGBA(0, 0, 1, 0.5), numX));

  wglp = new WebGLplot(canvas, new ColorRGBA(0.1, 0.1, 0.1, 1));


  lines.forEach((line) => {
    wglp.addLine(line);
    // set x to -num/2:1:+num/2
    line.linespaceX(-1, 2  / numX);
  });
  wglp.update();
 }
 

 function log(str: string): void {
    const str1 = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
    const str2 = str1.replace(/(?:\t)/g, "&nbsp&nbsp");
    pLog.innerHTML = pLog.innerHTML + str2;
 }



function sleep(milliseconds: number): void {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


  

  function eventRxIMU(e: CustomEvent<string>): void {
    //console.log(e.detail);
    const imu = new IMU();
    imu.extract(e.detail);
    lines[0].shiftAdd(new Float32Array([imu.x]) );
    lines[1].shiftAdd(new Float32Array([imu.y]) );
    lines[2].shiftAdd(new Float32Array([imu.z]) );
  }

  function eventRxMsg(e: CustomEvent<string>): void {
    log(e.detail + "\n");
  }

// end of scope
}

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
import {ComPort} from "./ComPort";
import {WebGLplot, WebglLine, ColorRGBA} from "webgl-plot";

{

 

 
 

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const canvas = document.getElementById("display") as HTMLCanvasElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;

 let port: ComPort;

let lines: WebglLine[];
const numLines = 3;
const numX = 100;

let wglp: WebGLplot;

 log("Ready...\n");

 init();



 btConnect.addEventListener("click", () => {
    port = new ComPort();
    port.clickConnect();
    port.addEventListener("rx-msg", eventRxMsg);
    port.addEventListener("rx", eventRxIMU );
    console.log("here1 🍔");

 });


 btStop.addEventListener("click", () => {
    port.clickDisconnect();
  
  
 });

 function newFrame(): void {

  //update();
  //wglp.scaleY = scaleY;
  wglp.update();

  window.requestAnimationFrame(newFrame);
}

window.requestAnimationFrame(newFrame);

 function update(): void {
   

 }

 function init(): void {
  lines = [];

  
  lines.push(new WebglLine(new ColorRGBA(1, 0, 0, 0.5), numX));
  lines.push(new WebglLine(new ColorRGBA(0, 1, 0, 0.5), numX));
  lines.push(new WebglLine(new ColorRGBA(0, 0, 1, 0.5), numX));

  wglp = new WebGLplot(canvas, new ColorRGBA(0.1, 0.1, 0.1, 1));


  lines.forEach((line) => {
    wglp.addLine(line);
  });

  for (let i = 0; i < numX; i++) {
    // set x to -num/2:1:+num/2
    lines.forEach((line) => {
      line.linespaceX(-1, 2  / numX);
    });
  }
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


  

  function eventRxIMU(e: CustomEvent<IMU>): void {
    //console.log(e.detail);
    lines[0].shiftAdd(new Float32Array([e.detail.x]) );
    lines[1].shiftAdd(new Float32Array([e.detail.y]) );
    lines[2].shiftAdd(new Float32Array([e.detail.z]) );
  }

  function eventRxMsg(e: CustomEvent<string>): void {
    log(e.detail);
  }

// end of scope
}

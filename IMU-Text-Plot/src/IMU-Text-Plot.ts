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
{

 

 
 

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;

 let port: ComPort;

 log("Ready...\n");

 btConnect.addEventListener("click", () => {
    port = new ComPort();
    port.clickConnect();
    console.log("here1 🍔");

 });


 btStop.addEventListener("click", () => {
    port.clickDisconnect();
  
  
 });


 

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


  

  
  addEventListener("rx", (event) => {
    const e = event as CustomEvent<IMU>;
    console.log(e.detail);
  });
  


  addEventListener("rx-msg", (event) => {
    const e = event as CustomEvent<string>;
    log(e.detail);
  });

// end of scope
}

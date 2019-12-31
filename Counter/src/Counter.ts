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

import {ComPort} from "../../ComPort/src/ComPort"
{



 let port: ComPort;
 


 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;

 log("Ready...\n");

 btConnect.addEventListener("click", () => {
    
    port  = new ComPort();
    port.connect(9600);
    port.addEventListener("rx", dataRX);
    port.addEventListener("rx-msg", dataRX);
    
    console.log("here1 🍔");

 });


 btStop.addEventListener("click", () => {

    port.disconnect();

  
 });


 function log(str: string): void {
    const str1 = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
    const str2 = str1.replace(/(?:\t)/g, "&nbsp&nbsp");
    pLog.innerHTML = pLog.innerHTML + str2;
 }




  function dataRX(e: CustomEvent<string>): void {
    log(e.detail + "\n");
  }

// end of scope
}
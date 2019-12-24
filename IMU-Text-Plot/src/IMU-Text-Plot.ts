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
{

 

 let port: SerialPort;
 let reader: ReadableStreamDefaultReader;

 

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;

 let strRX = "";

 log("Ready...\n");

 btConnect.addEventListener("click", () => {
  
    clickConnect();
    console.log("here1 🍔");

 });


 btStop.addEventListener("click", () => {
    clickDisconnect();
  
  
 });


 async function clickDisconnect(): Promise<void> {
  if (port) {
    if (reader) {
      await reader.cancel();
      await port.close();
    }
  }
  log("\nport is closed now!\n");
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


  async function connect(): Promise<void> {
    // CODELAB: Add code to request & open port here.
    // - Request a port and open a connection.
    port = await navigator.serial.requestPort();
    // - Wait for the port to open.
    await port.open({ baudrate: 9600 });

    // CODELAB: Add code to read the stream here.
    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable;

    reader = inputStream.getReader();
    readLoop();
  }

  async function clickConnect(): Promise<void> {
    // CODELAB: Add connect code here.
    try {
      await connect();
      console.log("here2 🥗");

    } catch (error) {
      log("Error 😢: " + error + "\n");
    }
    
  }

  async function readLoop(): Promise<void> {
      // CODELAB: Add read loop here.
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            log(value);
            procInput(value);
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
    //reader.cancel();
    //port.close();
    
  }

  function procInput(str: string): void {
    strRX = strRX + str;
    const linesRX = strRX.split("\n");
    if (linesRX.length > 1) {
      for (let i=0; i<linesRX.length-1; i++) {
        

        const dataStr = linesRX[i].split("\t");
        const dataNum = dataStr.map(e => parseFloat(e));
        
        const imu = new IMU(dataNum[0], dataNum[1], dataNum[2], dataNum[3]);
        //console.log(imu);
        const event = new CustomEvent('rx',{detail:imu});
        dispatchEvent(event);
      }
      // save the reminder of the input line
      strRX = linesRX[ linesRX.length-1 ];
    }
      
  }


  addEventListener("rx", (event) => {
    const e = event as CustomEvent<IMU>;
    console.log(e.detail);
  });

// end of scope
}

/*class IMU {
  counter: number;
  x: number;
  y: number;
  z: number;

  constructor(counter: number, x:number, y:number, z:number) {
      this.counter = counter;
      this.x = x;
      this.y = y;
      this.z = z;
  }
}*/
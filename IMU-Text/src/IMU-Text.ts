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


{



 let port: SerialPort;
 let reader: ReadableStreamDefaultReader;

 let stopRead = false;

 const decod = new TextDecoder();

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {

    clickConnect();
    console.log("here1 🍔");


 });


 btStop.addEventListener("click", () => {
    stopRead = true;
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
    await connect();
    console.log("here2 🥗");
  }

  async function readLoop(): Promise<void> {
      // CODELAB: Add read loop here.
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            log(value);
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
  }

// end of scope
}
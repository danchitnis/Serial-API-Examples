/**
 * 
 * 
 * Danial Chitnis
 */

 import {IMU} from "./IMU";

 type RxEventType = "rx" | "rx-msg";

 export class ComPort extends EventTarget {
    port: SerialPort;
    reader: ReadableStreamDefaultReader;
    strRX = "";
    

    constructor() {
        super();
    }

    async clickDisconnect(): Promise<void> {
        if (this.port) {
          if (this.reader) {
            await this.reader.cancel();
            await this.port.close();
          }
        }
        this.log("\nport is closed now!\n");
    }

    async connect(): Promise<void> {
        // CODELAB: Add code to request & open port here.
        // - Request a port and open a connection.
        this.port = await navigator.serial.requestPort();
        // - Wait for the port to open.
        await this.port.open({ baudrate: 9600 });
    
        // CODELAB: Add code to read the stream here.
        const decoder = new TextDecoderStream();
        const inputDone = this.port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
    
        this.reader = inputStream.getReader();
        this.readLoop();
    }

    async clickConnect(): Promise<void> {
        // CODELAB: Add connect code here.
        try {
          await this.connect();
          console.log("here2 🥗");
    
        } catch (error) {
          this.log("Error 😢: " + error + "\n");
        }
        
    }
    
    async readLoop(): Promise<void> {
          // CODELAB: Add read loop here.
        while (true) {
            const { value, done } = await this.reader.read();
            if (value) {
                this.log(value);
                this.procInput(value);
            }
            if (done) {
                console.log('[readLoop] DONE', done);
                this.reader.releaseLock();
                break;
            }
        }
        //reader.cancel();
        //port.close();
    }

    procInput(str: string): void {
        this.strRX = this.strRX + str;
        const linesRX = this.strRX.split("\n");
        if (linesRX.length > 1) {
          for (let i=0; i<linesRX.length-1; i++) {
            
    
            const dataStr = linesRX[i].split("\t");
            const dataNum = dataStr.map(e => parseFloat(e));
            
            const imu = new IMU(dataNum[0], dataNum[1], dataNum[2], dataNum[3]);
            //console.log(imu);
            const event = new CustomEvent('rx',{detail:imu});
            this.dispatchEvent(event);
          }
          // save the reminder of the input line
          this.strRX = linesRX[ linesRX.length-1 ];
        }
          
    }

    log(str: string): void {
        const event = new CustomEvent("rx-msg",{detail:str});
        this.dispatchEvent(event);
    }

   
 }
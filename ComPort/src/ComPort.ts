/**
 * 
 * 
 * Danial Chitnis
 */

 type RxEventType = "rx" | "rx-msg";

 export class ComPort extends EventTarget {
    port: SerialPort;
    reader: ReadableStreamDefaultReader;
    strRX = "";
    

    constructor() {
        super();
    }

    async disconnect(): Promise<void> {
        if (this.port) {
          if (this.reader) {
            await this.reader.cancel();
            await this.port.close();
          }
        }
        this.log("\nport is closed now!\n");
    }

    async connectSerialApi(baudrate: Baudrate): Promise<void> {
        // CODELAB: Add code to request & open port here.
        // - Request a port and open a connection.
        this.log("Requesting port");
        this.port = await navigator.serial.requestPort();
        // - Wait for the port to open.
        this.log("Openning port");
        await this.port.open({ baudrate: baudrate });

        this.log("Port is now open 🎉");
    
        // CODELAB: Add code to read the stream here.
        const decoder = new TextDecoderStream();
        const inputDone = this.port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
    
        this.reader = inputStream.getReader();
        this.readLoop();
    }

    async connect(baudrate: Baudrate): Promise<void> {
        // CODELAB: Add connect code here.
        try {
          await this.connectSerialApi(baudrate);
          console.log("here2 🥗");
    
        } catch (error) {
          this.log("Error 😢: " + error + "\n");
        }
        
    }
    
    private async readLoop(): Promise<void> {
          // CODELAB: Add read loop here.
        while (true) {
            const { value, done } = await this.reader.read();
            if (value) {
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

    private procInput(str: string): void {
        this.strRX = this.strRX + str;
        const linesRX = this.strRX.split("\n");
        if (linesRX.length > 1) {
          
          for (let i=0; i<linesRX.length-1; i++) {
            
            const event = new CustomEvent('rx',{detail: linesRX[i]});
            this.dispatchEvent(event);

          }
          // save the reminder of the input line
          this.strRX = linesRX[ linesRX.length-1 ];
        }
          
    }

    private log(str: string): void {
        const event = new CustomEvent("rx-msg",{detail:str});
        this.dispatchEvent(event);
    }

   
 }
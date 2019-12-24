(function () {
    'use strict';

    /**
     *
     * Danial Chitnis
     */
    class IMU {
        constructor(counter, x, y, z) {
            this.counter = counter;
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    /**
     *
     *
     * Danial Chitnis
     */
    class ComPort {
        constructor() {
            this.strRX = "";
            //
        }
        async clickDisconnect() {
            if (this.port) {
                if (this.reader) {
                    await this.reader.cancel();
                    await this.port.close();
                }
            }
            this.log("\nport is closed now!\n");
        }
        async connect() {
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
        async clickConnect() {
            // CODELAB: Add connect code here.
            try {
                await this.connect();
                console.log("here2 🥗");
            }
            catch (error) {
                this.log("Error 😢: " + error + "\n");
            }
        }
        async readLoop() {
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
        procInput(str) {
            this.strRX = this.strRX + str;
            const linesRX = this.strRX.split("\n");
            if (linesRX.length > 1) {
                for (let i = 0; i < linesRX.length - 1; i++) {
                    const dataStr = linesRX[i].split("\t");
                    const dataNum = dataStr.map(e => parseFloat(e));
                    const imu = new IMU(dataNum[0], dataNum[1], dataNum[2], dataNum[3]);
                    //console.log(imu);
                    const event = new CustomEvent('rx', { detail: imu });
                    dispatchEvent(event);
                }
                // save the reminder of the input line
                this.strRX = linesRX[linesRX.length - 1];
            }
        }
        log(str) {
            const event = new CustomEvent("rx-msg", { detail: str });
            dispatchEvent(event);
        }
    }

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
        const btConnect = document.getElementById("btConnect");
        const btStop = document.getElementById("btStop");
        const pLog = document.getElementById("pLog");
        let port;
        log("Ready...\n");
        btConnect.addEventListener("click", () => {
            port = new ComPort();
            port.clickConnect();
            console.log("here1 🍔");
        });
        btStop.addEventListener("click", () => {
            port.clickDisconnect();
        });
        function log(str) {
            const str1 = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
            const str2 = str1.replace(/(?:\t)/g, "&nbsp&nbsp");
            pLog.innerHTML = pLog.innerHTML + str2;
        }
        addEventListener("rx", (event) => {
            const e = event;
            console.log(e.detail);
        });
        addEventListener("rx-msg", (event) => {
            const e = event;
            log(e.detail);
        });
        // end of scope
    }

}());

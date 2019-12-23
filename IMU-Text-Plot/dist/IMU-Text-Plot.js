var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    let port;
    let reader;
    const btConnect = document.getElementById("btConnect");
    const btStop = document.getElementById("btStop");
    const pLog = document.getElementById("pLog");
    let strRX = "";
    log("Ready...\n");
    btConnect.addEventListener("click", () => {
        clickConnect();
        console.log("here1 🍔");
    });
    btStop.addEventListener("click", () => {
        clickDisconnect();
    });
    function clickDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (port) {
                if (reader) {
                    yield reader.cancel();
                    yield port.close();
                }
            }
            log("\nport is closed now!\n");
        });
    }
    function log(str) {
        const str1 = str.replace(/(?:\r\n|\r|\n)/g, "<br>");
        const str2 = str1.replace(/(?:\t)/g, "&nbsp&nbsp");
        pLog.innerHTML = pLog.innerHTML + str2;
    }
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
    function connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // CODELAB: Add code to request & open port here.
            // - Request a port and open a connection.
            port = yield navigator.serial.requestPort();
            // - Wait for the port to open.
            yield port.open({ baudrate: 9600 });
            // CODELAB: Add code to read the stream here.
            const decoder = new TextDecoderStream();
            const inputDone = port.readable.pipeTo(decoder.writable);
            const inputStream = decoder.readable;
            reader = inputStream.getReader();
            readLoop();
        });
    }
    function clickConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            // CODELAB: Add connect code here.
            try {
                yield connect();
                console.log("here2 🥗");
            }
            catch (error) {
                log("Error 😢: " + error + "\n");
            }
        });
    }
    function readLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            // CODELAB: Add read loop here.
            while (true) {
                const { value, done } = yield reader.read();
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
        });
    }
    function procInput(str) {
        strRX = strRX + str;
        const linesRX = strRX.split("\n");
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
            strRX = linesRX[linesRX.length - 1];
        }
    }
    this.addEventListener("rx", (event) => {
        const e = event;
        console.log(e.detail);
    });
    // end of scope
}
class IMU {
    constructor(counter, x, y, z) {
        this.counter = counter;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
//# sourceMappingURL=IMU-Text-Plot.js.map
/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 * chrome://flags/#enable-experimental-web-platform-features
 */




 let msgRX = "";

 let stopRead = false;

 const decod = new TextDecoder();

 let btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 let btStop = document.getElementById("btStop") as HTMLButtonElement;

 let pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {

    // not implemnetd yet
    /*navigator.serial.getPorts().then( (serialPorts) => {
        console.log(serialPorts);
    });*/

    navigator.serial.requestPort().then( (serialPort) => {
        serialPort.open({baudrate: 9600}).then( () => {

            log("Connected...");

            const reader = serialPort.readable.getReader();

            reader.read().then(function procdata({done, value}) {
                if (done) {
                    return;
                }
                msgRX = msgRX + decod.decode(value);

                // replace \r\n witch <br> for HTML display
                pLog.innerHTML = msgRX.replace(/(?:\r\n|\r|\n)/g, "<br>");

                if (!stopRead) {
                    return reader.read().then(procdata);
                } else {
                    reader.cancel().then( () => {
                        serialPort.close();
                        stopRead = false;
                        log("closed.");
                        return;
                    });
                    return;
                }
            });
        });
    });

 });


 btStop.addEventListener("click", () => {
    stopRead = true;
 });


 function log(str: string) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }


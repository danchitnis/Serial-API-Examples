/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 * chrome://flags/#enable-experimental-web-platform-features
 */

 let LED = false;

 const decod = new TextDecoder();

 let btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 let btLED = document.getElementById("btLED") as HTMLButtonElement;

 let pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {
    navigator.serial.getPorts().then( (serialPort) => {
        console.log(serialPort);
    });
    navigator.serial.requestPort().then( (serialPort) => {
        serialPort.open({baudrate: 9600}).then( () => {
            const reader = serialPort.readable.getReader();

            reader.read().then(function procdata({done, value}) {
                if (done) {
                    return;
                }
                console.log(decod.decode(value));
                return reader.read().then(procdata);
              });


        });
    });

 });


 btLED.addEventListener("click", () => {
   //
 });


 function log(str: string) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }

 function LEDtoBuffer(LEDstate: boolean): Uint8Array {
    if (LEDstate) {
        return Uint8Array.of(1);
    } else {
        return Uint8Array.of(0);
    }
}

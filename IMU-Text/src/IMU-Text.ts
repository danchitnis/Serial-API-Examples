/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 * chrome://flags/#enable-experimental-web-platform-features
 */


{

 let msgRX = "";

 let stopRead = false;

 const decod = new TextDecoder();

 const btConnect = document.getElementById("btConnect") as HTMLButtonElement;
 const btStop = document.getElementById("btStop") as HTMLButtonElement;

 const pLog = document.getElementById("pLog") as HTMLParagraphElement;


 btConnect.addEventListener("click", () => {

    // required for some reason, otherwise the port gets closed on the first attempt
    navigator.serial.getPorts().then( (serialPorts) => {
        //console.log(serialPorts);
    });

    navigator.serial.requestPort().then( (serialPort) => {
        serialPort.open({baudrate: 9600}).then(function open() {

            log("Connected...");

            const reader = serialPort.readable.getReader();

            reader.read().then(function procdata({done, value}): Promise<string> {
                if (done) {
                    console.log("here4");
                    return;
                }
                msgRX = msgRX + decod.decode(value);

                // bug !!!!!
                //sleep(100);
                

                // replace \r\n witch <br> for HTML display
                const strDisplay = msgRX.replace(/(?:\r\n|\r|\n)/g, "<br>");
                pLog.innerHTML = strDisplay.replace(/(?:\t)/g, "&nbsp&nbsp");
                
                
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
            }, () => {
                console.log("here5");
            });
            console.log("here1");
            
        });
        console.log("here2");
    });
    console.log("here3");
    return;

 });


 btStop.addEventListener("click", () => {
    stopRead = true;
 });


 

 function log(str: string): void {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
 }

}

function sleep(milliseconds: number): void {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
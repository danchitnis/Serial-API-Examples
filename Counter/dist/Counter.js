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
    var msgRX_1 = "";
    var stopRead_1 = false;
    var decod_1 = new TextDecoder();
    var btConnect = document.getElementById("btConnect");
    var btStop = document.getElementById("btStop");
    var pLog_1 = document.getElementById("pLog");
    btConnect.addEventListener("click", function () {
        // not implemnetd yet
        /*navigator.serial.getPorts().then( (serialPorts) => {
            console.log(serialPorts);
        });*/
        navigator.serial.requestPort().then(function (serialPort) {
            serialPort.open({ baudrate: 9600 }).then(function () {
                log("Connected...");
                var reader = serialPort.readable.getReader();
                reader.read().then(function procdata(_a) {
                    var done = _a.done, value = _a.value;
                    if (done) {
                        return;
                    }
                    msgRX_1 = msgRX_1 + decod_1.decode(value);
                    // replace \r\n witch <br> for HTML display
                    pLog_1.innerHTML = msgRX_1.replace(/(?:\r\n|\r|\n)/g, "<br>");
                    if (!stopRead_1) {
                        return reader.read().then(procdata);
                    }
                    else {
                        reader.cancel().then(function () {
                            serialPort.close();
                            stopRead_1 = false;
                            log("closed.");
                            return;
                        });
                        return;
                    }
                });
            });
        });
    });
    btStop.addEventListener("click", function () {
        stopRead_1 = true;
    });
    function log(str) {
        pLog_1.innerHTML = pLog_1.innerHTML + "<br>> " + str;
    }
}
//# sourceMappingURL=Counter.js.map
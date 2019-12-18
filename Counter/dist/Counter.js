/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 * chrome://flags/#enable-experimental-web-platform-features
 */
var msgRX = "";
var stopRead = false;
var decod = new TextDecoder();
var btConnect = document.getElementById("btConnect");
var btStop = document.getElementById("btStop");
var pLog = document.getElementById("pLog");
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
                msgRX = msgRX + decod.decode(value);
                // replace \r\n witch <br> for HTML display
                pLog.innerHTML = msgRX.replace(/(?:\r\n|\r|\n)/g, "<br>");
                if (!stopRead) {
                    return reader.read().then(procdata);
                }
                else {
                    reader.cancel().then(function () {
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
btStop.addEventListener("click", function () {
    stopRead = true;
});
function log(str) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
}
//# sourceMappingURL=Counter.js.map
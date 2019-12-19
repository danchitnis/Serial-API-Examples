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
        // required for some reason, otherwise the port gets closed on the first attempt
        navigator.serial.getPorts().then(function (serialPorts) {
            console.log(serialPorts);
        });
        navigator.serial.requestPort().then(function (serialPort) {
            serialPort.open({ baudrate: 9600 }).then(function open() {
                log("Connected...");
                var reader = serialPort.readable.getReader();
                reader.read().then(function procdata(_a) {
                    var done = _a.done, value = _a.value;
                    if (done) {
                        console.log("here4");
                        return;
                    }
                    msgRX_1 = msgRX_1 + decod_1.decode(value);
                    // bug !!!!!
                    //sleep(100);
                    // replace \r\n witch <br> for HTML display
                    var strDisplay = msgRX_1.replace(/(?:\r\n|\r|\n)/g, "<br>");
                    pLog_1.innerHTML = strDisplay.replace(/(?:\t)/g, "&nbsp&nbsp");
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
                }, function () {
                    console.log("here5");
                });
                console.log("here1");
            });
            console.log("here2");
        });
        console.log("here3");
        return;
    });
    btStop.addEventListener("click", function () {
        stopRead_1 = true;
    });
    function log(str) {
        pLog_1.innerHTML = pLog_1.innerHTML + "<br>> " + str;
    }
}
function sleep(milliseconds) {
    var date = Date.now();
    var currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
//# sourceMappingURL=IMU-Text.js.map
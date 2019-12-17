/**
 * WebBlutooth example for Arduino Nano BLE 33
 *
 * Author: Danial Chitnis
 * December 2019
 *
 * Please upload the sketch before running this code
 */
var LED = false;
var decod = new TextDecoder();
var btConnect = document.getElementById("btConnect");
var btLED = document.getElementById("btLED");
var pLog = document.getElementById("pLog");
btConnect.addEventListener("click", function () {
    navigator.serial.getPorts().then(function (serialPort) {
        console.log(serialPort);
    });
    navigator.serial.requestPort().then(function (serialPort) {
        serialPort.open({ baudrate: 9600 }).then(function () {
            var reader = serialPort.readable.getReader();
            reader.read().then(function procdata(_a) {
                var done = _a.done, value = _a.value;
                if (done) {
                    return;
                }
                console.log(decod.decode(value));
                return reader.read().then(procdata);
            });
        });
    });
});
btLED.addEventListener("click", function () {
    //
});
function log(str) {
    pLog.innerHTML = pLog.innerHTML + "<br>> " + str;
}
function LEDtoBuffer(LEDstate) {
    if (LEDstate) {
        return Uint8Array.of(1);
    }
    else {
        return Uint8Array.of(0);
    }
}
//# sourceMappingURL=Echo-Simple.js.map
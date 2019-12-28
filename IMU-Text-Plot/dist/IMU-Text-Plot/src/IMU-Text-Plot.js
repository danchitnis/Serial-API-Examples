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
import { IMU } from "./IMU";
import { ComPort } from "../../ComPort/src/ComPort";
import { WebGLplot, WebglLine, ColorRGBA } from "webgl-plot";
{
    const btConnect = document.getElementById("btConnect");
    const btStop = document.getElementById("btStop");
    const canvas = document.getElementById("display");
    const pLog = document.getElementById("pLog");
    let port;
    let lines;
    const numX = 1000;
    let wglp;
    log("Ready...\n");
    init();
    btConnect.addEventListener("click", () => {
        port = new ComPort();
        port.connect(115200);
        port.addEventListener("rx-msg", eventRxMsg);
        port.addEventListener("rx", eventRxIMU);
        console.log("here1 🍔");
        //start animation
        window.requestAnimationFrame(newFrame);
    });
    btStop.addEventListener("click", () => {
        port.disconnect();
    });
    function newFrame() {
        update();
        wglp.scaleY = 0.9;
        wglp.update();
        window.requestAnimationFrame(newFrame);
    }
    function update() {
        //nothing to do
    }
    function init() {
        lines = [];
        lines.push(new WebglLine(new ColorRGBA(1, 0, 0, 0.5), numX));
        lines.push(new WebglLine(new ColorRGBA(0, 1, 0, 0.5), numX));
        lines.push(new WebglLine(new ColorRGBA(0, 0, 1, 0.5), numX));
        wglp = new WebGLplot(canvas, new ColorRGBA(0.1, 0.1, 0.1, 1));
        lines.forEach((line) => {
            wglp.addLine(line);
            // set x to -num/2:1:+num/2
            line.linespaceX(-1, 2 / numX);
        });
        wglp.update();
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
    function eventRxIMU(e) {
        //console.log(e.detail);
        const imu = new IMU();
        imu.extract(e.detail);
        lines[0].shiftAdd(new Float32Array([imu.x]));
        lines[1].shiftAdd(new Float32Array([imu.y]));
        lines[2].shiftAdd(new Float32Array([imu.z]));
    }
    function eventRxMsg(e) {
        log(e.detail + "\n");
    }
    // end of scope
}
//# sourceMappingURL=IMU-Text-Plot.js.map
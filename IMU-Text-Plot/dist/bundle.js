(function () {
    'use strict';

    /**
     *
     * Danial Chitnis
     */
    class IMU {
        constructor() {
            //
        }
        extract(strLine) {
            const dataStr = strLine.split("\t");
            const dataNum = dataStr.map(e => parseFloat(e));
            this.counter = dataNum[0];
            this.x = dataNum[1];
            this.y = dataNum[2];
            this.z = dataNum[3];
            //console.log(imu);
        }
    }

    /*
     * This code is inspired by Googles Serial Api example
     * https://codelabs.developers.google.com/codelabs/web-serial/
     *
     * Danial Chitnis 2020
     */
    /**
     *  The main class for ComPort package
     */
    class ComPort {
        /**
         * creates a ComPort object
         */
        constructor() {
            this.strRX = "";
            this.comEvent = new EventTarget();
        }
        async disconnect() {
            if (this.port) {
                if (this.reader) {
                    await this.reader.cancel();
                    await this.inputDone.catch((e) => { console.log(e); });
                    this.reader = null;
                    this.inputDone = null;
                }
                if (this.outputStream) {
                    await this.outputStream.getWriter().close();
                    await this.outputDone.catch((e) => { console.log(e); });
                    this.outputStream = null;
                    this.outputDone = null;
                }
                await this.port.close();
                this.log("\nport is now closed!\n");
            }
        }
        async connectSerialApi(baudrate) {
            // CODELAB: Add code to request & open port here.
            // - Request a port and open a connection.
            this.log("Requesting port...");
            this.port = await navigator.serial.requestPort();
            // - Wait for the port to open.
            this.log("Openning port...");
            await this.port.open({ baudrate: baudrate });
            // CODELAB: Add code to read the stream here.
            const decoder = new TextDecoderStream();
            this.inputDone = this.port.readable.pipeTo(decoder.writable);
            const inputStream = decoder.readable;
            const encoder = new TextEncoderStream();
            this.outputDone = encoder.readable.pipeTo(this.port.writable);
            this.outputStream = encoder.writable;
            this.reader = inputStream.getReader();
            this.readLoop();
        }
        async connectToPort(baudrate) {
            // CODELAB: Add connect code here.
            try {
                await this.connectSerialApi(baudrate);
                this.log("Port is now open 🎉");
            }
            catch (error) {
                this.log("Error 😢: " + error + "\n");
            }
        }
        /**
         * Connect to the serial port. This will open the request user dialog box.
         * @param baudrate : speed of connection e.g. 9600 or 115200
         */
        connect(baudrate) {
            this.connectToPort(baudrate);
        }
        async readLoop() {
            // CODELAB: Add read loop here.
            // eslint-disable-next-line no-constant-condition
            while (true) {
                try {
                    const { value, done } = await this.reader.read();
                    if (value) {
                        this.procInput(value);
                    }
                    if (done) {
                        console.log('[readLoop] DONE', done);
                        this.reader.releaseLock();
                        break;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        procInput(str) {
            this.strRX = this.strRX + str;
            const linesRX = this.strRX.split("\n");
            if (linesRX.length > 1) {
                for (let i = 0; i < linesRX.length - 1; i++) {
                    const event = new CustomEvent('rx', { detail: linesRX[i] });
                    this.dispatchEvent(event);
                }
                // save the reminder of the input line
                this.strRX = linesRX[linesRX.length - 1];
            }
        }
        log(str) {
            const event = new CustomEvent("log", { detail: str });
            this.dispatchEvent(event);
        }
        /**
         * Adds a event listnere type for ComPort
         * @param eventType either two types of event rx or rx-msg
         * @param listener a function callback for CustomEvent
         */
        addEventListener(eventType, listener) {
            this.comEvent.addEventListener(eventType, listener);
        }
        removeEventListener() {
            //
        }
        dispatchEvent(event) {
            return this.comEvent.dispatchEvent(event);
        }
        async writeToStream(line) {
            // CODELAB: Write to output stream
            const writer = this.outputStream.getWriter();
            //console.log('[SEND]', line);
            await writer.write(line + '\n');
            writer.releaseLock();
        }
        /**
         * Send a line of String
         * @param line : a line of string. The \n character will be added to end of the line
         */
        sendLine(line) {
            this.writeToStream(line);
        }
    }

    class ColorRGBA {
        constructor(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    class WebglBaseLine {
        constructor() {
            this.scaleX = 1;
            this.scaleY = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.loop = false;
        }
    }

    class WebglLine extends WebglBaseLine {
        //public numPoints: number;
        //public xy: Float32Array;
        //public color: ColorRGBA;
        //public intenisty: number;
        //public visible: boolean;
        //public coord: number;
        /**
         * Create a new line
         * @param c :the color of the line
         * @param numPoints : number of data pints
         * @example
         * ```
         * x= [0,1]
         * y= [1,2]
         * line = new WebglLine( new ColorRGBA(0.1,0.1,0.1,1), 2);
         */
        constructor(c, numPoints) {
            super();
            this.webglNumPoints = numPoints;
            this.numPoints = numPoints;
            this.color = c;
            this.intensity = 1;
            this.xy = new Float32Array(2 * this.webglNumPoints);
            this.vbuffer = 0;
            this.prog = 0;
            this.coord = 0;
            this.visible = true;
        }
        /**
         *
         * @param index : the index of the data point
         * @param x : the horizontal value of the data point
         */
        setX(index, x) {
            this.xy[index * 2] = x;
        }
        /**
         *
         * @param index : the index of the data point
         * @param y : the vertical value of the data point
         */
        setY(index, y) {
            this.xy[index * 2 + 1] = y;
        }
        getX(index) {
            return this.xy[index * 2];
        }
        getY(index) {
            return this.xy[index * 2 + 1];
        }
        linespaceX(start, stepsize) {
            for (let i = 0; i < this.numPoints; i++) {
                // set x to -num/2:1:+num/2
                this.setX(i, start + stepsize * i);
            }
        }
        constY(c) {
            for (let i = 0; i < this.numPoints; i++) {
                // set x to -num/2:1:+num/2
                this.setY(i, c);
            }
        }
        shiftAdd(data) {
            const shiftSize = data.length;
            for (let i = 0; i < this.numPoints - shiftSize; i++) {
                this.setY(i, this.getY(i + shiftSize));
            }
            for (let i = 0; i < shiftSize; i++) {
                this.setY(i + this.numPoints - shiftSize, data[i]);
            }
        }
    }

    /**
     * Author Danial Chitnis 2019
     *
     * inspired by:
     * https://codepen.io/AzazelN28
     * https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm
     */
    /**
     * The main class for the webgl-plot framework
     */
    class WebGLplot {
        //public backgroundColor: ColorRGBA;
        /**
         * Create a webgl-plot instance
         * @param canv: the canvas in which the plot appears
         */
        constructor(canv) {
            const devicePixelRatio = window.devicePixelRatio || 1;
            // set the size of the drawingBuffer based on the size it's displayed.
            canv.width = canv.clientWidth * devicePixelRatio;
            canv.height = canv.clientHeight * devicePixelRatio;
            const webgl = canv.getContext("webgl", {
                antialias: true,
                transparent: false,
            });
            this.lines = [];
            this.webgl = webgl;
            this.gScaleX = 1;
            this.gScaleY = 1;
            this.gXYratio = 1;
            this.gOffsetX = 0;
            this.gOffsetY = 0;
            // Enable the depth test
            webgl.enable(webgl.DEPTH_TEST);
            // Clear the color and depth buffer
            webgl.clear(webgl.COLOR_BUFFER_BIT || webgl.DEPTH_BUFFER_BIT);
            // Set the view port
            webgl.viewport(0, 0, canv.width, canv.height);
        }
        /**
         * update and redraws the content
         */
        update() {
            const webgl = this.webgl;
            this.lines.forEach((line) => {
                if (line.visible) {
                    webgl.useProgram(line.prog);
                    const uscale = webgl.getUniformLocation(line.prog, "uscale");
                    webgl.uniformMatrix2fv(uscale, false, new Float32Array([line.scaleX * this.gScaleX, 0, 0, line.scaleY * this.gScaleY * this.gXYratio]));
                    const uoffset = webgl.getUniformLocation(line.prog, "uoffset");
                    webgl.uniform2fv(uoffset, new Float32Array([line.offsetX + this.gOffsetX, line.offsetY + this.gOffsetY]));
                    const uColor = webgl.getUniformLocation(line.prog, "uColor");
                    webgl.uniform4fv(uColor, [line.color.r, line.color.g, line.color.b, line.color.a]);
                    webgl.bufferData(webgl.ARRAY_BUFFER, line.xy, webgl.STREAM_DRAW);
                    webgl.drawArrays((line.loop) ? webgl.LINE_LOOP : webgl.LINE_STRIP, 0, line.webglNumPoints);
                }
            });
        }
        clear() {
            // Clear the canvas  //??????????????????
            //this.webgl.clearColor(0.1, 0.1, 0.1, 1.0);
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT || this.webgl.DEPTH_BUFFER_BIT);
        }
        /**
         * adds a line to the plot
         * @param line : this could be any of line, linestep, histogram, or polar
         */
        addLine(line) {
            line.vbuffer = this.webgl.createBuffer();
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, line.vbuffer);
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, line.xy, this.webgl.STREAM_DRAW);
            const vertCode = `
      attribute vec2 coordinates;
      uniform mat2 uscale;
      uniform vec2 uoffset;

      void main(void) {
         gl_Position = vec4(uscale*coordinates + uoffset, 0.0, 1.0);
      }`;
            // Create a vertex shader object
            const vertShader = this.webgl.createShader(this.webgl.VERTEX_SHADER);
            // Attach vertex shader source code
            this.webgl.shaderSource(vertShader, vertCode);
            // Compile the vertex shader
            this.webgl.compileShader(vertShader);
            // Fragment shader source code
            const fragCode = `
         precision mediump float;
         uniform highp vec4 uColor;
         void main(void) {
            gl_FragColor =  uColor;
         }`;
            const fragShader = this.webgl.createShader(this.webgl.FRAGMENT_SHADER);
            this.webgl.shaderSource(fragShader, fragCode);
            this.webgl.compileShader(fragShader);
            line.prog = this.webgl.createProgram();
            this.webgl.attachShader(line.prog, vertShader);
            this.webgl.attachShader(line.prog, fragShader);
            this.webgl.linkProgram(line.prog);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, line.vbuffer);
            line.coord = this.webgl.getAttribLocation(line.prog, "coordinates");
            this.webgl.vertexAttribPointer(line.coord, 2, this.webgl.FLOAT, false, 0, 0);
            this.webgl.enableVertexAttribArray(line.coord);
            this.lines.push(line);
        }
        viewport(a, b, c, d) {
            this.webgl.viewport(a, b, c, d);
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
            port.addEventListener("log", eventRxMsg);
            port.addEventListener("rx", eventRxIMU);
            console.log("here1 🍔");
            //start animation
            window.requestAnimationFrame(newFrame);
        });
        btStop.addEventListener("click", () => {
            port.disconnect();
        });
        function newFrame() {
            wglp.gScaleY = 0.9;
            wglp.update();
            window.requestAnimationFrame(newFrame);
        }
        function init() {
            lines = [];
            lines.push(new WebglLine(new ColorRGBA(1, 0, 0, 0.5), numX));
            lines.push(new WebglLine(new ColorRGBA(0, 1, 0, 0.5), numX));
            lines.push(new WebglLine(new ColorRGBA(0, 0, 1, 0.5), numX));
            wglp = new WebGLplot(canvas);
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

}());

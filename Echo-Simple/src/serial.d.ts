// Type definitions for non-npm package W3C Web USB API 1.0
// Project: https://wicg.github.io/webusb/
// Definitions by: Lars Knudsen <https://github.com/larsgk>
//                 Rob Moran <https://github.com/thegecko>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

type Serialrate = 9600 | 11500;
type USBEndpointType = "bulk" | "interrupt" | "isochronous";
type USBRequestType = "standard" | "class" | "vendor";
type USBRecipient = "device" | "interface" | "endpoint" | "other";
type USBTransferStatus = "ok" | "stall" | "babble";



interface SerialPortRequestOptions {
    filters: SerialPortFilter[];
}

interface SerialPortFilter {
    vendorId?: number;
    productId?: number;
}

interface SerialPortInfo {
    maplike: String;
}

interface SerialOptions {
    baudrate?: Serialrate;
    databits?: number;
    stopbits?: number;
    parity?: String;
    buffersize?: number;
    rtscts?: number;
    xon?: Boolean;
    xoff?: Boolean;
    xany?: Boolean;
}


interface SerialConnectionEventInit extends EventInit {
    port: SerialPort;
}



declare class SerialConnectionEvent extends Event {
    constructor(type: string, eventInitDict: SerialConnectionEventInit);
    readonly port: SerialPort;
}



declare class Serial extends EventTarget {
    onconnect(): (this: this, ev: Event) => any;
    ondisconnect(): (this: this, ev: Event) => any;
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
    addEventListener(type: "connect" | "disconnect", listener: (this: this, ev: SerialConnectionEvent) => any, useCapture?: boolean): void;
    //addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
}

declare class SerialPort {
    //Promise<void> open(optional SerialOptions options);
    
    //SerialPortInfo getInfo();

    readonly readable: ReadableStream;
    readonly writable: WritableStream;
    
    
    open(): Promise<void>;
    open(options: SerialOptions): Promise<void>;
    getInfo(): SerialPortInfo;
    close(): void;
    
}

interface Navigator {
    readonly serial: Serial;
}

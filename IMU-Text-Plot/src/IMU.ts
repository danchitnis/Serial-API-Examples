/**
 * 
 * Danial Chitnis
 */

export class IMU {
    counter: number;
    x: number;
    y: number;
    z: number;

    constructor() {
        //
    }


    extract(strLine: string): void {
        const dataStr = strLine.split("\t");
        const dataNum = dataStr.map(e => parseFloat(e));
            
        this.counter = dataNum[0];
        this.x = dataNum[1];
        this.y = dataNum[2]
        this.z = dataNum[3];

        //console.log(imu);
    }
 }
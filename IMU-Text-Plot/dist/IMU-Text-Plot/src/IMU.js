/**
 *
 * Danial Chitnis
 */
export class IMU {
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
//# sourceMappingURL=IMU.js.map
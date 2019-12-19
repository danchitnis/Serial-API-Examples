/*
  Arduino LSM9DS1 - Simple Accelerometer

  This example reads the acceleration values from the LSM9DS1
  sensor and continuously prints them to the Serial Monitor
  or Serial Plotter.

  The circuit:
  - Arduino Nano 33 BLE Sense

  created 10 Jul 2019
  by Riccardo Rizzo

  This example code is in the public domain.
*/

unsigned char counter = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Started...");


}

void loop() {
  
  if (counter<5) {
    Serial.println(counter);
  }
  
  counter++;
  wait_ms(1000);
}

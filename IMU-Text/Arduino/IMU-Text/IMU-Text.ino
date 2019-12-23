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

#include <Arduino_LSM9DS1.h>

float x, y, z;
bool LED = false;
unsigned char counter = 0;


void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Serial Started...");
  
  IMU.begin();
  while (!IMU.begin());
  Serial.println("IMU Started...");

}

void loop() {
  
  
  readIMU();
  toggleLED();
  wait_ms(500);
}


void readIMU() {
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    Serial.print(counter);
    Serial.print(":\t");

    Serial.print(x);
    Serial.print('\t');
    Serial.print(y);
    Serial.print('\t');
    Serial.println(z);

    counter++;
  }
}

int toggleLED() {
  int LEDint = 0;
  if (LED) LEDint = 1;
  else LEDint = 0;
  LED = !LED;

  digitalWrite(LED_BUILTIN, LEDint);
}
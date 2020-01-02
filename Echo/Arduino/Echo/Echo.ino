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
  // Don't wait for serial connection
  //while (!Serial);
  Serial.println("Started...");

}

void loop() {
  
  while(true) {
    
    if (Serial.available() > 0) {
      String str = Serial.readStringUntil('\n');   // Until CR (Carriage Return)
      
      Serial.print(counter);
      Serial.print(": ");
      Serial.println(str);

      counter++;
    }
    
    //wait_ms(1000);
  }
  
  
}

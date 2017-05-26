             // analog input pin 5 -- voltage
const int xpin = A0;                  // x-axis o                 // z-axis (only on 3-axis models)

void setup() {
  // initialize the serial communications:
  Serial.begin(9600);

  // Provide ground and power by using the analog inputs as normal
  // digital pins.  This makes it possible to directly connect the
  // breakout board to the Arduino.  If you use the normal 5V and
  // GND pins on the Arduino, you can remove these lines.
  //pinMode(groundpin, OUTPUT);
  //pinMode(powerpin, OUTPUT);
  //digitalWrite(groundpin, LOW);
  //digitalWrite(powerpin, HIGH);
}

void loop() {
 
  
  // print the sensor values:
  Serial.print("X:");
  Serial.print(analogRead(xpin));
  Serial.println();
  // delay before next reading:
  delay(100);
}

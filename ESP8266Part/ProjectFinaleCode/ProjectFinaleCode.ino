#include "hdr.h"

#define DEBUG

void setup() {

#ifdef DEBUG
  Serial.begin(115200);
#endif


//wifi setup 

  // Set WiFi to station mode and disconnect from an AP if it was Previously
  // connected
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  // Attempt to connect to Wifi network:
#ifdef DEBUG
  Serial.print("Connecting Wifi: ");
  Serial.println(ssid);
#endif

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
#ifdef DEBUG
    Serial.print(".");
#endif
    delay(500);
  }

#ifdef DEBUG
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
#endif
  
  IPAddress ip = WiFi.localIP();
  
#ifdef DEBUG
  Serial.println(ip);
#endif
  ipAddress = ip.toString();

//temp setup

    Wire.begin(D6,D7);
    bool status; 
    status = bme.begin(0x76);

#ifdef DEBUG
    if (!status) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
    }
#endif

  delay(2000); //bme needs some time 
  
  GatherData();
  Serial.println(allData.Temperature);
  Serial.println(allData.Humidity);
  Serial.println(allData.EspId);
  Serial.println(allData.BatteryLevel);
  
 
}

void loop() {

  delay(2000);

  if ( SecProblem() ) {
    triggerIftttEvent();
    sendTelegramMessage();
    for (;;);
  }
}

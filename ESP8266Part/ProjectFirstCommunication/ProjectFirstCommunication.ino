#include <ESP.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

 
#define ssid "" // Your network name here
#define password "" // Your network password here
 
               
void SendData();

void setup() {

   Serial.begin(115200);
     while (!Serial); // wait for serial attach
   // Connect to WiFi network
   Serial.println();
   Serial.println();
   Serial.print("Connecting to ");
   Serial.println(ssid);
   
   WiFi.mode(WIFI_STA);
   WiFi.disconnect();
   delay(1000);
  
   WiFi.begin(ssid, password);
  
  
   while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
   }
   
   Serial.println("");
   Serial.println("WiFi connected");
   Serial.println("IP address: ");
   IPAddress ip = WiFi.localIP();
   Serial.println(ip);
  // delay(15000);

  for(int i = 0 ; i < 10 ; i++){
     delay(1000);
     SentData();
  }  
}



void SentData(){

    String s("unic_id=");
    s += ESP.getChipId();

       
    HTTPClient http;
  
   // http.begin("http://10.110.200.196/iot/public/php/pushData.php");
    http.begin("http://192.168.2.100:8080");
    //http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    //http.addHeader("Connection", "close");
   // http.addHeader("Content-Length", strlen(data));
  //  int httpCode = http.POST(s);
     int httpCode = http.GET();
    
 
   //Serial.print("POST payload: ");
   //Serial.println(s);

   if(httpCode > 0){
   Serial.print("HTTP POST Response: "); 
   Serial.println(httpCode); // HTTP code 200 means ok 
   }
   else{

     Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    
   }

   
  // delay(10000);
   http.end();
  
}



void loop() {
      
}


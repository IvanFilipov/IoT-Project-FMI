#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

 
#define ssid "" // Your network name here
#define password "" // Your network password here
 
const char PHONE_FROM[] = ""; // Your Twilio's phone number, including country code
const char PHONE_TO[] = ""; // Any phone number including country code, BUT if you only have a free account this can only be your verified number
const char TWILIO_ACCOUNT_SID[] =  ""; // Your Twilio's ACCOUNT SID
const char TWILIO_TOKEN[] = ""; // Your Twilios TOKEN
const char TEXT_MESSAGE_BODY[]  = ""; // URL encoded text message.
char data[300]; // HTTP POST data string. Increase size as required.
               
#define HOST "iot-https-relay.appspot.com"
#define PORT 80

void MakeCall();
void setup() {

   Serial.begin(115200);
     while (!Serial); // wait for serial attach


   // Connect to WiFi network
   Serial.println();
   Serial.println();
   Serial.print("Connecting to ");
   Serial.println(ssid);
  
   WiFi.begin(ssid, password);
  
   while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
   }
   Serial.println("");
   Serial.println("WiFi connected");

   MakeCall();
  
}

void MakeCall(){

   strcat(data,"token=");
   strcat(data,TWILIO_TOKEN);
   strcat(data,"&");

   strcat(data,"From=");
   strcat(data,PHONE_FROM);
   strcat(data,"&");
 
   strcat(data,"To=");
   strcat(data,PHONE_TO);
   strcat(data,"&");


   strcat(data,"Body=");
   strcat(data,TEXT_MESSAGE_BODY);

   strcat(data,"&");
   strcat(data,"sid=");
   strcat(data,TWILIO_ACCOUNT_SID);
  
 
   HTTPClient http;
    
   http.begin("http://iot-https-relay.appspot.com/twilio/.json");
   http.addHeader("Content-Type", "application/x-www-form-urlencoded");
   http.addHeader("Connection", "close");
   // http.addHeader("Content-Length", strlen(data));
   int httpCode = http.POST(data);
    
   //http.writeToStream(&Serial);

   Serial.print("POST payload: ");
   Serial.println(data);
   
   Serial.print("HTTP POST Response: "); 
   Serial.println(httpCode); // HTTP code 200 means ok 

  // delay(10000);
   http.end();
  
}



void loop() {
      
}

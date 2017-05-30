


#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include <IFTTTMaker.h>

ADC_MODE(ADC_VCC);

int vdd;

//------- WiFi Settings -------
char ssid[] = "FMI-AIR-211";       // your network SSID (name)
char password[] = "";  // your network key

#define KEY "csXUK3y0kdlrhDWSZPVDZc"  // Get it from this page https://ifttt.com/services/
#define EVENT_NAME "bee_call"


#define BOT_TOKEN "334549090:AAGh_i9fBaYTJJy1xZmsbADB8L7W897hFLE"  // your Bot Token (Get from Botfather)
#define CHAT_ID "296059075" // Chat ID of where you want the message to go (You can use MyIdBot to get the chat ID)

// SSL client needed for both libraries
WiFiClientSecure client;

IFTTTMaker ifttt(KEY, client);
UniversalTelegramBot bot(BOT_TOKEN, client);

String ipAddress = "";

void setup() {

  Serial.begin(115200);


  // Set WiFi to station mode and disconnect from an AP if it was Previously
  // connected
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  // Attempt to connect to Wifi network:
  Serial.print("Connecting Wifi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  IPAddress ip = WiFi.localIP();
  Serial.println(ip);

  ipAddress = ip.toString();

   triggerIftttEvent();
   sendTelegramMessage();

}

void triggerIftttEvent() {
  if(ifttt.triggerEvent(EVENT_NAME, ssid, ipAddress)){
    Serial.println("IFTTT Successfully sent");
  }
}

void sendTelegramMessage() {
  
 vdd = ESP.getVcc();
 Serial.println(vdd);

String message = String(vdd);
  
  //String message = "someone is trying to steal your hive!";
  //message +=  ssid;
  //message += "\n";
  //message = message + "IP: " + ipAddress + "\n";
  if(bot.sendMessage(CHAT_ID, message, "Markdown")){
    Serial.println("TELEGRAM Successfully sent");
  }
  
}

void loop() {
  
}

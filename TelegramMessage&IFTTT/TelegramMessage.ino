//Including the two libraries
#include <UniversalTelegramBot.h>
#include <IFTTTMaker.h>

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

//------- WiFi Settings -------
char ssid[] = "";       // your network SSID (name)
char password[] = "";  // your network key

// ------- IFTTT Maker config --------
#define KEY ""  // Get it from this page https://ifttt.com/services/
#define EVENT_NAME "" // Name of your event name, set when you are creating the applet

// ------- Telegram config --------
#define BOT_TOKEN ""  // your Bot Token (Get from Botfather)
#define CHAT_ID "" // Chat ID of where you want the message to go (You can use MyIdBot to get the chat ID)

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
  String message = "someone is trying to steal your hive!";
  //message +=  ssid;
  //message += "\n";
  //message = message + "IP: " + ipAddress + "\n";
  if(bot.sendMessage(CHAT_ID, message, "Markdown")){
    Serial.println("TELEGRAM Successfully sent");
  }
  
}

void loop() {
  
}

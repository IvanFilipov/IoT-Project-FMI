//Including the two libraries
#include <UniversalTelegramBot.h>
#include <IFTTTMaker.h>

#include<math.h>

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

//------- WiFi Settings -------
char ssid[] = "AndroidHotspo";       // your network SSID (name)
char password[] = "vanaka11";  // your network key

// ------- IFTTT Maker config --------
#define KEY "csXUK3y0kdlrhDWSZPVDZc"  // Get it from this page https://ifttt.com/services/
#define EVENT_NAME "bee_call" // Name of your event name, set when you are creating the applet

// ------- Telegram config --------
#define BOT_TOKEN "334549090:AAGh_i9fBaYTJJy1xZmsbADB8L7W897hFLE"  // your Bot Token (Get from Botfather)
#define CHAT_ID "296059075" // Chat ID of where you want the message to go (You can use MyIdBot to get the chat ID)

// SSL client needed for both libraries
WiFiClientSecure client;

IFTTTMaker ifttt(KEY, client);
UniversalTelegramBot bot(BOT_TOKEN, client);

String ipAddress = "";

void setup() {

  Serial.begin(115200);


  // NOTE:
  // It is important to use interupts when making network calls in your sketch
  // if you just checked the status of te button in the loop you might
  // miss the button press.
  //attachInterrupt(TELEGRAM_BUTTON_PIN, telegramButtonPressed, RISING);
  //attachInterrupt(IFTTT_BUTTON_PIN, iftttButtonPressed, RISING);

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



#define NSAMPLES 10
#define DEFAULTMAX 50
#define DEFAULTMIN 

const int xpin = A0;  

bool SecProblem(){

  Serial.println("stariting");
  static int SamplesSum;
  static unsigned int firstOne;
  static  unsigned int mid ;
  static unsigned int last;
  static int medianOfThree;

  firstOne  = analogRead(xpin);

  for(int i =0 ; i < NSAMPLES ; i++){
    
      delay(100);
    
      if( i == NSAMPLES / 2){
         mid = analogRead(xpin);  
      }
      else{
      SamplesSum += analogRead(xpin);
      }
  }

  delay(100);
  last = analogRead(xpin);
  
  medianOfThree = (firstOne + mid + last) / 3 ; 
  
  SamplesSum /= (NSAMPLES - 1);

  SamplesSum = abs( SamplesSum - medianOfThree);

  Serial.println(SamplesSum);
  
  return (SamplesSum > DEFAULTMAX );
  
}

void loop() {

  delay(2000);

  if ( SecProblem() ) {
    triggerIftttEvent();
    sendTelegramMessage();
    for(;;);
  }
}

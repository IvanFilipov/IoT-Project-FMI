#ifndef _HDR
#define _HDR

//---------------compile properities
#define DEBUG
#define SECURITY_MODULE
#define BECKUPINIT

//backup
#include<EEPROM.h> 
#define MAXLEN 4096

//wifi -----------------------------------------------

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
// SSL client needed for both security libraries
WiFiClientSecure client;

//update ---------------------------------------------

#include <ESP8266HTTPClient.h>
#include <ESP8266httpUpdate.h>


//------- WiFi Settings -------
const char* ssid = "AndroidHotspo";       // your network SSID (name)
const char* password = "vanaka11";  // your network key
const char* host = "88.87.1.226"; //where the server is
#define HOSTPORT 80

//security -----------------------------------------------
#include <UniversalTelegramBot.h>
#include <IFTTTMaker.h>

// ------- IFTTT Maker config --------
#define KEY "csXUK3y0kdlrhDWSZPVDZc"  // Get it from this page https://ifttt.com/services/
#define EVENT_NAME "bee_call" // Name of your event name, set when you are creating the applet

// ------- Telegram config --------
#define BOT_TOKEN "334549090:AAGh_i9fBaYTJJy1xZmsbADB8L7W897hFLE"  // your Bot Token (Get from Botfather)
#define CHAT_ID "296059075" // Chat ID of where you want the message to go (You can use MyIdBot to get the chat ID)

IFTTTMaker ifttt(KEY, client);
UniversalTelegramBot bot(BOT_TOKEN, client);

void triggerIftttEvent();
void sendTelegramMessage(const char*);
bool SecProblem();


//helpers -----------------------------------------------
#include<math.h>

String ipAddress = "";
String _EspId;// = ESP.getChipId(); 


#define SLEEPTIME 600000

#define NSAMPLES 10
#define DEFAULTMAX 50

const int xpin = A0; // where the analog pin is
const char* FilePath = "/public/NewVersion.bin";
ADC_MODE(ADC_VCC); // needed for volt measuring

struct {

  String Temperature;
  String Humidity;
  String EspId;
  String BatteryLevel;


} allData;


//temperature sensor

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10

#define SEALEVELPRESSURE_HPA (1013.25)

Adafruit_BME280 bme; // I2C



//function realizations ----------------------------------------

bool CheckWordFromChat(const char* Word) {

  int num = bot.getUpdates(bot.last_message_received + 1); // Read new messages

  if (num <= 0)
    return false;

  Serial.println("message received");
  for (int i = 0 ; i < num ; i++) {
    if (bot.messages[i].text == Word) {
      String ans = Word;
      ans += " successully done !";
      bot.sendMessage(CHAT_ID, ans);
      return true;
    }
  }

  return false;
}




void UPdate() {

#ifdef DEBUG
  Serial.println("UPDATING");
#endif


  if ((WiFi.status() == WL_CONNECTED)) {

    t_httpUpdate_return ret = ESPhttpUpdate.update(host, HOSTPORT, FilePath);

    if (ret == HTTP_UPDATE_OK)
      sendTelegramMessage("UPDATE complete!");

#ifdef DEBUG
    switch (ret) {
      case HTTP_UPDATE_FAILED:
        Serial.printf("HTTP_UPDATE_FAILD Error (%d): %s", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
        break;

      case HTTP_UPDATE_NO_UPDATES:
        Serial.println("HTTP_UPDATE_NO_UPDATES");
        break;

      case HTTP_UPDATE_OK:
        Serial.println("HTTP_UPDATE_OK");
        break;
    }
#endif
  }
}

String GetBatteryLevel() {

  static int vcc;
  vcc  = ESP.getVcc();

  if (vcc >= 2990)
    return "100";

  if(vcc >= 2700)
    return "75";

  if(vcc >= 2500)
    return "50";

  if(vcc >= 2300)
    return "25";      

  return "1";
  
}

void GatherData() {

  allData.Temperature = bme.readTemperature();
  allData.Humidity = bme.readHumidity();
  allData.EspId = _EspId;
  allData.BatteryLevel = GetBatteryLevel();

}

bool SendData() {

#ifdef DEBUG
  Serial.print("connecting to ");
  Serial.println(host);
#endif
  // Use WiFiClient class to create TCP connections
  static WiFiClient client;
  int tries = 5;

  while (!client.connect(host, HOSTPORT) && tries) {
#ifdef DEBUG
    Serial.println("connection failed");
#endif

    tries --;

  }

  if (tries <= 0)
    return false;


  GatherData(); //checking all the sensors

  //request URI
  String url = "/public/php/pushData.php?";
  url += "unic_id=" + allData.EspId ;
  url += "&temperature=" + allData.Temperature;
  url += "&humidity=" + allData.Humidity;
  url += "&battery=" + allData.BatteryLevel;

#ifdef DEBUG
  Serial.print("Requesting URL: ");
  Serial.println(url);
#endif

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host + "\r\n\r\n") ;

  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return false;
    }
  }

#ifdef DEBUG
  // Read all the lines of the reply from server and print them to Serial
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  Serial.println();
  Serial.println("closing connection");
#endif

  return true;

}

void BackUpInEEPROM() {
  
  int offset = 0;
  signed char T = -1; //temp 0 ; 120 
  byte H = 0xFF; //humidity 0 - 100
  byte B = 0xFF; //battery 0 - 100

  while(true){

     T = EEPROM.read(offset++);
     H = EEPROM.read(offset++);
     B = EEPROM.read(offset++);

     if(T == B && B == H && H == 0) //empty slot
        break;
  }

  if(offset >= 3)
    offset -= 3;

  if(offset >= MAXLEN - 3)
    offset == 0;  

  T = (signed char)atoi(allData.Temperature.c_str());
  H = (byte)atoi(allData.Humidity.c_str());
  B = (byte)atoi(allData.BatteryLevel.c_str());

  EEPROM.write(offset++ , T);
  EEPROM.write(offset++ , H);
  EEPROM.write(offset++ , B);

  EEPROM.commit();
  
}

void SendFromEEPROM() {

  int offset = 0;
  signed char T = -1; //temp -128 ; 127 
  byte H = 0xFF; //humidity 0 - 100
  byte B = 0xFF; //battery 0 - 100

  while(true){

     T = EEPROM.read(offset++);
     H = EEPROM.read(offset++);
     B = EEPROM.read(offset++);

     if(T == B && B == H && H == 0) //empty slot
        break;

      allData.Temperature = T;
      allData.Humidity = H;
      allData.EspId = _EspId;
      allData.BatteryLevel = B;

      if(!SendData()) // trying to senddata
        return;
  }

  //clear EEPROM
  for (int i = 0; i < MAXLEN; i++)
    EEPROM.write(i, 0);

  EEPROM.commit();
  
}

void triggerIftttEvent() {
  if (ifttt.triggerEvent(EVENT_NAME, ssid, ipAddress)) {
#ifdef DEBUG
    Serial.println("IFTTT Successfully sent");
#endif
  }
}

void sendTelegramMessage(const char* msg) {

  String message = msg;

  if (bot.sendMessage(CHAT_ID, message, "Markdown")) {
#ifdef DEBUG
    Serial.println("TELEGRAM Successfully sent");
#endif
  }

}


bool SecProblem() {


#ifdef DEBUG
  Serial.println("stariting");
#endif

  static int SamplesSum;
  static unsigned int firstOne;
  static  unsigned int mid ;
  static unsigned int last;
  static int medianOfThree;

  firstOne  = analogRead(xpin);

  for (int i = 0 ; i < NSAMPLES ; i++) {

    delay(100);

    if ( i == NSAMPLES / 2) {
      mid = analogRead(xpin);
    }
    else {
      SamplesSum += analogRead(xpin);
    }
  }

  delay(100);
  last = analogRead(xpin);
  Serial.println(last);

  medianOfThree = (firstOne + mid + last) / 3 ;

  SamplesSum /= (NSAMPLES - 1);

  SamplesSum = abs( SamplesSum - medianOfThree);

#ifdef DEBUG
  Serial.println(SamplesSum);
#endif
  return (SamplesSum > DEFAULTMAX );

}

bool SecON = true;
long long beginTime; //= millis() / 1000;
long long endTime; //= beginTime + 60;

bool SecurityRoutineProblem() {

  //Serial.println("new episode!");

  beginTime = millis() / 1000;
  endTime = beginTime + 600;

   if (SecON && CheckWordFromChat("--off")) {

      SecON = false;
      //Serial.println("done");

    }

    if (!SecON && CheckWordFromChat("--on")) {

      SecON = true;
      //Serial.println("done");

    }


  while (beginTime < endTime) {
    
    if (SecON && SecProblem() ) {
      triggerIftttEvent();
      sendTelegramMessage("someone is trying to steal your hive!");
      return true;
    }

#ifdef DEBUG
    Serial.println("cycleDone");
#endif
    beginTime += millis() / 1000;
    delay(500);

  }
  
  return false;
}



#endif

#ifndef _HDR
#define _HDR

//wifi -----------------------------------------------

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

// SSL client needed for both security libraries
WiFiClientSecure client;

//------- WiFi Settings -------
const char* ssid = "AndroidHotspo";       // your network SSID (name)
const char* password = "**********************";  // your network key
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
void sendTelegramMessage();
bool SecProblem();


//helpers -----------------------------------------------
#include<math.h>
String ipAddress = "";

#define NSAMPLES 10
#define DEFAULTMAX 50

const int xpin = A0; // where the analog pin is

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


void GatherData() {

  Serial.println(bme.readTemperature());

  allData.Temperature = bme.readTemperature();
  allData.Humidity = bme.readHumidity();
  allData.EspId = ESP.getChipId();
  allData.BatteryLevel = "100";

}

bool SentData() {

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

  if (tires <= 0)
    return false;


  GatherData(); //checking all the sensors
  
  // We now create a URI for the request
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

}


void triggerIftttEvent() {
  if (ifttt.triggerEvent(EVENT_NAME, ssid, ipAddress)) {
#ifdef DEBUG
    Serial.println("IFTTT Successfully sent");
#endif
  }
}

void sendTelegramMessage() {
  String message = "someone is trying to steal your hive!";
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

  medianOfThree = (firstOne + mid + last) / 3 ;

  SamplesSum /= (NSAMPLES - 1);

  SamplesSum = abs( SamplesSum - medianOfThree);

#ifdef DEBUG
  Serial.println(SamplesSum);
#endif
  return (SamplesSum > DEFAULTMAX );

}



#endif

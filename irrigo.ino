#include <Servo.h>
#include <ArduinoJson.h>

Servo s_one;
Servo s_two;

// int sensor1 = 0;
// int sensor2 = 0;
int servo1position = 100;
int servo2position = 100;
int servo1timeElapsed = 0;
int servo2timeElapsed = 0;
unsigned long totalElapsedTime = 0;


void setup() 
{
  Serial.begin(9600);
  while (!Serial) continue;

  writeDeviceState();

  // Servo Init
  s_one.attach(13);
  s_two.attach(12);
  s_one.write(servo1position);
  s_two.write(servo2position);

  //Senspor Init
}

void writeDeviceState()
{
  getTime();

  StaticJsonDocument<256> doc;

    // doc["sensor1"] = sensor1;
    // doc["sensor2"] = sensor2;
    doc["servo1position"] = servo1position;
    doc["servo2position"] = servo2position;
    doc["servo1timeElapsed"] = servo1timeElapsed;
    doc["servo2timeElapsed"] = servo2timeElapsed;
    doc["totalElapsedTime"] = totalElapsedTime;

  serializeJsonPretty(doc, Serial);
}

void getTime()
{
  totalElapsedTime = millis();
}

void loop()
{


  // //Sensor Loop

  if (Serial.available() > 0) {

    byte input = Serial.read();

    // if (sensor1 == 1 ) {
    //     s_one.write(93);
    //     servo1position = 93;
    // }

    // if (sensor2 == 1 ) {
    //     s_two.write(90);
    //     servo2position = 90;
        
    // }

    if (input == '1')
    {
      if (servo1position == 100 ) {
        s_one.write(0);
        servo1position = 0;

      } else if (servo1position == 0 ) {
        s_one.write(100);
        servo1position = 100;
      }
    writeDeviceState();
    }

    if (input == '2')
    {
      if (servo2position == 100 ) {
        s_two.write(0);
        servo2position = 0;

      } else if (servo2position == 0 ) {
        s_two.write(100);
        servo2position = 100;
      }
    writeDeviceState();

    }

  }
}
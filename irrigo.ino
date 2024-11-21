#include <Servo.h>

Servo s_one;
Servo s_two;

int s_one_pos = 0;
int s_two_pos = 0;

void setup() 
{
  Serial.begin(9600);

  // Servo Init
  s_one.attach(13);
  s_two.attach(12);
  s_one.write(s_one_pos);
  s_two.write(s_two_pos);
}

void loop()
{
  if (Serial.available() > 0) {

    byte input = Serial.read();

    if (input == '1')
    {
      if (s_one_pos == 90 ) {
        s_one.write(0);
        s_one_pos = 0;

      } else if (s_one_pos == 0 ) {
        s_one.write(90);
        s_one_pos = 90;
      }

    }

    if (input == '2')
    {
      if (s_two_pos == 90 ) {
        s_two.write(0);
        s_two_pos = 0;

      } else if (s_two_pos == 0 ) {
        s_two.write(90);
        s_two_pos = 90;
      }

    }

  }
}
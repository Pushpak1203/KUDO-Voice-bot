#ifndef PINOUT_H
#define PINOUT_H

// HC-SR04 Ultrasonic Sensor
#define PIN_SONAR_TRIG 8
#define PIN_SONAR_ECHO 9

// L298N Motor Driver
#define PIN_MOTOR_ENA 5
#define PIN_MOTOR_IN1 2
#define PIN_MOTOR_IN2 3
#define PIN_MOTOR_IN3 4
#define PIN_MOTOR_IN4 7
#define PIN_MOTOR_ENB 6

// HC-05 Bluetooth (If using SoftwareSerial)
// Note: If using hardware serial (Pin 0/1), these are not needed.
#define PIN_BT_RX 10
#define PIN_BT_TX 11

#endif // PINOUT_H

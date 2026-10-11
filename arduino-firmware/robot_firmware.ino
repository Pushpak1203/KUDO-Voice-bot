/*
 * Speech Recognition Voice-Controlled Bot - Arduino Uno firmware
 * Wiring:
 * L298N ENA D5 (PWM), IN1 D7, IN2 D8; ENB D6 (PWM), IN3 D9, IN4 D10.
 * HC-SR04 TRIG D12, ECHO D11. SG90 signal D3, servo powered from a suitable 5V supply.
 * HC-05 TX -> Arduino D2 (SoftwareSerial RX); Arduino D4 (SoftwareSerial TX) -> divider -> HC-05 RX.
 * Common GND between Arduino, motor driver, servo supply, and Bluetooth module.
 * Never power motors from the Arduino 5V pin. Use a suitable motor supply and common ground.
 */
#include <SoftwareSerial.h>
#include <Servo.h>

const uint8_t BT_RX = 2, BT_TX = 4;
const uint8_t ENA = 5, ENB = 6, IN1 = 7, IN2 = 8, IN3 = 9, IN4 = 10;
const uint8_t ECHO_PIN = 11, TRIG_PIN = 12, SERVO_PIN = 3;
const int MOTOR_SPEED = 165;
const int OBSTACLE_THRESHOLD_CM = 20;
const unsigned long FAILSAFE_MS = 2000;
const unsigned long TELEMETRY_MS = 250;
const unsigned long AUTO_STEP_MS = 100;

SoftwareSerial bluetooth(BT_RX, BT_TX);
Servo scanner;
enum Direction { DIR_STOP, DIR_FORWARD, DIR_BACKWARD, DIR_LEFT, DIR_RIGHT };
enum Mode { MODE_MANUAL, MODE_AUTO };
Direction directionNow = DIR_STOP;
Mode modeNow = MODE_MANUAL;
unsigned long lastCommandMs = 0, lastTelemetryMs = 0, lastAutoStepMs = 0;
bool obstacleNow = false;
int distanceNow = -1;

void setMotorPins(bool a1, bool a2, bool b1, bool b2, int speedA, int speedB) {
  digitalWrite(IN1, a1); digitalWrite(IN2, a2);
  digitalWrite(IN3, b1); digitalWrite(IN4, b2);
  analogWrite(ENA, constrain(speedA, 0, 255)); analogWrite(ENB, constrain(speedB, 0, 255));
}
void stopMotors() { setMotorPins(LOW, LOW, LOW, LOW, 0, 0); directionNow = DIR_STOP; }
void forwardMotors() {
  if (distanceNow >= 0 && distanceNow < OBSTACLE_THRESHOLD_CM) { stopMotors(); obstacleNow = true; return; }
  setMotorPins(HIGH, LOW, HIGH, LOW, MOTOR_SPEED, MOTOR_SPEED); directionNow = DIR_FORWARD;
}
void backwardMotors() { setMotorPins(LOW, HIGH, LOW, HIGH, MOTOR_SPEED, MOTOR_SPEED); directionNow = DIR_BACKWARD; }
void leftMotors() { setMotorPins(LOW, HIGH, HIGH, LOW, MOTOR_SPEED, MOTOR_SPEED); directionNow = DIR_LEFT; }
void rightMotors() { setMotorPins(HIGH, LOW, LOW, HIGH, MOTOR_SPEED, MOTOR_SPEED); directionNow = DIR_RIGHT; }

long measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(3);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10); digitalWrite(TRIG_PIN, LOW);
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 25000UL);
  if (duration == 0) return 400;
  return (long)(duration * 0.0343 / 2.0);
}
long scanAt(int angle) { scanner.write(angle); delay(180); return measureDistanceCm(); }

void scanAndAvoid() {
  stopMotors();
  long left = scanAt(150);
  long center = scanAt(90);
  long right = scanAt(30);
  scanner.write(90);
  if (center >= OBSTACLE_THRESHOLD_CM) { forwardMotors(); return; }
  // Reverse briefly, then choose the side with more clearance.
  backwardMotors(); delay(280); stopMotors();
  if (left >= OBSTACLE_THRESHOLD_CM || right >= OBSTACLE_THRESHOLD_CM) {
    if (left >= right) { leftMotors(); delay(380); }
    else { rightMotors(); delay(380); }
    stopMotors();
    if (measureDistanceCm() >= OBSTACLE_THRESHOLD_CM) forwardMotors();
  } else {
    // Both sides blocked: remain stopped rather than repeatedly ramming obstacles.
    stopMotors();
  }
}

void handleCommand(char c) {
  lastCommandMs = millis();
  if (c == 'S') { stopMotors(); return; }
  if (c == 'A') { modeNow = MODE_AUTO; stopMotors(); return; }
  if (c == 'M') { modeNow = MODE_MANUAL; stopMotors(); return; }
  if (modeNow != MODE_MANUAL) return; // manual motion commands are ignored in AUTO mode.
  switch (c) {
    case 'F': forwardMotors(); break;
    case 'B': backwardMotors(); break;
    case 'L': leftMotors(); break;
    case 'R': rightMotors(); break;
    default: break;
  }
}

void sendTelemetry() {
  Serial.print("D:"); Serial.println(distanceNow);
  bluetooth.print("D:"); bluetooth.println(distanceNow);
  const char* names[] = {"STOP", "FORWARD", "BACKWARD", "LEFT", "RIGHT"};
  Serial.print("STATE:"); Serial.println(names[directionNow]);
  bluetooth.print("STATE:"); bluetooth.println(names[directionNow]);
  Serial.print("OBS:"); Serial.println(obstacleNow ? 1 : 0);
  bluetooth.print("OBS:"); bluetooth.println(obstacleNow ? 1 : 0);
  Serial.print("MODE:"); Serial.println(modeNow == MODE_AUTO ? "AUTO" : "MANUAL");
  bluetooth.print("MODE:"); bluetooth.println(modeNow == MODE_AUTO ? "AUTO" : "MANUAL");
}

void setup() {
  pinMode(ENA, OUTPUT); pinMode(ENB, OUTPUT);
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600); bluetooth.begin(9600);
  scanner.attach(SERVO_PIN); scanner.write(90);
  stopMotors(); lastCommandMs = millis();
}

void loop() {
  while (bluetooth.available()) {
    char c = (char)bluetooth.read();
    if (c == '\r' || c == '\n' || c == ' ') continue;
    handleCommand(c);
  }
  distanceNow = (int)measureDistanceCm();
  obstacleNow = distanceNow >= 0 && distanceNow < OBSTACLE_THRESHOLD_CM;
  if (directionNow == DIR_FORWARD && obstacleNow) stopMotors();
  if (modeNow == MODE_MANUAL && millis() - lastCommandMs > FAILSAFE_MS) stopMotors();
  if (modeNow == MODE_AUTO && millis() - lastAutoStepMs >= AUTO_STEP_MS) {
    lastAutoStepMs = millis();
    if (obstacleNow || directionNow == DIR_STOP) scanAndAvoid();
    else forwardMotors();
  }
  if (millis() - lastTelemetryMs >= TELEMETRY_MS) {
    lastTelemetryMs = millis();
    sendTelemetry();
  }
}

#include "MotorController.h"
#include "BluetoothHandler.h"
#include "SensorManager.h"

MotorController motors;
BluetoothHandler bt;
SensorManager sensor;

void setup() {
    Serial.begin(9600);
    motors.init();
    bt.init();
    sensor.init();
}

void loop() {
    // 1. Check for Obstacles
    if (sensor.isObstacleDetected(15.0)) {
        motors.stopMotors();
        bt.sendStatus("OBSTACLE");
    }

    // 2. Process Bluetooth Commands
    char cmd = bt.readCommand();
    switch (cmd) {
        case 'F': motors.moveForward(); break;
        case 'B': motors.moveBackward(); break;
        case 'L': motors.turnLeft(); break;
        case 'R': motors.turnRight(); break;
        case 'S': motors.stopMotors(); break;
        default: break; // Ignore
    }
}

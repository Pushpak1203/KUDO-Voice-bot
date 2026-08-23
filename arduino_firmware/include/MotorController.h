#ifndef MOTOR_CONTROLLER_H
#define MOTOR_CONTROLLER_H

#include <Arduino.h>

class MotorController {
public:
    MotorController();
    void init();
    void moveForward();
    void moveBackward();
    void turnLeft();
    void turnRight();
    void stopMotors();
};

#endif // MOTOR_CONTROLLER_H

#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>

class SensorManager {
public:
    SensorManager();
    void init();
    float getDistanceCm();
    bool isObstacleDetected(float thresholdCm);
};

#endif // SENSOR_MANAGER_H

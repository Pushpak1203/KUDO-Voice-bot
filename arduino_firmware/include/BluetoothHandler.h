#ifndef BLUETOOTH_HANDLER_H
#define BLUETOOTH_HANDLER_H

#include <Arduino.h>

class BluetoothHandler {
public:
    BluetoothHandler();
    void init();
    char readCommand();
    void sendStatus(const char* status);
};

#endif // BLUETOOTH_HANDLER_H

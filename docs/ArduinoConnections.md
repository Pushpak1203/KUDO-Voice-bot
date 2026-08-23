# Hardware Overview and Connections

This document details the physical hardware components used in the Panani VoiceBot project and their general connections.

## Components

### 1. Arduino Uno
The central microcontroller for the robot. It executes the C++ firmware, reads from the Bluetooth module and sensor, and sends logic signals to the Motor Driver.

### 2. HC-05 Bluetooth Module
Acts as a serial bridge between the Android smartphone and the Arduino.
- Requires 5V power (though RX pin usually requires a 3.3V voltage divider for safety).
- Communicates via UART (TX/RX).

### 3. L298N Motor Driver
An H-Bridge module that can drive two DC motors directionally.
- Receives logic signals (HIGH/LOW) from Arduino digital pins to determine direction.
- Requires a separate power source (usually the battery pack directly) to provide enough current for the motors.
- Includes a 5V regulator that can be used to power the Arduino if the jumper is in place.

### 4. HC-SR04 Ultrasonic Sensor
Measures distance by bouncing an ultrasonic ping off objects.
- Uses a `Trig` pin to emit the sound wave.
- Uses an `Echo` pin to listen for the bounce back.
- Powered by 5V.

### 5. DC Motors & Chassis
Two standard TT gear motors attached to a 2-wheel drive (or 4-wheel drive wired in parallel) chassis.

### 6. Battery
A standard 7.4V to 12V battery pack (e.g., 2x or 3x 18650 Li-ion cells) to power the L298N.

## Power Routing (Standard Setup)
1. **Battery (+)** connects to the **12V** terminal on the L298N.
2. **Battery (-)** connects to the **GND** terminal on the L298N.
3. The **5V** terminal on the L298N connects to the **VIN / 5V** pin on the Arduino (to power the Arduino).
4. **GND** on the L298N connects to a **GND** pin on the Arduino (Common Ground is CRITICAL).
5. The HC-05 and HC-SR04 modules are powered from the Arduino's **5V** and **GND** pins.

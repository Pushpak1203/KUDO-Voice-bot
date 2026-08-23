# Pin Diagram & Wiring Schematic

This document outlines the specific pin connections between the Arduino Uno and the peripheral modules. These mappings correspond directly to the configuration found in `arduino_firmware/config/pinout.h`.

## 1. HC-05 Bluetooth Module
| HC-05 Pin | Arduino Uno Pin | Notes |
|-----------|-----------------|-------|
| VCC       | 5V              | Power |
| GND       | GND             | Common Ground |
| TXD       | RX (Pin 0) or SoftSerial (e.g., Pin 10) | Arduino receives data |
| RXD       | TX (Pin 1) or SoftSerial (e.g., Pin 11) | Arduino sends data (Use 1k/2k voltage divider) |

## 2. HC-SR04 Ultrasonic Sensor
| HC-SR04 Pin | Arduino Uno Pin | Notes |
|-------------|-----------------|-------|
| VCC         | 5V              | Power |
| GND         | GND             | Common Ground |
| TRIG        | Digital Pin 8   | Emits ping |
| ECHO        | Digital Pin 9   | Receives ping |

## 3. L298N Motor Driver
| L298N Pin | Arduino Uno Pin | Notes |
|-----------|-----------------|-------|
| ENA       | Digital Pin 5   | PWM Speed Control Motor A (Left) |
| IN1       | Digital Pin 2   | Direction Motor A |
| IN2       | Digital Pin 3   | Direction Motor A |
| IN3       | Digital Pin 4   | Direction Motor B |
| IN4       | Digital Pin 7   | Direction Motor B |
| ENB       | Digital Pin 6   | PWM Speed Control Motor B (Right) |

## 4. DC Motors
- **Motor A (Left)** connects to OUT1 and OUT2 on the L298N.
- **Motor B (Right)** connects to OUT3 and OUT4 on the L298N.

*Note: If the robot moves backwards when commanded forwards, simply swap the polarity of the wires for the offending motor at the OUT terminals on the L298N.*

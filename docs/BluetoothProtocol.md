# Bluetooth Communication Protocol

This document defines the serial communication protocol between the Panani VoiceBot Android application and the Arduino-based robot via the HC-05 Bluetooth module.

## Serial Settings
- **Baud Rate**: `9600` (Default for HC-05)
- **Data Bits**: 8
- **Stop Bits**: 1
- **Parity**: None

## Commands (Android -> Arduino)
The Android app acts as the master controller, sending single-character encoded commands to control the robot's movement.

| Command Intention | Encoded Char | Description |
|-------------------|--------------|-------------|
| **FORWARD**       | `F`          | Instructs the L298N to drive both motors forward. |
| **BACKWARD**      | `B`          | Instructs the L298N to drive both motors backward. |
| **LEFT**          | `L`          | Instructs the L298N to turn left (right motor forward, left motor reverse). |
| **RIGHT**         | `R`          | Instructs the L298N to turn right (left motor forward, right motor reverse). |
| **STOP**          | `S`          | Instructs the L298N to stop all motors immediately. |

*Note: Commands are sent as raw ASCII characters.*

## Responses (Arduino -> Android)
The Arduino acts as a responder, sending telemetry and status updates back to the Android app. 

### Standard Status Responses
| Response Payload   | Description |
|--------------------|-------------|
| `CONNECTED`        | Sent upon initial successful pairing and socket connection. |
| `READY`            | Sent when Arduino setup() is complete and ready for commands. |
| `ERROR`            | Generic error state (e.g., motor driver fault, sensor disconnected). |
| `DISCONNECTED`     | (Detected internally by Android, but Arduino may broadcast before sleep). |

### Movement Acknowledgment Responses
| Response Payload   | Description |
|--------------------|-------------|
| `MOVING_FORWARD`   | Acknowledgment that `F` was received and executed. |
| `MOVING_BACKWARD`  | Acknowledgment that `B` was received and executed. |
| `TURNING_LEFT`     | Acknowledgment that `L` was received and executed. |
| `TURNING_RIGHT`    | Acknowledgment that `R` was received and executed. |
| `STOPPED`          | Acknowledgment that `S` was received and executed. |

### Telemetry / Obstacle Responses
The HC-SR04 ultrasonic sensor continuously monitors for obstacles. If an obstacle is detected within the configured threshold, it sends a specific payload.

- **Format**: `OBSTACLE:<distance_in_cm>`
- **Example**: `OBSTACLE:12`
- **Behavior**: When an obstacle is detected, the Arduino *must* automatically halt the motors and continuously broadcast this response until the obstacle is cleared or a reverse command is given. The Android UI should parse this to show an alert to the user.

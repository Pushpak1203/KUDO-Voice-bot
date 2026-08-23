# Arduino Execution Flow

This specification defines the non-blocking execution cycle of the Arduino firmware to ensure rapid response to both hardware sensors and incoming Bluetooth streams.

## Main Loop Architecture (`loop()`)
The Arduino must never use the `delay()` function, as it will block incoming Serial data and delay obstacle detection. All timing must be handled via `millis()` (non-blocking).

```mermaid
graph TD
    Start[Start loop] --> ReadSensor[1. Poll HC-SR04 Sensor]
    
    ReadSensor --> CheckThreshold{Distance < 15cm?}
    CheckThreshold -->|Yes| HaltMotors[Hardware Halt: stopMotors()]
    HaltMotors --> BroadcastObstacle[Serial.println("OBSTACLE")]
    BroadcastObstacle --> ReadSerial
    
    CheckThreshold -->|No| ReadSerial[2. Check Serial.available()]
    
    ReadSerial --> HasData{Data > 0?}
    HasData -->|Yes| ParseChar[Read 1 Char]
    HasData -->|No| EndLoop[End loop, repeat immediately]
    
    ParseChar --> SwitchCmd{Switch (Char)}
    SwitchCmd -->|'F'| Fwd[moveForward()]
    SwitchCmd -->|'B'| Bwd[moveBackward()]
    SwitchCmd -->|'L'| Lft[turnLeft()]
    SwitchCmd -->|'R'| Rgt[turnRight()]
    SwitchCmd -->|'S'| Stp[stopMotors()]
    SwitchCmd -->|Other| EndLoop
    
    Fwd --> Ack[Serial.println("ACK_STATE")]
    Bwd --> Ack
    Lft --> Ack
    Rgt --> Ack
    Stp --> Ack
    
    Ack --> EndLoop
```

## Module Constraints
1. **`SensorManager`**: Pulse generation (`digitalWrite(TRIG, HIGH)`) uses microsecond delays (`delayMicroseconds(10)`), which are short enough not to disrupt the main loop's responsiveness.
2. **`MotorController`**: Uses simple `digitalWrite` and `analogWrite`. No loops. Immediate execution.
3. **`BluetoothHandler`**: Uses `Serial.read()`. Must only read one byte per loop iteration to prevent buffer blocking.

# Bluetooth Message Sequence Diagrams

This document outlines the precise sequences of messaging between the Android application and the Arduino HC-05 over the Serial protocol.

## 1. Connection & Handshake

```mermaid
sequenceDiagram
    participant App as Android ConnectionManager
    participant HC05 as HC-05 Module
    participant MCU as Arduino main.ino
    
    App->>HC05: Attempt RFCOMM Socket Connection
    activate HC05
    HC05-->>App: Socket Established
    App->>HC05: (Wait for MCU Ready)
    MCU->>HC05: Serial.println("READY")
    HC05-->>App: "READY"
    App->>App: Set State = CONNECTED
    deactivate HC05
```

## 2. Standard Movement (Manual Control)

```mermaid
sequenceDiagram
    participant App as Android BluetoothService
    participant MCU as Arduino BluetoothHandler
    participant Motor as L298N MotorController
    
    App->>MCU: 'F'
    MCU->>MCU: switch(char) -> case 'F'
    MCU->>Motor: moveForward()
    Motor-->>MCU: (Pins HIGH)
    MCU->>App: "MOVING_FORWARD"
    
    Note over App,MCU: User releases button
    App->>MCU: 'S'
    MCU->>MCU: switch(char) -> case 'S'
    MCU->>Motor: stopMotors()
    MCU->>App: "STOPPED"
```

## 3. Obstacle Interrupt (Sensor Override)

```mermaid
sequenceDiagram
    participant App as Android
    participant MCU as Arduino main.ino
    participant Sensor as HC-SR04
    participant Motor as L298N
    
    Note over App,MCU: Robot is currently MOVING_FORWARD
    
    loop Every 50ms
        MCU->>Sensor: getDistanceCm()
        Sensor-->>MCU: 12.0 cm
    end
    
    MCU->>MCU: 12.0 < 15.0 (Threshold)
    MCU->>Motor: stopMotors() (Immediate Hardware Halt)
    MCU->>App: "OBSTACLE:12"
    App->>App: Show <ObstacleAlert /> Modal
    App->>App: Log to HistoryManager
```

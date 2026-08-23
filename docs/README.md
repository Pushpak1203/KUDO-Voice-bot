# Panani VoiceBot
**A College Final Year Project**

## Overview
Panani VoiceBot is a two-part robotics project comprising an Android Mobile Application and a Hardware Robot powered by Arduino. The project aims to provide a robust, voice-controlled robotic platform.

## Key Features
- **Voice Control**: Translate human speech into real-time robot commands.
- **Manual Control**: Provide an alternative D-Pad interface for manual driving.
- **Obstacle Avoidance**: Hardware-level ultrasonic sensor integration to prevent collisions automatically.
- **Command History**: Persistent local logging of executed commands and telemetry.
- **Modular Architecture**: Clean separation between UI (Google Stitch), App Logic, and Hardware Logic.

## Documentation
Please refer to the `docs/` folder for comprehensive documentation suitable for the final year project viva:

1. **[Software Architecture](Architecture.md)**: Explains the layered approach and module responsibilities.
2. **[Project Workflow](ProjectWorkflow.md)**: Visualizes the end-to-end data flow.
3. **[Robot State Machine](RobotStateMachine.md)**: Details the valid states and transitions of the system.
4. **[Bluetooth Protocol](BluetoothProtocol.md)**: The strict string communication schema between Android and Arduino.
5. **[Folder Structure](FolderStructure.md)**: Breakdown of the repository directories.
6. **[Arduino Connections](ArduinoConnections.md)**: Hardware component explanations and wiring.
7. **[Pin Diagram](PinDiagram.md)**: Specific pin mappings for the Arduino Uno.

## Core Rules & Single Source of Truth
- **UI Integrity**: The Google Stitch project in the root directory is the absolute source of truth for the frontend UI. It must not be redesigned.
- **Logic Separation**: The mobile application acts *only* as the controller. It calculates no movement or distance logic. The Arduino handles all physical logic.

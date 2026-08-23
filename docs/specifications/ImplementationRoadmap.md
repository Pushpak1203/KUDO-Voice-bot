# Implementation Roadmap

This roadmap defines the chronological steps required to take the Panani VoiceBot from its current architecture planning phase through to a completed, fully tested project.

## Phase 1: Android Frontend Initialization
1. **Initialize Framework**: Run the initializer for the chosen JS framework (e.g., React Native, Expo, or Capacitor) inside the `panani-voicebot-app/` directory.
2. **Port UI**: Copy the `code.html` structures from the Stitch export into the framework's component system (e.g., converting HTML to JSX). Ensure CSS (Tailwind) is compiling correctly.
3. **Setup Navigation**: Implement the router to transition between the static screens.
*Goal: The app looks exactly like the Stitch export and navigates correctly, but has no logic.*

## Phase 2: Android Business Logic Binding
1. **Implement Configurations & Constants**: Port the generated `config/` and `constants/` files into the active codebase.
2. **Implement Services**: Write the logic for `BluetoothService` and `VoiceService` adhering strictly to the `ServiceContracts.md`.
3. **State Management**: Bind the UI components to the Service hooks (as per `ScreenSpecifications.md`).
*Goal: The app can request mic permissions, parse speech, and attempt Bluetooth connections.*

## Phase 3: Arduino Firmware Implementation
1. **Implement Headers**: Flesh out the `.cpp` files in `arduino_firmware/src/` for the `MotorController`, `BluetoothHandler`, and `SensorManager`.
2. **Implement Main Loop**: Ensure `main.ino` follows the `ArduinoExecutionFlow.md` exactly (no blocking delays).
3. **Compile & Flash**: Verify the code compiles without errors and upload it to the Arduino Uno.
*Goal: The Arduino is programmed and ready to accept serial commands.*

## Phase 4: Hardware Assembly & Unit Testing
1. **Wiring**: Follow the `PinDiagram.md` and `ArduinoConnections.md` to wire the HC-05, L298N, motors, and sensor to the Arduino.
2. **Serial Monitor Test**: Perform Phase 2 of the `TestingStrategy.md` (testing via USB Serial Monitor).
*Goal: The physical robot moves and stops for obstacles correctly when controlled by a PC.*

## Phase 5: Full System Integration
1. **Pairing**: Connect the Android App to the HC-05.
2. **Manual Drive**: Test all D-Pad commands.
3. **Voice Drive**: Test speech recognition commands.
4. **Error Recovery**: Induce failures (unplug sensor, disconnect Bluetooth) and ensure the `ErrorHandlingWorkflows.md` behave as expected.
*Goal: Project is fully operational and ready for the Final Year Viva demonstration.*

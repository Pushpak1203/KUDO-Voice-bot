# Testing Strategy

This document outlines the testing strategy for the Panani VoiceBot, divided into three phases to ensure both software and hardware work flawlessly before integration.

## Phase 1: Android Application Testing (Mocked Hardware)
Before flashing the Arduino, the Android app logic must be tested independently.
1. **Mock Connection**: Create a mock `ConnectionManager` that simulates connecting to the HC-05 without physical hardware.
2. **UI Navigation Test**: Verify that the Stitch UI correctly routes between the Home, Voice, Manual, and Settings screens.
3. **Voice Parsing Test**: Speak into the microphone and verify that the `VoiceService` correctly triggers the `CommandTranslator`, and outputs the correct `RobotCommand` enum.
4. **History Logging Test**: Ensure that every mocked command sent is correctly saved and displayed on the Command History screen.

## Phase 2: Arduino Hardware Testing (Serial Monitor)
Test the Arduino logic without the Android app using the Arduino IDE Serial Monitor.
1. **Motor Test**: Connect the Arduino via USB. Open the Serial Monitor (9600 baud). Type `F`, `B`, `L`, `R`, `S` and verify the physical wheels spin correctly.
2. **Sensor Test**: Place your hand 10cm in front of the HC-SR04. The motors should immediately stop spinning, and the Serial Monitor should print `OBSTACLE:10`.
3. **Bluetooth Loopback**: Connect the HC-05. Pair it with a generic Bluetooth Serial terminal app (e.g., "Serial Bluetooth Terminal" on Android). Send characters and verify the robot moves.

## Phase 3: Integration Testing
Combine both finalized systems.
1. **Pairing**: Ensure the custom Android App successfully scans and pairs with the HC-05.
2. **Manual Drive**: Test the D-Pad UI buttons. Verify latency between button press and motor response is minimal (< 200ms).
3. **Voice Drive**: Test the Voice UI. Speak "Go forward". Verify the robot moves forward.
4. **Obstacle Test**: While the robot is moving forward via App command, place an obstacle in front of it. Verify the robot halts AND the Android app displays the `<ObstacleAlert />` modal.

# Software Architecture

The Panani VoiceBot project uses a modular, layered architecture that strictly separates the User Interface from Business Logic, and Mobile App logic from Hardware logic.

## Core Principles
1. **Single Source of Truth UI**: The Google Stitch UI export is untouched. The app is built *around* this UI.
2. **Separation of Concerns**: The Android app acts *only* as the controller. All motor driver logic and obstacle detection logic lives on the Arduino.
3. **Clean Architecture Layers**:
   - **UI Layer**: Reacts to state changes and captures user intents.
   - **Feature Layer**: Specific domains (History, Settings, Manual Control, Voice Control).
   - **Service Layer**: Core operations (ConnectionManager, SpeechParser, CommandTranslator).
   - **Hardware Layer**: Arduino firmware managing physical sensors and motors.

## Android App Architecture

- **`ConnectionManager`**: Manages the lifecycle of the HC-05 connection (pair, connect, reconnect, disconnect, timeout).
- **`BluetoothService`**: Manages the I/O streams (reading strings from Arduino, writing command chars to Arduino).
- **`VoiceService`**: Manages the microphone and uses a Speech-to-Text engine to yield a string transcript.
- **`CommandTranslator`**: Parses the raw string transcript, extracts keywords based on `voice.config.ts`, and emits a standardized `RobotCommand` enum.
- **`HistoryManager`**: Intercepts dispatched commands and status updates, writing them to local persistent storage.

## Arduino Architecture

- **`BluetoothHandler`**: Listens to the Serial port. Reads incoming `char` data and passes it to the main loop.
- **`MotorController`**: Abstracted logic to drive the L298N motor driver pins `HIGH`/`LOW` based on the requested direction.
- **`SensorManager`**: Uses pulse timing on the HC-SR04 to calculate distance in cm.
- **`main.ino`**: The core loop that polls the sensor, checks for obstacles, reads Bluetooth data, and delegates to the MotorController.

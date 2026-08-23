# Panani VoiceBot - Directory Structure

The repository is structured to cleanly separate the Android Application architecture, the Arduino firmware, and the centralized configuration/documentation, while keeping the original exported UI perfectly intact.

## Root Directory

```text
panani-voicebot-app/
├── app/                  # Android Application Source Code
├── config/               # Centralized configuration files (.ts)
├── docs/                 # Project documentation and markdown schemas
└── features/             # App specific feature domains and state logic
arduino_firmware/
├── config/               # Hardware pin configurations
├── include/              # Arduino Header files (.h)
├── libraries/            # External C++ library dependencies
└── src/                  # Main sketch and C++ implementations (.cpp, .ino)
[Stitch UI Folders]       # The exported HTML/CSS folders from Google Stitch
```

## `panani-voicebot-app/app/`
This folder acts as the core of the Android application.
- **`components/`**: Reusable stateless UI widgets (buttons, cards) extracted from the Stitch HTML.
- **`screens/`**: Container layouts wrapping the components.
- **`navigation/`**: Router logic to move between screens.
- **`hooks/`**: Custom React/JS hooks for lifecycle management.
- **`services/`**: Core background operations:
  - `bluetooth/`: I/O stream reading/writing.
  - `connection/`: Lifecycle management for the HC-05 connection.
  - `voice/`: Microphone API and Speech-to-Text invocation.
  - `commands/`: Parsers and translators for raw string to command enums.
- **`constants/`**: Immutable application definitions (enums, routes).

## `panani-voicebot-app/features/`
This folder contains business logic broken down by domain.
- **`history/`**: Logic for reading/writing local storage command history logs.
- **`manual-control/`**: State and handlers for the joystick/D-pad UI.
- **`voice-control/`**: State and handlers for the microphone UI.
- **`robot-status/`**: State for displaying Arduino telemetry (obstacle alerts).
- **`settings/`**: State and local storage for user preferences.

## `arduino_firmware/`
This folder contains the complete robot logic.
- **`config/pinout.h`**: Defines exactly which digital/analog pins connect to the motor driver, sensor, and bluetooth module.
- **`include/` & `src/`**: Split declaration (`.h`) and implementation (`.cpp`) files for the `MotorController`, `BluetoothHandler`, and `SensorManager`.

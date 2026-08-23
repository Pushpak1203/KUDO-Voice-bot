# Error Handling & Recovery Workflows

Robust error handling is critical for preventing runaway robots and frustrating user experiences.

## 1. Bluetooth Connection Lost
**Trigger**: The HC-05 loses power, moves out of range, or the Android OS kills the socket.
**Arduino Recovery**: 
- If the Arduino `Serial` buffer receives no data for 2 seconds while moving, a watchdog timer (optional enhancement) should force `stopMotors()`.
**Android Recovery**:
- `ConnectionManager` catches the socket exception.
- Changes state to `DISCONNECTED`.
- UI updates to show "Disconnected" status.
- Triggers the auto-reconnect loop defined in `bluetooth.config.ts`.

## 2. Permission Denied (Mic or Bluetooth)
**Trigger**: User denies Android OS permission prompts.
**Recovery**:
- Service catches `SecurityException`.
- Route to an Error State UI.
- Display the appropriate string from `ErrorMessages.MIC_DENIED` or `ErrorMessages.PERMISSION_DENIED`.
- Provide a button to open Android OS Settings.

## 3. Unrecognized Voice Command
**Trigger**: Speech-to-text outputs a string that `CommandTranslator` cannot match against `VoiceKeywords`.
**Recovery**:
- `CommandTranslator` returns `null`.
- `VoiceService` emits `onError(ErrorMessages.INVALID_VOICE_COMMAND)`.
- UI flashes the error text ("Command not recognized, try saying 'Forward'").
- Robot remains in its current state (does not stop, unless explicitly told to).

## 4. Hardware Fault (Motor Driver Overheat / Sensor Disconnect)
**Trigger**: HC-SR04 wire becomes unplugged.
**Arduino Recovery**:
- `pulseIn()` will timeout (return 0).
- `SensorManager` should interpret `0` or timeout as a critical hardware fault, NOT as "no obstacle".
- Arduino forces `stopMotors()` and broadcasts `ERROR:SENSOR_FAULT`.
**Android Recovery**:
- App parses the `ERROR` string and displays a persistent modal asking the user to check wiring.

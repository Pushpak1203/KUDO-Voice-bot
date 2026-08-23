# Screen Specifications & Component Mapping

This document maps the exported Google Stitch UI HTML screens to their logical React/JS equivalents, defining the required state and service hooks for each.

## General Rule
- The DOM structure and Tailwind CSS classes from the Stitch export are **immutable**.
- Only `onClick`, `onChange`, and dynamic text bindings `{value}` are to be injected into the HTML.

## 1. Splash Screen (`splash_screen`)
- **UI Element**: `splash_screen/code.html`
- **Component**: `<SplashScreen />`
- **Logic**: Wait 2 seconds (or wait for Bluetooth initialization), then route to `HOME`.

## 2. Home Dashboard (`home_dashboard`)
- **UI Element**: `home_dashboard/code.html`
- **Component**: `<HomeDashboard />`
- **Required State**: `ConnectionState` (to show connected/disconnected indicator).
- **Service Hooks**: `ConnectionManager.getConnectionState()`.
- **Navigation**: Provides routes to Bluetooth, Voice, Manual, Settings, and History screens.

## 3. Bluetooth Connection (`bluetooth_connection`)
- **UI Element**: `bluetooth_connection/code.html`
- **Component**: `<BluetoothConnectionScreen />`
- **Required State**: `discoveredDevices: Device[]`, `isScanning: boolean`.
- **Interactions**: 
  - `Scan Button` -> Triggers platform BT scan.
  - `Device List Item` -> `ConnectionManager.connect(macAddress)`.

## 4. Voice Control (`voice_control`)
- **UI Element**: `voice_control/code.html`
- **Component**: `<VoiceControlScreen />`
- **Required State**: `isListening: boolean`, `transcript: string`, `lastCommandStatus: string`.
- **Service Hooks**: `VoiceService` (start/stop), `CommandTranslator` (to parse intent), `BluetoothService` (to write command).
- **Interactions**:
  - `Mic Button` -> `VoiceService.startListening()`.

## 5. Manual Control Fixed (`manual_control_fixed`)
- **UI Element**: `manual_control_fixed/code.html`
- **Component**: `<ManualControlScreen />`
- **Interactions**:
  - `Up Arrow` (onPressIn) -> `BluetoothService.writeCommand('F')`
  - `Down Arrow` (onPressIn) -> `BluetoothService.writeCommand('B')`
  - `Left Arrow` (onPressIn) -> `BluetoothService.writeCommand('L')`
  - `Right Arrow` (onPressIn) -> `BluetoothService.writeCommand('R')`
  - `Any Arrow` (onPressOut) -> `BluetoothService.writeCommand('S')`

## 6. Robot Status (`robot_status` & `obstacle_alert`)
- **UI Element**: `robot_status/code.html`, `obstacle_alert/code.html` (modal overlay)
- **Component**: `<RobotStatusOverlay />` (Global context wrapper)
- **Required State**: `lastTelemetry: string`, `isObstacleDetected: boolean`.
- **Service Hooks**: Listens to `BluetoothService.onDataReceived`. If data matches `OBSTACLE:*`, triggers the `obstacle_alert` modal globally.

## 7. Command History (`command_history`)
- **UI Element**: `command_history/code.html`
- **Component**: `<CommandHistoryScreen />`
- **Required State**: `logs: HistoryItem[]`.
- **Service Hooks**: `HistoryManager.getHistory()`.

## 8. Settings (`settings`)
- **UI Element**: `settings/code.html`
- **Component**: `<SettingsScreen />`
- **Required State**: Bound to `config/` (dark mode, voice sensitivity).

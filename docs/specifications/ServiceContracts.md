# Service Contracts

This document defines the strict public interfaces (Contracts) for the core Android application services. Adhering to these contracts ensures that the UI layer, Business Logic layer, and Hardware layers remain decoupled.

## 1. ConnectionManager Contract
**Responsibility**: Manages the lifecycle and state of the Bluetooth connection.

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `connect` | `deviceAddress: string` | `Promise<boolean>` | Initiates RFCOMM socket connection. |
| `disconnect` | None | `void` | Safely closes the socket and cleans up listeners. |
| `getConnectionState` | None | `ConnectionState` | Returns current state (`DISCONNECTED`, `CONNECTING`, `CONNECTED`). |
| `onStateChanged` | `callback: (state: ConnectionState) => void` | `void` | Registers a listener for state changes. |

## 2. BluetoothService Contract
**Responsibility**: Raw I/O data transmission over the active socket.

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `writeCommand` | `char: string` | `Promise<void>` | Sends a single character to the HC-05 TX. |
| `onDataReceived` | `callback: (data: string) => void` | `void` | Listener for incoming strings from HC-05 RX (e.g. `OBSTACLE:15`). |

## 3. VoiceService Contract
**Responsibility**: Microphone access and Speech-To-Text processing.

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `startListening` | None | `Promise<void>` | Requests mic permission, starts STT engine. |
| `stopListening` | None | `void` | Halts STT engine. |
| `onResult` | `callback: (text: string) => void` | `void` | Emits the raw transcript text. |
| `onError` | `callback: (error: string) => void` | `void` | Emits hardware or permission errors. |

## 4. CommandTranslator Contract
**Responsibility**: Converts raw speech transcripts into actionable `RobotCommand` enums.

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `parseIntent` | `transcript: string` | `RobotCommand \| null` | Checks transcript against `VoiceKeywords` config. |

## 5. HistoryManager Contract
**Responsibility**: Local persistence of user commands and robot telemetries.

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `logAction` | `action: HistoryItem` | `Promise<void>` | Appends a new timestamped log to local storage. |
| `getHistory` | `limit?: number` | `Promise<HistoryItem[]>` | Retrieves the history array, sorted chronologically. |
| `clearHistory` | None | `Promise<void>` | Wipes the local storage log. |

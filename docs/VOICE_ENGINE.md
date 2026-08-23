# Voice Engine Architecture

This document describes the modern, production-ready Voice Recognition Engine implemented for the Panani VoiceBot.

## Architecture

The previous dependency `@react-native-voice/voice` was completely removed due to incompatibility with modern Android toolchains (Gradle 9.x, AGP 9.x, Android SDK 36).

Instead, a custom Android Native Module was built to bridge Android's native `SpeechRecognizer` API.

**Components:**
1. **VoiceRecognitionModule (Kotlin)**: A `ReactContextBaseJavaModule` that handles the `SpeechRecognizer` instance on the Android UI Thread and emits events over the React Native bridge.
2. **VoiceRecognitionPackage (Kotlin)**: Registers the module with the React Native application.
3. **VoiceService (TypeScript)**: A robust singleton service in `app/services/voice/VoiceService.ts` that provides a clean API, manages continuous listening state, and handles event parsing.
4. **VoiceControlScreen (React Native)**: The UI component that requests runtime permissions and subscribes to `VoiceService` events.

## Lifecycle and Event Flow

When `VoiceService.startListening()` is called:
1. `VoiceService` clears any pending restarts and calls the Native Module.
2. The Native Module instantiates (if needed) the `SpeechRecognizer` and sends a `RecognizerIntent.ACTION_RECOGNIZE_SPEECH`.
3. `SpeechRecognizer` fires `onReadyForSpeech`, which emits `onSpeechStart` to JS.
4. The user speaks, triggering `onPartialResults` which emits `onSpeechPartialResults`.
5. Speech concludes, triggering `onResults` which emits `onSpeechResults`. `VoiceService` intercepts this and emits the parsed text to the UI.
6. The `IntentMapper` translates the text into a `RobotCommand`.

## Restart Strategy (Continuous Listening)

To maintain a continuous listening experience suitable for a hands-free robot:
- **On Speech End / Results**: When `onSpeechEnd` or `onSpeechResults` is received, `VoiceService` automatically triggers a restart after a 500ms delay to prevent microphone locks and infinite loops.
- **On Error**: If a recoverable error occurs (e.g., Timeout, No Match, No Speech), `VoiceService` will log it and automatically restart the listening process.
- **Manual Stop**: The continuous loop is only broken when the UI explicitly calls `VoiceService.stopListening()` or `destroy()`.

## Permissions

The engine relies on the Android `RECORD_AUDIO` permission.
- The `VoiceControlScreen` uses `PermissionsAndroid` to request this runtime permission from the user *before* initiating the first listening session.
- If denied, the UI gracefully informs the user that voice control is disabled.

## Future Wake-Word Integration

Currently, the engine uses cloud/device-hybrid continuous listening which can be battery-intensive if left on indefinitely.

**Future Considerations:**
- Integrate an offline, lightweight wake-word detector (like Porcupine or PocketSphinx).
- Use the wake-word detector to *trigger* `VoiceService.startListening()` only when the user says "Hey Panani".
- This would drastically improve battery life and reduce false positives.

# Project Version Documentation

This document logs the core tooling versions used for the Panani VoiceBot project environment to ensure reproducible builds.

| Component | Version |
|-----------|---------|
| React Native | `0.86.0` |
| React | `19.2.3` |
| Gradle | `9.3.1` |
| Kotlin | `2.1.20` |
| Java JDK | `21.0.2` (LTS) |
| Android API Level | `35` (Target) |
| Android Gradle Plugin | Standard RN 0.86 map (e.g. 8.7.x) |

## Compatibility Concerns (React Native 0.86.0)

1. **@react-native-voice/voice**:
   - **Status**: The package is deprecated (npm warns: "Use expo-speech-recognition instead").
   - **Concern**: With RN 0.86.0, the New Architecture (TurboModules) is default. If the library hasn't been updated for the New Architecture, it may require fallback to the legacy bridge or patching via `patch-package`.

2. **react-native-bluetooth-classic**:
   - **Status**: Active, but complex native dependencies.
   - **Concern**: Similar to voice, Bluetooth Classic native modules rely heavily on the Android BluetoothAdapter. API 35 (Android 15) enforces strict runtime permissions (`BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`). Ensure `PermissionService` handles these aggressively before initializing the library. RN 0.86.0 may also require TurboModule compatibility or legacy bridge fallback.

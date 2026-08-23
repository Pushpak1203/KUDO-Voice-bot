import { PermissionsAndroid, Platform } from 'react-native';
import { Logger } from '../utils/Logger';

const TAG = 'PermissionService';

export enum BluetoothPermissionState {
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
  BLUETOOTH_OFF = 'BLUETOOTH_OFF',
  UNSUPPORTED = 'UNSUPPORTED',
}

class AppPermissionService {
  /**
   * Requests the necessary Bluetooth and Location permissions for Android.
   * Android 12+ (API 31+) requires BLUETOOTH_SCAN and BLUETOOTH_CONNECT.
   * Older versions require ACCESS_FINE_LOCATION.
   */
  async requestBluetoothPermissions(): Promise<BluetoothPermissionState> {
    Logger.info(TAG, 'Requesting Bluetooth permissions from Android OS');

    if (Platform.OS !== 'android') {
      Logger.warn(TAG, 'Unsupported platform');
      return BluetoothPermissionState.UNSUPPORTED;
    }

    try {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        const allGranted =
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED;

        if (allGranted) {
          Logger.info(TAG, 'Android 12+ Bluetooth permissions GRANTED');
          return BluetoothPermissionState.GRANTED;
        } else {
          Logger.warn(TAG, 'Android 12+ Bluetooth permissions DENIED');
          return BluetoothPermissionState.DENIED;
        }
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission for Bluetooth',
            message: 'This app requires location permission to scan for Bluetooth devices.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Logger.info(TAG, 'Legacy Bluetooth (Location) permission GRANTED');
          return BluetoothPermissionState.GRANTED;
        } else {
          Logger.warn(TAG, 'Legacy Bluetooth (Location) permission DENIED');
          return BluetoothPermissionState.DENIED;
        }
      }
    } catch (err) {
      Logger.error(TAG, 'Error requesting Bluetooth permissions', err);
      return BluetoothPermissionState.DENIED;
    }
  }

  /**
   * Note for Milestone 1:
   * The BLUETOOTH_OFF and UNSUPPORTED states are defined in the enum
   * but will be evaluated in Milestone 2 when the BluetoothService is initialized
   * and can query the actual hardware adapter state.
   */
}

export const PermissionService = new AppPermissionService();

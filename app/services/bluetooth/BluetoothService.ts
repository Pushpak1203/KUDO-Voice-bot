import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Logger } from '../../utils/Logger';
import { IBluetoothService, BluetoothAdapterState } from './IBluetoothService';
import { BluetoothDevice } from '../../models/BluetoothDevice';

const TAG = 'BluetoothService';

class RealBluetoothService implements IBluetoothService {
  private connectedDeviceId: string | null = null;

  async initialize(): Promise<BluetoothAdapterState> {
    Logger.info(TAG, 'Initializing Bluetooth Service...');
    
    try {
      // 1. Check if the device has Classic Bluetooth hardware
      const isAvailable = await RNBluetoothClassic.isBluetoothAvailable();
      if (!isAvailable) {
        Logger.warn(TAG, 'Bluetooth hardware is NOT available or unsupported on this device.');
        return BluetoothAdapterState.UNSUPPORTED;
      }
      
      Logger.info(TAG, 'Bluetooth hardware is available.');

      // 2. Check if Bluetooth is currently turned on
      const isEnabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!isEnabled) {
        Logger.info(TAG, 'Bluetooth adapter is currently DISABLED.');
        return BluetoothAdapterState.DISABLED;
      }

      Logger.info(TAG, 'Bluetooth adapter is ENABLED and READY.');
      return BluetoothAdapterState.READY;
      
    } catch (error) {
      Logger.error(TAG, 'Error during Bluetooth initialization', error);
      return BluetoothAdapterState.ERROR;
    }
  }

  async requestEnable(): Promise<boolean> {
    Logger.info(TAG, 'Requesting user to enable Bluetooth via System Dialog');
    try {
      // Prompts the standard Android intent to turn on Bluetooth
      const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
      if (enabled) {
        Logger.info(TAG, 'User successfully ENABLED Bluetooth.');
      } else {
        Logger.warn(TAG, 'User DENIED the request to enable Bluetooth.');
      }
      return enabled;
    } catch (error) {
      Logger.error(TAG, 'Failed to request Bluetooth enablement', error);
      return false;
    }
  }

  async getPairedDevices(): Promise<BluetoothDevice[]> {
    Logger.info(TAG, 'Fetching paired devices...');
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      return devices.map(d => ({
        id: d.address,
        name: d.name || 'Unknown Device',
        isPaired: true,
      }));
    } catch (error) {
      Logger.error(TAG, 'Failed to get paired devices', error);
      return [];
    }
  }

  async scanForDevices(): Promise<BluetoothDevice[]> {
    Logger.info(TAG, 'Starting device discovery...');
    try {
      // Note: RNBluetoothClassic.startDiscovery() might throw if already scanning
      // or if location permissions are missing.
      const devices = await RNBluetoothClassic.startDiscovery();
      return devices.map(d => ({
        id: d.address,
        name: d.name || 'Unknown Device',
        isPaired: false, // Discovered devices are typically not paired
      }));
    } catch (error) {
      Logger.error(TAG, 'Failed during device discovery', error);
      return [];
    }
  }

  async cancelDiscovery(): Promise<void> {
    Logger.info(TAG, 'Cancelling device discovery...');
    try {
      await RNBluetoothClassic.cancelDiscovery();
    } catch (error) {
      Logger.warn(TAG, 'Error cancelling discovery (might not be scanning)', error);
    }
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    Logger.info(TAG, `Attempting to connect to device ID: ${deviceId}`);
    try {
      // Connect to the device using standard RFCOMM parameters
      const success = await RNBluetoothClassic.connectToDevice(deviceId, {
        connectionType: 'rfcomm',
        DELIMITER: '\n',
      });
      if (success) {
        this.connectedDeviceId = deviceId;
      }
      return !!success;
    } catch (error) {
      Logger.error(TAG, `Failed to connect to ${deviceId}`, error);
      return false;
    }
  }

  async disconnectFromDevice(): Promise<boolean> {
    Logger.info(TAG, 'Disconnecting from active device...');
    try {
      // Since we don't store the device instance here, we will request the connected devices
      // and disconnect the first one. ConnectionManager tracks the active device.
      const connected = await RNBluetoothClassic.getConnectedDevices();
      if (connected.length > 0) {
        Logger.info(TAG, 'Successfully disconnected.');
        this.connectedDeviceId = null;
        const success = await connected[0].disconnect();
        return success;
      }
      return true; // Was already disconnected
    } catch (error) {
      Logger.error(TAG, 'Error during disconnection', error);
      return false;
    }
  }

  async write(data: string): Promise<boolean> {
    try {
      const connected = await RNBluetoothClassic.getConnectedDevices();
      if (connected.length > 0) {
        await connected[0].write(data);
        return true;
      }
      Logger.warn(TAG, 'Cannot write, no device connected.');
      return false;
    } catch (error) {
      Logger.error(TAG, 'Error writing to device', error);
      return false;
    }
  }

  onDeviceRead(listener: (data: string) => void): () => void {
    const subscription = RNBluetoothClassic.onDeviceRead(
      this.connectedDeviceId || '',
      (event: any) => {
        listener(event.data);
      }
    );
    return () => {
      subscription.remove();
    };
  }
}

export const BluetoothService = new RealBluetoothService();

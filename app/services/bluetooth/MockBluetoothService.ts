import { Logger } from '../../utils/Logger';
import { IBluetoothService, BluetoothAdapterState } from './IBluetoothService';
import { BluetoothDevice } from '../../models/BluetoothDevice';

const TAG = 'MockBluetoothService';

class FakeBluetoothService implements IBluetoothService {
  private isEnabled: boolean = true;

  async initialize(): Promise<BluetoothAdapterState> {
    Logger.info(TAG, '[MOCK] Initializing Bluetooth Service...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.isEnabled) {
          Logger.info(TAG, '[MOCK] Bluetooth adapter is DISABLED.');
          resolve(BluetoothAdapterState.DISABLED);
        } else {
          Logger.info(TAG, '[MOCK] Bluetooth adapter is READY.');
          resolve(BluetoothAdapterState.READY);
        }
      }, 500); // simulate hardware delay
    });
  }

  async requestEnable(): Promise<boolean> {
    Logger.info(TAG, '[MOCK] Requesting user to enable Bluetooth (Simulated)');
    return new Promise((resolve) => {
      setTimeout(() => {
        Logger.info(TAG, '[MOCK] Simulating user granting enable request.');
        this.isEnabled = true;
        resolve(true);
      }, 1000);
    });
  }
  
  async getPairedDevices(): Promise<BluetoothDevice[]> {
    Logger.info(TAG, '[MOCK] Fetching paired devices...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'MOCK:11:22:33', name: 'Mock HC-05', isPaired: true },
          { id: 'MOCK:AA:BB:CC', name: 'VoiceBot Robot', isPaired: true },
        ]);
      }, 500);
    });
  }

  async scanForDevices(): Promise<BluetoothDevice[]> {
    Logger.info(TAG, '[MOCK] Starting device discovery...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'MOCK:44:55:66', name: 'Unknown Device', isPaired: false },
          { id: 'MOCK:77:88:99', name: 'Smart TV', isPaired: false },
        ]);
      }, 2000); // simulate longer discovery time
    });
  }

  async cancelDiscovery(): Promise<void> {
    Logger.info(TAG, '[MOCK] Cancelling device discovery...');
    return Promise.resolve();
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    Logger.info(TAG, `[MOCK] Attempting to connect to device ID: ${deviceId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock a failure if the ID is purely 'fail' (for test purposes)
        if (deviceId.includes('FAIL')) {
          Logger.error(TAG, `[MOCK] Failed to connect to ${deviceId}`);
          resolve(false);
        } else {
          Logger.info(TAG, `[MOCK] Successfully connected to ${deviceId}`);
          resolve(true);
        }
      }, 1500); // Simulate connection handshake delay
    });
  }

  async disconnectFromDevice(): Promise<boolean> {
    Logger.info(TAG, '[MOCK] Disconnecting from active device...');
    return new Promise((resolve) => {
      setTimeout(() => {
        Logger.info(TAG, '[MOCK] Successfully disconnected.');
        resolve(true);
      }, 500);
    });
  }

  async write(data: string): Promise<boolean> {
    Logger.debug(TAG, `[MOCK] Writing data to socket: ${data.trim()}`);
    return Promise.resolve(true);
  }

  onDeviceRead(listener: (data: string) => void): () => void {
    Logger.debug(TAG, '[MOCK] Subscribed to device read');
    // We could simulate incoming data via intervals here, but keeping it empty for now
    return () => {
      Logger.debug(TAG, '[MOCK] Unsubscribed from device read');
    };
  }
}

export const MockBluetoothService = new FakeBluetoothService();

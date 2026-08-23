import { BluetoothDevice } from '../../models/BluetoothDevice';

export enum BluetoothAdapterState {
  UNSUPPORTED = 'UNSUPPORTED',
  DISABLED = 'DISABLED',
  READY = 'READY',
  ERROR = 'ERROR',
}

export interface IBluetoothService {
  /**
   * Initializes the subsystem and checks for hardware support and enablement.
   */
  initialize(): Promise<BluetoothAdapterState>;

  /**
   * Requests the user to enable Bluetooth via standard OS dialog.
   * Returns true if the user enabled it, false otherwise.
   */
  requestEnable(): Promise<boolean>;

  /**
   * Retrieves devices that are already paired/bonded to the phone.
   */
  getPairedDevices(): Promise<BluetoothDevice[]>;

  /**
   * Initiates a scan for nearby unpaired devices.
   */
  scanForDevices(): Promise<BluetoothDevice[]>;

  /**
   * Stops any ongoing discovery scan.
   */
  cancelDiscovery(): Promise<void>;

  /**
   * Attempts to establish an RFCOMM connection to the device.
   */
  connectToDevice(deviceId: string): Promise<boolean>;

  /**
   * Disconnects the currently connected device.
   */
  disconnectFromDevice(): Promise<boolean>;

  /**
   * Writes data over the RFCOMM socket to the connected device.
   */
  write(data: string): Promise<boolean>;

  /**
   * Subscribes to incoming data from the connected device.
   */
  onDeviceRead(listener: (data: string) => void): () => void;
}

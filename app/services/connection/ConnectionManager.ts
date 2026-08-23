import { ConnectionState } from '../../models/ConnectionState';
import { getBluetoothService } from '../bluetooth/BluetoothServiceProvider';
import { Logger } from '../../utils/Logger';
import { bluetoothConfig } from '../../config/bluetooth.config';
import { RobotStatusService } from '../status/RobotStatusService';

const TAG = 'ConnectionManager';

type ConnectionEvent = 'Connecting' | 'Connected' | 'Disconnected' | 'ConnectionFailed' | 'Timeout' | 'Cancelled';
type ConnectionListener = (event: ConnectionEvent, state: ConnectionState, deviceId?: string) => void;

class AppConnectionManager {
  private currentState: ConnectionState = ConnectionState.DISCONNECTED;
  private currentDeviceId: string | null = null;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;
  private listeners: ConnectionListener[] = [];
  private readSubscription: (() => void) | null = null;
  
  subscribe(listener: ConnectionListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(event: ConnectionEvent) {
    this.listeners.forEach((listener) => listener(event, this.currentState, this.currentDeviceId || undefined));
  }

  private setState(state: ConnectionState, event: ConnectionEvent) {
    this.currentState = state;
    Logger.info(TAG, `State changed to: ${state} (Event: ${event})`);
    this.notify(event);
  }

  getState(): ConnectionState {
    return this.currentState;
  }

  getConnectedDeviceId(): string | null {
    return this.currentState === ConnectionState.CONNECTED ? this.currentDeviceId : null;
  }

  async connect(deviceId: string): Promise<void> {
    if (this.currentState === ConnectionState.CONNECTING || this.currentState === ConnectionState.CONNECTED) {
      Logger.warn(TAG, `Already connecting or connected. Cancel current connection first.`);
      return;
    }

    this.currentDeviceId = deviceId;
    this.setState(ConnectionState.CONNECTING, 'Connecting');

    const btService = getBluetoothService();

    // Set connection timeout
    this.connectionTimeout = setTimeout(async () => {
      Logger.error(TAG, `Connection to ${deviceId} timed out after ${bluetoothConfig.connectionTimeoutMs}ms`);
      this.setState(ConnectionState.ERROR, 'Timeout');
      await btService.disconnectFromDevice(); // Attempt to clean up socket on timeout
      this.currentDeviceId = null;
    }, bluetoothConfig.connectionTimeoutMs);

    try {
      const success = await btService.connectToDevice(deviceId);
      
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }

      // If user called cancelConnection while this was pending, state would be DISCONNECTED
      if ((this.currentState as ConnectionState) !== ConnectionState.CONNECTING) {
        Logger.info(TAG, 'Connection succeeded but was cancelled by user. Disconnecting.');
        await btService.disconnectFromDevice();
        return;
      }

      if (success) {
        this.setState(ConnectionState.CONNECTED, 'Connected');
        // Forward incoming Bluetooth data to the RobotStatusService parser
        this.readSubscription = btService.onDeviceRead((data: string) => {
          RobotStatusService.handleIncomingData(data);
        });
      } else {
        this.setState(ConnectionState.ERROR, 'ConnectionFailed');
        this.currentDeviceId = null;
      }
    } catch (error) {
      if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
      Logger.error(TAG, 'Exception during connect', error);
      this.setState(ConnectionState.ERROR, 'ConnectionFailed');
      this.currentDeviceId = null;
    }
  }

  async disconnect(): Promise<void> {
    if (this.currentState === ConnectionState.DISCONNECTED) return;
    
    Logger.info(TAG, 'Disconnecting...');
    const btService = getBluetoothService();
    await btService.disconnectFromDevice();
    
    this.setState(ConnectionState.DISCONNECTED, 'Disconnected');
    this.currentDeviceId = null;
  }

  async cancelConnection(): Promise<void> {
    if (this.currentState !== ConnectionState.CONNECTING) return;
    
    Logger.info(TAG, 'Cancelling active connection attempt...');
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    this.setState(ConnectionState.DISCONNECTED, 'Cancelled');
    
    // We also ask the underlying service to disconnect to release the socket
    const btService = getBluetoothService();
    await btService.disconnectFromDevice();
    if (this.readSubscription) {
      this.readSubscription();
      this.readSubscription = null;
    }
    this.currentDeviceId = null;
  }

  async write(data: string): Promise<boolean> {
    if (this.currentState !== ConnectionState.CONNECTED) {
      Logger.warn(TAG, 'Cannot write to device: Not connected.');
      return false;
    }
    const btService = getBluetoothService();
    return await btService.write(data);
  }
}

export const ConnectionManager = new AppConnectionManager();

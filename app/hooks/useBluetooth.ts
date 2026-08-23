import { useState, useCallback, useRef, useEffect } from 'react';
import { BluetoothDevice } from '../models/BluetoothDevice';
import { ConnectionState } from '../models/ConnectionState';
import { BluetoothAdapterState } from '../services/bluetooth/IBluetoothService';
import { getBluetoothService } from '../services/bluetooth/BluetoothServiceProvider';
import { ConnectionManager } from '../services/connection/ConnectionManager';
import { Logger } from '../utils/Logger';
import { bluetoothConfig } from '../config/bluetooth.config';

const TAG = 'useBluetooth';

export const useBluetooth = () => {
  const [adapterState, setAdapterState] = useState<BluetoothAdapterState>(BluetoothAdapterState.UNSUPPORTED);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionManager.getState());
  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(ConnectionManager.getConnectedDeviceId());
  const [isScanning, setIsScanning] = useState(false);
  
  const isConnecting = connectionState === ConnectionState.CONNECTING;
  // Fallback to searching the devices list, but also allow mock device or disconnected cleanup
  const connectedDevice = devices.find(d => d.id === connectedDeviceId) || (connectedDeviceId ? { id: connectedDeviceId, name: 'Unknown Device', address: connectedDeviceId, isPaired: false } : null);

  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btService = getBluetoothService();

  // Listen to ConnectionManager state changes
  useEffect(() => {
    const unsubscribe = ConnectionManager.subscribe((event, state, deviceId) => {
      setConnectionState(state);
      setConnectedDeviceId(deviceId || null);
    });
    return () => unsubscribe();
  }, []);

  const initialize = useCallback(async () => {
    const state = await btService.initialize();
    setAdapterState(state);
    
    if (state === BluetoothAdapterState.READY) {
      const paired = await btService.getPairedDevices();
      setDevices(paired);
    }
  }, []);

  const scan = useCallback(async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    Logger.info(TAG, 'Initiating device scan...');
    
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    scanTimeoutRef.current = setTimeout(async () => {
      setIsScanning(false);
      Logger.info(TAG, 'Scan timed out.');
      await btService.cancelDiscovery();
    }, bluetoothConfig.scanTimeoutMs);

    try {
      const discovered = await btService.scanForDevices();
      
      setDevices(prevDevices => {
        const newDeviceMap = new Map(prevDevices.map(d => [d.id, d]));
        discovered.forEach(d => {
          if (!newDeviceMap.has(d.id)) newDeviceMap.set(d.id, d);
        });
        return Array.from(newDeviceMap.values());
      });
    } catch (error) {
      Logger.error(TAG, 'Scan failed', error);
    } finally {
      setIsScanning(false);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    }
  }, [isScanning]);

  const connect = useCallback(async (deviceId: string) => {
    await ConnectionManager.connect(deviceId);
  }, []);

  const disconnect = useCallback(async () => {
    await ConnectionManager.disconnect();
  }, []);

  const cancelConnection = useCallback(async () => {
    await ConnectionManager.cancelConnection();
  }, []);

  const cleanup = useCallback(async () => {
    Logger.info(TAG, 'Cleaning up Bluetooth resources...');
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    if (isScanning) {
      await btService.cancelDiscovery();
      setIsScanning(false);
    }
    if (ConnectionManager.getState() === ConnectionState.CONNECTING) {
      await ConnectionManager.cancelConnection();
    }
  }, [isScanning]);

  return {
    adapterState,
    devices,
    connectedDevice,
    connectionState,
    isScanning,
    isConnecting,
    initialize,
    scan,
    connect,
    disconnect,
    cancelConnection,
    cleanup,
  };
};

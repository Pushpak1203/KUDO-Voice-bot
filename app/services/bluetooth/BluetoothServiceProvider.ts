import { BluetoothService } from './BluetoothService';
import { MockBluetoothService } from './MockBluetoothService';
import { IBluetoothService } from './IBluetoothService';
import { appConfig } from '../../config/app.config';

// Ensure you export the singleton instance directly
export const getBluetoothService = (): IBluetoothService => {
  if (appConfig.useMockBluetooth) {
    return MockBluetoothService;
  }
  return BluetoothService;
};

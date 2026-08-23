export interface BluetoothDevice {
  id: string; // The MAC address of the device
  name: string; // The broadcasted name
  isPaired: boolean; // Whether the device is already bonded to the phone
}

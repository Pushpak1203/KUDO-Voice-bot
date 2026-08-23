export const bluetoothConfig = {
  // Standard HC-05 SPP UUID
  sppUUID: "00001101-0000-1000-8000-00805F9B34FB",
  defaultDeviceName: "HC-05",
  reconnectTimeoutMs: 5000,
  connectionRetries: 3,
  heartbeatIntervalMs: 2000,
  connectionTimeoutMs: 10000, // 10 seconds timeout for establishing connection
  scanTimeoutMs: 12000,
};

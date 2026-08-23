export interface RobotHealth {
  connected: boolean;
  lastHeartbeat?: number;
  lastMessage?: number;
  signalStrength?: number;
  latency?: number;
}

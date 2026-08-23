export interface RobotStatus {
  connected: boolean;
  moving: boolean;
  direction: 'F' | 'B' | 'L' | 'R' | null;
  obstacleDetected: boolean;
  obstacleDistance: number | null;
  lastCommand: string | null;
  lastUpdated: number;
}

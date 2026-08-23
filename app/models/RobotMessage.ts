export enum RobotMessageType {
  READY = 'READY',
  STOPPED = 'STOPPED',
  MOVING = 'MOVING',
  OBSTACLE = 'OBSTACLE',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
  PING = 'PING',
  PONG = 'PONG',
  HEARTBEAT = 'HEARTBEAT',
}

export interface ParsedMessage {
  type: RobotMessageType;
  direction?: 'F' | 'B' | 'L' | 'R'; // Only populated for MOVING
  distance?: number; // Only populated for OBSTACLE
  raw: string;
}

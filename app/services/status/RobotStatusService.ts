import { RobotStatus } from '../../models/RobotStatus';
import { ProtocolParser } from '../protocol/ProtocolParser';
import { ParsedMessage, RobotMessageType } from '../../models/RobotMessage';
import { Logger, LogCategory } from '../../utils/Logger';

const TAG = LogCategory.SYSTEM;

type StatusListener = (status: RobotStatus) => void;

class AppRobotStatusService {
  private status: RobotStatus = {
    connected: false,
    moving: false,
    direction: null,
    obstacleDetected: false,
    obstacleDistance: null,
    lastCommand: null,
    lastUpdated: Date.now()
  };

  private listeners: StatusListener[] = [];

  subscribe(listener: StatusListener): () => void {
    this.listeners.push(listener);
    // Emit immediately upon subscription
    listener(this.status);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateState(updates: Partial<RobotStatus>) {
    this.status = { ...this.status, ...updates, lastUpdated: Date.now() };
    this.notify();
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.status));
  }

  setConnectionState(connected: boolean) {
    if (this.status.connected !== connected) {
      this.updateState({ connected });
    }
  }

  handleIncomingData(rawString: string) {
    const messages = rawString.split('\n');
    for (const msg of messages) {
      if (!msg.trim()) continue;
      
      const parsed = ProtocolParser.parse(msg);
      if (!parsed) continue;

      this.processParsedMessage(parsed);
    }
  }

  private processParsedMessage(parsed: ParsedMessage) {
    switch (parsed.type) {
      case RobotMessageType.READY:
        this.updateState({ connected: true, moving: false, obstacleDetected: false });
        break;
      case RobotMessageType.STOPPED:
        this.updateState({ moving: false, direction: null });
        break;
      case RobotMessageType.MOVING:
        this.updateState({ moving: true, direction: parsed.direction });
        break;
      case RobotMessageType.OBSTACLE:
        if (parsed.distance !== undefined) {
          this.updateState({ 
            obstacleDetected: parsed.distance < 20, // Example threshold
            obstacleDistance: parsed.distance 
          });
        }
        break;
      case RobotMessageType.ERROR:
        Logger.warn(TAG, 'Robot reported an error state!');
        break;
      case RobotMessageType.UNKNOWN:
      default:
        // Ignore unknowns in state
        break;
    }
  }
}

export const RobotStatusService = new AppRobotStatusService();

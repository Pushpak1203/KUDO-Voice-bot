import { Logger, LogCategory } from '../../utils/Logger';
import { ParsedMessage, RobotMessageType } from '../../models/RobotMessage';

const TAG = LogCategory.RECEIVED;

export const ProtocolParser = {
  parse(message: string): ParsedMessage | null {
    const cleanMessage = message.trim();
    if (!cleanMessage) return null;

    Logger.info(TAG, cleanMessage);

    if (cleanMessage === 'READY') {
      return { type: RobotMessageType.READY, raw: cleanMessage };
    } 
    
    if (cleanMessage === 'STOPPED') {
      return { type: RobotMessageType.STOPPED, raw: cleanMessage };
    } 
    
    if (cleanMessage === 'PING') {
      return { type: RobotMessageType.PING, raw: cleanMessage };
    }

    if (cleanMessage === 'PONG') {
      return { type: RobotMessageType.PONG, raw: cleanMessage };
    }

    if (cleanMessage === 'HEARTBEAT') {
      return { type: RobotMessageType.HEARTBEAT, raw: cleanMessage };
    }
    
    if (cleanMessage.startsWith('MOVING:')) {
      const direction = cleanMessage.split(':')[1] as 'F' | 'B' | 'L' | 'R';
      return { type: RobotMessageType.MOVING, direction, raw: cleanMessage };
    } 
    
    if (cleanMessage.startsWith('OBSTACLE:')) {
      const distanceStr = cleanMessage.split(':')[1];
      const distance = parseInt(distanceStr, 10);
      return { type: RobotMessageType.OBSTACLE, distance: isNaN(distance) ? undefined : distance, raw: cleanMessage };
    } 
    
    if (cleanMessage === 'ERROR') {
      return { type: RobotMessageType.ERROR, raw: cleanMessage };
    }

    return { type: RobotMessageType.UNKNOWN, raw: cleanMessage };
  }
};

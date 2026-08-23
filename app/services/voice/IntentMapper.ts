import { RobotCommand } from '../../models/RobotCommand';

/**
 * Lightweight IntentMapper
 * Maps raw recognized speech strings to strictly typed RobotCommands.
 */
export class IntentMapper {
  static map(spokenText: string): RobotCommand | null {
    const text = spokenText.toLowerCase().trim();

    // Look for exact word matches or keyword containment
    if (text.includes('forward')) {
      return RobotCommand.Forward;
    }
    if (text.includes('backward') || text.includes('back')) {
      return RobotCommand.Backward;
    }
    if (text.includes('left')) {
      return RobotCommand.Left;
    }
    if (text.includes('right')) {
      return RobotCommand.Right;
    }
    if (text.includes('stop')) {
      return RobotCommand.Stop;
    }

    return null;
  }
}

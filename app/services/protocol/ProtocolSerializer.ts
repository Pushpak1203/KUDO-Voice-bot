import { RobotCommand } from '../../models/RobotCommand';

export const ProtocolSerializer = {
  serialize(command: RobotCommand): string {
    switch (command) {
      case RobotCommand.Forward: return 'F\n';
      case RobotCommand.Backward: return 'B\n';
      case RobotCommand.Left: return 'L\n';
      case RobotCommand.Right: return 'R\n';
      case RobotCommand.Stop: return 'S\n';
      default: return 'S\n';
    }
  }
};

import { RobotCommand } from '../../models/RobotCommand';
import { ProtocolSerializer } from '../protocol/ProtocolSerializer';
import { ConnectionManager } from '../connection/ConnectionManager';
import { Logger, LogCategory } from '../../utils/Logger';

const TAG = LogCategory.COMMAND;

class AppCommandService {
  private commandQueue: RobotCommand | null = null;
  private isProcessing: boolean = false;

  /**
   * Enqueues a command to be sent to the robot.
   * - A STOP command bypasses the queue and is sent immediately.
   * - Movement commands replace any pending movement command (queue size = 1).
   */
  async sendCommand(command: RobotCommand): Promise<void> {
    Logger.info(TAG, `UI Requested Command: ${command}`);

    if (command === RobotCommand.Stop) {
      // STOP overrides everything immediately
      this.commandQueue = null;
      await this.transmit(command);
      return;
    }

    // Replace stale command with the latest one
    this.commandQueue = command;

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.commandQueue !== null) {
      const commandToProcess = this.commandQueue;
      this.commandQueue = null; // Clear the queue item being processed
      
      await this.transmit(commandToProcess);
    }

    this.isProcessing = false;
  }

  private async transmit(command: RobotCommand): Promise<void> {
    const serializedData = ProtocolSerializer.serialize(command);
    Logger.debug(TAG, `Transmitting: [${serializedData.trim()}]`);
    
    const success = await ConnectionManager.write(serializedData);
    if (!success) {
      Logger.warn(TAG, `Failed to transmit command: ${command}`);
    }
  }
}

export const CommandService = new AppCommandService();

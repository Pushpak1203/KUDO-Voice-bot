export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export enum LogCategory {
  COMMAND = 'COMMAND',
  RECEIVED = 'RECEIVED',
  CONNECTION = 'CONNECTION',
  SYSTEM = 'SYSTEM',
  BLUETOOTH = 'BLUETOOTH',
  UI = 'UI'
}

export interface LogEntry {
  timestamp: string;
  sessionId: string;
  level: string;
  tag: string;
  message: string;
  args?: any[];
}

export type LogListener = (entry: LogEntry) => void;

class AppLogger {
  private currentLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.WARN;
  private readonly _sessionId: string;
  private listeners: Set<LogListener> = new Set();

  constructor() {
    this._sessionId = Math.random().toString(16).substring(2, 10).toUpperCase();
  }

  get sessionId() {
    return this._sessionId;
  }

  get level(): LogLevel {
    return this.currentLevel;
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  subscribe(listener: LogListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private dispatchLog(level: string, tag: string | LogCategory, message: string, args: any[]) {
    const timestamp = new Date().toISOString();
    
    // Console output
    const formatted = `[${timestamp}] [SESSION:${this._sessionId}] [${level}] [${tag}] ${message}`;
    if (level === 'ERROR') console.error(formatted, ...args);
    else if (level === 'WARN') console.warn(formatted, ...args);
    else if (level === 'INFO') console.info(formatted, ...args);
    else console.log(formatted, ...args);

    // Notify subscribers
    const entry: LogEntry = {
      timestamp,
      sessionId: this._sessionId,
      level,
      tag: String(tag),
      message,
      args: args.length > 0 ? args : undefined
    };
    
    this.listeners.forEach(l => {
      try { l(entry); } catch (e) { console.error("Error in log listener", e); }
    });
  }

  debug(tag: string | LogCategory, message: string, ...args: any[]) {
    if (this.currentLevel <= LogLevel.DEBUG) {
      this.dispatchLog('DEBUG', tag, message, args);
    }
  }

  info(tag: string | LogCategory, message: string, ...args: any[]) {
    if (this.currentLevel <= LogLevel.INFO) {
      this.dispatchLog('INFO', tag, message, args);
    }
  }

  warn(tag: string | LogCategory, message: string, ...args: any[]) {
    if (this.currentLevel <= LogLevel.WARN) {
      this.dispatchLog('WARN', tag, message, args);
    }
  }

  error(tag: string | LogCategory, message: string, error?: any, ...args: any[]) {
    if (this.currentLevel <= LogLevel.ERROR) {
      this.dispatchLog('ERROR', tag, message, error ? [error, ...args] : args);
    }
  }
}

export const Logger = new AppLogger();

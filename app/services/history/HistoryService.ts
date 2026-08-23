import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger, LogEntry, LogCategory } from '../../utils/Logger';

const HISTORY_STORAGE_KEY = '@panani_voicebot_history_logs';

export type HistoryListener = (logs: LogEntry[]) => void;

class AppHistoryService {
  private logs: LogEntry[] = [];
  private listeners: Set<HistoryListener> = new Set();
  private initialized = false;
  private MAX_LOGS = 1000;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load history from AsyncStorage", e);
    }
    this.initialized = true;
    this.notify();

    // Subscribe to incoming logs
    Logger.subscribe(this.handleNewLog.bind(this));
  }

  private handleNewLog(entry: LogEntry) {
    this.logs.unshift(entry); // Prepend so newest is first
    
    // Prune if too large
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    this.notify();
    this.save(); // Debounce saving in a real prod app, but fine for now
  }

  private async save() {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.error("Failed to save history to AsyncStorage", e);
    }
  }

  subscribe(listener: HistoryListener) {
    this.listeners.add(listener);
    if (this.initialized) {
      listener([...this.logs]);
    }
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    const logsCopy = [...this.logs];
    this.listeners.forEach(l => {
      try { l(logsCopy); } catch (e) { console.error("Error in history listener", e); }
    });
  }

  getLogs() {
    return [...this.logs];
  }

  async clearHistory() {
    this.logs = [];
    await this.save();
    this.notify();
  }

  exportLogs(): string {
    // Basic export placeholder returning JSON string
    return JSON.stringify(this.logs, null, 2);
  }
}

export const HistoryService = new AppHistoryService();

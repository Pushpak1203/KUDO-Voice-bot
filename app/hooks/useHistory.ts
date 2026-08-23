import { useState, useEffect } from 'react';
import { HistoryService } from '../services/history/HistoryService';
import { LogEntry } from '../utils/Logger';

export function useHistory() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    return HistoryService.subscribe(setLogs);
  }, []);

  return logs;
}

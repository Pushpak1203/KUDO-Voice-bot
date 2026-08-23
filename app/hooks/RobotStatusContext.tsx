import React, { createContext, useContext, useEffect, useState } from 'react';
import { RobotStatus } from '../models/RobotStatus';
import { RobotStatusService } from '../services/status/RobotStatusService';

const RobotStatusContext = createContext<RobotStatus | undefined>(undefined);

export const RobotStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<RobotStatus>({
    connected: false,
    moving: false,
    direction: null,
    obstacleDetected: false,
    obstacleDistance: null,
    lastCommand: null,
    lastUpdated: Date.now()
  });

  useEffect(() => {
    // Subscribe to state updates
    const unsubscribe = RobotStatusService.subscribe((newStatus: RobotStatus) => {
      setStatus({ ...newStatus });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <RobotStatusContext.Provider value={status}>
      {children}
    </RobotStatusContext.Provider>
  );
};

export const useRobotStatus = () => {
  const context = useContext(RobotStatusContext);
  if (context === undefined) {
    throw new Error('useRobotStatus must be used within a RobotStatusProvider');
  }
  return context;
};

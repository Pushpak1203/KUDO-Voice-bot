import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from '../navigation/Navigation';
import { AppNavigator } from '../navigation/AppNavigator';
import { RobotStatusProvider } from '../hooks/RobotStatusContext';

/**
 * AppProviders composes all global context providers for the application.
 * This ensures the root component remains clean and makes it easy to add
 * future providers (e.g., ThemeProvider, AuthProvider) in a structured way.
 */
export const AppProviders: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <RobotStatusProvider>
        <Navigation>
          {children || <AppNavigator />}
        </Navigation>
      </RobotStatusProvider>
    </SafeAreaProvider>
  );
};

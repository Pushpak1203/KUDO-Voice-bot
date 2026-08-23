import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

// Wrapper if we need deep linking or custom theme for navigation
export const Navigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );
};

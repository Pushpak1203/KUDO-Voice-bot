import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import BluetoothConnectionScreen from '../screens/BluetoothConnectionScreen';
import ManualControlScreen from '../screens/ManualControlScreen';
import RobotStatusScreen from '../screens/RobotStatusScreen';
import VoiceControlScreen from '../screens/VoiceControlScreen';
import CommandHistoryScreen from '../screens/CommandHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeDashboardScreen} />
      <Stack.Screen name="Bluetooth" component={BluetoothConnectionScreen} />
      <Stack.Screen name="ManualControl" component={ManualControlScreen} />
      <Stack.Screen name="RobotStatus" component={RobotStatusScreen} />
      <Stack.Screen name="VoiceControl" component={VoiceControlScreen} />
      <Stack.Screen name="CommandHistory" component={CommandHistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

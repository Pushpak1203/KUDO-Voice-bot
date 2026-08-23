import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const Bounce = ({ children, duration = 800, distance = 20, style }: any) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [duration, distance, slideAnim]);

  return <Animated.View style={[{ transform: [{ translateY: slideAnim }] }, style]}>{children}</Animated.View>;
};

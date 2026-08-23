import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const FadeIn = ({ children, duration = 800, delay = 0, style }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [duration, delay, fadeAnim]);

  return <Animated.View style={[{ opacity: fadeAnim }, style]}>{children}</Animated.View>;
};

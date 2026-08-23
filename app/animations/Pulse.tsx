import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const Pulse = ({ children, duration = 1000, maxScale = 1.05, style }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: maxScale,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [duration, maxScale, scaleAnim]);

  return <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>{children}</Animated.View>;
};

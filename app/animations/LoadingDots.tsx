import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const LoadingDots = () => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -6, duration: 400, delay, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(400),
        ])
      ).start();
    };

    animateDot(dot1Anim, 0);
    animateDot(dot2Anim, 200);
    animateDot(dot3Anim, 400);
  }, []);

  return (
    <View style={styles.dotsWrapper}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1Anim }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2Anim }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3Anim }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Animated, Easing } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';
import { radius } from '../theme/radius';
import { FadeIn } from '../animations/FadeIn';
import { Pulse } from '../animations/Pulse';
import { LoadingDots } from '../animations/LoadingDots';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Slide up animation alongside FadeIn
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Simulate Initialization / Route to Home
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Subtle Background Elements */}
      <View style={[styles.bgCircle, styles.bgCircleTopLeft]} />
      <View style={[styles.bgCircle, styles.bgCircleBottomRight]} />

      <FadeIn duration={800}>
        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
          
          {/* Logo Container */}
          <Pulse maxScale={1.05} duration={1000}>
            <View style={styles.logoContainer}>
              <Icon name="smart-toy" size={80} color={colors.primary} />
            </View>
          </Pulse>

          {/* Text */}
          <Text style={styles.title}>KUDO VoiceBot</Text>
          <Text style={styles.subtitle}>Control Your Robot With Your Voice</Text>
          
        </Animated.View>
      </FadeIn>

      {/* Loading Indicator */}
      <FadeIn duration={800} delay={600} style={styles.loadingContainer}>
        <LoadingDots />
        <Text style={styles.loadingText}>INITIALIZING</Text>
      </FadeIn>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: radius.full,
    opacity: 0.2,
  },
  bgCircleTopLeft: {
    top: '-10%',
    left: '-10%',
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: colors.primaryFixed,
  },
  bgCircleBottomRight: {
    bottom: '-10%',
    right: '-10%',
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: colors.secondaryFixed,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: '100%',
    paddingHorizontal: spacing.marginMobile,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    ...shadows.md,
  },
  title: {
    ...typography.headlineLg,
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    maxWidth: 280,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 64,
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.labelSm,
    color: colors.outline,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;

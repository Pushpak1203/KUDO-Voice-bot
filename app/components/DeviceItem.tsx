import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';

interface DeviceItemProps {
  name: string;
  status: 'Available' | 'Connecting' | 'Connected' | 'Paired';
  iconName: string;
  onPress: () => void;
}

export const DeviceItem = ({ name, status, iconName, onPress }: DeviceItemProps) => {
  const isConnecting = status === 'Connecting';
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isConnecting) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [isConnecting, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isConnecting ? styles.containerConnecting : styles.containerAvailable
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {isConnecting && <View style={styles.connectingBg} />}
      
      <View style={[styles.iconWrapper, isConnecting && styles.iconWrapperConnecting]}>
        <Icon 
          name={iconName} 
          size={24} 
          color={isConnecting ? colors.onPrimary : colors.onSurfaceVariant} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={[styles.status, isConnecting && styles.statusConnecting]}>
          {status}
        </Text>
      </View>

      <View style={styles.rightIconWrapper}>
        {isConnecting ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="sync" size={24} color={colors.primary} />
          </Animated.View>
        ) : (
          <Icon name="bluetooth" size={24} color={colors.onSurfaceVariant} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20, // matching 'card' in tailwind
    borderWidth: 1,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  containerAvailable: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.surfaceVariant,
    ...shadows.sm,
  },
  containerConnecting: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.primary,
    ...shadows.md,
  },
  connectingBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.04,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    zIndex: 10,
  },
  iconWrapperConnecting: {
    backgroundColor: colors.primaryContainer,
  },
  textContainer: {
    flex: 1,
    zIndex: 10,
  },
  name: {
    fontFamily: 'Inter-SemiBold', // mapped to title-md
    fontSize: 16,
    color: colors.onBackground,
  },
  status: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  statusConnecting: {
    color: colors.primary,
  },
  rightIconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

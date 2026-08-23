import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface PrimaryButtonProps {
  title: string;
  iconName?: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const PrimaryButton = ({ title, iconName, onPress, style, disabled }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {iconName && <Icon name={iconName} size={20} color={colors.onPrimary} style={styles.icon} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radius.xl, // mapped to btn: 16px
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  disabled: {
    backgroundColor: colors.surfaceContainerHighest,
    shadowOpacity: 0,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    ...typography.labelLg,
    color: colors.onPrimary,
  },
});

import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

interface QuickActionButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
}

export const QuickActionButton = ({ title, iconName, onPress, variant = 'default' }: QuickActionButtonProps) => {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      style={[styles.container, isDanger && styles.containerDanger]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon
        name={iconName}
        size={32}
        color={isDanger ? colors.error : colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.title, isDanger && styles.titleDanger]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    ...shadows.sm,
  },
  containerDanger: {
    backgroundColor: colors.errorContainer,
    borderColor: 'transparent',
  },
  icon: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.labelLg,
    color: colors.onSurface,
    textAlign: 'center',
  },
  titleDanger: {
    color: colors.onErrorContainer,
  },
});

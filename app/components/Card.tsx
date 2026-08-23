import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';
import { spacing } from '../theme/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'surface' | 'primary' | 'outline';
  style?: ViewStyle;
}

export const Card = ({ children, variant = 'surface', style, ...props }: CardProps) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primaryContainer,
          ...shadows.md,
        };
      case 'outline':
        return {
          backgroundColor: colors.surfaceContainerLow,
          borderWidth: 1,
          borderColor: colors.surfaceContainerHighest,
        };
      case 'surface':
      default:
        return {
          backgroundColor: colors.surfaceContainer,
          borderWidth: 1,
          borderColor: colors.surfaceContainerHighest,
          ...shadows.sm,
        };
    }
  };

  return (
    <View style={[styles.card, getVariantStyles(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    overflow: 'hidden',
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SecondaryButtonProps {
  title: string;
  iconName?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const SecondaryButton = ({ title, iconName, onPress, style }: SecondaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {iconName && <Icon name={iconName} size={20} color={colors.primary} style={styles.icon} />}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: '#d8e2ff', // matching the opacity-10 visual of primary
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    ...typography.labelLg,
    color: colors.primary,
  },
});

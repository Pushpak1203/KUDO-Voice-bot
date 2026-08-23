import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';

interface IconButtonProps {
  iconName: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
  size?: number;
}

export const IconButton = ({ iconName, onPress, style, color = colors.onSurfaceVariant, size = 24 }: IconButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48, // touch target size
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

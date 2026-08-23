import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headlineLg,
    color: '#191c1e', // on-background
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLg,
    color: '#424754', // on-surface-variant
    textAlign: 'center',
    marginTop: 8,
  },
});

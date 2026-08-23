import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  headlineLg: {
    fontFamily: 'Inter-Bold', // Assuming Inter is added to assets
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headlineMd: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  labelLg: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500',
  },
  labelSm: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
};

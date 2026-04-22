export const Colors = {
  // Primary - Eco Green
  primary: '#2E7D32', 
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  primaryGradient: ['#2E7D32', '#4CAF50'] as const,
  
  // Secondary - Sun Yellow
  secondary: '#FFB300', 
  secondaryLight: '#FFCA28',
  
  // Neutral
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceHover: '#F1F3F5',
  
  // Text
  textPrimary: '#1A1C1E',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  white: '#FFFFFF',
  black: '#000000',
  
  // Feedback
  error: '#DC3545',
  success: '#198754',
  warning: '#FFC107',
  border: '#E9ECEF',
  
  // Special
  glass: 'rgba(255, 255, 255, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  huge: 64,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 30,
  full: 999,
};

export const Shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

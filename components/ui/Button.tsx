import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Shadows } from '../../constants/Colors';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  style 
}) => {
  const isPrimary = variant === 'primary';
  
  const containerStyle = [
    styles.base,
    !isPrimary && styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    !isPrimary && Shadows.light,
    style
  ];

  const textStyle = [
    styles.textBase,
    styles[`text_${variant}`],
    styles[`textSize_${size}`]
  ];

  const content = (
    <Text style={textStyle}>{children}</Text>
  );

  return (
    <TouchableOpacity 
      style={containerStyle} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      {isPrimary ? (
        <LinearGradient
          colors={Colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, styles[`size_${size}`]]}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  
  // Variants
  secondary: {
    backgroundColor: Colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },

  // Sizes
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  size_lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },

  // Text Styles
  textBase: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  text_primary: {
    color: Colors.white,
  },
  text_secondary: {
    color: Colors.white,
  },
  text_ghost: {
    color: Colors.primary,
  },
  text_outline: {
    color: Colors.primary,
  },
  textSize_sm: { fontSize: 14 },
  textSize_md: { fontSize: 16 },
  textSize_lg: { fontSize: 18 },
});

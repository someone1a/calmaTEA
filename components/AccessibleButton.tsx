import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  AccessibilityInfo,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
}) => {
  const handlePress = async () => {
    if (disabled) return;

    // Provide haptic feedback on supported platforms
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptic feedback not available, continue without it
      }
    }

    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
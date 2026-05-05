import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle | ViewStyle[];
}

export default function AnimatedButton({ children, style, colors, onPress, ...props }: AnimatedButtonProps) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 24,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 8,
    }).start();
  };

  const buttonStyle = [styles.inner, style];

  return (
    <Animated.View style={[{ transform: [{ scale }], width: '100%', marginBottom: 16 }]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.shadowWrapper}
        {...props}
      >
        {colors ? (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={buttonStyle}
          >
            {children}
          </LinearGradient>
        ) : (
          <Animated.View style={buttonStyle}>
            {children}
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    borderRadius: 16, // Matches the inner border radius
  },
  inner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 16,
  },
});

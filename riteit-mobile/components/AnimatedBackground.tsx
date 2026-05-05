import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

  const NativeBlob = ({ color1, color2, initialX, initialY, size, duration }: any) => {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(initialX + 250, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(initialY - 250, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: duration * 0.6, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: duration * 0.6, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.blob, { width: size, height: size * 0.8, borderRadius: size * 0.35 }, animatedStyle]}>
      <LinearGradient colors={[color1, color2]} style={styles.gradient} />
    </Animated.View>
  );
};

const WebBlob = ({ color1, color2, initialX, initialY, size, duration }: any) => {
  return (
    <View style={[styles.blob, { 
      width: size, 
      height: size * 0.8, 
      borderRadius: size * 0.35,
      left: initialX,
      top: initialY,
      animation: `float-blob ${duration}ms infinite alternate ease-in-out`
    } as any]}>
      <LinearGradient colors={[color1, color2]} style={styles.gradient} />
    </View>
  );
};

const Blob = Platform.OS === 'web' ? WebBlob : NativeBlob;

export default function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <style>{`
          @keyframes float-blob {
            0% { transform: translate(0px, 0px) scale(0.8); }
            50% { transform: translate(150px, -150px) scale(1.3); }
            100% { transform: translate(250px, -250px) scale(0.7); }
          }
        `}</style>
      )}
      {/* Background color */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F8FAFC' }]} />

      {/* Multiple Smaller Theme Blobs (No Green/Yellow) */}
      <Blob color1="#8B5CF6" color2="#C4B5FD" initialX={width * 0.1} initialY={height * 0.2} size={width * 0.6} duration={6000} />
      <Blob color1="#6366F1" color2="#A5B4FC" initialX={width * 0.5} initialY={height * 0.1} size={width * 0.5} duration={7000} />
      <Blob color1="#D946EF" color2="#F0ABFC" initialX={width * 0.3} initialY={height * 0.6} size={width * 0.45} duration={7500} />

      {/* Glass Pane Blur */}
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFillObject, { backdropFilter: 'blur(40px)', backgroundColor: 'rgba(255,255,255,0.1)', WebkitBackdropFilter: 'blur(40px)' } as any]} />
      ) : (
        <BlurView intensity={40} style={StyleSheet.absoluteFillObject} tint="light" />
      )}

      {/* Content */}
      <View style={StyleSheet.absoluteFillObject}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    opacity: 0.6,
  },
  gradient: {
    flex: 1,
    borderRadius: 9999,
  },
});

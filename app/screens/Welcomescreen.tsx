import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onComplete?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const insets = useSafeAreaInsets();

  // Handle completion after loading
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000); // Simulate loading for 3 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background elements with proper zIndex */}
      <View style={styles.backgroundContainer}>
        {/* Top Molecular Icon */}
        <View style={[styles.topMolecule, { top: height * 0.08 }]}>
          <Svg width="60" height="60" viewBox="0 0 60 60">
            <Circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.6)" />
            <Circle cx="15" cy="20" r="3" fill="rgba(255,255,255,0.4)" />
            <Circle cx="45" cy="15" r="3" fill="rgba(255,255,255,0.4)" />
            <Circle cx="40" cy="45" r="3" fill="rgba(255,255,255,0.4)" />
            <Circle cx="18" cy="40" r="3" fill="rgba(255,255,255,0.4)" />
            <Line x1="30" y1="30" x2="15" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <Line x1="30" y1="30" x2="45" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <Line x1="30" y1="30" x2="40" y2="45" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <Line x1="30" y1="30" x2="18" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          </Svg>
        </View>

        {/* Curved Line Top Right */}
        <View style={[styles.topCurve, { top: height * 0.12 }]}>
          <Svg width="150" height="200" viewBox="0 0 150 200">
            <Path
              d="M 0 50 Q 50 20 100 60 T 150 100"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,10"
            />
          </Svg>
        </View>

        {/* Bottom Molecular Icon */}
        <View style={[styles.bottomMolecule, { bottom: height * 0.12 }]}>
          <Svg width="50" height="50" viewBox="0 0 50 50">
            <Circle cx="25" cy="25" r="3" fill="rgba(255,255,255,0.5)" />
            <Circle cx="15" cy="25" r="2.5" fill="rgba(255,255,255,0.4)" />
            <Circle cx="35" cy="25" r="2.5" fill="rgba(255,255,255,0.4)" />
            <Circle cx="25" cy="15" r="2.5" fill="rgba(255,255,255,0.4)" />
            <Circle cx="25" cy="35" r="2.5" fill="rgba(255,255,255,0.4)" />
            <Circle cx="10" cy="15" r="2" fill="rgba(255,255,255,0.3)" />
            <Circle cx="40" cy="35" r="2" fill="rgba(255,255,255,0.3)" />
            <Line x1="25" y1="25" x2="15" y2="25" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <Line x1="25" y1="25" x2="35" y2="25" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <Line x1="25" y1="25" x2="25" y2="15" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <Line x1="25" y1="25" x2="25" y2="35" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <Line x1="15" y1="25" x2="10" y2="15" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <Line x1="35" y1="25" x2="40" y2="35" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </Svg>
        </View>

        {/* Curved Line Bottom Left */}
        <View style={[styles.bottomCurve, { bottom: height * 0.08 }]}>
          <Svg width="200" height="150" viewBox="0 0 200 150">
            <Path
              d="M 20 100 Q 80 50 140 80 Q 180 90 200 120"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3,8"
            />
          </Svg>
        </View>
      </View>

      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          {/* BES Logo */}
          <Image 
            source={require('../../assets/images/BES.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          {/* Title */}
          <Text style={styles.title}>BES Pilot</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Welcome to the future of business efficiency
          </Text>
        </View>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          {([styles.loadingDot1, styles.loadingDot2, styles.loadingDot3] as const).map((dotStyle, idx) => (
            <View 
              key={idx}
              style={[styles.loadingDot, dotStyle]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  topMolecule: {
    position: 'absolute',
    right: width * 0.12,
  },
  topCurve: {
    position: 'absolute',
    right: -20,
  },
  bottomMolecule: {
    position: 'absolute',
    left: width * 0.08,
  },
  bottomCurve: {
    position: 'absolute',
    left: -30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: Math.min(width * 0.9, 320),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loadingDot: {
    width: 12,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  loadingDot1: {
    opacity: 0.6,
  },
  loadingDot2: {
    opacity: 0.4,
  },
  loadingDot3: {
    opacity: 0.2,
  },
});

export default WelcomeScreen;
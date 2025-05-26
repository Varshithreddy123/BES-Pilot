import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WelcomeScreen from '../screens/Welcomescreen';

export default function TabLayout() {
  const [showWelcome, setShowWelcome] = useState(true);
  const insets = useSafeAreaInsets();

  const tabBarHeight = Platform.select({
    ios: 80,
    android: 70,
  });
  
  const tabBarBottom = Platform.select({
    ios: Math.max(insets.bottom, 16),
    android: 28,
  });

  // Auto-hide welcome screen after 3 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // Show welcome screen first
  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // Show main tab navigation after welcome
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.select({ ios: 0, android: 4 }),
        },
        tabBarItemStyle: {
          height: Platform.select({ ios: 60, android: 50 }),
        },
        tabBarStyle: {
          ...styles.tabBar,
          height: tabBarHeight,
          paddingBottom: Platform.select({
            ios: Math.max(insets.bottom, 16),
            android: 8,
          }),
          paddingTop: 8,
          position: 'absolute',
          bottom: tabBarBottom,
          left: Platform.select({ ios: 16, android: 0 }),
          right: Platform.select({ ios: 16, android: 0 }),
          borderRadius: Platform.select({ ios: 16, android: 0 }),
          borderTopWidth: Platform.select({ ios: 0, android: StyleSheet.hairlineWidth }),
          borderTopColor: '#ddd',
          marginHorizontal: 0,
        },
        headerShown: false,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            Platform.select({
              ios: <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />,
              android: <MaterialIcons name={focused ? 'home' : 'home'} size={28} color={color} />,
            })
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/request.png')}
              style={{ 
                width: 24, 
                height: 24, 
                tintColor: color,
                opacity: focused ? 1 : 0.7 
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reward"
        options={{
          title: 'Reward',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="card-giftcard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mitra"
        options={{
          title: 'Mitra',
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../../assets/images/mitra.png')}
              style={{ 
                width: 30, 
                height: 30, 
                tintColor: color,
                opacity: focused ? 1:0.75
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            Platform.select({
              ios: <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />,
              android: <Ionicons name={focused ? 'settings' : 'settings-outline'} size={28} color={color} />,
            })
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.select({
      ios: 'rgba(255,255,255,0.95)',
      android: 'white',
    }),
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: Platform.select({ ios: 16, android: 0 }),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -3 },
      },
      android: {
        elevation: 2,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      },
    }),
  },
});
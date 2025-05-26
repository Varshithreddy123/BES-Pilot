import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const Settings: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = (): void => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback navigation to home
      router.push('/');
    }
  };

  const handleMenuPress = (menuItem: string): void => {
    switch (menuItem) {
      case 'Profile':
        router.push('/screens/profile');
        break;
      case 'About':
        router.push('/screens/about');
        break;
      case 'Privacy Policy':
        router.push('/screens/privacy-policy');
        break;
      case 'Terms and conditions':
        router.push('/screens/terms-conditions');
        break;
      default:
        console.log(`Unknown menu item: ${menuItem}`);
        break;
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person-outline',
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-outline',
    },
    {
      id: 'terms',
      title: 'Terms and conditions',
      icon: 'document-text-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f8f9fa"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#000"
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Settings</Text>
        
        {/* Empty view for spacing balance */}
        <View style={styles.headerRight} />
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem
            ]}
            onPress={() => handleMenuPress(item.title)}
            activeOpacity={0.7}
          >
            <View style={styles.menuContent}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color="#666"
                />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    width: 40, // Balance the header
  },
  menuContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    marginHorizontal: 0,
    borderRadius: Platform.OS === 'ios' ? 12 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    minHeight: 56,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
});

export default Settings;
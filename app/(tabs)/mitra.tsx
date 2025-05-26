import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
  ImageSourcePropType,
  Dimensions,
  ScrollView,
  StatusBar,
  BackHandler,
} from 'react-native';
// For React Navigation v6
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375; // iPhone SE and similar small devices

interface ReferralConfirmationProps {
  onBackPress?: () => void;
  logoSource?: ImageSourcePropType;
  fallbackScreen?: string; // Screen name to navigate to if no other option
}

const ReferralConfirmation: React.FC<ReferralConfirmationProps> = ({
  onBackPress,
  logoSource = require('../../assets/images/mitra.png'),
  fallbackScreen = 'Home', // Default fallback screen
}) => {
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get navigation object from React Navigation hook
  const navigation = useNavigation();

  // Cross-platform back button handler
  const handleBackPress = () => {
    try {
      // Priority order for navigation:
      // 1. Custom onBackPress prop
      // 2. React Navigation goBack (if can go back)
      // 3. Navigate to fallback screen
      // 4. Reset to fallback screen (last resort)
      
      if (onBackPress && typeof onBackPress === 'function') {
        onBackPress();
        return true; // Prevent default back behavior
      }
      
      // Check if we can go back in the navigation stack
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      
      // If we can't go back, navigate to fallback screen
      if (navigation && fallbackScreen) {
        navigation.navigate(fallbackScreen as never);
        return true;
      }
      
      // Last resort: reset navigation stack to fallback screen
      if (navigation && fallbackScreen) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: fallbackScreen as never }],
          })
        );
        return true;
      }
      
      // If all else fails, let the system handle it
      return false;
    } catch (error) {
      console.warn('Back navigation error:', error);
      
      // Fallback error handling - try to navigate to a safe screen
      try {
        if (navigation && fallbackScreen) {
          navigation.navigate(fallbackScreen as never);
          return true;
        }
      } catch (fallbackError) {
        console.warn('Fallback navigation also failed:', fallbackError);
      }
      
      return false;
    }
  };

  // Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {
      // If QR popup is open, close it first
      if (showQRPopup) {
        setShowQRPopup(false);
        return true; // Prevent default back behavior
      }
      
      // Otherwise handle normal back navigation
      return handleBackPress();
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [showQRPopup, onBackPress, fallbackScreen]);

  // Responsive font size calculator
  const responsiveFontSize = (baseSize: number) => {
    const scaleFactor = isSmallDevice ? 0.9 : 1;
    return Math.round(baseSize * scaleFactor * (width / 375)); // 375 is base iPhone width
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Set StatusBar properties for better control, especially on Android */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent" // Make status bar background transparent
        translucent={true} // Allow content to draw under the status bar
      />

      {/* Header */}
      <View style={styles.header}>
        {/* Left side: Back Arrow */}
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            activeOpacity={0.7} // Better visual feedback
            accessible={true}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons
              name="chevron-back"
              size={responsiveFontSize(28)}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.headerTitle, { fontSize: responsiveFontSize(18) }]}>
          BES Mitra
        </Text>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setShowQRPopup(true)}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Open QR code scanner"
          accessibilityRole="button"
        >
          <Ionicons
            name="qr-code"
            size={responsiveFontSize(24)}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Centered Logo with proper aspect ratio */}
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}
            style={[
              styles.logo,
              {
                width: width * 0.7,
                height: width * 0.7 * 0.3, // Maintain aspect ratio (assuming logo is roughly 3.3:1)
              }
            ]}
            resizeMode="contain"
            onError={() => Alert.alert('Error', 'Failed to load logo')}
          />
        </View>

        {/* Main Content Card */}
        <View style={[
          styles.card,
          {
            marginHorizontal: width * 0.05,
            padding: width * 0.05,
          }
        ]}>
          <Text style={[styles.title, { fontSize: responsiveFontSize(22) }]}>
            Order Confirmation
          </Text>

          <View style={styles.nameContainer}>
            <Text style={[styles.namePart, { fontSize: responsiveFontSize(20) }]}>
              BES
            </Text>
            <Text style={[styles.namePart, { fontSize: responsiveFontSize(20) }]}>
              Mitra
            </Text>
          </View>

          <Text style={[styles.message, { fontSize: responsiveFontSize(16) }]}>
            We have received your order. Our team will contact you shortly!
          </Text>
        </View>
      </ScrollView>

      {/* QR Popup Modal - Responsive */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRPopup}
        onRequestClose={() => setShowQRPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            {
              width: width * 0.9,
              maxWidth: 400,
              padding: width * 0.05,
            }
          ]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRPopup(false)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel="Close QR scanner"
              accessibilityRole="button"
            >
              <Ionicons
                name="close"
                size={responsiveFontSize(24)}
                color="#666"
              />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { fontSize: responsiveFontSize(18) }]}>
              Get the QR code from your Drone Service Provider
            </Text>

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="black"
                style={styles.loader}
              />
            ) : (
              <View style={styles.qrOptions}>
                <TouchableOpacity
                  style={[
                    styles.qrOptionButton,
                    { padding: width * 0.04 }
                  ]}
                  onPress={() => {
                    setIsLoading(true);
                    // Handle upload
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                  disabled={isLoading}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel="Upload QR code from device"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="folder-open"
                    size={responsiveFontSize(32)}
                    color="black"
                  />
                  <Text style={[
                    styles.qrOptionText,
                    { fontSize: responsiveFontSize(14) }
                  ]}>
                    Upload From Device
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.qrOptionButton,
                    { padding: width * 0.04 }
                  ]}
                  onPress={() => {
                    setIsLoading(true);
                    // Handle camera
                    setTimeout(() => setIsLoading(false), 1500);
                  }}
                  disabled={isLoading}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel="Scan QR code with camera"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="camera"
                    size={responsiveFontSize(32)}
                    color="black"
                  />
                  <Text style={[
                    styles.qrOptionText,
                    { fontSize: responsiveFontSize(14) }
                  ]}>
                    Camera QR
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    minWidth: 40, // Ensure consistent spacing
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8, // Increased padding for better touch area
    borderRadius: 20, // Rounded touch area
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '600',
    color: '#333',
    flex: 1, // Take remaining space
    textAlign: 'center',
  },
  qrButton: {
    padding: 8, // Increased padding for consistency
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40, // Ensure consistent spacing
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.03,
  },
  logo: {
    // Dimensions set dynamically in component
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  nameContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  namePart: {
    fontWeight: '600',
    color: '#333',
    lineHeight: 28,
  },
  message: {
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8, // Increased padding
    borderRadius: 20,
  },
  modalTitle: {
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  qrOptionButton: {
    alignItems: 'center',
    borderRadius: 8,
  },
  qrOptionText: {
    marginTop: 8,
    color: '#333',
    fontWeight: '500',
  },
  loader: {
    marginVertical: 24,
  },
});

export default ReferralConfirmation;
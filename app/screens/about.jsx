import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
  const navigation = useNavigation();
  
  const handleOkPress = () => {
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: 'About',
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: Platform.OS === 'ios' ? 17 : 20,
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons 
                name={Platform.OS === 'ios' ? 'chevron-back' : 'chevron-back-outline'} 
                size={24} 
                color="black" 
                />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Image
                  source={require('../../assets/images/BES.png')}
                  style={styles.logo}
                  accessibilityLabel="BluhMeet App Logo"
                />
              </View>
              <Text style={styles.appName}>BES</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <InfoRow label="App" value="BES" />
              <InfoRow label="Version" value="49" />
              <InfoRow label="Build Number" value="74.128.2025022102" />
              <InfoRow label="Date" value="21 Feb 2025" />
              <InfoRow label="Copyright" value="PGRL" isLast />
            </View>
            
            <TouchableOpacity 
              style={styles.okButton} 
              onPress={handleOkPress}
              activeOpacity={0.7}
              accessibilityLabel="OK button"
              accessibilityHint="Returns to previous screen"
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, isLast = false }) => (
  <View style={[styles.infoRow, isLast && styles.lastInfoRow]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    marginLeft: Platform.OS === 'ios' ? 8 : 0,
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBackground: {
    backgroundColor: 'WHITE',
    borderRadius: 100,
    padding: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : undefined,
  },
  okButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0066cc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
});

export default AboutScreen;
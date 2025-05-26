import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileData {
  name: string;
  occupation: string;
  phone: string;
  dateOfBirth: string;
}

interface ProfileFieldProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isEditing: boolean;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  placeholder?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon,
  label,
  value,
  isEditing,
  onChangeText,
  keyboardType = 'default',
  placeholder
}) => (
  <View style={styles.profileField}>
    <View style={styles.fieldIcon}>
      <Ionicons name={icon} size={20} color="#666" />
    </View>
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          placeholderTextColor="#999"
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not specified'}</Text>
      )}
    </View>
  </View>
);

const PROFILE_STORAGE_KEY = 'userProfile';

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Shami Kumar',
    occupation: 'Software Developer',
    phone: '8210368501',
    dateOfBirth: '15/03/1995'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>({...profile});
  const [isLoading, setIsLoading] = useState(true);

  // Load profile data from storage when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
          setTempProfile(parsedProfile);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEdit = (): void => {
    setTempProfile({...profile});
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  const handleSave = async (): Promise<void> => {
    if (!tempProfile.name.trim()) {
      Alert.alert("Validation Error", "Name is required");
      return;
    }
    
    try {
      // Save to AsyncStorage first
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(tempProfile));
      
      // Then update state
      setProfile({...tempProfile});
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error('Failed to save profile', error);
      Alert.alert("Error", "Failed to save profile");
    }
  };

  const handleFieldChange = (field: keyof ProfileData, value: string): void => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = (): void => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => {
          // Handle logout logic here
          console.log("User logged out");
        }}
      ]
    );
  };

  const handleDeleteAccount = async (): Promise<void> => {
    Alert.alert(
      "Delete Account", 
      "This action cannot be undone. Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
              // Reset to default values
              const defaultProfile = {
                name: 'Shami Kumar',
                occupation: 'Software Developer',
                phone: '8210368501',
                dateOfBirth: '15/03/1995'
              };
              setProfile(defaultProfile);
              setTempProfile(defaultProfile);
              Alert.alert("Success", "Account data has been deleted");
            } catch (error) {
              console.error('Failed to delete account', error);
              Alert.alert("Error", "Failed to delete account data");
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Stack.Screen
        options={{
          title: 'Profile',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color="#000" 
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={isEditing ? handleSave : handleEdit}
              style={styles.headerButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          ),
          headerTitleStyle: {
            color: '#000',
            fontWeight: '600',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            <ProfileField
              icon="person-outline"
              label="Name"
              value={isEditing ? tempProfile.name : profile.name}
              isEditing={isEditing}
              onChangeText={(text) => handleFieldChange('name', text)}
              placeholder="Enter your name"
            />

            <ProfileField
              icon="briefcase-outline"
              label="Occupation"
              value={isEditing ? tempProfile.occupation : profile.occupation}
              isEditing={isEditing}
              onChangeText={(text) => handleFieldChange('occupation', text)}
              placeholder="Enter your occupation"
            />

            <ProfileField
              icon="call-outline"
              label="Phone Number"
              value={isEditing ? tempProfile.phone : profile.phone}
              isEditing={isEditing}
              onChangeText={(text) => handleFieldChange('phone', text)}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
            />

            <ProfileField
              icon="calendar-outline"
              label="Date of Birth"
              value={isEditing ? tempProfile.dateOfBirth : profile.dateOfBirth}
              isEditing={isEditing}
              onChangeText={(text) => handleFieldChange('dateOfBirth', text)}
              placeholder="DD/MM/YYYY"
            />
          </View>

          {/* Action Buttons Section */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.fieldIcon}>
                <Ionicons name="power-outline" size={20} color="#666" />
              </View>
              <Text style={styles.actionButtonText}>Logout My Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.fieldIcon}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </View>
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button (only visible when editing) */}
          {isEditing && (
            <View style={styles.cancelSection}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  profileField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    minHeight: 60,
  },
  fieldIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  fieldInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    fontWeight: '400',
  },
  actionSection: {
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    minHeight: 60,
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  deleteButtonText: {
    color: '#ff4444',
  },
  cancelSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ProfileScreen;
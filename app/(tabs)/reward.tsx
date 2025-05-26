import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions, // Import Dimensions for responsive sizing
  // Image, // Uncomment if you plan to use actual images, otherwise can remove
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// If you have a specific navigation stack type, you might import it like this:
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import the responsiveFontSize utility
// IMPORTANT: Ensure this file exists at '../utils/responsiveFontSize.js'
// or adjust the path if your 'utils' folder is located elsewhere relative to this file.
import { responsiveFontSize } from '../utils/responsiveFontSize';

// Get screen width and height once outside the component for performance
const { width: screenWidth, height } = Dimensions.get('window');

// Define types for your navigation if you're using TypeScript with React Navigation
// type RootStackParamList = {
//   Home: undefined;
//   Rewards: undefined;
//   // Add other screen names here
// };
// type RewardsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Rewards'>;

export default function RewardsScreen(): JSX.Element { // Explicitly typing the component as JSX.Element
  // const navigation = useNavigation<RewardsScreenNavigationProp>(); // Use this if you defined navigation types
  const navigation = useNavigation(); // Simpler usage if types are not strictly defined for navigation prop

  const handleBackPress = () => {
    navigation.goBack();
  };

  interface RewardItem { // Define interface for reward items
    id: number;
    name: string;
    image: string; // Emoji string
    points: number;
    category: string;
    // If using image assets, you might add: imageAsset: ImageSourcePropType;
  }

  const rewardItems: RewardItem[] = [ // Explicitly type the array
    {
      id: 1,
      name: 'Black Cap',
      image: '🧢', // Using emoji as image
      points: 250,
      category: 'Fashion',
    },
    {
      id: 2,
      name: 'Umbrella',
      image: '☂️',
      points: 180,
      category: 'Accessories',
    },
    {
      id: 3,
      name: 'Thermos',
      image: '🥤',
      points: 300,
      category: 'Lifestyle',
    },
    {
      id: 4,
      name: 'Sunglasses',
      image: '🕶️',
      points: 220,
      category: 'Fashion',
    },
  ];
  
  const scale = (size: number) => width / 375 * size;
const verticalScale = (size: number) => height / 812 * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header - Designed for responsive alignment */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          {/* Apply responsive font size to icon */}
          <Ionicons name="chevron-back" size={responsiveFontSize(28)} color="#333" />
        </TouchableOpacity>

        {/* Container for the title to ensure it's centered independently */}
        <View style={styles.headerTitleContainer}>
          {/* Apply responsive font size to header title */}
          <Text style={styles.headerTitle}>Rewards</Text>
        </View>

        <TouchableOpacity style={styles.ordersButton}>
          {/* Apply responsive font size to button text */}
          <Text style={styles.ordersText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content area - flex:1 ensures it takes remaining vertical space */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            {/* Apply responsive font size to icon */}
            <Ionicons name="gift" size={responsiveFontSize(24)} color="#007AFF" />
            {/* Apply responsive font size to label */}
            <Text style={styles.pointsLabel}>Your total earned points</Text>
          </View>
          {/* Apply responsive font size to points value */}
          <Text style={styles.pointsValue}>410</Text>
        </View>

        {/* Catalog Section */}
        <View style={styles.catalogSection}>
          {/* Apply responsive font size to catalog title */}
          <Text style={styles.catalogTitle}>Catalog</Text>

          {/* Catalog Grid - flexWrap and percentage width for responsive columns */}
          <View style={styles.catalogGrid}>
            {rewardItems.map((item: RewardItem) => ( // Explicitly type item in map
              <View key={item.id} style={styles.catalogItem}>
                <View style={styles.itemImageContainer}>
                  {/* Apply responsive font size for emoji */}
                  <Text style={styles.itemImage}>{item.image}</Text>
                  {/* If you were using the Image component with local assets:
                  <Image source={item.imageAsset} style={styles.itemImage} resizeMode="contain" />
                  Make sure to update your rewardItems array with imageAsset paths.
                  */}
                  <View style={styles.pointsBadge}>
                    {/* Apply responsive font size to badge text */}
                    <Text style={styles.pointsBadgeText}>{item.points}</Text>
                  </View>
                </View>
                <View style={styles.itemInfo}>
                  {/* Apply responsive font size to item name */}
                  <Text style={styles.itemName}>{item.name}</Text>
                  <TouchableOpacity style={styles.redeemButton}>
                    {/* Apply responsive font size to button text */}
                    <Text style={styles.redeemButtonText}>Redeem Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Coming Soon Banner */}
        <View style={styles.comingSoonBanner}>
          {/* Apply responsive font size to icon */}
          <Ionicons name="time" size={responsiveFontSize(16)} color="#FF9500" />
          {/* Apply responsive font size to banner text */}
          <Text style={styles.comingSoonText}>More exciting offers are coming soon!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen height
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed justifyContent: 'space-between' to allow headerTitleContainer to center the title
    paddingHorizontal: screenWidth * 0.05, // Responsive horizontal padding (5% of screen width)
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 13,
    marginRight: 15, // Small margin to separate from the title
  },
  headerTitleContainer: {
    flex: 1, // Allows this container to take up available space
    alignItems: 'center', // Centers the text horizontally within its flex:1 space
  },
  headerTitle: {
    fontSize: responsiveFontSize(18), // Responsive font size
    fontWeight: '600',
    color: '#333',
  },
  ordersButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10, // Small margin to separate from the title
  },
  ordersText: {
    fontSize: responsiveFontSize(14), // Responsive font size
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1, // Allows content to scroll and take remaining vertical space
    paddingHorizontal: screenWidth * 0.05, // Responsive horizontal padding
  },
  pointsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsLabel: {
    fontSize: responsiveFontSize(14), // Responsive font size
    color: '#666',
    marginLeft: 8,
  },
  pointsValue: {
    fontSize: responsiveFontSize(36), // Responsive font size
    fontWeight: '700',
    color: '#333',
  },
  catalogSection: {
    marginBottom: 30,
  },
  catalogTitle: {
    fontSize: responsiveFontSize(20), // Responsive font size
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catalogItem: {
    width: '48%', // Keep percentage for flexible grid item width
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  itemImageContainer: {
    position: 'relative',
    height: screenWidth * 0.3, // Make height responsive based on screen width
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    fontSize: responsiveFontSize(40), // Responsive font size for emoji
  },
  pointsBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pointsBadgeText: {
    color: '#fff',
    fontSize: responsiveFontSize(12), // Responsive font size
    fontWeight: '600',
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: responsiveFontSize(14), // Responsive font size
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  redeemButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(12), // Responsive font size
    fontWeight: '600',
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  comingSoonText: {
    fontSize: responsiveFontSize(14), // Responsive font size
    color: '#FF9500',
    fontWeight: '500',
    marginLeft: 8,
  },
});
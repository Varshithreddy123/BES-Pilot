import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from '../screens/Welcomescreen';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => width / 375 * size;
const verticalScale = (size: number) => height / 812 * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dayStartTime, setDayStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    setDayStartTime(new Date());

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return { time: '--', period: '' };
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return {
      time: `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      period: ampm
    };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formattedCurrentTime = formatTime(currentTime);
  const formattedDayStartTime = formatTime(dayStartTime);
  const formattedDate = formatDate(currentTime);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Shami Kumar</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Working</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.bellIcon}>
          <Ionicons name="notifications-outline" size={scale(24)} color="#666" />
        </TouchableOpacity>
      </View>

      {/* End Day Button */}
      <TouchableOpacity style={styles.endDayButton}>
        <Text style={styles.endDayText}>End Day</Text>
      </TouchableOpacity>

      {/* Today Card */}
      <View style={styles.todayCard}>
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>Today</Text>
          <Text style={styles.todayDate}>{formattedDate}</Text>
        </View>
        
        <View style={styles.timeSection}>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Day Start</Text>
            <View style={styles.timeRow}>
              <Text style={styles.timeValue}>
                {formattedDayStartTime.time}
              </Text>
              <Text style={styles.timeUnit}>
                {formattedDayStartTime.period}
              </Text>
              <View style={styles.timeIcon}>
                <Text style={styles.timeIconText}>⏰</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Day End</Text>
            <Text style={styles.dashText}>--</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📋</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Request Completed</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>🚗</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Average Served</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>💰</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Amount</Text>
              <Text style={styles.statValue}>--</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Reward Points Card */}
      <View style={styles.rewardCard}>
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardTitle}>Reward Points</Text>
          <Text style={styles.rewardSubtitle}>(Till Today)</Text>
        </View>
        
        <View style={styles.rewardContent}>
          <View style={styles.rewardLeft}>
            <Text style={styles.rewardIcon}>🏆</Text>
            <Text style={styles.rewardPoints}>700</Text>
          </View>
          
          <View style={styles.rewardRight}>
            <Text style={styles.rewardMessage}>You have not order anything yet.</Text>
            <TouchableOpacity style={styles.visitButton}>
              <Text style={styles.visitButtonText}>Visit Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  // You can add logic here to control when to hide the welcome screen
  // For example, after a timer, user interaction, or checking if it's first launch
  useEffect(() => {
    // Auto-navigate to home screen after 3 seconds (optional)
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return <HomeScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(20),
    marginBottom: verticalScale(15),
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: scale(3.84),
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: scale(12),
  },
  avatar: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: scale(20),
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(4),
  },
  statusBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  bellIcon: {
    padding: scale(8),
  },
  endDayButton: {
    backgroundColor: '#333',
    marginHorizontal: moderateScale(20),
    paddingVertical: verticalScale(15),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  endDayText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  todayCard: {
    backgroundColor: '#2196f3',
    marginHorizontal: moderateScale(20),
    borderRadius: scale(16),
    padding: scale(20),
    marginBottom: verticalScale(15),
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  todayTitle: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  todayDate: {
    color: '#fff',
    fontSize: moderateScale(14),
    opacity: 0.9,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(25),
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    color: '#fff',
    fontSize: moderateScale(12),
    opacity: 0.8,
    marginBottom: verticalScale(8),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    color: '#fff',
    fontSize: moderateScale(24),
    fontWeight: '700',
    marginRight: scale(4),
  },
  timeUnit: {
    color: '#fff',
    fontSize: moderateScale(14),
    marginRight: scale(10),
  },
  timeIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeIconText: {
    fontSize: moderateScale(14),
  },
  dashText: {
    color: '#fff',
    fontSize: moderateScale(24),
    fontWeight: '700',
  },
  statsSection: {
    gap: verticalScale(15),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(17.5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  statIconText: {
    fontSize: moderateScale(16),
  },
  statInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: moderateScale(14),
    opacity: 0.9,
  },
  statValue: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  rewardCard: {
    backgroundColor: '#fff9c4',
    marginHorizontal: moderateScale(20),
    borderRadius: scale(16),
    padding: scale(20),
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  rewardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginRight: scale(8),
  },
  rewardSubtitle: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: moderateScale(24),
    marginRight: scale(12),
  },
  rewardPoints: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: '#333',
  },
  rewardRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rewardMessage: {
    fontSize: moderateScale(12),
    color: '#666',
    marginBottom: verticalScale(8),
    textAlign: 'right',
  },
  visitButton: {
    backgroundColor: '#ff5722',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
  },
  visitButtonText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
});

export default App;
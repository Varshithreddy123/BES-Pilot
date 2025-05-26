import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  StatusBar,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  Alert,
  Modal,
  Button // Added for date picker placeholder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: screenWidth } = Dimensions.get('window');

type RootStackParamList = {
  Home: undefined;
  Requests: undefined;
  AddRequest: undefined;
};

type FilterType = 'All' | 'Today' | 'Pending';
type RequestStatus = 'Cancelled' | 'Pending' | 'Approved';

interface RequestItem {
  id: string;
  name: string;
  date: string; // e.g., "6 Mar 2025"
  reqNo: string;
  location: string;
  acreage: string;
  status: RequestStatus;
  crop?: string;
  agrochemical?: string;
  scheduledDate?: string; // e.g., "6 Mar 2025"
  totalAmount?: string;
}

interface AppliedFilters {
  status: RequestStatus[] | null;
  startDate: string | null;
  endDate: string | null;
}

const RequestPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All'); // For top tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [editingRequest, setEditingRequest] = useState<RequestItem | null>(null);

  // State for the new filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilterStatus, setTempFilterStatus] = useState<RequestStatus[] | null>(null);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    status: null,
    startDate: null,
    endDate: null,
  });


  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: '1',
      name: 'Bhausaheb Pacharne',
      date: '6 Mar 2025',
      reqNo: '#1814790665',
      location: 'Rui, Maharashtra 416116, India',
      acreage: '2.00 Acre',
      status: 'Cancelled',
      crop: 'Wheat',
      agrochemical: 'Herbicides',
      scheduledDate: '6 Mar 2025',
      totalAmount: '₹ 1200.00'
    },
    {
      id: '2',
      name: 'Dondas Namder Koblujar',
      date: '12 Mar 2025',
      reqNo: '#930477213',
      location: 'Nayagoon, Maharasima 422102, India',
      acreage: '3.00 Acre',
      status: 'Pending',
      crop: 'Corn',
      agrochemical: 'Pesticides',
      scheduledDate: '12 Mar 2025',
      totalAmount: '₹ 1650.00'
    },
    {
      id: '3',
      name: 'Radha Sharma',
      date: '24 May 2025', // Today's date (example for filter)
      reqNo: '#123456789',
      location: 'Pune, Maharashtra, India',
      acreage: '1.50 Acre',
      status: 'Pending',
      crop: 'Soybean',
      agrochemical: 'Fungicides',
      scheduledDate: '24 May 2025',
      totalAmount: '₹ 900.00'
    },
    {
      id: '4',
      name: 'Amit Kumar',
      date: '20 May 2025',
      reqNo: '#987654321',
      location: 'Nashik, Maharashtra, India',
      acreage: '5.00 Acre',
      status: 'Approved',
      crop: 'Cotton',
      agrochemical: 'Insecticides',
      scheduledDate: '20 May 2025',
      totalAmount: '₹ 2500.00'
    },
     {
      id: '5',
      name: 'Priya Singh',
      date: '15 Apr 2025',
      reqNo: '#112233445',
      location: 'Mumbai, Maharashtra, India',
      acreage: '1.00 Acre',
      status: 'Approved',
      crop: 'Rice',
      agrochemical: 'Fertilizers',
      scheduledDate: '15 Apr 2025',
      totalAmount: '₹ 750.00'
    },
    {
      id: '6',
      name: 'Rajesh Patil',
      date: '10 Feb 2025',
      reqNo: '#556677889',
      location: 'Nagpur, Maharashtra, India',
      acreage: '4.00 Acre',
      status: 'Pending',
      crop: 'Sugarcane',
      agrochemical: 'Herbicides',
      scheduledDate: '10 Feb 2025',
      totalAmount: '₹ 2000.00'
    },
  ]);

  // Helper to parse date strings (e.g., "6 Mar 2025" to Date object)
  const parseDate = (dateString: string): Date | null => {
    try {
      // Reformat to a parseable string like "YYYY-MM-DD" or use a library
      const parts = dateString.split(' ');
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = new Date(Date.parse(parts[1] + " 1, 2000")).getMonth(); // Get month index
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    } catch (e) {
      console.error("Error parsing date:", dateString, e);
      return null;
    }
  };

  const handleAddRequest = useCallback(() => {
    navigation.navigate('AddRequest');
  }, [navigation]);

  const handleRequestPress = useCallback((requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDetailsModal(true);
    }
  }, [requests]);

  const handleEditRequest = useCallback((request: RequestItem) => {
    setEditingRequest({ ...request });
    setShowDetailsModal(false);
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingRequest) {
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === editingRequest.id ? editingRequest : req
        )
      );
      setShowEditModal(false);
      setEditingRequest(null);
      Alert.alert('Success', 'Request updated successfully!');
    }
  }, [editingRequest]);

  const handleCloseModal = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingRequest(null);
  }, []);

  const handleCancelRequest = useCallback(() => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          onPress: () => {
            if (selectedRequest) {
              setRequests(prevRequests =>
                prevRequests.map(req =>
                  req.id === selectedRequest.id
                    ? { ...req, status: 'Cancelled' as const }
                    : req
                )
              );
            }
            handleCloseModal();
          },
          style: 'destructive',
        },
      ]
    );
  }, [selectedRequest, handleCloseModal]);

  const handleOutOfService = useCallback(() => {
    Alert.alert(
      'Out for Service',
      'Mark this request as out for service?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            if (selectedRequest) {
              setRequests(prevRequests =>
                prevRequests.map(req =>
                  req.id === selectedRequest.id
                    ? { ...req, status: 'Approved' as const }
                    : req
                )
              );
            }
            handleCloseModal();
          },
        },
      ]
    );
  }, [selectedRequest, handleCloseModal]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  // --- TOP FILTER TABS (All, Today, Pending) ---
  const handleFilterPress = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    // When a top filter is pressed, clear the advanced filters
    setAppliedFilters({ status: null, startDate: null, endDate: null });
    setSearchQuery(''); // Also clear search when changing top filter
  }, []);

  const updateEditingRequest = (field: keyof RequestItem, value: string) => {
    if (editingRequest) {
      setEditingRequest({
        ...editingRequest,
        [field]: value
      });
    }
  };

  // --- NEW FILTER MODAL FUNCTIONS ---
  const handleFilterIconPress = useCallback(() => {
    // Initialize temporary filter states with applied filters or default
    setTempFilterStatus(appliedFilters.status ? [...appliedFilters.status] : null);
    setTempStartDate(appliedFilters.startDate || '');
    setTempEndDate(appliedFilters.endDate || '');
    setShowFilterModal(true);
  }, [appliedFilters]);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({
      status: tempFilterStatus,
      startDate: tempStartDate,
      endDate: tempEndDate,
    });
    // Reset top filter when advanced filters are applied
    setActiveFilter('All');
    setSearchQuery(''); // Clear search when applying advanced filters
    setShowFilterModal(false);
  }, [tempFilterStatus, tempStartDate, tempEndDate]);

  const handleClearFilters = useCallback(() => {
    setTempFilterStatus(null);
    setTempStartDate('');
    setTempEndDate('');
    setAppliedFilters({ status: null, startDate: null, endDate: null }); // Clear applied filters
    setActiveFilter('All'); // Reset top filter to All
    setSearchQuery(''); // Clear search
    setShowFilterModal(false);
  }, []);

  const toggleStatusFilter = useCallback((status: RequestStatus) => {
    setTempFilterStatus(prevStatus => {
      if (!prevStatus) return [status]; // If null, start with this status
      if (prevStatus.includes(status)) {
        const newStatus = prevStatus.filter(s => s !== status);
        return newStatus.length > 0 ? newStatus : null; // If no statuses left, set to null
      } else {
        return [...prevStatus, status];
      }
    });
  }, []);

  // --- FILTERING LOGIC ---
  const filteredRequests = useMemo(() => {
    let tempRequests = requests;

    // 1. Apply top tab filter first if no advanced filters are applied
    if (!appliedFilters.status && !appliedFilters.startDate && !appliedFilters.endDate) {
        if (activeFilter === 'Today') {
            const today = new Date();
            const todayFormatted = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
            tempRequests = tempRequests.filter(req => req.date === todayFormatted);
        } else if (activeFilter === 'Pending') {
            tempRequests = tempRequests.filter(req => req.status === 'Pending');
        }
    } else {
        // 2. Apply advanced filters if they are set
        if (appliedFilters.status && appliedFilters.status.length > 0) {
            tempRequests = tempRequests.filter(req => appliedFilters.status?.includes(req.status));
        }

        if (appliedFilters.startDate) {
            const start = parseDate(appliedFilters.startDate);
            if (start) {
                tempRequests = tempRequests.filter(req => {
                    const reqDate = parseDate(req.date);
                    return reqDate && reqDate >= start;
                });
            }
        }
        if (appliedFilters.endDate) {
            const end = parseDate(appliedFilters.endDate);
            if (end) {
                tempRequests = tempRequests.filter(req => {
                    const reqDate = parseDate(req.date);
                    // Add a day to end date to include the whole day
                    const adjustedEndDate = new Date(end);
                    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
                    return reqDate && reqDate < adjustedEndDate;
                });
            }
        }
    }


    // 3. Apply search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      tempRequests = tempRequests.filter(req =>
        req.name.toLowerCase().includes(lowerCaseQuery) ||
        req.reqNo.toLowerCase().includes(lowerCaseQuery) ||
        req.location.toLowerCase().includes(lowerCaseQuery) ||
        (req.crop && req.crop.toLowerCase().includes(lowerCaseQuery)) ||
        (req.agrochemical && req.agrochemical.toLowerCase().includes(lowerCaseQuery))
      );
    }

    return tempRequests;
  }, [requests, activeFilter, searchQuery, appliedFilters]);

  const renderFilterButton = (filter: FilterType, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        // Only show active if no advanced filters are applied
        !appliedFilters.status && !appliedFilters.startDate && !appliedFilters.endDate && activeFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => handleFilterPress(filter)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterButtonText,
        !appliedFilters.status && !appliedFilters.startDate && !appliedFilters.endDate && activeFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderRequestCard = (request: RequestItem) => (
    <TouchableOpacity
      key={request.id}
      style={styles.card}
      onPress={() => handleRequestPress(request.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.acreage}>{request.acreage}</Text>
        <View style={styles.cardHeaderRight}>
          <View style={[
            styles.statusBadge,
            request.status === 'Cancelled' && styles.statusCancelled,
            request.status === 'Pending' && styles.statusPending,
            request.status === 'Approved' && styles.statusApproved
          ]}>
            <Text style={styles.statusText}>{request.status}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditRequest(request)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.name}>{request.name}</Text>
      <Text style={styles.reqNo}>Req No. {request.reqNo}</Text>
      <Text style={styles.location} numberOfLines={1}>
        {request.location}
      </Text>
      <Text style={styles.date}>{request.date}</Text>
    </TouchableOpacity>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseEditModal}
    >
      <SafeAreaView style={styles.editModalContainer}>
        {/* Edit Modal Header */}
        <View style={styles.editModalHeader}>
          <TouchableOpacity
            onPress={handleCloseEditModal}
            style={styles.modalBackButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.editModalTitle}>Edit Request</Text>
          <TouchableOpacity
            onPress={handleSaveEdit}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.editModalScrollView} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Basic Information</Text>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Name</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.name || ''}
                onChangeText={(text) => updateEditingRequest('name', text)}
                placeholder="Enter name"
              />
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Location</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.location || ''}
                onChangeText={(text) => updateEditingRequest('location', text)}
                placeholder="Enter location"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Acreage</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.acreage || ''}
                onChangeText={(text) => updateEditingRequest('acreage', text)}
                placeholder="Enter acreage"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Status and Dates */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Status & Scheduling</Text>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Status</Text>
              <View style={styles.statusSelector}>
                {['Pending', 'Approved', 'Cancelled'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      editingRequest?.status === status && styles.statusOptionActive
                    ]}
                    onPress={() => updateEditingRequest('status', status as RequestItem['status'])}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      editingRequest?.status === status && styles.statusOptionTextActive
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Request Date</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.date || ''}
                onChangeText={(text) => updateEditingRequest('date', text)}
                placeholder="DD Mon YYYY (e.g., 24 May 2025)"
              />
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Scheduled Date</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.scheduledDate || ''}
                onChangeText={(text) => updateEditingRequest('scheduledDate', text)}
                placeholder="DD Mon YYYY (e.g., 24 May 2025)"
              />
            </View>
          </View>

          {/* Spraying Details */}
          <View style={styles.editSection}>
            <Text style={styles.editSectionTitle}>Spraying Details</Text>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Crop</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.crop || ''}
                onChangeText={(text) => updateEditingRequest('crop', text)}
                placeholder="Enter crop type"
              />
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Agrochemical</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.agrochemical || ''}
                onChangeText={(text) => updateEditingRequest('agrochemical', text)}
                placeholder="Enter agrochemical type"
              />
            </View>

            <View style={styles.editField}>
              <Text style={styles.editLabel}>Total Amount</Text>
              <TextInput
                style={styles.editInput}
                value={editingRequest?.totalAmount || ''}
                onChangeText={(text) => updateEditingRequest('totalAmount', text)}
                placeholder="Enter total amount (e.g., ₹ 1200.00)"
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // --- NEW FILTER MODAL RENDER FUNCTION ---
  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <SafeAreaView style={styles.filterModalContainer}>
        <View style={styles.filterModalHeader}>
          <TouchableOpacity onPress={() => setShowFilterModal(false)} style={styles.modalBackButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.filterModalTitle}>Filter Requests</Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterModalScrollView}>
          {/* Filter by Status */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Status</Text>
            <View style={styles.statusFilterOptions}>
              {['Approved', 'Pending', 'Cancelled'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusFilterButton,
                    tempFilterStatus?.includes(status as RequestStatus) && styles.statusFilterButtonActive
                  ]}
                  onPress={() => toggleStatusFilter(status as RequestStatus)}
                >
                  <Text style={[
                    styles.statusFilterText,
                    tempFilterStatus?.includes(status as RequestStatus) && styles.statusFilterTextActive
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filter by Date Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Date Range</Text>
            <View style={styles.dateRangeContainer}>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="Start Date (DD Mon YYYY)"
                  value={tempStartDate}
                  onChangeText={setTempStartDate}
                  keyboardType="default" // Use 'default' as date strings are not purely numeric
                  placeholderTextColor="#999"
                />
                {/* In a real app, you'd add a date picker icon here */}
                {/* <TouchableOpacity onPress={() => console.log("Open start date picker")}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity> */}
              </View>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="End Date (DD Mon YYYY)"
                  value={tempEndDate}
                  onChangeText={setTempEndDate}
                  keyboardType="default"
                  placeholderTextColor="#999"
                />
                 {/* In a real app, you'd add a date picker icon here */}
                 {/* <TouchableOpacity onPress={() => console.log("Open end date picker")}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity> */}
              </View>
            </View>
            <Text style={styles.dateHint}>Use format: DD Mon YYYY (e.g., 24 May 2025)</Text>
          </View>
        </ScrollView>

        <View style={styles.filterModalFooter}>
          <TouchableOpacity style={styles.applyFilterButton} onPress={handleApplyFilters}>
            <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          activeOpacity={0.6}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Requests</Text>

        <View style={styles.spacer} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('All', 'All')}
          {renderFilterButton('Today', 'Today')}
          {renderFilterButton('Pending', 'Pending')}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Requests..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          style={styles.filterIconContainer}
          activeOpacity={0.6}
          onPress={handleFilterIconPress}
        >
          {/* This opens the new filter modal */}
          <Ionicons name="options-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map(renderRequestCard)
        ) : (
          <Text style={styles.noRequestsText}>No requests found for the selected filter or search.</Text>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={handleAddRequest}
        style={styles.floatingAddButton}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <Modal
          visible={showDetailsModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.modalBackButton}
              >
                <Ionicons name="chevron-back" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Details</Text>
              <TouchableOpacity
                onPress={() => handleEditRequest(selectedRequest)}
                style={styles.modalEditButton}
              >
                <Ionicons name="pencil-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {/* Points Button */}
              <TouchableOpacity style={styles.pointsButton}>
                <Text style={styles.pointsButtonText}>Get 99 points on UPE Payment</Text>
              </TouchableOpacity>

              {/* Direction Map Placeholder */}
              <View style={styles.mapContainer}>
                <Text style={styles.mapPlaceholder}>Direction map</Text>
              </View>

              {/* Distance and Time Info */}
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="car-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>20.4 km</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Estimated Time</Text>
                  <Text style={styles.infoValue}>25.1 mins</Text>
                </View>
              </View>

              {/* Contact Info */}
              <View style={styles.contactSection}>
                <View style={styles.contactItem}>
                  <View style={styles.contactLeft}>
                    <View style={styles.avatarGreen}>
                      <Ionicons name="person" size={16} color="white" />
                    </View>
                    <View>
                      <Text style={styles.contactName}>{selectedRequest.name}</Text>
                      <Text style={styles.contactNumber}>Request number: {selectedRequest.reqNo.replace('#', '')}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.callButton}>
                    <Ionicons name="call" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.locationItem}>
                  <Ionicons name="location" size={16} color="#ff4757" />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationText}>{selectedRequest.location}</Text>
                    <TouchableOpacity style={styles.directionsButton}>
                      <Ionicons name="navigate-outline" size={14} color="#007AFF" />
                      <Text style={styles.directionsText}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Spraying Details */}
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Spraying details</Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Crop</Text>
                    <Text style={styles.detailValue}>{selectedRequest.crop || 'Corn'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Agrochemical</Text>
                    <Text style={styles.detailValue}>{selectedRequest.agrochemical || 'Pesticides'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Area (acre)</Text>
                    <Text style={styles.detailValue}>{selectedRequest.acreage.replace(' Acre', '')}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Scheduled Date</Text>
                    <Text style={styles.detailValue}>{selectedRequest.scheduledDate || selectedRequest.date}</Text>
                  </View>
                </View>
              </View>

              {/* Charges Section */}
              <View style={styles.chargesSection}>
                <View style={styles.chargesHeader}>
                  <Text style={styles.sectionTitle}>CHARGES</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewDetailsLink}>View bill in detail</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.totalAmount}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>{selectedRequest.totalAmount || '₹ 1650.00'}</Text>
                </View>
              </View>

              {/* Note */}
              <Text style={styles.noteText}>
                Note: Out For Service only available on the scheduled date.
              </Text>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={styles.outOfServiceButton}
                onPress={handleOutOfService}
              >
                <Text style={styles.outOfServiceButtonText}>Out for Service</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelRequest}
              >
                <Text style={styles.cancelButtonText}>Cancel Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Edit Modal */}
      {renderEditModal()}

      {/* NEW Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 15,
  },
  spacer: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#000',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },
  filterIconContainer: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acreage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statusCancelled: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    color: '#ff4757', // Added text color for better visibility
  },
  statusPending: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#ffc107', // Added text color
  },
  statusApproved: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: '#4caf50', // Added text color
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  reqNo: {
    fontSize: 13,
    color: '#000',
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  // Modal Styles (Existing)
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '80%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalBackButton: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  modalEditButton: {
    padding: 8,
  },
  modalScrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  modalActionButtons: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  pointsButton: {
    backgroundColor: '#ff6b35',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pointsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  mapPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  contactSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  detailsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  chargesSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chargesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewDetailsLink: {
    fontSize: 14,
    color: '#007AFF',
  },
  totalAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  noteText: {
    fontSize: 12,
    color: '#ff4757',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  editModalContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  editModalScrollView: {
    flex: 1,
    padding: 16,
  },
  editSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  editSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  editField: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f8f8',
  },
  statusSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  statusOptionTextActive: {
    color: 'white',
  },
  outOfServiceButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  outOfServiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noRequestsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },

  // --- NEW FILTER MODAL STYLES ---
  filterModalContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  filterModalScrollView: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  statusFilterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // For React Native 0.71+ or use marginBottom/marginRight
  },
  statusFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#f0f0f0',
    marginRight: 8, // Fallback for older RN versions without 'gap'
    marginBottom: 8, // Fallback
  },
  statusFilterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusFilterText: {
    fontSize: 13,
    color: '#333',
  },
  statusFilterTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  dateRangeContainer: {
    flexDirection: 'column', // Changed to column for better layout
    gap: 12, // Gap between date inputs
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#f8f8f8',
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  dateHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  filterModalFooter: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  applyFilterButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyFilterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestPage;
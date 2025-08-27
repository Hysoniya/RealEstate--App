import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Footer from '../../../../components/home/Footer'

import {FiltersSection,PropertiesListSection}  from '../../../../components/property/propertiesPage';

const PropertiesRent = () => {
  
  const [searchQuery, setSearchQuery] = useState({ type: "" });
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const scrollViewRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        setShowScrollTop(currentOffset > 300);
      },
      useNativeDriver: false,
    }
  );

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleGoHome = () => {
    router.back();
  };

  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      {/* Modern Header with Gradient */}
      <View style={styles.headerSection}>
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <Pressable style={styles.backButton} onPress={handleGoHome}>
            <FontAwesome5 name="arrow-left" size={18} color="#ffffff" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Properties</Text>
            <Text style={styles.headerSubtitle}>Find your perfect rental</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerActionButton} onPress={handleFilterToggle}>
              <FontAwesome5 name="sliders-h" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.contentContainer}>
          {/* Breadcrumbs - commented out to match sell page
          <View style={styles.breadcrumbsContainer}>
            <TouchableOpacity 
              onPress={handleGoHome}
              style={styles.breadcrumbButton}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="home" size={12} color="#64748b" />
              <Text style={styles.breadcrumbText}>Home</Text>
            </TouchableOpacity>
            <Text style={styles.breadcrumbSeparator}>›</Text>
            <Text style={[styles.breadcrumbText, styles.activeBreadcrumb]}>Properties for Rent</Text>
          </View> */}

          <View style={styles.mainContent}>
            {/* Properties List */}
            <View style={styles.propertiesContainer}>
              <PropertiesListSection searchQuery={searchQuery} />
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-upward" size={24} color="#0078db" />
        </TouchableOpacity>
      )}

      {/* Mobile Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
        hardwareAccelerated={true}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setShowFilters(false)}
          />
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalDragHandle} />
                <View style={styles.modalHeaderContent}>
                  <MaterialIcons name="filter-list" size={24} color="#2C92FF" />          
                  <Text style={styles.modalTitle}>Filters </Text>
                  
                  <Pressable 
                    style={styles.modalCloseButton}
                    onPress={() => setShowFilters(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <FontAwesome5 name="times" size={20} color="#6b7280" />
                  </Pressable>
                </View>
              </View>

              {/* Modal Content */}
              <ScrollView 
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <FiltersSection />
                <View style={styles.modalContentSpacer} />
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </Modal>

      {/* <Footer /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Modern Header Styles
  headerSection: {
    position: 'relative',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 20,
    backgroundColor: '#475569',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#334155',
    opacity: 0.9,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
  flex: 1,
    paddingHorizontal: 5,
    paddingTop: Platform.OS === 'ios' ? 6 : 5,
  },

  // Breadcrumbs (commented out to match sell page)
  breadcrumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  breadcrumbButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
    gap: 4,
  },
  breadcrumbText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  activeBreadcrumb: {
    color: '#1e293b',
    fontWeight: '600',
  },
  breadcrumbSeparator: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 8,
  },

  // Main Content
  mainContent: {
    flex: 1,
    gap: 24,
  },
  propertiesContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    marginBottom: 24,
  },

  // Scroll to Top Button
  scrollTopButton: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    backgroundColor: '#D6EFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0078db',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    width: '100%',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '60%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: '#ffffff',
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalContentSpacer: {
    height: 20,
  },
});

export default PropertiesRent;
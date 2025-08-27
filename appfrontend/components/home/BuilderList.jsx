import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 15; // Gap between cards
const SIDE_SPACING = (width - CARD_WIDTH) / 2; // Calculate proper centering
const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds
const PAUSE_DURATION = 5000; // 5 seconds pause after user interaction

export default function BuilderList() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const flatListRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const pauseTimer = useRef(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchBuilders();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (builders.length > 1 && isAutoScrollEnabled && !userInteracted) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => {
      stopAutoScroll();
      clearTimeout(pauseTimer.current);
    };
  }, [builders.length, isAutoScrollEnabled, userInteracted, currentIndex]);

  const startAutoScroll = () => {
    stopAutoScroll(); // Clear any existing timer
    autoScrollTimer.current = setTimeout(() => {
      if (builders.length > 1) {
        const nextIndex = (currentIndex + 1) % builders.length;
        scrollToIndex(nextIndex, true);
      }
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearTimeout(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const pauseAutoScroll = () => {
    setUserInteracted(true);
    stopAutoScroll();
    
    // Clear any existing pause timer
    if (pauseTimer.current) {
      clearTimeout(pauseTimer.current);
    }
    
    // Resume auto-scroll after pause duration
    pauseTimer.current = setTimeout(() => {
      setUserInteracted(false);
    }, PAUSE_DURATION);
  };

  const scrollToIndex = (index, animated = true) => {
    if (flatListRef.current && index >= 0 && index < builders.length) {
      flatListRef.current.scrollToIndex({
        index,
        animated,
      });
      setCurrentIndex(index);
    }
  };

  const fetchBuilders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/builders`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setBuilders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching builders:', error);
      setError('Failed to load builders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderBuilder = ({ item, index }) => (
    <View style={[
      styles.cardWrapper,
      index === 0 && { marginLeft: SIDE_SPACING }, // First item gets left margin
      index === builders.length - 1 && { marginRight: SIDE_SPACING }, // Last item gets right margin
      index > 0 && { marginLeft: CARD_MARGIN } // Add gap between cards
    ]}>
      <View style={styles.builderCard}>
        <View style={styles.imageContainer}>
          {item.image && item.image.startsWith('http') ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.builderImage} 
              resizeMode="cover" 
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>🏗️</Text>
            </View>
          )}
        </View>
        
        <View style={styles.builderInfo}>
          <Text style={styles.builderName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.builderDescription} numberOfLines={3}>
            {item.description}
          </Text>
          
          {item.builderUrl ? (
            <TouchableOpacity 
              style={styles.visitButton}
              onPress={() => Linking.openURL(item.builderUrl)}
            >
              <Text style={styles.visitButtonText}>Visit Builder</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.comingSoonButton}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const onMomentumScrollEnd = ({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN));
    const clampedIndex = Math.max(0, Math.min(index, builders.length - 1));
    setCurrentIndex(clampedIndex);
  };

  const onScrollBeginDrag = () => {
    // User started dragging, pause auto-scroll
    pauseAutoScroll();
  };

  const handleIndicatorPress = (index) => {
    pauseAutoScroll();
    scrollToIndex(index, true);
  };

  const toggleAutoScroll = () => {
    setIsAutoScrollEnabled(!isAutoScrollEnabled);
    if (!isAutoScrollEnabled) {
      setUserInteracted(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>BUILDERS</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading builders...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>POPULAR BUILDERS</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchBuilders}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (builders.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>POPULAR BUILDERS</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No builders available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>POPULAR BUILDERS</Text>
        {/* {builders.length > 1 && (
          <TouchableOpacity
            style={styles.autoScrollToggle}
            onPress={toggleAutoScroll}
          >
            <Text style={[
              styles.autoScrollText,
              { color: isAutoScrollEnabled ? '#667eea' : '#6b7280' }
            ]}>
              {isAutoScrollEnabled ? '⏸️' : '▶️'} Auto
            </Text>
          </TouchableOpacity>
        )} */}
      </View>
      
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={builders}
          renderItem={renderBuilder}
          keyExtractor={(item) => item._id || item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollBeginDrag={onScrollBeginDrag}
          contentContainerStyle={styles.carousel}
          pagingEnabled={false}
          snapToAlignment="start"
        />
      </View>

      {builders.length > 1 && (
        <View style={styles.indicators}>
          {builders.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.indicator,
                idx === currentIndex && styles.activeIndicator,
              ]}
              onPress={() => handleIndicatorPress(idx)}
            />
          ))}
        </View>
      )}

      {/* {builders.length > 1 && userInteracted && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Auto-scroll paused • Will resume in a few seconds
          </Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 40,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 1,
  },
  autoScrollToggle: {
    position: 'absolute',
    right: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  autoScrollText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  carouselContainer: {
    alignItems: 'center',
  },
  carousel: {
    alignItems: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  builderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    minHeight: 320,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  builderImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  placeholderImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#667eea',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    color: '#ffffff',
  },
  builderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  builderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
    minHeight: 48, // Reserve space for 2 lines
  },
  builderDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    flex: 1,
  },
  visitButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  visitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  comingSoonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#667eea',
    transform: [{ scale: 1.2 }],
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
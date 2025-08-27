import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import IoIcon from 'react-native-vector-icons/FontAwesome';

const AdminReviews = ({ reviews }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name={index < rating ? "star" : "star-o"}
        size={14}
        color={index < rating ? "#fbbf24" : "#d1d5db"}
        style={styles.star}
      />
    ));

  const flattenedReviews =
    reviews?.flatMap((propertyReview) =>
      propertyReview.reviews.map((review) => ({
        ...review,
        property: propertyReview.propertyId,
      }))
    ) || [];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#10b981";
    if (rating >= 3.5) return "#f59e0b";
    if (rating >= 2.5) return "#f97316";
    return "#ef4444";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Customer Reviews</Text>
        <Text style={styles.subheader}>
          {flattenedReviews.length} total reviews
        </Text>
      </View>

      <View style={styles.reviewsContainer}>
        {flattenedReviews.reverse().map((review) => (
          <View key={review._id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewer}>
                <View style={styles.avatarContainer}>
                  <Icon1 name="user" size={16} color="#6b7280" />
                </View>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.ratingContainer}>
                    <View style={styles.stars}>
                      {renderStars(review.rating)}
                    </View>
                    <Text style={[styles.ratingText, { color: getRatingColor(review.rating) }]}>
                      {review.rating}/5
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedProperty(review.property)}
                style={styles.propertyButton}
              >
                <Icon name="home" size={12} color="#3b82f6" />
                <Text style={styles.propertyLink}>View</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.comment}>{review.comment}</Text>

            <View style={styles.propertyPreview}>
              <Icon name="building" size={12} color="#6b7280" />
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {review.property.title}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Modal
        visible={!!selectedProperty}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProperty(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={() => setSelectedProperty(null)}
              style={styles.closeBtn}
            >
              <IoIcon name="times" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{selectedProperty?.title}</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Icon name="th-large" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>BHK:</Text>
                <Text style={styles.detailValue}>{selectedProperty?.Bhk}</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="expand" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Area:</Text>
                <Text style={styles.detailValue}>{selectedProperty?.area} sq.ft</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="map-marker" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Address:</Text>
                <Text style={styles.detailValue}>{selectedProperty?.address}</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="dollar" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Price:</Text>
                <Text style={styles.detailValue}>₹{selectedProperty?.price}</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="info-circle" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, styles.statusBadge]}>
                  {selectedProperty?.status}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="user" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Owner:</Text>
                <Text style={styles.detailValue}>{selectedProperty?.Propreiter_name}</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="envelope" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{selectedProperty?.Propreiter_email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="phone" size={16} color="#6b7280" />
                <Text style={styles.detailLabel}>Contact:</Text>
                <Text style={styles.detailValue}>{selectedProperty?.Propreiter_contact}</Text>
              </View>
            </View>

            {selectedProperty?.images?.length > 0 && (
              <View style={styles.imageSection}>
                <Text style={styles.imagesSectionTitle}>Property Images</Text>
                <ScrollView horizontal style={styles.imageGrid}>
                  {selectedProperty.images.map((url, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: url }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
    minHeight: '100%',
  },

  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },

  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },

  subheader: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  reviewsContainer: {
    gap: 16,
  },

  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  reviewer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },

  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  reviewerInfo: {
    flex: 1,
  },

  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 3,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  star: {
    marginRight: 1,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },

  propertyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 4,
    minWidth: 60,
    justifyContent: 'center',
  },

  propertyLink: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },

  comment: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e2e8f0',
  },

  propertyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },

  propertyTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },

  // Modal styles remain unchanged
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 700,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1e293b',
    textAlign: 'center',
    paddingRight: 40,
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  detailsGrid: {
    gap: 16,
    marginBottom: 24,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    minWidth: 70,
  },

  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },

  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  imageSection: {
    marginTop: 8,
  },

  imagesSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },

  imageGrid: {
    flexDirection: 'row',
  },

  image: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default AdminReviews;
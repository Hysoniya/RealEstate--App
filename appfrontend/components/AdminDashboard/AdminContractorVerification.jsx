import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from "expo-router";

const AdminContractorVerification = ({
  contractors,
  loading,
  error,
  handleAcceptContractor,
  handleRejectContractor,
  navigation, // React Navigation prop
}) => {
  const [filter, setFilter] = useState('all');

  const filteredContractors = contractors
    .filter((contractor) =>
      filter === 'all'
        ? true
        : filter === 'verified'
        ? contractor.verified
        : !contractor.verified
    )
    .reverse();

    const router = useRouter();

 const handleViewDetails = (contractorId) => {
    router.push(`/services/contractors/${contractorId}`);
  };

  const handleImageError = (imageIndex, workIndex, contractorIndex) => {
    // In a real app, you might want to update state to hide broken images
    console.log('Image failed to load');
  };

  const renderPortfolioImages = (work, workIndex) => (
    <View style={styles.imageGallery}>
      {work.images.slice(0, 3).map((img, j) => (
        <Image
          key={j}
          source={{ uri: img }}
          style={styles.portfolioImage}
          onError={() => handleImageError(j, workIndex)}
          resizeMode="cover"
        />
      ))}
      {work.images.length > 3 && (
        <View style={styles.moreImages}>
          <Text style={styles.moreImagesText}>+{work.images.length - 3} more</Text>
        </View>
      )}
    </View>
  );

  const renderPortfolioItem = (work, index) => (
    <View key={index} style={styles.portfolioItem}>
      <View style={styles.portfolioContent}>
        <Text style={styles.portfolioTitle}>{work.title}</Text>
        <Text style={styles.portfolioDescription}>{work.description}</Text>
        <Text style={styles.portfolioMeta}>
          Location: {work.location} • Completed: {new Date(work.completedOn).toLocaleDateString()}
        </Text>
      </View>
      {renderPortfolioImages(work, index)}
    </View>
  );

  const renderContractorCard = (contractor) => (
    <View key={contractor._id} style={styles.contractorCard}>
      <View style={styles.cardTopBorder} />
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{contractor.name}</Text>
          <View style={[
            styles.status,
            contractor.verified ? styles.statusVerified : styles.statusPending
          ]}>
            <Text style={styles.statusText}>
              {contractor.verified ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewDetailsBtn}
          onPress={() => handleViewDetails(contractor._id)}
          activeOpacity={0.8}
        >
          <Text style={styles.viewDetailsBtnText}>View Details</Text>
        </TouchableOpacity>

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Service Type:</Text>
            <View style={styles.serviceTypeContainer}>
              <Text style={styles.serviceType}>
                {contractor.serviceType}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>
              {contractor.email} | {contractor.phone}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{contractor.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Joined:</Text>
            <Text style={styles.value}>
              {new Date(contractor.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Portfolio Projects:</Text>
            <Text style={styles.value}>{contractor.portfolio.length}</Text>
          </View>

          {contractor.portfolio.length > 0 ? (
            <View style={styles.portfolioList}>
              {contractor.portfolio.slice(0, 2).map((work, i) => 
                renderPortfolioItem(work, i)
              )}
            </View>
          ) : (
            <View style={styles.noPortfolioContainer}>
              <Text style={styles.noPortfolioText}>No portfolio items provided</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {!contractor.verified && (
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={() => handleAcceptContractor(contractor._id)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={() => handleRejectContractor(contractor._id)}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contractor Verification</Text>
        <Text style={styles.headerSubtitle}>Review and manage contractor applications</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterBtnText, filter === 'all' && styles.filterBtnActiveText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('verified')}
          style={[styles.filterBtn, filter === 'verified' && styles.filterBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterBtnText, filter === 'verified' && styles.filterBtnActiveText]}>
            Verified
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('pending')}
          style={[styles.filterBtn, filter === 'pending' && styles.filterBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterBtnText, filter === 'pending' && styles.filterBtnActiveText]}>
            Pending
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading contractors...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredContractors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contractors found</Text>
          <Text style={styles.emptySubtext}>No contractors match the selected filter.</Text>
        </View>
      ) : (
        filteredContractors.map(renderContractorCard)
      )}
    </ScrollView>
  );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
    marginHorizontal: 24,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  filterBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterBtnText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  filterBtnActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  filterBtnActiveText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 16,
  },

  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginVertical: 16,
  },

  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },

  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 48,
    marginHorizontal: 24,
    marginVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },

  contractorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },

  cardTopBorder: {
    height: 4,
    backgroundColor: '#667eea',
  },

  cardContent: {
    padding: 24,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 16,
  },

  status: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  statusVerified: {
    backgroundColor: '#10b981',
  },

  statusPending: {
    backgroundColor: '#f59e0b',
  },

  statusText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  viewDetailsBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
  },

  viewDetailsBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },

  infoGroup: {
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    minHeight: 24,
  },

  label: {
    fontWeight: '600',
    color: '#374151',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    width: 140,
    marginRight: 16,
  },

  value: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },

  serviceTypeContainer: {
    flex: 1,
  },

  serviceType: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },

  portfolioList: {
    marginTop: 16,
  },

  portfolioItem: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  portfolioContent: {
    marginBottom: 16,
  },

  portfolioTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  portfolioDescription: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  portfolioMeta: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },

  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  portfolioImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  moreImages: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  moreImagesText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },

  noPortfolioContainer: {
    backgroundColor: '#fef9e7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },

  noPortfolioText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
    fontStyle: 'italic',
  },

  buttonsContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  adminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 100,
  },

  acceptBtn: {
    backgroundColor: '#10b981',
  },

  rejectBtn: {
    backgroundColor: '#ef4444',
  },

  actionBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default AdminContractorVerification;
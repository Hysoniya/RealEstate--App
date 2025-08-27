import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
 
const StaffPrePurchaseProVer = ({ prePurchaseRequest = [] }) => {
  const [searchId, setSearchId] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
 
  const filteredRequests = prePurchaseRequest.filter((request) =>
    searchId.trim() === '' ? true : request._id.includes(searchId.trim())
  );
 
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
 
  const renderItem = (item) => {
    const isExpanded = expandedItems[item._id];
   
    return (
      <TouchableOpacity
        key={item._id}
        style={styles.card}
        onPress={() => toggleExpand(item._id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.requestId}>Request ID: {item._id}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
 
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{item.FullName}</Text>
          </View>
         
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={[styles.value, styles.phoneText]}>{item.Phone}</Text>
          </View>
         
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
 
          {isExpanded && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />
             
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={[styles.value, styles.emailText]} numberOfLines={2}>
                  {item.Email}
                </Text>
              </View>
 
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value} numberOfLines={3}>
                  {item.Address}
                </Text>
              </View>
 
              {item.MessageOrPropertyDetails && (
                <View style={styles.row}>
                  <Text style={styles.label}>Details:</Text>
                  <Text style={styles.value} numberOfLines={5}>
                    {item.MessageOrPropertyDetails}
                  </Text>
                </View>
              )}
 
              <View style={styles.row}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.value}>
                  {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>📋 Pre-Purchase Verification</Text>
      </View>
 
      <View style={styles.controls}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Request ID"
          value={searchId}
          onChangeText={setSearchId}
          placeholderTextColor="#999"
        />
      </View>
 
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>
          {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.listHeaderSubtext}>
          Tap to expand details
        </Text>
      </View>
 
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map(renderItem)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No requests found</Text>
            <Text style={styles.emptySubtext}>
              {searchId.trim() ? 'Try adjusting your search' : 'No verification requests yet'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#dee2e6',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#212529',
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  listHeaderSubtext: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  requestId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    flex: 1,
  },
  expandIcon: {
    fontSize: 16,
    color: '#6c757d',
    marginLeft: 10,
  },
  cardContent: {
    // No additional styles needed
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    width: 70,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: '#212529',
    flex: 1,
    lineHeight: 20,
  },
  phoneText: {
    color: '#003366',
    fontWeight: '500',
  },
  emailText: {
    color: '#0056b3',
    fontSize: 13,
  },
  expandedContent: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
});
 
export default StaffPrePurchaseProVer;
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const BankCard = ({ bankName, logo, rating, loanProducts, interestRate }) => {
  return (
    <View style={styles.bankCard}>
      <View style={styles.bankLogo}>
        {logo && logo.startsWith('http') ? (
                <Image source={{ uri: logo }} style={[styles.logo]} />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>
              {'🏦' || bankName.charAt(0)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.bankInfo}>
        <Text style={styles.bankName}>{bankName}</Text>
        <View style={styles.rating}>
          <Text style={styles.stars}>
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </Text>
          <Text style={styles.ratingValue}>{rating}</Text>
        </View>
        <View style={styles.loanInfo}>
          <Text style={styles.products}>{loanProducts}+ Loan Products</Text>
          <Text style={styles.interestRate}>Starting from {interestRate}%</Text>
        </View>
        {/* <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Offers</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bankCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    maxWidth: 300,
    minWidth: 280,
  },
  bankLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    padding: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#667eea', // Simplified to single color for placeholder
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bankInfo: {
    alignItems: 'center',
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stars: {
    color: '#fbbf24',
    fontSize: 16,
  },
  ratingValue: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  loanInfo: {
    marginBottom: 16,
  },
  products: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  interestRate: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#667eea', // Simplified to single color for button
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BankCard;
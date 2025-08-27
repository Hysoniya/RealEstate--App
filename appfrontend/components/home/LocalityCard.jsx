import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const LocalityCard = ({ name, rating, projects, imageUrl }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={imageUrl} style={styles.profilePic} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.rating}>
              {rating} <Text style={styles.star}>★</Text>
            </Text>
          </View>
          <Text style={styles.subtitle}>{projects} New Projects</Text>
        </View>
      </View>

      {/* <View style={styles.cardFooter}>
        <TouchableOpacity>
          <Text style={styles.link}>Insights</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity>
          <Text style={styles.link}>Projects</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating: {
    backgroundColor: '#e6f4ea',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  star: {
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#c5c2c2',
    paddingTop: 8,
    marginTop: 16,
  },
  link: {
    color: '#2697e0',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#c5c2c2',
  },
});

export default LocalityCard;
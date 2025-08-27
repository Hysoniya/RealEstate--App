import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from "expo-router";

// Sample hardcoded properties array
const hardcodedProperties = [
  
  {
    _id: '684a804703dfcd7be1fb7d1f',
    title: 'Pride City',
    location: 'Beverly Hills',
    price: '$678,899',
    images: ['https://picsum.photos/id/1011/200/200'],
  },
  {
    _id: '67ad78044cbb2d27de69802d',
    title: 'Pali Hills',
    location: 'New York',
    price: '$1,200,000',
    images: ['https://picsum.photos/id/1018/200/200'],
  },
  {
    _id: '66e021c6addfe5a4faf10dc7',
    title: 'Beach House',
    location: 'Malibu',
    price: '$3,800,000',
    images: ['https://picsum.photos/id/1025/200/200'],
  },
  {
    _id: '66dfd0885b635f5a284f50a5',
    title: 'Cozy Cottage',
    location: 'Nashville',
    price: '$850,000',
    images: ['https://picsum.photos/id/1039/200/200'],
  },
  // Add more if needed
];

const { width } = Dimensions.get('window');

const Upcoming = () => {
    const router = useRouter();
  
  // Use only first 4 from hardcoded data
  const [properties] = useState(hardcodedProperties.slice(0, 4));

  // On card press navigate to PropertyDetails screen with id param
  const handlePress = (id) => {
   router.push(`(screens)/(property)/propertyDetails/${id}`);
 
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/upcoming.png')}
          style={styles.logo}
        />
        <Text style={styles.heading}>NEW ARRIVALS</Text>
      </View>

      <View style={styles.cardGrid}>
        {properties.map((property) => (
          <TouchableOpacity
            key={property._id}
            style={styles.card}
            onPress={() => handlePress(property._id)}
          >
            <Image
              source={{
                uri:
                  property.images && property.images[0]
                    ? property.images[0]
                    : 'https://via.placeholder.com/120',
              }}
              style={styles.cardImage}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{property.title}</Text>
              <Text style={styles.location}>{property.location}</Text>
              <Text style={styles.price}>{property.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    gap: 16,
    marginVertical: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgb(171, 171, 246)',
    width: '90%',
    alignSelf: 'center',
    height: width < 768 ? 'auto' : 400,
    shadowColor: '#757BEE',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '500',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20,
    resizeMode: 'cover',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 6,
  },
});

export default Upcoming;

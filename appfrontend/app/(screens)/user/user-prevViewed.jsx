import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const Navbar_local = () => {
  const router = useRouter();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#784dc6" }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 12, padding: 4 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, flex: 1 }}>
        My Previously Viewed
      </Text>
    </View>
  );
};

const UserPreviouslyViewed = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPreviouslyViewed = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("No token found");
        const decoded = jwtDecode(token);
        const userId = decoded?._id;
        if (!userId) throw new Error("User ID not found in token");

        const res = await fetch(`${API_URL}/api/user-update/previous-view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        const arr =
          data.previousView?.map((item) =>
            item.propertyId ? item.propertyId : item
          ) || [];

        setProperties(arr);
      } catch (error) {
        setProperties([]);
      }
    };

    fetchPreviouslyViewed();
  }, []);

  const openPropertyDetails = (property) => setSelectedProperty(property);
  const closePropertyDetails = () => setSelectedProperty(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar_local />
      <View style={styles.container}>
        <Text style={styles.header}>Previously Viewed</Text>
        <View style={styles.contentArea}>
          {properties.length === 0 ? (
            <View style={styles.emptySection}>
              <Image
                source={{ uri: "https://via.placeholder.com/200x200?text=No+Views" }}
                style={{ width: 200, height: 200 }}
              />
              <Text style={styles.emptyMessage}>
                You haven’t viewed anything yet
              </Text>
              <Text style={styles.emptyMessage}>
                All the properties and projects that you have viewed will start
                appearing here. Search or explore cities now.
              </Text>
            </View>
          ) : (
            <FlatList
              data={properties}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.propertyGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.propertyCard}
                  onPress={() => openPropertyDetails(item)}
                >
                  <View style={styles.cardImageWrapper}>
                    <Image
                      source={{
                        uri: "https://via.placeholder.com/100x100?text=No+Image",
                      }}
                      style={styles.cardImage}
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardPrice}>
                        ₹{item.price?.toLocaleString?.()}
                      </Text>
                    </View>
                    <Text style={styles.cardLocation}>{item.city}</Text>
                    <Text style={styles.cardDetails}>
                      🛏️ {item.Bhk} BHK • 🛁 {item.bathrooms} Bath • 📐{" "}
                      {item.area} sqft
                    </Text>
                    <Text style={styles.cardDesc}>
                      {item.description
                        ? `${item.description.slice(0, 80)}...`
                        : "No description provided."}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Popup Modal */}
        <Modal
          visible={!!selectedProperty}
          animationType="slide"
          transparent={true}
          onRequestClose={closePropertyDetails}
        >
          {selectedProperty && (
            <View style={styles.propertyPopupOverlay}>
              <View style={styles.propertyPopupContent}>
                <Text style={styles.popupTitle}>{selectedProperty.title}</Text>
                <Text style={{ marginBottom: 7 }}>
                  {selectedProperty.description}
                </Text>
                <Text>
                  <Text style={styles.bold}>City:</Text> {selectedProperty.city}
                </Text>
                <Text>
                  <Text style={styles.bold}>Price:</Text> ₹
                  {selectedProperty.price}
                </Text>
                <Text>
                  <Text style={styles.bold}>BHK:</Text> {selectedProperty.Bhk}
                </Text>
                <Text>
                  <Text style={styles.bold}>Type:</Text> {selectedProperty.type}
                </Text>
                <Text>
                  <Text style={styles.bold}>Status:</Text>{" "}
                  {selectedProperty.status}
                </Text>
                <View style={styles.closeView}>
                  <TouchableOpacity
                    onPress={() => {
                      closePropertyDetails();
                      router.push(
                        `/property-details-page/${selectedProperty._id}`
                      );
                    }}
                    style={styles.viewDetailButton}
                  >
                    <Text style={styles.viewDetailText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closePropertyDetails}
                    style={styles.closeButton}
                  >
                    <Text style={{ fontWeight: "bold", color: "#784dc6" }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Modal>
      </View>
    </View>
  );
};

export default UserPreviouslyViewed;

// styles (unchanged, reused from your original code)
const styles = StyleSheet.create({
  // ... same styles as before
  container: {
    flex: 1,
    backgroundColor: "#f6f5fa",
    paddingTop: 48,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#784dc6",
    marginBottom: 15,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 8,
  },
  propertyGrid: {
    paddingBottom: 40,
  },
  propertyCard: {
    backgroundColor: "#fff",
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 13,
    flexDirection: "row",
    elevation: 2,
    overflow: "hidden",
  },
  cardImageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  cardPrice: {
    fontWeight: "bold",
    color: "#784dc6",
    marginLeft: 10,
  },
  cardLocation: {
    color: "#666",
    marginBottom: 3,
  },
  cardDetails: {
    fontSize: 13,
    color: "#444",
    marginBottom: 3,
  },
  cardDesc: {
    color: "#777",
    fontSize: 13,
  },
  emptySection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyMessage: {
    marginTop: 14,
    color: "#444",
    textAlign: "center",
    fontSize: 16,
  },
  propertyPopupOverlay: {
    flex: 1,
    backgroundColor: "rgba(36,36,36,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  propertyPopupContent: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "flex-start",
    shadowColor: "#222",
    shadowOpacity: 0.21,
    shadowRadius: 16,
    elevation: 16,
  },
  popupTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
    color: "#784dc6",
    alignSelf: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  closeView: {
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  viewDetailButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#784dc6",
    borderRadius: 8,
    marginRight: 15,
  },
  viewDetailText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eae6f6",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});

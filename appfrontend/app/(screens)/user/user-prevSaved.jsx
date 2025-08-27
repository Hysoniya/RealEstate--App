import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const Navbar_local = () => {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#784dc6",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 12, padding: 4 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
      </TouchableOpacity>
      <Text
        style={{ color: "#fff", fontWeight: "bold", fontSize: 20, flex: 1 }}
      >
        My Previously Saved
      </Text>
    </View>
  );
};

const UserPreviouslySaved = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const id = decoded._id || decoded.id;
          setUserId(id);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${API_URL}/api/user-update/${userId}/saved-properties`)
      .then((res) => res.json())
      .then((data) => setSavedProperties(data.saveProperties || []))
      .catch(() => setSavedProperties([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (propertyId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/user-update/${userId}/remove-saved-property/${propertyId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (res.ok) {
        setSavedProperties((prev) =>
          prev.filter((item) => item.propertyId._id !== propertyId)
        );
        Alert.alert("Removed", data.message || "Property removed successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to remove property");
      }
    } catch (err) {
      Alert.alert("Error", "An error occurred. Try again.");
    }
  };

  const handleViewDetails = (propertyId) => {
    router.push(`/property-details-page/${propertyId}`);
  };

  const renderProperty = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={
            item.propertyId.images && item.propertyId.images[0]
              ? { uri: item.propertyId.images[0] }
              : { uri: "https://via.placeholder.com/120x90?text=No+Image" }
          }
          style={styles.image}
        />
        <Text style={styles.tag}>{item.propertyId.type}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.propertyId.title}</Text>
        </View>
        <Text style={styles.location}>
          {item.propertyId.location}, {item.propertyId.city}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.price}>
            ₹ {item.propertyId.price?.toLocaleString()}
          </Text>
          <Text style={styles.status}>{item.propertyId.status}</Text>
        </View>
        <View style={styles.stats}>
          <Text>{item.propertyId.bedrooms || 0} Beds</Text>
          <Text> | </Text>
          <Text>{item.propertyId.bathrooms || 0} Baths</Text>
          <Text> | </Text>
          <Text>{item.propertyId.area} sqft</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => handleViewDetails(item.propertyId._id)}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() =>
              Alert.alert(
                "Remove Property",
                "Are you sure you want to remove this property from your saved list?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => handleRemove(item.propertyId._id),
                  },
                ]
              )
            }
          >
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#784dc6" />
        <Text style={styles.loadingText}>Loading saved properties...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar_local />
      <View style={styles.container}>
        <Text style={styles.header}>Saved Properties</Text>
        {savedProperties.length > 0 ? (
          <FlatList
            data={savedProperties}
            keyExtractor={(item) => item.propertyId._id}
            renderItem={renderProperty}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.grid}
          />
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={{
                uri: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
              }}
              style={{ width: 250, height: 200 }}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>
              You haven’t saved any property lately!
            </Text>
            <Text style={styles.emptySubtitle}>
              All the properties and projects that you have saved will start
              appearing here. Start exploring your dream home now.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/SearchPropertiesNavbar")}
            >
              <Text style={styles.exploreBtnText}>Explore Properties</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
export default UserPreviouslySaved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5fa",
    paddingTop: 48,
    paddingHorizontal: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#784dc6",
    marginBottom: 18,
  },
  grid: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 18,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  imageWrapper: {
    width: 120,
    height: 110,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 110,
    height: 95,
    borderRadius: 8,
  },
  tag: {
    position: "absolute",
    bottom: 6,
    left: 7,
    backgroundColor: "#784dc6",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  details: {
    flex: 1,
    padding: 13,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  price: {
    fontWeight: "bold",
    color: "#784dc6",
    marginRight: 15,
  },
  status: {
    fontWeight: "bold",
    color: "#27b579",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    color: "#888",
    fontSize: 14,
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  viewBtn: {
    backgroundColor: "#784dc6",
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  viewBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#784dc6",
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  removeBtnText: {
    color: "#784dc6",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 5,
    color: "#444",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 22,
    marginBottom: 20,
  },
  exploreBtn: {
    alignSelf: "center",
    backgroundColor: "#784dc6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
  },
  exploreBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f5fa",
  },
  loadingText: {
    fontSize: 16,
    color: "#3a3653",
    marginTop: 22,
  },
});

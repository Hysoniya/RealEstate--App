// app/user-properties.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Replace LottieView with a GIF-based animation
const EMPTY_STATE_GIF = require("@/assets/images/no-property.png"); // 👈 Add your own GIF here

const BuilderPropertyCard = ({ title, city, price, area, imageUrl, onPress, status }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: imageUrl }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text>{city}</Text>
      <Text>₹{price} · {area} sqft</Text>
      <Text>Status: {status}</Text>
    </View>
  </TouchableOpacity>
);

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
        My Properties
      </Text>
    </View>
  );
};

const UserProperties = () => {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalHosted: 0,
    totalSoldOrRented: 0,
    availableProperties: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        let email = "";
        if (token) {
          try {
            const decoded = jwtDecode(token);
            email = decoded.email;
          } catch (err) {
            console.error("Invalid token", err);
          }
        }
        if (!email) return;
        const response = await fetch(`${API_URL}/api/property-user/${email}`);
        if (!response.ok) throw new Error("Failed to fetch properties");
        const result = await response.json();
        setProperties(result.data || []);
        setStats({
          totalHosted: result.stats?.totalHosted || 0,
          totalSoldOrRented: result.stats?.totalSoldOrRented || 0,
          availableProperties: result.stats?.availableProperties || 0,
        });
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar_local />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>Your Properties</Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : properties.length > 0 ? (
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Total Properties Hosted</Text>
                  <Text style={styles.statValue}>{stats.totalHosted}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Total Properties Sold / Rented</Text>
                  <Text style={styles.statValue}>{stats.totalSoldOrRented}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Available Properties</Text>
                  <Text style={styles.statValue}>{stats.availableProperties}</Text>
                </View>
              </View>

              <View style={styles.propertiesGrid}>
                {properties.map((property) => (
                  <View key={property._id} style={styles.cardWrapper}>
                    <BuilderPropertyCard
                      title={property.title}
                      city={property.city}
                      price={property.price?.toString()}
                      area={property.area?.toString()}
                      imageUrl={property.image}
                      status={property.status}
                      onPress={() =>
                        router.push(`/property-details-page/${property._id}`)
                      }
                    />
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() =>
                        router.push(`/property-details-page/${property._id}`)
                      }
                    >
                      <Text style={styles.detailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={EMPTY_STATE_GIF}
                style={{ width: 300, height: 250 }}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>
                You haven’t bought or sold any property yet!
              </Text>
              <Text style={styles.emptyDesc}>
                All the properties and projects that you have bought or sold will start appearing here. Search or explore cities now.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default UserProperties;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f4fb",
    paddingTop: 48,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 14,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 13,
    padding: 15,
    elevation: 2,
    alignItems: "center",
    width: "30%",
    marginHorizontal: 2,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#784dc6",
    marginTop: 2,
  },
  propertiesGrid: {
    marginTop: 18,
    paddingHorizontal: 8,
  },
  cardWrapper: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 13,
    overflow: "hidden",
    elevation: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  cardImage: {
    width: 75,
    height: 75,
    borderRadius: 7,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: "#784dc6",
    paddingVertical: 7,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
  },
  detailsText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 5,
    textAlign: "center",
  },
  emptyDesc: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 22,
  },
});

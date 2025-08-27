import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Navbar from "@/components/home/Navbar";
import { router } from "expo-router";

const id = '66ceea87214c9d48d77c147a';

const handleViewDetails = () => {
  // Logic to handle view details action  
  console.log("View details clicked");

  router.push(`(screens)/(property)/propertyDetails/${id}`);

};

const UserNotifications = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.notificationWrapper}>
          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <Image
                style={styles.notificationIcon}
                source={require("@/assets/images/notification-img.jpg")}
                alt="Property Alert"
              />
              <Text style={styles.notificationTitle}>New Property Match!</Text>
            </View>
            <Text style={styles.notificationBody}>
              A new 3-bedroom apartment in Downtown matches your search criteria! 
              Price: $350,000 | 1,200 sqft | Posted: 2 hours ago
            </Text>
            <TouchableOpacity style={styles.viewButton} onPress={() => {handleViewDetails()}}>
              <Text style={styles.viewButtonText}>View Property</Text>
            </TouchableOpacity>
            <Text style={styles.notificationTime}>2 hours ago</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserNotifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5fa",
    padding: 28,
  },
  notificationWrapper: {
    flex: 1,
    width: "100%",
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ececec",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#793dd1",
  },
  notificationBody: {
    fontSize: 15,
    color: "#373444",
    lineHeight: 21,
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: "#793dd1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationTime: {
    fontSize: 13,
    color: "#888",
    marginTop: 12,
    textAlign: "right",
  },
});
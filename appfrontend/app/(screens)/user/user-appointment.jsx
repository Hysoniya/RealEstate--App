import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Replace with your actual API URL
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
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 20,
          flex: 1,
        }}
      >
        My Appointments
      </Text>
    </View>
  );
};

const EmptyStateAnimation = ({ style }) => (
  <Image
    source={{
      uri: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3dlcGV0cmFzaDgwazFiaTQyZnhybWF3NWtvZXk0YTBmM3JzZXI3cXNtNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/qgQUggAC3Pfv687qPC/giphy.gif",
    }}
    resizeMode="contain"
    style={[{ width: 180, height: 180 }, style]}
  />
);

export default function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const token = (await AsyncStorage.getItem("authToken")) || null;
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
    const fetchAppointments = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allAppointments = response.data.appointments || [];
        const userAppointments = allAppointments.filter(
          (appt) => appt.userId === userId
        );
        setAppointments(userAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAppointments();
  }, [userId]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Appointment",
      "Are you sure you want to delete this appointment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.delete(`${API_URL}/api/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setAppointments((prev) =>
                prev.filter((appt) => appt._id !== id)
              );
              Toast.show({
                type: "error",
                text1: "Appointment Deleted",
              });
            } catch (error) {
              console.error("Error deleting appointment:", error);
            }
          },
        },
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.name}>{`${item.firstName} ${item.lastName}`}</Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <MaterialCommunityIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text>Email: {item.email}</Text>
      <Text>Phone: {item.phoneNumber}</Text>
      <Text>
        Date:{" "}
        {item.createdAt &&
          new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text>
        Time:{" "}
        {item.createdAt &&
          new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
      </Text>
      <Text>
        Status: <Text style={styles.status}>{item.status || "Pending"}</Text>
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar_local />
      <View style={{ flex: 1, padding: 16 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#784dc6" />
            <Text style={styles.txt}>Loading appointments...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyStateAnimation style={{ alignSelf: "center" }} />
            <Text style={styles.txt}>
              You haven’t booked any appointments yet!
            </Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item._id}
            renderItem={renderAppointment}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#111",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#784dc6",
    marginBottom: 4,
  },
  status: {
    fontWeight: "bold",
    color: "#784dc6",
  },
  txt: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: 42,
  },
});

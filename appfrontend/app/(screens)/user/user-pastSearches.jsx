import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import LottieView from "lottie-react-native";
import Navbar from "@/components/home/Navbar";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const UserPastSearches = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decoded = jwtDecode(token);
          // console.log(decoded);
          const res = await fetch(
            `${API_URL}/api/user-update/${decoded._id}/past-searches`
          );
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          setSearches(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError("Failed to load search history");
        setSearches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#784dc6" />
        <Text style={styles.loadingText}>
          Loading your past search history...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4fa" }}>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.title}>Your Past Searches</Text>
        <View style={styles.contentWrapper}>
          {searches.length > 0 ? (
            <View style={styles.listSection}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 2 }]}>
                  Search Term
                </Text>
                <Text style={styles.headerCell}>Date</Text>
                <Text style={styles.headerCell}>Time</Text>
              </View>
              <FlatList
                data={searches}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => {
                  const dt = new Date(item.search_datetime);
                  const date = dt.toLocaleDateString();
                  const time = dt.toLocaleTimeString();
                  return (
                    <View style={styles.row}>
                      <Text style={[styles.cell, { flex: 2 }]}>
                        {item.search_text}
                      </Text>
                      <Text style={styles.cell}>{date}</Text>
                      <Text style={styles.cell}>{time}</Text>
                    </View>
                  );
                }}
                contentContainerStyle={{}}
                style={{}}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <LottieView
                source={{
                  uri: "https://lottie.host/a5254c19-e1f1-409d-95bd-c175ec072f09/lfnd0ChTqd.json",
                }}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
              <Text style={styles.noSearchMessage}>
                You haven’t searched anything yet. Start exploring properties
                now!
              </Text>
            </View>
          )}
          {error && (
            <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
              {error}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default UserPastSearches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5fa",
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#784dc6",
    alignSelf: "center",
    marginBottom: 17,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    elevation: 1,
  },
  listSection: {
    flex: 1,
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ececec",
    paddingBottom: 7,
    marginBottom: 3,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#784dc6",
    fontSize: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 9,
    borderBottomWidth: 0.7,
    borderColor: "#f0eef6",
  },
  cell: {
    flex: 1,
    fontSize: 15,
    color: "#1c1a25",
    textAlign: "center",
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
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 55,
  },
  noSearchMessage: {
    textAlign: "center",
    marginTop: 20,
    color: "#444",
    fontSize: 16,
  },
});

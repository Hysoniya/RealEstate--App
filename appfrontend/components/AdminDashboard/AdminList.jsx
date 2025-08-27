// AdminList.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get('window');

const AdminList = ({ admins, onAddAdminClick, handleRemoveAdmin, loading, error, refreshAdmins }) => {
  // Filter out any undefined/null items and ensure each item has an _id
  const validAdmins = (admins || []).filter(admin => admin && admin._id);

  const confirmDelete = async (adminId) => {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Are you sure you want to delete this admin?');
      if (ok) {
        await handleRemoveAdmin(adminId);
        refreshAdmins();
      }
    } else {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this admin?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await handleRemoveAdmin(adminId);
              refreshAdmins();
            }
          },
        ]
      );
    }
  };

  const renderAdminItem = ({ item, index }) => {
    // Additional safety check
    if (!item || !item._id) {
      return null;
    }

    return (
      <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}>
        <Text style={styles.indexCell}>{index + 1}</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.nameCell} numberOfLines={1}>
            {item.fullName || item.name || "N/A"}
          </Text>
          <Text style={styles.idCell} numberOfLines={1}>
            ID: {item.adminId || item._id || "N/A"}
          </Text>
        </View>
        <Text style={styles.emailCell} numberOfLines={2}>
          {item.email || "N/A"}
        </Text>
        <View style={styles.actionCell}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => confirmDelete(item._id)}
            disabled={loading}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admins</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={refreshAdmins}
            disabled={loading}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddAdminClick}
            disabled={loading}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading admins...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.indexHeader}>No.</Text>
              <Text style={[styles.tableHeaderCell, styles.nameHeader]}>Name</Text>
              <Text style={[styles.tableHeaderCell, styles.emailHeader]}>Email</Text>
              <Text style={styles.actionHeader}>Action</Text>
            </View>
            <FlatList
              data={validAdmins}
              renderItem={renderAdminItem}
              keyExtractor={(item, index) => item._id || `admin-${index}`}
              showsVerticalScrollIndicator={true}
              style={styles.flatList}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No admins found</Text>
                </View>
              )}
              // Add extra props for better error handling
              removeClippedSubviews={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#2c3e50",
    minWidth: 100,
  },
  headerButtons: { 
    flexDirection: "row", 
    gap: 10,
    flexWrap: "wrap",
  },
  refreshButton: { 
    backgroundColor: "#28a745", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 90,
  },
  refreshButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600",
    textAlign: "center",
  },
  addButton: { 
    backgroundColor: "#007bff", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 110,
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 18, 
    color: "#6c757d" 
  },
  errorContainer: { 
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",
    padding: 20,
  },
  errorText: { 
    color: "#dc3545", 
    fontSize: 18, 
    marginBottom: 16,
    textAlign: "center",
  },
  tableContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  table: { 
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#343a40",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14,
  },
  indexHeader: {
    flex: 0.8,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14,
  },
  nameHeader: {
    flex: 2.5,
  },
  emailHeader: {
    flex: 2.5,
  },
  actionHeader: {
    flex: 1.2,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    minHeight: 60,
  },
  tableRowEven: { 
    backgroundColor: "#f8f9fa" 
  },
  indexCell: {
    flex: 0.8,
    textAlign: "center", 
    fontSize: 14, 
    color: "#28a745",
    fontWeight: "bold",
  },
  nameContainer: {
    flex: 2.5,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  nameCell: {
    textAlign: "center", 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#007bff",
    marginBottom: 2,
  },
  idCell: {
    textAlign: "center", 
    fontSize: 11, 
    color: "#6c757d",
    fontStyle: "italic",
  },
  emailCell: {
    flex: 2.5,
    textAlign: "center", 
    fontSize: 12, 
    color: "#495057",
    paddingHorizontal: 4,
  },
  actionCell: {
    flex: 1.2,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    minWidth: 60,
  },
  deleteBtnText: { 
    color: "#fff", 
    fontSize: 11, 
    fontWeight: "600" 
  },
  emptyState: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: { 
    fontSize: 18, 
    color: "#6c757d", 
    textAlign: "center",
  },
});

export default AdminList;
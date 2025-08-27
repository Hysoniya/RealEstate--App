import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const router = useRouter();


const StaffManagedAppointments = ({
  appointments = [],
  loading,
  staffId,
  error,
  handleCancelAppointment,
  handleAcceptAppointment,
}) => {
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  useEffect(() => {
    console.log("Appointments received:", appointments);
  }, [appointments]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus =
      selectedStatus === "All" ||
      a.status.toLowerCase() === selectedStatus.toLowerCase();

    const fullName = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
    const email = (a.email || "").toLowerCase();
    const phone = (a.phoneNumber || "").toLowerCase();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>
        {`${item.firstName || ""} ${item.lastName || ""}`.trim() || "N/A"}
      </Text>
      <Text style={styles.cell}>{item.email || "N/A"}</Text>
      <Text style={styles.cell}>{item.phoneNumber || "N/A"}</Text>
      <Text style={[styles.cell, styles[item.status.toLowerCase()]]}>
        {item.status}
      </Text>
      <Text style={styles.cell}>
        {item.staffId ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedStaff(item.staffId);
              setIsStaffModalOpen(true);
            }}
          >
            <Text style={styles.linkText}>{item.staffId.staffId || "N/A"}</Text>
          </TouchableOpacity>
        ) : (
          "—"
        )}
      </Text>
      <Text style={styles.cell}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.cell}>
        {new Date(item.updatedAt).toLocaleDateString()}
      </Text>
      <Text style={styles.cell}>
        {item.isGuest ? (
          "Guest"
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleUserClick(item.userId)}
          >
            <Text style={styles.linkText}>User</Text>
          </TouchableOpacity>
        )}
      </Text>
      <View style={styles.cell}>
        {item.status.toLowerCase() === "pending" ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              activeOpacity={0.7}
              onPress={() => handleAcceptAppointment(item._id)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              activeOpacity={0.7}
              onPress={() => handleCancelAppointment(item._id)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : item.status.toLowerCase() !== "cancelled" ? (
          <TouchableOpacity
            style={[styles.button, styles.logsButton]}
            activeOpacity={0.7}
            onPress={() =>
              router.replace({
                pathname: "staff/appointment-details",
                params: {
                  appointmentId: item._id,
                  staffId: staffId,
                },
              })
            }
          >
            <Text style={styles.buttonText}>Logs</Text>
          </TouchableOpacity>
        ) : (
          <Text>-</Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={setSelectedStatus}
              style={styles.picker}
            >
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Accepted" value="Accepted" />
              <Picker.Item label="Scheduled" value="Scheduled" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
            </Picker>
          </View>
        </View>
      </View>

      {filteredAppointments.length > 0 ? (
        <ScrollView horizontal>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Full Name</Text>
              <Text style={styles.headerText}>Email</Text>
              <Text style={styles.headerText}>Phone</Text>
              <Text style={styles.headerText}>Status</Text>
              <Text style={styles.headerText}>Managed By</Text>
              <Text style={styles.headerText}>Created</Text>
              <Text style={styles.headerText}>Updated</Text>
              <Text style={styles.headerText}>Type</Text>
              <Text style={styles.headerText}>Action</Text>
            </View>
            <FlatList
              data={filteredAppointments}
              renderItem={renderAppointmentItem}
              keyExtractor={(item) => item._id}
            />
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.noAppointments}>No appointments available</Text>
      )}

      {/* User Details Modal */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>User Details</Text>
            {selectedUser && (
              <>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Name:</Text>{" "}
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Email:</Text>{" "}
                  {selectedUser.email}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Phone:</Text>{" "}
                  {selectedUser.phoneNumber}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Landline:</Text>{" "}
                  {selectedUser.landlineNumber || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>City:</Text>{" "}
                  {selectedUser.city || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Address:</Text>{" "}
                  {selectedUser.address || "N/A"}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Staff Details Modal */}
      <Modal visible={isStaffModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={() => {
                setIsStaffModalOpen(false);
                setSelectedStaff(null);
              }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Staff Details</Text>
            {selectedStaff && (
              <>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Staff ID:</Text>{" "}
                  {selectedStaff.staffId}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Full Name:</Text>{" "}
                  {selectedStaff.fullName}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Email:</Text>{" "}
                  {selectedStaff.email}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Phone:</Text>{" "}
                  {selectedStaff.phoneNumber}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Role:</Text>{" "}
                  {selectedStaff.role}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  filterContainer: { flexDirection: "row", alignItems: "center" },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    width: 150,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    width: 150,
  },
  picker: { height: 40, width: "100%" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: { fontWeight: "bold", width: 120, textAlign: "center" },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: { width: 120, textAlign: "center", paddingHorizontal: 4 },
  pending: { color: "#FFA500" },
  accepted: { color: "#008000" },
  cancelled: { color: "#FF0000" },
  actionButtons: { flexDirection: "row", justifyContent: "center" },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  acceptButton: { backgroundColor: "#008000" },
  rejectButton: { backgroundColor: "#FF0000" },
  logsButton: { backgroundColor: "#1E90FF" },
  linkText: { color: "#1E90FF", textDecorationLine: "underline" },
  noAppointments: { textAlign: "center", marginTop: 20, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  modalText: { marginBottom: 8 },
  boldText: { fontWeight: "bold" },
  closeButton: { alignSelf: "flex-end" },
  closeButtonText: { fontSize: 20, fontWeight: "bold" },
});

export default StaffManagedAppointments;

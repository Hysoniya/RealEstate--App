import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";

const AdminAppointment = ({ appointments, loading, error, handleRemoveAppointment }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState([]);

  const filteredAppointments = [...appointments]
    .reverse()
    .filter((a) => {
      const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const email = a.email.toLowerCase();
      const phone = a.phoneNumber.toLowerCase();
      const status = a.status.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      return (
        (selectedStatus === "all" || status === selectedStatus.toLowerCase()) &&
        (fullName.includes(searchTermLower) ||
          email.includes(searchTermLower) ||
          phone.includes(searchTermLower))
      );
    });

  const openStaffModal = (staff) => {
    setSelectedStaff(staff);
    setShowStaffModal(true);
  };

  const openUpdateModal = (updates) => {
    setSelectedUpdates(updates);
    setShowUpdateModal(true);
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentRow}>
      <Text style={styles.cell}>
        {`${item.firstName || ""} ${item.lastName || ""}`.trim() || "N/A"}
      </Text>
      <Text style={styles.cell}>{item.email || "N/A"}</Text>
      <Text style={styles.cell}>{item.phoneNumber || "N/A"}</Text>
      <Text style={[styles.cell, styles.status]}>{item.status}</Text>
      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => openStaffModal(item.staffId)}
        disabled={!item.staffId}
      >
        <Text style={styles.linkText}>{item.staffId?.staffId || "N/A"}</Text>
      </TouchableOpacity>
      <View style={styles.cell}>
        <Text>{new Date(item.updatedAt).toLocaleString()}</Text>
        <View style={styles.divider} />
        <Text>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={styles.cell}>{item.isGuest ? "Guest" : "User"}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => openUpdateModal(item.appointmentUpdates)}
        >
          <Feather name="eye" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleRemoveAppointment(item._id)}
        >
          <Feather name="trash-2" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUpdate = ({ item, index }) => (
    <View style={styles.updateRow}>
      <Text style={styles.updateCell}>{index + 1}</Text>
      <Text style={styles.updateCell}>{item.status}</Text>
      <Text style={styles.updateCell}>{item.appointmentType}</Text>
      <Text style={styles.updateCell}>{item.note}</Text>
      <Text style={styles.updateCell}>{item.staffId}</Text>
      <Text style={styles.updateCell}>
        {new Date(item.followUpDate).toLocaleDateString()}
      </Text>
      <Text style={styles.updateCell}>{new Date(item.updatedAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loading}>Loading appointments...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView style={styles.tableWrapper}>
          <View style={styles.headerRow}>
            <Text style={styles.headApp}>Appointments</Text>
            <View style={styles.searchFilterContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search here..."
              />
              <Picker
                selectedValue={selectedStatus}
                onValueChange={setSelectedStatus}
                style={styles.dropdown}
              >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Accepted" value="Accepted" />
                <Picker.Item label="Scheduled" value="Scheduled" />
                <Picker.Item label="In Progress" value="In Progress" />
                <Picker.Item label="Completed" value="Completed" />
                <Picker.Item label="Cancelled" value="Cancelled" />
              </Picker>
            </View>
          </View>

          {filteredAppointments.length > 0 ? (
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Full Name</Text>
                <Text style={styles.headerCell}>Email</Text>
                <Text style={styles.headerCell}>Phone</Text>
                <Text style={styles.headerCell}>Status</Text>
                <Text style={styles.headerCell}>Managed By</Text>
                <Text style={styles.headerCell}>Updated / Created</Text>
                <Text style={styles.headerCell}>Type</Text>
                <Text style={styles.headerCell}>Action</Text>
              </View>
              <FlatList
                data={filteredAppointments}
                renderItem={renderAppointment}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <Text style={styles.noAppointments}>
              No appointments found for selected status.
            </Text>
          )}
        </ScrollView>
      )}

      {/* Staff Modal */}
      <Modal
        isVisible={showStaffModal}
        onBackdropPress={() => setShowStaffModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedStaff ? (
            <>
              <Text style={styles.modalTitle}>Staff Details</Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>ID: </Text>
                {selectedStaff.staffId}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Name: </Text>
                {selectedStaff.fullName}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Email: </Text>
                {selectedStaff.email}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Phone: </Text>
                {selectedStaff.phoneNumber}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.modalLabel}>Role: </Text>
                {selectedStaff.role}
              </Text>
            </>
          ) : (
            <Text style={styles.modalText}>No staff data available.</Text>
          )}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowStaffModal(false)}
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Appointment Updates Modal */}
      <Modal
        isVisible={showUpdateModal}
        onBackdropPress={() => setShowUpdateModal(false)}
        style={styles.largeModal}
      >
        <View style={styles.largeModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Appointment Updates</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowUpdateModal(false)}
            >
              <Text style={styles.closeBtnText}>X</Text>
            </TouchableOpacity>
          </View>
          {selectedUpdates.length > 0 ? (
            <ScrollView style={styles.tableContainer}>
              <View style={styles.updateTableHeader}>
                <Text style={styles.updateHeaderCell}>#</Text>
                <Text style={styles.updateHeaderCell}>Status</Text>
                <Text style={styles.updateHeaderCell}>Type</Text>
                <Text style={styles.updateHeaderCell}>Note</Text>
                <Text style={styles.updateHeaderCell}>Staff ID</Text>
                <Text style={styles.updateHeaderCell}>Follow-up Date</Text>
                <Text style={styles.updateHeaderCell}>Updated At</Text>
              </View>
              <FlatList
                data={selectedUpdates.reverse()}
                renderItem={renderUpdate}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
              />
            </ScrollView>
          ) : (
            <Text style={styles.noUpdates}>No updates found.</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  loading: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "red",
    fontWeight: "500",
  },
  noAppointments: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  tableWrapper: {
    flex: 1,
  },
  headApp: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  searchFilterContainer: {
    flexDirection: "row",
    width: "50%",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 14,
  },
  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
  },
  appointmentRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  linkBtn: {
    flex: 1,
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  actionCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  detailsBtn: {
    padding: 5,
  },
  deleteBtn: {
    padding: 5,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalLabel: {
    fontWeight: "600",
  },
  closeBtn: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  largeModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  largeModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  tableContainer: {
    flex: 1,
  },
  updateTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
  },
  updateHeaderCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  updateRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  updateCell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  noUpdates: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});

export default AdminAppointment;
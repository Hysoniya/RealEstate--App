// app/staff/[staffId]/[appointmentId].jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function StaffAppointLogDetails() {
  const router = useRouter();
  const { staffId, appointmentId } = useLocalSearchParams();

  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateList, setUpdateList] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [note, setNote] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const fetchAppointment = async () => {
    try {
      const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/staff/get-appointment/${appointmentId}/details`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const appt = data.appointmentDetails;
      setAppointment(appt);
      setStatus(appt.latestUpdate?.status || appt.status || "");
      setNote(appt.latestUpdate?.note || "");
      setAppointmentType(appt.latestUpdate?.appointmentType || "");
      setFollowUpDate(appt.latestUpdate?.followUpDate?.split("T")[0] || "");
    } catch {
      Toast.show({ type: "error", text1: "Unable to fetch appointment details." });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentLogs = async () => {
    try {
      const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;
      const response = await axios.get(`${baseURL}/api/staff/appointment/${appointmentId}/logs`);
      if (response.data.success) {
        const sortedUpdates = response.data.updates.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setUpdateList(sortedUpdates);
      }
    } catch {
      Toast.show({ type: "error", text1: "Failed to fetch appointment update logs." });
    }
  };

  const handleUpdate = async () => {
    try {
      const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseURL}/api/staff/appointment/${appointmentId}/update-log`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note,
          appointmentType,
          followUpDate,
          staffId,
        }),
      });

      if (!response.ok) throw new Error();
      Toast.show({ type: "success", text1: "Appointment update saved successfully!" });
      setShowAddForm(false);
      fetchAppointment();
      fetchAppointmentLogs();
    } catch {
      Toast.show({ type: "error", text1: "Failed to update appointment." });
    }
  };

  useEffect(() => {
    fetchAppointment();
    fetchAppointmentLogs();
  }, [appointmentId]);

  return (
    <View style={styles.pageWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/staff")}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Appointment Details</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : appointment ? (
          <View style={styles.flexLayout}>
            {/* Left: Appointment Info */}
            <View style={styles.detailsTableWrapper}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appointment Information</Text>
                <Text>ID: {appointment._id}</Text>
                <Text>Status: {appointment.status}</Text>
                <Text>Created: {new Date(appointment.createdAt).toLocaleString()}</Text>
                <Text>Last Updated: {new Date(appointment.updatedAt).toLocaleString()}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Person</Text>
                <Text>{appointment.firstName} {appointment.lastName}</Text>
                <Text>Email: {appointment.email}</Text>
                <Text>Phone: {appointment.phoneNumber}</Text>
                <Text>User Type: {appointment.isGuest ? "Guest User" : "Registered User"}</Text>
              </View>

              {!appointment.isGuest && appointment.userId && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Registered User Details</Text>
                  <Text>{appointment.userId.firstName} {appointment.userId.lastName}</Text>
                  <Text>Email: {appointment.userId.email}</Text>
                  <Text>Address: {appointment.userId.address || "N/A"}</Text>
                </View>
              )}

              {appointment.staffId && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Staff In Charge</Text>
                  <Text>{appointment.staffId.fullName}</Text>
                  <Text>Role: {appointment.staffId.role}</Text>
                  <Text>Email: {appointment.staffId.email}</Text>
                  <Text>Phone: {appointment.staffId.phoneNumber}</Text>
                </View>
              )}
            </View>

            {/* Right: Updates */}

            {/* <View style={styles.formWrapper}>
              <Text style={styles.formHeading}>Appointment Updates</Text>
              {appointment.status !== "Completed" && (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    setShowAddForm(true);
                    setStatus("");
                    setNote("");
                    setAppointmentType("");
                    setFollowUpDate("");
                  }}
                >
                  <Text style={styles.buttonText}>+ Add Update</Text>
                </TouchableOpacity>
              )}

              {updateList.length > 0 ? (
                updateList.map((update, index) => (
                  <View key={index} style={styles.updateItem}>
                    <Text>Status: {update.status}</Text>
                    <Text>Type: {update.appointmentType}</Text>
                    {update.followUpDate && <Text>Follow-up: {new Date(update.followUpDate).toLocaleDateString()}</Text>}
                    <Text>Updated At: {new Date(update.updatedAt).toLocaleString()}</Text>
                    <Text>Note: {update.note}</Text>
                  </View>
                ))
              ) : (
                <Text>No updates added yet.</Text>
              )}
            </View> */}
          </View>
        ) : (
          <Text>No appointment found.</Text>
        )}

        {/* Modal for Add Form */}
        <Modal visible={showAddForm} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddForm(false)}>
                <Text style={{ color: "#fff" }}>×</Text>
              </TouchableOpacity>

              <Text style={styles.formHeading}>Appointment Activity Log</Text>

              <Text>Status</Text>
              <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholder="Status" />

              <Text>Appointment Type</Text>
              <TextInput style={styles.input} value={appointmentType} onChangeText={setAppointmentType} placeholder="Type" />

              <Text>Next Follow-up Date</Text>
              <TextInput style={styles.input} value={followUpDate} onChangeText={setFollowUpDate} placeholder="YYYY-MM-DD" />

              <Text>Notes</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={note}
                onChangeText={setNote}
                multiline
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save Activity Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50, // slightly smaller to fit phones
  },
  container: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
  },
  heading: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  flexLayout: {
    flexDirection: "column",
  },
  detailsTableWrapper: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  formWrapper: {
    backgroundColor: "#eaeaea",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  formHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  updateItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    width: "100%",
    maxHeight: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
});

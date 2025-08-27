import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { FontAwesome5 } from "@expo/vector-icons";
import { addEmployee } from '@/redux/Auth/AuthSlice';

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);
  const dispatch = useDispatch();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (showModal) {
      // Reset state
      setForm({ fullName: "", email: "", password: "" });
      setErrors({});
      setShowPassword(false);
      // Animate in
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => nameInputRef.current?.focus(), 100);
      });
    } else {
      // Reset animations
      overlayOpacity.setValue(0);
      modalScale.setValue(0.8);
      modalTranslateY.setValue(50);
    }
  }, [showModal]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setStaffList(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { fullName, email, password } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    else if (fullName.length < 2) newErrors.fullName = "Name must be at least 2 characters";
    
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
    
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setModalLoading(true);
    try {
      const credentials = {
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: 'staff'
      };
      const res = await dispatch(addEmployee(credentials));
      if (res.error) throw new Error(res.payload?.message || 'Signup failed');
      Toast.show({ type: 'success', text1: 'Staff added successfully' });
      closeModal();
      fetchStaff();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    let proceed = false;
    if (Platform.OS === 'web') {
      proceed = window.confirm("Are you sure you want to delete this staff member?");
    } else {
      proceed = await new Promise(res => {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this staff member?",
          [
            { text: "Cancel", style: "cancel", onPress: () => res(false) },
            { text: "Delete", style: "destructive", onPress: () => res(true) }
          ],
          { cancelable: true }
        );
      });
    }
    if (!proceed) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/staff/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error();
      Toast.show({ type: 'success', text1: 'Staff deleted successfully' });
      fetchStaff();
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete staff.' });
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    if (modalLoading) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowModal(false));
  };

  const renderStaffItem = ({ item, index }) => (
    <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}>
      <Text style={styles.indexCell}>{index + 1}</Text>
      <View style={styles.nameContainer}>
        <Text style={styles.nameCell} numberOfLines={1}>{item.fullName}</Text>
        <Text style={styles.idCell} numberOfLines={1}>ID: {item.staffId || "N/A"}</Text>
      </View>
      <Text style={styles.emailCell} numberOfLines={2}>{item.email}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item._id)}
          disabled={loading}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Staff Management</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={fetchStaff}
            disabled={loading}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openModal}
            disabled={loading}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Staff</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading staff...</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.indexHeader}>S.no.</Text>
              <Text style={[styles.tableHeaderCell, styles.nameHeader]}>Name</Text>
              <Text style={[styles.tableHeaderCell, styles.emailHeader]}>Email</Text>
              <Text style={styles.actionHeader}>Action</Text>
            </View>
            <FlatList
              data={staffList}
              renderItem={renderStaffItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={true}
              style={styles.flatList}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No staff members found</Text>
                </View>
              )}
            />
          </View>
        </View>
      )}

      {/* Updated Modal with CustomModal styling */}
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
            <Pressable
              style={styles.overlayPress}
              onPress={closeModal}
              disabled={modalLoading}
            />
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [
                      { scale: modalScale },
                      { translateY: modalTranslateY },
                    ],
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.headerGradient} />
                  <View style={styles.headerContent}>
                    <View style={styles.headerIconContainer}>
                      <FontAwesome5 name="user-plus" size={20} color="#ffffff" />
                    </View>
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.headerTitle}>Add New Staff</Text>
                      <Text style={styles.headerSubtitle}>
                        Create staff member account
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.closeButton}
                      disabled={modalLoading}
                    >
                      <FontAwesome5 name="times" size={18} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <FontAwesome5 name="user" size={14} color="#475569" /> Full Name
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        errors.fullName && styles.inputError,
                      ]}
                    >
                      <TextInput
                        ref={nameInputRef}
                        style={styles.input}
                        value={form.fullName}
                        onChangeText={(text) => handleChange("fullName", text)}
                        placeholder="Enter full name"
                        placeholderTextColor="#94a3b8"
                        autoCapitalize="words"
                        autoCorrect={false}
                        editable={!modalLoading}
                      />
                      <FontAwesome5 name="id-card" size={16} color="#94a3b8" />
                    </View>
                    {errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <FontAwesome5 name="envelope" size={14} color="#475569" /> Email
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        errors.email && styles.inputError,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        value={form.email}
                        onChangeText={(text) => handleChange("email", text)}
                        placeholder="Enter email address"
                        placeholderTextColor="#94a3b8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!modalLoading}
                      />
                      <FontAwesome5 name="at" size={16} color="#94a3b8" />
                    </View>
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <FontAwesome5 name="lock" size={14} color="#475569" /> Password
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        errors.password && styles.inputError,
                      ]}
                    >
                      <TextInput
                        style={styles.input}
                        value={form.password}
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => handleChange("password", text)}
                        placeholder="Enter secure password"
                        placeholderTextColor="#94a3b8"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!modalLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                        disabled={modalLoading}
                      >
                        <FontAwesome5
                          name={showPassword ? "eye-slash" : "eye"}
                          size={16}
                          color="#94a3b8"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.securityNote}>
                    <FontAwesome5 name="shield-alt" size={14} color="#059669" />
                    <Text style={styles.securityNoteText}>
                      Password must be at least 6 characters long
                    </Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={[styles.button, styles.cancelButton]}
                      disabled={modalLoading}
                    >
                      <Text
                        style={[
                          styles.cancelButtonText,
                          modalLoading && styles.disabledText,
                        ]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[
                        styles.button,
                        styles.submitButton,
                        modalLoading && styles.disabledButton,
                      ]}
                      disabled={modalLoading}
                    >
                      {modalLoading ? (
                        <View style={styles.loadingButtonContainer}>
                          <FontAwesome5
                            name="spinner"
                            size={16}
                            color="#ffffff"
                          />
                          <Text style={styles.submitButtonText}>Adding...</Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <FontAwesome5 name="plus" size={16} color="#ffffff" />
                          <Text style={styles.submitButtonText}>Add Staff</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
      <Toast topOffset={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles for the main component
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
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: "center",
    minWidth: 60,
  },
  deleteBtnText: { 
    color: "#fff", 
    fontSize: 12, 
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

  // Updated Modal styles matching CustomModal
  modalContainer: { 
    flex: 1 
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayPress: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: isTablet ? Math.min(500, width * 0.8) : width * 0.9,
    maxWidth: 500,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 15 },
    }),
  },
  modalHeader: {
    position: "relative",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#475569",
    overflow: "hidden",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#334155",
    opacity: 0.9,
  },
  headerContent: { 
    flexDirection: "row", 
    alignItems: "center", 
    zIndex: 1 
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerTextContainer: { 
    flex: 1 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    fontWeight: "400",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  formContainer: { 
    padding: 24 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  inputError: { 
    borderColor: "#ef4444", 
    backgroundColor: "#fef2f2" 
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "400",
    paddingVertical: 0,
  },
  eyeButton: { 
    padding: 4, 
    marginLeft: 8 
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  securityNoteText: {
    fontSize: 12,
    color: "#166534",
    marginLeft: 8,
    fontWeight: "500",
  },
  buttonContainer: { 
    flexDirection: "row", 
    gap: 12 
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 52,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  cancelButton: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButtonText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#64748b" 
  },
  submitButton: { 
    backgroundColor: "#475569" 
  },
  disabledButton: { 
    backgroundColor: "#94a3b8" 
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  buttonContent: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  loadingButtonContainer: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  disabledText: { 
    opacity: 0.6 
  },
});

export default StaffManagement;
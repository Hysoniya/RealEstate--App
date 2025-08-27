import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { addEmployee } from "@/redux/Auth/AuthSlice";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const CustomModal = ({ show, handleClose, onAdminAdded, refreshAdmins }) => {
  const [addAdmin, setAddAdmin] = useState({ 
    fullName: "",
    adminId: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation values
  const overlayOpacity = useState(new Animated.Value(0))[0];
  const modalScale = useState(new Animated.Value(0.8))[0];
  const modalTranslateY = useState(new Animated.Value(50))[0];

  // Ref for auto-focus
  const nameInputRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      // Reset state
      setAddAdmin({ fullName: "", adminId: "", password: "" });
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
        // Auto-focus on the full name field after animation
        setTimeout(() => nameInputRef.current?.focus(), 100);
      });
    } else {
      // Reset animations
      overlayOpacity.setValue(0);
      modalScale.setValue(0.8);
      modalTranslateY.setValue(50);
    }
  }, [show]);

  const validateForm = () => {
    const newErrors = {};
    const { fullName, adminId, password } = addAdmin;

    // Full name validation
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    else if (fullName.length < 2) newErrors.fullName = "Name must be at least 2 characters";

    // Admin ID validation
    if (!adminId.trim()) newErrors.adminId = "Admin ID is required";
    else if (adminId.length < 3) newErrors.adminId = "Admin ID must be at least 3 characters";

    // Password validation
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const credentials = {
        name: addAdmin.fullName,
        email: addAdmin.adminId,
        password: addAdmin.password,
        role: "admin",
      };
      const res = await dispatch(addEmployee(credentials));
      if (res.error) {
        throw new Error(res.payload?.message || "Signup failed");
      }

      // Show success toast
      Toast.show({ 
        type: "success", 
        text1: "Admin added successfully",
        visibilityTime: 3000,
        topOffset: Platform.OS === 'ios' ? 50 : 25,
        position: 'top'
      });

      // Notify parent and refresh data
      onAdminAdded?.(res.payload);
      refreshAdmins?.();
      handleClose();
    } catch (err) {
      // Show error toast
      Toast.show({ 
        type: "error", 
        text1: "Error", 
        text2: err.message,
        visibilityTime: 4000,
        topOffset: Platform.OS === 'ios' ? 50 : 25,
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAddAdmin({ ...addAdmin, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const closeModal = async () => {
    if (loading) return;

    // Check if form has data and show confirmation alert
    const hasData = addAdmin.fullName.trim() || addAdmin.adminId.trim() || addAdmin.password.trim();
    
    if (hasData) {
      let proceed = false;
      if (Platform.OS === 'web') {
        proceed = window.confirm("Are you sure you want to close? All unsaved changes will be lost.");
      } else {
        proceed = await new Promise(resolve => {
          Alert.alert(
            "Confirm Close",
            "Are you sure you want to close? All unsaved changes will be lost.",
            [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              { text: "Close", style: "destructive", onPress: () => resolve(true) }
            ],
            { cancelable: true }
          );
        });
      }
      if (!proceed) return;
    }

    // Animate out
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
    ]).start(() => handleClose());
  };

  return (
    <Modal
      visible={show}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable
            style={styles.overlayPress}
            onPress={closeModal}
            disabled={loading}
          />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [
                    { scale: modalScale },
                    { translateY: modalTranslateY },
                  ],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerGradient} />
                <View style={styles.headerContent}>
                  <View style={styles.headerIconContainer}>
                    <FontAwesome5 name="user-plus" size={20} color="#ffffff" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Add New Admin</Text>
                    <Text style={styles.headerSubtitle}>
                      Create administrator account
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                    disabled={loading}
                  >
                    <FontAwesome5 name="times" size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* Full Name Field */}
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
                      value={addAdmin.fullName}
                      onChangeText={(text) => handleChange("fullName", text)}
                      placeholder="Enter full name"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="words"
                      autoCorrect={false}
                      editable={!loading}
                    />
                    <FontAwesome5 name="id-card" size={16} color="#94a3b8" />
                  </View>
                  {errors.fullName && (
                    <Text style={styles.errorText}>{errors.fullName}</Text>
                  )}
                </View>

                {/* Admin ID Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <FontAwesome5 name="envelope" size={14} color="#475569" /> Admin ID (Email)
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      errors.adminId && styles.inputError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      value={addAdmin.adminId}
                      onChangeText={(text) => handleChange("adminId", text)}
                      placeholder="Enter admin email address"
                      placeholderTextColor="#94a3b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                    <FontAwesome5 name="at" size={16} color="#94a3b8" />
                  </View>
                  {errors.adminId && (
                    <Text style={styles.errorText}>{errors.adminId}</Text>
                  )}
                </View>

                {/* Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <FontAwesome5 name="lock" size={14} color="#475569" />{" "}
                    Password
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      errors.password && styles.inputError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      value={addAdmin.password}
                      secureTextEntry={!showPassword}
                      onChangeText={(text) => handleChange("password", text)}
                      placeholder="Enter secure password"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      disabled={loading}
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
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.cancelButtonText,
                        loading && styles.disabledText,
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onSubmit}
                    style={[
                      styles.button,
                      styles.submitButton,
                      loading && styles.disabledButton,
                    ]}
                    disabled={loading}
                  >
                    {loading ? (
                      <View style={styles.loadingContainer}>
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
                        <Text style={styles.submitButtonText}>Add Admin</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
      {/* Add Toast component for mobile compatibility */}
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayPress: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
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
  header: {
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
  headerContent: { flexDirection: "row", alignItems: "center", zIndex: 1 },
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
  headerTextContainer: { flex: 1 },
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
  formContainer: { padding: 24 },
  inputGroup: { marginBottom: 20 },
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
  inputError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "400",
    paddingVertical: 0,
  },
  eyeButton: { padding: 4, marginLeft: 8 },
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
  buttonContainer: { flexDirection: "row", gap: 12 },
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
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#64748b" },
  submitButton: { backgroundColor: "#475569" },
  disabledButton: { backgroundColor: "#94a3b8" },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  loadingContainer: { flexDirection: "row", alignItems: "center" },
  disabledText: { opacity: 0.6 },
});

export default CustomModal;
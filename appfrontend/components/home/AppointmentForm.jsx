import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AppointmentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyType: "",
    budget: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const propertyTypes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa", "Plot"];
  const budgetRanges = [
    "Under ₹25 L",
    "₹25L - ₹50L",
    "₹50L - ₹75L",
    "₹75L - ₹1 Cr",
    "₹1 Cr - ₹2 Cr",
    "Above ₹2 Cr",
  ];
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

 const handleSubmit = async () => {
  const { firstName, lastName, email, phone } = formData;

  // Validate required fields from schema
  if (!firstName || !lastName || !email || !phone) {
    Alert.alert("Error", "Please fill in all required fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Error", "Please enter a valid email address");
    return;
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    Alert.alert("Error", "Please enter a valid 10-digit phone number");
    return;
  }

  setLoading(true);
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  try {
    // Get token and validate
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Alert.alert("Error", "Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    // Prepare data according to AppointmentSchema

    // firstName, lastName, email, phone --> backend expected fields
    const appointmentData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\D/g, ""),
      isGuest: true,
      status: "Pending",
      // Include additional fields if required by server
      // propertyType: formData.propertyType,
      // budget: formData.budget,
      // preferredDate: formData.preferredDate,
      // preferredTime: formData.preferredTime,
      // message: formData.message,
    };

    const response = await fetch(`${apiUrl}/api/appointments/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to book appointment");
    }

    Alert.alert("Success!", "Your appointment has been booked successfully.", [
      { text: "OK", onPress: onClose },
    ]);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      propertyType: "",
      budget: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    Alert.alert("Error", error.message || "Failed to book appointment. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const DropdownField = ({ placeholder, value, options, onSelect }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownPlaceholder}>{placeholder}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.optionsScroll}
      >
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              value === option && styles.selectedOption,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                value === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Book Appointment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <View
                style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}
              >
                <Ionicons name="person-outline" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData("firstName", value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData("lastName", value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Email Address *"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                value={formData.phone}
                onChangeText={(value) => updateFormData("phone", value)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <DropdownField
              placeholder="Property Type"
              value={formData.propertyType}
              options={propertyTypes}
              onSelect={(value) => updateFormData("propertyType", value)}
            />

            <DropdownField
              placeholder="Budget Range"
              value={formData.budget}
              options={budgetRanges}
              onSelect={(value) => updateFormData("budget", value)}
            />

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Preferred Date (DD/MM/YYYY)"
                value={formData.preferredDate}
                onChangeText={(value) => updateFormData("preferredDate", value)}
              />
            </View>

            <DropdownField
              placeholder="Preferred Time"
              value={formData.preferredTime}
              options={timeSlots}
              onSelect={(value) => updateFormData("preferredTime", value)}
            />

            <View style={styles.textAreaContainer}>
              <Ionicons name="chatbubble-outline" size={20} color="#666" />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional Message (Optional)"
                value={formData.message}
                onChangeText={(value) => updateFormData("message", value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <View style={styles.loadingContainer}>
                {loading ? (
                  <Text style={styles.submitButtonText}>Booking...</Text>
                ) : (
                  <>
                    <Ionicons name="calendar-outline" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>
                      Book Appointment
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              * Required fields. We'll contact you within 24 hours to confirm
              your appointment.
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "95%",
    maxWidth: 450,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  textAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    minHeight: 80,
    paddingTop: 0,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  optionsScroll: {
    flexDirection: "row",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disclaimer: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 10,
  },
});

export default AppointmentForm;

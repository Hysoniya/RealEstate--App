// {/* <ScrollView contentContainerStyle={styles.container}>
//   {/* Navbar here if you have one */}
//   {/* <Navbar/> */}/
//   <Navbar_local /> */}


import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const TitleSearchServices = () => {
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState(null);

  const [formData, setFormData] = useState({
    propertyAddress: '',
    PropertyCity: '',
    PropertyState: '',
    propertyType: '',
    PropertyRegistrationNumber: '',
    ContactFullName: '',
    ContactEmail: '',
    ContactPhone: '',
    ContactNotes: '',
    Documents: [],
  });

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.Documents];
    updatedFiles.splice(index, 1);
    setFormData({ ...formData, Documents: updatedFiles });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  
  const Navbar_local = () => {
    const router = useRouter();
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          marginTop: 0,
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
          style={{ color: "#fff", fontWeight: "bold", fontSize: 20, flex: 1 }}
        >
          Title Search
        </Text>
      </View>
    );
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newFiles = result.assets.filter(
          (file) =>
            !formData.Documents.some(
              (existingFile) =>
                existingFile.name === file.name && existingFile.size === file.size
            )
        );
        setFormData({
          ...formData,
          Documents: [...formData.Documents, ...newFiles],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick documents');
    }
  };

  const handleSubmit = async () => {
    if (!formData.propertyAddress || !formData.ContactFullName || !formData.ContactEmail || !formData.ContactPhone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'Documents') {
          value.forEach((file) => {
            data.append('Documents', {
              uri: file.uri,
              name: file.name,
              type: file.mimeType,
            });
          });
        } else {
          data.append(key, value);
        }
      });

      // Replace with your actual backend URL
      const baseURL = 'YOUR_BACKEND_URL';
      const response = await fetch(
        `${baseURL}/api/title-search/create-request`,
        {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Something went wrong.');
      }

      const result = await response.json();
      Alert.alert('Success', 'Request submitted successfully!');
      setSubmittedRequestId(result.requestId);
      setShowModal(false);
      setFormData({
        propertyAddress: '',
        PropertyCity: '',
        PropertyState: '',
        propertyType: '',
        PropertyRegistrationNumber: '',
        ContactFullName: '',
        ContactEmail: '',
        ContactPhone: '',
        ContactNotes: '',
        Documents: [],
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const ServiceCard = ({ icon, title, items, iconColor = '#0066cc' }) => (
    <View style={styles.card}>
      <Ionicons name={icon} size={32} color={iconColor} style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardList}>
        {items.map((item, index) => (
          <Text key={index} style={styles.cardListItem}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Navbar_local/>
        {/* Request ID Display */}
        {submittedRequestId && (
          <View style={styles.requestIdBox}>
            <TouchableOpacity
              style={styles.closeRequestId}
              onPress={() => setSubmittedRequestId(null)}
            >
              <Ionicons name="close" size={20} color="#2d572c" />
            </TouchableOpacity>
            <Text style={styles.requestIdText}>
              ✅ <Text style={styles.boldText}>Your Request ID:</Text> {submittedRequestId}
            </Text>
            <Text style={styles.requestIdSubtext}>Please save this for future reference.</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>🔍 Property Title Search Services</Text>
          <Text style={styles.subtitle}>
            Ensure your next property deal is legally sound and secure with our trusted verification service.
          </Text>
        </View>

        {/* Service Cards */}
        <View style={styles.cardsContainer}>
          <ServiceCard
            icon="document-text-outline"
            title="What's Included"
            items={[
              '✅ Title Ownership History',
              '✅ Encumbrance & Mortgage Check',
              '✅ Dispute & Litigation Check',
              '✅ Chain of Title Verification',
              '✅ Final Legal Opinion Report',
            ]}
          />

          <ServiceCard
            icon="scale-outline"
            title="Why Choose Us"
            items={[
              '✔ Experienced Real Estate Lawyers',
              '✔ Pan-India Coverage',
              '✔ 100% Confidentiality',
              '✔ Fast Turnaround – 5 Days',
              '✔ 24/7 Support',
            ]}
          />

          <ServiceCard
            icon="star-outline"
            title="Service Plans"
            items={[
              '🏠 Residential Property – ₹1999',
              '🏢 Commercial Property – ₹2999',
              '🌳 Land/Plot – ₹3499',
              '🧾 Custom Legal Opinion – On Request',
            ]}
          />
        </View>

        {/* Testimonials */}
        <View style={styles.testimonials}>
          <Text style={styles.testimonialsTitle}>💬 What Our Clients Say</Text>
          <Text style={styles.testimonial}>
            "Saved me from a disputed property. Very professional." – <Text style={styles.italic}>Arjun P., Mumbai</Text>
          </Text>
          <Text style={styles.testimonial}>
            "Fast, reliable, and accurate. Worth every rupee!" – <Text style={styles.italic}>Sneha R., Bangalore</Text>
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => setShowModal(true)}>
          <Text style={styles.ctaButtonText}>Get Title Search Now</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          * All services include a downloadable report. Additional charges apply for physical copies.
        </Text>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top + 20 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔐 Request Title Search</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color="#003366" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Property Details</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Property Address"
                value={formData.propertyAddress}
                onChangeText={(text) => handleChange('propertyAddress', text)}
                multiline
              />

              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.PropertyCity}
                onChangeText={(text) => handleChange('PropertyCity', text)}
              />

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.PropertyState}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleChange('PropertyState', itemValue)}
                >
                  <Picker.Item label="Select State" value="" />
                  <Picker.Item label="Maharashtra" value="Maharashtra" />
                  <Picker.Item label="Karnataka" value="Karnataka" />
                  <Picker.Item label="Delhi" value="Delhi" />
                </Picker>
              </View>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.propertyType}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleChange('propertyType', itemValue)}
                >
                  <Picker.Item label="Select Property Type" value="" />
                  <Picker.Item label="Residential" value="Residential" />
                  <Picker.Item label="Commercial" value="Commercial" />
                  <Picker.Item label="Land" value="Land" />
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Registration Number (Optional)"
                value={formData.PropertyRegistrationNumber}
                onChangeText={(text) => handleChange('PropertyRegistrationNumber', text)}
              />

              <TouchableOpacity style={styles.fileUploadButton} onPress={handleDocumentPick}>
                <Ionicons name="folder-outline" size={20} color="#0066cc" />
                <Text style={styles.fileUploadText}>
                  {formData.Documents.length === 0 ? 'Click to upload documents' : `${formData.Documents.length} file(s) selected`}
                </Text>
              </TouchableOpacity>

              {formData.Documents.length > 0 && (
                <View style={styles.fileList}>
                  {formData.Documents.map((file, index) => (
                    <View key={index} style={styles.fileChip}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                        <Ionicons name="close-circle" size={16} color="#ff5252" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Your Contact Info</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.ContactFullName}
                onChangeText={(text) => handleChange('ContactFullName', text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.ContactEmail}
                onChangeText={(text) => handleChange('ContactEmail', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.ContactPhone}
                onChangeText={(text) => handleChange('ContactPhone', text)}
                keyboardType="phone-pad"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional notes"
                value={formData.ContactNotes}
                onChangeText={(text) => handleChange('ContactNotes', text)}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  requestIdBox: {
    backgroundColor: '#e6f9e6',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#b2d8b2',
  },
  closeRequestId: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  requestIdText: {
    color: '#2d572c',
    fontSize: 16,
    textAlign: 'center',
  },
  requestIdSubtext: {
    color: '#2d572c',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 12,
  },
  cardList: {
    gap: 8,
  },
  cardListItem: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  testimonials: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
  },
  testimonialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 16,
    textAlign: 'center',
  },
  testimonial: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  italic: {
    fontStyle: 'italic',
  },
  ctaButton: {
    backgroundColor: '#0047ab',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  fileUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#aaa',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  fileUploadText: {
    marginLeft: 10,
    color: '#0066cc',
    fontSize: 16,
  },
  fileList: {
    marginBottom: 16,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e1f5fe',
    padding: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  fileName: {
    color: '#0077b6',
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#0055ff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TitleSearchServices;
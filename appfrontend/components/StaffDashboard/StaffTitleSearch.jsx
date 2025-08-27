import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
 
const { width } = Dimensions.get("window");
 
// Contact Modal
const ContactModal = ({ visible, onClose, selectedItem }) => {
  if (!selectedItem) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>👤 Contact Details</Text>
          <View style={styles.modalScrollContent}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Name:</Text>
              <Text style={styles.contactValue}>{selectedItem.ContactFullName}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={[styles.contactValue, styles.emailText]}>{selectedItem.ContactEmail}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactValue}>{selectedItem.ContactPhone}</Text>
            </View>
            {selectedItem.ContactNotes && (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Notes:</Text>
                <Text style={styles.contactValue}>{selectedItem.ContactNotes}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
 
// Documents Modal
const DocumentsModal = ({ visible, onClose, selectedItem }) => {
  const viewDocument = (url) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };
 
  if (!selectedItem?.propertyDocuments) return null;
 
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>📂 Documents</Text>
          <View style={styles.modalScrollContent}>
            {selectedItem.propertyDocuments.map((doc, idx) => (
              <View key={idx} style={styles.documentItem}>
                <Text style={styles.documentLabel}>Document {idx + 1}</Text>
                <TouchableOpacity onPress={() => viewDocument(doc.url)} style={styles.documentBtn}>
                  <Text style={styles.documentBtnText}>🔍 View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};
 
const StaffTitleSearch = ({ titleSearchRequest = [] }) => {
  const [filterType, setFilterType] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
 
  const filteredData = titleSearchRequest
    .filter((item) => (filterType === "All" ? true : item.propertyType === filterType))
    .filter((item) => (searchId.trim() === "" ? true : item._id.includes(searchId.trim())));
 
  const openContactModal = (item) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };
  const openDocumentsModal = (item) => {
    setSelectedItem(item);
    setShowDocumentsModal(true);
  };
 
  const renderCard = (item) => (
    <View key={item._id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Request ID: {item._id}</Text>
        <View style={styles.propertyTypeBadge}>
          <Text style={styles.propertyTypeText}>{item.propertyType}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.row}><Text style={styles.label}>City:</Text><Text style={styles.value}>{item.PropertyCity}</Text></View>
        <View style={styles.row}><Text style={styles.label}>State:</Text><Text style={styles.value}>{item.PropertyState}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Address:</Text><Text style={styles.value} numberOfLines={2}>{item.propertyAddress}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Reg No:</Text><Text style={styles.value}>{item.PropertyRegistrationNumber || "-"}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Requested On:</Text><Text style={styles.value}>{new Date(item.createdAt).toLocaleDateString()}</Text></View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => openContactModal(item)}>
          <Text style={styles.btnText}>👤 Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.secondaryBtn,
            !(item.propertyDocuments?.length) && styles.disabledBtn,
          ]}
          disabled={!(item.propertyDocuments?.length)}
          onPress={() => openDocumentsModal(item)}
        >
          <Text
            style={[
              styles.btnText,
              !(item.propertyDocuments?.length) && styles.disabledBtnText,
            ]}
          >
            📁 {item.propertyDocuments?.length ? "Documents" : "No Docs"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
 
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>🔍 Title Search Requests</Text>
        </View>
        <View style={styles.controls}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterType}
              onValueChange={(val) => setFilterType(val)}
              style={styles.picker}
            >
              <Picker.Item label="All Types" value="All" />
              <Picker.Item label="Residential" value="Residential" />
              <Picker.Item label="Commercial" value="Commercial" />
              <Picker.Item label="Land" value="Land" />
            </Picker>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Request ID"
            value={searchId}
            onChangeText={setSearchId}
            placeholderTextColor="#999"
          />
        </View>
 
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredData.length > 0 ? (
            filteredData.map(renderCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No requests found</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
 
      <ContactModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
        selectedItem={selectedItem}
      />
      <DocumentsModal
        visible={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        selectedItem={selectedItem}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  searchInput: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#dee2e6',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#212529',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  propertyTypeBadge: {
    backgroundColor: '#0056b3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    width: 80,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: '#212529',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryBtn: {
    backgroundColor: '#0056b3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#e9ecef',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledBtnText: {
    color: '#6c757d',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: width - 40,
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 12,
    padding: 0,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  closeBtnText: {
    fontSize: 28,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#212529',
    paddingHorizontal: 20,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contactRow: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#212529',
  },
  emailText: {
    color: '#0056b3',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  documentLabel: {
    fontSize: 16,
    color: '#212529',
    flex: 1,
  },
  documentBtn: {
    backgroundColor: '#0056b3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  documentBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
 
export default StaffTitleSearch;
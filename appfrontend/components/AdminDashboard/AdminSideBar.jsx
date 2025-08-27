import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
  SafeAreaView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
 
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
 
const AdminSideBar = ({
  activeSection,
  handleSectionChange,
  handleShowModal,
  handleLogout,
  sidebarVisible,
  setSidebarVisible,
   isTablet
}) => {
  const menuItems = [
    { label: "Admin Profile", key: "adminProfile", icon: "person" },
    { label: "Users Detail", key: "adminDashUserDetails", icon: "people" },
    { label: "Appointments", key: "appointments", icon: "calendar" },
    { label: "Property Verification", key: "propertyVerification", icon: "home" },
    { label: "Reviews", key: "reviews", icon: "star" },
    { label: "Enquiries", key: "enquiries", icon: "mail" },
    { label: "Admins", key: "adminsList", icon: "shield" },
    { label: "Staff Management", key: "staffManagement", icon: "people-circle" },
    { label: "Staff Performance", key: "staffPerformance", icon: "bar-chart" },
    { label: "Contractor Verification", key: "contractorVerification", icon: "shield-checkmark" },
  ];
 
  const SidebarContent = () => (
    <SafeAreaView style={styles.sidebarContainer}>
      <View style={styles.sidebarHeader}>
        {!isTablet && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSidebarVisible(false)}
          >
            <Ionicons name="close" size={24} color="#4b5563" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </View>
 
      <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => handleSectionChange(item.key)}
            style={[
              styles.menuItem,
              activeSection === item.key && styles.activeMenuItem
            ]}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={activeSection === item.key ? "#ffffff" : "#4b5563"}
              style={styles.icon}
            />
            <Text style={[
              styles.menuText,
              activeSection === item.key && styles.activeMenuText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
 
        {/* Add Admin Button
        <TouchableOpacity
          onPress={() => {
            handleShowModal();
            if (!isTablet) setSidebarVisible(false);
          }}
          style={styles.addAdminButton}
        >
          <Ionicons name="add-circle" size={20} color="#ffffff" />
          <Text style={styles.addAdminText}>Add Admin</Text>
        </TouchableOpacity> */}
      </ScrollView>
 
      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => {
          handleLogout();
          if (!isTablet) setSidebarVisible(false);
        }}
        style={styles.logoutButton}
        // disabled={isLoggingOut}
      >
        {/* {isLoggingOut ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text style={styles.logoutText}>Logout</Text>
          </>
        )} */}<Text>LogOut</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
 
  if (isTablet) {
    // For tablets and larger screens, show sidebar directly
    return <SidebarContent />;
  }
 
  // For mobile phones, show sidebar in a modal
  return (
    <>
      {/* Mobile Menu Button */}
      {/* <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setSidebarVisible(true)}
      >
        <Ionicons name="menu" size={24} color="#4b5563" />
      </TouchableOpacity> */}
 
      {/* Mobile Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <SidebarContent />
          </View>
        </View>
      </Modal>
    </>
  );
};
 
const styles = StyleSheet.create({
  sidebarContainer: {
    width: isTablet ? 250 : '100%',
    backgroundColor: "#f3f4f6",
    borderRightWidth: isTablet ? 1 : 0,
    borderRightColor: "#e5e7eb",
    flex: 1,
    maxHeight: height
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: isTablet ? "center" : "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff"
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: isTablet ? 0 : 1,
    textAlign: isTablet ? "center" : "left"
  },
  sidebar: {
    paddingVertical: 16,
    flex: 1
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  activeMenuItem: {
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
    flex: 1
  },
  activeMenuText: {
    color: "#ffffff",
    fontWeight: "600"
  },
  addAdminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  addAdminText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 1,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    marginBottom: Platform.OS === 'ios' ? 34 : 16,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minHeight:40,
    maxHeight:80
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8
  },
  menuButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 1000,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start"
  },
  modalContent: {
    width: width * 0.8,
    maxWidth: 300,
    height: "100%",
    backgroundColor: "#f3f4f6"
  }
});
 
export default AdminSideBar;
 
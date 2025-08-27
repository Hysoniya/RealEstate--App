import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth, performLogout } from "@/redux/Auth/AuthSlice";
import { FontAwesome5 } from "@expo/vector-icons";

import AdminSideBar from "@/components/AdminDashboard/AdminSideBar";
import AdminProfile from "@/components/AdminDashboard/AdminProfile";
import AdminDashUserDetails from "@/components/AdminDashboard/AdminDashUserDetails";
import AdminAppointment from "@/components/AdminDashboard/AdminAppointment";
import AdminPropertyVerification from "@/components/AdminDashboard/AdminPropertyVerification";
import AdminReviews from "@/components/AdminDashboard/AdminReviews";
import AdminEnquiries from "@/components/AdminDashboard/AdminEnquiries";
import AdminList from "@/components/AdminDashboard/AdminList";
import StaffManagement from "@/components/StaffDashboard/StaffManagement";
import StaffPerformanceCategories from "@/components/AdminDashboard/StaffPerformanceCategories";
import AdminContractorVerification from "@/components/AdminDashboard/AdminContractorVerification";
import CustomModal from "@/components/AdminDashboard/Modal";

// Responsive configuration
const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerAnimation] = useState(new Animated.Value(0));

  const dispatch = useDispatch();
  const router = useRouter();
  const { userData, authUser, userType } = useSelector((state) => state.auth);

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (userType !== "admin" || !authUser) {
      requestAnimationFrame(() => {
        router.replace("/(screens)");
      });
    }
  }, [authUser, router, userType]);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedSection =
        (await AsyncStorage.getItem("activeSection")) || "adminProfile";
      setActiveSection(savedSection);
      fetchData();
    };
    if (authUser && userType === "admin") {
      loadInitialData();
    }
  }, [authUser, userType]);

  // Section Mapping
  const getSectionInfo = () => {
    const sectionMap = {
      adminProfile: {
        title: "Admin Dashboard",
        subtitle: "Manage your profile settings",
        icon: "user-circle",
        color: "#10b981",
        stats: null,
      },
      adminDashUserDetails: {
        title: "Admin Dashboard",
        subtitle: "View and manage user information",
        icon: "users",
        color: "#3b82f6",
        stats: null,
      },
      appointments: {
        title: "Admin Dashboard",
        subtitle: "Manage customer appointments",
        icon: "calendar-check",
        color: "#8b5cf6",
        stats: appointments.length,
      },
      propertyVerification: {
        title: "Admin Dashboard",
        subtitle: "Review and verify properties",
        icon: "building",
        color: "#f59e0b",
        stats: properties.length,
      },
      reviews: {
        title: "Admin Dashboard",
        subtitle: "Customer feedback and ratings",
        icon: "star",
        color: "#ef4444",
        stats: reviews.length,
      },
      enquiries: {
        title: "Admin Dashboard",
        subtitle: "Customer inquiries and support",
        icon: "question-circle",
        color: "#06b6d4",
        stats: enquiries.length,
      },
      adminsList: {
        title: "Admin Dashboard",
        subtitle: "Manage administrator accounts",
        icon: "user-shield",
        color: "#dc2626",
        stats: admins.length,
      },
      staffManagement: {
        title: "Admin Dashboard",
        subtitle: "Manage staff members and roles",
        icon: "users-cog",
        color: "#059669",
        stats: null,
      },
      staffPerformance: {
        title: "Admin Dashboard",
        subtitle: "Track performance metrics",
        icon: "chart-line",
        color: "#7c3aed",
        stats: null,
      },
      contractorVerification: {
        title: "Admin Dashboard",
        subtitle: "Verify and manage contractors",
        icon: "hard-hat",
        color: "#ea580c",
        stats: contractors.length,
      },
    };
    return (
      sectionMap[activeSection] || {
        title: "Admin Dashboard",
        subtitle: "Welcome back",
        icon: "tachometer-alt",
        color: "#6366f1",
        stats: null,
      }
    );
  };

  // Helpers
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Data fetch
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const [
        appointmentsRes,
        propertiesRes,
        reviewsRes,
        enquiriesRes,
        adminsRes,
        contractorsRes,
      ] = await Promise.all([
        fetch(`${BASE_URL}/api/appointments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/property/verification`),
        fetch(`${BASE_URL}/api/reviews/get-all-reviews`),
        fetch(`${BASE_URL}/api/enquiry/get-all-enquiry`),
        fetch(`${BASE_URL}/api/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/contractor/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [
        appointmentsData,
        propertiesData,
        reviewsData,
        enquiriesData,
        adminsData,
        contractorsData,
      ] = await Promise.all([
        appointmentsRes.json(),
        propertiesRes.json(),
        reviewsRes.json(),
        enquiriesRes.json(),
        adminsRes.json(),
        contractorsRes.json(),
      ]);
      // console.log(adminsData);
      if (appointmentsData.success)
        setAppointments(appointmentsData.appointments);
      if (propertiesData.success) setProperties(propertiesData.property_verify);
      if (adminsData.success) setAdmins(adminsData.data);
      if (reviewsData.success) setReviews(reviewsData.reviews);
      if (enquiriesData.success) setEnquiries(enquiriesData.enquiries);
      if (Array.isArray(contractorsData)) setContractors(contractorsData);
      else if (contractorsData.success)
        setContractors(contractorsData.contractors);
      else if (contractorsData.data) setContractors(contractorsData.data);
      else setContractors([]);
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mutations (delete/edit/verify actions)
  const handleRemoveAppointment = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      Toast.show({ type: "success", text1: "Appointment deleted" });
    } catch (error) {
      Toast.show({ type: "error", text1: error.message });
    }
  };

  const handleAcceptProperty = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${id}/accept`, {
        method: "PUT",
      });
      const result = await response.json();
      if (!result.success || !response.ok)
        throw new Error("Accepting property failed");
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({ type: "success", text1: "Property accepted" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectProperty = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/property/${id}/reject`, {
        method: "PUT",
      });
      const result = await response.json();
      if (!result.success || !response.ok)
        throw new Error("Rejecting property failed");
      setProperties((prev) => prev.filter((p) => p._id !== id));
      Toast.show({ type: "success", text1: "Property rejected" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        dispatch(performLogout());
        router.replace("/(screens)");
      }
      return;
    }
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(performLogout()).unwrap();
            router.replace("/(screens)");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      console.log("Req received");
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/admin/${adminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
      Toast.show({ type: "success", text1: "Admin deleted" });
    } catch (error) {
      Toast.show({ type: "error", text1: error.message });
    }
  };

  const handleSectionChange = async (section) => {
    setActiveSection(section);
    await AsyncStorage.setItem("activeSection", section);
    if (!isTablet) setSidebarVisible(false);
  };

  const handleDeleteEnquiry = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/enquiry/${id}/delete`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        Toast.show({ type: "success", text1: "Enquiry deleted" });
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      } else {
        Toast.show({ type: "error", text1: data.message });
      }
    } catch (_) {
      Toast.show({ type: "error", text1: "Failed to delete enquiry" });
    }
  };

  const handleAcceptContractor = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/contractor/verify/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      await response.json();
      if (!response.ok) throw new Error();
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({ type: "success", text1: "Contractor verified" });
    } catch (_) {
      Toast.show({ type: "error", text1: "Failed to verify contractor" });
    }
  };

  const handleRejectContractor = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/contractor/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await response.json();
      if (!response.ok) throw new Error();
      setContractors((prev) => prev.filter((c) => c._id !== id));
      Toast.show({ type: "success", text1: "Contractor rejected" });
    } catch (_) {
      Toast.show({ type: "error", text1: "Failed to reject contractor" });
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Animated.View
        style={[
          styles.headerSection,
          {
            opacity: headerAnimation,
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerGradient} />

        <View style={styles.headerContent}>
          {/* Left: Sidebar/Menu */}
          <View style={styles.headerLeft}>
            <Pressable
              style={styles.menuButton}
              onPress={() => setSidebarVisible(!sidebarVisible)}
            >
              <FontAwesome5 name="bars" size={18} color="#ffffff" />
            </Pressable>
            {width > 480 && (
              <View style={styles.userWelcome}>
                <Text style={styles.greetingText}>
                  {getGreeting()}, {userData?.name || "Admin"}!
                </Text>
                <Text style={styles.dateTimeText}>
                  {currentTime.toLocaleDateString()} • {formatTime(currentTime)}
                </Text>
              </View>
            )}
          </View>

          {/* Center: Current Section */}
          <View style={styles.headerCenter}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5
                name={sectionInfo.icon}
                size={20}
                color={sectionInfo.color}
              />
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{sectionInfo.title}</Text>
              <Text style={styles.headerSubtitle}>{sectionInfo.subtitle}</Text>
              {/* Section stats if needed */}
            </View>
          </View>

          {/* Right: Actions (Logout) */}
          <View style={styles.headerRight}>
            <Pressable style={styles.headerActionButton} onPress={handleLogout}>
              <FontAwesome5 name="sign-out-alt" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Mobile Stats Bar */}
        {width <= 480 && (
          <View style={styles.quickStatsBar}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{appointments.length}</Text>
              <Text style={styles.quickStatLabel}>Appointments</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{properties.length}</Text>
              <Text style={styles.quickStatLabel}>Properties</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{enquiries.length}</Text>
              <Text style={styles.quickStatLabel}>Enquiries</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{contractors.length}</Text>
              <Text style={styles.quickStatLabel}>Contractors</Text>
            </View>
          </View>
        )}
      </Animated.View>

      <View style={styles.dashboardContainer}>
        <AdminSideBar
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
          handleShowModal={() => setShowModal(true)}
          handleLogout={handleLogout}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          isTablet={isTablet}
        />
        <View style={styles.content}>
          {/* Only wrap detail pages in ScrollView; render FlatList-based sections directly */}
          {activeSection === "adminProfile" && (
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <AdminProfile adminProfile={userData} />
            </ScrollView>
          )}
          {activeSection === "adminDashUserDetails" && (
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <AdminDashUserDetails adminProfile={userData} />
            </ScrollView>
          )}

          {activeSection === "appointments" && (
            <AdminAppointment
              appointments={appointments}
              loading={loading}
              error={error}
              handleRemoveAppointment={handleRemoveAppointment}
            />
          )}
          {activeSection === "propertyVerification" && (
            <AdminPropertyVerification
              properties={properties}
              loading={loading}
              error={error}
              handleAcceptProperty={handleAcceptProperty}
              handleRejectProperty={handleRejectProperty}
            />
          )}
          {activeSection === "reviews" && (
            <AdminReviews reviews={reviews || []} adminId={userData?.adminId} />
          )}
          {activeSection === "enquiries" && (
            <AdminEnquiries
              enquiries={enquiries}
              onDeleteEnquiry={handleDeleteEnquiry}
            />
          )}
          {activeSection === "adminsList" && (
            <AdminList
              admins={admins}
              onAddAdminClick={() => setShowModal(true)}
              handleRemoveAdmin={handleRemoveAdmin}
              loading={loading}
              error={error}
              refreshAdmins={fetchData}
            />
          )}
          {activeSection === "staffManagement" && <StaffManagement />}
          {activeSection === "staffPerformance" && (
            <StaffPerformanceCategories />
          )}
          {activeSection === "contractorVerification" && (
            <AdminContractorVerification
              contractors={contractors}
              loading={loading}
              error={error}
              handleAcceptContractor={handleAcceptContractor}
              handleRejectContractor={handleRejectContractor}
            />
          )}
        </View>
        <CustomModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          onAdminAdded={(newAdmin) => {
            // Optionally add the new admin to the local state immediately
            setAdmins((prev) => [...prev, newAdmin]);
          }}
          refreshAdmins={fetchData}
        />
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerSection: {
    position: "relative",
    paddingTop: Platform.OS === "ios" ? 35 : (StatusBar.currentHeight || 0) + 5,
    paddingBottom: 15,
    backgroundColor: "#475569",
    overflow: "hidden",
    zIndex: 1000,
    minHeight: width <= 480 ? 140 : 100,
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 1,
    minHeight: 50,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: width <= 480 ? 0 : 1,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userWelcome: { marginLeft: 8 },
  greetingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  dateTimeText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
    marginTop: 1,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: width <= 480 ? 1 : 0,
    justifyContent: width <= 480 ? "center" : "center",
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitleContainer: {
    alignItems: width <= 480 ? "center" : "flex-start",
  },
  headerTitle: {
    fontSize: width <= 480 ? 16 : 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: width <= 480 ? 11 : 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
    fontWeight: "400",
  },
  statsContainer: { marginTop: 4 },
  statsBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statsText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: width <= 480 ? 0 : 1,
    justifyContent: "flex-end",
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#334155",
  },
  notificationText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "700",
  },
  quickStatsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  quickStat: { alignItems: "center" },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  quickStatLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
    fontWeight: "500",
  },
  dashboardContainer: {
    flex: 1,
    flexDirection: isTablet ? "row" : "column",
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  contentContainer: {
    padding: isTablet ? 16 : 8,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    paddingTop: 10,
    minHeight: "100%",
  },
});

export default AdminDashboard;

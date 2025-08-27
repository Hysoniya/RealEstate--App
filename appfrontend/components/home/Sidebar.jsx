import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Modal,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Platform, Alert } from "react-native";
import { initializeAuth, performLogout } from "@/redux/Auth/AuthSlice";

const Sidebar = ({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  const [slideAnim] = useState(new Animated.Value(-280));
  const scrollViewRef = useRef(null);
  const router = useRouter();

  // // Debug: Add console logs to track re-renders
  // console.log('Sidebar re-rendered, visible:', visible);

  // Use a more robust approach to track sidebar state
  const sidebarState = useRef({
    isOpen: false,
    isAnimating: false,
    hasBeenOpened: false,
  });

  // Memoize animation functions to prevent recreating them
  const openSidebar = useCallback(() => {
    if (sidebarState.current.isAnimating) return;
    
    // console.log('Opening sidebar');
    sidebarState.current.isAnimating = true;
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      sidebarState.current.isAnimating = false;
      sidebarState.current.isOpen = true;
      sidebarState.current.hasBeenOpened = true;
    });
  }, [slideAnim]);

  const closeSidebar = useCallback(() => {
    if (sidebarState.current.isAnimating) return;

    // console.log('Closing sidebar');
    sidebarState.current.isAnimating = true;
    Animated.timing(slideAnim, {
      toValue: -280,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      sidebarState.current.isAnimating = false;
      sidebarState.current.isOpen = false;
    });
  }, [slideAnim]);

  // Only handle actual visibility changes
  React.useEffect(() => {
    // console.log('Visibility effect triggered, visible:', visible, 'isOpen:', sidebarState.current.isOpen);
    if (
      visible &&
      !sidebarState.current.isOpen &&
      !sidebarState.current.isAnimating
    ) {
      openSidebar();
    } else if (
      !visible &&
      sidebarState.current.isOpen &&
      !sidebarState.current.isAnimating
    ) {
      closeSidebar();
    }
  }, [visible, openSidebar, closeSidebar]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNavigation = useCallback(
    (route) => {
      // console.log('Navigating to:', route);
      router.push(route);
      onClose();
    },
    [router, onClose]
  );

  const handleClose = useCallback(() => {
    // console.log('Handle close called');
    onClose();
  }, [onClose]);

  const handleSearch = useCallback(() => {
    // console.log('Handle search called');
    if (onSearch) {
      onSearch();
    }
  }, [onSearch]);

  // Memoize the search query handler
  const handleSearchQueryChange = useCallback(
    (text) => {
      // console.log('Search query changed:', text);
      setSearchQuery(text);
    },
    [setSearchQuery]
  );

  //logout handler
  const dispatch = useDispatch();
  const { userData, authUser, userType } = useSelector((state) => state.auth);

  // Initialize authentication on component mount - but only once
  useEffect(() => {
    // console.log('Initializing auth');
    dispatch(initializeAuth());
  }, [dispatch]);

  // Remove the problematic redirect effect entirely for now
  // useEffect(() => {
  //   if (userType !== "user" || !authUser) {
  //     router.replace("/(screens)");
  //   }
  // }, [authUser, router, userType]);

  const handleLogout = useCallback(() => {
    // console.log('Logout initiated');
    // For web
    if (Platform.OS === "web") {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        // console.log("Logging out...");
        dispatch(performLogout());
        router.replace("/(screens)");
      }
      return;
    }

    // For mobile (iOS/Android)
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // console.log("Logging out...");
            await dispatch(performLogout()).unwrap();
            router.replace("/(screens)");
          } catch (error) {
            // console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  }, [dispatch, router]);

  // Memoize menu items to prevent recreation
  const menuItems = useMemo(
    () => [
      { route: "/(screens)/user", icon: "home-outline", text: "Home" },
      {
        route: "/(screens)/(property)/properties/post",
        icon: "add-circle-outline",
        text: "Post Property",
      },
      {
        route: "/(screens)/services/title-search",
        icon: "search-outline",
        text: "Property Title Search",
      },
      {
        route: "/(screens)/services/pre-purchaseServices",
        icon: "shield-checkmark-outline",
        text: "Pre-Purchase Property Assistance",
      },
      {
        route: "/(screens)/services/post-purchaseServices",
        icon: "checkmark-done-outline",
        text: "Post-Purchase Property Services",
      },
      {
        route: "/(screens)/services/contractors/user-contractor",
        icon: "hammer-outline",
        text: "Contractors",
      },
      {
        route: "/(screens)/user/user-appointment",
        icon: "calendar-outline",
        text: "Appointments",
      },
      {
        route: "/(screens)/user/user-property",
        icon: "business-outline",
        text: "My Properties",
      },
      {
        route: "/(screens)/user/user-pastSearches",
        icon: "time-outline",
        text: "Past Searches",
      },
      {
        route: "/(screens)/user/user-prevViewed",
        icon: "eye-outline",
        text: "Previously Viewed",
      },
      {
        route: "/(screens)/user/user-prevSaved",
        icon: "bookmark-outline",
        text: "Saved",
      },
      {
        route: "/(screens)/user/user-prevContacted",
        icon: "chatbubble-ellipses-outline",
        text: "Contacted",
      },
      {
        route: "/(screens)/user/user-notification",
        icon: "notifications-outline",
        text: "Notification",
      },
      {
        route: "/(screens)/services/about",
        icon: "information-circle-outline",
        text: "About",
      },
    ],
    []
  );

  // Don't render the modal if it's not visible to improve performance
  if (!visible) {
    return null;
  }

  // console.log('Rendering sidebar modal');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      hardwareAccelerated={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={handleClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
              zIndex: 10,
            },
          ]}
        >
          <View style={styles.sidebarContent}>
            {/* Sidebar Header */}
            <View style={styles.sidebarHeader}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.sidebarLogo}
              />
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Search Section in Sidebar */}
            {/* <View style={styles.sidebarSearchContainer}>
              <View style={styles.sidebarSearch}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#666"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.sidebarSearchInput}
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={handleSearchQueryChange}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={handleSearch}
                  style={styles.sidebarSearchButton}
                >
                  <Ionicons name="arrow-forward" size={20} color="#007bff" />
                </TouchableOpacity>
              </View>
            </View> */}

            {/* Scrollable Navigation Menu */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollableMenuContainer}
              contentContainerStyle={styles.menuContentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              nestedScrollEnabled={false}
              // Add onScroll handler to debug
              onScroll={(event) => {
                // console.log('ScrollView scroll event:', event.nativeEvent.contentOffset.y);
              }}
              scrollEventThrottle={100}
            >
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={`menu-${index}`}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.route)}
                >
                  <Ionicons name={item.icon} size={24} color="#333" />
                  <Text style={styles.menuText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Fixed Sidebar Footer */}
            <View style={styles.sidebarFooter}>
              <Text style={styles.footerText}>BasilAbode v1.0</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flexDirection: "row",
  },
  overlayTouch: {
    flex: 1,
  },
  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    height: "100%",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    position: "absolute",
    left: 0,
    top: 0,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f8f9fa",
  },
  sidebarLogo: {
    width: 100,
    height: 32,
    resizeMode: "contain",
    tintColor: "#007bff",
  },
  closeButton: {
    padding: 4,
  },
  sidebarSearchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sidebarSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  sidebarSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  sidebarSearchButton: {
    padding: 8,
  },
  scrollableMenuContainer: {
    flex: 1,
  },
  menuContentContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footerText: {
    color: "#999",
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default Sidebar;
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Image } from 'react-native';
import Sidebar from './Sidebar';

const Navbar = ({ onLogoutClick, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleSearch = useCallback(() => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  }, [onSearch, searchQuery]);

  const toggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarVisible(false);
  }, []);

  const handleLogoutClick = useCallback(() => {
    if (onLogoutClick) {
      onLogoutClick();
    }
  }, [onLogoutClick]);

  // Memoize search query setter to prevent unnecessary re-renders
  const handleSearchQueryChange = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  // Memoize styles to prevent recreation on every render
  const memoizedStyles = useMemo(() => styles, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={memoizedStyles.safeArea}>
        <View style={memoizedStyles.navbar}>
          {/* Hamburger Menu */}
          <TouchableOpacity onPress={toggleSidebar} style={memoizedStyles.hamburger}>
            <View style={memoizedStyles.hamburgerLine} />
            <View style={memoizedStyles.hamburgerLine} />
            <View style={memoizedStyles.hamburgerLine} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={memoizedStyles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={memoizedStyles.logo}
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogoutClick} style={memoizedStyles.loginButton}>
            <Text style={memoizedStyles.loginText}>Logout</Text>
          </TouchableOpacity>
         
        {/* <TouchableOpacity style={memoizedStyles.profileIconContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={memoizedStyles.profileIcon}
          />
          <Text>logout</Text>
        </TouchableOpacity> */}
        </View>
      </SafeAreaView>

      {/* Sidebar Component */}
      <Sidebar
        visible={sidebarVisible}
        onClose={closeSidebar}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchQueryChange}
        onSearch={handleSearch}
      />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: 60,
  },
  hamburger: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#333',
    marginVertical: 2,
    borderRadius: 2,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -20, // Compensate for hamburger menu
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#007bff',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Navbar;
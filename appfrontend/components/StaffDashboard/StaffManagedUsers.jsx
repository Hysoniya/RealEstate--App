import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  Pressable,
  FlatList
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const StaffManagedUsers = ({ userDetails }) => {
  const [filteredRole, setFilteredRole] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("User Details:", userDetails);

  useEffect(() => {
    if (userDetails) {
      let result = userDetails;

      if (filteredRole !== "All") {
        result = result.filter((user) => user.role === filteredRole);
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (user) =>
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.phoneNumber?.includes(query)
        );
      }

      setFilteredUsers(result);
      setLoading(false);
    }
  }, [userDetails, filteredRole, searchQuery]);

  const renderUserItem = ({ item, index }) => (
    <View style={styles.userRow}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.cell} numberOfLines={1} ellipsizeMode="tail">
        {item.email}
      </Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>
        {item.city === "City" ? "N/A" : item.city}
      </Text>
      <Text style={styles.cell}>
        {item.state === "State" ? "N/A" : item.state}
      </Text>
      <View style={[styles.roleTag, 
        { backgroundColor: getRoleColor(item.role) }]}>
        <Text style={styles.roleText}>{item.role}</Text>
      </View>
    </View>
  );

  const getRoleColor = (role) => {
    switch(role) {
      case 'builder': return '#f59e0b';
      case 'agent': return '#3b82f6';
      case 'user': return '#10b981';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>User Management</Text>
        <View style={styles.controls}>
          <View style={styles.searchContainer}>
            <FontAwesome5 name="search" size={16} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.dropdownContainer}>
            <FontAwesome5 name="filter" size={16} color="#64748b" />
            <Text style={styles.dropdownLabel}>Filter:</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                // You would implement a proper dropdown/picker here
                // For now, we'll just toggle between roles
                const roles = ['All', 'builder', 'agent', 'user'];
                const currentIndex = roles.indexOf(filteredRole);
                const nextIndex = (currentIndex + 1) % roles.length;
                setFilteredRole(roles[nextIndex]);
              }}
            >
              <Text style={styles.dropdownText}>
                {filteredRole.charAt(0).toUpperCase() + filteredRole.slice(1)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {filteredUsers.length > 0 ? (
        <ScrollView horizontal={true}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Sr. No</Text>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Email</Text>
              <Text style={styles.headerCell}>Phone</Text>
              <Text style={styles.headerCell}>City</Text>
              <Text style={styles.headerCell}>State</Text>
              <Text style={styles.headerCell}>Role</Text>
            </View>
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.tableBody}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <FontAwesome5 name="user-slash" size={40} color="#94a3b8" />
          <Text style={styles.noDataText}>No users found</Text>
          <Text style={styles.noDataSubtext}>Try changing your search or filter</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  headerRow: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#1e293b',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dropdownLabel: {
    marginLeft: 8,
    marginRight: 4,
    color: '#64748b',
  },
  dropdown: {
    paddingVertical: 10,
  },
  dropdownText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    width: 120,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  tableBody: {
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cell: {
    width: 120,
    color: '#1e293b',
    textAlign: 'center',
  },
  roleTag: {
    width: 100,
    alignSelf: 'center',
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default StaffManagedUsers;
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const VerifyPropertiesForm = ({
  properties,
  loading,
  error,
  handleAcceptProperty,
  handleRejectProperty,
}) => {
  const Info = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
    >
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : properties.length === 0 ? (
        <Text style={styles.message}>No properties pending verification.</Text>
      ) : (
        [...properties].reverse().map((property) => (
          <View key={property._id} style={styles.card}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{property.title}</Text>
              <Text
                style={[
                  styles.status,
                  property.verification === "pending"
                    ? styles.pending
                    : property.verification === "verified"
                    ? styles.verified
                    : styles.rejected,
                ]}
              >
                {property.verification}
              </Text>
            </View>

            <View style={styles.infoGroup}>
              <Info label="Location" value={`${property.address}, ${property.city}`} />
              <Info label="BHK" value={property.Bhk} />
              <Info label="Area" value={`${property.area} sq.ft`} />
              <Info label="Type" value={property.type} />
              <Info label="Purpose" value={property.purpose} />
              <Info label="Price" value={`₹${property.price}`} />
              <Info label="Description" value={property.description} />
              <Info label="Amenities" value={property.amenities.join(", ")} />
              <Info label="Balconies" value={property.balconies.toString()} />
              <Info label="Bathrooms" value={property.bathrooms.toString()} />
              <Info label="Floors" value={property.floors} />
              <Info
                label="Owner"
                value={`${property.Propreiter_name} | ${property.Propreiter_email} | ${property.Propreiter_contact}`}
              />
              <Info
                label="Submitted"
                value={new Date(property.created_at).toLocaleString()}
              />
            </View>

            {property.verification === "pending" && (
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptBtn]}
                  onPress={() => handleAcceptProperty(property._id)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectBtn]}
                  onPress={() => handleRejectProperty(property._id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 550,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2a2a2a',
    flex: 1,
    paddingRight: 10,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    textTransform: 'uppercase',
    color: 'white',
  },
  pending: {
    backgroundColor: '#f0ad4e',
  },
  verified: {
    backgroundColor: '#28a745',
  },
  rejected: {
    backgroundColor: '#dc3545',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  rejectBtn: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  infoGroup: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    width: 110,
    textAlign: 'right',
    marginRight: 10,
  },
  value: {
    flex: 1,
    color: '#222',
  },
  message: {
    textAlign: 'center',
    marginVertical: 40,
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
  },
});

export default VerifyPropertiesForm;

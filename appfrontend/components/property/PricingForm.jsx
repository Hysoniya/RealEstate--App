import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform
} from 'react-native';
import Toast from 'react-native-toast-message';


const PricingForm = ({ formData, handleInputChange, prevStep, handleSubmit, loading }) => {
  const validateForm = () => {
    if (
      !formData.price ||
      !formData.proprietorName ||
      !formData.proprietorEmail ||
      !formData.proprietorPhone ||
      !formData.posterType
    ) {
      // Alert.alert('Validation Error', 'Please fill in all the required fields before submitting.');
      Toast.show({
        type:'error',
        text1:'Validation Error',
        text2:'Please fill in all the required fields before submitting'
      })
      return false;
    }
    return true;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  const handleCheckboxToggle = (name) => {
    handleInputChange(name, !formData[name]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Pricing and Other Details</Text>

      <View style={styles.twoColumn}>
        {/* LEFT COLUMN */}
        <View style={styles.part}>
          {/* Price Details */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.price || ''}
              onChangeText={(val) => handleInputChange('price', val)}
              placeholder="Price in INR"
            />
          </View>

          {/* Checkboxes */}
          <View style={styles.formGroup}>
            {[
              { name: 'allInclusivePrice', label: 'All Inclusive Price' },
              { name: 'taxAndGovtChargesExcluded', label: 'Tax and Govt. Charges Excluded' },
              { name: 'priceNegotiable', label: 'Price Negotiable' },
            ].map((field) => (
              <TouchableOpacity
                key={field.name}
                style={styles.checkboxRow}
                onPress={() => handleCheckboxToggle(field.name)}
              >
                <View style={[styles.checkbox, formData[field.name] && styles.checkboxActive]} />
                <Text>{field.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amenities */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Amenities</Text>
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              multiline
              numberOfLines={3}
              value={formData.amenities || ''}
              onChangeText={(val) => handleInputChange('amenities', val)}
              placeholder="List of amenities"
            />
          </View>
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.part}>
          <Text style={styles.label}>Contact Details</Text>

          <View style={styles.formGroup}>
            <Text>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.proprietorName || ''}
              onChangeText={(val) => handleInputChange('proprietorName', val)}
              placeholder="Enter Your Name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text>E-mail ID</Text>
            <TextInput
              style={styles.input}
              value={formData.proprietorEmail || ''}
              onChangeText={(val) => handleInputChange('proprietorEmail', val)}
              placeholder="Enter Your Email"
            />
          </View>

          <View style={styles.formGroup}>
            <Text>Phone No.</Text>
            <TextInput
              style={styles.input}
              value={formData.proprietorPhone || ''}
              onChangeText={(val) => handleInputChange('proprietorPhone', val)}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Poster Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>You are:</Text>
            <View style={styles.radioGroup}>
              {['Owner', 'Builder', 'Agent'].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={styles.radioRow}
                  onPress={() => handleInputChange('posterType', value)}
                >
                  <View
                    style={[styles.radioCircle, formData.posterType === value && styles.radioSelected]}
                  />
                  <Text>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleFormSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#3498db" />
          <Text style={styles.loadingText}>Please wait, submitting...</Text>
        </View>
      )}
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  twoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  part: {
    flex: 1,
    minWidth: '100%', // stacks on mobile
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 44,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#2895DF',
  },

  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2895DF',
    marginRight: 6,
  },
  radioSelected: {
    backgroundColor: '#2895DF',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#764EC6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  loaderContainer: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 9999,
    marginTop: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 6,
  },
});




export default PricingForm;

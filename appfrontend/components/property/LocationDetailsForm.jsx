import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  
} from 'react-native';
import Toast from 'react-native-toast-message';

const LocationDetailsForm = ({ formData, handleInputChange, nextStep, prevStep }) => {
  const handleNext = () => {
    if (formData.city && formData.address && formData.landmark) {
      nextStep();
    } else {
     
      Toast.show({
        type:'error',
        text1:'Missing Fields',
        text2:'Please fill in all the fields before proceeding'
      })
    }
  };

  const handleBack = () => {
    prevStep(); 
  };

  return (
    <View style={styles.formSection}>
      <Text style={styles.heading}>Location Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
          placeholder="City"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholder="Address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Landmark</Text>
        <TextInput
          style={styles.input}
          value={formData.landmark}
          onChangeText={(text) => handleInputChange('landmark', text)}
          placeholder="Landmark"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  formSection: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 20,
    backgroundColor: '#fff',
    maxWidth: 600,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#34495e',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 44,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});



export default LocationDetailsForm;

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import Toast from 'react-native-toast-message';

const BasicDetailsForm = ({ formData, handleInputChange, nextStep }) => {
  const handleNextStep = () => {
    if (formData.title && formData.purpose && formData.propertyType && formData.description) {
      nextStep();
    } else {
      // Alert.alert('Missing Fields', 'Please fill in all the fields before proceeding.');
      Toast.show({
        type:'error',
        text1:'Missing Fields',
        text2:'Please fill in all the fields before proceeding'
      })
    }
  };

  const RadioButton = ({ label, value, groupName, selected }) => (
    <Pressable
      style={styles.radioWrapper}
      onPress={() => handleInputChange(groupName, value)}
    >
      <View style={[styles.radioCircle, selected && styles.radioSelected]} />
      <Text>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.formSection}>
      <Text style={styles.heading}>Basic Details</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Catchy Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Catchy Property Title"
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>I am looking to..</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            label="Sell"
            value="Sell"
            groupName="purpose"
            selected={formData.purpose === 'Sell'}
          />
          <RadioButton
            label="Rent/Lease"
            value="Rent/Lease"
            groupName="purpose"
            selected={formData.purpose === 'Rent/Lease'}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>What kind of property do you have?</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            label="Apartment"
            value="Apartment"
            groupName="propertyType"
            selected={formData.propertyType === 'Apartment'}
          />
          <RadioButton
            label="Plot"
            value="Plot"
            groupName="propertyType"
            selected={formData.propertyType === 'Plot'}
          />
          <RadioButton
            label="House"
            value="House"
            groupName="propertyType"
            selected={formData.propertyType === 'House'}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>How would you describe your property?</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Property Description"
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  formSection: {
    flex: 1,
    padding: 20,
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
    marginBottom: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2895DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#2895DF',
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#2895DF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




export default BasicDetailsForm;

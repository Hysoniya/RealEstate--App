import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

const ApartmentProfileForm = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}) => {
  const handleCheckboxChange = (name) => {
    handleInputChange(name, !formData[name]);
  };

  const handleSubmit = () => {
    const requiredFields = ['numberOfBedrooms', 'numberOfBathrooms', 'numberOfBalconies'];

    for (const field of requiredFields) {
      if (!formData[field]) {
        // Alert.alert('Missing Fields', 'Please fill in all the required fields before proceeding.');
        Toast.show({
          type: 'error',
          text1: 'Please fill in all the required fields before proceeding'
        })
        return;
      }
    }

    nextStep();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Apartment Profile</Text>

      {/* === BEDROOMS === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Number of Bedrooms</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.numberOfBedrooms || ''}
          onChangeText={(val) => handleInputChange('numberOfBedrooms', val)}
          placeholder="0"
        />
      </View>

      {/* === BATHROOMS === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Number of Bathrooms</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.numberOfBathrooms || ''}
          onChangeText={(val) => handleInputChange('numberOfBathrooms', val)}
          placeholder="0"
        />
      </View>

      {/* === BALCONIES === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Number of Balconies</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.numberOfBalconies || ''}
          onChangeText={(val) => handleInputChange('numberOfBalconies', val)}
          placeholder="0"
        />
      </View>

      {/* === AREA DETAILS === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Area Details</Text>
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            value={formData.areaDetails || ''}
            onChangeText={(val) => handleInputChange('areaDetails', val)}
            placeholder="Enter Area"
          />
          <Picker
            selectedValue={formData.areaUnit || 'sq ft'}
            style={styles.picker}
            onValueChange={(val) => handleInputChange('areaUnit', val)}
          >
            <Picker.Item label="Sq Ft" value="sq ft" />
            <Picker.Item label="Sq Yard" value="sq yard" />
            <Picker.Item label="Sq M" value="sq m" />
            <Picker.Item label="Acres" value="acres" />
            <Picker.Item label="Marla" value="marla" />
            <Picker.Item label="Cents" value="cents" />
          </Picker>
        </View>
      </View>

      {/* === OTHER ROOMS === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Other Rooms (optional)</Text>
        <View style={styles.checkboxGroup}>
          {['studyRoom', 'poojaRoom', 'servantRoom', 'storeRoom'].map((name) => (
            <TouchableOpacity
              key={name}
              style={styles.checkboxRow}
              onPress={() => handleCheckboxChange(name)}
            >
              <View style={[styles.checkbox, formData[name] && styles.checkedBox]} />
              <Text>{name.replace(/([A-Z])/g, ' $1')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* === FLOOR DETAILS === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Floor Details</Text>
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            value={formData.totalFloorDetails || ''}
            onChangeText={(val) => handleInputChange('totalFloorDetails', val)}
            placeholder="Total Floors"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            value={formData.propertyFloorDetails || ''}
            onChangeText={(val) => handleInputChange('propertyFloorDetails', val)}
            placeholder="Property on Floor"
          />
        </View>
      </View>

      {/* === AVAILABILITY === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Availability Status</Text>
        <View style={styles.radioGroup}>
          {['Ready to Move', 'Under Construction'].map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.radioRow}
              onPress={() => handleInputChange('availability', value)}
            >
              <View style={[styles.radioCircle, formData.availability === value && styles.radioSelected]} />
              <Text>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* === CONDITIONAL FIELDS === */}
      {formData.availability === 'Ready to Move' && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Age of Property (in years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.ageOfProperty || ''}
            onChangeText={(val) => handleInputChange('ageOfProperty', val)}
            placeholder="Age"
          />
        </View>
      )}

      {formData.availability === 'Under Construction' && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Possession Date</Text>
          <TextInput
            style={styles.input}
            value={formData.possessionDate || ''}
            onChangeText={(val) => handleInputChange('possessionDate', val)}
            placeholder="YYYY-MM-DD"
          />
        </View>
      )}

      {/* === OWNERSHIP === */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ownership Type</Text>
        <View style={styles.radioGroup}>
          {[
            'Freehold',
            'Leasehold',
            'Co-operative Society',
            'Power of Attorney',
          ].map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.radioRow}
              onPress={() => handleInputChange('ownershipType', value)}
            >
              <View style={[
                styles.radioCircle,
                formData.ownershipType === value && styles.radioSelected,
              ]} />
              <Text>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* === BUTTONS === */}
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.button} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    maxWidth: 800,
    alignSelf: 'center',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  rowInput: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: Platform.OS === 'ios' ? 150 : 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 15,
    marginBottom: 5,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 5,
  },
  checkedBox: {
    backgroundColor: '#2895DF',
    borderColor: '#2895DF',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  },
  radioSelected: {
    backgroundColor: '#2895DF',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: '#2895DF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});



export default ApartmentProfileForm;

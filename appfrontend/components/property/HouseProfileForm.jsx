import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

const HouseProfileForm = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
}) => {
  const handleCheckboxChange = (name) => {
    handleInputChange(name, !formData[name]);
  };

  const handleSubmit = () => {
    const requiredFields = [
      'numberOfBedrooms',
      'numberOfBathrooms',
      'numberOfBalconies',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        
        Toast.show({
          type:'error',
          text1:'Please fill in all the required fields before proceeding'
        })
        return;
      }
    }

    nextStep();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>House Profile</Text>

      <View style={styles.twoColumn}>
        {/* Bedrooms */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Bedrooms</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.numberOfBedrooms || ''}
            onChangeText={(val) => handleInputChange('numberOfBedrooms', val)}
            placeholder="0"
          />
        </View>

        {/* Bathrooms */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Bathrooms</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.numberOfBathrooms || ''}
            onChangeText={(val) =>
              handleInputChange('numberOfBathrooms', val)
            }
            placeholder="0"
          />
        </View>

        {/* Balconies */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Balconies</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.numberOfBalconies || ''}
            onChangeText={(val) =>
              handleInputChange('numberOfBalconies', val)
            }
            placeholder="0"
          />
        </View>

        {/* Area Details */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Add Area Details</Text>
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
              onValueChange={(val) => handleInputChange('areaUnit', val)}
              style={styles.picker}
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

        {/* Floor Details */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Floor Details</Text>
          <View style={styles.doubleInput}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="numeric"
              value={formData.totalFloorDetails || ''}
              onChangeText={(val) =>
                handleInputChange('totalFloorDetails', val)
              }
              placeholder="Total Floors"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="numeric"
              value={formData.propertyFloorDetails || ''}
              onChangeText={(val) =>
                handleInputChange('propertyFloorDetails', val)
              }
              placeholder="Property on Floor"
            />
          </View>
        </View>

        {/* Other Rooms */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Other Rooms (optional)</Text>
          <View style={styles.optionGroup}>
            {['studyRoom', 'poojaRoom', 'servantRoom', 'storeRoom'].map(
              (room) => (
                <TouchableOpacity
                  key={room}
                  style={styles.optionItem}
                  onPress={() => handleCheckboxChange(room)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      formData[room] && styles.checkboxChecked,
                    ]}
                  />
                  <Text>{room.replace(/([A-Z])/g, ' $1')}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Availability Status</Text>
          <View style={styles.optionGroup}>
            {['Ready to Move', 'Under Construction'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.optionItem}
                onPress={() => handleInputChange('availability', status)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.availability === status && styles.radioSelected,
                  ]}
                />
                <Text>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {formData.availability === 'Ready to Move' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Age of Property (in years)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.ageOfProperty || ''}
              onChangeText={(val) => handleInputChange('ageOfProperty', val)}
              placeholder="0"
            />
          </View>
        )}

        {formData.availability === 'Under Construction' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Possession By</Text>
            <TextInput
              style={styles.input}
              value={formData.possessionBy || ''}
              onChangeText={(val) => handleInputChange('possessionBy', val)}
              placeholder="YYYY-MM-DD"
            />
          </View>
        )}

        {/* Ownership */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ownership</Text>
          <View style={styles.optionGroup}>
            {[
              'Freehold',
              'Leasehold',
              'Co-operative Society',
              'Power of Attorney',
            ].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.optionItem}
                onPress={() => handleInputChange('ownership', type)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.ownership === type && styles.radioSelected,
                  ]}
                />
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
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
    maxWidth: 800,
    alignSelf: 'center',
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 20,
  },
  twoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    height: 44,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  doubleInput: {
    flexDirection: 'row',
    gap: 10,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 44,
    flex: 1,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  optionItem: {
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
    marginRight: 6,
  },
  checkboxChecked: {
    backgroundColor: '#2895DF',
    borderColor: '#2895DF',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 30,
  },
  button: {
    flex: 1,
    backgroundColor: '#2895DF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});




export default HouseProfileForm;

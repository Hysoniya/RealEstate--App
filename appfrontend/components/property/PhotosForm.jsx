import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

const PhotosForm = ({
  selectedImages,
  setSelectedImages,
  handleRemoveImage,
  nextStep,
  prevStep,
}) => {
  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      // Alert.alert('Permission required', 'Please allow access to photo library');
      Toast.show({
        type: 'error',
        text1: 'Permission required',
        text2: 'Please allow access to photo library',
      })
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['image', 'video'],
      allowsMultipleSelection: true, // Only iOS 14+
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets || [result]; // fallback
      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);
    }
  };

  const handleNextStep = () => {
    if (selectedImages.length >= 1) {
      nextStep();
    } else {
      // Alert.alert('Upload Required', 'Please upload at least 4 media items before proceeding.');
      Toast.show({
        type: 'error',
        text1: 'Upload Required',
        text2: 'Please upload at least 1 media item before proceeding.',
      });

    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Photos and Videos</Text>

      <TouchableOpacity style={styles.fileInputButton} onPress={pickImages}>
        <Text style={styles.fileInputText}>Select Images or Videos</Text>
      </TouchableOpacity>

      <View style={styles.imagePreview}>
        {selectedImages.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: image.uri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(index)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  fileInputButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fefefe',
    marginBottom: 20,
    alignItems: 'center',
  },
  fileInputText: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
  imagePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 15,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




export default PhotosForm;

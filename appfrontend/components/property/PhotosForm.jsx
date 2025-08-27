
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Linking
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
  // Pick from gallery
  const pickImages = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload photos. Please go to Settings and enable photo library access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }}
          ]
        );
        return;
      }

      let result;

      if (Platform.OS === 'android') {
        // For Android, we'll use single selection to ensure compatibility
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 0.8,
          allowsMultipleSelection: false, // Keep false for better Android compatibility
        });
      } else {
        // For iOS, we can use multiple selection
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 0.8,
          allowsMultipleSelection: true,
        });
      }

      if (!result.canceled) {
        let newImages = [];
        
        // Handle different response formats
        if (result.assets && result.assets.length > 0) {
          newImages = result.assets;
        } else if (result.uri) {
          // Fallback for older formats
          newImages = [{
            uri: result.uri,
            type: result.type || 'image',
            width: result.width,
            height: result.height
          }];
        }

        if (newImages.length > 0) {
          setSelectedImages(prev => [...prev, ...newImages]);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${newImages.length} item(s) added`,
          });
        }
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick images. Please try again.',
      });
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Sorry, we need camera permissions to take photos. Please go to Settings and enable camera access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }}
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        let newImages = [];
        
        if (result.assets && result.assets.length > 0) {
          newImages = result.assets;
        } else if (result.uri) {
          newImages = [{
            uri: result.uri,
            type: 'image',
            width: result.width,
            height: result.height
          }];
        }

        if (newImages.length > 0) {
          setSelectedImages(prev => [...prev, ...newImages]);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Photo captured successfully',
          });
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo. Please try again.',
      });
    }
  };

  // Validate before moving to next step
  const handleNextStep = () => {
    if (selectedImages.length >= 1) {
      nextStep();
    } else {
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
      
      <Text style={styles.subText}>
        {selectedImages.length > 0 
          ? `${selectedImages.length} item(s) selected`
          : 'No items selected yet'
        }
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.fileInputButton} onPress={pickImages}>
          <Text style={styles.fileInputText}>📱 Select from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fileInputButton} onPress={takePhoto}>
          <Text style={styles.fileInputText}>📸 Take Photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.imagePreview}>
          {selectedImages.map((image, index) => (
            <View key={`image-${index}`} style={styles.imageContainer}>
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
      )}

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
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  fileInputButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fileInputText: {
    color: '#2980b9',
    fontWeight: 'bold',
    fontSize: 14,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
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
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PhotosForm;
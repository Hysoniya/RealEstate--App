import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BasicDetailsForm from "@/components/property/BasicDetailsForm";
import LocationDetailsForm from "@/components/property/LocationDetailsForm";
import ApartmentProfileForm from "@/components/property/ApartmentProfileForm";
import PlotProfileForm from "@/components/property/PlotProfileForm";
import HouseProfileForm from "@/components/property/HouseProfileForm";
import PhotosForm from "@/components/property/PhotosForm";
import PricingForm from "@/components/property/PricingForm";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const Post = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    purpose: "sell",
    propertyType: "",
    description: "",
    city: "",
    address: "",
    landmark: "",
    price: "",
    bhk: "",
    bathrooms: "",
    balconies: "",
    other_rooms: "",
    area: "",
    allInclusivePrice: false,
    taxAndGovtChargesExcluded: false,
    priceNegotiable: false,
    type: "Residential",
    status: "Available",
    floors: "",
    availability: "",
    phone: "",
    mail: "",
    proprietorName: "",
    proprietorEmail: "",
    proprietorContact: "",
    proprietorPhone: "",
    posterType: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    numberOfBalconies: "",
    areaDetails: "",
    totalFloorDetails: "",
    propertyFloorDetails: "",
    studyRoom: false,
    poojaRoom: false,
    servantRoom: false,
    storeRoom: false,
    ageOfProperty: "",
    possessionDate: "",
    ownershipType: "",
    plotArea: "",
    noOfFloorsConst: "",
    boundary: "",
    construction: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);

  const nextStep = () => setStep((step) => step + 1);
  const prevStep = () => setStep((step) => step - 1);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["image"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages((prev) => [...prev, ...result.assets]);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const combinedFormData = new FormData();

    const updatedFormData = {
      ...formData,
      other_rooms: {
        studyRoom: formData.studyRoom,
        poojaRoom: formData.poojaRoom,
        servantRoom: formData.servantRoom,
        storeRoom: formData.storeRoom,
      },
    };

    Object.entries(updatedFormData).forEach(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        combinedFormData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        value.forEach((v) => combinedFormData.append(key, v));
      } else {
        combinedFormData.append(key, String(value));
      }
    });

    selectedImages.forEach((image) => {
      combinedFormData.append("propertyImage", {
        uri: image.uri,
        name: image.fileName || "photo.jpg",
        type: image.type || "image/jpeg",
      });
    });

    try {

     

      const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
      await axios.post(`${BASE_URL}/api/property`, combinedFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      
      Toast.show({
      type: 'success',
      text1: 'Property listed successfully!'
    });
      // router.push('/user');
      router.back()
    } catch (err) {
      console.error(err);
      
      Toast.show({
      type: 'error',
      text1: 'Failed to list property'
    });

    } finally {
      setLoading(false);
    }
  };

  const renderPropertyProfileForm = () => {
    switch (formData.propertyType) {
      case "Apartment":
        return (
          <ApartmentProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "Plot":
        return (
          <PlotProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "House":
        return (
          <HouseProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Basic Details";
      case 2:
        return "Location Details";
      case 3:
        return "Property Profile";
      case 4:
        return "Upload Photos";
      case 5:
        return "Pricing Information";
      default:
        return "Property Details";
    }
  };

  const renderProgressIndicator = () => {
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Step {step} of 5</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]}
          />
        </View>
        <Text style={styles.stepTitle}>{getStepTitle()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Box */}
          <View style={styles.headerBox}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12, padding: 4 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Few more steps to post your property
            </Text>
            <Text style={styles.headerDescription}>
              Providing clear details helps you get quality leads faster.
            </Text>
          </View>

          {/* Progress Indicator */}
          {renderProgressIndicator()}

          {/* Form Container */}
          <View style={styles.formContainer}>
            {step === 1 && (
              <BasicDetailsForm
                formData={formData}
                handleInputChange={handleInputChange}
                nextStep={nextStep}
              />
            )}
            {step === 2 && (
              <LocationDetailsForm
                formData={formData}
                handleInputChange={handleInputChange}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 3 && renderPropertyProfileForm()}
            {step === 4 && (
              <PhotosForm
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 5 && (
              <PricingForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                prevStep={prevStep}
                loading={loading}
              />
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 20,
  },
  headerBox: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  progressText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 3,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  stepTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    overflow: "hidden",
  },
});

export default Post;

import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image , Dimensions} from 'react-native';
import { useRegistrationData } from '../../hooks/RegistrationDataContext';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useImagePicker } from '../../hooks/ImagePickerHook';

const {width, height}= Dimensions.get('window')

const BasicInformationScreen = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistrationData();
  const [firstName, setFirstName] = useState(registrationData.firstName);
  const [lastName, setLastName] = useState(registrationData.lastName);
  const { profileImage, handleProfileImagePress } = useImagePicker();


  const handleNext = () => {
    updateRegistrationData({ firstName, lastName });
    navigation.navigate('MechCNICScreen');
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Basic Information</Text>

      <TouchableOpacity  onPress={handleProfileImagePress}>
        <View style={styles.imagePicker}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/Icons/userDefault.png')}
            style={styles.profileImage}
          />
            <Text style={styles.imagePickerText}>Upload a profile picture</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
      />

      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton:{
    position: 'absolute', // Position absolutely so it can be placed over other content
    top: Platform.OS === 'ios' ? 44 : 20, // Spacing from the top, adjust for different platforms if needed
    left: 10, // Spacing from the left
    zIndex: 10, // Ensure it sits above other content
    backgroundColor: 'transparent', // No background color
    padding: 20, // Add padding to increase the touchable area
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePicker: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'gray',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePickerText: {
    color: 'gray',
    textAlign: 'center',
    
  },
});

export default BasicInformationScreen;

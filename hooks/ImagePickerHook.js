// utils/imagePickerUtils.js or hooks/useImagePicker.js
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export const useImagePicker = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImagePress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(pickerResult);
    if (!pickerResult.canceled && pickerResult.assets) {
      const selectedImageUri = pickerResult.assets[0].uri;
      setProfileImage(selectedImageUri);
    }
  };

  return {
    profileImage,
    handleProfileImagePress,
  };
};

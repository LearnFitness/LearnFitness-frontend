import React from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AvatarDisplay from './AvatarDisplay';

export default function AvatarPicker({ size=200, photoObject, setPhotoObject }) {

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoObject(result.assets[0]);
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {photoObject ?
        <AvatarDisplay source={{ uri: photoObject.uri }} size={size} handleOnPress={pickImage} />
        :
        <AvatarDisplay source={null} size={size} handleOnPress={pickImage} />
      }
    </View>
  );
}

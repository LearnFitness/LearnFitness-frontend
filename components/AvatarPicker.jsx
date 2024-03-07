import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@rneui/themed';

export default function AvatarPicker() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {image ?
        <Avatar source={{ uri: image }} size={200} rounded onPress={pickImage} >
          <Avatar.Accessory name='pencil' type='font-awesome' size={50} onPress={pickImage}/>
        </Avatar>
        :
        <Avatar icon={{ name: "user", type: "font-awesome" }} containerStyle={{ backgroundColor: 'grey' }} size={200} rounded onPress={pickImage} >
          <Avatar.Accessory name='pencil' type='font-awesome' size={50} onPress={pickImage}/>
        </Avatar>
      }
    </View>
  );
}
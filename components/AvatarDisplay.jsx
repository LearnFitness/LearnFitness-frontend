import { Avatar } from '@rneui/themed';
import { StyleSheet } from 'react-native';

export default function AvatarDisplay({ source, size, handleOnPress = null, pressable = true, editable = true, rounded = true }) {
  return (
    source ?
      (
        <Avatar source={source} size={size} rounded={rounded} onPress={pressable ? handleOnPress : null} >
          {editable ? <Avatar.Accessory name='camera' type='feather' size={size / 5} onPress={pressable ? handleOnPress : null} style={styles.avatarAccessory} /> : null}
        </Avatar>
      ) : (
        <Avatar icon={{ name: "user", type: "font-awesome" }} containerStyle={{ backgroundColor: 'grey' }} size={size} rounded={rounded} onPress={pressable ? handleOnPress : null} >
          {editable ? <Avatar.Accessory name='camera' type='feather' size={size / 5} onPress={pressable ? handleOnPress : null} style={styles.avatarAccessory} /> : null}
        </Avatar >
      )
  )
}

const styles = StyleSheet.create({
  avatarAccessory: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    backgroundColor: '#004A85'
  }
});
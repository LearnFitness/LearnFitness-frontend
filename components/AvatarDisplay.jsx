import { Avatar } from '@rneui/themed';

export default function AvatarDisplay({ handleOnPress, source, size, editable = true, rounded = true }) {
  return (
    source ?
      (
        <Avatar source={source} size={size} rounded={rounded} onPress={handleOnPress} >
          {editable ? <Avatar.Accessory name='pencil' type='font-awesome' size={size / 4} onPress={handleOnPress} /> : null}
        </Avatar>
      ) : (
        <Avatar icon={{ name: "user", type: "font-awesome" }} containerStyle={{ backgroundColor: 'grey' }} size={size} rounded={rounded} onPress={handleOnPress} >
          {editable ? <Avatar.Accessory name='pencil' type='font-awesome' size={size / 4} onPress={handleOnPress} /> : null}
        </Avatar >
      )
  )
}
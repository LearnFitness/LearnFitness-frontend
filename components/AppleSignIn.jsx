import { View, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import auth from "@react-native-firebase/auth";

export default function AppleSignIn() {
  return (
    <View>
      {AppleAuthentication.isAvailableAsync ?
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={50}
          style={{width: 300, height: 40}}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              const appleCredential = auth.AppleAuthProvider.credential(credential.identityToken);
              await auth().signInWithCredential(appleCredential);
            } catch (error) {
              if (error.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
              } else {
                Alert.alert(error.message);
              }
            }
          }}
        /> 
        : null
      }

    </View>
  );
}

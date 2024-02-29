import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Image } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/welcomeImg.jpg")} resizeMode="cover" style={styles.imgBg}>
        <View style={styles.welcomeTextContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>LearnFitness</Text>
          <Text style={styles.subTitle}>A fitness app for everyone</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignInScreen")}
          style={styles.signInButton}>
          <Text style={styles.signInButtonText}>GET STARTED</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    marginLeft: 35,
    width: 100,
    height: 100,
  },
  welcomeTextContainer: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: 50,
    fontWeight: "800",
    color: "white",
    marginBottom: 20
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: 30,
    fontWeight: "300",
    color: "white",
  },
  signInButton: {
    width: "80%",
    height: 70,
    backgroundColor: "white",
    borderRadius: 50,
    margin: 8,
    marginBottom: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  signInButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "black"
  }
})
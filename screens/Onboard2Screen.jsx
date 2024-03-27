import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View, Pressable, SafeAreaView } from "react-native";
import auth from "@react-native-firebase/auth";
import { postBackendDataWithPhoto, postBackendData } from "../utils/backendAPI";
import { OnboardContext } from "../context/OnboardContext";
import { appStyles } from "../utils/styles";
import { Divider } from "@rneui/base";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";

export default function Onboard2Screen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { onboardData, updateOnboardData } = useContext(OnboardContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const expLevels = ["Beginner", "Intermediate", "Advanced"];
  const expDescriptions = ["You are new to fitness training", "You have been training regularly", "You're fit and ready for an intensive workout plan"];

  function handleSelectItem(index) {
    setSelectedIndex(index);
    updateOnboardData("expLevel", expLevels[index]);
  }

  async function handleSubmitOnboardData() {
    console.log("onboardData on submit: ", onboardData);
    setLoading(true);
    try {
      // Check if the user has submitted a photo
      if (onboardData.hasOwnProperty("photoObject")) {
        await postBackendDataWithPhoto("user/signup/photo", onboardData);
      } else {
        await postBackendData("user/signup", onboardData);
      }
      navigation.navigate("HomeNavigator");
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton color="blue" handleOnPress={() => navigation.goBack()} />
      <Text style={[appStyles.heading1, { marginTop: "15%" }]}>Choose your fitness level</Text>
      <Text style={[appStyles.heading2]}>Step 2 of 2</Text>

      <View style={styles.expContainer}>
        {expLevels.map((level, index) => {
          const selected = index === selectedIndex;
          return (
            <View key={index}>
              {index === 0 ? null : <Divider />}
              <Pressable onPress={() => handleSelectItem(index)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
                <View>
                  <Text style={styles.expLevel}>{level}</Text>
                  <Text style={[styles.expDescriptions, selected ? styles.selectedItem : null]}>{expDescriptions[index]}</Text>
                </View>
                {selected ? <FontAwesome name="check" size={20} color="blue" /> : null}
              </Pressable>
            </View>);
        })}
      </View>

      <PrimaryButton title="Create Account" handleOnPress={handleSubmitOnboardData} loading={loading} disabled={loading} />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginTop: "20%",
    marginHorizontal: "10%"
  },
  expContainer: {
    marginTop: 20,
    gap: 10
  },
  expLevel: {
    fontWeight: "500",
    fontSize: 22,
    marginBottom: "2%"
  },
  expDescriptions: {
    fontWeight: "300",
    fontSize: 18,
  },
  selectedItem: {
    color: "blue"
  },
})
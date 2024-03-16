import { View, Text, StyleSheet } from "react-native";

export default function SignUpInput({ title, InputComponent, flexDirection = "row", ...props }) {
  return (
    <View style={[styles.container, {flexDirection: flexDirection}]}>
      <Text style={styles.title}>{title}</Text>
      <InputComponent style={styles.inputComponent} {...props} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    margin: 5
  },
  inputComponent: {

  }
})

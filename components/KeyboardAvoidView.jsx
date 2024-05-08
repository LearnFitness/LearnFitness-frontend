import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";

export default function KeyboardAvoidView({ containerStyle, children }) {
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="position"
        contentContainerStyle={[{ flex: 1 }, containerStyle]}
      >
        {children}
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
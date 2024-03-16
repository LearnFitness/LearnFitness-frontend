import { Button } from "@rneui/themed";

export default function PrimaryButton({ title, loading, disabled, handleOnPress }) {
  return (
    <Button
      title={title}
      loading={loading}
      disabled={disabled}
      onPress={handleOnPress}
      disabledStyle={{ backgroundColor: "gray" }}
      buttonStyle={{
        backgroundColor: "#0087d6",
        height: 50,
        borderRadius: 30
      }}
    />
  )
}
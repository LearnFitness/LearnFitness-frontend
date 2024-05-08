import Toast from "react-native-root-toast";

export default function toast(message, duration = 1500, offset = -100) {
  // Add a Toast on screen.
  Toast.show(message, {
    duration: duration,
    position: offset,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: "royalblue",
    opacity: 1,
  });
}

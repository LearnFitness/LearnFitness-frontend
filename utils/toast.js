import Toast from "react-native-root-toast";

export default function toast(message, duration = 1500, position = "bottom") {
  // Add a Toast on screen.
  Toast.show(message, {
    duration: duration,
    position: position === "bottom" ? -100 : position === "center" ? 0 : 100,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: "royalblue",
    opacity: 1,
  });
}

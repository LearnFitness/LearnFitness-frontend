import { LinearGradient } from "expo-linear-gradient";

export default function LinearBackground({children}) {
  return (
    <LinearGradient colors={['#002f51', '#00604f']} style={{flex: 1}} >
      {children}
    </LinearGradient>
  )
}
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import toast from "../utils/toast";

export default function RestTimer({ initialDuration = 15 }) {
  const [isComplete, setIsComplete] = useState(true);
  const [duration, setDuration] = useState(0);

  function handleStopRest() {
    setDuration(0);
    setIsComplete(true);
  }

  function handleStartRest() {
    setDuration(initialDuration);
    setIsComplete(false);
  }

  return (
    <View style={styles.container}>
      {isComplete ?
        <TouchableOpacity onPress={handleStartRest} style={styles.restButton}>
          <Text style={styles.restButtonText}>Rest</Text>
        </TouchableOpacity>
        :
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CountdownCircleTimer
            size={70}
            strokeWidth={6}
            isPlaying
            duration={duration}
            colors={['#006662']}
            onComplete={() => {
              toast("Time's up", 1500, -20);
              handleStopRest();
              return { shouldRepeat: false }
            }}
          >
            {({ remainingTime }) => {
              const minutes = padToTwoDigits(Math.floor(remainingTime / 60));
              const seconds = padToTwoDigits(remainingTime % 60);

              return <Text style={styles.remainingTime}>{minutes}:{seconds}</Text>
            }
            }
          </CountdownCircleTimer>

          <View>
            <TouchableOpacity onPress={() => setDuration(duration + 30)} style={styles.timerActionButton}>
              <Text style={styles.timerActionButtonText}>Add 30s</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStopRest} style={styles.timerActionButton}>
              <Text style={styles.timerActionButtonText}>Cancel rest</Text>
            </TouchableOpacity>
          </View>


        </View>

      }
    </View>
  )
}

function padToTwoDigits(number) {
  return number < 10 ? `0${number}` : number;
}

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  restButton: {
    backgroundColor: "#005f72",
    padding: 10,
    borderRadius: 10
  },
  restButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500"
  },
  remainingTime: {
    color: "white"
  },
  timerActionButton: {
    padding: 8,
    margin: 5,
    backgroundColor: "#005f72",
    borderRadius: 10

  },
  timerActionButtonText: {
    color: "white", 
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500"
  }
})
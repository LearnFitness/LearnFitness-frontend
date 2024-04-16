import { useState } from 'react';
import { Alert, Button, Text, Modal, SafeAreaView, View } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useCountdown } from 'react-native-countdown-circle-timer'

function RestTimer({ duration, remainingTime }) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>{remainingTime} of {duration}</Text>
    </View>
  )
}

function RestTimerModal({ isModalVisible, setModalVisible, remainingTime, duration, setDuration, setKey }) {

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}>
          <CountdownCircleTimer
            isPlaying
            duration={duration}
            initialRemainingTime={remainingTime}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[60, 30, 15, 0]}
            onComplete={() => { Alert.alert("Time's up"); return { shouldRepeat: false } }}
          >
            {({ remainingTime }) => {
              const minutes = Math.floor(remainingTime / 60)
              const seconds = remainingTime % 60

              return <Text>{minutes}:{seconds}</Text>
            }
            }
          </CountdownCircleTimer>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 30 }}>{remainingTime} of {duration}</Text>
          </View>

          <Button title="Minimize" onPress={() => setModalVisible(false)} />
          <Button title="Add 10s" onPress={() => { setDuration(prev => prev + 10); setKey(prev => prev + 1); }} />
          <Button title="STOP" onPress={() => { setDuration(0); setModalVisible(false); }} />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

function test({ route, navigation }) {
  const { workout } = route.params;
  const [isRestModalVisible, setRestModalVisible] = useState(false);
  const [duration, setDuration] = useState(60);

  const {
    path,
    pathLength,
    stroke,
    strokeDashoffset,
    remainingTime,
    elapsedTime,
    size,
    strokeWidth,
  } = useCountdown({ isPlaying: true, duration: duration, colors: '#abc', initialRemainingTime: duration })

  return (
    <SafeAreaView style={{}}>
      <Text>{workout.name}</Text>
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        initialRemainingTime={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[60, 30, 15, 0]}
        onComplete={() => { Alert.alert("Time's up"); return { shouldRepeat: false } }}
      >
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60)
          const seconds = remainingTime % 60

          return <Text>{minutes}:{seconds}</Text>
        }
        }
      </CountdownCircleTimer>
      <Button title="Show Modal" onPress={() => { setRestModalVisible(true); }} />
      {/* {isRestModalVisible || duration === 0 ? null : <RestTimer remainingTime={remainingTime} duration={duration} />} */}
      <RestTimer remainingTime={remainingTime} duration={duration} />
    </SafeAreaView>
  )
}

export default function StartWorkoutScreen({ route, navigation }) {
  const { workout } = route.params;

  return (
    <>
    </>
  )
}
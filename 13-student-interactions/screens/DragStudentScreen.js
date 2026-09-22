import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const pan = useRef(new Animated.ValueXY()).current;
  const canDrag = useRef(true);
  const [locked, setLocked] = useState(false);
  const [cardColor, setCardColor] = useState('#D8F3DC');

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => canDrag.current,

      onPanResponderGrant: () => {
        setCardColor('#FFF1A8');
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        {
          useNativeDriver: false,
          listener: (_, gestureState) => {
            if (Math.abs(gestureState.dx) > 120) {
              setCardColor('#FFCDD2');
            } else {
              setCardColor('#BBDEFB');
            }
          },
        }
      ),

      onPanResponderRelease: () => {
        Animated.timing(pan, {
          toValue: { x: 0, y: 0 },
          duration: 500,
          useNativeDriver: false,
        }).start();
        setCardColor('#D8F3DC');
      },

      onPanResponderTerminate: () => {
        pan.setValue({ x: 0, y: 0 });
        setCardColor('#D8F3DC');
      },
    })
  ).current;

  const toggleLock = () => {
    canDrag.current = !canDrag.current;
    setLocked(!canDrag.current);
    pan.setValue({ x: 0, y: 0 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drag a student card</Text>
      <Text style={styles.instructions}>
        Drag the card. Move it far left or right to cross the threshold.
      </Text>

      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
            ],
            backgroundColor: cardColor,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.name}>Aisha Khan</Text>
        <Text>Computer Applications</Text>
        <Text>aisha.khan@example.com</Text>
      </Animated.View>

      <Pressable
        style={[styles.button, locked && styles.unlockButton]}
        onPress={toggleLock}
      >
        <Text style={styles.buttonText}>
          {locked ? 'Unlock card' : 'Lock card'}
        </Text>
      </Pressable>

      <Text style={styles.status}>
        Dragging is {locked ? 'disabled' : 'enabled'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F7F9FC',
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  instructions: { textAlign: 'center', marginBottom: 32, color: '#445' },
  card: {
    width: 280,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#78909C',
    elevation: 4,
  },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  button: {
    marginTop: 36,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#1F6FEB',
  },
  unlockButton: { backgroundColor: '#2E7D32' },
  buttonText: { color: 'white', fontWeight: '700' },
  status: { marginTop: 12 },
});


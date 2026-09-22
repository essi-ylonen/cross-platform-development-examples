import React, { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, Pressable } from 'react-native';

const DELETE_THRESHOLD = -110;

export default function StudentRow({ student, onDelete }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [pastThreshold, setPastThreshold] = useState(false);
  const deleteOpacity = pan.x.interpolate({
  inputRange: [DELETE_THRESHOLD, 0],
  outputRange: [1, 0],
  extrapolate: 'clamp',
});


  const resetRow = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    setPastThreshold(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

      onPanResponderMove: (_, gestureState) => {
  const x = Math.min(0, gestureState.dx);
    pan.setValue({ x, y: 0 });

  const danger = x < DELETE_THRESHOLD;

    if (danger !== pastThreshold) {
    setPastThreshold(danger);
  }
},

     onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < DELETE_THRESHOLD) {
    Animated.spring(pan, {
      toValue: { x: -110, y: 0 },
      useNativeDriver: false,
    }).start();
  } else {
    resetRow();
  }
},

onPanResponderTerminate: resetRow,
      
    })
  ).current;

  return (
    <View style={styles.background}>
     <Pressable
      style={styles.deleteButton}
      onPress={() => onDelete(student.id)}
      >
  <Animated.Text style={[styles.deleteText, { opacity: deleteOpacity }]}>
    Delete
  </Animated.Text>
</Pressable>



      <Animated.View
        style={[
          styles.row,
          pastThreshold && styles.rowDanger,
          { transform: [{ translateX: pan.x }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.programme}>{student.programme}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#B3261E',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteText: { color: 'white', fontWeight: '800' },
  row: {
    width: '100%',
    padding: 18,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E2EA',
  },
  rowDanger: { backgroundColor: '#FFEBEE' },
  name: { fontSize: 18, fontWeight: '700' },
  programme: { marginTop: 4, color: '#556' },
  
 
deleteButton: {
  width: 110,
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
},
});


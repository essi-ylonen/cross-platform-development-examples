import React from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

export default function FishForm(props) {
  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Enter a fish name"
        value={props.value}
        onChangeText={props.onFishInput}
        onSubmitEditing={props.onAddFish}
      />

      <Pressable
        onPress={props.onAddFish}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#003755',
    borderRadius: 6,
    padding: 10,
    marginRight: 10,
  },

  addButton: {
    backgroundColor: '#003755',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 6,
  },

  pressedButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
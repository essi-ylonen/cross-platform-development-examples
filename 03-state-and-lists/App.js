import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';

export default function App() {

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {

    if (task.trim() === '') {
      return;
    }

    setTasks([...tasks, task]);
    setTask('');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        My Task List
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={task}
        onChangeText={setTask}
      />

      <Button
        title="Add Task"
        onPress={addTask}
      />

      <Text style={styles.subheading}>
        Tasks:
      </Text>

      {tasks.map((item, index) => (
        <Text key={index}>
          {index + 1}. {item}
        </Text>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  heading: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  subheading: {
    marginTop: 20,
    fontWeight: 'bold',
  },
});
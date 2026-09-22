import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentRow from '../components/StudentRow';

const INITIAL_STUDENTS = [
  { id: 's1', name: 'Aisha Khan', programme: 'Computer Applications' },
  { id: 's2', name: 'Leo Virtanen', programme: 'Business Information Technology' },
  { id: 's3', name: 'Mina Park', programme: 'Computer Applications' },
  { id: 's4', name: 'Omar Ali', programme: 'Business Information Technology' },
];

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const deleteStudent = (id) => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== id)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student List</Text>
      <Text style={styles.instructions}>
        Swipe a student left. Release after the red area appears.
      </Text>

      <FlatList
        data={students}
        keyExtractor={(student) => student.id}
        renderItem={({ item }) => (
          <StudentRow student={item} onDelete={deleteStudent} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No students in the list.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F9FC' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  instructions: { color: '#445', marginBottom: 20 },
  separator: { height: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#667' },
});


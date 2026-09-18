import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentItem from './components/StudentItem';
import { addStudent, getStudents, initDatabase, deleteStudent, updateStudent, } from './database/db';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [programme, setProgramme] = useState('');
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  

  useEffect(() => {
    async function prepareDatabase() {
      try {
              await initDatabase();
              await loadStudents();
            } catch (error) {
              Alert.alert('Database error', error.message);
            }
    }
    prepareDatabase();
  }, [sortOrder]);

  async function loadStudents() {
    try {
      const rows = await getStudents(sortOrder);
      console.log('Students from SQLite:', rows);
      setStudents(rows);
    } catch (error) {
      Alert.alert('Reading failed', error.message);
    }
  }

  function clearForm() {
    setName('');
    setEmail('');
    setProgramme('');
    setEditingId(null);
  }

  function startEditing(student) {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setProgramme(student.programme);
  }


  async function handleSave() {
      if (!name.trim() || !email.trim() || !programme.trim()) {
        Alert.alert('Missing information', 'Enter name, email and degree programme.');
        return;
      }
      try {
        if (editingId === null) {
          await addStudent(name, email, programme);
        } else {
          await updateStudent(editingId, name, email, programme);
        }
        clearForm();
        await loadStudents();
      } catch (error) {
        Alert.alert('Saving failed', error.message);
      }
    }

    function confirmDelete(student) {
        Alert.alert(
          'Delete student?',
          `${student.name} will be removed from this device.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteStudent(student.id);
                  if (editingId === student.id) clearForm();
                  await loadStudents();
                } catch (error) {
                  Alert.alert('Deleting failed', error.message);
                }
              },
            },
          ]
        );
      }


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>SQLite Students, Part 2</Text>
        <Text style={styles.mode}>{editingId === null ? 'Add a new student' : `Editing student ${editingId}`}</Text>
        <TextInput
          style={styles.input}
          placeholder="Student name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Degree programme"
          value={programme}
          onChangeText={setProgramme}
        />

        <View style={styles.buttons}>
          
          <Button title={editingId === null ? 'Add student' : 'Save changes'} onPress={handleSave} />
          <Button title="Cancel" onPress={clearForm} disabled={editingId === null} />
          <Button title="Read all" onPress={loadStudents} />
        </View>

        <View style={styles.sortButtons}>
          <Button title="Newest first" onPress={() => setSortOrder('newest')} />
          <Button title="Name A-Z" onPress={() => setSortOrder('name')} />
        </View>

        
        <Text style={styles.countText}>
          Number of students: {students.length}
        </Text>

        
        <FlatList
          //style={styles.list}
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StudentItem student={item} onEdit={() => startEditing(item)} onDelete={() => confirmDelete(item)} />
          )}
          ListEmptyComponent={<Text>No students saved yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f9' },
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#00638e' },
  mode: { color: '#475467', fontWeight: '600' },
  input: { backgroundColor: '#fff', borderColor: '#98a2b3', borderWidth: 1, borderRadius: 8, padding: 12 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sortButtons: { flexDirection: 'row', gap: 10, marginBottom: 12, },
  list: { marginTop: 8 },
  row: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  name: { fontSize: 17, fontWeight: '600' },
});

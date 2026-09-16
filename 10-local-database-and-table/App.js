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
import { addStudent, getStudents, initDatabase } from './database/db';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [programme, setProgramme] = useState('');
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('Preparing database...');

  useEffect(() => {
    async function prepareDatabase() {
      try {
        await initDatabase();
        setStatus('Database and students table are ready.');
        await loadStudents();
      } catch (error) {
        setStatus(`Database error: ${error.message}`);
      }
    }
    prepareDatabase();
  }, []);

  async function loadStudents() {
    try {
      const rows = await getStudents();
      console.log('Students from SQLite:', rows);
      setStudents(rows);
    } catch (error) {
      Alert.alert('Reading failed', error.message);
    }
  }

  async function handleAddStudent() {
    if (!name.trim() || !email.trim() || !programme.trim()) {
      Alert.alert('Missing information', 'Enter name, email and degree programme.');
      return;
    }
    try {
      const result = await addStudent(name, email, programme);
      console.log('Inserted row id:', result.lastInsertRowId);
      setName('');
      setEmail('');
      setProgramme('');
      await loadStudents();
    } catch (error) {
      Alert.alert('Adding failed', error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>SQLite Students, Part 1</Text>
        <Text style={styles.status}>{status}</Text>
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
          <Button title="Add student" onPress={handleAddStudent} />
          <Button title="Read all" onPress={loadStudents} />
        </View>
        <FlatList
          style={styles.list}
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.email}</Text>
              <Text>{item.programme}</Text>
            </View>
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
  status: { color: '#475467' },
  input: { backgroundColor: '#fff', borderColor: '#98a2b3', borderWidth: 1, borderRadius: 8, padding: 12 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
  list: { marginTop: 8 },
  row: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  name: { fontSize: 17, fontWeight: '600' },
});

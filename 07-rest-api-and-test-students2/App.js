import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Replace this with your computer's current IPv4 address.
const BASE_URL = 'http://172.17.103.31:3000';

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [programme, setProgramme] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudents();
  }, []);

  const requestErrorMessage = async (response, fallback) => {
    try {
      const data = await response.json();
      return data.message || fallback;
    } catch {
      return fallback;
    }
  };

  const getStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${BASE_URL}/students`);
      console.log('GET response:', response.status);
      if (!response.ok) throw new Error(await requestErrorMessage(response, 'Reading failed'));
      const data = await response.json();
      console.log('GET data:', data);
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, programme }),
      });
      console.log('POST response:', response.status);
      if (!response.ok) throw new Error(await requestErrorMessage(response, 'Creating failed'));
      const created = await response.json();
      console.log('Created student:', created);
      clearForm();
      await getStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${BASE_URL}/students/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, programme }),
      });
      console.log('PUT response:', response.status);
      if (!response.ok) throw new Error(await requestErrorMessage(response, 'Updating failed'));
      const updated = await response.json();
      console.log('Updated student:', updated);
      clearForm();
      await getStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${BASE_URL}/students/${id}`, { method: 'DELETE' });
      console.log('DELETE response:', response.status);
      if (!response.ok) throw new Error(await requestErrorMessage(response, 'Deleting failed'));
      // A successful 204 response has no JSON body to parse.
      if (selectedId === id) clearForm();
      await getStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    if (!name.trim() || !programme.trim()) {
      Alert.alert('Missing information', 'Enter both name and programme.');
      return;
    }
    selectedId === null ? createStudent() : updateStudent();
  };

  const startEditing = (student) => {
    setSelectedId(student.id);
    setName(student.name);
    setProgramme(student.programme);
    setError('');
  };

  const clearForm = () => {
    setSelectedId(null);
    setName('');
    setProgramme('');
  };

  const confirmDelete = (student) => {
    Alert.alert('Delete student', `Delete ${student.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteStudent(student.id) },
    ]);
  };

  const renderStudent = ({ item }) => (
    <Pressable
      onPress={() => startEditing(item)}
      onLongPress={() => confirmDelete(item)}
      style={({ pressed }) => [styles.studentCard, pressed && styles.pressed]}
    >
      <Text style={styles.studentName}>{item.name}</Text>
      <Text>{item.programme}</Text>
      <Text style={styles.hint}>Tap to edit • Long-press to delete • ID: {item.id}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Students CRUD</Text>
        <Text style={styles.mode}>{selectedId === null ? 'Create a new student' : `Editing student ${selectedId}`}</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Programme" value={programme} onChangeText={setProgramme} />

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={submit}>
            <Text style={styles.buttonText}>{selectedId === null ? 'Add student' : 'Save changes'}</Text>
          </Pressable>
          {selectedId !== null && (
            <Pressable style={styles.secondaryButton} onPress={clearForm}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </Pressable>
          )}
          <Pressable style={styles.secondaryButton} onPress={getStudents}>
            <Text style={styles.secondaryText}>Refresh</Text>
          </Pressable>
        </View>

        {loading && <ActivityIndicator size="large" color="#003755" />}
        {error ? <Text style={styles.error}>{error}</Text> : null}

   
   

        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudent}
          contentContainerStyle={styles.list}
          ListEmptyComponent={!loading ? <Text>No students found.</Text> : null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7f8' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#003755', marginBottom: 4 },
  mode: { color: '#475467', marginBottom: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#98a2b3', borderRadius: 8, padding: 12, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  primaryButton: { backgroundColor: '#003755', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#003755', paddingVertical: 11, paddingHorizontal: 16, borderRadius: 8 },
  secondaryText: { color: '#003755', fontWeight: '600' },
  error: { color: '#b42318', backgroundColor: '#fef3f2', padding: 10, borderRadius: 8, marginBottom: 10 },
  list: { paddingBottom: 24 },
  studentCard: { backgroundColor: '#fff', padding: 14, marginBottom: 10, borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#006b7a' },
  pressed: { opacity: 0.65 },
  studentName: { fontSize: 17, fontWeight: '700', color: '#003755' },
  hint: { marginTop: 6, fontSize: 12, color: '#667085' },
});

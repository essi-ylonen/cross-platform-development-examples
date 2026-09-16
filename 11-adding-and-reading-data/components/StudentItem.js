import { Button, StyleSheet, Text, View } from 'react-native';

export default function StudentItem({ student, onEdit, onDelete }) {
  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <Text style={styles.name}>{student.name}</Text>
        <Text>{student.email}</Text>
        <Text>{student.programme}</Text>
      </View>
      <View style={styles.action}><Button title="Edit" onPress={onEdit} /></View>
      <View style={styles.action}><Button title="Delete" color="#b42318" onPress={onDelete} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  details: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600' },
  action: { minWidth: 64 },
});


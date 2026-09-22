import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PROGRAMMES = ['All', 'Computer Applications', 'Business IT'];

const INITIAL_STUDENTS = [
  { id: 's1', name: 'Aisha Khan', programme: 'Computer Applications', selected: false },
  { id: 's2', name: 'Leo Virtanen', programme: 'Business IT', selected: false },
  { id: 's3', name: 'Mina Park', programme: 'Computer Applications', selected: true },
  { id: 's4', name: 'Omar Ali', programme: 'Business IT', selected: false },
  { id: 's5', name: 'Tero Karhu', programme: 'Business IT', selected: false },
  { id: 's6', name: 'Mary Smith', programme: 'Computer Applications', selected: false },
];

function RadioOption({ label, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.radioRow}
    >
      <View style={[styles.outerCircle, selected && styles.outerSelected]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedProgramme, setSelectedProgramme] = useState('All');

  const toggleStudent = (id) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  };

  const filteredStudents = useMemo(() => {
    if (selectedProgramme === 'All') return students;
    return students.filter(
      (student) => student.programme === selectedProgramme
    );
  }, [students, selectedProgramme]);

  const selectedCount = students.filter(
    (student) => student.selected
  ).length;

  const removeSelected = () => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => !student.selected)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student choices</Text>

      <Text style={styles.heading}>Filter by programme</Text>
      <View accessibilityRole="radiogroup" style={styles.radioGroup}>
        {PROGRAMMES.map((programme) => (
          <RadioOption
            key={programme}
            label={programme}
            selected={selectedProgramme === programme}
            onPress={() => setSelectedProgramme(programme)}
          />
        ))}
      </View>

      <Text style={styles.heading}>Select students</Text>
      <FlatList
        data={filteredStudents}
        keyExtractor={(student) => student.id}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Checkbox
              value={item.selected}
              onValueChange={() => toggleStudent(item.id)}
              color={item.selected ? '#1F6FEB' : undefined}
              accessibilityLabel={`Select ${item.name}`}
            />
            <View style={styles.studentText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.programme}>{item.programme}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text>{selectedCount} selected</Text>
        <Pressable
          onPress={removeSelected}
          disabled={selectedCount === 0}
          style={[
            styles.deleteButton,
            selectedCount === 0 && styles.disabledButton,
          ]}
        >
          <Text style={styles.deleteButtonText}>Remove selected</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F9FC' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 18 },
  heading: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  radioGroup: { marginBottom: 22 },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  outerCircle: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: '#607D8B', alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  outerSelected: { borderColor: '#1F6FEB' },
  innerCircle: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1F6FEB' },
  studentRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    backgroundColor: 'white', borderRadius: 10, marginBottom: 10,
    borderWidth: 1, borderColor: '#D8E2EA',
  },
  studentText: { marginLeft: 12 },
  name: { fontSize: 17, fontWeight: '700' },
  programme: { color: '#556', marginTop: 3 },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#D8E2EA',
  },
  deleteButton: { backgroundColor: '#B3261E', padding: 12, borderRadius: 8 },
  disabledButton: { backgroundColor: '#B0BEC5' },
  deleteButtonText: { color: 'white', fontWeight: '700' },
});


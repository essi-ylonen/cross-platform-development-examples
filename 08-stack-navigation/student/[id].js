import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const API_BASE_URL = "http://10.239.200.1:3000/students";
// Change the IP address to your own computer's IPv4 address.

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getStudent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) getStudent();
  }, [id]);

  if (loading)
    return <ActivityIndicator style={styles.centered} size="large" />;

  if (error || !student) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Could not load student {id}.</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: student.name }} />
      <Text style={styles.label}>Student ID</Text>
      <Text style={styles.value}>{student.id}</Text>

      <Text style={styles.label}>Name</Text>
      <Text style={styles.value}>{student.name}</Text>

      <Text style={styles.label}>Degree Programme</Text>
      <Text style={styles.value}>{student.programme}</Text>

      {student.email ? (
        <>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{student.email}</Text>
        </>
      ) : null}

      <Text style={styles.hint}>
        Use the arrow in the header to return to the list.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f7f8" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#003755", marginBottom: 4 },
  mode: { color: "#475467", marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#98a2b3",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#003755",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#003755",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryText: { color: "#003755", fontWeight: "600" },
  error: {
    color: "#b42318",
    backgroundColor: "#fef3f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  list: { paddingBottom: 24 },
  studentCard: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#006b7a",
  },
  pressed: { opacity: 0.65 },
  studentName: { fontSize: 17, fontWeight: "700", color: "#003755" },
  hint: { marginTop: 6, fontSize: 12, color: "#667085" },
  label: { marginTop: 16, color: "#667085", fontSize: 13 },
  value: { color: "#17324d", fontSize: 20, fontWeight: "600" },
});

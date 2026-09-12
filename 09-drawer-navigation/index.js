import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL = "http://10.239.200.1:3000/students";
// Change the IP address to your own computer's IPv4 address.

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setStudents(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStudents();
    }, []),
  );

  if (loading)
    return <ActivityIndicator style={styles.centered} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.intro}>
        This route reloads when it receives focus.
      </Text>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.button} onPress={getStudents}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentRow}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.programme}>{item.programme}</Text>
              <Text style={styles.id}>ID {item.id}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No students found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  intro: { marginBottom: 12, color: "#475467" },
  studentRow: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "600", color: "#17324d" },
  id: { color: "#667085" },
  error: { color: "#b42318", marginBottom: 12 },
  button: { backgroundColor: "#006a8e", padding: 12, borderRadius: 8 },
  buttonText: { color: "#ffffff", fontWeight: "bold" },
});

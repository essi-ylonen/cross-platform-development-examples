import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const router = useRouter();

  const getStudents = async () => {
    try {
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Could not load students.</Text>
        <Text>{error}</Text>
        <Pressable style={styles.button} onPress={getStudents}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Tap a student to open a new screen.
      </Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.studentRow,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              console.log(item.id);

              router.push({
                pathname: "/student/[id]",
                params: { id: item.id },
              });
            }}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.open}>Open details ›</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f8fa" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  instructions: { marginBottom: 12, color: "#475467" },
  studentRow: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  pressed: { opacity: 0.6 },
  name: { fontSize: 18, fontWeight: "600", color: "#17324d" },
  open: { color: "#006a8e", fontWeight: "600" },
  error: { color: "#b42318", fontWeight: "bold", marginBottom: 6 },
  button: {
    marginTop: 16,
    backgroundColor: "#006a8e",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#ffffff", fontWeight: "bold" },
});

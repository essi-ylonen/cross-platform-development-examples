import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const API_URL = "http://10.239.200.1:3000/students";
// Change the IP address to your own computer's IPv4 address.

export default function AddStudentScreen() {
  const [name, setName] = useState("");
  const [programme, setProgramme] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const addStudent = async () => {
    if (!name.trim() || !programme.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter both name and degree programme.",
      );
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          programme: programme.trim(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      setName("");
      setProgramme("");
      Alert.alert("Saved", "The student was added.");
      router.replace("/");
    } catch (err) {
      Alert.alert("Could not save student", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Student name"
        />

        <Text style={styles.label}>Degree Programme</Text>
        <TextInput
          style={styles.input}
          value={programme}
          onChangeText={setProgramme}
          placeholder="Degree Programme"
        />

        <Pressable
          style={[styles.button, saving && styles.disabled]}
          onPress={addStudent}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Add student"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f8fa" },
  form: { padding: 20 },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: "#344054",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#006a8e",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabled: { opacity: 0.55 },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});

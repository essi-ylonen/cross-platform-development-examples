import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Courses</Text>

      <CourseCard
        title="Cross-Platform Development"
        topic="React Native custom components"
        color="#003755"
      />

      <CourseCard
        title="Mobile Programming Project"
        topic="Planning an application MVP"
        color="#8A1538"
      />

      <CourseCard
        title="Web Development"
        topic="HTML, CSS and JavaScript"
        color="#53682B"
      />

      <StatusBar style="auto" />
    </View>
  );
}

function CourseCard({ title, topic, color }) {
  const showCourse = () => {
    Alert.alert(title, `Current topic: ${topic}`);
  };

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardTopic}>{topic}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: color },
          pressed && styles.buttonPressed,
        ]}
        onPress={showCourse}
      >
        <Text style={styles.buttonText}>View course</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f5',
    padding: 24,
    paddingTop: 70,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 6,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 6,
  },
  cardTopic: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 14,
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

import { StyleSheet, Text, View } from 'react-native';

// Custom component
const CourseCard = ({ title, credits, teacher, isOpen }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text>Credits: {credits}</Text>

      <Text>
        Teacher: {teacher.firstName} {teacher.lastName}
      </Text>

      <Text style={isOpen ? styles.open : styles.closed}>
        {isOpen ? 'Enrollment is open' : 'Enrollment is closed'}
      </Text>
    </View>
  );
};

// Main App component
export default function App() {
  const courseTeacher = {
    firstName: 'Essi',
    lastName: 'Lavonius-Ylönen',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My courses</Text>

      <CourseCard
        title="Cross-Platform Development"
        credits={5}
        teacher={courseTeacher}
        isOpen={true}
      />

      <CourseCard
        title="Mobile Programming Project"
        credits={5}
        teacher={courseTeacher}
        isOpen={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f2f4f5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#003755',
  },
  card: {
    backgroundColor: 'white',
    padding: 18,
    marginBottom: 14,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 8,
  },
  open: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 8,
  },
  closed: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
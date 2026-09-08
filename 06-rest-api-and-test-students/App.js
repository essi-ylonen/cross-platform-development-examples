import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {

    try {

    const response = await fetch(
      'http://172.17.103.43:3000/students'//change this to your own ip address
    );

    console.log("Response:");
    console.log(response);

    const data = await response.json();
    
    console.log("Data:");
    console.log(data);

    setStudents(data);

  } catch (error) {
    console.log("Error");
    console.log(error);
  }

  };

  return (
    <SafeAreaView>
      <FlatList
        data={students}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
      />
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FishForm from './components/FishForm'; // this line was added to use the FishForm.js

export default function App() {
  const [newFish, setNewFish] = useState('');

  const [fishList, setFishList] = useState([
    { fishId: '1', fishName: 'Bream' },
    { fishId: '2', fishName: 'Burbot' },
    { fishId: '3', fishName: 'Tench' },
  ]);

  const addFish = () => {
    const trimmedName = newFish.trim();

    if (trimmedName === '') {
      return;
    }

    const fishToAdd = {
      fishId: Date.now().toString(),
      fishName: trimmedName,
    };

    setFishList((currentFishList) => [
      ...currentFishList,
      fishToAdd,
    ]);

    setNewFish('');
  };

  const deleteFish = (fishIdToDelete) => {
    setFishList((currentFishList) =>
      currentFishList.filter(
        (fish) => fish.fishId !== fishIdToDelete
      )
    );
  };

  const keyHandler = (item) => {
    console.log('Key:', item.fishId);
    return item.fishId;
  };

  const renderFish = ({ item, index }) => {
    console.log('Rendering:', item.fishName);

    return (
      <Pressable
        onLongPress={() => deleteFish(item.fishId)}
        style={({ pressed }) => [
          styles.listItem,
          pressed && styles.pressedItem,
        ]}
      >
        <Text style={styles.fishText}>
          {index + 1}. {item.fishName}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Fish List</Text>

      <View style={styles.form}>
        <FishForm
          value={newFish}
          onFishInput={setNewFish}
          onAddFish={addFish}
        />



      </View>

      <Text style={styles.instruction}>
        Long press a fish to delete it
      </Text>

      /** This FlatList replaced TextInput and Pressable components that were removed to FishForm.js*/ 
      <FlatList
        data={fishList}
        keyExtractor={keyHandler}
        renderItem={renderFish}
        ListEmptyComponent={
          <Text style={styles.emptyText}>The list is empty.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 16,
  },
  form: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#003755',
    borderRadius: 6,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#003755',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  pressedButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  instruction: {
    marginBottom: 10,
    color: '#555555',
  },
  listItem: {
    backgroundColor: '#dcecf3',
    borderWidth: 1,
    borderColor: '#003755',
    borderRadius: 6,
    padding: 14,
    marginBottom: 8,
  },
  pressedItem: {
    opacity: 0.5,
  },
  fishText: {
    fontSize: 17,
    color: '#003755',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666666',
  },
});
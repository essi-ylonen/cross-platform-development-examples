import React, { useState } from 'react';
import {
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const [newFish, setNewFish] = useState('');

  const [fishList, setFishList] = useState([
    { fishId: '1', fishName: 'Bream' },
    { fishId: '2', fishName: 'Burbot' },
    { fishId: '3', fishName: 'Tench' },
  ]);

  const openModal = () => {
    setShowModal(true);
  };

  const cancelFish = () => {
    setNewFish('');
    setShowModal(false);
  };

  const addFish = () => {
    const trimmedName = newFish.trim();

    if (trimmedName.length === 0) {
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
    setShowModal(false);
  };

  const deleteFish = (fishIdToDelete) => {
    setFishList((currentFishList) =>
      currentFishList.filter(
        (fish) => fish.fishId !== fishIdToDelete
      )
    );
  };

  const keyHandler = (item) => {
    return item.fishId;
  };

  const renderFish = ({ item, index }) => {
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
    <View style={styles.container}>

      <Text style={styles.heading}>
        Fish List
      </Text>

      {/* MODAL */}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>

            <Text style={styles.modalHeading}>
              Add a New Fish
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter a fish name"
              value={newFish}
              onChangeText={setNewFish}
            />

            <View style={styles.buttonRow}>

              <Pressable
                onPress={cancelFish}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={addFish}
                style={styles.addButton}
              >
                <Text style={styles.buttonText}>
                  Add
                </Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>

      {/* OPEN MODAL BUTTON */}

      <Pressable
        onPress={openModal}
        style={styles.openButton}
      >
        <Text style={styles.buttonText}>
          Add New Fish
        </Text>
      </Pressable>

      {/* FLATLIST */}

      <FlatList
        data={fishList}
        keyExtractor={keyHandler}
        renderItem={renderFish}
      />

      <Text style={styles.infoText}>
        Long press a fish to delete it
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#ffffff',
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 20,
  },

  openButton: {
    backgroundColor: '#003755',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: 'center',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

  modalHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003755',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#003755',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  addButton: {
    backgroundColor: '#003755',
    padding: 12,
    borderRadius: 6,
    width: '45%',
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#777',
    padding: 12,
    borderRadius: 6,
    width: '45%',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  listItem: {
    backgroundColor: '#dcecf3',
    borderWidth: 1,
    borderColor: '#003755',
    borderRadius: 6,
    padding: 15,
    marginBottom: 8,
  },

  pressedItem: {
    opacity: 0.5,
  },

  fishText: {
    color: '#003755',
    fontSize: 17,
  },

  infoText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },

});

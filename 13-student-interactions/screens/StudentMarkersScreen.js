import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from "react-native-maps";

const CAMPUS_REGION = {
  latitude: 60.9763,
  longitude: 24.4783,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function StudentMarkersScreen() {
  const [markers, setMarkers] = useState([]);

  const addMarker = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const marker = {
      id: Date.now().toString(),
      title: `Study spot ${markers.length + 1}`,
      coordinate: { latitude, longitude },
    };
    setMarkers((current) => [...current, marker]);
  };

  const moveMarker = (id, coordinate) => {
    setMarkers((current) =>
      current.map((marker) => (marker.id === id ? { ...marker, coordinate } : marker))
    );
  };

  const removeMarker = (id) => {
    setMarkers((current) => current.filter((marker) => marker.id !== id));
  };

  const clearMarkers = () => {
    Alert.alert("Clear study spots?", "All added markers will be removed.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setMarkers([]) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Student Study Spots</Text>
          <Text style={styles.instructions}>Long-press the map to add a marker. Drag to move it.</Text>
          <Text style={styles.counter}>{markers.length} saved in component state</Text>
        </View>
        <Pressable style={styles.clearButton} onPress={clearMarkers}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      </View>

      <MapView style={styles.map} initialRegion={CAMPUS_REGION} onLongPress={addMarker}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description="Tap the callout after selecting the marker"
            draggable
            onDragEnd={(event) => moveMarker(marker.id, event.nativeEvent.coordinate)}
            onCalloutPress={() => removeMarker(marker.id)}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7f9" },
  header: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#17324d" },
  instructions: { color: "#425466", maxWidth: 270 },
  counter: { color: "#0f6b78", fontWeight: "600", marginTop: 4 },
  clearButton: { borderWidth: 1, borderColor: "#b03a2e", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 9 },
  clearText: { color: "#b03a2e", fontWeight: "700" },
  map: { flex: 1 },
});


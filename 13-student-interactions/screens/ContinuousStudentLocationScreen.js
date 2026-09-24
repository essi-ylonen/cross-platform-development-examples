import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const DEFAULT_REGION = {
  latitude: 60.9763,
  longitude: 24.4783,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function ContinuousStudentLocationScreen() {
  const watcherRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState([]);

  const stopTracking = () => {
    watcherRef.current?.remove();
    watcherRef.current = null;
    setIsTracking(false);
  };

  const startTracking = async () => {
    if (watcherRef.current) return;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow location access to start tracking.");
      return;
    }

    watcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 3,
      },
      (result) => {
        const coordinate = {
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        };
        setCurrentLocation(coordinate);
        setRoute((current) => [...current, coordinate]);
      }
    );

    setIsTracking(true);
  };

  const resetRoute = () => {
    setRoute([]);
    setCurrentLocation(null);
  };

  useEffect(() => {
    return () => watcherRef.current?.remove();
  }, []);

  const region = currentLocation
    ? { ...currentLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }
    : DEFAULT_REGION;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Route Tracker</Text>
        <Text style={styles.status}>{isTracking ? "Tracking is ON" : "Tracking is OFF"}</Text>
        <Text style={styles.counter}>{route.length} location updates</Text>
        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.start]} onPress={startTracking}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.stop]} onPress={stopTracking}>
            <Text style={styles.buttonText}>Stop</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.reset]} onPress={resetRoute}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <MapView style={styles.map} region={region}>
        {route.length > 1 && <Polyline coordinates={route} strokeColor="#0f6b78" strokeWidth={5} />}
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Student" description="Latest tracked location" />
        )}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7f9" },
  header: { padding: 16, gap: 7 },
  title: { fontSize: 22, fontWeight: "700", color: "#17324d" },
  status: { color: "#0f6b78", fontWeight: "700" },
  counter: { color: "#425466" },
  actions: { flexDirection: "row", gap: 9, marginTop: 4 },
  button: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 9 },
  start: { backgroundColor: "#17804a" },
  stop: { backgroundColor: "#b03a2e" },
  reset: { borderWidth: 1, borderColor: "#52606d" },
  buttonText: { color: "white", fontWeight: "700" },
  resetText: { color: "#52606d", fontWeight: "700" },
  map: { flex: 1 },
});


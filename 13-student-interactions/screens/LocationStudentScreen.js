import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";


const DEFAULT_REGION = {
  latitude: 60.9763,
  longitude: 24.4783,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function LocationStudentScreen() {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Press the button to locate the student.");

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setMessage("Requesting location permission...");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setMessage("Location permission was not granted.");
        Alert.alert("Permission needed", "Allow location access to use the map.");
        return;
      }

      setMessage("Reading the current location...");
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      const coordinate = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };

      setCurrentLocation(coordinate);
      setRegion({ ...coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      setMessage("Student location received.");
    } 
    
   // catch (error) {
   //   console.log(error);
    //  setMessage("Location could not be read. Check the device settings.");
    //} 
    
    catch (error) {
      console.log(error);

      const coordinate = {
      latitude: 60.9763,
      longitude: 24.4783,
      };

      setCurrentLocation(coordinate);

      setRegion({
        ...coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

    setMessage("Using simulated HAMK location.");
    }


    finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Campus Map</Text>
        <Text style={styles.message}>{message}</Text>
        {currentLocation && (
          <Text style={styles.coordinates}>
            {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}
          </Text>
        )}
        <Pressable style={styles.button} onPress={getCurrentLocation} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Locating..." : "Find student"}</Text>
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region}>
          {currentLocation && (
            <Marker coordinate={currentLocation} title="Student" description="Current location" />
          )}
        </MapView>
        {isLoading && <ActivityIndicator style={styles.loader} size="large" color="#0f6b78" />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7f9" },
  header: { padding: 16, gap: 8 },
  title: { fontSize: 24, fontWeight: "700", color: "#17324d" },
  message: { color: "#425466" },
  coordinates: { fontFamily: "monospace", color: "#0f6b78" },
  button: { alignSelf: "flex-start", backgroundColor: "#0f6b78", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "700" },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  loader: { position: "absolute", top: "45%", alignSelf: "center" },
});



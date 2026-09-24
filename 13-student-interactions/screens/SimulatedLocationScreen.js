import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ROUTE = [
  { latitude: 60.9763, longitude: 24.4783 },
  { latitude: 60.9766, longitude: 24.4787 },
  { latitude: 60.9769, longitude: 24.4791 },
  { latitude: 60.9772, longitude: 24.4795 },
  { latitude: 60.9775, longitude: 24.4799 },
];

export default function SimulatedLocationScreen() {
  const timerRef = useRef(null);

  const [routeIndex, setRouteIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(ROUTE[0]);
  const [isTracking, setIsTracking] = useState(false);
  const [visitedPoints, setVisitedPoints] = useState([ROUTE[0]]);
  const [markerName, setMarkerName] = useState("");

  const [markers, setMarkers] = useState([
    {
      id: 1,
      latitude: 60.9763,
      longitude: 24.4783,
      title: "HAMK Main Building",
    },
  ]);

  const addMarker = () => {
    const newMarker = {
      id: Date.now(),
      latitude: 60.9763 + Math.random() * 0.005,
      longitude: 24.4783 + Math.random() * 0.005,
      title: markerName || `Marker ${markers.length + 1}`,
    };

    setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    setMarkerName("");
  };

  const removeLatestMarker = () => {
  setMarkers((current) => current.slice(0, -1));
};


  const stopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTracking(false);
  };

  const startTracking = () => {
    if (timerRef.current) return;

    setIsTracking(true);

    timerRef.current = setInterval(() => {
      setRouteIndex((currentIndex) => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= ROUTE.length) {
          stopTracking();
          return currentIndex;
        }

        const nextLocation = ROUTE[nextIndex];
        setCurrentLocation(nextLocation);
        setVisitedPoints((currentPoints) => [
          ...currentPoints,
          nextLocation,
        ]);

        return nextIndex;
      });
    }, 2000);
  };

  const resetTracking = () => {
    stopTracking();
    setRouteIndex(0);
    setCurrentLocation(ROUTE[0]);
    setVisitedPoints([ROUTE[0]]);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Simulated Student Tracking</Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            isTracking ? styles.statusOn : styles.statusOff,
          ]}
        />
        <Text style={styles.statusText}>
          {isTracking ? "Tracking is ON" : "Tracking is OFF"}
        </Text>
      </View>

      <Text style={styles.subtitle}>Current Student Location</Text>

      <View style={styles.card}>
        <Text>Latitude: {currentLocation.latitude.toFixed(6)}</Text>
        <Text>Longitude: {currentLocation.longitude.toFixed(6)}</Text>
        <Text style={styles.stepText}>
          Route step: {routeIndex + 1} / {ROUTE.length}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${((routeIndex + 1) / ROUTE.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write marker name"
        value={markerName}
        onChangeText={setMarkerName}
      />

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={addMarker}>
          <Text style={styles.buttonText}>Add Marker</Text>
        </Pressable>
 
        <Pressable style={styles.secondaryButton} onPress={removeLatestMarker}>
          <Text style={styles.secondaryButtonText}>Remove Latest Marker</Text>
        </Pressable>


        <Pressable
          style={[styles.button, isTracking && styles.disabledButton]}
          onPress={startTracking}
          disabled={isTracking}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={stopTracking}>
          <Text style={styles.secondaryButtonText}>Stop</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={resetTracking}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        Visited route points ({visitedPoints.length})
      </Text>

      <View style={styles.routeRow}>
        {ROUTE.map((point, index) => (
          <View
            key={`${point.latitude}-${point.longitude}`}
            style={[
              styles.routePoint,
              index <= routeIndex && styles.visitedRoutePoint,
              index === routeIndex && styles.currentRoutePoint,
            ]}
          >
            <Text style={styles.routePointText}>{index + 1}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Movement Log</Text>

<View style={styles.logContainer}>
{visitedPoints.map((point, index) => (
 <View
  key={`${point.latitude}-${point.longitude}-${index}`}
    style={styles.logRow}    >
     <Text style={styles.logNumber}>#{index + 1}</Text>
      <View>
        <Text>Latitude: {point.latitude.toFixed(6)}</Text>
        <Text>Longitude: {point.longitude.toFixed(6)}</Text>
      </View>
    </View>
  ))}
</View>

      <Text style={styles.subtitle}>Marker Array ({markers.length})</Text>

      <ScrollView contentContainerStyle={styles.listContent}>
        {markers.map((marker) => (
          <View key={marker.id} style={styles.markerCard}>
            <Text style={styles.markerTitle}>{marker.title}</Text>
            <Text>Lat: {marker.latitude.toFixed(6)}</Text>
            <Text>Lng: {marker.longitude.toFixed(6)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f7f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#17324d",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusOn: { backgroundColor: "#2e7d32" },
  statusOff: { backgroundColor: "#9e9e9e" },
  statusText: { color: "#425466", fontWeight: "600" },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#17324d",
    marginTop: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
  },
  stepText: {
    marginTop: 8,
    fontWeight: "700",
    color: "#0f6b78",
  },
  progressTrack: {
    height: 10,
    marginTop: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#d9e2e8",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0f6b78",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0f6b78",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: "white", fontWeight: "700" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#0f6b78",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryButtonText: { color: "#0f6b78", fontWeight: "700" },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  routePoint: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d9e2e8",
  },
  visitedRoutePoint: { backgroundColor: "#75b7c0" },
  currentRoutePoint: {
    backgroundColor: "#0f6b78",
    borderWidth: 3,
    borderColor: "#9edce3",
  },
  routePointText: { color: "white", fontWeight: "700" },
  listContent: { paddingBottom: 28 },
  markerCard: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  markerTitle: { fontWeight: "700", marginBottom: 5 },
  logContainer: {
  backgroundColor: "white",
  borderRadius: 10,
  padding: 12,
},
input: {
  backgroundColor: "white",
  borderWidth: 1,
  borderColor: "#d9e2e8",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginTop: 12,
},
logContainer: {
  backgroundColor: "white",
  borderRadius: 10,
  padding: 12,
},

logRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderBottomColor: "#e5edf0",
},

logNumber: {
  fontWeight: "700",
  color: "#0f6b78",
  width: 36,
},


});

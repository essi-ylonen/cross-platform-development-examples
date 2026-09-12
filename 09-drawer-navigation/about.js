import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Directory</Text>
      <Text style={styles.text}>
        A Cross-Platform Development example that combines Expo Router Drawer
        navigation with a local Node.js REST API.
      </Text>
      <Text style={styles.tip}>
        Open the drawer from the hamburger icon or swipe from the left edge.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#ffffff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#17324d",
    marginBottom: 12,
  },
  text: { fontSize: 16, lineHeight: 24, color: "#344054" },
  tip: { marginTop: 24, color: "#006a8e", fontWeight: "600" },
});

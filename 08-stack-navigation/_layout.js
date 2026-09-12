import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#006a8e" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Students" }} />
      <Stack.Screen
        name="student/[id]"
        options={{ title: "Student details" }}
      />
    </Stack>
  );
}

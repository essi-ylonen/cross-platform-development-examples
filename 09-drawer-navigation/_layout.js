import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#006a8e" },
        headerTintColor: "#ffffff",
        drawerActiveTintColor: "#006a8e",
        drawerActiveBackgroundColor: "#eaf4f7",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Students",
          title: "Student Directory",
        }}
      />
      <Drawer.Screen
        name="add"
        options={{
          drawerLabel: "Add student",
          title: "Add a student",
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "About",
          title: "About this app",
        }}
      />
    </Drawer>
  );
}

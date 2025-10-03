import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="betSuccess" options={{ title: "投注成功",headerShown: false,gestureEnabled:true }} />
    </Stack>
  );
}

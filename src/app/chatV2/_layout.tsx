import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" options={{ title: "聊天" }} />
    </Stack>
  );
}

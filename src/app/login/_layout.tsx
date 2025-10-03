import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="index" options={{ title: "登录",headerShown: false,gestureEnabled:true }} />
      <Stack.Screen name="resetPassword" options={{ title: "重置密码",headerShown: false,gestureEnabled:true }} />
    </Stack>
  );
}

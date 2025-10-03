import { Stack } from "expo-router";

export default function WalletLayout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name="transactionList" options={{ title: "交易明细" ,navigationBarHidden:true }} />
      <Stack.Screen name="recharge" options={{ title: "充值" ,navigationBarHidden:true }} />
      <Stack.Screen name="transfer" options={{ title: "转账" ,navigationBarHidden:true }} />
      <Stack.Screen name="withdraw" options={{ title: "提现" ,navigationBarHidden:true }} />
    </Stack>
  );
}

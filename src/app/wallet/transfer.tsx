import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getUserWallet, transfer } from "src/api/interface/wallets";

import AppHeader from "@/p138-react-common/components/AppHeader";
import { useUserStore } from "src/store/user";
import { router } from "expo-router";
import { Button } from "tamagui";
import { themeRedColor } from "p138-react-common/utils/styles/color";
import { formatCurrency } from "@/p138-react-common/utils";
   

const Transfer: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { loginInfo } = useUserStore();
  const [walletInfo, setWalletInfo] = useState<ServerCommonWallet.UserWallet>();
  const [inputAmount, setInputAmount] = useState<string>();
  const [transferWalletInfo, setTransferwalletInfo] =
    useState<ServerCommonWallet.UserWallet>();

  const onTextInputChange = (e: string) => {
    if (e.length === 11) {
      getUserWalletInfo(e);
    }
    setInputAmount(e);
  };
  const handleTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      globalThis.Toast.show("转账金额必须大于0");
      return;
    }
    if (transferWalletInfo?.username === inputAmount) {
      transfer(
        {
          amount,
          currency: "CNY",
          paymentPassword: password,
          senderUsername: loginInfo?.username ?? "",
          senderUserID: loginInfo?.userID ?? "",
          receiverUsername: inputAmount ?? "",
          receiverUserID: loginInfo?.userID ?? "",
          userID: loginInfo?.userID ?? "",
        }
        // {
        //   senderWalletID: walletInfo?.id ?? '',
        //   receiverWalletID: transferWalletInfo?.id ?? '',
        // },
      ).then((res) => {
        if (res.success) {
          globalThis.Toast.show("转账成功");
          getUserWallet({
            userID: loginInfo?.userID!,
            username: null,
          }).then((e) => {
            setWalletInfo(e.data);
          });
        } else {
          globalThis.Toast.show("转账失败，请稍后再试");
        }
      });
    } else {
      globalThis.Toast.show("请输入正确的用户信息");
    }
  };
  const getUserWalletInfo = (username: string) => {
    getUserWallet({
      userID: null,
      username,
    }).then((i) => {
      if (!i.data) {
        globalThis.Toast.show("请核对收款账户");
      } else {
        setTransferwalletInfo(i.data);
      }
    });
  };
  useEffect(() => {
    getUserWallet({
      userID: loginInfo?.userID!,
      username: null,
    }).then((i) => {
      setWalletInfo(i.data);
    });
  }, [loginInfo]);
  return (
    <View style={styles.container}>
      <AppHeader title="转账" />
      <View style={[{ padding: 15, gap: 10 }]}>
        {/* Header */}

        {/* 余额显示 */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceAmount}>{formatCurrency(walletInfo?.balance)}</Text>
          <Text style={styles.balanceText}>账户余额(元)</Text>
        </View>

        {/* 收款账户 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>收款账户</Text>
          <TextInput
            placeholder="请输入收款账户"
            style={styles.input}
            placeholderTextColor={"#ccc"}
            maxLength={11}
            value={inputAmount}
            onChangeText={onTextInputChange}
            onBlur={() => getUserWalletInfo(inputAmount ?? "")}
          />
        </View>

        {/* 转账金额 */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>转账金额</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.amountSymbol}>¥</Text>
            <TextInput
              placeholder={`可转账金额${formatCurrency(walletInfo?.balance)}`}
              style={styles.amountInput}
              placeholderTextColor={"#ccc"}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity
              onPress={() => setAmount(walletInfo?.balance.toString() ?? "0")}
            >
              <Text style={styles.allButton}>全部</Text>
            </TouchableOpacity>
          </View>
          {/* 提示文字 */}
          <Text style={styles.hintText}>
            金额将实时转入对方账户，无法退款，对方收到的转账金额不可用于提现。
          </Text>

          {/* 支付密码 */}
          <View className="mt-4">
            <Text style={styles.inputLabel}>支付密码</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="点击输入密码"
                style={styles.passwordInput}
                placeholderTextColor={"#ccc"}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <Text style={styles.togglePassword}>
                  {isPasswordVisible ? "隐藏" : "显示"}
                </Text>
              </TouchableOpacity>
            </View>
            {/* 手机号信息 */}
            <View className="flex-row justify-between items-center p-2">
              <View className="flex-1" />
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/personal-center/updatePassWord",
                    params: { type: "pay" },
                  })
                }
              >
                <Text className="font-[#f53b57]"> 设置支付密码</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 确认转账按钮 */}
        {/* <TouchableOpacity style={styles.confirmButton} onPress={handleTransfer}>
          <Text style={styles.confirmButtonText}>确认转账</Text>
        </TouchableOpacity> */}
        <Button
          color='white'
          style={{backgroundColor:themeRedColor}}
          onPress={handleTransfer}
        >
          确认转账
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    backgroundColor: "#E74C3C",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  balanceContainer: {
    backgroundColor: "#FFF",
    // padding: 15,
    paddingVertical: 15,
    // margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  balanceText: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 5,
  },
  inputGroup: {
    // marginTop: 15,
    backgroundColor: "#FFF",
    padding: 10,
    // marginHorizontal: 10,
    borderRadius: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 0,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  amountSymbol: {
    fontSize: 18,
    color: "#333",
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  allButton: {
    color: "#E74C3C",
    fontSize: 14,
    marginLeft: 10,
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 15,
    marginTop: 10,
    lineHeight: 20,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  togglePassword: {
    fontSize: 14,
    color: "#E74C3C",
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#E74C3C",
    margin: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Transfer;

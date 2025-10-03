import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface Props {
  onSendMessage: (text: string) => Promise<any> | void;
  onSendImage?: (uri: string, width?: number, height?: number) => Promise<any> | void;
  placeholder?: string;
  maxLength?: number;
}

const ChatInput: React.FC<Props> = ({ onSendMessage, onSendImage, placeholder = "输入消息...", maxLength = 1000 }) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    await onSendMessage(t);
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <Button title="发送" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", padding: 8, gap: 8, backgroundColor: "#fff" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, height: 40 },
});

export default ChatInput;

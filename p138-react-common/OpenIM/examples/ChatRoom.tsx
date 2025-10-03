import React, { useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { imService } from "../imService";
import { useMessageStore } from "../store";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

interface ChatRoomProps {
  conversationId: string;
  placeholder?: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ conversationId, placeholder = "输入消息..." }) => {
  const messages = useMessageStore((s) => s.messages[conversationId] || []);

  useEffect(() => {
    // 进入时可尝试拉取历史
    imService.loadHistory(conversationId, 20).catch(() => {});
  }, [conversationId]);

  const handleSendMessage = useCallback(async (text: string) => {
    await imService.sendTextMessage(conversationId, text);
  }, [conversationId]);

  const handleLoadMore = useCallback(async () => {
    const first = messages[0];
    const cursor = (first as any)?.clientMsgID || null;
    await imService.loadHistory(conversationId, 20, cursor);
  }, [messages, conversationId]);

  return (
    <View style={styles.container}>
      <MessageList messages={messages} onLoadMore={handleLoadMore} />
      <ChatInput onSendMessage={handleSendMessage} placeholder={placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
});

export default ChatRoom;

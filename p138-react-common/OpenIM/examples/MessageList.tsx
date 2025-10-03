import React from "react";
import { FlatList, View, Text, Image } from "react-native";
import type { LocalMessage } from "../store";

interface Props {
  messages: LocalMessage[];
  onLoadMore?: () => Promise<any> | void;
}

const MessageList: React.FC<Props> = ({ messages, onLoadMore }) => {
  const renderItem = ({ item }: { item: LocalMessage }) => {
    // 文本
    if ((item as any).contentType === 101 || (item as any).textElem) {
      const txt = (item as any).textElem?.content || (item as any).content || "";
      return <Text style={{ padding: 8 }}>{txt} {(item as any).status === "pending" ? "⏳" : (item as any).status === "failed" ? "❌" : ""}</Text>;
    }
    // 图片
    if ((item as any).contentType === 102 || (item as any).pictureElem) {
      const url = (item as any).pictureElem?.sourcePicture?.url || (item as any).localImagePath;
      return (
        <View style={{ padding: 8 }}>
          <Image source={{ uri: url }} style={{ width: 140, height: 140, backgroundColor: "#eee" }} />
          <Text>{(item as any).status === "pending" ? "上传中..." : (item as any).status === "failed" ? "发送失败" : ""}</Text>
        </View>
      );
    }
    return <Text style={{ padding: 8 }}>[不支持的消息类型]</Text>;
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(m) => (m as any).clientMsgID || Math.random().toString(36)}
      renderItem={renderItem}
      onEndReachedThreshold={0.4}
      onEndReached={() => onLoadMore?.()}
    />
  );
};

export default MessageList;

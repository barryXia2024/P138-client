import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import ChatInput from "./chatInput";
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import { DEFAULT_IMAGE } from '@/p138-react-common/config';
import { useLiveStore } from 'src/store';
import { giveLiveStreamGift } from 'src/api/interface/competition-gift';
import { useLocalSearchParams } from 'expo-router';


interface Message {
  id: string;
  user: string;
  text?: string;
  imageUri?: string;
  time: string;
  isRead: boolean;
  isSelf: boolean;
}

const initialMessages: Message[] = [
  {
    id: "1",
    user: "匿名用户·尾号111114",
    text: "32131321",
    time: "2:22",
    isRead: true,
    isSelf: false,
  },
  {
    id: "2",
    user: "我",
    text: "32131",
    time: "2:23",
    isRead: true,
    isSelf: true,
  },
  // 更多消息...
];

interface ChatProps {
  liveStream?: ServerCommonLive.LiveStream;
  sendGift?: (giftId: string, count: number) => void;
}

const Chat: React.FC<ChatProps> = ({ liveStream, sendGift, }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { liveStreamID } = useLocalSearchParams();
  const [giftAnimations, setGiftAnimations] = useState<{ gift: CommonLiveLiveStreamGift.LiveStreamGift, count: number }[]>([]);
  const { currentMatch } = useLiveStore();
  const flatListRef = useRef<FlatList>(null);



  const handleSendGift = (gift: CommonLiveLiveStreamGift.LiveStreamGift, count: number) => {

    // 添加动画浮层
    const animationId = Date.now().toString();
    setGiftAnimations(prev => [...prev, { id: animationId, gift, count }]);
    // 自动移除浮层
    setTimeout(() => {
      setGiftAnimations(prev => prev.filter(g => g.gift.id !== gift.id));
    }, 3000); // 显示 3 秒
    giveLiveStreamGift({
      liveStreamGiftID: gift.id,
      competitionId: currentMatch?.competitionId ?? 0,
      homeId: currentMatch?.homeId ?? 0,
      awayId: currentMatch?.awayId ?? 0,
      leagueId: currentMatch?.leagueId ?? 0,
      toUserID: liveStream?.uid ?? '0',
      toUsername: liveStream?.uid ?? '0',
      number: count,
      liveStreamID: liveStreamID as string
    }).then((res) => {
      console.log('发送礼物结果：', res);
      sendGift && sendGift(gift.id, count);
    });

  }

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      user: '我',
      text,
      time: new Date().toLocaleTimeString(),
      isRead: true,
      isSelf: true,
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendImage = (uri: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      user: '我',
      imageUri: uri,
      time: new Date().toLocaleTimeString(),
      isRead: true,
      isSelf: true,
    };
    setMessages([...messages, newMessage]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={{
        flexDirection: item.isSelf ? "row-reverse" : "row",
        alignItems: "center",
        marginVertical: 5,
      }}
    >
      <OSSImage
        source={{ uri: item.imageUri || DEFAULT_IMAGE }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View
        style={{
          maxWidth: "70%",
          padding: 10,
          backgroundColor: item.isSelf ? "#4A90E2" : "#F0F0F0",
          borderRadius: 10,
          marginHorizontal: 10,
        }}
      >
        {item.text && <Text style={{ color: item.isSelf ? "#FFF" : "#000" }}>{item.text}</Text>}
        {item.imageUri && <Image source={{ uri: item.imageUri }} style={{ width: 100, height: 100, borderRadius: 10 }} />}
      </View>
      <Text style={{ color: item.isRead ? "green" : "gray", fontSize: 12 }}>
        {item.isRead ? "已读" : "未读"}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      style={{ flex: 1, backgroundColor: "#F5F5F5" }}>

      <View className='flex-1'>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id + item.time}
          renderItem={renderMessage}
          style={{ flex: 1 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}

          ref={flatListRef}

        />
        <ChatInput onSend={handleSend} onSendImage={handleSendImage} onSendGift={handleSendGift} />
      </View>

      {giftAnimations.map((gift) => (
        <View
          key={gift.gift.id}
          style={Styles.giftFloating}
        >
          {/* 左侧礼物信息 */}
          <View className='flex-row items-center'>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>🎁 送出礼物：</Text>
            <Text style={{ color: '#000', fontWeight: 'bold', marginLeft: 80 }}>{gift.count} 个</Text>
          </View>

          {/* 右侧礼物图标，大图超出背景 */}
          <View
            style={Styles.giftImgContainer}
          >
            <OSSImage
              source={{ uri: gift.gift.icon }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        </View>
      ))}

    </KeyboardAvoidingView>
  );
};

export default Chat;

const Styles = StyleSheet.create({
  giftFloating: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    overflow: 'visible', // ✅ 允许溢出
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftImgContainer: {
    position: 'absolute',
    right: 60, // ✅ 往右溢出
    top: -20,   // ✅ 往上溢出
    width: 80,
    height: 80,
    zIndex: 10,
  }
})

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,

  Image,

} from "react-native";
import * as ImagePicker from "expo-image-picker";
// import EmojiPicker from "./EmojiPicker";


import GiftPanel from "./giftPanel";
import { listLiveStreamGift } from "src/api/interface/competition-gift";

interface ChatInputProps {
  onSend: (message: string) => void;
  onSendImage: (uri: string) => void;
  onSendGift: (gift: CommonLiveLiveStreamGift.LiveStreamGift, count: number) => void;
}


const ChatInput: React.FC<ChatInputProps> = ({ onSend, onSendImage, onSendGift }) => {
  const [text, setText] = useState("");
  const [expanded, setExpanded] = useState<"none" | "emoji" | "options">(
    "none"
  );
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [giftList, setGiftList] = useState<CommonLiveLiveStreamGift.ListLiveStreamGiftResult>();

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       setKeyboardVisible(true);
  //       setExpanded("none");
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => {
  //       setKeyboardVisible(false);
  //     }
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setText((prev) => prev + emoji.native);
    setExpanded("none");
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onSendImage(result.assets[0].uri);
      setExpanded("none");
    }
  };

  const toggleEmoji = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      setExpanded(expanded === "emoji" ? "none" : "emoji");
    }, 100);
  };

  const toggleOptions = () => {
    Keyboard.dismiss();
    setExpanded(expanded === "options" ? "none" : "options");
  };

  return (
    <View
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="w-full border-t border-gray-200"
    >
      <View className="flex-row items-center p-2 bg-white ">
        <TextInput
          className="flex-1 px-4 py-2 text-base border border-gray-200 rounded-full mr-2"
          placeholder="输入消息..."
          value={text}
          onChangeText={setText}
        />
        {text.trim() === "" ? (
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => {
                listLiveStreamGift({
                  current: 1,
                  pageSize: 100,
                }).then((res) => {
                  setGiftList(res?.data);
                  setGiftModalVisible(true);
                });
              }}
              className="p-2 mr-2"
            >
              <Image source={require("src/assets/imgs/chat/gift_gif.webp")} className="w-[20px] h-[20px]" style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleOptions}
              className="p-2"
            >
              <Text className="text-xl">➕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSend}
            className="bg-blue-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white">发送</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* {!keyboardVisible && expanded === "emoji" && (
        <View className="h-[280px]">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </View>
      )} */}

      {!keyboardVisible && expanded === "options" && (
        <View className="h-[280px] bg-gray-100 p-4 flex-row">
          <TouchableOpacity
            onPress={handleImagePick}
            className="items-center mr-8"
          >
            <Image
              source={require("src/assets/imgs/chat/icon_image.png")}
              className="w-[60px] h-[60px]"
            />
            <Text className="mt-2">相册</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              /* 分享功能 */
            }}
            className="items-center"
          >
            <Image
              source={require("src/assets/imgs/chat/icon_share.png")}
              className="w-[60px] h-[60px]"
            />
            <Text className="mt-2">分享订单</Text>
          </TouchableOpacity>
        </View>
      )}

      <GiftPanel
        visible={giftModalVisible}
        onClose={() => setGiftModalVisible(false)}
        giftList={giftList?.list ?? []}
        onSend={(gift, count) => {


          setGiftModalVisible(false);
          onSendGift(gift, count);
        }}
      />
    </View>
  );
};

export default ChatInput;

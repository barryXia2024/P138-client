import Html from '@/p138-react-common/components/html';
import {formatDateTime} from '@/p138-react-common/utils';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  markAsReadApi,
  markAsReadByMessageId,
} from 'src/api/interface/my-message';
import {useUserStore} from 'src/store';

const MessageItem = (props: {
  messageInfo: ServerCoreMessage.MyMessageRow;
  onRefresh: () => void;
}) => {
  const {messageInfo, onRefresh} = props;
  const [htmlHeight, setHtmlHeight] = useState(200);
  const {loginInfo} = useUserStore();
  console.log('messageInfo', htmlHeight);

  const handleHeightChange = (height: number) => {
    // 确保高度不会小于最小值
    const minHeight = 50;
    const finalHeight = Math.max(height, minHeight);
    setHtmlHeight(finalHeight);
  };
  const handleRead = () => {
    markAsReadByMessageId(
      {messageID: messageInfo.messageID},
      {userID: loginInfo.userID},
    ).then(res => {
      console.log(res);
      onRefresh();
    });
  };

  // 监听内容变化，强制重新计算高度
  useEffect(() => {
    // 当内容变化时，重置高度让组件重新计算
    setHtmlHeight(100);
  }, [messageInfo.content]);

  const htmlStyles = `<style>
  body {
    margin: 0;
    padding: 10px;
    box-sizing: border-box;
    line-height: 1.5;
    font-size: 16px;
    color: #333;
  }
  p {
    margin: 0 0 8px 0;
  }
  img {
    width: 100%;
    height: auto;
    margin-top: 10px;
    cursor: pointer;
  }
  .content {
    word-break: break-word;
  }
</style>`;

  return (
    <View
      style={[styles.container, messageInfo.status === 1 && {opacity: 0.5}]}>
      <TouchableOpacity
        onPress={handleRead}
        disabled={messageInfo.status === 1}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1000,
          left: 0,
          bottom: 0,
        }}
      />

      <View className="flex-row justify-between">
        <View className="flex-row">
          <Image
            resizeMode="contain"
            source={require('src/assets/imgs/mine/icon_message_order.png')}
            style={IMAGE_SIZE.IMAGE_SIZE20}
          />
          <Text>{messageInfo.msgTypeName}</Text>
          <Text className="text-gray-500"> {messageInfo.msgSubTypeName}</Text>
          {messageInfo.status === 0 && (
            <View
              style={{
                width: 4,
                height: 4,
                backgroundColor: 'red',
                borderRadius: '50%',
              }}
            />
          )}
        </View>
        <Text className="text-gray-500">
          {messageInfo.createdAt ? formatDateTime(messageInfo.createdAt) : ''}
        </Text>
      </View>
      <View
        style={[
          {
            borderTopWidth: 1,
            borderColor: '#E5E5E5',
            borderBottomWidth: 1,
            marginVertical: 10,
          },
          Platform.OS !== 'web' && {
            height: htmlHeight + 50,
          },
        ]}>
        <Html
          html={{
            adTitle: '',
            adContent: messageInfo.content,
            imageUrl: '',
          }}
          onHeightChange={handleHeightChange}
          htmlStyles={htmlStyles}
        />
      </View>
      {messageInfo.remark && (
        <View className="flex-row">
          <Text className="text-red-500">*</Text>
          <Text>{messageInfo.remark}</Text>
        </View>
      )}
    </View>
  );
};

export default MessageItem;
export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 10,
    margin: 10,
    marginBottom: 0,
    padding: 10,
    height: '100%',
  },
  htmlContainer: {
    flex: 1,
    minHeight: 50,
  },
});

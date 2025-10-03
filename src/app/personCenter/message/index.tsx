import {TabSwitcher} from '@/p138-react-common/components';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {FlatList, FlatListRef} from '@/p138-react-common/components/FlatList';

import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import MessageItem from './components/MessageItem';
import {
  getGroupByTypeNotReadCount,
  getMyMessageApi,
  markAsReadApi,
} from 'src/api/interface/my-message';
import {useUserStore} from 'src/store';

const MyMessage = () => {
  const [activeTab, setActiveTab] = useState<ServerCommonRepo.MsgType>(1);
  const {loginInfo} = useUserStore();
  const [notReadCount, setNotReadCount] = useState<number[]>([0, 0, 0, 0]);

  const flatListRef =
    useRef<FlatListRef<ServerCommonMessage.MyMessageRow>>(null);
  const getNotReadCount = async () => {
    getGroupByTypeNotReadCount({
      userID: loginInfo.userID,
    }).then(res => {
      setNotReadCount([
        res.data?.messageTypeOrder ?? 0,
        res.data?.messageTypeLuckyBag ?? 0,
        res.data?.messageTypeRedEnvelope ?? 0,
        res.data?.messageTypeAnnouncement ?? 0,
      ]);
    });
  };
  useEffect(() => {
    getNotReadCount();
  }, [activeTab]);

 
  const markAsRead = async () => {
    markAsReadApi({
      userID: loginInfo.userID,

      msgType: activeTab,
    }).then(res => {
      if (res.success) {
        setNotReadCount([0, 0, 0, 0]);
        flatListRef.current?.refresh();
      }
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="我的消息"
        rightComponent={
          <TouchableOpacity onPress={markAsRead}>
            <Image
              source={require('src/assets/imgs/mine/message_onekey.png')}
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        }
      />
      <TabSwitcher
        tabs={[
          {label: '订单', key: 1},
          {label: '福袋', key: 2},
          {label: '红包', key: 3},
          {label: '公告', key: 4},
        ]}
        numbers={notReadCount}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      <FlatList
        // data={mockData.list || []}
        style={{flex: 1}}
        ref={flatListRef}
        requestParams={{
          userID: loginInfo.userID,
          msgType: activeTab,
        }}
        requestFunction={getMyMessageApi}
        renderItem={({item: messageInfo}) => (
          <MessageItem
            messageInfo={messageInfo}
            onRefresh={() => {
              flatListRef.current?.refresh();
            }}
          />
        )}
      />
    </View>
  );
};

export default MyMessage;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    // marginBottom:100,
    // height:500,
  },
});

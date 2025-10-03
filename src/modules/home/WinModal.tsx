import React, {useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, Platform} from 'react-native';

import {CustomModal} from '@/p138-react-common/components';

import {useUserStore} from 'src/store';
import Html from '@/p138-react-common/components/html';
import {markAsReadByMessageId} from 'src/api/interface/my-message';
import {enableDebugLog} from '@/p138-react-common/mqtt/debug';
import MqttClientManager from '@/p138-react-common/mqtt/MqttClientManager';
import {MqttPayload} from '@/p138-react-common/mqtt/types';
import {loginOut} from 'src/api/request';
import NoticeShort from 'src/assets/imgs/home/notice-short.webp';
import {useMqttStore} from 'src/store/mqtt';

function WinModal() {
  const {loginInfo} = useUserStore();
  const [htmlHeight, setHtmlHeight] = useState(200);

  const [isVisible, setIsVisible] = useState<{
    isVisible: boolean;
    userWinningBroadcast?: ServerCoreOrder.WinNotice;
  }>({
    isVisible: false,
  });
  useEffect(() => {
    // startMqttTask();
  }, []);

  const startMqttTask = () => {
    if (loginInfo?.username) {
      enableDebugLog();
      MqttClientManager.connect(loginInfo?.username).then(() => {
        setTimeout(() => {
          MqttClientManager.getCfg().then(cfg => {
            console.log('获取配置', cfg);

            MqttClientManager.register(cfg.topic, (topic, payload) => {
              console.log('订阅成功.....', cfg);
              console.log('mqtt', topic, payload);

              try {
                const parsePayload: MqttPayload = payload;
                useMqttStore.getState().addMessage(topic, parsePayload);
                if (
                  parsePayload.msgType === 1 &&
                  [1, 3, 9].includes(parsePayload.msgSubType)
                ) {
                  return;
                }

        
  

                // 如果还要弹窗显示（UI逻辑），保留这部分
                setIsVisible({
                  isVisible: true,
                  userWinningBroadcast:
                    parsePayload as unknown as ServerCoreOrder.WinNotice,
                });
              } catch (e) {
                console.error('MQTT 消息解析失败:', e, payload);
              }
            });
          });
        }, 5000);
      });
    } else {
      loginOut(loginInfo);
    }
  };

  // const handleOrderPress = () => {
  //   router.push({
  //     pathname: '/order/bet/detail',
  //     params: {
  //       orderId: userWinningBroadcast?.[0]?.orderID,
  //     },
  //   });

  //   setUserWinningBroadcast([]);
  // };
  console.log('isVisible', isVisible);
  const updateUserWinningBroadcast = () => {
    // customerConfirmWinningMessage(
    //   {
    //     orderIDList: orderIDS,
    //   },
    //   {
    //     userID: loginInfo.userID,
    //   },
    // );

    markAsReadByMessageId(
      {
        messageID: isVisible.userWinningBroadcast?.messageID,
      },
      {
        userID: loginInfo.userID,
      },
    ).then(res => {
      console.log('res', res);
    });
  };

  return (
    <CustomModal
      position="center"
      disabled
      isVisible={isVisible.isVisible}
      onClose={() => {
        setIsVisible({
          isVisible: false,
          userWinningBroadcast: undefined,
        });
        updateUserWinningBroadcast();
      }}>
      <View style={[styles.container, styles.image]}>
        <Image
          style={[
            styles.image,
            Platform.OS === 'web' && {
              height: htmlHeight + 150,
            },
          ]}
          resizeMode="stretch"
          source={NoticeShort}
        />

        <View style={[styles.contentContainer]}>
          <Text
            style={{
              color: 'red',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            消息公告
          </Text>
          <Html
            html={{
              adContent: isVisible.userWinningBroadcast?.content || '',
              adTitle: isVisible.userWinningBroadcast?.msgSubTypeName || '',
            }}
            onHeightChange={height => {
              console.log('height', height);
              setHtmlHeight(height);
            }}
          />
        </View>
        {/* <View style={styles.contentContainer}>
          <Text
            style={[
              commonStyles.fontSize24,
              {color: 'red', fontWeight: 'bold', textAlign: 'center'},
            ]}>
            恭喜您！！！
          </Text>
          <ScrollView style={{paddingBottom: 50}}>
            {userWinningBroadcast.map(item => (
              <View>
                <Text style={[commonStyles.fontSize14]}>
                  订单
                  <TouchableOpacity onPress={handleOrderPress}>
                    <Text className="text-red-500">{item?.orderNo}</Text>
                  </TouchableOpacity>
                  已中奖! 中奖金额{' '}
                  <Text className="text-red-500">{item?.winAmount} </Text>元
                </Text>
              </View>
            ))}
          </ScrollView>
        </View> */}
      </View>
    </CustomModal>
  );
}

export default WinModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'relative',
    // backgroundColor: 'blue',
  },
  image: {
    width: 300,
    height: 350,
  },
  contentContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    gap: 10,
  },
});

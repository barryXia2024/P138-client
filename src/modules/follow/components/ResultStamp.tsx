import React from 'react';
import {View, ImageBackground, Text, Image} from 'react-native';

/**
 * 通用跟单结果标记组件
 * @param item CommonFollowHall.PostsOrderItem
 */
const ResultStamp = ({
  item,
  size = 100,
}: {
  item: ServerCoreOrder.ListOrderRow;
  size?: number;
}) => {
  if ([11, 10, 12].includes(item.orderStatus)) {
    return null;
  }
  if (item.orderStatus == 11) {
    return (
      <View className="absolute right-0 bottom-0 flex-row items-center gap-2">
        <Image
          source={require('src/assets/imgs/follow/no-win.png')}
          style={{width: size, height: size}}
          resizeMode="contain"
        />
      </View>
    );
  }
  if (item.orderStatus == 10 || item.orderStatus == 12) {
    return (
      <View className="absolute right-0 bottom-0 flex-row items-center gap-2">
        <ImageBackground
          source={require('src/assets/imgs/follow/win.png')}
          style={{
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode="contain">
          <Text
            className="text-red-500"
            style={{transform: [{rotate: '-15deg'}], fontSize: size / 6}}>
            ¥{Number(item.calcAmount).toFixed(2)}元
          </Text>
        </ImageBackground>
      </View>
    );
  }

  return null;
};

export default ResultStamp;

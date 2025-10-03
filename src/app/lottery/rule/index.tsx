import React, {useState} from 'react';
import {StyleSheet, ScrollView, Dimensions, Text, View, Platform} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {ballPlayRullerImages, imageLabelMap, imageMap} from './constants';
import {kScreenHeight, kScreenWidth} from '@/p138-react-common/utils/styles';

const GameRuleScreen: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const imageKeys =
    ballPlayRullerImages[lotteryInfo?.lotteryName ?? 'FootballLottery'];
  console.log(lotteryInfo);
  const [activeTab, setActiveTab] = useState<number>(0);
  if (!imageKeys) {
    return (
      <ScrollView className="flex-1 bg-white">
        <AppHeader title="玩法说明" />
        <Text className="text-center text-red-500 text-lg">
          未找到对应的玩法说明图片
        </Text>
      </ScrollView>
    );
  }
  const tabs = imageKeys.map((k, index) => {
    return {
      label: imageLabelMap[k] as string,
      key: index,
    };
  });
  console.log(tabs);
  return (
    <View className="flex-1 bg-white">
      <AppHeader title="玩法说明" />
      <ScrollView>
        {imageKeys.length > 1 && (
          <TabSwitcher<number>
            tabs={tabs}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
        )}
        <OSSImage
          style={Platform.OS === 'web' ? styles.H5image : styles.Appimage}
          source={imageMap[imageKeys[activeTab]]}
          resizeMode="stretch"
          
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  H5image: {
    width: '100%',
    aspectRatio:1/2,
  },
  Appimage: {
    width: '100%',
    height: kScreenHeight,
  },
});

export default GameRuleScreen;

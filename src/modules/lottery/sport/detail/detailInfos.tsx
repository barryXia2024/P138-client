import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Platform, Image} from 'react-native';

import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {kScreenWidth} from '@/p138-react-common/utils/styles';
import {useLiveStore} from 'src/store';

import SwiperFlatList from 'react-native-swiper-flatlist';
import Carousel from 'react-native-reanimated-carousel';
import {
  CompetitionStatistics,
  BasketballCompetitionStatistics,
} from './statistics';
import OddsInfo from './oddsInfo';
import Information from './information';
import BattleInfo from './battleInfo';
import {getFootBallCompetitionOdds} from 'src/api/interface/competition-football';
import Chat from 'src/app/chatV2/components/Chat';
import FollowOrderScreen, { FollowOrderList } from 'src/app/follow';
const statTabs = [
  {label: '赛况', key: 0},
  {label: '聊天', key: 1},
  {label: '指数', key: 2},
  {label: '情报', key: 3},
  {label: '方案', key: 4},
  {label: '数据', key: 5},
];

const DetailInfos: React.FC<CompetitionProps.DetailInfos> = ({
  style,
  className,
  liveStream,
  liveInfo,
  competitionType,
}) => {
  const [tab, setTab] = useState(1);
  const {currentMatch} = useLiveStore();
  const [oddsList, setOddsList] =
    useState<ServerCommonLive.GetFootBallCompetitionOddsResult>();

  const SwiperFlatListRef = useRef<SwiperFlatList>(null);
  const carouselRef = useRef<Carousel<any>>(null);
  const handleTabPress = (idx: number) => {
    setTab(idx);
    if (Platform.OS === 'web') {
      carouselRef.current?.scrollTo({index: idx, animated: true});
    } else {
      SwiperFlatListRef.current?.scrollToIndex({
        index: idx,
      });
    }
    // carouselRef.current?.scrollTo({ index: idx, animated: true });
  };

  useEffect(() => {
    getFootBallCompetitionOdds({
      competitionID: currentMatch?.competitionId ?? 0,
      competitionType: currentMatch?.competitionType ?? 'JC',
      lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
    }).then(res => {
      setOddsList(res.data);
    });
  }, []);

  return (
    <View style={[{flex: 1}, style]} className={className}>
      <TabSwitcher
        tabs={statTabs}
        activeTab={tab}
        onTabPress={handleTabPress}
      />
      <SwiperFlatList
          ref={SwiperFlatListRef}
          style={{height: '100%'}}
          contentContainerStyle={{height: '100%'}}
          className="SwiperFlatList"
          data={statTabs}
          initialScrollIndex={1}
          renderItem={({item, index}) => (
            <View key={index} style={{height: '100%', width: kScreenWidth}}>
              {index === 0 && <CompetitionStatistics />}
              {index === 1 && (
                <View style={{height: '90%'}}>
                  {currentMatch?.competitionStatus == 3 ? (
                    <View
                      style={{flex: 1, marginTop: 50, alignItems: 'center'}}>
                      <Image
                        source={require('src/assets/imgs/live-end.png')}
                        style={{width: 100, height: 100}}
                      />
                      <Text>赛事已结束,聊天室关闭</Text>
                    </View>
                  ) : (
                    <Chat liveStream={liveStream} sendGift={() => {}} />
                  )}
                </View>
              )}
              {index === 2 && (
                <OddsInfo
                  europeOddsList={oddsList?.europeOddsList ?? []}
                  competitionId={currentMatch?.competitionId ?? 0}
                  asiaOddsList={oddsList?.asiaOddsList ?? []}
                  bigSmallOddsList={oddsList?.bigSmallOddsList ?? []}
                />
              )}
              {index === 3 && <Information competitionType={competitionType} />}
              {index === 4 && <FollowOrderList/>}
              {index === 5 && <BattleInfo competitionType={competitionType} />}
            </View>
          )}
          keyExtractor={item => item.label}
          autoplayLoop
          index={tab}
          showPagination={false}
          bounces={false}
          scrollEnabled={false}
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={kScreenWidth}
          snapToAlignment="start"
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: kScreenWidth,
            offset: kScreenWidth * index,
            index,
            height: '100%',
          })}
        />
    </View>
  );
};

export default DetailInfos;

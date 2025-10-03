import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {kScreenHeight, kScreenWidth} from '@/p138-react-common/utils/styles';
import HlsPlayer from 'src/modules/live/player/player';
import DetailBaseInfo from 'src/modules/lottery/sport/detail/detailBaseInfo';
import DetailInfos from 'src/modules/lottery/sport/detail/detailInfos.web';
import {useSportDetail} from './hooks';
import {useLocalSearchParams} from 'expo-router';

const SportDetail = () => {
  const {state, watchLive} = useSportDetail();
  const {competitionType} = useLocalSearchParams();

  // 根据比赛类型判断是否为足球
  const isFootball = competitionType !== 'LQ';
  const isBasketball = competitionType === 'LQ';

  // 判断直播状态
  const isLiveStarted = !!state.live.liveUrl;
  const hasLiveStream = !!state.live.liveStream;

  return (
    <View style={styles.flex1}>
      {/* 未开启直播时的背景图片 */}
      {!isLiveStarted && (
        <Image
          style={[styles.backgroundImage, {width: '100%', height: (kScreenHeight * 2) / 5}]}
          source={require('src/assets/imgs/live/bg_live.webp')}
        />
      )}

      {/* 直播播放器区域 - Web端只支持观看 */}
      {isLiveStarted && (
        <View style={[styles.playerContainer, {height: (kScreenHeight * 2) / 5}]}>
          <HlsPlayer liveUrl={state.live.liveUrl!} />
        </View>
      )}

      {/* 比赛基本信息 - 未开启直播时显示 */}
      {!isLiveStarted && (
        <DetailBaseInfo
          liveInfo={state.competition.liveInfo}
          liveStream={state.live.liveStream}
          style={styles.baseInfoContainer}
          onChange={watchLive}
        />
      )}

      {/* 比赛详细信息 */}
      <DetailInfos
        style={styles.flex1}
        liveStream={state.live.liveStream}
        liveInfo={state.competition.liveInfo}
        competitionType={competitionType as ServerCommonLive.CompetitionType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: 250,
  },
  playerContainer: {
    height: (kScreenHeight * 2) / 5,
  },
  baseInfoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SportDetail;

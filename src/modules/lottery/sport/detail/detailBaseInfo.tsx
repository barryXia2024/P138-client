import AppHeader from '@/p138-react-common/components/AppHeader';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import { kScreenWidth } from '@/p138-react-common/utils/styles';
import { IMAGE_SIZE } from '@/p138-react-common/utils/styles/theme';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { View, Text, ViewStyle, TouchableOpacity, StyleSheet } from 'react-native';
import { getFootballCompetitionLive } from 'src/api/interface/competition-football';
import { getLiveStream, startLiveStream } from 'src/api/interface/competition-live-stream';
import { useAnchorStore } from 'src/app/live/store/anchorStore';


const DetailBaseInfo: React.FC<CompetitionProps.DetailBaseInfo> = (props) => {
  const { className, style, onChange, liveStream,liveInfo } = props;
  const {  liveStreamID } = useLocalSearchParams();

  const { isAnchor } = useAnchorStore();

  const openLivePush = () => {
    console.log(liveStreamID)

    if(!liveStream?.liveUrl.rtmp){
      startLiveStream( {
        liveStreamID: liveStreamID as string
      }).then(res => {
        if (res.data) {
          getLiveStream({
            liveStreamID: res.data?.liveStreamID as string
          }).then(res => {
            onChange?.(res.data?.liveUrl.rtmp as string)
          })
        }
  
  
      })
    }else{
      onChange?.(liveStream?.liveUrl.rtmp as string)
    }
   
  }

  const closeLivePush = () => {

  }
  const Button = () => {
    if (isAnchor) {
      return <TouchableOpacity activeOpacity={1} onPress={openLivePush} className='bg-[#00000080] rounded-full p-2 mt-4'>
        <Text style={{ color: '#fff', fontSize: 14 }}>进入直播</Text>
      </TouchableOpacity>
    } else {
      return <View>
        {liveStream?.liveUrl.m3u8 && <TouchableOpacity activeOpacity={1} onPress={() => onChange?.(liveStream?.liveUrl.m3u8)} className='bg-[#00000080] rounded-full p-2 mt-4'>
          <Text style={{ color: '#fff', fontSize: 14 }}>主播解说</Text></TouchableOpacity>}
      </View>
    }
  }
  const BaseInfo = () => {
    return (
      <>
        <Text className='text-white text-16 mt-50'>{liveInfo?.matchTime}</Text>
        <Text className='text-white text-14 mt-4'>{liveInfo?.matchNum} {liveInfo?.leagueName}</Text>
        <View className='flex-row items-center mt-10 flex-1 w-full'>
          <View className='items-center w-24 justify-center flex-1'>
            {liveInfo?.homeLogo && <OSSImage source={{uri:liveInfo?.homeLogo} } style={IMAGE_SIZE.IMAGE_SIZE40}  resizeMode="contain"/>}
            <Text className='text-white text-15'>{liveInfo?.home}</Text>

          </View>
          <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,justifyContent:'center',alignItems:'center'}} className='items-center mx-24'>
            <Text className='text-white text-32 font-bold'>{liveInfo?.matchScore}</Text>
            <Text className='text-white text-14 mt-2'>{['', '未开赛', '进行中', '已结束'][liveInfo?.competitionStatus ?? 0]}</Text>
          </View>
          <View className='items-center w-24 flex-1'>
            {liveInfo?.awayLogo && <OSSImage source={{uri:liveInfo?.awayLogo}} style={IMAGE_SIZE.IMAGE_SIZE40} resizeMode="contain"/>}
            <Text className='text-white text-15'>{liveInfo?.away}</Text>

          </View>
        </View>

        {liveInfo?.competitionStatus !== 3 && <Button />}

      </>
    )
  }
  return (
    <View className={className} style={style}>
      <AppHeader title={`${liveInfo?.home} VS ${liveInfo?.away}`} style={Styles.appHeader} />
      <BaseInfo />
    </View>
  );
};

export default DetailBaseInfo;

const Styles = StyleSheet.create({

  appHeader: {
    backgroundColor: 'transparent',
    width: '100%',
  },

})
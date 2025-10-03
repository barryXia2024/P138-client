
import { IMAGE_SIZE } from '@/p138-react-common/utils/styles/theme';
import { getImageFromOss } from '@/p138-react-common/utils/upload/rn-upload';
import { judgeImageIsOss } from '@/p138-react-common/utils/upload/rn-upload';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { getBasketballCompetitionLive } from 'src/api/interface/competition-basketball';
import { getFootballCompetitionLive } from 'src/api/interface/competition-football';
import { useLiveStore } from 'src/store';

export default function AnchorListCard({ data }: { data: ServerCoreLive.LiveStream }) {
  const [imageBase64, setImageBase64] = useState<string>()
  const { setCurrentMatch } = useLiveStore();

  const getImageBase64 = async (url: string) => {
    return await getImageFromOss(url)
  };
  useEffect(() => {
    if (judgeImageIsOss(data.listIcon)) {
      getImageBase64(data.listIcon).then(res => {
        setImageBase64(res)
      })
    } else {
      setImageBase64(data.listIcon)
    }
  }, [])

  const goLive = () => {


    if (data.competitionType === 'LQ') {
      setCurrentMatch({
        ...data,
        
      })
      if (data.competitionType !== 'LQ') {
        router.push(`/lottery/sport/detail?competitionId=${data.competitionId}&competitionType=${data.competitionType}`)
      } else {
        router.push(`/lottery/sport/detail?competitionId=${data.competitionId}&competitionType=${data.competitionType}`)
      }

      getBasketballCompetitionLive({
        competitionID: data.competitionId,


      }).then(res => {
        console.log(res)
        if (res.success && res.data) {
          setCurrentMatch(res.data as any)
          // router.push({
          //   pathname: `/live/match`,
          //   params: {
          //     competitionId: data.competitionId,
          //     // liveUrl: data.liveUrl.m3u8,
          //     competitionType: data.competitionType,
          //     liveStreamID: data.id
          //   }
          // })
          router.push(`/lottery/sport/detail?competitionId=${data.competitionId}&competitionType=${data.competitionType}`)
        }
      })
      // router.push({
      //   pathname: `/live/match/baseketBall`,
      //   params: {
      //     competitionId: data.competitionId,
      //     // liveUrl: data.liveUrl.m3u8,
      //     competitionType: data.competitionType,
      //     liveStreamID: data.id
      //   }
      // })

    } else {
      getFootballCompetitionLive({
        competitionID: data.competitionId,


      }, {
        competitionType: data.competitionType
      }).then(res => {
        console.log(res)
        if (res.success && res.data) {
          setCurrentMatch(res.data)
          router.push(`/lottery/sport/detail?competitionId=${data.competitionId}&competitionType=${data.competitionType}`)
          // router.push({
          //   pathname: `/live/match`,
          //   params: {
          //     competitionId: data.competitionId,
          //     // liveUrl: data.liveUrl.m3u8,
          //     competitionType: data.competitionType,
          //     liveStreamID: data.id
          //   }
          // })
        }
      })

    }
  }
  return (
    <TouchableOpacity onPress={goLive} activeOpacity={1} style={styles.card}>
      {/* 顶部标签 */}
      <ImageBackground source={{ uri: imageBase64 }} style={styles.cover} resizeMode="stretch">
        <View style={styles.topTag} className='justify-between'>
          <Text style={styles.newTag}>主播：{data.nickName}</Text>
          <View className='bg-[#00000080] mr-2 rounded-full flex-row items-center px-2'>
            <Image source={require('src/assets/imgs/live/icon_live_pre.png')} style={{ width: 10, height: 8, marginRight: 4 }} />
            <Text className='text-white text-[10px]'>{['', '预告', '直播中', '已结束'][data.status]}</Text>
          </View>
        </View>

        <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View className='bg-[#00000080] rounded-full p-2'>
            <Image source={require('src/assets/imgs/live/play.png')} style={IMAGE_SIZE.IMAGE_SIZE20} />
          </View>
        </View>

      </ImageBackground>
      {/* 封面 */}

      {/* 直播信息 */}
      <View style={styles.info}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.desc}>{dayjs(data.beginTime).format('YYYY-MM-DD HH:mm')}</Text>
          <View className='flex-row items-center'>
            <Image source={require('src/assets/imgs/live/eye_open_gray.png')} style={IMAGE_SIZE.IMAGE_SIZE20} />
            <Text style={styles.viewCount}>{data.views}</Text>

          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { margin: 10, borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' },
  topTag: { flexDirection: 'row', alignItems: 'center' },
  newTag: { backgroundColor: '#ff4d4f', color: '#fff', borderBottomRightRadius: 8, paddingHorizontal: 5, paddingVertical: 2, fontSize: 12 },
  cover: { width: '100%', resizeMode: 'cover', aspectRatio: 7 / 3 },
  info: { padding: 8 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  desc: { color: '#333', marginBottom: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  viewCount: { color: '#888', fontSize: 12 },
});
import AppHeader from '@/p138-react-common/components/AppHeader';
import { kScreenHeight } from '@/p138-react-common/utils/styles';
import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
const HlsPlayer = ({ liveUrl }: { liveUrl: string }) => {

    const goFullscreen = () => {
        Orientation.lockToLandscape();
    };

    const exitFullscreen = () => {
        Orientation.lockToPortrait();
    };
    return (
        <View className='flex-1'>
            <AppHeader title='直播' />
            <Video
                source={{ uri: liveUrl?.replace(/\\u0026/g, "&") }}
                controls
                style={{ width: '100%', height: kScreenHeight * 2 / 5 }}
                onError={e=>{
                    console.log(e)
                }}
                onFullscreenPlayerWillPresent={goFullscreen}
                onFullscreenPlayerWillDismiss={exitFullscreen}
            />

        </View>
    );
};

export default HlsPlayer;

import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import Hls from 'hls.js';
import AppHeader from '@/p138-react-common/components/AppHeader';
// import { Image } from 'expo-image';

const HlsPlayer = ({liveUrl}:{liveUrl:string}) => {
    // const [liveUrl, setLiveUrl] = useState<string>(liveUrl);
    const videoRef = useRef<HTMLVideoElement>(null);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const hls = new Hls();
        if (liveUrl) {
            hls.loadSource(liveUrl);

            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });
        }
        return () => {
            hls.destroy();
        };
    }, [liveUrl]);


    return (
        <View className='flex-1'>
            <video ref={videoRef} controls style={{ width: '100%', height: 250 }} />
        </View>
    );
};

export default HlsPlayer;

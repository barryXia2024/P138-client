import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Button, StyleProp, ViewStyle, Platform, TouchableOpacity, Text } from 'react-native';


// import Hls from 'hls.js';
import { ApiVideoLiveStreamView } from '@api.video/react-native-livestream';
// import { Image } from 'expo-image';
export interface StreamPlayerProps {
    liveUrl?: string;
    className?: string;
    style?: StyleProp<ViewStyle>;
    onExit?: () => void;
}

const StreamPlayer = ({ liveUrl, className, style, onExit }: StreamPlayerProps) => {

    const streamRef = useRef<ApiVideoLiveStreamView>(null);
    const [started, setStarted] = useState(false);
    const streamUrl = liveUrl?.replace(/\\u0026/g, "&");

    // useEffect(() => {
    //     if (liveUrl) {
    //         streamRef.current?.startStreaming('/live/test001', 'rtmp://192.168.31.72:1935');
    //     }
    // }, [liveUrl])

    // useEffect(() => {
    //     const video = videoRef.current;
    //     if (!video) return;

    //     const hls = new Hls();
    //     if (liveUrl) {
    //         hls.loadSource(liveUrl);

    //         hls.attachMedia(video);
    //         hls.on(Hls.Events.MANIFEST_PARSED, () => {
    //             video.play();
    //         });
    //     }
    //     return () => {
    //         hls.destroy();
    //     };
    // }, [liveUrl]);

    const toggleStream = () => {

        if (started) {
            streamRef.current?.stopStreaming();
        } else {

            const idx = streamUrl?.indexOf("/sport");
            if(idx === -1){
                Toast.show('直播地址错误')
                return
            }else{
                const baseUrl = streamUrl?.substring(0, idx); // rtmp://47.107.143.93:1935
                const pathUrl = streamUrl?.substring(idx!);   // /sport/3651125?...
                console.log(pathUrl,baseUrl)
                streamRef.current?.startStreaming(pathUrl, baseUrl);
            }
   
        }
        setStarted(!started);
    };



    return (
        <View className='flex-1'>
            <ApiVideoLiveStreamView
                style={{ flex: 1, backgroundColor: 'black', alignSelf: 'stretch' }}
                ref={streamRef}
                camera="front"
                enablePinchedZoom={true}
                video={{
                    fps: 30,
                    resolution: '720p', // Alternatively, you can specify the resolution in pixels: { width: 1280, height: 720 }
                    bitrate: 2 * 1024 * 1024, // # 2 Mbps
                    gopDuration: 1, // 1 second
                }}
                audio={{
                    bitrate: 128000,
                    sampleRate: 44100,
                    isStereo: true,
                }}
                isMuted={false}
                onConnectionSuccess={(e) => {
                    console.log('onConnectionSuccess', e);
                    //do what you want
                    Toast.show('直播已开启')
                }}
                onConnectionFailed={(e) => {
                    console.log('onConnectionFailed', e);
                    Toast.show('连接失败')
                    //do what you want
                }}
                onDisconnect={() => {
                    console.log('onDisconnect');
                    //do what you want
                    Toast.show('直播已结束')
                }}
            />
            <View className='flex-row justify-center items-center h-[64px]'>
                <TouchableOpacity className='flex-1 bg-red-500  h-full justify-center items-center' onPress={toggleStream}>
                    <Text className='text-white text-center text-[16px]'>{started ? '停止直播' : '开启直播'}</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-1 bg-blue-500 h-full justify-center items-center' onPress={onExit}>
                    <Text className='text-white text-center text-[16px]'>退出</Text>
                </TouchableOpacity>
            </View>



        </View>
    );
};

export default StreamPlayer;

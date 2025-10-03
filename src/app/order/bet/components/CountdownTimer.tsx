import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CountdownTimerProps {
  seconds: number;
  onFinish?: () => void;
  onConfirm?: () => void;
  showCancelButton?: boolean;
  onConfirmTitle?: string;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map(pad);
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  seconds,
  onFinish,
  onConfirm,
  showCancelButton = true,
  onConfirmTitle = '撤销订单',
}) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);
  useEffect(()=>{
    setRemaining(seconds);
  },[seconds])

  const [hh, mm, ss] = formatTime(remaining);
  
  if(remaining<=0){
    return null;
  }

  return (
    <View className="bg-white rounded-md p-4 items-center justify-center mt-4">
      <Text className="text-base text-gray-700 mb-2">倒计时：</Text>
      <View className="flex-row space-x-2">
        <Text className="text-xl font-bold text-black bg-gray-100 px-2 py-1 rounded">{hh}</Text>
        <Text className="text-xl font-bold text-black">:</Text>
        <Text className="text-xl font-bold text-black bg-gray-100 px-2 py-1 rounded">{mm}</Text>
        <Text className="text-xl font-bold text-black">:</Text>
        <Text className="text-xl font-bold text-black bg-gray-100 px-2 py-1 rounded">{ss}</Text>
      </View>

      {showCancelButton && (
        <TouchableOpacity
          className="mt-4 bg-red-500 rounded px-4 py-2"
          onPress={onConfirm}
        >
          <Text className="text-white text-base font-medium">{onConfirmTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CountdownTimer;

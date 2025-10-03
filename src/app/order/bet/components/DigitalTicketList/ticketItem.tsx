import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {formatNumberWithZero} from '@/p138-react-common/utils';

export const SuperLottoTicket = (betItem: string, betPlay: string) => {
  if (betPlay === '单式' || betPlay === '复式') {
    // 兼容多种分隔形式：
    // 1) 02|22|24|34|35#06|11  (#分隔红蓝，内部用|)
    // 2) 02,22,24,34,35|06,11   (|分隔红蓝，内部用,)
    // 3) 02,22,24,34,35,06,11   (仅一段，容错显示为红，蓝为空)
    const safe = betItem ?? '';
    const parts = safe.includes('#')
      ? safe.split('#')
      : safe.split('|').length === 2
        ? safe.split('|')
        : [safe, ''];

    const splitNums = (s: string) =>
      (s || '')
        .split(/[|,]/)
        .filter(Boolean)
        .map(num => formatNumberWithZero(num) + ' ');

    const red = splitNums(parts[0] || '');
    const blue = splitNums(parts[1] || '');
    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="text-red-500 font-blod">{red}</Text>+
        <Text className="text-blue-500 font-blod">{blue}</Text>
      </Text>
    );
  } else {
    const safe = betItem ?? '';
    const [frontRaw = '', backRaw = ''] = safe.split('-');
    const [frontDanRaw = '', frontTuoRaw = ''] = (frontRaw || '').split('#');
    const [backDanRaw = '', backTuoRaw = ''] = (backRaw || '').split('#');

    const splitNums = (s: string) =>
      (s || '')
        .split(/[||]/)
        .filter(Boolean)
        .map(num => formatNumberWithZero(num) + ' ');

    const redDan = splitNums(frontDanRaw);
    const redTuo = splitNums(frontTuoRaw);
    const blueDan = splitNums(backDanRaw);
    const blueTuo = splitNums(backTuoRaw);

    return (
      <View>
        <Text className="  font-blod">前胆：{redDan}</Text>
        <Text className="  font-blod">前拖：{redTuo}</Text>
        <Text className="  font-blod">后胆：{blueDan}</Text>
        <Text className="  font-blod">后拖：{blueTuo}</Text>
      </View>
    );
  }
};

export const SevenHappyTicket = (betItem: string, betPlay: string) => {
  if (betPlay.includes('单式') || betPlay.includes('复式')) {
    console.log(betItem, betPlay, '====================');
    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="  font-blod">
          {betItem.split('|').map(num => num + ' ')}
        </Text>
      </Text>
    );
  } else {
    return (
      <Text>
        {betItem.split('#').map((item, index) => {
          return (
            <Text key={index} className="  font-blod">
              {index === 0 ? '胆' : '拖'} :{' '}
              {item.split('|').map(num => num + ' ')}
            </Text>
          );
        })}
      </Text>
    );
  }
};
export const SevenStarTicket = (betItem: string, betPlay: string) => {
  const array = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
  ];
  const safe = betItem ?? '';
  const parts = safe.includes('#')
    ? safe.split('#').map(num => num + ' ')
    : safe.split('|').length === 2
      ? safe.split('|').map(num => num + ' ')
      : [safe, ''];

  return (
    <View  >
      {parts.map((item, index) => {
        return (
          <Text key={index} className="  font-blod">
            <Text className="  font-blod">
              {array[index]} : {item.includes('|') ? item.split('|').map(num => num + ' ') : item}
            </Text>
          </Text>
        );
      })}
    </View>
  );
};

export const DoubleBallTicket = (betItem: string, betPlay: string) => {
  if (betPlay.includes('单式') || betPlay.includes('复式')) {
    const safe = betItem ?? '';
    const parts = safe.includes('#')
      ? safe.split('#')
      : safe.split('|').length === 2
        ? safe.split('|')
        : [safe, ''];

    const splitNums = (s: string) =>
      (s || '')
        .split(/[|,]/)
        .filter(Boolean)
        .map(num => formatNumberWithZero(num) + ' ');

    const red = splitNums(parts[0] || '');
    const blue = splitNums(parts[1] || '');
    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="text-red-500 font-blod">{red}</Text>+
        <Text className="text-blue-500 font-blod">{blue}</Text>
      </Text>
    );
  } else {
    const safe = betItem ?? '';
    const [frontRaw = '', backRaw = ''] = safe.split('-');
    const [frontDanRaw = '', frontTuoRaw = ''] = (frontRaw || '').split('#');
    const [backDanRaw = '', backTuoRaw = ''] = (backRaw || '').split('#');

    const splitNums = (s: string) =>
      (s || '')
        .split(/[||]/)
        .filter(Boolean)
        .map(num => formatNumberWithZero(num) + ' ');

    const redDan = splitNums(frontDanRaw);
    const redTuo = splitNums(frontTuoRaw);
    const blueDan = splitNums(backDanRaw);

    return (
      <View>
        <Text className="  font-blod">红胆：{redDan}</Text>
        <Text className="  font-blod">红拖：{redTuo}</Text>
        <Text className="  font-blod"> 蓝球：{blueDan}</Text>
      </View>
    );
  }
};
export const Fucai3DTicket = (betItem: string, betPlay: string) => {
 
  if (
    (betPlay.includes('单式') || betPlay.includes('复式')) &&
    !betPlay.includes('组三')&&  !betPlay.includes('组六')
  ) {
    const array = ['百', '十', '个'];

    return (
      <View>
        {betItem.split('#').map((item, index) => {
          return (
            <Text key={index} className="  font-blod">
              {array[index]} : {item.split('|').map(num => num + ' ')}
            </Text>
          );
        })}
      </View>
    );
  } else if (betPlay=='1D' || betPlay=='2D') {
    const array = ['百', '十', '个'];
    return (
      <View>
        {betItem.split('#').map((item, index) => {
          return (
            <Text key={index} className="  font-blod">
              {array[index]} : {item.split('|').map(num => num + ' ')}
            </Text>
          );
        })}
      </View>
    );
  } else {
    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="  font-blod">
          {betItem.split('#').map(num => num.split('|').map(num => num + ' '))}
        </Text>
      </Text>
    );
  }
};

export const ArrangedThreeTicket = (betItem: string, betPlay: string) => {
  if (betPlay == '直选[复式]' || betPlay == '直选[单式]') {
    const array = ['百', '十', '个'];

    return (
      <View>
        {betItem.split('#').map((item, index) => {
          return (
            <Text key={index}  >
              {array[index]} : {item.split('|').map(num => num + ' ')}
            </Text>
          );
        })}
      </View>
    );
  }else if(betPlay.includes('胆拖')){
    const safe = betItem ?? '';
    const [danRaw = '', tuoRaw = ''] = safe.split('#');


    const splitNums = (s: string) =>
      (s || '')
        .split(/[||]/)
        .filter(Boolean)
        .map(num => num+ ' ');

    const dan = splitNums(danRaw);
    const tuo = splitNums(tuoRaw);


    return (
      <View>
        <Text >胆号：{dan}</Text>
        <Text >拖号：{tuo}</Text>

      </View>
    );
   
  } else {
    return (
      <Text  >
        <Text  >
          {betItem.split('#').map(num => num.split('|').map(num => num + ' '))}
        </Text>
      </Text>
    );
  }
};

export const ArrangedFiveTicket = (betItem: string, betPlay: string) => {
  if (betPlay == '定位复式') {
    const array = ['万', '千', '百', '十', '个'];

    return (
      <View>
        {betItem.split('#').map((item, index) => {
          return (
            <Text key={index} className="  font-blod">
              {array[index]} : {item.split(',').map(num => num + ' ')}
            </Text>
          );
        })}
      </View>
    );
  } else {
    const parts = betItem.includes('#')
      ? betItem.split('#').map(num => {
          if (num.includes('|')) {
            return num.split('|').map(num => num + ' ');
          }
          return num + ' ';
        })
      : betItem.includes('|')
        ? betItem.split('|').map(num => {
            if (num.includes('|')) {
              return num.split('|').map(num => num + ' ');
            }
            return num + ' ';
          })
        : [betItem, ''];

    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="  font-blod">{parts}</Text>
      </Text>
    );
  }
};

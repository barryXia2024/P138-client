import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {themeRedColor} from '@/p138-react-common/utils/styles/color';

const RecentWinStatus: React.FC<FollowProps.RecentWinStatusProps> = ({
  latestWinStatus = [],
  maxItems = 10,

  isMine,
}) => {
  const displayStatus = useMemo(() => {
    if (!latestWinStatus?.length) return [];
    return latestWinStatus.slice(0, maxItems);
  }, [latestWinStatus, maxItems]);

  return (
    <View
      style={[
        styles.container,
        isMine
          ? {marginHorizontal: 8, marginTop: 8, borderRadius: 8}
          : {marginBottom: 8},
      ]}>
      <Text style={[isMine && styles.title]}>近10期：</Text>
      <View
        style={[styles.statusContainer, !isMine && {backgroundColor: '#fff'}]}>
        {displayStatus.map((isWin, index) => (
          <View className="flex-row items-center">
            <View
              key={index}
              style={[
                styles.statusDot,
                isWin ? styles.winDot : styles.loseDot,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  isWin ? styles.winText : styles.loseText,
                ]}>
                {isWin ? '中' : '未'}
              </Text>
            </View>
            {index !== displayStatus.length - 1 && (
              <Image
                source={require('src/assets/imgs/gendan/icon_arrow_left_red.png')}
                style={{width: 5, height: 2}}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: themeRedColor,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: 8,
  },
  statusDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  winDot: {
    backgroundColor: themeRedColor,
  },
  loseDot: {
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  winText: {
    color: '#fff',
  },
  loseText: {
    color: '#666',
  },
});

export default RecentWinStatus;

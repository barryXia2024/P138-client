import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  betPlayColorBrown,
  betPlayColorGreen,
} from 'p138-react-common/utils/styles/color';

const FourSixBetInfo = (props: {orderInfo: ServerCommonOrder.LotteryOrder}) => {
  const {orderInfo} = props;

  const renderBetItem = (bet: ServerCommonOrder.BetContentSportsLottery) => {
    // 将分组后的内容转换为文本
    return bet.betPlayList
      ?.map(item => item.betItem.replace('#', '\n'))
      .join('\n');
  };
  console.log(orderInfo);

  return (
    <View>
      <View className="flex-row gap-2 m-2 items-center ">
        <Text className="font-bold">投注信息</Text>
        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorGreen}]}>
          第{orderInfo?.termNo}期
        </Text>
        <Text style={[styles.betInfoTag, {backgroundColor: 'green'}]}>
          {orderInfo?.betContentTraditionalLotteryList?.length} 场
        </Text>
        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorBrown}]}>
          {orderInfo?.betMultiple} 倍
        </Text>
      </View>
      <View className="flex-col">
        <View className="flex-row">
          <Text style={styles.tableColumn}>场次</Text>
          <Text style={[styles.tableColumn, {flex: 1}]}>对阵</Text>
          <Text style={[styles.tableColumn, {width: 90}]}>投注内容</Text>
          <Text style={[styles.tableColumn, {width: 70}]}>赛果</Text>
        </View>
        {orderInfo?.betContentTraditionalLotteryList?.map((bet, index) => (
          <View style={styles.tableRow} key={index}>
            <View
              className="flex-row items-center"
              style={{borderRightWidth: 1, borderRightColor: '#f0f0f0'}}>
              <Text style={[styles.cell, {width: 70}]}>{index + 1}</Text>
            </View>
            <View
              style={{borderRightWidth: 1, borderRightColor: '#f0f0f0'}}
              className="flex-1 justify-center items-center">
              <Text style={[styles.cell]}>
                (主){bet.home} {'\n'} (客){bet.away}
              </Text>
            </View>
            <View style={[{width: 70}]}>
              {bet.betPlayList?.map(item =>
                item.betItem
                  .split('#')
                  .map(e => <Text style={[styles.cell]}>{e}</Text>),
              )}
            </View>
            <View  className='justify-center items-center'>
              {bet.betPlayList?.map(item => (
                <Text style={[styles.cell, {width: 70,color: item.hasHit ? 'red' : 'black'}]}>
                  {item.result?.split('#').join(' - ')}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FourSixBetInfo;

const styles = StyleSheet.create({
  tableColumn: {
    width: 70,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 34,
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  betInfoTag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: '#fff',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
    paddingVertical: 2,
    // justifyContent: 'space-between',
  },
  cell: {
    // flex: 1,
    // width: 20,
    fontSize: 14,
    // padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    // paddingHorizontal: 10,
    // height:14,
  },
});

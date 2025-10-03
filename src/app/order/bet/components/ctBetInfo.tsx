import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {betPlayColorBrown, betPlayColorGreen} from 'p138-react-common/utils/styles/color';

const CtBetInfo = (props: {orderInfo: ServerCommonOrder.LotteryOrder}) => {
  const {orderInfo} = props;
  console.log(orderInfo);
  return (
    <View>
      <View
        className='flex-row gap-10 mb-2 items-center'
  >
        <Text style={styles.sectionTitle}>投注信息</Text>
        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorGreen}]}>
          第{orderInfo?.append ?? 0}期
        </Text>

        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorBrown}]}>
          {orderInfo?.betMultiple} 倍
        </Text>
      </View>
      <View className='flex-col'>
        <View className='flex-row'>
          <Text style={styles.tableColumn}>场次</Text>
          <Text style={[styles.tableColumn, {flex: 1}]}>对阵</Text>
          <Text style={styles.tableColumn}>胜平负</Text>
          {/* <Text style={styles.tableColumn}>投注内容</Text> */}
        </View>
        {orderInfo?.betContentTraditionalLotteryList?.map((bet, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.cell, {width: 50}]}>{index + 1}</Text>
            <Text style={[styles.cell, {flex: 1}]}>
              {bet.home}vs{bet.away}
            </Text>
            <Text style={[styles.cell, {width: 50}]}>胜</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CtBetInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  tableColumn: {
    width: 50,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: '#f0f0f0',
  },
  tableHeader: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 50,
  },
  betInfoTag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: '#fff',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
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
    fontSize: 12,
    // padding: 5,
    textAlign: 'center',
    // paddingHorizontal: 10,
    // height:14,
  },
});

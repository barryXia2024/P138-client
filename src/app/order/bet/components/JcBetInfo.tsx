import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  betPlayColorBlue,
  betPlayColorBrown,
  betPlayColorGreen,
  themeRedColor,
} from 'p138-react-common/utils/styles/color';
import {router} from 'expo-router';

const JcBetInfo = (props: {orderInfo: ServerCoreOrder.LotteryOrder}) => {
  const {orderInfo} = props;

  return (
    <View style={styles.section}>
      <View className="flex-row gap-2 mb-2 items-center px-4">
        <Text style={styles.sectionTitle}>投注信息</Text>
        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorBlue}]}>
          {orderInfo?.betContentSportsLotteryList?.length ?? 0} 场
        </Text>
        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorGreen}]}>
          {orderInfo?.bettingString}
        </Text>
        <Text style={[styles.betInfoTag, {backgroundColor: betPlayColorBrown}]}>
          {orderInfo?.betMultiple} 倍
        </Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableColumn}>场次</Text>
        <Text style={styles.tableColumn}>对阵</Text>
        <Text style={styles.tableColumn}>玩法</Text>
        <Text style={styles.tableColumn}>投注内容</Text>
      </View>
      {orderInfo?.betContentSportsLotteryList &&
        orderInfo?.betContentSportsLotteryList?.map((lottery, matchIndex) => (
          <View
            key={matchIndex}
            className="flex-row mb-2"
            style={[styles.tableRow, styles.rowSeparator]}>
            <View
              style={[styles.tableCell, styles.cellSeparator]}
              className="flex-1 ">
              <View className="flex-1 items-center justify-center py-2">
                <Text style={styles.cellText}>
                  {lottery.competitionSessions}
                </Text>
              </View>
            </View>
            <View
              style={[styles.tableCell, styles.cellSeparator]}
              className="flex-1 ">
              <View className="flex-1 items-center justify-center py-2">
                <Text style={styles.cellText}>
                  {`${lottery.home} \n vs \n ${lottery.away}`}
                </Text>
              </View>
            </View>

            <View
              style={[styles.tableCell, styles.cellSeparator]}
              className="flex-1 ">
              <View className="flex-1 items-center justify-center py-2">
                <Text style={styles.cellText}>
                  {lottery.betPlayList![0].betPlay}
                </Text>
              </View>
            </View>
            <View style={styles.tableCell} className="flex-1 ">
              <View className="flex-1 items-center justify-center py-2">
                {lottery.betPlayList?.map((b: any, index: number) => (
                  <Text
                    style={[
                      styles.cellText,
                      {color: b.hasHit ? 'red' : 'black'},
                    ]}
                    key={index}>
                    {b.betItem}
                    {'\n'} ({b.betOdds}){'\n'}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}

      {orderInfo?.orderType !== 4 ? (
        <Text style={styles.estimatedPrize}>
          预计中奖金额：
          <Text className="text-red-500">
            {parseFloat(orderInfo?.winAmount ?? '0').toFixed(2)}
          </Text>
          元
        </Text>
      ) : (
        <Text style={styles.estimatedPrize}>
          预计最高回报：{orderInfo?.returnMultiple}倍
        </Text>
      )}
      {orderInfo?.optimizationType && orderInfo.optimization.length > 0 && (
        <TouchableOpacity
          className="flex-row justify-center mt-2"
          onPress={() => {
            router.push({
              pathname: '/order/bet/optimization',
              params: {
                orderInfoString: JSON.stringify(orderInfo),
           
              },
            });
          }}>
          <Text
            style={{
              color: themeRedColor,
              borderWidth: 1,
              borderColor: themeRedColor,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            查看
            {
              ['平均优化', '博热优化', '博冷优化'][
                orderInfo?.optimizationType - 1
              ]
            }
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default JcBetInfo;

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    // paddingHorizontal: 16,
    paddingVertical: 6,
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    // padding: 8,
    gap: 1,
  },

  estimatedPrize: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // 表格行
  tableColumn: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 30,
    // paddingVertical: 4,
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center', // 垂直居中
    justifyContent: 'space-between',
  },
  // 单元格样式
  tableCell: {
    flex: 1,
    alignItems: 'center', // 水平居中
    justifyContent: 'center', // 垂直居中
    paddingVertical: 2,
    // paddingHorizontal: 4,
    // backgroundColor: '#e2e',
  },
  // 单元格文本样式
  cellText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // 行底部分割线
  rowSeparator: {
    borderBottomWidth: 1,
    borderColor: '#ddd', // 行分割线颜色
  },
  // 单元格右侧分割线
  cellSeparator: {
    borderRightWidth: 1,
    borderColor: '#ddd', // 单元格分割线颜色
  },
});

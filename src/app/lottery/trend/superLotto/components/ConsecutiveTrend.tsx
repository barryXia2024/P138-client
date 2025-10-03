import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {processTrendData} from '../utils/trend';
import TrendHeader from './common/TrendHeader';
import TrendFooter from './common/TrendFooter';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  PERIOD_COL_WIDTH,
  PERIOD_HEADER_HEIGHT,
  FONT_SIZE_HEADER,
  FONT_SIZE_PERIOD,
  BALL_DIAMETER,
} from '../config/constants';

const config = [
  {
    title: '红球连号分布',
    nums: Array.from({length: 35}, (_, index) => (index + 1).toString()),
    width: CELL_WIDTH,
  },
  {
    title: '组数',
    nums: [''],
    width: CELL_WIDTH,
  },
  {
    title: '个数',
    nums: [''],
    width: CELL_WIDTH,
  },
];

// 连号数据行组件
const ConsecutiveTrendRow: React.FC<{
  numbers: CoreLotteryTrend.TrendNumber[];
  rowIndex: number;
}> = ({numbers, rowIndex}) => {
  return (
    <View
      style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      {numbers.map((item, index) => {
        const num = parseInt(item.num);
        const isWinning = item.prize;

        return (
          <View key={`cell-${index}`} style={styles.cell}>
            {isWinning ? (
              <View
                style={[
                  styles.winningBall,
                  index > 34 ? styles.blueBall : null,
                ]}>
                <Text style={styles.winningText}>
                  {num.toString().padStart(2, '0')}
                </Text>
              </View>
            ) : (
              <Text style={styles.missingText}>{item.num}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const ConsecutiveTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({
  trendData,
}) => {
  const data = processTrendData(trendData.trendInfos || []);

  return (
    <ScrollView horizontal={false}>
      <ScrollView horizontal>
        <View style={styles.container}>
          <TrendHeader sections={config} />

          {/* 数据行 */}
          {data.map((row, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={[
                styles.row,
                rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
              ]}>
              <View style={[styles.periodCell]}>
                <Text style={styles.periodText}>{row.period}</Text>
              </View>
              <ConsecutiveTrendRow
                key={`row-${rowIndex}`}
                numbers={row.numbers || []}
                rowIndex={rowIndex}
              />
            </View>
          ))}

          {/* 统计行 */}
          <TrendFooter config={config} trendData={trendData} />
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  periodCell: {
    width: PERIOD_COL_WIDTH,
    height: CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: 'transparent',
  },
  periodText: {
    fontSize: FONT_SIZE_PERIOD,
    color: '#333',
  },
  missingText: {
    fontSize: FONT_SIZE_HEADER,
    color: '#666',
  },
  winningBall: {
    width: BALL_DIAMETER,
    height: BALL_DIAMETER,
    borderRadius: BALL_DIAMETER / 2,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueBall: {
    backgroundColor: '#4a90e2',
  },
  winningText: {
    fontSize: FONT_SIZE_HEADER,
    color: '#fff',
    fontWeight: 'bold',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
});

export default ConsecutiveTrend;

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
} from '../config/constants';

const config = [
  {
    title: '奇偶形态分布',
    nums: ['奇偶形态','奇奇奇', '奇奇偶', '奇偶奇', '奇偶偶', '偶奇奇', '偶奇偶','偶偶奇','偶偶偶'],
    width: CELL_WIDTH*1.5,
  },
  {
    title: '奇偶比例分布',
    nums: ['奇偶比','3:0', '2:1', '1:2', '0:3'],
    width: CELL_WIDTH*1.5,
  },
   
];

// 奇偶数据行组件
const OddEvenRow: React.FC<{
  numbers: CoreLotteryTrend.TrendNumber[];
  rowIndex: number;
}> = ({numbers, rowIndex}) => {
  return (
    <View
      style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
 

      {numbers.map((item, index) => {
        const isWinning = item.prize;
        const isMergedCell = index === 10; // 大小排位列

        return (
          <View
            key={`cell-${index}`}
            style={[
              styles.cell,
             
              isWinning && {
                backgroundColor:
                  index > 12
                    ? '#39f'
                    : index < 11 && (index % 2 == 1 || index == 10)
                      ? '#ff6b6bb5'
                      : index == 11
                        ? '#9ca9e4b5'
                        : '#9ca9e4b5',
              },
            ]}>
            <Text style={[styles.missingText, isWinning && {color: '#fff'}]}>
              {item.num}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const OddEvenTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({
  trendData,
}) => {
  const data = processTrendData(trendData.trendInfos || []);
  const insertConfigArr = [
    {
      index: 0, // 在红球和值分布后插入
      count: 1, // 插入2个空列
      mergedCellSpan: 1, // 合并单元格宽度
    },
    {
      index: 8, // 在红球和值分布后插入
      count: 1, // 插入2个空列
      mergedCellSpan: 1,
    },
  ];
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
              <OddEvenRow
                key={`row-${rowIndex}`}
                numbers={row.numbers || []}
                rowIndex={rowIndex}
              />
            </View>
          ))}

          {/* 统计行 */}
          <TrendFooter
            config={config}
            trendData={trendData}
            cellWidth={CELL_WIDTH*1.5 }
            insertConfigArr={insertConfigArr}
          />
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
    width: CELL_WIDTH*1.5,
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
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
});

export default OddEvenTrend;

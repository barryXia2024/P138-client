import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {processTrendData} from '../utils/trend';
import TrendHeader from './common/TrendHeader';
import TrendFooter from './common/TrendFooter';
import {
  CELL_WIDTH as CELL_WIDTH_BASE,
  CELL_HEIGHT,
  PERIOD_COL_WIDTH,
  PERIOD_HEADER_HEIGHT,
  FONT_SIZE_HEADER,
  FONT_SIZE_PERIOD,
} from '../config/constants';
const CELL_WIDTH = CELL_WIDTH_BASE*1.5
const config = [
  {
    title: '和值',
    nums: [''],
    width: CELL_WIDTH,
  },
  {
    title: '红球和值分布',
    nums: [
      '15-49',
      '50-59',
      '60-69',
      '70-79',
      '80-89',
      '90-99',
      '100-109',
      '110-119',
      '120-129',
      '130-139',
      '140-165',
    ],
    width: CELL_WIDTH  ,
  },
  {
    title: '和尾',
    nums: [''],
    width: CELL_WIDTH,
  },
  {
    title: '和尾分布',
    nums: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    width: CELL_WIDTH ,
  },
];

// 和值数据行组件
const SumTrendRow: React.FC<{
  numbers: CoreLotteryTrend.TrendNumber[];
  rowIndex: number;
}> = ({numbers, rowIndex}) => {
  return (
    <View
      style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
 

      {numbers.map((item, index) => {
        const isWinning = item.prize;
        
        return (
          <View
            key={`cell-${index}`}
            style={[
              styles.cell,
              isWinning && {
                backgroundColor:
                  index === 0 ? '#ff6b6bb5' : index > 12 ? 'red' : 'blue',
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

const SumTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({
  trendData,
}) => {
  const data = processTrendData(trendData.trendInfos || []);
  
  // 定义插入配置数组 - 基于实际的数据长度
  const insertConfigArr = [
    {
      index: 0, // 在和值后插入
      count: 1, // 插入1个空列
      mergedCellSpan: 1, // 合并单元格宽度
    },
    {
      index: 11, // 在红球和值分布后插入 (1 + 11)
      count: 1, // 插入1个空列
      mergedCellSpan: 1, // 合并单元格宽度
    },
  
  ];
  
  console.log('SumTrend insertConfigArr:', insertConfigArr);
  
  return (
    <ScrollView horizontal={false}>
      <ScrollView horizontal>
        <View style={styles.container}>
          <TrendHeader sections={config} />

     
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
              <SumTrendRow
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
            cellWidth={CELL_WIDTH }
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
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
});

export default SumTrend;

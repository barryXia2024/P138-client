import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import TrendHeader from './common/TrendHeader';
import TrendFooter from './common/TrendFooter';
import {processTrendData} from '../utils/trend';
import TrendNumberRow from './common/TrendNumberRow';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  RED_COUNT,
  BLUE_COUNT,
  PERIOD_COL_WIDTH,
 
  FONT_SIZE_PERIOD,
 
} from '../config/constants';

const config = [
  {
    width: CELL_WIDTH,
    title: '一区',
    nums: Array.from({length: 10}, (_, index) => (index + 1).toString()),

  },
  {
    width: CELL_WIDTH,
    title: '二区',
    nums: Array.from({length: 10}, (_, index) => (index + 11).toString()),

  },
  {
    width: CELL_WIDTH,
    title: '三区',
    nums: Array.from({length: 13}, (_, index) => (index + 21).toString()),

  },
  {
    width: CELL_WIDTH,
    title: '蓝球区',
    nums: Array.from({length: BLUE_COUNT}, (_, index) =>
      (index + 1).toString(),
    ),
  
  },
];

const BasicTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({
  trendData,
}) => {
  const data = processTrendData(trendData.trendInfos || []);
  console.log(config,'=========');

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
                [styles.evenRow, styles.oddRow][rowIndex % 2],
              ]}>
              <View
                style={[
                  styles.periodCell,
                  [styles.evenRow, styles.oddRow][rowIndex % 2],
                ]}>
                <Text style={styles.periodText}>{row.period}</Text>
              </View>

              <TrendNumberRow
                numbers={row.numbers || []}
                redLen={config[0].nums.length}
              />
            </View>
          ))}
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
 

  periodText: {
    fontSize: FONT_SIZE_PERIOD,
    color: '#333',
  },
 

  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
});

export default BasicTrend;

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import TrendHeader from './common/TrendHeader';
import TrendFooter from './common/TrendFooter';
import {processTrendData} from '../utils/trend';
import TrendNumberRow from './common/TrendNumberRow';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  ARRANGED_THREE_COUNT,
  PERIOD_COL_WIDTH,
  FONT_SIZE_PERIOD,
} from '../config/constants';

const config = [
  {
    width: CELL_WIDTH,
    title: '第一位',
    selectedColor: 'blue',
    nums: Array.from({length: ARRANGED_THREE_COUNT}, (_, index) =>
      (index + 1).toString(),
    ),
  },
  {
    width: CELL_WIDTH,
    title: '第二位',
    selectedColor: 'red',
    nums: Array.from({length: ARRANGED_THREE_COUNT}, (_, index) =>
      (index + 1).toString(),
    ),
  },
  {
    width: CELL_WIDTH,
    title: '第三位',
    selectedColor: 'green',
    nums: Array.from({length: ARRANGED_THREE_COUNT}, (_, index) =>
      (index + 1).toString(),
    ),
  },
  {
    width: CELL_WIDTH,
    title: '第四位',
    selectedColor: '#7b3cc1',
    nums: Array.from({length: ARRANGED_THREE_COUNT}, (_, index) =>
      (index + 1).toString(),
    ),
  },
  {
    width: CELL_WIDTH,
    title: '第五位',
    selectedColor: '#7b3cc1',
    nums: Array.from({length: ARRANGED_THREE_COUNT}, (_, index) =>
      (index + 1).toString(),
    ),
  },
];

const BasicTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({
  trendData,
}) => {
  const data = processTrendData(trendData.trendInfos || []);
  console.log(config[0].nums.length, '=========');

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
          <TrendFooter
            config={config}
            trendData={trendData}
            cellWidth={CELL_WIDTH }
            staticsArray={[
              {key: 'totalCount', title: '出现次数'},
              {key: 'avgCount', title: '平均遗漏'},
              {key: 'maxCount', title: '最大遗漏'},
      
            ]}
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

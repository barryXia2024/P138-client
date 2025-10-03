import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import TrendHeader from './common/TrendHeader';
import TrendFooter from './common/TrendFooter';
import {processTrendData} from '../utils/trend';
import {CELL_WIDTH} from '../config/constants';
import BigSmallRow from './common/BigSmallRow';

const config = [
  {
    title: '第一位',
    nums: ['大', '小'],
    width: CELL_WIDTH,
  },
  {
    title: '第二位',
    nums: ['大', '小'],
    width: CELL_WIDTH,
  },
  {
    title: '第三位',
    nums: ['大', '小'],
    width: CELL_WIDTH,
  },
  {
    title: '第四位',
    nums: ['大', '小'],
    width: CELL_WIDTH,
  },
  {
    title: '第五位',
    nums: ['大', '小'],
    width: CELL_WIDTH,
  },
 
  {
    title: '大小比',
    nums: ['', '5:0', '4:1', '3:2', '2:3', '1:4', '0:5'],
    width: CELL_WIDTH,
  },
];

const getPosCols = () =>
  config.slice(0, 5).reduce((sum, s) => sum + s.nums.length, 0);

const BigSmallTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({
  trendData,
}) => {
  const data = processTrendData(trendData.trendInfos || []);
  const insertConfigArr = [
    {
      index: 10, // 在红球和值分布后插入
      count: 1, // 插入2个空列
      mergedCellSpan:1, // 合并单元格宽度
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
              <View
                style={[
                  styles.periodCell,
           
                ]}>
                <Text style={styles.periodText}>{row.period}</Text>
              </View>

              <BigSmallRow
                numbers={row.numbers || []}
                posCols={getPosCols()}
                mergedSpan={3}
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
              {key: 'minCount', title: '最大连出'},
      
            ]}
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
    width: 80,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  cell: {
    width: 40,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: 'transparent',
  },

  blueCell: {
    backgroundColor: '#f5f9ff',
  },
  headerText: {
    fontSize: 12,
    color: '#666',
  },
  periodText: {
    fontSize: 12,
    color: '#333',
  },

  missingText: {
    fontSize: 12,
    color: '#666',
  },

  areaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
  statisticsRow: {
    backgroundColor: '#f0f8ff',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  statisticsCell: {
    backgroundColor: '#f0f8ff',
  },
  statisticsText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  missingRow: {
    backgroundColor: '#fff5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  missingCell: {
    backgroundColor: '#fff5f5',
  },
  missingHeaderText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default BigSmallTrend;

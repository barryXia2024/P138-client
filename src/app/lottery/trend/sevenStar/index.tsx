import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import { listTrend } from 'src/api/interface/lottery-lottery-type-trend';
import { LotteryName } from '@/p138-react-common/constants/LotteryCommon';
import { processTrendData } from '../superLotto/utils/trend';
import TrendHeader from '../superLotto/components/common/TrendHeader';
import TrendFooter from '../superLotto/components/common/TrendFooter';
import {
  CELL_WIDTH,
  CELL_HEIGHT,
  PERIOD_COL_WIDTH,
  
  FONT_SIZE_HEADER,
  FONT_SIZE_PERIOD,
  BALL_DIAMETER,
} from '../superLotto/config/constants';

// 七星彩配置
const config = [
  {
    title: '第一位',
    nums: Array.from({length: 10}, (_, index) => index.toString()),
    width: CELL_WIDTH,
  },
  {
    title: '第二位',
    nums: Array.from({length: 10}, (_, index) => index.toString()),
    width: CELL_WIDTH ,
  },
  {
    title: '第三位',
    nums: Array.from({length: 10}, (_, index) => index.toString()),
        width: CELL_WIDTH ,
  },
  {
    title: '第四位',
    nums: Array.from({length: 10}, (_, index) => index.toString()),
    width: CELL_WIDTH ,
  },
  {
    title: '第五位',
    nums: Array.from({length: 10}, (_, index) => index.toString()),
    width: CELL_WIDTH ,
  },
  {
    title: '第六位',
    nums: Array.from({length: 10}, (_, index) => index.toString()),
    width: CELL_WIDTH ,
  },
  {
    title: '第七位',
    nums: Array.from({length: 15}, (_, index) => index.toString()),
    width: CELL_WIDTH ,
  },
];

// 七星彩数据行组件
const SevenStarTrendRow: React.FC<{
  numbers: CoreLotteryTrend.TrendNumber[];
  rowIndex: number;
}> = ({numbers, rowIndex}) => {
  const colorMap = [
    '#39f',
    'red',
    'green',
    'red',
    '#58a987',
    '#7b3cc1',
    '#cfa612',
  ];

  return (
    <View
      style={[styles.row, rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      <View
        style={[
          styles.periodCell,
          rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow,
        ]}>
        <Text style={styles.periodText}>{numbers[0]?.num || ''}</Text>
      </View>

      {numbers.map((item, index) => {
        const num = parseInt(item.num);
        const isWinning = item.prize;
        // 根据七星彩的7个区域来确定颜色索引
        const colorIndex = Math.floor(index / 10);
        const isRightBlueLine = index % 10 === 9 && index !== 69;

        return (
          <View
            key={`cell-${index}`}
            style={[styles.cell, isRightBlueLine && styles.rightBlueLine]}>
            {isWinning ? (
              <View
                style={[
                  styles.winningBall,
                  {backgroundColor: colorMap[colorIndex]},
                ]}>
                <Text style={styles.winningText}>{num.toString()}</Text>
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

const SevenStarTrend: React.FC<{trendData: CoreLotteryTrend.Trend}> = ({trendData}) => {
  const data = processTrendData(trendData.trendInfos || []);
  
  return (
    <ScrollView horizontal={false}>
      <ScrollView horizontal>
        <View style={styles.container}>
          <TrendHeader sections={config} />

          {/* 数据行 */}
          {data.map((row, rowIndex) => (
            <SevenStarTrendRow
              key={`row-${rowIndex}`}
              numbers={row.numbers || []}
              rowIndex={rowIndex}
            />
          ))}

          {/* 统计行 */}
          <TrendFooter config={config} trendData={trendData} />
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const SevenStar = () => {
  const [selectedTab, setSelectedTab] = useState('basic');
  const [trendData, setTrendData] = useState<CoreLotteryTrend.Trend>();

  useEffect(() => {
    listTrend({
      lotteryName: LotteryName.SevenStar,
      trendType: 1,
    }).then(res => {
      console.log(res);
      if (res.success) {
        setTrendData(res.data?.[0]);
      }
    });
  }, []);

  return (
    <View style={styles.pageContainer}>
      <AppHeader title="七星彩走势" />

      <View style={styles.tabContainer}>
        <TabSwitcher
          className="bg-white w-[100px]"
          tabs={[
            {
              label: '基本走势',
              key: 'basic',
            },
          ]}
          activeTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      </View>

      {trendData && <SevenStarTrend trendData={trendData} />}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  winningBall: {
    width: BALL_DIAMETER,
    height: BALL_DIAMETER,
    borderRadius: BALL_DIAMETER / 2,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodText: {
    fontSize: FONT_SIZE_PERIOD,
    color: '#333',
  },
  winningText: {
    fontSize: FONT_SIZE_HEADER,
    color: '#fff',
    fontWeight: 'bold',
  },
  missingText: {
    fontSize: FONT_SIZE_HEADER,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#eee',
  },
  rightBlueLine: {
    borderRightWidth: 1,
    borderRightColor: 'blue',
  },
});

export default SevenStar;

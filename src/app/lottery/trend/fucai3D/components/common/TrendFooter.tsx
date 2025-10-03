import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TrendHeader from './TrendHeader';
import {CELL_WIDTH as CELL_WIDTH_BASE , FONT_SIZE_HEADER} from '../../config/constants';

type SectionConfig = {
  title: string;
  nums: string[];
  width: number;
};

interface TrendHeaderProps {
  config: SectionConfig[];
  trendData: CoreLotteryTrend.Trend;
  cellWidth?:number,
  staticsArray?: {
    key: keyof CoreLotteryTrend.Trend;
    title: string;
  }[];
  insertConfigArr?: {
    index: number;
    count: number;
    mergedCellSpan: number;
  }[];
}
const defaultStaticsArray: {
  key: keyof CoreLotteryTrend.Trend;
  title: string;
}[] = [
  {key: 'totalCount', title: '出现次数'},
  {key: 'avgCount', title: '平均遗漏'},
  {key: 'maxCount', title: '最大遗漏'},
  {key: 'minCount', title: '最小遗漏'},
];

const TrendFooter: React.FC<TrendHeaderProps> = ({
  config,
  trendData,
  cellWidth=CELL_WIDTH_BASE ,
  insertConfigArr,
  staticsArray=defaultStaticsArray,
}) => {
  const redLen =
    config?.reduce((total, section) => total + section.nums.length, 0) || 0;

  // 数组插入逻辑：按索引从大到小排序，避免插入后索引变化
  const insertArray = (arr: string[]) => {
    if (!insertConfigArr || insertConfigArr.length === 0) return arr;

    const newArr = [...arr];
    // 按索引从大到小排序，避免插入后索引变化
    const sortedConfig = [...insertConfigArr].sort((a, b) => b.index - a.index);

    sortedConfig.forEach(item => {
      newArr.splice(item.index, 0, ...Array(item.count).fill(''));
    });

    return newArr;
  };

  // 判断是否为插入的合并单元格
  const isInsertedCell = (idx: number) => {
    if (!insertConfigArr) return false;

    for (const item of insertConfigArr) {
      if (idx >= item.index && idx < item.index + item.count) {
        return true;
      }
    }
    return false;
  };

  // 获取插入单元格的宽度
  const getInsertedCellWidth = (idx: number) => {
    if (!insertConfigArr) return cellWidth;

    for (const item of insertConfigArr) {
      if (idx >= item.index && idx < item.index + item.count) {
        return cellWidth * item.mergedCellSpan;
      }
    }
    return cellWidth;
  };

  return (
    <View style={localStyles.rightHeaderContainer}>
      <TrendHeader sections={config} />
      {staticsArray.map((item, index) => (
        <View
          key={`stat-${item.key}-${index}`}
          style={[localStyles.row, localStyles.statisticsRow]}>
          <View
            key={`stat-${item.key}-${index}`}
            style={[localStyles.periodCell, localStyles.statisticsCell]}>
            <Text style={localStyles.statisticsText}>{item.title}</Text>
          </View>
          {(() => {
            const raw = trendData[item.key]?.toString()?.split('#') || [];

            // 使用数组插入逻辑
            const newArr = insertArray(raw);

            return newArr.map((count, idx) => {
              const isInserted = isInsertedCell(idx);
              const itemWidth = isInserted
                ? getInsertedCellWidth(idx)
                : cellWidth;

              return (
                <View
                  key={`stat-${item.key}-${idx}`}
                  style={[
                    localStyles.cell,
                    localStyles.statisticsCell,
                    idx >= redLen && localStyles.blueCell,
                    {width: itemWidth},
                  ]}>
                  <Text style={localStyles.statisticsText}>{count}</Text>
                </View>
              );
            });
          })()}
        </View>
      ))}
    </View>
  );
};

export default TrendFooter;

const localStyles = StyleSheet.create({
  rightHeaderContainer: {
    flex: 1,
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
  statisticsRow: {
    backgroundColor: '#f0f8ff',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  statisticsCell: {
    backgroundColor: '#f0f8ff',
  },
  statisticsText: {
    fontSize: FONT_SIZE_HEADER,
    color: '#333',
    fontWeight: 'bold',
  },
});

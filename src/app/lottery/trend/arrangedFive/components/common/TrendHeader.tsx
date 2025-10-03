import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  CELL_WIDTH,
  HEADER_AREA_ROW_HEIGHT,
  HEADER_NUMBER_ROW_HEIGHT,
  FONT_SIZE_AREA_TITLE,
  FONT_SIZE_HEADER,
  PERIOD_COL_WIDTH,
  PERIOD_HEADER_HEIGHT,
} from '../../config/constants';

type SectionConfig = {
  width: number;
  title: string;
  nums: string[];
};

interface TrendHeaderProps {
  sections: SectionConfig[];
}

const TrendHeader: React.FC<TrendHeaderProps> = ({sections}) => {
  console.log(sections, '=========');
  return (
    <View style={styles.headerContainer}>
      {/* 左侧期号单元格（占两行高度） */}
      <View style={styles.periodHeaderCell}>
        <Text style={styles.periodHeaderText}>期号</Text>
      </View>

      <View style={styles.rightHeaderContainer}>
        {/* 区域标题行 */}
        <View style={styles.areaRow} className="flex-row">
          {sections.map((cfg, index) => (
            <View
              key={`${cfg.title}-${index}`}
              style={[styles.areaCell, {width: cfg.width * cfg.nums.length}]}>
              <Text style={styles.areaText}>{cfg.title}</Text>
            </View>
          ))}
        </View>

        {/* 号码行 */}
        <View style={styles.areaRow} className="flex-row">
          {sections.map((cfg, sIndex) => (
            <View
              key={`${cfg.title}-nums-${sIndex}`}
              style={[{flexDirection: 'row'} ]}>
              {cfg.nums.map((num, idx) => (
                <View key={`${cfg.title}-${idx}`} style={[styles.cell,{width: cfg.width}]}>
                  <Text style={styles.headerText}>{num}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default TrendHeader;

const styles = StyleSheet.create({
  rightHeaderContainer: {
    flex: 1,
 
  },
  headerContainer: {
    flexDirection: 'row',
  },
  periodHeaderCell: {
    width: PERIOD_COL_WIDTH,
    height: PERIOD_HEADER_HEIGHT, // 两行的总高度
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f5f5f5',
  },

  periodHeaderText: {
    fontSize: FONT_SIZE_AREA_TITLE,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: HEADER_NUMBER_ROW_HEIGHT,
  },
  areaRow: {
    flexDirection: 'row',
    height: HEADER_AREA_ROW_HEIGHT,
  },
  numberRow: {
    flexDirection: 'row',
    height: HEADER_NUMBER_ROW_HEIGHT,
  },
  areaCell: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f5f5f5',
  },
  areaText: {
    fontSize: FONT_SIZE_AREA_TITLE,
    fontWeight: 'bold',
    color: '#333',
  },
  cell: {
    width: CELL_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: FONT_SIZE_HEADER,
    color: '#666',
  },
});

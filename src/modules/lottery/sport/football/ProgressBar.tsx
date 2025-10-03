import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


const ProgressBar: React.FC<LotteryComponents.ProgressBarProps> = ({value, color, label, isHideValue,leftOrRight='left',style}) => {
  return (
    <View style={[styles.progressBarContainer,style]}>
      {/* 比例条 */}
      <View
        style={[
          styles.progressBar,
          { flexDirection: leftOrRight === 'right' ? 'row' : 'row-reverse' }
        ]}
      >
        {/* 填充部分 */}
        <View
          style={[
            styles.filledSegment,
            {
              flex: value, // 按比例分配宽度
              backgroundColor: color,
            },
          ]}
        />
        {/* 未填充部分 */}
        <View
          style={[
            styles.unfilledSegment,
            {
              flex: 100 - value, // 剩余部分宽度
            },
          ]}
        />
        {/* 居中的文字标签 */}
        <Text style={styles.progressLabel}>{label}</Text>
      </View>
      {/* 比例值 */}
      {isHideValue ? null : <Text style={styles.progressValue}>{value}%</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '33%', // 每行显示3个比例条
    alignItems: 'center',
    // marginBottom: 10, // 每行的间距
  },
  progressBar: {
    flexDirection: 'row',
    height: 12, // 设置足够高度以容纳文字
    width: '100%',
    overflow: 'hidden',
    position: 'relative', // 为了放置文字居中

    
  },
  filledSegment: {
    height: '100%',
  },
  unfilledSegment: {
    height: '100%',
    backgroundColor: '#e0e0e0', // 灰色背景填充未占用部分
  },
  progressLabel: {
    position: 'absolute', // 文字定位到进度条中间
    fontSize: 8,
    color: '#333', // 文字颜色为白色，确保在彩色背景上清晰可见
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%', // 确保文字始终居中
  },
  progressValue: {
    fontSize: 10,
    color: '#333',
  },
});

export default ProgressBar;

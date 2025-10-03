import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { themeRedColor } from 'p138-react-common/utils/styles/color';

interface TermSelectorProps {
  lotteryTermNo: number[];
  selectedLotteryTermNo: number;
  onSelect: (termNo: number) => void;
}

const TermSelector: React.FC<TermSelectorProps> = ({
  lotteryTermNo,
  selectedLotteryTermNo,
  onSelect,
}) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={Platform.OS === 'web' ? styles.webScroll : undefined}
      contentContainerStyle={styles.scrollContent}
    >
      {lotteryTermNo.map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.termItem,
            selectedLotteryTermNo === item && styles.selectedTermItem,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={{ color: selectedLotteryTermNo === item ? 'white' : 'black' }}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    width: '100%',
  },
  webScroll: {
    // 💡 只在 Web 上启用横向滚动
    overflow: 'scroll',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    minWidth: 600, // 🔑 关键点：保证足够宽度才能滚动
  },
  termItem: {
    height: 32,
    minWidth: 80,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  selectedTermItem: {
    backgroundColor: themeRedColor,
  },
});

export default TermSelector;

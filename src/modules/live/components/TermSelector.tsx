import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { themeRedColor } from 'p138-react-common/utils/styles/color';

interface TermSelectorProps {
  lotteryTermNo: number[];
  selectedLotteryTermNo: number;
  onSelect: (termNo: number) => void;
  flatListRef: React.RefObject<FlatList<any>>;
}

const TermSelector: React.FC<TermSelectorProps> = ({ lotteryTermNo, selectedLotteryTermNo, onSelect, flatListRef }) => (
  <View style={{ height: 40,justifyContent:'center',alignItems:'center' }}>
    <FlatList
      ref={flatListRef}
      data={lotteryTermNo}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.termItem,
            selectedLotteryTermNo === item && styles.selectedTermItem,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={{ color: selectedLotteryTermNo === item ? 'white' : 'black' }}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      getItemLayout={(_, index) => ({ length: 50, offset: 50 * index, index })}
    />
  </View>
);

const styles = StyleSheet.create({
  termItem: {
    height: 30,
    width: 80,
    marginTop:5,
    marginLeft: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedTermItem: {
    backgroundColor: themeRedColor,
  },
});

export default TermSelector; 
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useLiveStore} from 'src/store/follow';

interface FilterBarProps {
  filters: string[];
  onFilterPress?: (index: number) => void; // 保留 callback 用于外部需要监听的场景
  style?: StyleProp<ViewStyle>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterPress,
  style,
}) => {
  const {selectedFilterIndex, setSelectedFilterIndex} = useLiveStore();

  const handlePress = (index: number) => {
    setSelectedFilterIndex(index);
    if (onFilterPress) {
      onFilterPress(index); // 外部回调
    }
  };

  return (
    <View style={[styles.container, style]}>
      {filters.map((filter, index) => (
        <View key={index} style={styles.filterItemContainer}>
          <TouchableOpacity onPress={() => handlePress(index)}>
            <Text
              style={[
                styles.filterText,
                selectedFilterIndex === index && styles.activeFilterText,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
          {selectedFilterIndex === index && <View style={styles.activeLine} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },
  filterItemContainer: {
    alignItems: 'center',
    flex: 1,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    paddingVertical: 8,
  },
  activeFilterText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  activeLine: {
    width: '25%',
    height: 2,
    backgroundColor: '#f44336',
    marginTop: 2,
  },
});

export default FilterBar;

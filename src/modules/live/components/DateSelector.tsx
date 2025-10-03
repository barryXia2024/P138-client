import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DateItem {
  date: string;
  dayLabel: string;
  dayOfWeek: string;
  isToday: boolean;
}

interface DateSelectorProps {
  dates: DateItem[];
  selectedDate: string;
  onDateChange: (item: DateItem, index: number) => void;
  todayIndex: number;
  scrollViewRef: React.RefObject<ScrollView>;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dates, selectedDate, onDateChange, todayIndex, scrollViewRef }) => (
  <LinearGradient colors={['#ffcccc', '#ffffff']} style={styles.gradient}>
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      onLayout={() => {
        // 滚动到指定位置
        if (scrollViewRef.current && todayIndex > 4) {
          scrollViewRef.current.scrollTo({
            x: (todayIndex - 3) * 50,
            animated: false
          });
        }
      }}
    >
      {dates.map((item, index) => (
        <TouchableOpacity
          key={item.date}
          style={[styles.dateItem, selectedDate === item.date && styles.selectedDateItem]}
          onPress={() => onDateChange(item, index)}
        >
          <Text style={[styles.dayLabel, selectedDate === item.date && styles.selectedDayLabel]}>
            {item.dayLabel}
          </Text>
          <Text style={[styles.dayOfWeek, selectedDate === item.date && styles.selectedDayOfWeek]}>
            {item.dayOfWeek}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: { height: 40, justifyContent: 'center', marginTop: 10 },
  dateItem: { paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginVertical: 5 },
  selectedDateItem: { backgroundColor: '#ffffff' },
  dayLabel: { fontSize: 12, fontWeight: '500', color: '#333' },
  dayOfWeek: { fontSize: 12, color: '#333' },
  selectedDayLabel: { color: '#ff6347' },
  selectedDayOfWeek: { color: '#ff6347' },
  scrollContainer: {
    // Add any necessary styles for the ScrollView content container
  },
});

export default DateSelector;
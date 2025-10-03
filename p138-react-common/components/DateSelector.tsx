import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
const DateSelector = ({
  range,
  setRange,
  mode = 'date',
}: {
  mode?: 'date' | 'time' | 'datetime' | 'countdown';
  range: DateRange;
  maxDate?: Date;
  setRange: React.Dispatch<React.SetStateAction<DateRange>>;
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onStartDateChange = (_: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setRange(prev => ({...prev, startDate: selectedDate}));
    }
  };

  const onEndDateChange = (_: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setRange(prev => ({...prev, endDate: selectedDate}));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (Platform.OS === 'web') {
    const startRef = useRef<HTMLInputElement | null>(null);
    const endRef = useRef<HTMLInputElement | null>(null);

    const openStartPicker = () => {
      if (showStartPicker) {
        // 已经打开则关闭
        startRef.current?.blur?.();
        setShowStartPicker(false);
        return;
      }
      // 打开开始日期选择器并关闭结束选择器
      endRef.current?.blur?.();
      setShowEndPicker(false);
      startRef.current?.showPicker?.();
      setShowStartPicker(true);
    };
    const openEndPicker = () => {
      if (showEndPicker) {
        endRef.current?.blur?.();
        setShowEndPicker(false);
        return;
      }
      startRef.current?.blur?.();
      setShowStartPicker(false);
      endRef.current?.showPicker?.();
      setShowEndPicker(true);
    };

    return (
      <View style={styles.dateSelector}>
        <input
          ref={startRef as any}
          type="date"
          value={dayjs(range.startDate).format('YYYY-MM-DD')}
          onChange={e => {
            const date =  dayjs(e.target.value).toDate();
            setRange(prev => ({...prev, startDate: date}));
          }}
          onClick={openStartPicker}
          max={dayjs(range.endDate).format('YYYY-MM-DD')}
          style={styles.webDateInput as any}
        />
        <Text style={styles.separator}>—</Text>
        <input
          ref={endRef as any}
          type="date"
          value={dayjs(range.endDate).format('YYYY-MM-DD')}
          onChange={e => {
            const date = dayjs(e.target.value).toDate();
            setRange(prev => ({...prev, endDate: date}));
          }}
          onClick={openEndPicker}
          min={dayjs(range.startDate).format('YYYY-MM-DD')}
          // max={maxDate?.toISOString().split("T")[0]}
          style={styles.webDateInput as any}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>{formatDate(range.startDate)}</Text>
        </TouchableOpacity>

        <Text style={styles.separator}>—</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>{formatDate(range.endDate)}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={range.startDate}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartDateChange}
          maximumDate={range.endDate}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={range.endDate}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndDateChange}
          minimumDate={range.startDate}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  dateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 14,
  },
  separator: {
    color: '#9E9E9E',
    fontSize: 16,
  },

  webDateInput: Platform.select({
    web: {
      backgroundColor: '#42A5F5',
      color: 'white',
      padding: 8,
      borderRadius: 8,
      border: 'none',
      fontSize: 14,
      minWidth: 120,
      textAlign: 'center',
    },
    default: {},
  }),
});

export default DateSelector;


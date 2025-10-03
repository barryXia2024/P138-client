
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Animated, StyleProp, ViewStyle } from 'react-native';
type TabItem = {
    name: string;
    value: string | number;
  }
  
  type ActiveTabProps<T extends string | number> = {
    activeList: TabItem[];
    value?: T;
    onChange: (value: T) => void;
    height?: number;
    style?: StyleProp<ViewStyle>;
  }
  
  const ActiveTab = <T extends string | number>(props: ActiveTabProps<T>) => {
    const { activeList, value, onChange, height = 36 } = props;
    const borderRadius = height / 2;
  
    const getInitialIndex = () => {
      if (value === undefined) return 0;
      const index = activeList.findIndex(item => item.value === value);
      return index >= 0 ? index : 0;
    };
  
    const [activeIndex, setActiveIndex] = useState(getInitialIndex());
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const containerWidth = React.useRef(0);
  
    const updateSlidePosition = (index: number) => {
      if (containerWidth.current) {
        const slideWidth = containerWidth.current / activeList.length;
        Animated.spring(slideAnim, {
          toValue: index * slideWidth,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }).start();
      }
    };
  
    useEffect(() => {
      const newIndex = getInitialIndex();
      setActiveIndex(newIndex);
      updateSlidePosition(newIndex);
    }, [value, activeList]);
  
    const handlePress = (idx: number) => {
      setActiveIndex(idx);
      updateSlidePosition(idx);
      onChange(activeList[idx].value as T);
    };
  
    const onLayout = (event: any) => {
      const { width } = event.nativeEvent.layout;
      containerWidth.current = width;
      updateSlidePosition(activeIndex);
    };
  
    return (
      <View
        onLayout={onLayout}
        style={[{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#f5f5f5',
          borderRadius,
          height,
          position: 'relative',
          marginHorizontal: 8,
          marginVertical: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        },props.style]}
      >
       
        {activeList.map((row, idx) => (
          <TouchableOpacity
            key={`${row.name}-${idx}`}
            onPress={() => handlePress(idx)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:activeIndex === idx ? '#f04b49' : '#f5f5f5',
              zIndex: 1,
              borderRadius,
              height: '100%'
            }}
          >
            <Text style={{
              color: activeIndex === idx ? '#fff' : '#666',
              textAlign: 'center',
              fontSize: Math.max(12, height * 0.35),
              fontWeight: activeIndex === idx ? '600' : '400',
              lineHeight: height
            }}>
              {row.name}
            </Text>
          </TouchableOpacity>
        ))}

      </View>
    );
  };
  export default ActiveTab;
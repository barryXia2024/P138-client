import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';




  
  const PickBox: React.FC<CompetitionProps.PickBoxProps> = (props) => {
    const { isHiddenGreen = false } = props;
  
    return (
      <View style={{
        // width: pickWidth,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* 左侧红色长方形 */}
        <View style={{
          // width: pickWidth,
          flex: 5,
          borderTopColor: '#f04b49',
          borderTopWidth: 25,
  
          borderRightWidth: 10,
          borderRightColor: 'transparent',
        }} />
        {!isHiddenGreen && <View style={{
          // width: pickWidth,
          flex: 0.5,
  
          borderBottomColor: '#4c95e4',
          borderBottomWidth: 25,
          borderLeftWidth: 10,
          borderLeftColor: 'transparent',
  
        }} />}
       {!isHiddenGreen && <View style={{
          // width: pickWidth,
          flex: 0.5,
          borderTopColor: '#4c95e4',
          borderTopWidth: 25,
  
          borderRightWidth: 10,
          borderRightColor: 'transparent',
        }} />}
  
  
        {/* 右侧绿色长方形 */}
        <View style={{
          // width: pickWidth,
          flex: 1,
          borderBottomColor:isHiddenGreen ? '#4c95e4' : '#0ea936',
          borderBottomWidth: 25,
          borderLeftWidth: 10,
          borderLeftColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: '#eee'
  
        }} />
      </View>
    );
  };

  export default PickBox;
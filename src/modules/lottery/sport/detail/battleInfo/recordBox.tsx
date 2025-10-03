import React  from 'react';
import { View, Text } from 'react-native';


  
  const RecordBox: React.FC<CompetitionProps.RecordBoxProps> = ({ homeWin, draw, awayWin }) => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 4
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#e55',
            fontSize: 14,
            fontWeight: '500'
          }}>
            主胜{homeWin}场
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            color: '#4c95e4',
            fontSize: 14,
            fontWeight: '500'
          }}>
            平局{draw}场
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{
            color: '#189d18',
            fontSize: 14,
            fontWeight: '500'
          }}>
            客胜{awayWin}场
          </Text>
        </View>
      </View>
    );
  };
  export default RecordBox;
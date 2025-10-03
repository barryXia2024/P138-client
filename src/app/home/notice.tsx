import React  from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,

} from 'react-native';

import AppHeader from '@/p138-react-common/components/AppHeader';
import { useLocalSearchParams } from 'expo-router';

import Html from 'p138-react-common/components/html';


const Notice = () => {
  const { item } = useLocalSearchParams();
  const itemData = JSON.parse(item as string);
  const { width, height } = useWindowDimensions();


  return (
    <View  style={styles.container}>
      <AppHeader title='公告' />
      <View style={styles.container}>
        {/* 背景图 */}
    
        <View
          style={[styles.scroll, { left: 0.05 * width, width: width * 0.9, height: height * 0.8 }]}>
          <Html html={itemData} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
  },
  scroll: {
    position: 'absolute',
    top: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
 
});

export default Notice;

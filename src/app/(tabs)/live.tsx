import React, {  useState } from 'react';
import {
  View,
} from 'react-native';


import AnchorList from 'src/app/live/ancre';
import VideoList from 'src/app/live/video';
import TopTab from '../follow/components/topTab';

const LiveScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);


  return (
    <View className='flex-1'>
      <TopTab
        tabs={["主播解说", "视频直播"]}
        style={{backgroundColor: 'rgb(240, 75, 73)',height:44,  }}
        onTabPress={(index) => setSelectedTab(index)}
       
        tabStyle={{backgroundColor: 'rgb(240, 75, 73)' ,height:24 ,justifyContent:'center',alignItems:'center'}}
        activeTabStyle={{backgroundColor: 'white',justifyContent:'center',height:24,alignItems:'center'}}
        activeTabTextStyle={{color: 'rgb(240, 75, 73)'  }}
        tabTextStyle={{color: 'white',justifyContent:'center'}}
      />
      {selectedTab === 0 && <AnchorList />}
      {selectedTab === 1 && <VideoList />}

    </View>
  );
};


export default LiveScreen;

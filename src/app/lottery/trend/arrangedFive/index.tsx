import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import BasicTrend from './components/basic';
import BigSmallTrend from './components/bigSmall';
import OddEvenTrend from './components/OddEvenTrend';
import SumTrend from './components/SumTrend';
import ConsecutiveTrend from './components/ConsecutiveTrend';
import {listTrend} from 'src/api/interface/lottery-lottery-type-trend';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

 
 

const ArrangedThree = () => {
  const [selectedTab, setSelectedTab] = useState('1');
  const [periods] = useState('30');
  const [trendData, setTrendData] = useState<CoreLotteryTrend.Trend>();
  const renderDict: Record<string, React.FC<{trendData: CoreLotteryTrend.Trend}>>= {
    1: BasicTrend,
    2: BigSmallTrend,
    3: OddEvenTrend,
    4: SumTrend,
    5: ConsecutiveTrend,
  };

  useEffect(() => {
  
    listTrend({
      lotteryName: LotteryName.ArrangedFive,
      trendType: Number(selectedTab) as CoreLotteryTrend.TrendType,
    }).then(res => {
      console.log(res);
      if (res.success) {
        setTrendData(res.data?.[0]);
      }
    });
  }, [selectedTab]);

  return (
    <View style={styles.pageContainer}>
      <AppHeader title="排列五走势" />

      <View style={styles.tabContainer}>
        <TabSwitcher
          className="bg-white flex-1"
          tabs={[
            {
              label: '基本走势',
              key: '1',
            },
            {
              label: '大小走势',
              key: '2',
            },
            {
              label: '奇偶走势',
              key: '3',
            },
            {
              label: '和值走势',
              key: '4',
            },
            {
              label: '连号走势',
              key: '5',
            },
          ]}
          activeTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      </View>

      {trendData &&
        renderDict[selectedTab]({
          trendData: trendData,
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default ArrangedThree;

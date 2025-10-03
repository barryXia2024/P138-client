import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {kScreenHeight} from '@/p138-react-common/utils/styles';
import {listRedTicket} from 'src/api/interface/red-ticket';
import {LinearGradient} from 'expo-linear-gradient';
import {FlatList} from '@/p138-react-common/components/FlatList';
import RedTicketFilterModal from './components/redTicketFilterModal';

const matchCount = ['50场', '100场', '150场', '200场', '250场', '300场'];
const spf = ['主胜', '平局', '主负'];
const rq = ['让胜', '让平', '让负'];
const bqc = [
  '胜胜',
  '胜平',
  '胜负',
  '平胜',
  '平平',
  '平负',
  '负胜',
  '负平',
  '负负',
];
const zjq = ['0球', '1球', '2球', '3球', '4球', '5球', '6球', '7+球'];
const bf = [
  '1:0',
  '2:0',
  '2:1',
  '3:0',
  '3:1',
  '3:2',
  '4:0',
  '4:1',
  '4:2',
  '5:0',
  '5:1',
  '5:2',
  '0:0',
  '1:1',
  '2:2',
  '3:3',
  '0:1',
  '0:2',
  '0:3',
  '1:2',
  '1:3',
  '2:3',
  '0:4',
  '1:4',
  '2:4',
  '0:5',
  '1:5',
  '2:5',
  '胜其他',
  '平其他',
  '负其他',
];
const events = [
  '001',
  '002',
  '003',
  '004',
  '005',
  '006',
  '007',
  '008',
  '009',
  '010',
  '011',
  '012',
  '013',
  '014',
  '015',
  '016',
  '017',
  '018',
  '019',
  '020',
];
const ls = [
  'K1联赛',
  '俄超',
  '德甲',
  '英超',
  '西甲',
  '意甲',
  '法甲',
  '荷甲',
  '葡超',
  '比甲',
  '丹超',
  '挪超',
  '瑞典超',
  '瑞士超',
  '奥甲',
  '希腊超',
];

const filterConfig = {
  scheme: [
    {label: '按赛事编号', key: 'events', type: 'single', list: events},
    {label: '按联赛', key: 'league', type: 'single', list: ls},
  ],
  type: [
    {label: '胜平负', key: 'spf', type: 'multi', list: spf},
    {label: '让球胜平负', key: 'rq', type: 'multi', list: rq},
    {label: '半全场', key: 'bqc', type: 'multi', list: bqc},
    {label: '总进球', key: 'zjq', type: 'multi', list: zjq},
    {label: '比分', key: 'bf', type: 'multi', list: bf},
  ],
  count: [{label: '', key: 'sessions', type: 'single', list: matchCount}],
};

export default function RedOrderReviewPage() {
   
  const [filterValues, setFilterValues] = useState<any>({
    events: '001',
    spf: ['主胜'],
    sessions: '50场',
  });

  const [redTicketResult, setRedTicketResult] =
    useState<CustomerRedTicket.ListRedTicketResult>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilterKey, setCurrentFilterKey] = useState<
    'scheme' | 'type' | 'count'
  >('scheme');
  const [currentDataSource, setCurrentDataSource] = useState<any[]>([]);

  // 打开弹窗
  const openModal = (filterKey: 'scheme' | 'type' | 'count') => {
    setCurrentDataSource(filterConfig[filterKey]);
    setCurrentFilterKey(filterKey);
    setModalVisible(true);
  };
 
  const applyFilter = (newValues: any) => {
    setFilterValues({...filterValues, ...newValues});
    setModalVisible(false);
  };

  useEffect(() => {
  
    console.log(filterValues.sessions ,'filterValues.sessions');
    listRedTicket({
      ...filterValues,
      sessions: Number(filterValues.sessions?.replace('场', '')) || 50,  
    }).then(res => {
      setRedTicketResult(res.data);
    });
  }, [filterValues]);

  const renderHeader = () => (
    <View className="flex-row bg-gray-100 py-2">
      <Text className="flex-1 text-center text-xs font-bold">日期/编号</Text>
      <Text className="flex-1 text-center text-xs font-bold">对阵</Text>
      <Text className="w-10 text-center text-xs font-bold">预测</Text>
      <Text className="w-10 text-center text-xs font-bold">百元</Text>
      <Text className="w-10 text-center text-xs font-bold">结果</Text>
    </View>
  );

  const renderItem = ({item}: {item: CustomerRedTicket.Class3}) => {
    const isRed = item.result === '红';
    return (
      <View
        className="flex-row py-1 border-b border-gray-100"
        style={{backgroundColor: isRed ? 'red' : ''}}>
        <Text
          className="flex-1 text-center text-xs text-gray-800"
          style={{color: isRed ? '#fff' : 'black'}}>
          {item.serialNumber}
        </Text>
        <Text
          className="flex-1 text-center text-xs text-gray-800"
          style={{color: isRed ? '#fff' : 'black'}}>
          {item.matchup}
        </Text>
        <Text
          className="w-10 text-center text-xs "
          style={{color: isRed ? '#fff' : 'black'}}>
          {item.predict}
        </Text>
        <Text
          className="w-10 text-center text-xs text-gray-800"
          style={{color: isRed ? '#fff' : 'black'}}>
          {item.sp}
        </Text>
        <Text
          className="w-10 text-center text-xs "
          style={{color: isRed ? '#fff' : 'black'}}>
          {item.result}
        </Text>
      </View>
    );
  };

  // 玩法相关的key
  const playKeys = ['spf', 'rq', 'bqc', 'zjq', 'bf'];

  // 获取所有已选玩法
  const selectedPlays = playKeys
    .map(key => filterValues[key])
    .filter(Boolean) // 过滤undefined
    .flat() // 合并为一个数组
    .filter(Boolean); // 过滤空字符串

  // 拼接显示
  const playLabel = selectedPlays.length > 0 ? selectedPlays.join('/') : '类型';

  console.log(redTicketResult?.data.list ,'redTicketResult?.data.list');
  return (
    <ImageBackground
      source={require('src/assets/imgs/mine/bg_red_order.webp')}
      style={{width: '100%', height: kScreenHeight, flex: 1}}
      resizeMode="stretch">
      <AppHeader title="" style={{backgroundColor: 'transparent'}} />
      {/* 筛选条件 */}
      <View
        className="flex-row p-2 bg-white justify-around border-b border-gray-200 gap-2 "
        style={{marginTop: 130}}>
        <TouchableOpacity
          className="bg-red-500 rounded px-3 py-1 justify-center items-center"
          style={{width: 80}}
          onPress={() => openModal('scheme')}>
          <Text className="text-white">{filterValues.events || '赛事'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 rounded px-3 py-1 flex-1 justify-center items-center"
          onPress={() => openModal('type')}>
          <Text className="text-white">{playLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: 80}}
          className="bg-red-500 rounded px-3 py-1 justify-center items-center"
          onPress={() => openModal('count')}>
          <Text className="text-white">{filterValues.sessions}</Text>
        </TouchableOpacity>
      </View>

      {/* 三个 label 区域 */}
      <View className="flex-row flex-wrap py-2 gap-2 bg-white justify-center items-center">
        <LinearGradient
          colors={['#ffcccc', '#ffffff']}
          style={{
            width: '40%',
            borderRadius: 10,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-xs  ">
            历史最大遗憾:{' '}
            <Text className="text-red-500 font-bold">
              {redTicketResult?.data.maxBlack}
            </Text>
            期
          </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#ffcccc', '#ffffff']}
          style={{
            width: '40%',
            borderRadius: 10,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-xs  ">
            历史最大连红:{' '}
            <Text className="text-red-500 font-bold">
              {redTicketResult?.data.maxRed}
            </Text>
            期
          </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#ffcccc', '#ffffff']}
          style={{
            width: '40%',
            borderRadius: 10,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-xs  ">
            近{filterValues?.sessions?.replace('场', '')}期中率:{' '}
            <Text className="text-red-500 font-bold">
              {redTicketResult?.data.odds}%
            </Text>
          </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#ffcccc', '#ffffff']}
          style={{
            width: '40%',
            borderRadius: 10,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-xs  ">
            近{filterValues?.sessions?.replace('场', '')}期盈利率:{' '}
            <Text className="text-red-500 font-bold">
              {redTicketResult?.data.rate}
            </Text>
          </Text>
        </LinearGradient>
      </View>

      {renderHeader()}

      <FlatList
        data={redTicketResult?.data.list || []}
        renderItem={renderItem}
        keyExtractor={item => item.serialNumber}
    
        className="flex-1 bg-white"
        style={{
          flex: 1,
    
        }}
      />

      <RedTicketFilterModal
        filterKey={currentFilterKey}
        isVisible={modalVisible}
        onPress={applyFilter}
        dataSouce={currentDataSource}
        initialValue={filterValues}
      />
    </ImageBackground>
  );
}

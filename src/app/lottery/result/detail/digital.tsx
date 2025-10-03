import React, {useEffect, useState} from 'react';
import {Image, View, Text, Platform, TouchableOpacity} from 'react-native';

import {kScreenWidth} from '@/p138-react-common/utils/styles';
import {FlatList} from '@/p138-react-common/components/FlatList';
import {
  listDigitalDrawAnnouncement,
  listDigitalDrawAnnouncementByLotteryName,
} from 'src/api/interface/lottery-lottery-type-draw';
import DigitalBalls from '../components/DigitalBalls';
import {useLocalSearchParams} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import LotteryPrizeTableBlock from '../components/LotteryPrizeTableBlock';
import {parseLotteryResult} from '../utils';
import {ArrowIcon} from '@/p138-react-common/components';

const ResultItem = ({
  item,
}: {
  item: LotteryDrawAnnoumcememt.DigitalDrawAnnouncement;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View className="bg-white m-2 p-2 rounded-lg">
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setIsOpen(!isOpen);
        }}>
        <View className="flex-row justify-between w-full">
          <View className="flex-row flex-wrap  flex-1 items-center gap-2">
            <Text className="text-lg">
              {item.termNo}期{' '}
              <Text className="text-sm text-gray-500">
                {' '}
                {item.digitalDrawDetail.openDate}
              </Text>
            </Text>
          </View>
          <ArrowIcon isTap={!isOpen} />
        </View>

        <View>
          <DigitalBalls
            balls={parseLotteryResult(item.digitalDrawDetail.result)}
            disabled
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <LotteryPrizeTableBlock
          prizeList={item.digitalDrawDetail.vos}
          salesAmount={item.digitalDrawDetail.saleAmount}
          jackpotAmount={item.digitalDrawDetail.poolBonus}
        />
      )}
    </View>
  );
};

const DigitalLotteryResult: React.FC = () => {
  const {lotteryName, termNo, lotteryChineseName} = useLocalSearchParams<{
    lotteryName: CoreCommonEnum.LotteryName;
    termNo: string;
    lotteryChineseName: CoreCommonEnum.LotteryChineseName;
  }>();

  const [data, setData] =
    useState<LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementByLotteryNameCommandResult>();
  const [params, setParams] =
    useState<LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementByLotteryNameCommand>(
      {
        lotteryName: lotteryName,
        termNo: termNo,
      },
    );

  const getList = async () => {
    listDigitalDrawAnnouncementByLotteryName(params, {
      current: params.current,
      pageSize: params.pageSize,
      sort: params.sort,
      direction: params.direction,
    }).then(res => {
      if (res.success) {
        if (params.current === 1) {
          setData(res.data);
        } else {
          let list = data?.list || [];
          let total = data?.total || 0;
          let newList = res.data?.list || [];
          let newTotal = res.data?.total || 0;
          setData({
            ...data,
            list: [...list, ...newList],
            total: total + newTotal,
            query: {...res.data?.query, current: params.current},
          });
        }
      }
    });
  };

  useEffect(() => {
    getList();
  }, [params]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <AppHeader title={lotteryChineseName} />

      <FlatList
        data={data?.list || []}
        style={{flex: 1}}
        onRefresh={async () => {
          setParams({...params, current: 1});
          await getList();
        }}
        hasMore={(data?.list?.length || 0) < (data?.total || 0)}
        onLoadMore={async () => {
          setParams({...params, current: (params.current || 1) + 1});
          await getList();
        }}
        renderItem={({item}) => <ResultItem item={item} />}
      />
    </View>
  );
};

export default DigitalLotteryResult;

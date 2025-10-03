
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {
  listFans,
  listFollowers,
  follow,
  unfollow,
} from 'src/api/interface/orders-follow-hall-fan-follow';
import {DEFAULT_IMAGE} from '@/config/env';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router, useLocalSearchParams} from 'expo-router';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {useUserStore} from 'src/store';
import {FlatList} from '@/p138-react-common/components/FlatList';
import TabSwitch from 'src/modules/follow/components/TabSwitch';
import {
  defaultTabStyle,
  defaultTabSwitchStyle,
} from 'src/modules/follow/constants';
import {
  ConsecutiveWinsItem,
  TodayFd,
} from '../components/followItem/consecutiveWins';

const FansPage = () => {
  const {activeTab = 'follow'} = useLocalSearchParams<{
    activeTab: string;
  }>();
  const [tab, setTab] = useState<'fans' | 'follow'>(
    activeTab as 'fans' | 'follow',
  );
  const [list, setList] = useState<HallFanFollow.CustomerInfo[]>([]);
  const {userID, shopCode} = useLocalSearchParams<{
    userID: string;
    shopCode: string;
  }>();
  const loginInfo = useUserStore(state => state.loginInfo);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<HallFanFollow.ListFansCommandQuery>({
    current: 1,
    pageSize: 50,
    userID: userID as string,
  });

  useEffect(() => {
    fetchList();
  }, [tab, params]);

  const fetchList = async () => {
    setLoading(true);
    try {
      let res;
      if (tab === 'fans') {
        res = await listFans(params);
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      } else {
        res = await listFollowers(params);
        setList(res.data?.list || []);
        setTotal(res.data?.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (item: HallFanFollow.CustomerInfo) => {
    if (item.isFollow) {
      await unfollow({followeeID: item.userID, followerID: loginInfo.userID});
    } else {
      await follow({followeeID: item.userID, followerID: loginInfo.userID});
    }
    fetchList();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <AppHeader title="关注/粉丝列表" />
      {/* tab切换 */}
      <TabSwitch
        activeTab={tab}
        onTabChange={(tab: string | number) => setTab(tab as 'fans' | 'follow')}
        tabs={[
          {key: 'follow', label: '关注'},
          {key: 'fans', label: '粉丝'},
        ]}
        style={defaultTabSwitchStyle}
        tabStyle={defaultTabStyle}
        activeTabStyle={{backgroundColor: '#F44336'}}
        textStyle={{fontSize: 16, color: '#F44336', fontWeight: '500'}}
        activeTextStyle={{color: '#fff', fontWeight: '600'}}
      />
      {/* 人数统计 */}
      <View
        className="flex-row items-center bg-red-300 p-1 pl-2"
        style={{backgroundColor: 'rgb(255, 236, 236)'}}>
        <Text className="text-red-500 text-sm">
          {tab === 'fans' ? '粉丝人数' : '关注人数'}：{total}个
        </Text>
      </View>
      {/* 用户列表 */}
      <FlatList
        data={list}
        keyExtractor={item => item.userID}
        renderItem={({item}) => (
          <View style={styles.userItem}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/follow/user',
                  params: {userId: item.userID, shopCode: item.shopCode},
                })
              }>
              <OSSImage
                source={item.avatar ? {uri: item.avatar} : {uri: DEFAULT_IMAGE}}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View className="flex-1">
              <View>
                <Text style={styles.nickname}>{item.nickname}</Text>
              </View>
              {tab === 'follow' && (
                <View className="flex-row items-center">
                  <ConsecutiveWinsItem consecutiveWins={item.winCount} />
                  <TodayFd todayFd={item.todayFd} />
                </View>
              )}
            </View>

            <View style={{flex: 1}} />
            <TouchableOpacity
              style={item.isFollow ? styles.followedBtn : styles.followBtn}
              onPress={() => handleFollow(item)}>
              <Text
                style={item.isFollow ? styles.followedText : styles.followText}>
                {item.isFollow ? '已关注' : '+关注'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={loading}
        onRefresh={fetchList}
        hasMore={list.length < total}
        onLoadMore={async () => {
          if (list.length < total) {
            setParams({...params, current: (params.current ?? 1) + 1});
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  nickname: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
  },
  followBtn: {
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  followText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
  },
  followedBtn: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  followedText: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginLeft: 76,
  },
});

export default FansPage;

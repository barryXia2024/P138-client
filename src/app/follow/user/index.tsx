import AppHeader from '@/p138-react-common/components/AppHeader';
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FlatList} from '@/p138-react-common/components/FlatList';
import {
  getUserPostsOrderList,
  myTrackingOrder,
  myTrackingOrderPlan,
  trackAchievements,
} from 'src/api/interface/orders-follow-hall';
import {useUserStore} from 'src/store';
import UserFollowInfoHeader from 'src/modules/follow/components/UserFollowInfoHeader';
import RecentWinStatus from 'src/modules/follow/components/RecentWinStatus';
import TabSwitch from 'src/modules/follow/components/TabSwitch';
import OrderListItem from 'src/modules/follow/components/OrderListItem';
import {themeRedColor} from '@/p138-react-common/utils/styles/color';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import {
  getCustomerAutoFollowSubscribeApi,
  unsubscribeFollowApi,
} from 'src/api/interface/orders-follow-hall-follow-subscribe';

const UserFollowInfoDetail = () => {
  const {userId, shopCode} = useLocalSearchParams();
  const {loginInfo, shopInfo} = useUserStore();

  // 判断是否是查看自己的信息
  const isMine = !userId || userId === loginInfo?.userID;
  const targetUserId = isMine ? loginInfo?.userID : (userId as string);
  const targetShopCode = isMine ? Number(shopInfo?.shopCode) : Number(shopCode);

  const [trackAchievementsResult, setTrackAchievementsResult] =
    useState<CommonFollowHall.GetTrackAchievementsResult>();
  const [tab, setTab] = useState<FollowCommon.TabType>('follow');
  const [customerAutoFollowSubscribe, setCustomerAutoFollowSubscribe] =
    useState<HallFollowSubscribe.CustomerAutoFollowSubscribeInfo>();
  // 我的跟单
  const [followList, setFollowList] = useState<any[]>([]);
  const [followParams, setFollowParams] = useState({current: 1, pageSize: 10});
  const [followTotal, setFollowTotal] = useState(0);
  // 我的方案
  const [planList, setPlanList] = useState<any[]>([]);
  const [planParams, setPlanParams] = useState({current: 1, pageSize: 10});
  const [planTotal, setPlanTotal] = useState(0);
  // 别人的帖子
  const [postList, setPostList] = useState<any[]>([]);
  const [postParams, setPostParams] = useState({current: 1, pageSize: 10});
  const [postTotal, setPostTotal] = useState(0);

  // Tab切换
  const handleMainTabChange = useCallback((value: string | number) => {
    setTab(value as FollowCommon.TabType);
  }, []);

  // 获取跟单列表
  const fetchFollowList = useCallback(
    async (isLoadMore = false) => {
      const res = await myTrackingOrder({
        userID: loginInfo?.userID,
        shopCode: Number(shopInfo?.shopCode),
        current: followParams.current,
        pageSize: followParams.pageSize,
      });
      if (res.data && Array.isArray(res.data.list)) {
        setFollowTotal(res.data.total || 0);
        setFollowList(
          isLoadMore
            ? prev => [...prev, ...(res.data.list || [])]
            : res.data.list || [],
        );
      } else if (!isLoadMore) {
        setFollowList([]);
        setFollowTotal(0);
      }
    },
    [loginInfo?.userID, shopInfo?.shopCode, followParams],
  );

  // 获取方案列表
  const fetchPlanList = useCallback(
    async (isLoadMore = false) => {
      const res = await myTrackingOrderPlan({
        userID: loginInfo?.userID,
        shopCode: Number(shopInfo?.shopCode),
        current: planParams.current,
        pageSize: planParams.pageSize,
      });
      if (res.data && Array.isArray(res.data.list)) {
        setPlanTotal(res.data.total || 0);
        setPlanList(
          isLoadMore
            ? prev => [...prev, ...(res.data.list || [])]
            : res.data.list || [],
        );
      } else if (!isLoadMore) {
        setPlanList([]);
        setPlanTotal(0);
      }
    },
    [loginInfo?.userID, shopInfo?.shopCode, planParams],
  );

  // 获取别人的帖子
  const fetchPostList = useCallback(
    async (isLoadMore = false) => {
      const res = await getUserPostsOrderList({
        shopCode: Number(shopCode),
        userID: userId as string,
        current: postParams.current,
        pageSize: postParams.pageSize,
      });
      if (res.data && Array.isArray(res.data.list)) {
        setPostTotal(res.data.total || 0);
        setPostList(
          isLoadMore
            ? prev => [...prev, ...(res.data.list || [])]
            : res.data.list || [],
        );
      } else if (!isLoadMore) {
        setPostList([]);
        setPostTotal(0);
      }
    },
    [shopCode, userId, postParams],
  );
  const subscribeFollow = () => {
    getCustomerAutoFollowSubscribeApi({
      subscriberUserID: loginInfo?.userID,
      subscribedUserID: targetUserId,
    }).then(res => {
      setCustomerAutoFollowSubscribe(res.data);
    });
  };

  // 获取用户战绩
  useEffect(() => {
    trackAchievements({
      shopCode: targetShopCode,
      userID: targetUserId,
    }).then(res => {
      setTrackAchievementsResult(res.data);
    });

    
  }, [targetUserId, targetShopCode]);
  useFocusEffect(useCallback(()=>{
    subscribeFollow()
  },[]))

  // 我的跟单分页监听
  useEffect(() => {
    if (isMine && tab === 'follow') {
      fetchFollowList(followParams.current > 1);
    }
  }, [isMine, tab, followParams.current]);

  // 我的方案分页监听
  useEffect(() => {
    if (isMine && tab === 'plan') {
      fetchPlanList(planParams.current > 1);
    }
  }, [isMine, tab, planParams.current]);

  // 别人的帖子分页监听
  useEffect(() => {
    if (!isMine) {
      fetchPostList(postParams.current > 1);
    }
  }, [isMine, postParams.current]);

  // Tab切换时重置分页参数
  useEffect(() => {
    if (isMine) {
      if (tab === 'follow') {
        setFollowParams({current: 1, pageSize: 10});
      } else {
        setPlanParams({current: 1, pageSize: 10});
      }
    }
  }, [tab, isMine]);

  // 刷新
  const handleRefresh = async () => {
    if (isMine) {
      if (tab === 'follow') {
        setFollowParams(prev => ({...prev, current: 1}));
      } else {
        setPlanParams(prev => ({...prev, current: 1}));
      }
    } else {
      setPostParams(prev => ({...prev, current: 1}));
    }
  };

  // 加载更多
  const handleLoadMore = async () => {
    console.log('handleLoadMore', isMine, tab);
    if (isMine) {
      if (tab === 'follow') {
        setFollowParams(prev => ({...prev, current: prev.current + 1}));
      } else {
        setPlanParams(prev => ({...prev, current: prev.current + 1}));
      }
    } else {
      setPostParams(prev => ({...prev, current: prev.current + 1}));
    }
  };

  // 当前列表和总数
  const currentList = isMine
    ? tab === 'follow'
      ? followList
      : planList
    : postList;
  const currentTotal = isMine
    ? tab === 'follow'
      ? followTotal
      : planTotal
    : postTotal;

  

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      <AppHeader
        title={trackAchievementsResult?.nickname}
        rightComponent={
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => router.push('/follow/user/share')}>
            <OSSImage
              source={require('src/assets/imgs/follow/icon_share.png')}
              style={IMAGE_SIZE.IMAGE_SIZE30}
            />
          </TouchableOpacity>
        }
      />
      <View className="flex-1 h-full bg-[#f0f0f0]">
        <View className="flex-1">
          <UserFollowInfoHeader
            trackAchievementsResult={trackAchievementsResult}
            variant={isMine ? 'mine' : 'other'}
          />

          <RecentWinStatus
            latestWinStatus={trackAchievementsResult?.latestWinStatus
              ?.split(',')
              .map(item => item === 'true')}
            isMine={isMine}
          />

          <View className="bg-white flex-1 mx-2 mt-2">
            {isMine && (
              <TabSwitch
                activeTab={tab}
                onTabChange={handleMainTabChange}
                tabs={[
                  {key: 'follow', label: '我的跟单'},
                  {key: 'plan', label: '我的方案'},
                ]}
                style={styles.subTabContainer}
                tabStyle={styles.subTab}
                activeTabStyle={styles.subTabActive}
                textStyle={styles.subTabText}
                activeTextStyle={styles.subTabTextActive}
              />
            )}

            <FlatList
              style={styles.list}
              data={currentList}
              onRefresh={handleRefresh}
              hasMore={currentList.length < currentTotal}
              onLoadMore={handleLoadMore}
              ListFooterComponent={<View className="h-[100px]" />}
              renderItem={({item}) => (
                <OrderListItem
                  item={item}
                  tabIndex={tab}
                  isMine={isMine}
                  onPress={() => {
                    if (isMine) {
                      if (tab === 'follow') {
                        router.push({
                          pathname: '/order/bet/detail',
                          params: {orderId: item.orderID},
                        });
                      } else {
                        router.push(`/follow/betInfo/${item.orderNo}`);
                      }
                    } else {
                      router.push(`/follow/betInfo/${item.orderNo}`);
                    }
                  }}
                />
              )}
              keyExtractor={item => item.orderNo}
            />
          </View>
        </View>

        {!isMine && (
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={styles.autoFollowButton}
              onPress={() => {
                if (customerAutoFollowSubscribe?.status === 2) {
                  unsubscribeFollowApi({
                    subscriberUserID: loginInfo?.userID,
                    subscribedUserID: targetUserId,
                  }).then(res => {
                    if(res.success){
                      Toast.show('取消订阅成功')
                    }
                    subscribeFollow()
                  });
                } else {
                  router.push({
                    pathname: '/follow/followAmountSection',
                    params: {
                      targetUserId: targetUserId,
                      targetShopCode: targetShopCode,
                    },
                  });
                }
              }}
              activeOpacity={0.8}>
              <Text style={styles.autoFollowButtonText}>
                {customerAutoFollowSubscribe?.status === 2
                  ? '取消订阅'
                  : '自动跟单'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 8,
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  autoFollowButton: {
    backgroundColor: themeRedColor,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  autoFollowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 40,
    marginHorizontal: 28,
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: themeRedColor,
  },
  subTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  subTabActive: {
    backgroundColor: themeRedColor,
  },
  subTabText: {
    fontSize: 14,
    color: themeRedColor,
    fontWeight: '400',
  },
  subTabTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default UserFollowInfoDetail;

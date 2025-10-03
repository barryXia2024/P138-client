import {useCallback, useState} from 'react';
import {getOrderTrackHall, getFollowLotteryList} from '../models/FollowModel';
import {useUserStore} from 'src/store';
import {router} from 'expo-router';

/**
 * Follow 模块的状态接口
 */
interface FollowState {
  loading: boolean;
  error: string | null;
  isModalVisible: boolean;
}

/**
 * Follow 模块的事件接口
 */
interface FollowEvents {
  onHelpPress: () => void;
  onFadanPress: () => void;
  onUserPress: () => void;
  onSearchPress: () => void;
  onSharePress: () => void;
  onTabPress: (index: number) => void;
  onFilterPress: (index: number) => void;
  onModalClose: () => void;
  onLotterySelect: (lottery: ServerCommonLottery.ListCustomLotteryResult) => void;
}

/**
 * Follow 模块的 Hook
 */
export const useFollowData = () => {
  const shopInfo = useUserStore(state => state.loginInfo);
  // 状态管理
  const [state, setState] = useState<FollowState>({
    loading: false,
    error: null,
    isModalVisible: false,
  });

  // 数据状态
  const [followLotteryList, setFollowLotteryList] = useState<ServerCommonLottery.ListCustomLotteryResult[]>([]);

  // 查询参数 
  const [orderTrackHallQuery, setOrderTrackHallQuery] = useState<CommonFollowHall.ListOrderTrackHallCommandQuery>({
    current: 1,
    pageSize: 10,
    nickname: null,
    leaderboardType: 1  , // 默认连赢榜
    sortBy: null as 'default' | 'followNum' | 'betAmount' | null, // 默认排序
    single: null,
  });

  /**
   * 获取彩票列表数据
   */
  const fetchFollowLotteryList = useCallback(async () => {
    if (!shopInfo?.shopCode) return;

    try {
      const result = await getFollowLotteryList(shopInfo.shopCode);
      setFollowLotteryList(result);
    } catch (error) {
      console.error('获取彩票列表失败:', error);
    }
  }, [shopInfo?.shopCode]);

  // 事件处理
  const events: FollowEvents = {
    onHelpPress: () => {
      console.log('帮助按钮点击');
    },
    onFadanPress: () => {
      console.log('发单按钮点击');
      setState(prev => ({ ...prev, isModalVisible: true }));
    },
    onUserPress: () => {
      router.push('/follow/user');
      console.log('用户按钮点击');
    },
    onSearchPress: () => {
      router.push('/follow/search');
      console.log('搜索按钮点击');
    },
    onSharePress: () => {
      router.push('/follow/share');
      console.log('分享按钮点击');
    },
    onTabPress: (index: number) => {
      // 更新排行榜类型：1-连赢榜，2-命中榜，3-盈利榜
      setOrderTrackHallQuery(prev => ({
        ...prev,
        leaderboardType: (index + 1) as CommonFollowHall.LeaderboardType,
        current: 1, // 切换选项卡时重置页码
      }));
    },
    onFilterPress: (index: number) => {
      // 更新排序方式：0-默认排序，1-跟单人数，2-自购金额
      let sortBy: 'default' | 'followNum' | 'betAmount' | null = null;

      switch (index) {
        case 0:
          sortBy = null; // 默认排序
          break;
        case 1:
          sortBy = 'followNum'; // 跟单人数
          break;
        case 2:
          sortBy = 'betAmount'; // 自购金额
          break;
      }

      setOrderTrackHallQuery(prev => ({
        ...prev,
        sortBy,
        current: 1, // 切换筛选时重置页码
      }));
    },
    onModalClose: () => {
      setState(prev => ({ ...prev, isModalVisible: false }));
    },
    onLotterySelect: (lottery: ServerCommonLottery.ListCustomLotteryResult) => {
      console.log('选择彩票:', lottery);
      setState(prev => ({...prev, isModalVisible: false}));
    },
  };

  return {
    // 状态
    state,
    orderTrackHallQuery,
    followLotteryList,
    
    // 方法
    events,
    fetchFollowLotteryList,
  };
};

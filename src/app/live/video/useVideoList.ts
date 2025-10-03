import {useState, useEffect, useRef} from 'react';
import {router} from 'expo-router';
import dayjs from 'dayjs';
import {useLiveStore} from 'src/store/follow';
import {ListManager} from './ListManager';
import {VideoListState, DateItem, CompetitionType} from './types';
import {ScrollView} from 'react-native';

export const useVideoList = () => {
  const {
    setSelectedTabIndex,
    setSelectedFilterIndex,
    selectedFilterIndex,
    selectedTabIndex,
  } = useLiveStore();

  const [state, setState] = useState<VideoListState>({
    selectedDate: dayjs().format('YYYY-MM-DD'),
    selectedTabIndex,
    selectedFilterIndex,
    selectedLotteryTermNo: 0,
    footballData: {},
    basketballData: {},
    lotteryTermNo: [],
    page: 1,
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const dates = ListManager.generateDates();
  const todayIndex = dates.findIndex(item => item.isToday);

  // 初始化加载
  useEffect(() => {
    fetchLotteryTerms();
    loadInitialData();
  }, []);

  // 获取彩票期号
  const fetchLotteryTerms = async () => {
    try {
      const terms = await ListManager.getLotteryTerms();
      setState(prev => ({
        ...prev,
        lotteryTermNo: terms,
        selectedLotteryTermNo: terms[0] || 0,
      }));
    } catch (error) {
      console.error('获取彩票期号失败:', error);
    }
  };

  // 加载初始数据
  const loadInitialData = async () => {
    await getCompetitionData(
      state.selectedDate,
      1,
      state.selectedTabIndex,
      state.selectedFilterIndex,
      state.selectedLotteryTermNo,
    );
  };

  // 获取比赛数据
  const getCompetitionData = async (
    date: string,
    currentPage: number,
    tabIndex: number,
    filterIndex: number,
    termNo: number,
  ) => {
    try {
      // 根据 tabIndex 确定比赛类型
      let competitionType: CompetitionType;
      if (tabIndex === 0) {
        // 足球：根据 filterIndex 确定具体类型
        const footballTypes: CompetitionType[] = ['JC', 'BD', 'SFC'];
        competitionType = footballTypes[filterIndex] || 'JC';
      } else if (tabIndex === 1) {
        // 篮球
        competitionType = 'LQ';
      } else {
        // 数字彩
        return;
      }

      const Model = ListManager.getModel(competitionType);

      if (
        competitionType === 'JC' ||
        competitionType === 'BD' ||
        competitionType === 'SFC'
      ) {
        const data = await Model.getCompetitionData({
          date,
          currentPage,
          filterIndex,
          termNo,
        });

        setState(prev => {
          const prevList =
            currentPage === 1 ? [] : prev.footballData[date]?.list ?? [];

          return {
            ...prev,
            footballData: {
              ...prev.footballData,
              [date]: {
                list: [...prevList, ...data.list],
                total: data.total,
                query: data.query,
              },
            },
          };
        });
      } else if (competitionType === 'LQ') {
        const data = await Model.getCompetitionData({
          date,
          currentPage,
          filterIndex,
          termNo: 0,
        });

        setState(prev => {
          const prevList =
            currentPage === 1 ? [] : prev.basketballData[date]?.list ?? [];

          return {
            ...prev,
            basketballData: {
              ...prev.basketballData,
              [date]: {
                list: [...prevList, ...data.list],
                total: data.total,
                query: data.query,
              },
            },
          };
        });
      }
    } catch (error) {
      console.error('获取比赛数据失败:', error);
    }
  };

  // 处理日期变化
  const handleDateChange = async (item: DateItem, index: number) => {
    const newDate = item.date;
    setState(prev => ({
      ...prev,
      selectedDate: newDate,
      page: 1,
    }));

    // 清空当前数据
    if (state.selectedTabIndex === 0) {
      setState(prev => ({
        ...prev,
        footballData: {
          ...prev.footballData,
          [newDate]: {list: [], total: 0, query: {}},
        },
      }));
    } else if (state.selectedTabIndex === 1) {
      setState(prev => ({
        ...prev,
        basketballData: {
          ...prev.basketballData,
          [newDate]: {list: [], total: 0, query: {}},
        },
      }));
    }

    // 滚动到指定位置
    scrollViewRef.current?.scrollTo({
      x: index * 50,
      animated: true,
    });

    await getCompetitionData(
      newDate,
      1,
      state.selectedTabIndex,
      state.selectedFilterIndex,
      state.selectedLotteryTermNo,
    );
  };

  // 处理标签页变化
  const handleTabChange = async (index: number) => {
    if (index === 3) {
      router.push('/lottery/sport/announcement');
      return;
    }

    const today = dayjs().format('YYYY-MM-DD');

    setState(prev => ({
      ...prev,
      selectedDate: today,
      selectedTabIndex: index,
      selectedFilterIndex: 0,
      page: 1,
    }));

    // 清空数据
    setState(prev => ({
      ...prev,
      footballData: {},
      basketballData: {},
    }));

    // 数字彩特殊处理
    if (index === 2) {
      scrollViewRef.current?.scrollTo({
        x: 0,
        animated: true,
      });
    }

    await getCompetitionData(
      today,
      1,
      index,
      0, // 重置为第一个筛选器
      state.selectedLotteryTermNo,
    );
  };

  // 处理筛选器变化
  const handleFilterChange = async (index: number) => {
    setState(prev => ({
      ...prev,
      selectedFilterIndex: index,
      page: 1,
    }));

    // 清空当前数据
    if (state.selectedTabIndex === 0) {
      setState(prev => ({
        ...prev,
        footballData: {
          ...prev.footballData,
          [prev.selectedDate]: {list: [], total: 0, query: {}},
        },
      }));
    } else if (state.selectedTabIndex === 1) {
      setState(prev => ({
        ...prev,
        basketballData: {
          ...prev.basketballData,
          [prev.selectedDate]: {list: [], total: 0, query: {}},
        },
      }));
    }

    // 更新 store
    setSelectedFilterIndex(index);

    await getCompetitionData(
      state.selectedDate,
      1,
      state.selectedTabIndex,
      index,
      state.selectedLotteryTermNo,
    );
  };

  // 处理期号选择
  const handleTermSelect = async (termNo: number) => {
    setState(prev => ({
      ...prev,
      selectedLotteryTermNo: termNo,
      page: 1,
    }));

    // 清空足球数据
    setState(prev => ({
      ...prev,
      footballData: {
        ...prev.footballData,
        [prev.selectedDate]: {list: [], total: 0, query: {}},
      },
    }));

    await getCompetitionData(
      state.selectedDate,
      1,
      state.selectedTabIndex,
      state.selectedFilterIndex,
      termNo,
    );
  };

  // 刷新数据
  const handleRefresh = async () => {
    setState(prev => ({...prev, isRefreshing: true, page: 1}));

    // 清空当前数据
    if (state.selectedTabIndex === 0) {
      setState(prev => ({
        ...prev,
        footballData: {
          ...prev.footballData,
          [prev.selectedDate]: {list: [], total: 0, query: {}},
        },
      }));
    } else if (state.selectedTabIndex === 1) {
      setState(prev => ({
        ...prev,
        basketballData: {
          ...prev.basketballData,
          [prev.selectedDate]: {list: [], total: 0, query: {}},
        },
      }));
    }

    await getCompetitionData(
      state.selectedDate,
      1,
      state.selectedTabIndex,
      state.selectedFilterIndex,
      state.selectedLotteryTermNo,
    );

    setState(prev => ({...prev, isRefreshing: false}));
  };

  // 加载更多数据
  const handleLoadMore = async () => {
    const nextPage = state.page + 1;
    setState(prev => ({...prev, isLoadingMore: true, page: nextPage}));

    await getCompetitionData(
      state.selectedDate,
      nextPage,
      state.selectedTabIndex,
      state.selectedFilterIndex,
      state.selectedLotteryTermNo,
    );

    setState(prev => ({...prev, isLoadingMore: false}));
  };

  // 获取当前数据
  const getCurrentData = () => {
    if (state.selectedTabIndex === 0) {
      return state.footballData[state.selectedDate]?.list ?? [];
    } else if (state.selectedTabIndex === 1) {
      return state.basketballData[state.selectedDate]?.list ?? [];
    }
    return [];
  };

  // 检查是否有更多数据
  const hasMoreData = () => {
    if (state.selectedTabIndex === 0) {
      const currentData = state.footballData[state.selectedDate];
      return (currentData?.list?.length ?? 0) < (currentData?.total ?? 0);
    } else if (state.selectedTabIndex === 1) {
      const currentData = state.basketballData[state.selectedDate];
      return (currentData?.list?.length ?? 0) < (currentData?.total ?? 0);
    }
    return false;
  };

  // 获取比赛类型
  const getCompetitionType = () => {
    if (state.selectedTabIndex === 0) {
      const footballTypes: CompetitionType[] = ['JC', 'BD', 'SFC'];
      return footballTypes[state.selectedFilterIndex] || 'JC';
    } else if (state.selectedTabIndex === 1) {
      return 'LQ';
    }
    return 'JC';
  };

  // 获取筛选器标签
  const getFilterLabels = () => {
    if (state.selectedTabIndex === 0) {
      return ListManager.getFilterLabels('JC');
    } else if (state.selectedTabIndex === 1) {
      return ListManager.getFilterLabels('LQ');
    }
    return [];
  };

  return {
    // 状态
    state,
    dates,
    todayIndex,
    scrollViewRef,

    // 数据
    currentData: getCurrentData(),
    hasMore: hasMoreData(),
    competitionType: getCompetitionType(),
    filterLabels: getFilterLabels(),

    // 方法
    handleDateChange,
    handleTabChange,
    handleFilterChange,
    handleTermSelect,
    handleRefresh,
    handleLoadMore,
  };
};

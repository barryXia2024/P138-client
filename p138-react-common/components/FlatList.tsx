import {kScreenHeight} from '../utils/fuc/fc.rn';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList as RNFlatList,
  Image,
  Platform,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {useSystemSettingStore} from 'src/store';

export const defaultParams = {
  current: 1,
  pageSize: 10,
  sort: 'createdAt' as CoreCommonEnum.Sort,
  direction: 'desc' as BasicTypes.Direction,
};

// 请求方法的类型定义 - 支持原始 API 格式
interface RequestFunction<T, P> {
  (params: P): Promise<
    BasicTypes.DefaultResponseWrapper<{
      list: T[] | null;
      total?: number;
      current?: number;
      pageSize?: number;
      query: P;
    }>
  >;
}

// 数据合并函数的类型定义
interface MergeDataFunction<T> {
  (currentData: T[] | undefined, newData: T[]): T[];
}

// 暴露给外部的方法接口
export interface FlatListRef<T> {
  refresh: () => Promise<void>;
  fetchData: (page?: number, isRefresh?: boolean) => Promise<void>;
}

/**
 *  列表 ，内部处理刷新，加载更多
 * */
interface FlatListProps<T, P> {
  style?: StyleProp<ViewStyle>;
  data?: T[];
  ref?: React.RefObject<FlatListRef<T>>;
  renderItem: (info: {
    item: T;
    index: number;
    separators: any;
  }) => React.ReactElement;

  /**
   * 自定义刷新
   */
  onRefresh?: () => Promise<void>;
  /**
   * 自定义加载更多
   */
  onLoadMore?: () => Promise<void>;

  // 数据请求接口
  requestFunction?: RequestFunction<T, P>;
  /**
   * 请求参数
   */
  requestParams?: P;
  /**
   * 数据合并请求，暂时用不上
   */
  mergeDataFunction?: MergeDataFunction<T>;
  /**
   * 是否加载中 */
  loading?: boolean;
  /**
   * 是否还有更多数据：内部已处理
   */
  hasMore?: boolean;
  /**
   * 空数据文案
   */
  emptyText?: string;
  /**
   * 空数据图片
   */
  emptyImage?: any;
  /**
   *key
   */
  keyExtractor?: (item: T) => string;

  /**
   * 列表头部组件
   */
  ListHeaderComponent?: React.ReactElement;

  /**
   * 列表底部组件
   */
  ListFooterComponent?: React.ReactElement;
  /**
   * 列表内容容器样式
   */
  contentContainerStyle?: any;
  /**
   * 列表样式
   */
  className?: string;
  /**
   * 是否刷新中
   */
  refreshing?: boolean;
  /**
   * 列数
   */
  numColumns?: number;
  /**
   * 是否水平滚动
   */
  horizontal?: boolean;
  /**
   * 是否显示垂直滚动条
   */
  showsVerticalScrollIndicator?: boolean;
  /**
   * 是否显示水平滚动条
   */
  showsHorizontalScrollIndicator?: boolean;
  /**
   * 加载更多阈值
   */
  onEndReachedThreshold?: number;
  /**
   * 初始滚动索引
   */
  initialScrollIndex?: number;
  /**
   * 项分隔符组件
   */
  ItemSeparatorComponent?: React.ComponentType<any>;
  getItemLayout?:
    | ((
        data: ArrayLike<T> | null | undefined,
        index: number,
      ) => {length: number; offset: number; index: number})
    | undefined;
}

const NO_DATA_IMAGE = require('src/assets/imgs/no_data.png');

// 定义泛型组件类型
function FlatListComponent<T, P>(
  {
    data: externalData,
    renderItem,
    onRefresh,
    onLoadMore,
    requestFunction,
    requestParams,
    mergeDataFunction,
    loading = false,
    hasMore: externalHasMore = false,
    emptyText = '暂无数据',
    emptyImage = NO_DATA_IMAGE,
    keyExtractor,
    ListHeaderComponent,
    ListFooterComponent,
    contentContainerStyle,
    className = '',
    refreshing = false,
    numColumns = 1,
    horizontal = false,
    showsVerticalScrollIndicator = true,
    showsHorizontalScrollIndicator = true,
    onEndReachedThreshold = 0.1,
    ItemSeparatorComponent,
    style,
    initialScrollIndex,
    getItemLayout,
  }: FlatListProps<T, P>,
  ref: React.Ref<FlatListRef<T>>,
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [internalData, setInternalData] = useState<T[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalHasMore, setInternalHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingRef = useRef(false);
  const lastParamsRef = useRef<P>();
  const {isOpenDebug} = useSystemSettingStore();

  // 使用外部数据还是内部数据
  const data = externalData || internalData;
  const isLoading = loading || internalLoading;
  const hasMore = externalHasMore !== false ? externalHasMore : internalHasMore;

  // 判断是否支持分页 - 检查参数类型是否包含 current
  const supportsPagination = useCallback((params: P | undefined): boolean => {
    return !!(params && typeof params === 'object' && 'current' in params);
  }, []);

  // 内部数据获取逻辑
  const fetchData = useCallback(
    async (page: number = 1, isRefresh: boolean = false) => {
      if (!requestFunction || !requestParams || loadingRef.current) return;
      try {
        loadingRef.current = true;
        setInternalLoading(true);
        // 构建请求参数
        const requestParamsWithPage = {
          ...requestParams,
          ...(supportsPagination(requestParams)
            ? {current: page, direction:requestParams.direction?? 'desc', sort:requestParams.sort?? 'createdAt'}
            : {}),
        } as P;
        const response = await requestFunction(requestParamsWithPage);
        const responseData = response.data;
        const newData = responseData?.list || [];
        const total = responseData?.total || 0;
        const pageSize = responseData?.query?.pageSize || 10;

        if (isRefresh || page === 1) {
          setInternalData(newData);
        } else {
          // 使用合并函数或默认合并逻辑
          const mergedData = mergeDataFunction
            ? mergeDataFunction(internalData, newData)
            : [...internalData, ...newData];
          setInternalData(mergedData);
        }

        setCurrentPage(page);
        // 如果不支持分页，则没有更多数据
        if (!supportsPagination(requestParams)) {
          setInternalHasMore(false);
        } else {
          setInternalHasMore(
            newData.length === pageSize &&
              internalData.length + newData.length < total,
          );
        }
      } catch (error) {
        console.error('FlatList 数据获取失败:', error);
      } finally {
        loadingRef.current = false;
        setInternalLoading(false);
      }
    },
    [
      requestFunction,
      requestParams,
      mergeDataFunction,
      internalData,
      supportsPagination,
    ],
  );

  // 处理刷新
  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      // 使用外部刷新逻辑
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setIsRefreshing(true);
        await onRefresh();
        loadingRef.current = false;
        setIsRefreshing(false);
      } catch (error) {
        loadingRef.current = false;
        setIsRefreshing(false);
      }
    } else if (requestFunction) {
      // 使用内部刷新逻辑
      setIsRefreshing(true);
      await fetchData(1, true);
      setIsRefreshing(false);
    }
  }, [onRefresh, fetchData]);

  // 暴露方法给外部
  useImperativeHandle(
    ref,
    () => ({
      refresh: handleRefresh,
      fetchData,
    }),
    [handleRefresh, fetchData],
  );

  // 初始化数据
  useEffect(() => {
    if (
      requestFunction &&
      requestParams &&
      !externalData &&
      JSON.stringify(lastParamsRef.current) !== JSON.stringify(requestParams)
    ) {
      lastParamsRef.current = requestParams;
      fetchData(1, true);
    }
  }, [requestParams]);

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (onLoadMore) {
      // 使用外部加载更多逻辑
      if (loadingRef.current || !hasMore || data.length === 0) return;

      try {
        loadingRef.current = true;
        setIsLoadingMore(true);
        await onLoadMore();
        loadingRef.current = false;
        setIsLoadingMore(false);
      } catch (error) {
        loadingRef.current = false;
        setIsLoadingMore(false);
      }
    } else if (
      requestFunction &&
      hasMore &&
      !isLoadingMore &&
      data.length > 0
    ) {
      // 使用内部加载更多逻辑
      setIsLoadingMore(true);
      await fetchData(currentPage + 1, false);
      setIsLoadingMore(false);
    }
  }, [
    onLoadMore,
    requestFunction,
    hasMore,
    isLoadingMore,
    data.length,
    currentPage,
    fetchData,
  ]);

  // 渲染底部加载更多
  const renderFooter = () => {
    if (!hasMore && data.length > 0) {
      return (
        <View className="py-4 items-center">
          <Text className="text-gray-500 text-sm">没有更多数据了</Text>
        </View>
      );
    }

    if (isLoadingMore) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#999" />
          <Text className="text-gray-500 text-sm mt-2">加载中...</Text>
        </View>
      );
    }

    return null;
  };
  const marginTop = Platform.OS === 'web' ? 60 : 0;

  // 渲染空状态
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View
          className="flex-1 justify-center items-center"
          style={{height: kScreenHeight * 0.6}}>
          <ActivityIndicator size="large" color="#999" />
          <Text className="text-gray-500 text-sm mt-4">加载中...</Text>
        </View>
      );
    }

    if (data.length === 0) {
      return (
        <View
          className="w-full h-full justify-center items-center"
          style={{marginTop: marginTop}}>
          <Image source={emptyImage} style={{width: 80, height: 80}} />
          <Text className="text-gray-500 text-sm mt-4">{emptyText}</Text>
        </View>
      );
    }

    return null;
  };

  const isDev = process.env.EXPO_PUBLIC_APP_ENV === 'development';

  // 自动检测renderItem中使用的字段
  const detectUsedFields = (item: any) => {
    const usedFields = new Set<string>();

    try {
      // 判断renderItem的类型
      if (typeof renderItem === 'function') {
        // 如果是函数，分析函数体
        const renderItemStr = renderItem.toString();
      

        // 查找 item.xxx 模式的字段访问
        const itemFieldRegex = /item\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let match;

        while ((match = itemFieldRegex.exec(renderItemStr)) !== null) {
          usedFields.add(match[1]);
        }

        // 查找 item['xxx'] 模式的字段访问
        const itemBracketRegex = /item\[['"`]([^'"`]+)['"`]\]/g;
        while ((match = itemBracketRegex.exec(renderItemStr)) !== null) {
          usedFields.add(match[1]);
        }

        // 查找 item["xxx"] 模式的字段访问
        const itemDoubleQuoteRegex = /item\["([^"]+)"\]/g;
        while ((match = itemDoubleQuoteRegex.exec(renderItemStr)) !== null) {
          usedFields.add(match[1]);
        }

        // 查找 item['xxx'] 模式的字段访问
        const itemSingleQuoteRegex = /item\['([^']+)'\]/g;
        while ((match = itemSingleQuoteRegex.exec(renderItemStr)) !== null) {
          usedFields.add(match[1]);
        }

        // 检测组件props传递，如 transactionItem: item
        const propsItemRegex = /(\w+):\s*item/g;
        while ((match = propsItemRegex.exec(renderItemStr)) !== null) {
          // 如果检测到 props 传递了整个 item，我们需要手动指定常用字段
          if (match[1] === 'transactionItem' || match[1] === 'item' || match[1] === 'data') {
            // 添加常见的交易记录字段
            const commonFields = [
              'id', 
              // 'amount', 'transactionDescription', 'walletPayType', 
              // 'creditLimitChangeAmount', 'preBalance', 'postBalance', 
              // 'transactionStatus', 'transactionTime', 'createdAt', 
              // 'shopCode', 'shopName', 'cooperationShopCode', 'cooperationShopName',
              // 'betOrderID', 'betOrderNo', 'preCreditLimit', 'postCreditLimit',
              // 'cooperationStatisticsType', 'relatedOrderID', 'transactionOrderNo',
              // 'fee', 'feeRate', 'remark', 'userID', 'walletID', 'changeType',
              // 'transactionType', 'platformTransactionType', 'cooperationShopTransactionType',
              // 'serviceChargeType', 'shopServiceChargeTransactionType', 'transactionName',
              // 'canBeWithdrawn', 'withdrawalApplyID', 'receiverUserWalletID', 'receiverUserID',
              // 'receiverTransactionID', 'senderTransactionID', 'receiverUserType',
              // 'receiverUserWalletType', 'receiverUsername', 'senderUserWalletID',
              // 'senderUserID', 'senderUserType', 'senderUserWalletType', 'senderUsername',
              // 'operatorType', 'operatorUsername', 'paymentMethod', 'ticketType'
            ];
            commonFields.forEach(field => usedFields.add(field));
          }
        }

        // 检测解构赋值，如 { item } 或 { item: transactionItem }
        const destructureRegex = /{\s*item(?:\s*:\s*(\w+))?\s*}/g;
        while ((match = destructureRegex.exec(renderItemStr)) !== null) {
          if (match[1]) {
            // 如果解构后有重命名，也添加常用字段
            const commonFields = ['id', 'amount', 'status', 'name', 'title', 'content', 'time', 'date'];
            commonFields.forEach(field => usedFields.add(field));
          }
        }

      } else if (typeof renderItem === 'object' && renderItem !== null) {
        // 如果是对象（可能是React组件），尝试分析组件名称
        const renderItemObj = renderItem as any;
        const componentName = renderItemObj.type?.name || renderItemObj.type?.displayName || 'Unknown';
   

        // 根据组件名称推断可能使用的字段
        if (componentName.includes('Transaction') || componentName.includes('Wallet')) {
          const transactionFields = [
            'id', 'amount', 'transactionDescription', 'walletPayType', 
            'creditLimitChangeAmount', 'preBalance', 'postBalance', 
            'transactionStatus', 'transactionTime', 'createdAt'
          ];
          transactionFields.forEach(field => usedFields.add(field));
        } else if (componentName.includes('Order')) {
          const orderFields = ['id', 'orderNo', 'amount', 'status', 'createTime'];
          orderFields.forEach(field => usedFields.add(field));
        } else if (componentName.includes('User')) {
          const userFields = ['id', 'username', 'email', 'phone', 'avatar'];
          userFields.forEach(field => usedFields.add(field));
        }
      }

    } catch (error) {
      console.warn('自动检测字段失败:', error);
    }

    return Array.from(usedFields);
  };

  // 格式化JSON并高亮使用的字段
  const formatJsonWithHighlighting = (data: any, usedFields: string[]) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const lines = jsonStr.split('\n');
    
    return lines.map((line, index) => {
      // 检查这一行是否包含使用的字段（忽略大小写）
      const hasUsedField = usedFields.some(field => {
      
        // 创建正则表达式，忽略大小写
        const regex = new RegExp(`"${field}":`, 'm');
       
        return regex.test(line);
      });

      if (hasUsedField) {
        return (
          <Text key={index} style={{color: '#e74c3c', fontWeight: 'bold'}}>
            {line}
          </Text>
        );
      }

      return (
        <Text key={index} style={{color: '#2c3e50'}}>
          {line}
        </Text>
      );
    });
  };

  return (
    <RNFlatList
      style={style}
      data={data}
      renderItem={e => (
        <View>
          {renderItem(e)}
          {isDev && isOpenDebug && (
            <View
              style={{
                padding: 8,
                backgroundColor: '#f8f9fa',
                borderRadius: 4,
                marginTop: 4,
              }}>
              <Text style={{fontSize: 12, fontFamily: 'monospace'}}>
                {formatJsonWithHighlighting(e.item, detectUsedFields(e.item))}
              </Text>
            </View>
          )}
        </View>
      )}
      keyExtractor={keyExtractor || ((_: T, index: number) => index.toString())}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent || renderFooter()}
      ListEmptyComponent={renderEmpty()}
      contentContainerStyle={contentContainerStyle}
      className={className}
      refreshing={isRefreshing || refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={onEndReachedThreshold}
      numColumns={numColumns}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      initialScrollIndex={initialScrollIndex}
      ItemSeparatorComponent={ItemSeparatorComponent}
      getItemLayout={getItemLayout}
    />
  );
}

// 导出泛型组件
export const FlatList = forwardRef(FlatListComponent) as <T, P>(
  props: FlatListProps<T, P> & {ref?: React.Ref<FlatListRef<T>>},
) => React.ReactElement;

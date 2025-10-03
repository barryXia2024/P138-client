// Follow 模块类型定义


/**
 * 状态类型
 */
export interface FollowState {
  /**
   * 模态框显示状态
   */
  isModalVisible: boolean;
  /**
   * 加载状态
   */
  loading: boolean;
  /**
   * 错误信息
   */
  error: string | null;
}

/**
 * 组件 Props 类型
 */
export interface FollowProps {
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 帮助类型
   */
  helpType?: string;
}

/**
 * 事件处理类型
 */
export interface FollowEvents {
  /**
   * 选项卡切换
   * @param index 选项卡索引
   */
  onTabPress: (index: number) => void;
  /**
   * 筛选切换
   * @param index 筛选索引
   */
  onFilterPress: (index: number) => void;
  /**
   * 发单按钮点击
   */
  onFadanPress: () => void;
  /**
   * 用户中心点击
   */
  onUserPress: () => void;
  /**
   * 搜索点击
   */
  onSearchPress: () => void;
  /**
   * 分享点击
   */
  onSharePress: () => void;
  /**
   * 帮助点击
   */
  onHelpPress: () => void;
  /**
   * 彩票选择
   * @param lottery 彩票信息
   */
  onLotterySelect: (lottery: ServerCommonLottery.ListCustomLotteryResult) => void;
  /**
   * 模态框关闭
   */
  onModalClose: () => void;
  /**
   * 列表刷新
   */
  onRefresh: () => void;
  /**
   * 列表加载更多
   */
  onLoadMore: () => void;
} 
declare namespace FollowProps {
  interface OrderListItemProps {
    item: CommonFollowHall.PostsOrderItem;
    onPress?: (item: CommonFollowHall.PostsOrderItem) => void;
    tabIndex?: TabType;
    isMine?: boolean;
  }

  interface RecentWinStatusProps {
    latestWinStatus?: boolean[];
    maxItems?: number;
    isMine?: boolean;
  }
  interface TabSwitchProps {
    tabs: TabItem[];
    activeTab: string | number;
    onTabChange: (tab: string | number) => void;
    style?: StyleProp<ViewStyle>;
    tabStyle?: StyleProp<ViewStyle>;
    activeTabStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    activeTextStyle?: StyleProp<TextStyle>;
  }

  interface TabItem {
    key: string | number;
    label: string;
  }
  type UserFollowInfoHeaderVariant = 'mine' | 'other';
  interface UserFollowInfoHeaderProps {
    variant?: UserFollowInfoHeaderVariant; // 区分自己和别人的展示
    style?: ViewStyle; // 自定义样式
    trackAchievementsResult?: CommonFollowHall.GetTrackAchievementsResult;
  }
}

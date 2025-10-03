import {router} from 'expo-router';
import {
  follow,
  unfollow,
} from 'src/api/interface/orders-follow-hall-fan-follow';

// 处理关注/取消关注的方法
export const handleFollowAction = async (
  isFollow: boolean,
  userID: string,
  followerID: string,
  onSuccess: () => void,
) => {
  try {
    if (isFollow) {
      const res = await unfollow({
        followeeID: userID,
        followerID: followerID,
      });
      if (res.success) {
        Toast.show('取消关注成功');
        onSuccess();
      }
    } else {
      const res = await follow({
        followeeID: userID,
        followerID: followerID,
      });
      if (res.success) {
        Toast.show('关注成功');
        onSuccess();
      }
    }
  } catch (error) {
    console.error('关注操作失败:', error);
  }
};

// 导航到粉丝页面的方法
export const navigateToFansPage = (userID: string, shopCode: number) => {
  router.push({
    pathname: '/follow/fans',
    params: {
      userID,
      shopCode: shopCode.toString(),
    },
  });
};

// 格式化命中率显示
export const formatHitRate = (
  totalNum: number | undefined,
  winNum: number | undefined,
): string => {
  return `${totalNum || 0}中${winNum || 0}`;
};

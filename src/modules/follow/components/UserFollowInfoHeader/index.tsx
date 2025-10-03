import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
 
import {ConsecutiveWinsItem} from 'src/app/follow/components/followItem/consecutiveWins';

import {useUserStore} from 'src/store';
import {formatCurrency, toInteger} from '@/p138-react-common/utils';
import {HeaderConfig} from './constants';
import {formatHitRate, handleFollowAction, navigateToFansPage} from './fuc';
import { AvatarVIP } from '@/p138-react-common/components';

const UserFollowInfoHeader = ({
  variant = 'other',
  style,
  // targetUserId,
  // targetShopCode,
  trackAchievementsResult,
}: FollowProps.UserFollowInfoHeaderProps) => {
  const config = HeaderConfig[variant];
  const loginInfo = useUserStore(state => state.loginInfo);
  const [isFollow, setIsFollow] = useState<boolean>();

  useEffect(() => {
    setIsFollow(trackAchievementsResult?.isFollow);
  }, [trackAchievementsResult?.isFollow]);

  // 处理关注按钮点击
  const handleFollowButtonPress = () => {
    if (!trackAchievementsResult?.userID) return;

    const newFollowState = !isFollow;
    setIsFollow(newFollowState);

    handleFollowAction(
      isFollow || false,
      trackAchievementsResult.userID,
      loginInfo.userID,
      () => setIsFollow(newFollowState),
    );
  };

  // 处理粉丝页面导航
  const handleFansNavigation = () => {
    if (!trackAchievementsResult?.userID || !trackAchievementsResult?.shopCode)
      return;

    navigateToFansPage(
      trackAchievementsResult.userID,
      trackAchievementsResult.shopCode,
    );
  };

  return (
    <View style={[styles.container, config.containerStyle, style]}>
      <View style={[styles.headerContainer, config.headerStyle]}>
        <View style={[styles.userInfoContainer, config.userInfoStyle]}>
          <AvatarVIP
            avatar={trackAchievementsResult?.avatar}
            vipIndex={trackAchievementsResult?.vipLevel ?? 0}
          />

          <View style={styles.userDetailsContainer}>
            <View style={styles.nameContainer}>
              <Text>{trackAchievementsResult?.nickname}</Text>
              {config.showConsecutiveWinsInHeader && (
                <ConsecutiveWinsItem
                  consecutiveWins={trackAchievementsResult?.winStreak ?? 0}
                />
              )}
            </View>
            {config.showFansInfo && (
              <TouchableOpacity
                onPress={handleFansNavigation}
                style={styles.fansContainer}>
                <Text>粉丝数：{trackAchievementsResult?.fansNum ?? 0} |</Text>
                <Text>关注数：{trackAchievementsResult?.followNum ?? 0}</Text>
              </TouchableOpacity>
            )}
          </View>
          {variant === 'mine' && (
            <TouchableOpacity onPress={handleFansNavigation}>
              <Text style={styles.mineFansText}>
                粉丝：{trackAchievementsResult?.fansNum ?? 0}人{' '}
                <Text style={styles.separatorText}>|</Text>关注：
                {trackAchievementsResult?.followNum ?? 0}人
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {config.showFollowButton && (
          <TouchableOpacity
            onPress={handleFollowButtonPress}
            style={styles.followButton}>
            <Text style={styles.followButtonText}>
              {isFollow ? '已关注' : '+ 关注'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.statsContainer, config.statsStyle]}>
        <Text style={styles.titleText}>{config.title}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text>累积中奖</Text>
            <Text style={styles.statValue}>
              {formatCurrency(trackAchievementsResult?.totalAmount)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text>跟单佣金</Text>
            <Text style={styles.statValue}>
              {formatCurrency(trackAchievementsResult?.commission)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text>七日命中</Text>
            <Text style={styles.statValue}>
              {formatHitRate(
                trackAchievementsResult?.totalNum,
                trackAchievementsResult?.winNum,
              )}
            </Text>
          </View>
          <View style={[styles.statItem, styles.lastStatItem]}>
            <Text>带红人数</Text>
            <Text style={styles.statValue}>
              {toInteger(trackAchievementsResult?.copyRedNum)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userDetailsContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fansContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mineFansText: {
    fontSize: 12,
  },
  separatorText: {
    color: '#ef4444',
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fef2f2',
  },
  followButtonText: {
    color: '#ef4444',
  },
  statsContainer: {
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#fecaca',
    paddingVertical: 8,
  },
  lastStatItem: {
    borderRightWidth: 0,
  },
  statValue: {
    color: '#ef4444',
  },
});

export default UserFollowInfoHeader;

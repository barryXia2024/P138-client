/**
 * 用户信息获取 Hook
 * 提供用户信息获取和缓存功能
 */

import {useState, useEffect, useCallback} from 'react';
import {P138OpenIM} from '@/p138-react-common/OpenIM';
import {PublicUserItem} from '@openim/client-sdk';

// 用户信息缓存
const userInfoCache = new Map<string, PublicUserItem>();

interface UseUserInfoOptions {
  userId?: string;
  enabled?: boolean;
}

interface UseUserInfoReturn {
  userInfo: PublicUserItem | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 获取用户信息的 Hook
 * @param options 配置选项
 * @returns 用户信息状态和操作方法
 */
export const useUserInfo = ({userId, enabled = true}: UseUserInfoOptions): UseUserInfoReturn => {
  const [userInfo, setUserInfo] = useState<PublicUserItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    if (!userId || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 先检查缓存
      const cachedUser = userInfoCache.get(userId);
      if (cachedUser) {
        setUserInfo(cachedUser);
        setLoading(false);
        return;
      }
      
      // 从服务器获取用户信息
      const user = await P138OpenIM.getUserInfo(userId);
      
      // 缓存用户信息
      userInfoCache.set(userId, user);
      setUserInfo(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取用户信息失败';
      setError(errorMessage);
      console.error('获取用户信息失败:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, enabled]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return {
    userInfo,
    loading,
    error,
    refetch: fetchUserInfo,
  };
};

/**
 * 批量获取用户信息的 Hook
 * @param userIds 用户ID列表
 * @param enabled 是否启用
 * @returns 用户信息列表
 */
export const useUsersInfo = (userIds: string[], enabled = true) => {
  const [usersInfo, setUsersInfo] = useState<PublicUserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersInfo = useCallback(async () => {
    if (!userIds.length || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const users = await P138OpenIM.getUsersInfo(userIds);
      setUsersInfo(users);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取用户信息失败';
      setError(errorMessage);
      console.error('获取用户信息失败:', err);
    } finally {
      setLoading(false);
    }
  }, [userIds, enabled]);

  useEffect(() => {
    fetchUsersInfo();
  }, [fetchUsersInfo]);

  return {
    usersInfo,
    loading,
    error,
    refetch: fetchUsersInfo,
  };
};

/**
 * 清除用户信息缓存
 * @param userId 用户ID，不传则清除所有缓存
 */
export const clearUserInfoCache = (userId?: string) => {
  if (userId) {
    userInfoCache.delete(userId);
  } else {
    userInfoCache.clear();
  }
};

/**
 * 获取缓存的用户信息
 * @param userId 用户ID
 * @returns 缓存的用户信息
 */
export const getCachedUserInfo = (userId: string): PublicUserItem | null => {
  return userInfoCache.get(userId) || null;
};

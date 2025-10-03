
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_IMAGE } from '@/config/env';
import { searchUser } from 'src/api/interface/orders-follow-hall';

const RECENT_KEY = 'FOLLOW_SEARCH_HISTORY';
const MAX_HISTORY = 10;

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<CommonFollowHall.UserRow[] | null>(null);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // 初始化加载历史
  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then(res => {
      if (res) setRecent(JSON.parse(res));
    });
  }, []);

  // 输入变化时自动搜索（防抖300ms）
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!search.trim()) {
      setUserList(null);
      setError('');
      return;
    }
    timerRef.current = setTimeout(() => {
      handleSearch(search.trim(), false);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  // 搜索逻辑，isManual为true表示点击按钮或历史项
  const handleSearch = async (keyword: string, isManual = true) => {
    if (!keyword) {
      setUserList(null);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await searchUser({ nickname: keyword });
      setUserList(res.data?.userList || []);
      // 维护历史
      if (isManual) {
        let newRecent = [keyword, ...recent.filter(i => i !== keyword)];
        if (newRecent.length > MAX_HISTORY) newRecent = newRecent.slice(0, MAX_HISTORY);
        setRecent(newRecent);
        AsyncStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
      }
    } catch (e) {
      setError('搜索失败，请重试');
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  // 点击历史项
  const handleRecentClick = (item: string) => {
    setSearch(item);
    handleSearch(item, true);
  };

  // 清空历史
  const clearRecent = () => {
    setRecent([]);
    AsyncStorage.removeItem(RECENT_KEY);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 顶部红色搜索栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="请输入发单人昵称"
            placeholderTextColor="#ccc"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => handleSearch(search.trim(), true)}
            returnKeyType="search"
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')} style={{ position: 'absolute', right: 8 }}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(search.trim(), true)}>
          <Text style={styles.searchBtnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索结果或最近搜索 */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#F44336" />
        </View>
      ) : userList ? (
        <FlatList
          data={userList}
          keyExtractor={item => item.userID}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push({
                pathname: '/follow/user',
                params: {
                    userId: item.userID,
                    shopCode: item.shopCode,
                },
            })} style={styles.userItem}>
              <Image
                source={item.avatar ? { uri: item.avatar } : { uri: DEFAULT_IMAGE }}
                style={styles.avatar}
                resizeMode="cover"
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.nickname}>{item.nickname}</Text>
                <Text style={styles.fansInfo}>
                  粉丝：{item.fansNum}人  {item.winNum}中{item.totalNum}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>暂无相关用户</Text>}
        />
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.recentTitle}>最近搜索</Text>
            {recent.length > 0 && (
              <TouchableOpacity onPress={clearRecent} style={{ marginLeft: 'auto' }}>
                <Ionicons name="trash-outline" size={20} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={recent}
            keyExtractor={(item) => item}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recentItem} onPress={() => handleRecentClick(item)}>
                <Ionicons name="time-outline" size={16} color="#bbb" style={{ marginRight: 4 }} />
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={{ color: '#bbb', textAlign: 'center', marginTop: 32 }}>暂无历史记录</Text>}
          />
        </>
      )}
      {!!error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 12 }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  backBtn: {
    padding: 4,
    marginRight: 4,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  input: {
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  searchBtn: {
    backgroundColor: '#F44336',
    borderRadius: 4,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recentTitle: {
    fontSize: 17,
    color: '#222',
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
    marginBottom: 12,
    minWidth: 80,
  },
  recentText: {
    fontSize: 15,
    color: '#888',
  },
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
  },
  nickname: {
    fontSize: 17,
    color: '#111',
    fontWeight: '600',
    marginBottom: 4,
  },
  fansInfo: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginLeft: 76,
  },
});

export default SearchPage; 
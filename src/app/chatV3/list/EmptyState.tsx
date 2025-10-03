/**
 * 空状态组件
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Text as RNText} from 'react-native';

interface EmptyStateProps {
  loading: boolean;
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({loading, onRefresh}) => {
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#2D9DFE" />
        <RNText style={styles.emptyText}>加载会话中...</RNText>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.emptyContainer} onPress={onRefresh}>
      <RNText style={styles.emptyText}>暂无会话</RNText>
      <RNText style={styles.emptySubText}>点击刷新或发起聊天</RNText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default EmptyState;

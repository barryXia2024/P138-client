import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {router} from 'expo-router';
import {Button} from '@/p138-react-common/components';

interface HeaderSectionProps {
  deadline?: string;
  quickPick?: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  deadline,

  quickPick,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.deadlineText}>
        <Text style={styles.deadlineTime}>
          {deadline ? dayjs(deadline).format('YYYY-MM-DD HH:mm') : ''}
        </Text>{' '}
        截止 ,请尽快提交投注
      </Text>

      <View style={styles.headerActions}>
        <Button
          title="+继续选号"
          type="primary"
          size="small"
          textStyle={{fontSize: 16, fontWeight: 'bold'}}
          onPress={() => router.back()}
        />

        <Button
          title="机选一注"
          type="primary"
          size="small"
          textStyle={{fontSize: 16, fontWeight: 'bold'}}
          onPress={quickPick}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deadlineText: {
    fontSize: 16,
    color: '#333',
  },
  deadlineTime: {
    color: '#f53b57',
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    marginTop: 5,
  },
});

export default HeaderSection;

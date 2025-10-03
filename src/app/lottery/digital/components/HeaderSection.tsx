import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {Button} from '@/p138-react-common/components';

interface HeaderSectionProps {
  deadline?: string;
  onContinue: () => void;
  onQuickPick: () => void | Promise<void>;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  deadline,
  onContinue,
  onQuickPick,
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
          textStyle={{fontWeight: 'bold'}}
          style={{padding: 0, height: 35, width: 90}}
          onPress={onContinue}
          size="small"
        />

        <Button
          title="机选一注"
          type="primary"
          onPress={onQuickPick}
          textStyle={{fontWeight: 'bold'}}
          style={{padding: 0, height: 35, width: 80}}
          size="small"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 14,
    color: '#333',
  },
  deadlineTime: {
    color: '#f53b57',
 
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

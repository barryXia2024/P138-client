import React from 'react';
import {View} from 'react-native';
import Button from '@/p138-react-common/components/Button';
 
type BetControlsProps = {
  showQuickFivePick?: boolean;
  showQuickPick?: boolean;
  showMiss?: boolean;
  onQuickPick5?: () => void;
  onQuickPick?: () => void;
  onMiss?: () => void;
};

const BetControls: React.FC<BetControlsProps> = ({
  showQuickFivePick = false,
  showQuickPick = true,
  showMiss = true,
  onQuickPick5,
  onQuickPick,
  onMiss,
}) => {
  return (
    <View className="flex-row justify-between  gap-2">
      {showQuickFivePick && (
        <Button
          title="机选5注"
          type="primary"
          className="rounded-full"
          onPress={onQuickPick5}
          size="small"
        />
      )}

      <Button
        title="机选"
        type="primary"
        className="rounded-full"
        onPress={() => {
          onQuickPick?.();
        }}
        size="small"
      />

      <Button title="遗漏" type="text" onPress={onMiss} size="small" />
    </View>
  );
};

export default BetControls;

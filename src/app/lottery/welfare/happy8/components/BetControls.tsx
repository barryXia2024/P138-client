import React from 'react';
import {View} from 'react-native';
import Button from '@/p138-react-common/components/Button';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';

type BetControlsProps = {
  showQuickFivePick?: boolean;
  showQuickPick?: boolean;
  showMiss?: boolean;
  showMissControl?: boolean;
  showFullTuo?: boolean;
  onQuickPick5?: () => void;
  onQuickPick?: () => void;
  onMiss?: () => void;
  onFullTuo?: () => void;
};

const BetControls: React.FC<BetControlsProps> = ({
  showQuickFivePick = false,
  showQuickPick = true,
  showMiss = true,
  showMissControl = true,
  showFullTuo = false,
  onQuickPick5,
  onQuickPick,
  onMiss,
  onFullTuo,
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

      {showQuickPick && (
        <Button
          title="机选"
          type="primary"
          className="rounded-full"
          onPress={() => {
            onQuickPick?.();
          }}
          size="small"
        />
      )}

      {showFullTuo && (
        <Button
          title="一键全托"
          type="primary"
          className="rounded-full"
          onPress={() => {
            onFullTuo?.();
          }}
          size="small"
        />
      )}

      {showMissControl && (
        <NativeCheckbox
          checked={showMiss}
          label="遗漏"
          onCheckedChange={onMiss}
        />
      )}
    </View>
  );
};

export default BetControls;

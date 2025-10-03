import React from 'react';
import {View} from 'react-native';
import {Button} from '@/p138-react-common/components';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';

type BetControlsProps = {
  showQuickFivePick?: boolean;
  showQuickPick?: boolean;
  showMiss?: boolean;
  showMissControl?: boolean;
  onQuickPick5?: () => void;
  onQuickPick?: () => void;
  onMiss?: () => void;
};

const BetControls: React.FC<BetControlsProps> = ({
  showQuickFivePick = false,
  showQuickPick = true,
  showMiss = false,
  showMissControl = true,
  onQuickPick5,
  onQuickPick,
  onMiss,
}) => {
  return (
    <View className="flex-row justify-between gap-2">
      {showQuickFivePick && (
        <Button
          title="机选5注"
          type="primary"
          className="rounded-full"
          style={{ padding:0,height:26,width:65}}
          textStyle={{fontSize: 12}}
          onPress={onQuickPick5}
          size="small"
        />
      )}

      {showQuickPick && (
        <Button
          title="机选"
          type="primary"
          className="rounded-full"
          style={{ padding:0,height:26,width:45}}
          textStyle={{fontSize: 12}}
          onPress={() => {
            onQuickPick?.();
          }}
          size="small"
        />
      )}

      {showMissControl && (
        <NativeCheckbox
          checked={showMiss}
          checkboxStyle={{padding:0,height:16,width:16}}
          labelStyle={{fontSize: 12}}
          label="遗漏"
          onCheckedChange={onMiss}
        />
      )}
    </View>
  );
};

export default BetControls;

import React from 'react';
import {Switch} from 'tamagui';

const PSwitch = ({
  isChecked,
  onToggle,
}: {
  isChecked: boolean;
  onToggle: () => void;
}) => {
  return (
    <Switch
      checked={isChecked}
      onCheckedChange={onToggle}
      size="$3"
      style={{
        backgroundColor: isChecked ? '#4a90e2' : '#ccc', // 设置未选中部分的颜色
      }}>
      <Switch.Thumb
        animation="quicker"
        style={{
          backgroundColor: 'white',
        }}
      />
    </Switch>
  );
};

export default PSwitch;
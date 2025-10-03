import React from 'react';
import {View} from 'react-native';
import {Button} from '@/p138-react-common/components';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
import {DigitalBallSize} from 'src/app/lottery/components/DigitalBall';
export type ButtonGroupProps = {
  title: string;
  className?: string;
  style?: {padding?: number; height?: number; width?: number};
  textStyle?: {fontSize: number};
  type: 'button' | 'checkbox';
  size?: DigitalBallSize;
  onPress?: () => void;
  onCheckedChange?: (check: boolean) => void;
};

export type BetControlsProps = {
  onPress?: () => void;
  checked: boolean;
  onCheckedChange?: () => void;
  buttonGroup: ButtonGroupProps[];
};

// const buttonGroup = ButtonGroup();
const BetControls: React.FC<BetControlsProps> = ({
  checked,

  buttonGroup,
}) => {
  return (
    <View className="flex-row justify-between gap-2">
      {buttonGroup.map(item =>
        item.type === 'button' ? (
          <Button
            title={item.title}
            className="rounded-full"
            type='primary'
            style={[{padding: 0, height: 26, width: 45, ...item.style}]}
            textStyle={[{fontSize: 12}, item.textStyle]}
            key={item.title}
            onPress={item.onPress}
          />
        ) : (
          <NativeCheckbox
            checked={checked}
            className="rounded-full"
            checkboxStyle={[{padding: 0, height: 16, width: 16, ...item.style}]}
            labelStyle={[{fontSize: 12}, item.textStyle]}
            label={item.title}
            onCheckedChange={item.onCheckedChange}
            key={item.title}
          />
        ),
      )}
    </View>
  );
};

export default BetControls;

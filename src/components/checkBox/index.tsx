import React from 'react';

import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
} from 'react-native';

const checkedImage = require('./img/icon_circle_sel.png');
const uncheckedImage = require('./img/icon_circle.png');

interface CheckBoxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: any;
  labelStyle?: any;
  size?: number; // ✅ 新增：图标尺寸，单位 px
  className?: string;
}

 const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  style,
  labelStyle,
  size = 20, // ✅ 默认 20px
  className,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

  const isControlled = typeof checked === 'boolean';
  const currentChecked = isControlled ? checked : internalChecked;

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;

    const newChecked = !currentChecked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
  };
  console.log('currentChecked', currentChecked);
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[{flexDirection: 'row', alignItems: 'center'}, style]}
      activeOpacity={0.8}
      className={className}
      disabled={disabled}>
      <Image
        source={currentChecked ? checkedImage : uncheckedImage}
        style={{width: size, height: size}}
      />
      {label ? (
        <Text style={[{marginLeft: 8, fontSize: 14}, labelStyle]}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
};
export default CheckBox;
import {Check} from '@tamagui/lucide-icons';
import React from 'react';
import {
  Checkbox,
  CheckboxProps,
  Image,
  Label,
  RadioGroup,
  SizeTokens,
  XStack,
} from 'tamagui';
import {
  GestureResponderEvent,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import businessCheckedImage from './img/icon_circle_sel.png';
import businessUncheckedImage from './img/icon_circle.png';

import client_checkedImage  from './img/icon_circle_sel_c.png';
import client_uncheckedImage  from './img/icon_circle_c.png';
import { appConfig } from 'src/config';

interface CustomCheckboxProps extends CheckboxProps {
  label?: string;
  width?: number;
  checkedImage?: string;
  uncheckedImage?: string;
}

export function CustomCheckbox({
  size,
  width = 300,
  label = 'Accept terms and conditions',
  checkedImage,
  uncheckedImage,
  ...checkboxProps
}: CustomCheckboxProps) {
  const id = `checkbox-${(label || '').toString().slice(1)}`;

  return (
    <XStack width={width} alignItems="center" gap="$4">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          {checkedImage ? (
            <Image source={{uri: checkedImage}} width={20} height={20} />
          ) : (
            <Check />
          )}
        </Checkbox.Indicator>
        {uncheckedImage && (
          <Image source={{uri: uncheckedImage}} width={20} height={20} />
        )}
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  );
}

interface NativeCheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkedImage?: ImageSourcePropType;
  uncheckedImage?: ImageSourcePropType;
  containerStyle?: any;
  labelStyle?: any;
  checkboxStyle?: any;
  className?: string;
  disabled?: boolean;
}

export function NativeCheckbox({
  label = '',
  checked = false,
  defaultChecked = false,
  onCheckedChange,
  checkedImage =appConfig.platform === 'business' ? businessCheckedImage : client_checkedImage,
  uncheckedImage =appConfig.platform === 'business' ? businessUncheckedImage : client_uncheckedImage,
  containerStyle,
  labelStyle,
  checkboxStyle,
  className,
  disabled = false,
}: NativeCheckboxProps) {
  return (
    <View style={[styles.container, containerStyle]} className={className}>
      <TouchableOpacity
        activeOpacity={1}
        className='flex flex-row items-center'
        onPress={() => onCheckedChange?.(!checked)}
        disabled={disabled}>
        <View style={[styles.checkbox, checkboxStyle]}>
          {checked ? (
            checkedImage ? (
              <Image
                source={checkedImage}
                style={[styles.image, checkboxStyle]}
              />
            ) : (
              <View style={styles.checkedIndicator} />
            )
          ) : uncheckedImage ? (
            <Image
              source={uncheckedImage}
              style={[styles.image, checkboxStyle]}
            />
          ) : (
            <View style={styles.uncheckedIndicator} />
          )}
        </View>
        {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  uncheckedIndicator: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
  },
  image: {
    width: 30,
    height: 30,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export function CheckboxWithLabel({
  size,
  width = 300,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & {label?: string; width?: number}) {
  const id = `checkbox-${(label || '').toString().slice(1)}`;
  return (
    <XStack width={width} alignItems="center" gap="$4">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  );
}

export function RadioGroupItemWithLabel(props: {
  size: SizeTokens;
  value: string;
  label: string;
}) {
  const id = `radiogroup-${props.value}`;
  return (
    <XStack width={100} alignItems="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={props.size} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  );
}

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
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  style,
  labelStyle,
  size = 20, // ✅ 默认 20px
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

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[{flexDirection: 'row', alignItems: 'center'}, style]}
      activeOpacity={0.8}
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

export default {
  CheckboxWithLabel,
  RadioGroupItemWithLabel,
  CustomCheckbox,
  NativeCheckbox,
};

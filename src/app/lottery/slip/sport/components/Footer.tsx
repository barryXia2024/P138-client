import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CheckboxWithLabel} from '@/p138-react-common/components/checkBox';
import {useBetInfoStore} from 'src/modules/lottery/store';

const Footer: React.FC = () => {
  const {isRequirePhoto, setIsRequirePhoto} = useBetInfoStore();

  return (
    <View style={styles.footer}>
      <Text>方案设置</Text>
      <CheckboxWithLabel
        size="$5"
        label="要求店主上传照片"
        checked={isRequirePhoto}
        onCheckedChange={() => {
          setIsRequirePhoto(!isRequirePhoto);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
  },
});

export default Footer;

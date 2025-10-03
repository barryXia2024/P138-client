import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../Button';

// 按钮组件示例集合
export const ButtonExamples = {
  // 基础按钮示例
  basic: {
    title: '基础按钮',
    description: '展示基础按钮的不同类型',
    component: () => (
      <View style={styles.exampleContainer}>
        <View style={styles.buttonRow}>
          <Button title="默认按钮" onPress={() => console.log('默认按钮')} />
          <Button
            title="主要按钮"
            type="primary"
            onPress={() => console.log('主要按钮')}
          />
          <Button
            title="虚线按钮"
            type="dashed"
            onPress={() => console.log('虚线按钮')}
          />
        </View>
      </View>
    ),
    code: `
<Button title="默认按钮" onPress={() => console.log('默认按钮')} />
<Button title="主要按钮" type="primary" onPress={() => console.log('主要按钮')} />
<Button title="虚线按钮" type="dashed" onPress={() => console.log('虚线按钮')} />
    `,
  },

  // 尺寸按钮示例
  sizes: {
    title: '不同尺寸',
    description: '展示按钮的不同尺寸',
    component: () => (
      <View style={styles.exampleContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="小按钮"
            size="small"
            onPress={() => console.log('小按钮')}
          />
          <Button
            title="中按钮"
            size="middle"
            onPress={() => console.log('中按钮')}
          />
          <Button
            title="大按钮"
            size="large"
            onPress={() => console.log('大按钮')}
          />
        </View>
      </View>
    ),
    code: `
<Button title="小按钮" size="small" onPress={() => console.log('小按钮')} />
<Button title="中按钮" size="middle" onPress={() => console.log('中按钮')} />
<Button title="大按钮" size="large" onPress={() => console.log('大按钮')} />
    `,
  },

  // 形状按钮示例
  shapes: {
    title: '不同形状',
    description: '展示按钮的不同形状',
    component: () => (
      <View style={styles.exampleContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="默认"
            shape="default"
            onPress={() => console.log('默认形状')}
          />
          <Button
            title="圆角"
            shape="round"
            onPress={() => console.log('圆角形状')}
          />
          <Button
            title="圆形"
            shape="circle"
            onPress={() => console.log('圆形')}
          />
        </View>
      </View>
    ),
    code: `
<Button title="默认" shape="default" onPress={() => console.log('默认形状')} />
<Button title="圆角" shape="round" onPress={() => console.log('圆角形状')} />
<Button title="圆形" shape="circle" onPress={() => console.log('圆形')} />
    `,
  },

  // 状态按钮示例
  states: {
    title: '不同状态',
    description: '展示按钮的不同状态',
    component: () => {
      const [loading, setLoading] = useState(false);

      const handleLoadingClick = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      };

      return (
        <View style={styles.exampleContainer}>
          <View style={styles.buttonRow}>
            <Button
              title="禁用"
              disabled
              onPress={() => console.log('禁用按钮')}
            />
            <Button
              title="加载中"
              loading={loading}
              onPress={handleLoadingClick}
            />
            <Button
              title="危险"
              danger
              onPress={() => console.log('危险按钮')}
            />
          </View>
        </View>
      );
    },
    code: `
<Button title="禁用" disabled onPress={() => console.log('禁用按钮')} />
<Button title="加载中" loading={loading} onPress={handleLoadingClick} />
<Button title="危险" danger onPress={() => console.log('危险按钮')} />
    `,
  },

  // 幽灵按钮示例
  ghost: {
    title: '幽灵按钮',
    description: '展示幽灵模式的按钮',
    component: () => (
      <View style={styles.exampleContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="幽灵主要"
            type="primary"
            ghost
            onPress={() => console.log('幽灵主要')}
          />
          <Button
            title="幽灵默认"
            ghost
            onPress={() => console.log('幽灵默认')}
          />
          <Button
            title="幽灵虚线"
            type="dashed"
            ghost
            onPress={() => console.log('幽灵虚线')}
          />
        </View>
      </View>
    ),
    code: `
<Button title="幽灵主要" type="primary" ghost onPress={() => console.log('幽灵主要')} />
<Button title="幽灵默认" ghost onPress={() => console.log('幽灵默认')} />
<Button title="幽灵虚线" type="dashed" ghost onPress={() => console.log('幽灵虚线')} />
    `,
  },

  // 块级按钮示例
  block: {
    title: '块级按钮',
    description: '展示块级按钮',
    component: () => (
      <View style={styles.exampleContainer}>
        <Button
          title="块级按钮"
          block
          onPress={() => console.log('块级按钮')}
        />
      </View>
    ),
    code: `
<Button title="块级按钮" block onPress={() => console.log('块级按钮')} />
    `,
  },

  // 链接和文本按钮示例
  linkText: {
    title: '链接和文本按钮',
    description: '展示链接和文本类型的按钮',
    component: () => (
      <View style={styles.exampleContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="链接按钮"
            type="link"
            onPress={() => console.log('链接按钮')}
          />
          <Button
            title="文本按钮"
            type="text"
            onPress={() => console.log('文本按钮')}
          />
        </View>
      </View>
    ),
    code: `
<Button title="链接按钮" type="link" onPress={() => console.log('链接按钮')} />
<Button title="文本按钮" type="text" onPress={() => console.log('文本按钮')} />
    `,
  },

  // 带图标的按钮示例
  withIcon: {
    title: '带图标的按钮',
    description: '展示带图标的按钮',
    component: () => (
      <View style={styles.exampleContainer}>
        <View style={styles.buttonRow}>
          <Button
            title="左侧图标"
            icon={<Text>🔍</Text>}
            iconPosition="left"
            onPress={() => console.log('左侧图标')}
          />
          <Button
            title="右侧图标"
            icon={<Text>→</Text>}
            iconPosition="right"
            onPress={() => console.log('右侧图标')}
          />
        </View>
      </View>
    ),
    code: `
<Button 
  title="左侧图标" 
  icon={<Text>🔍</Text>}
  iconPosition="left"
  onPress={() => console.log('左侧图标')} 
/>
<Button 
  title="右侧图标" 
  icon={<Text>→</Text>}
  iconPosition="right"
  onPress={() => console.log('右侧图标')} 
/>
    `,
  },

  // 自定义样式按钮示例
  customStyle: {
    title: '自定义样式',
    description: '展示自定义样式的按钮',
    component: () => (
      <View style={styles.exampleContainer}>
        <Button
          title="自定义样式"
          style={{backgroundColor: '#ff6b6b', borderColor: '#ff6b6b'}}
          textStyle={{color: '#fff', fontWeight: 'bold'}}
          onPress={() => console.log('自定义样式')}
        />
      </View>
    ),
    code: `
<Button 
  title="自定义样式" 
  style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
  textStyle={{ color: '#fff', fontWeight: 'bold' }}
  onPress={() => console.log('自定义样式')} 
/>
    `,
  },
};

const styles = StyleSheet.create({
  exampleContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ButtonExamples;
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from './index';

const ButtonExample = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>按钮组件示例</Text>

      {/* 基础按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基础按钮</Text>
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

      {/* 尺寸按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>不同尺寸</Text>
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

      {/* 形状按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>不同形状</Text>
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

      {/* 状态按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>不同状态</Text>
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
          <Button title="危险" danger onPress={() => console.log('危险按钮')} />
        </View>
      </View>

      {/* 幽灵按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>幽灵按钮</Text>
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

      {/* 块级按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>块级按钮</Text>
        <Button
          title="块级按钮"
          block
          onPress={() => console.log('块级按钮')}
        />
      </View>

      {/* 链接和文本按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>链接和文本按钮</Text>
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

      {/* 带图标的按钮 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>带图标的按钮</Text>
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

      {/* 自定义样式 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>自定义样式</Text>
        <Button
          title="自定义样式"
          style={{backgroundColor: '#ff6b6b', borderColor: '#ff6b6b'}}
          textStyle={{color: '#fff', fontWeight: 'bold'}}
          onPress={() => console.log('自定义样式')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default ButtonExample;
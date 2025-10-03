import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppHeader from '../AppHeader';
import CustomModal from '../CustomModal';
import ZTextInput from '../ZTextInput';
import {CheckBox} from '../checkBox';
import {ActionSheetModal} from '../ActionSheet';
import TabSwitcher from '../TabSwitcher';
import Floating from '../Floating';
import {NoData} from '../NoData';
import RightTextButton from '../RightTextButton';
import ZInput from '../ZInput';
import DateSelector from '../DateSelector';
import Button from '../Button';
import ButtonExample from '../Button/example';

const {width} = Dimensions.get('window');

interface ComponentExample {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  code?: string;
}

const componentExamples: ComponentExample[] = [
  {
    id: 'app-header',
    name: 'AppHeader',
    category: '导航',
    description: '应用头部导航组件',
    component: AppHeader,
    props: {title: '示例标题'},
    code: `<AppHeader title="示例标题" />`,
  },
  {
    id: 'custom-modal',
    name: 'CustomModal',
    category: '弹窗',
    description: '自定义模态框组件',
    component: CustomModal,
    props: {isVisible: false},
    code: `<CustomModal isVisible={isVisible} onClose={() => setVisible(false)}>
  <Text>模态框内容</Text>
</CustomModal>`,
  },
  {
    id: 'z-text-input',
    name: 'ZTextInput',
    category: '表单',
    description: '文本输入框组件',
    component: ZTextInput,
    props: {placeholder: '请输入内容'},
    code: `<ZTextInput placeholder="请输入内容" />`,
  },
  {
    id: 'checkbox',
    name: 'CheckBox',
    category: '表单',
    description: '复选框组件',
    component: CheckBox,
    props: {label: '复选框示例'},
    code: `<CheckBox label="复选框示例" onChange={(checked) => console.log(checked)} />`,
  },
  {
    id: 'action-sheet',
    name: 'ActionSheetModal',
    category: '弹窗',
    description: '操作表组件',
    component: ActionSheetModal,
    props: {isVisible: false},
    code: `<ActionSheetModal isVisible={isVisible} onClose={() => setVisible(false)} />`,
  },
  {
    id: 'tab-switcher',
    name: 'TabSwitcher',
    category: '导航',
    description: '标签切换组件',
    component: TabSwitcher,
    props: {tabs: ['标签1', '标签2', '标签3']},
    code: `<TabSwitcher tabs={['标签1', '标签2', '标签3']} />`,
  },
  {
    id: 'floating',
    name: 'Floating',
    category: '布局',
    description: '浮动组件',
    component: Floating,
    props: {children: <Text>浮动内容</Text>},
    code: `<Floating>
  <Text>浮动内容</Text>
</Floating>`,
  },
  {
    id: 'no-data',
    name: 'NoData',
    category: '状态',
    description: '无数据状态组件',
    component: NoData,
    props: {},
    code: `<NoData />`,
  },
  {
    id: 'right-text-button',
    name: 'RightTextButton',
    category: '按钮',
    description: '右侧文本按钮组件',
    component: RightTextButton,
    props: {text: '按钮文本', onPress: () => {}},
    code: `<RightTextButton text="按钮文本" onPress={() => {}} />`,
  },
  {
    id: 'z-input',
    name: 'ZInput',
    category: '表单',
    description: '输入框组件',
    component: ZInput,
    props: {placeholder: '请输入'},
    code: `<ZInput placeholder="请输入" />`,
  },
  {
    id: 'date-selector',
    name: 'DateSelector',
    category: '表单',
    description: '日期选择器组件',
    component: DateSelector,
    props: {},
    code: `<DateSelector />`,
  },
  {
    id: 'button',
    name: 'Button',
    category: '按钮',
    description: '多功能按钮组件',
    component: Button,
    props: {title: '示例按钮', onPress: () => {}},
    code: `<Button title="示例按钮" onPress={() => {}} />`,
  },
  {
    id: 'button-example',
    name: 'ButtonExample',
    category: '按钮',
    description: '按钮组件完整示例展示',
    component: ButtonExample,
    props: {},
    code: `<ButtonExample />`,
  },
];

const categories = ['全部', '导航', '弹窗', '表单', '布局', '状态', '按钮'];

const ComponentExamplePanel = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchText, setSearchText] = useState('');
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentExample | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showPropsModal, setShowPropsModal] = useState(false);

  const filteredComponents = componentExamples.filter(component => {
    const matchesCategory =
      selectedCategory === '全部' || component.category === selectedCategory;
    const matchesSearch =
      component.name.toLowerCase().includes(searchText.toLowerCase()) ||
      component.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleComponentPress = (component: ComponentExample) => {
    setSelectedComponent(component);
    setShowPropsModal(true);
  };

  const renderComponentPreview = (component: ComponentExample) => {
    const Component = component.component;
    return (
      <View style={styles.previewContainer}>
        <Component {...component.props} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="组件示例面板" />

      {/* 分类标签 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 组件列表 */}
      <ScrollView style={styles.componentList}>
        {filteredComponents.map(component => (
          <TouchableOpacity
            key={component.id}
            style={styles.componentCard}
            onPress={() => handleComponentPress(component)}>
            <View style={styles.componentHeader}>
              <Text style={styles.componentName}>{component.name}</Text>
              <View style={styles.componentBadge}>
                <Text style={styles.componentBadgeText}>
                  {component.category}
                </Text>
              </View>
            </View>
            <Text style={styles.componentDescription}>
              {component.description}
            </Text>
            <View style={styles.componentPreview}>
              {renderComponentPreview(component)}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 组件详情弹窗 */}
      <CustomModal
        isVisible={showPropsModal}
        onClose={() => setShowPropsModal(false)}>
        {selectedComponent && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedComponent.name}</Text>
            <Text style={styles.modalDescription}>
              {selectedComponent.description}
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>组件预览</Text>
              {renderComponentPreview(selectedComponent)}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>属性配置</Text>
              <ScrollView style={styles.propsContainer}>
                {Object.entries(selectedComponent.props || {}).map(
                  ([key, value]) => (
                    <View key={key} style={styles.propItem}>
                      <Text style={styles.propKey}>{key}:</Text>
                      <Text style={styles.propValue}>{String(value)}</Text>
                    </View>
                  ),
                )}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setShowCodeModal(true);
                  setShowPropsModal(false);
                }}>
                <Text style={styles.actionButtonText}>查看代码</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => setShowPropsModal(false)}>
                <Text style={styles.actionButtonText}>关闭</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </CustomModal>

      {/* 代码预览弹窗 */}
      <CustomModal
        isVisible={showCodeModal}
        onClose={() => setShowCodeModal(false)}>
        {selectedComponent && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>代码示例</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{selectedComponent.code}</Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowCodeModal(false)}>
              <Text style={styles.actionButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        )}
      </CustomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#1890ff',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  componentList: {
    flex: 1,
    padding: 16,
  },
  componentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  componentBadge: {
    backgroundColor: '#1890ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  componentBadgeText: {
    fontSize: 12,
    color: '#fff',
  },
  componentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  componentPreview: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fafafa',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    maxWidth: width * 0.9,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  propsContainer: {
    maxHeight: 120,
  },
  propItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  propKey: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  propValue: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1890ff',
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  codeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
});

export default ComponentExamplePanel;
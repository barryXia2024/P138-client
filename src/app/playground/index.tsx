import AppHeader from '@/p138-react-common/components/AppHeader';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ScrollView } from 'react-native';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      console.warn(`组件 ${this.props.name} 渲染失败:`, this.state.error);
      return (
        <div style={{ border: '1px solid red', color: 'red', padding: 10 }}>
          <h2>{this.props.name}</h2>
          <p>⚠️ 渲染失败: {String(this.state.error)}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
const req = require.context('../../', true, /components\/.*\.tsx$/);
const components = req.keys().filter((key) => (!key.includes('/lottery/')&&!key.includes('/live/'))).map((key) => {
  const Comp = req(key).default;
  const name = key.replace('../pages/', '').replace('.tsx', '');
  return { Comp, name };
});

const Playground = () => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <AppHeader title='组件可视化面板'/>
      <h1>页面下所有组件可视化面板</h1>
      {components.map(({ Comp, name }, index) => (
        <ErrorBoundary key={index} name={name}>
          <div style={{ border: '1px solid #ddd', marginBottom: 20, padding: 10 }}>
            <h2>{name}</h2>
            <Comp isVisible={false} visible={false} text={'sadasdad'}/>
          </div>
        </ErrorBoundary>
      ))}
    </ScrollView>
  );
};

export default Playground;
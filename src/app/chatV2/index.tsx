import React from 'react';
import { View } from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import Chat from './components/Chat';


export default function ChatPage() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="晴天" />
      <Chat />
    </View>
  );
}

import {AppHeader} from '@/p138-react-common/components';
import {useLocalSearchParams} from 'expo-router';
import {View} from 'react-native';
import WebView from 'react-native-webview';

const WebScreen = () => {
  const {url} = useLocalSearchParams();
  return (
    <View className="flex-1">
      <AppHeader />
      <WebView style={{flex: 1}} source={{uri: url as string}} />
    </View>
  );
};

export default WebScreen;

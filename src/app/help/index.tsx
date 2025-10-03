import AppHeader from '@/p138-react-common/components/AppHeader';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {helpData, HelpList} from './constants';
import {useLocalSearchParams} from 'expo-router';

import WebView from 'react-native-webview';
interface Props {
  content: string;
}

function AutoHeightWebView({content}: Props) {
  const [webHeight, setWebHeight] = useState(0);

  const injectedJS = `
    setTimeout(function() {
      const height = document.body.scrollHeight;
      window.ReactNativeWebView.postMessage(height);
    }, 100);
    true;
  `;

  return (
    <View style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        source={{html: content}}
        style={{height: webHeight}}
        injectedJavaScript={injectedJS}
        onMessage={event => {
          const height = Number(event.nativeEvent.data);
          if (!isNaN(height)) setWebHeight(height);
        }}
        scrollEnabled={false} // 禁止 WebView 内滚动，撑开父容器
      />
    </View>
  );
}

const Help = () => {
  const {helpType} = useLocalSearchParams();
  const key = (helpType as string) as keyof typeof helpData;
  const content: HelpList[] = helpData[key] ?? [];

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => {
      const isOpen = !!prev[sectionKey];
      if (isOpen) {
        return {};
      }
      return { [sectionKey]: true };
    });
  };

  const renderContent = (content: string) => {
    const htmlContent = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      body { font-size:12px; line-height:1.5; word-wrap:break-word;  }
      * { -webkit-text-size-adjust:100%; }
    </style>
     ${content}
    `;
    if (Platform.OS === 'web') {
      return <div style={{padding: 16,backgroundColor:'#f0f0f0'}} dangerouslySetInnerHTML={{__html: content}} />;
    } else {
      return <AutoHeightWebView content={htmlContent} />;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="帮助" />
      <ScrollView>
        {content.map((section, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.chapterHeader}
              activeOpacity={1}
              onPress={() => toggleSection(`${section.title}_${index}`)}>
              <Text style={styles.chapterTitle}>
                {`${index + 1}.${section.title}`}
              </Text>
              <Text style={styles.toggleIcon}>
                {expandedSections[`${section.title}_${index}`] ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {expandedSections[`${section.title}_${index}`] &&
              // <Text style={styles.chapterContent}>{section.content}</Text>
              renderContent(section.content)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chapterTitle: {
    fontSize: 14,
    // fontWeight: 'bold',
    color: '#333',
  },
  toggleIcon: {
    fontSize: 14,
    color: '#999',
  },
  
});

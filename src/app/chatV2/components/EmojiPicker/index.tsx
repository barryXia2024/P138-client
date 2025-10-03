import React from 'react';
import { View } from 'react-native';
// import EmojiPicker from 'react-native-emoji-modal';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <View className="h-full w-full">
      {/* <EmojiPicker
        onEmojiSelected={(emoji) => onEmojiSelect({ native: emoji })}
        columns={10}
        emojiSize={24}
        backgroundStyle={{ backgroundColor: '#f5f5f5' }}
        searchStyle={{ display: 'none' ,height:0}}
        headerStyle={{ display: 'none' }}
        shortcutColor="#666"
        activeShortcutColor="#0078d4"
        scrollStyle={{ backgroundColor: '#f5f5f5' }}
      /> */}
    </View>
  );
};

export default EmojiPickerComponent; 
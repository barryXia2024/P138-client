import React, {memo, useMemo} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';

import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {getImageUrl} from '@/p138-react-common/utils/fuc';

const SwiperItem = ({
  item,
  goto,
}: {
  item: ServerCoreAd.Ad;
  goto: (item: ServerCoreAd.Ad) => void;
}) => {
  const memoizedSource = useMemo(
    () => ({uri: getImageUrl(item.imageUrl ?? '')}),
    [item.imageUrl],
  );

  return (
    <View className="flex-1 p-2 rounded-lg overflow-hidden">
      <TouchableOpacity
        key={item.id}
        style={styles.root}
        onPress={() => goto(item)}
        activeOpacity={1}>
        {item.imageUrl ? (
          <OSSImage
            source={memoizedSource}
            style={styles.image}
            resizeMode="stretch"
          />
        ) : (
          <View style={styles.image} />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default SwiperItem;
const styles = StyleSheet.create({
  root: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    height: Platform.OS === 'web' ? 180 : 100,
    // aspectRatio: 3 / 1,
  },
  image: {
    width: '100%',
    height: Platform.OS === 'web' ? 180 : 100,
    // aspectRatio: 3/1,
  },
});

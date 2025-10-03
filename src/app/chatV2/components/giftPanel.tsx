import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';

const kScreenWidth = Dimensions.get('window').width;
const kScreenHeight = Dimensions.get('window').height;


interface GiftPanelProps {
  visible: boolean;
  onClose: () => void;
  giftList: CommonLiveLiveStreamGift.LiveStreamGift[];
  onSend: (gift: CommonLiveLiveStreamGift.LiveStreamGift, count: number) => void;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const GiftPanel: React.FC<GiftPanelProps> = ({
  visible,
  onClose,
  giftList,
  onSend,
}) => {
  const [selectedGift, setSelectedGift] = useState<CommonLiveLiveStreamGift.LiveStreamGift>();
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const [showCountList, setShowCountList] = useState<boolean>(false);

  const giftCountList = [1, 10, 66, 188, 588, 999];

  const clickGift = (gift: CommonLiveLiveStreamGift.LiveStreamGift) => {
    setSelectedGift(gift);
    setShowCountList(false);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        <View
          style={{
            width: kScreenWidth,
            height: kScreenHeight * 0.55,
            backgroundColor: '#fff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 24,
          }}
        >
          {/* 顶部标题 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>礼物</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: 'blue', fontSize: 16 }}>关闭</Text>
            </TouchableOpacity>
          </View>

          {/* 礼物分页区 */}
          <View style={{ flex:1}}>
            <SwiperFlatList
              data={chunkArray(giftList ?? [], 8)}
              showPagination
              paginationStyleItem={{ width: 3, height: 3 }}
              paginationStyle={{ marginTop: 2, position: 'relative', alignSelf: 'center' }}
              paginationActiveColor={'#f90'}
              paginationDefaultColor={'#ccc'}
              renderItem={({ item: page }) => (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: kScreenWidth, height: 220 }}>
                  {[0, 1].map((row) => (
                    <View key={row} style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: row === 0 ? 10 : 0 }}>
                      {page.slice(row * 4, row * 4 + 4).map((gift: CommonLiveLiveStreamGift.LiveStreamGift, idx: number) => (
                        <TouchableOpacity
                          key={gift.id || idx}
                          onPress={() => clickGift(gift)}
                          style={{
                            alignItems: 'center',
                            flex: 1,
                            width: kScreenWidth / 5,
                            borderWidth: 2,
                            borderColor: selectedGift?.id === gift.id ? 'red' : 'transparent',
                            borderRadius: 8,
                            padding: 4,
                          }}
                        >
                          <OSSImage source={{ uri: gift.icon }} style={{ width: 50, height: 50 }} />
                          <Text style={{ marginTop: 4, fontSize: 12, textAlign: 'center' }}>{gift.name}</Text>
                          <Text style={{ color: '#f90', fontSize: 12, textAlign: 'center' }}>{gift.price}币</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            />
          </View>

          {/* 数量下拉框 */}
          {showCountList && (
            <View
              style={{
                position: 'absolute',
                bottom: Platform.OS === 'web' ? 70 : 43,
                right: 50,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                paddingVertical: 6,

                zIndex: 999,
                width: 100,

              }}
            >
              {giftCountList.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => {
                    setSelectedCount(count);
                    setShowCountList(false);
                  }}
                  style={{
                    paddingVertical: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 14, color: count === selectedCount ? 'red' : '#333' }}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 底部发送区 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16,marginBottom:10, alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 }}>
            {/* 左侧金币余额和充值 */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#f90', marginRight: 8 }}>0</Text>
              <TouchableOpacity style={{ borderWidth: 1, borderColor: '#f90', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 }}>
                <Text style={{ color: 'red', fontSize: 14 }}>充值</Text>
              </TouchableOpacity>
            </View>

            {/* 右侧数量 + 发送按钮 */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ borderWidth: 1, borderColor: 'red', width: 80, height: 35, marginRight: -12, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, paddingHorizontal: 18, paddingVertical: 4 }}
                onPress={() => setShowCountList(!showCountList)}
              >
                <Text style={{ fontSize: 14 }}>{selectedCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'red', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 4, height: 35 }}
                onPress={() => {
                  if (selectedGift) {
                    onSend(selectedGift, selectedCount);
                  }
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>发送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GiftPanel;

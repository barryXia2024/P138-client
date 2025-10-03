import commonStyles from 'p138-react-common/utils/styles';
import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {betPlayColorGreen} from 'p138-react-common/utils/styles/color';
import {HeaderLeft, HeaderRight} from 'src/modules/home/navigate';
import CarouselComponent from '../../../p138-react-common/components/swiper';
import LotteryGridItems from 'src/modules/home/LotteryGridItems';
import LotteryOverviewPanel from 'src/modules/home/lotteryOverviewPanel';
import DrawPreviewCard from 'src/modules/home/DrawPreviewCard';
import AppHeader from '@/p138-react-common/components/AppHeader';
import HomeMarquee from 'src/modules/home/homeMarquee';

import WinModal from 'src/modules/home/WinModal';
import {BrowserType, getBrowserInfo} from 'src/utils/device';
import ContactShopker from '../chatV3/components/ContactShopker';

function HomeScreen() {
  const browserInfo = getBrowserInfo();
  const isIphone =
    browserInfo.browser === BrowserType.IOS_SAFARI ||
    browserInfo.browser === BrowserType.IOS_CHROME;
  const swiperHeight = 180;
  return (
    <View
      className="flex-1"
       >
  
      <AppHeader
        leftComponent={<HeaderLeft />}
        title=""
        rightComponent={<HeaderRight />}
      />
      <ScrollView
        className="bg-white mb-[70px]"
        showsVerticalScrollIndicator={false}>
        {/* 轮播广告 */}
        <View
          className="flex justify-center items-center"
          style={[
            isIphone ? {width: browserInfo.width, height: swiperHeight} : {},
          ]}>
          <CarouselComponent
            appType={1}
            adType={5}
            style={
              isIphone ? {width: browserInfo.width, height: swiperHeight} : {}
            }
          />
        </View>
        
        <HomeMarquee className=" w-full" />
         
        <LotteryGridItems className="mt-6 px-2" />
     
        <LotteryOverviewPanel />
     
        <DrawPreviewCard />
      </ScrollView>
      <WinModal />

      <View className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-200 flex justify-center items-center px-[16px]">
        <Text style={[commonStyles.fontSize16, {color: betPlayColorGreen}]}>
          实体店铺
        </Text>
        <Text style={[commonStyles.fontSize14]}>
          本店承诺：为便捷服务，我是线下实体店铺，购买有保障，每单均有实体出票照片。如看不到实体票请及时与我联系！
        </Text>
      </View>
    </View>
  );
}

export default HomeScreen;

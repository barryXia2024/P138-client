import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { themeGrayColor, themeRedColor } from 'p138-react-common/utils/styles/color';
import dayjs from 'dayjs';
import ArrowIcon from '@/p138-react-common/components/Arrow';
import { Spinner, YStack } from 'tamagui';
import {
  listSportsDrawAnnouncement,
  listSportsStatistics,
} from 'src/api/interface/lottery-lottery-type-draw';
import useLotteryResultStore from 'src/store/lottery/result';
import MatchListItem from './matchItem';
import useLotteryResultPageStore from '../store/lotteryResultTabStore';


const CollapsibleMatchList = () => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [collapsedData, setCollapsedData] = useState<LotteryResult.CollapsedMatchGroup[]>([]);
  const [expandedData, setExpandedData] = useState<Record<string, LotteryDrawAnnouncement.SportsMatch[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const {  lotteryResult, setLotteryResult } = useLotteryResultStore();
  const {selectedLotteryType}=useLotteryResultPageStore()
  const ref = useRef<CommonCommonEnum.LotteryName | null>(null);

  console.log('lotteryResult',selectedLotteryType);
  useEffect(() => {
    ref.current = selectedLotteryType;
    initCollapsedData(selectedLotteryType);
  }, [selectedLotteryType]); // 不依赖 activeTab，组件挂载时只调用一次

  const initCollapsedData = async (lotteryName: CommonCommonEnum.LotteryName) => {
    try {
      setIsLoading(true);
      const res = await listSportsStatistics({ lotteryName });
      if (!res.success) return;

      const statisticsVos = res.data || [];
      setLotteryResult(statisticsVos);

      const collapsed = statisticsVos.map((item) => ({
        title: dayjs(item.processDate).format('YYYY-MM-DD'),
        totalMatches: item.competitionNum,
      }));
      setCollapsedData(collapsed);

      if (collapsed.length) {
        const firstTitle = collapsed[0].title;
        setCollapsedSections({ [firstTitle]: true });

        const detailRes = await listSportsDrawAnnouncement({
          lotteryName,
          processDate: firstTitle,
        });

        if (detailRes.success) {
          setExpandedData({ [firstTitle]: detailRes.data || [] });
        }
      }
    } catch (e) {
      console.warn('初始化失败', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = useCallback(
    async (title: string) => {
      setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
      if (!collapsedSections[title] && !expandedData[title]) {
        try {
          const res = await listSportsDrawAnnouncement({
            lotteryName: selectedLotteryType,
            processDate: title,
          });
          if (res.success) {
            setExpandedData((prev) => ({ ...prev, [title]: res.data || [] }));
          }
        } catch (e) {
          console.warn('展开失败', e);
        }
      }
    },
    [collapsedSections, expandedData, selectedLotteryType]
  );

  const renderSectionHeader = ({
    section: { title, totalMatches },
  }: {
    section: LotteryResult.CollapsedMatchGroup;
  }) => (
    <TouchableOpacity style={styles.dateHeader} onPress={() => toggleSection(title)}>
      <Text style={styles.dateHeaderText}>
        {dayjs(title).format('YYYY-MM-DD')} <Text style={{ color: '#f53b57' }}>{totalMatches} 场比赛</Text>
      </Text>
      <ArrowIcon isTap={collapsedSections[title]} />
    </TouchableOpacity>
  );

  const sections = collapsedData.map((group) => ({
    title: group.title,
    totalMatches: group.totalMatches,
    data: collapsedSections[group.title] ? expandedData[group.title] || [] : [],
  }));

  if (isLoading) {
    return (
      <YStack style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" color="$red10" />
      </YStack>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.matchNum + item.away + item.home}
      renderSectionHeader={renderSectionHeader}
      renderItem={MatchListItem}
      style={{flex: 1}}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fef9f9',
    marginBottom: 5,
  },
  dateHeaderText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
 
});

export default CollapsibleMatchList;

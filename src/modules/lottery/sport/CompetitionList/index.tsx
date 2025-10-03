import React from 'react';
import {View, StyleSheet, SectionList, Text} from 'react-native';

import {Spinner, YStack} from 'tamagui';

import HeaderComponent from '../HeaderComponent';

import CompetitionCardAdapter from '../competitionCard';
import {FilterDialog, FootballPlayMore} from '../football';
import BasketballPlayMore from '../basketball/PlayMore';
import {useCompetition} from './useCompetition';

/**
 * 新竞彩玩法列表
 * @returns 新竞彩玩法列表
 */

const SportsCompetitionList: React.FC = () => {
  const {sections, isLoading, toggleSection, collapsedSections} =
    useCompetition();
  console.log(sections);

  const renderFooter = () => {
    if (sections.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>无更多数据</Text>
        </View>
      );
    }

    return null;
  };
  if (isLoading) {
    return (
      <YStack style={styles.loadingContainer}>
        <Spinner size="large" color="$red10" />
      </YStack>
    );
  }

  return (
    <View style={styles.container} className='mt-3'>
      <SectionList
        sections={sections}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        keyExtractor={(competition,index) => competition.competitionId.toString()+index} // 使用 competitionId 作为 key
        renderSectionHeader={({section: {title, totalMatches}}) => (
          <HeaderComponent
            title={title}
            totalMatches={totalMatches}
            toggleSection={toggleSection}
            collapsedSections={collapsedSections}
          />
        )}
        renderItem={({item: competition}) => (
          <CompetitionCardAdapter competition={competition} />
        )}
        contentContainerStyle={styles.matchList}
      />

      <BasketballPlayMore />
      <FootballPlayMore />
      <FilterDialog />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  matchList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
});

export default SportsCompetitionList;

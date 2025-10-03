import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

import {CustomModal} from '@/p138-react-common/components';
import {useOddsSelection} from './hooks/useOddsSelection';
import {useFootballPlayMore} from './hooks/useFootballPlayMore';
import {FOOTBALL_PLAY_MORE_STYLES} from './constants/styles';
import OddsRow from './components/OddsRow';
import OddsRowRenderer from './components/OddsRowRenderer';
import HeaderComponent from './components/HeaderComponent';
import ActionButtons from './components/ActionButtons';

const FootballPlayMore: React.FC = () => {
  const {
    competitionInfo,
    isVisible,
    isScoreDialogVisible,
    competitionId,
    lotteryName,
    currentConfig,
    selectedMatches,
    handleClose,
    handleConfirm,
    filteredHandicapDtos,
    renderConfig,
  } = useFootballPlayMore();

  const {selectedOdds, toggleOddsSelection, isOddsSelected, setSelection} =
    useOddsSelection();

  useEffect(() => {
    if (!competitionId) return;
    const existingMatches = selectedMatches[competitionId] || [];
    setSelection(existingMatches);
  }, [competitionId, selectedMatches, setSelection]);

  //  （比分弹窗）
  const renderContent = () => {
    if (!currentConfig || !filteredHandicapDtos.length) return null;

    return (
      <View>
        <Text style={styles.singleBetTip}>
          {currentConfig.singleBetTipText}
        </Text>
        <OddsRowRenderer
          handicapDto={filteredHandicapDtos[0]}
          competitionId={competitionId?.toString() || ''}
          lotteryName={lotteryName!}
          currentConfig={currentConfig}
          isOddsSelected={isOddsSelected}
          toggleOddsSelection={toggleOddsSelection}
        />
      </View>
    );
  };

  const renderOddsContainers = () => {
    if (!renderConfig || !competitionId) return null;

    return renderConfig.map(({index, handicapDto, renderType}) => (
      <View key={index} style={styles.oddsContainer}>
        {renderType === 'simple' ? (
          <OddsRow
            handicapDto={handicapDto}
            competitionId={competitionId.toString()}
            isSelected={isOddsSelected}
            onToggle={toggleOddsSelection}
            style={styles.oddsCell}
          />
        ) : (
          <OddsRowRenderer
            handicapDto={handicapDto}
            competitionId={competitionId.toString()}
            lotteryName={lotteryName!}
            currentConfig={currentConfig}
            isOddsSelected={isOddsSelected}
            toggleOddsSelection={toggleOddsSelection}
          />
        )}
      </View>
    ));
  };

  return (
    <CustomModal position="bottom" isVisible={isVisible} onClose={handleClose}>
      <View style={[styles.bottomSheetContent, styles.scrollViewContent]}>
        <ScrollView style={{flex: 1}}>
          {competitionInfo && (
            <HeaderComponent competitionInfo={competitionInfo} />
          )}
          {isScoreDialogVisible ? renderContent() : renderOddsContainers()}
        </ScrollView>
      </View>

      <ActionButtons
        onCancel={handleClose}
        onConfirm={() => handleConfirm(selectedOdds)}
      />
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  ...FOOTBALL_PLAY_MORE_STYLES,
  oddsContainer: {
    marginTop: 10,
  },
  oddsCell: {
    marginLeft: -0.5,
    marginTop: -0.5,
    flex: 1,
  },
  singleBetTip: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default FootballPlayMore;

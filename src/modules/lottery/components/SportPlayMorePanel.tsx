import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {CustomModal} from '@/p138-react-common/components';
import {useBetInfoStore, useLotteryEventStore} from 'src/modules/lottery/store';
import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {kScreenHeight} from '@/p138-react-common/utils/styles';

import OddsCell from '../sport/football/oddsCell';
import {
  betPlayColorBlue,
  betPlayColorBrown,
  betPlayColorGreen,
} from 'p138-react-common/utils/styles/color';
import CompetitionTeamInfo from './TeamInfo';

const SportPlayMorePanel: React.FC = () => {
  const {selectedMatches, setSelectedMatches} = useBetInfoStore();
  const {playMoreDialog, setPlayMoreDialog} = useLotteryEventStore();
  const {competitionInfo, dialogType, lotteryName, isVisible} = playMoreDialog;

  const [tempSelected, setTempSelected] = useState<string[]>([]);

  useEffect(() => {
    const keys = selectedMatches[competitionInfo?.competitionId!] || [];
    setTempSelected([...keys]);
  }, [competitionInfo]);

  const toggle = (key: string) => {
    setTempSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const handleConfirm = () => {
    setSelectedMatches({
      ...selectedMatches,
      [competitionInfo?.competitionId!]: [...tempSelected],
    });

    setPlayMoreDialog({...playMoreDialog, isVisible: false});
  };

  const renderOddsRowType = (handicapDto: LotteryDataSource.HandicapDto) => {
    const color: Record<string, string> = {
      全场比分: betPlayColorGreen,
      进球数: betPlayColorBlue,
      半全场: betPlayColorBrown,
    };

    const leftComponent = (handicapDto: LotteryDataSource.HandicapDto) => {
      console.log('handicapDto', handicapDto);
      if (lotteryName == 'FootballLottery') {
        const color: Record<string, string> = {
          
          全场比分: betPlayColorGreen,
          进球数: betPlayColorBlue,
          半全场: betPlayColorBrown,
        };

        return (
          <View
            style={[
              styles.leftComponentContainer,
              {
                backgroundColor: color[handicapDto?.playChineseName!],
              },
            ]}>
            {handicapDto?.playChineseName!.split('').map((char, index) => (
              <Text key={index} style={styles.verticalText}>
                {char}
              </Text>
            ))}
          </View>
        );
      } else if (lotteryName === 'BeijingSingleMatch') {
        return (
          <View style={styles.leftComponentContainer}>
            <Text
              style={[
                styles.verticalButton,
                {backgroundColor: betPlayColorBlue},
              ]}>
              胜
            </Text>
            <Text
              style={[
                styles.verticalButtonSmall,
                {backgroundColor: betPlayColorGreen},
              ]}>
              平
            </Text>
            <Text
              style={[
                styles.verticalButton,
                {backgroundColor: betPlayColorBrown},
              ]}>
              负
            </Text>
          </View>
        );
      }
    };

    return (
      <View style={styles.oddsRow}>
        
        {leftComponent(handicapDto)}
        <View style={styles.oddsCellsWrapper}>
          {handicapDto?.competitionOddsDtos?.map(oddsDto => {
            const key = generateOddsCellKey(
              competitionInfo?.competitionId!,
              handicapDto,
              oddsDto,
            );
            const isSelected = tempSelected.includes(key);
            const isAfterWinOther = oddsDto.betItem === '胜其他';
            return (
              <React.Fragment key={key}>
                <View style={styles.oddsCellWrapper}>
                  <OddsCell
                    toggleSelection={() => toggle(key)}
                    isSelected={isSelected}
                    isConfirmed={false}
                    textStyle={styles.oddsCellText}
                    handicapDtos={handicapDto}
                    competitionOddsDtos={oddsDto}
                    style={styles.oddsCell}
                  />
                </View>
                {isAfterWinOther && lotteryName === 'FootballLottery' && (
                  <>
                    <View style={styles.emptyCell} />
                    <View style={styles.emptyCell} />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  const filteredHandicaps =
    competitionInfo?.handicapDtos?.filter(h => {
      if (dialogType === 'score') {
        return (
          (h.playEnglishName?.includes('Q_CBF$PLAY') &&
            lotteryName === 'FootballLottery') ||
          (h.playEnglishName?.includes('S_XDS$PLAY') &&
            lotteryName === 'BeijingSingleMatch')
        );
      }
      return true;
    }) || [];

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={() => setPlayMoreDialog({...playMoreDialog, isVisible: false})}
      position="bottom">
      <ScrollView
        style={{
          maxHeight: kScreenHeight * 0.85,
          padding: 10,
          backgroundColor: '#fff',
        }}>
        {competitionInfo && (
          <>
            <View style={styles.headerContainer}>
              <View style={styles.deadlineBox}>
                <Text style={styles.deadlineText}>
                  {competitionInfo.matchNum}
                </Text>
              </View>
              <CompetitionTeamInfo competition={competitionInfo} />
            </View>
            {dialogType === 'score' && lotteryName === 'FootballLottery' && (
              <Text style={styles.singleBetTip}>红色选框可以投单关</Text>
            )}
            {filteredHandicaps.map(handicap => renderOddsRowType(handicap))}
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() =>
            setPlayMoreDialog({...playMoreDialog, isVisible: false})
          }>
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}>
          <Text style={styles.buttonText}>确定</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oddsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  oddsCellsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  oddsCellWrapper: {
    width: '20%',
  },
  oddsCellText: {
    fontSize: 15,
  },
  emptyCell: {
    width: '20%',
  },
  leftComponentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalText: {
    writingDirection: 'rtl',
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
    width: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    padding: 10,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#f53b57',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  deadlineBox: {
    backgroundColor: '#fff9f9',
    borderRadius: 5,
    paddingVertical: 5,
    width: 70,
  },
  deadlineText: {
    color: '#f53b57',
    fontSize: 14,
    textAlign: 'center',
  },
  singleBetTip: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
  verticalButton: {
    height: 80,
    lineHeight: 80,
    color: 'white',
    width: 35,
    textAlign: 'center',
  },
  verticalButtonSmall: {
    height: 40,
    lineHeight: 40,
    color: 'white',
    width: 35,
    textAlign: 'center',
  },
  oddsCell: {
    marginLeft: -0.5,
    marginTop: -0.5,
    flex: 1,
  },
});

export default SportPlayMorePanel;

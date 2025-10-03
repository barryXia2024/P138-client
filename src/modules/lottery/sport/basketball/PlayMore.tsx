import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {
  betPlayColorBlue,
  betPlayColorBrown,
  betPlayColorGreen,
  betPlayColorPurple,
  themeRedColor,
} from 'p138-react-common/utils/styles/color';
import {FONT_SIZES} from 'p138-react-common/utils/styles/theme';
import {CustomModal} from '@/p138-react-common/components';
import {useBetInfoStore} from 'src/modules/lottery/store';
import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {kScreenHeight} from '@/p138-react-common/utils/styles';
import {useLotteryEventStore} from 'src/modules/lottery/store/event';
import CompetitionTeamInfo from '../../components/TeamInfo';

/**
 * 竞彩篮球玩法过滤
 * @param filterBetItem 玩法过滤
 * @returns 竞彩篮球玩法过滤
 */
const filterBetItem = {
  F_HTZ$PLAY: {
    kWBetItem: '负',
    zWBetItem: '胜',
    backgroundColor: betPlayColorBlue,
    title: '胜负',
    leftLabel: '客胜',
    rightLabel: '主胜',
  },
  S_FR$PLAY: {
    kWBetItem: '让负',
    zWBetItem: '让胜',
    backgroundColor: betPlayColorGreen,
    title: '让分',
    leftLabel: '客胜',
    rightLabel: '主胜',
  },
  D_XF$PLAY: {
    kWBetItem: '大',
    zWBetItem: '小',
    backgroundColor: betPlayColorPurple,
    title: '大小分',
    leftLabel: '大于',
    rightLabel: '小于',
  },
  S_FC$PLAY: {
    kWBetItem: '客',
    zWBetItem: '主',
    backgroundColor: betPlayColorBrown,
    title: '胜负差',
    leftLabel: '客胜',
    rightLabel: '主胜',
  },
} as const;

/**
 * 竞彩篮球玩法更多弹窗
 * @param props 玩法更多属性
 * @returns 竞彩篮球玩法更多弹窗
 */
const BasketballPlayMore: React.FC = () => {
  const {basketballPlayMore, setBasketballPlayMore} = useLotteryEventStore();
  const {selectedMatches, setSelectedMatches} = useBetInfoStore();
  const [templateMatch, setTemplateMatch] = useState<string[]>([]);

  useEffect(() => {
    if (basketballPlayMore?.competitionInfo?.competitionId) {
      const tmarr = selectedMatches[
        basketballPlayMore?.competitionInfo?.competitionId
      ]
        ? [
            ...selectedMatches[
              basketballPlayMore?.competitionInfo?.competitionId
            ],
          ]
        : [];
      setTemplateMatch(tmarr);
    }
  }, [basketballPlayMore?.competitionInfo?.competitionId, selectedMatches]);

  const click = (oddsCellKey: string) => {
    setTemplateMatch(prevMatch => {
      const updatedSelectedMatch = prevMatch.includes(oddsCellKey)
        ? prevMatch.filter(key => key !== oddsCellKey)
        : [...prevMatch, oddsCellKey];
      return updatedSelectedMatch;
    });
  };

  const renderOdds = (
    odds: LotteryDataSource.CompetitionOddsDto[],
    handicapDto: LotteryDataSource.HandicapDto | undefined,
  ) => {
    return odds.map(e => {
      const competitionOddsDtosNew = {
        ...e,
        // betItem:e.betItem+`${e.betName}`
      };
      //胜负差需要组合
      if (handicapDto?.playEnglishName === 'S_FC$PLAY') {
        competitionOddsDtosNew.betItem = e.betItem + `${e.betName}`;
      }

      const oddsCellKey = generateOddsCellKey(
        basketballPlayMore?.competitionInfo?.competitionId!,
        handicapDto!,
        competitionOddsDtosNew,
      );
      const isSelected = templateMatch.includes(oddsCellKey);

      return (
        <TouchableOpacity
          key={e.betName + e.betItem}
          onPress={() => click(oddsCellKey)}
          style={[
            styles.oddsButton,
            isSelected && {backgroundColor: themeRedColor},
            handicapDto?.single === '1' && {borderColor: themeRedColor},
            odds.length > 1 ? styles.w50 : {width: '100%'},
          ]}>
          {handicapDto?.playEnglishName === 'S_FC$PLAY' && (
            <Text
              style={[
                {textAlign: 'center', fontSize: FONT_SIZES.small},
                isSelected && {color: '#fff'},
              ]}>
              {e.betName}
            </Text>
          )}
          <Text
            style={[
              {textAlign: 'center', fontSize: FONT_SIZES.small},
              isSelected && {color: '#fff'},
            ]}>
            {e.odds}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const renderOddsRow = (
    handicapDto: LotteryDataSource.HandicapDto | undefined,
  ) => {
    const kWin = handicapDto?.competitionOddsDtos?.filter(
      e => e.betItem === filterBetItem[handicapDto?.playEnglishName!].kWBetItem,
    );
    const zWin = handicapDto?.competitionOddsDtos?.filter(
      e => e.betItem === filterBetItem[handicapDto?.playEnglishName!].zWBetItem,
    );

    return (
      <View style={styles.oddsRowContainer}>
        <View style={styles.oddsRowHeader}>
          <Text style={styles.oddsRowTitle}>
            {handicapDto?.playChineseName}
          </Text>
        </View>
        <View style={styles.oddsRowContent}>
          <View style={styles.oddsColumn}>
            <View
              style={[
                styles.lineTop,
                {
                  backgroundColor:
                    filterBetItem[handicapDto?.playEnglishName!]
                      .backgroundColor,
                },
              ]}>
              <Text
                style={[
                  {textAlign: 'center', fontSize: FONT_SIZES.small},
                  {color: '#fff'},
                ]}>
                {`${filterBetItem[handicapDto?.playEnglishName!].leftLabel}${
                  handicapDto?.playChineseName === '大小分'
                    ? '(' + handicapDto.hanicap + ')'
                    : ''
                }`}
              </Text>
            </View>
            <View style={styles.oddsWrapper}>
              {kWin && renderOdds(kWin, handicapDto)}
            </View>
          </View>
          <View style={styles.oddsColumn}>
            <View
              style={[
                styles.lineTop,
                {
                  backgroundColor:
                    filterBetItem[handicapDto?.playEnglishName!]
                      .backgroundColor,
                },
              ]}>
              <Text
                style={[
                  {textAlign: 'center', fontSize: FONT_SIZES.small},
                  {color: '#fff'},
                ]}>
                {`${filterBetItem[handicapDto?.playEnglishName!].rightLabel}${
                  handicapDto?.playChineseName === '大小分'
                    ? '(' + handicapDto.hanicap + ')'
                    : ''
                }`}
              </Text>
            </View>
            <View style={styles.oddsWrapper}>
              {zWin && renderOdds(zWin, handicapDto)}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const cancel = () => {
    setBasketballPlayMore({
      isVisible: false,
      competitionInfo: null,
    });
  };

  const confirm = () => {
    setSelectedMatches({
      ...selectedMatches,
      [basketballPlayMore?.competitionInfo?.competitionId!]: [...templateMatch], // 添加新的 oddsCellKey
    });

    setBasketballPlayMore({
      isVisible: false,
      competitionInfo: null,
    });
  };

  return (
    <CustomModal
      position="bottom"
      isVisible={basketballPlayMore?.isVisible}
      onClose={cancel}>
      <View style={[styles.modalContent]}>
        <View style={styles.teamInfoContainer}>
          <CompetitionTeamInfo
            competition={basketballPlayMore?.competitionInfo}
          />
        </View>
        <View style={styles.oddsContainer}>
          {basketballPlayMore?.competitionInfo?.handicapDtos?.map(handicapDto =>
            renderOddsRow(handicapDto),
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.button, styles.cancelButton]}
          onPress={cancel}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.button, styles.confirmButton]}
          onPress={confirm}>
          <Text style={styles.buttonText}>确定</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  w50: {
    width: '50%',
  },
  lineTop: {
    backgroundColor: betPlayColorBlue,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    padding: 2,
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
  oddsContainer: {
    marginTop: 10,
  },
  oddsButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 2,
  },
  modalContent: {
    // flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    minHeight: kScreenHeight * 0.5,
  },
  teamInfoContainer: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#fff',
    flex: 1,
  },
  confirmButton: {
    backgroundColor: themeRedColor,
    flex: 1,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  oddsRowContainer: {
    marginTop: 12,
  },
  oddsRowHeader: {
    alignItems: 'center',
  },
  oddsRowTitle: {
    width: '100%',
  },
  oddsRowContent: {
    flexDirection: 'row',
    gap: 8,
  },
  oddsColumn: {
    flex: 1,
  },
  oddsWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export default BasketballPlayMore;

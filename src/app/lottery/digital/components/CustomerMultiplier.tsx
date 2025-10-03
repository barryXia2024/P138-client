import {CustomModal} from '@/p138-react-common/components';
import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const multiplierArr = ['10', '50', '100', '500'];
const keybordArr = ['1','2','3','4','5','6','7','8','9','删除','0','确定'];

const CustomerMultiplier: React.FC<{
  multiplier: number;
  setMultiplier: (multiplier: number) => void;
  maxMultiplierTitle?: string;
  toggleMultiplierModal: () => void;
  showMultiplierModal?: boolean;
  type?: 'digital' | 'sport';
}> = ({multiplier=1, setMultiplier, toggleMultiplierModal, showMultiplierModal, maxMultiplierTitle='倍', type='sport'}) => {
  const config = {
    digital: {
      multiplierArr: multiplierArr,
      keybordArr: keybordArr,
      maxMultiplier: '9999',
    },
    sport: {
      multiplierArr: multiplierArr,
      keybordArr: keybordArr,
      maxMultiplier: '999999',
    },
  }
  const [tempMultiplier, setTempMultiplier] = useState(multiplier.toString());
  const [isHasOne, setIsHasOne] = useState(false);

  const handleMultiplierChange = (m: string) => {
    if (m === '删除') {
      setTempMultiplier(prev => (prev.length > 1 ? prev.slice(0, -1) : '1'));
    } else if (m === '确定') {
      if (tempMultiplier && parseInt(tempMultiplier, 10)) {
        setMultiplier(parseInt(tempMultiplier, 10));
      }
      toggleMultiplierModal();
    } else {
      if (Number(tempMultiplier) >= Number(config[type].maxMultiplier)) {
        Toast.show('最多投'+config[type].maxMultiplier+maxMultiplierTitle);
        setTempMultiplier(config[type].maxMultiplier);
      } else {
        if(tempMultiplier=='1'&&!isHasOne){
          setIsHasOne(true);
          setTempMultiplier(m);
        }else{
          if(isHasOne){ setIsHasOne(false); }
          setTempMultiplier(prev => prev + m);
        }
      }
    }
  };

  const handleOpenModal = useCallback(() => {
    setTempMultiplier(multiplier.toString());
    toggleMultiplierModal();
  }, [multiplier, toggleMultiplierModal]);

  const handleCloseModal = useCallback(() => {
    toggleMultiplierModal();
  }, [toggleMultiplierModal]);

  return (
    <CustomModal position="bottom" isVisible={showMultiplierModal} onClose={handleCloseModal}>
      <View style={styles.container}>
        <Text style={styles.title}>快乐购彩 理性下注</Text>
        <View style={styles.displayContainer}>
          <Text style={styles.displayText}>
            投<Text style={styles.highlightText}>{tempMultiplier}</Text>{maxMultiplierTitle}
          </Text>
        </View>
        <View style={styles.quickMultiplierContainer}>
          {config[type].multiplierArr.map(item => (
            <TouchableOpacity key={item} onPress={() => setTempMultiplier(item)} style={styles.quickMultiplierButton}>
              <Text style={styles.quickMultiplierText}>{item}{maxMultiplierTitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keyboardContainer}>
          {config[type].keybordArr.map(item => (
            <TouchableOpacity key={item} onPress={() => handleMultiplierChange(item)} style={styles.keyboardButton}>
              <Text style={styles.keyboardText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#f0f0f0', width: '100%'},
  title: {padding: 40, fontSize: 20},
  displayContainer: {justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0'},
  displayText: {textAlign: 'center', fontSize: 20},
  highlightText: {color: '#f53b57'},
  quickMultiplierContainer: {flexDirection: 'row', gap: 20, padding: 20, justifyContent: 'space-between', marginTop: 20, width: '100%'},
  quickMultiplierButton: {flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center'},
  quickMultiplierText: {textAlign: 'center', fontSize: 16},
  keyboardContainer: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20, justifyContent: 'space-between', width: '100%'},
  keyboardButton: {width: '30%', height: 40, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center'},
  keyboardText: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
});

export default CustomerMultiplier;




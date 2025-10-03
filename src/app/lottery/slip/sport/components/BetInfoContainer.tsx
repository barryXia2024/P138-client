import React from 'react';
import {View, StyleSheet} from 'react-native';
import PassTypeSection from './PassTypeSection';
import MultiplierSection from './MultiplierSection';
import BetStatsSection from './BetStatsSection';
import ActionButtons from './ActionButtons';
import {useBetInfoStore} from 'src/modules/lottery/store';
import {useSlipStore} from '../../store/slipStore';

const BetInfoContainer: React.FC<{loading:boolean}> = (props) => {
  const {loading} = props;
  const {multiplier, setMultiplier} = useBetInfoStore();
  const {toggleMultiplierModal} = useSlipStore();
  return (
    <View style={styles.betInfoContainer}>
      <View style={styles.passTypeRow}>
        <View className="flex-1 ">
          <PassTypeSection />
          
        </View>
        <MultiplierSection
          multiplier={multiplier}
          setMultiplier={setMultiplier}
          toggleMultiplierModal={toggleMultiplierModal}
        />
      </View>

      <BetStatsSection />

      <ActionButtons loading={loading}/>
    </View>
  );
};

const styles = StyleSheet.create({
  betInfoContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 16,
  },
  passTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default BetInfoContainer;

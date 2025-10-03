import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';


const oddsTabs = [
  { label: '全部', key: 'all' },
  { label: '欧赔', key: 'europe' },
  { label: '亚赔', key: 'asia' },
  { label: '大小', key: 'bigSmall' },
];

const cellStyle = {
  borderWidth: 0.5,
  borderColor: '#eee',
  paddingVertical: 6,
  paddingHorizontal: 2,
  flex: 1,
  textAlign: 'center' as const,
  fontSize: 13,
};

// 渲染赔率行（支持欧赔、亚赔、大小）
const OddsRow: React.FC<{
  type: 'europe' | 'asia' | 'bigSmall';
  data: any[];
}> = ({ type, data }) => {
  const keys = type === 'europe'
    ? ['winOdds', 'drawOdds', 'lostOdds']
    : ['winOdds', 'handicap', 'lostOdds'];

  return (
    <View style={{ flex: 1 }}>
      {['初盘', '即时'].map((label, idx) => (
        <View key={idx} style={{ flexDirection: 'row', backgroundColor: '#f5f5f5' }}>
          <Text style={cellStyle}>{label}</Text>
          {keys.map(k => {
            const currentOdds = data?.[idx]?.[k] ?? '0';
            const lastOdds = data?.[idx - 1]?.[k] ?? '0';
            const change = currentOdds - lastOdds;
            const color = change > 0 ? '#e55' : change < 0 ? '#1b9c1c' : '#333';

            return <Text key={k} style={[cellStyle, idx === 1 && { color }]}>{data?.[idx]?.[k] ?? '0'}</Text>
          }

          )}
        </View>
      ))}
    </View>
  );
};

const OddsInfo: React.FC<CompetitionProps.OddsTabProps> = ({ europeOddsList, asiaOddsList, bigSmallOddsList }) => {
  const [active, setActive] = useState<'all' | 'europe' | 'asia' | 'bigSmall'>('europe');

  const companies = Array.from(new Set([
    ...europeOddsList.map(i => i.company),
    ...asiaOddsList.map(i => i.company),
    ...bigSmallOddsList.map(i => i.company),
  ]));

  const getOdds = (list: any[], company: string) => list.find(i => i.company === company) || {};
  const chunkedCompaniesList = (type: 'europe' | 'asia' | 'bigSmall') => {
    const chunkedCompanies = [];
    for (let i = 0; i < companies.length; i += 2) {
      chunkedCompanies.push(companies.slice(i, i + 2));
    }
    return chunkedCompanies.map((group, groupIndex) => {
      const oddsA = getOdds(
        type === 'europe' ? europeOddsList :
          type === 'asia' ? asiaOddsList : bigSmallOddsList,
        group[0]
      );
      const oddsB = getOdds(
        type === 'europe' ? europeOddsList :
          type === 'asia' ? asiaOddsList : bigSmallOddsList,
        group[1]
      );


      return <View key={`group_${groupIndex}`} style={{ flexDirection: 'row', marginBottom: 8 }}>
        {


          <View key={`${type}_${group[0]}`} style={{ flex: 1, flexDirection: 'row', marginRight: 8 }}>
            <View style={{
              width: 70,
              borderWidth: 0.5,
              borderColor: '#eee',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{group[0]}</Text>
            </View>
            <OddsRow type={type} data={[oddsA, oddsB]} />
          </View>

        }
        {/* 若不足两个补位占位 */}
        {group.length < 2 && <View style={{ flex: 1 }} />}
      </View>

    })
  }


  const renderByType = (type: 'europe' | 'asia' | 'bigSmall') => (
    <View>
      <Text style={{ fontSize: 16, color: '#333', marginVertical: 10, fontWeight: 'bold' }}>
        {type === 'europe' ? '欧赔指数' : type === 'asia' ? '亚赔指数' : '大小指数'}
      </Text>
      {chunkedCompaniesList(type)}
    </View>
  );

  return (
    <View style={{ height: '90%', backgroundColor: '#fff' }}>
      {/* Tab 切换 */}
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {oddsTabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActive(tab.key as any)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: active === tab.key ? '#e55' : '#f5f5f5',
              marginRight: 8,
            }}
          >
            <Text style={{
              color: active === tab.key ? '#fff' : '#888',
              fontWeight: 'bold',
            }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 内容渲染 */}
      <ScrollView>
        {active === 'all' && (
          <>
            {renderByType('europe')}
            {renderByType('asia')}
            {renderByType('bigSmall')}
          </>
        )}
        {active !== 'all' && renderByType(active)}
      </ScrollView>
    </View>
  );
};

export default OddsInfo;

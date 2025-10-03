

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';






const OddsInfo = (props: CompetitionProps.OddsInfoProps) => {
    const { rows } = props;



    return (
        <View className='border-1 border-gray-300'>
            {rows.map((row, rowIndex) => (
                <View
                    key={row.title + rowIndex}
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: rowIndex === rows.length - 1 ? 0 : 1,
                        borderBottomColor: '#ccc'
                    }}
                >
                    {/* 标题列 */}
                    <View style={Styles.line}>
                        <Text style={Styles.lineText}>
                            {row.title}
                        </Text>
                    </View>

                    {/* 数据列 */}
                    <View className='flex-1 flex-row'>
                        {row.cells.map((cell, cellIndex) => (
                            <View
                                key={cell + cellIndex + rowIndex + row.title + Math.random()}
                                style={[Styles.cell, { borderRightWidth: cellIndex === row.cells.length - 1 ? 0 : 1 }]}
                            >
                                <Text style={Styles.cellText}>
                                    {cell ?? '-'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};
export default OddsInfo;

const Styles = StyleSheet.create({
    line: {
        width: 70,
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: '#eee',
        backgroundColor: '#f0f0f0'
    },
    lineText: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center'
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        borderRightColor: '#eee',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        margin: -1, // 抵消边框重叠
        backgroundColor: '#f0f0f0'
    },
    cellText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center'
    }
});


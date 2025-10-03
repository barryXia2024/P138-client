import { kScreenHeight, kScreenWidth } from '@/p138-react-common/utils/styles';
import {CustomModal} from '@/p138-react-common/components';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface DataSourceItem {
    label: string;
    key: string;
    type: 'single' | 'multi';
    list: string[];
}

interface RedTicketFilterModalProps {
    onPress: (selected: any) => void;
    isVisible?: boolean;
    dataSouce: DataSourceItem[];
    filterKey: string;
    initialValue?: { [key: string]: any };
}

const RedTicketFilterModal: React.FC<RedTicketFilterModalProps> = ({
    onPress,
    isVisible,
    dataSouce,
    filterKey,
    initialValue = {}
}) => {
    // 以对象形式存储所有key的选中项
    const [selectedList, setSelectedList] = useState<{ [key: string]: any }>({ ...initialValue });

    useEffect(() => {
        setSelectedList({ ...initialValue });
    }, [initialValue, isVisible, filterKey]);

    const handleConfirm = () => {
        onPress(selectedList);
    };

    const handlePassTypePress = (groupKey: string, value: string, type: 'single' | 'multi') => {
        if (type === 'multi') {
            const arr = selectedList[groupKey] || [];
            if (arr.includes(value)) {
                setSelectedList({
                    ...selectedList,
                    [groupKey]: arr.filter((v: string) => v !== value)
                });
            } else {
                setSelectedList({
                    ...selectedList,
                    [groupKey]: [...arr, value]
                });
            }
        } else {
            setSelectedList({
                ...selectedList,
                [groupKey]: value
            });
        }
    };

    const handleCancel = () => {
        onPress(initialValue); // 取消时回显原值
    };

    return (
        <View style={styles.container}>
            <CustomModal
                position="bottom"
                isVisible={!!isVisible}
                height={kScreenHeight * 0.6}
                onClose={handleCancel}>
                <ScrollView className="bg-white rounded-t-[8px] flex-1" style={{ maxHeight: kScreenHeight * 0.8 }}>
                    {dataSouce.map(group => {
                        const currentSelected = selectedList[group.key] || (group.type === 'multi' ? [] : '');
                        return (
                            <View className="p-4" key={group.key}>
                                <Text className="text-[18px] text-333">{group.label}</Text>
                                <View className="flex-wrap gap-2 mt-4 w-full flex-row">
                                    {group.list.map(item => (
                                        <TouchableOpacity
                                            key={item}
                                            style={[
                                                styles.passTypeButton,
                                                (group.type === 'multi'
                                                    ? currentSelected.includes(item)
                                                    : currentSelected === item) && styles.selectedPassTypeButton
                                            ]}
                                            onPress={() => handlePassTypePress(group.key, item, group.type)}>
                                            <Text className="text-center text-xs" style={{ color: (group.type === 'multi'
                                                ? currentSelected.includes(item)
                                                : currentSelected === item) ? '#f53b57' : '#333' }}>{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                <View className="flex-row w-full border-t border-gray-200">
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.button, { backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#ccc' }]}
                        onPress={handleCancel}>
                        <Text className="text-333 text-base">取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.button, { backgroundColor: '#fff' }]}
                        onPress={handleConfirm}>
                        <Text className="text-[#f53b57] text-base">确定</Text>
                    </TouchableOpacity>
                </View>
            </CustomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    passTypeButton: {
        width: 60,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedPassTypeButton: {
        borderColor: 'red',
        color: 'red',
    },
    button: {
        padding: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default RedTicketFilterModal;

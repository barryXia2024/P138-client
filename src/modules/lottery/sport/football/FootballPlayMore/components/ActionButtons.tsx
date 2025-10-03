import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface ActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}>
        <Text style={styles.cancelButtonText}>取消</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.button, styles.confirmButton]}
        onPress={onConfirm}>
        <Text style={styles.buttonText}>确定</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ActionButtons; 
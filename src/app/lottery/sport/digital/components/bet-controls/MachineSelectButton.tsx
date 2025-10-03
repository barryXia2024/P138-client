import React from 'react';
import Button from '@/p138-react-common/components/Button';

interface MachineSelectButtonProps {
  count: number;
  onPress: () => void;
  className?: string;
}

export const MachineSelectButton: React.FC<MachineSelectButtonProps> = ({
  count,
  onPress,
  className = '',
}) => {
  const title = count === 1 ? '机选' : `机选${count}注`;
  
  return (
    <Button
      title={title}
      type="primary"
      onPress={onPress}
      className={`bg-red-500 border-red-500 ${className}`}
      size="small"
    />
  );
};

export default MachineSelectButton;

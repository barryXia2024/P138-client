declare module 'react-native-table-component' {
    import { ComponentType } from 'react';
    import { ViewStyle, TextStyle } from 'react-native';
  
    export interface TableProps {
      borderStyle?: { borderWidth: number; borderColor: string };
      style?: ViewStyle;
      children?: React.ReactNode;
    }
  
    export const Table: ComponentType<TableProps>;
  
    export interface RowProps {
      data: any[];
      style?: ViewStyle;
      textStyle?: TextStyle;
    }
  
    export const Row: ComponentType<RowProps>;
  
    export interface RowsProps {
      data: any[][];
      style?: ViewStyle;
      textStyle?: TextStyle;
    }
  
    export const Rows: ComponentType<RowsProps>;
  }
  
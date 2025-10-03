import { StyleProp, ViewStyle } from "react-native";

export const defaultTabSwitchStyle: StyleProp<ViewStyle> = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f3f0f0',
    padding: 0,
    borderRadius: 20,
    height: 40,
    marginHorizontal: 60
  };
  
  export const defaultTabStyle: StyleProp<ViewStyle> = {
    flex: 1,
    height: 40,
    backgroundColor: '#f3f0f0',
    borderRadius: 20,
    // marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center'
  };
  
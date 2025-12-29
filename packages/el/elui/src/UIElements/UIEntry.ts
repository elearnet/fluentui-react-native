import { IconProps } from "@elui-react-native/icon";

export interface UIEntry {
  id:string;
  type:string; // toolbar button | shortcut command | menu item | context menu item | 
  title:string;
  icon?: IconProps;
}
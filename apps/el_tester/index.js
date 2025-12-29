/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import NewWindow from './src/NewWindow'
import {newWindowModuleName} from 'elui';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(newWindowModuleName, () => NewWindow);

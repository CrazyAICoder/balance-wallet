import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import createSwipeNavigator from '../navigation/navigators/createSwipeNavigator';
import { buildTransitions, expanded, sheet } from '../navigation/transitions';
import ActivityScreen from './ActivityScreen';
import ExpandedAssetScreen from './ExpandedAssetScreen';
import IntroScreen from './IntroScreen';
import LoadingScreen from './LoadingScreen';
import QRScannerScreenWithData from './QRScannerScreenWithData';
import SendQRScannerScreenWithData from './SendQRScannerScreenWithData';
import SendScreenWithData from './SendScreenWithData';
import SettingsScreenWithData from './SettingsScreenWithData';
import TransactionConfirmationScreenWithData from './TransactionConfirmationScreenWithData';
import WalletScreen from './WalletScreen';
import { deviceUtils } from '../utils';

import Navigation from '../navigation';

const SwipeStack = createSwipeNavigator({
  SettingsScreen: {
    name: 'SettingsScreen',
    screen: SettingsScreenWithData,
    statusBarColor: 'dark-content',
  },
  WalletScreen: {
    name: 'WalletScreen',
    screen: WalletScreen,
    statusBarColor: 'dark-content',
  },
  QRScannerScreen: {
    name: 'QRScannerScreen',
    screen: QRScannerScreenWithData,
    statusBarColor: 'light-content',
  },
}, {
  headerMode: 'none',
  initialRouteName: 'WalletScreen',
  onSwipeStart: () => Navigation.pauseNavigationActions(),
  onSwipeEnd: (navigation) => Navigation.resumeNavigationActions(navigation),
});

const AppStack = createStackNavigator({
  ActivityScreen: {
    navigationOptions: {
      effect: 'sheet',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height / 2,
      },
    },
    screen: ActivityScreen,
  },
  ConfirmTransaction: TransactionConfirmationScreenWithData,
  ExpandedAssetScreen: {
    navigationOptions: {
      effect: 'expanded',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height,
      },
    },
    screen: ExpandedAssetScreen,
  },
  SendScreen: {
    navigationOptions: {
      effect: 'sheet',
      gestureResponseDistance: {
        vertical: 150,
      },
    },
    screen: SendScreenWithData,
  },
  SendQRScannerScreen: SendQRScannerScreenWithData,
  SwipeLayout: SwipeStack,
}, {
  headerMode: 'none',
  initialRouteName: 'SwipeLayout',
  mode: 'modal',
  transitionConfig: buildTransitions(Navigation, { expanded, sheet }),
  cardStyle: {
    backgroundColor: 'transparent',
  },
});

const IntroStack = createStackNavigator({
  IntroScreen,
}, {
  headerMode: 'none',
  mode: 'card', // Horizontal gestures
});

export default createSwitchNavigator(
  {
    App: AppStack,
    Intro: IntroStack,
    Loading: LoadingScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
    mode: 'modal',
  },
);


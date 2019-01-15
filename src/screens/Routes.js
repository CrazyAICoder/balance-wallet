import { createStackNavigator } from 'react-navigation';
import createSwipeNavigator from '../navigation/navigators/createSwipeNavigator';
import { buildTransitions, expanded, sheet } from '../navigation/transitions';
import ExpandedAssetScreen from './ExpandedAssetScreen';
import ImportSeedPhraseSheet from './ImportSeedPhraseSheet';
import ProfileScreenWithData from './ProfileScreenWithData';
import QRScannerScreenWithData from './QRScannerScreenWithData';
import ReceiveModal from './ReceiveModal';
import SendQRScannerScreenWithData from './SendQRScannerScreenWithData';
import SendSheetWithData from './SendSheetWithData';
import SettingsModal from './SettingsModal';
import TransactionConfirmationScreenWithData from './TransactionConfirmationScreenWithData';
import WalletScreen from './WalletScreen';
import { deviceUtils } from '../utils';
import store from '../redux/store';
import { updateTransitionProps } from '../redux/navigation';

import Navigation from '../navigation';

const onSwipeEndSwipeStack = navigation => Navigation.resumeNavigationActions(navigation);
const onSwipeStartSwipeStack = () => Navigation.pauseNavigationActions();

const SwipeStack = createSwipeNavigator({
  ProfileScreen: {
    name: 'ProfileScreen',
    screen: ProfileScreenWithData,
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
  mode: 'modal',
  initialRouteName: 'WalletScreen',
  onSwipeEnd: onSwipeEndSwipeStack,
  onSwipeStart: onSwipeStartSwipeStack,
});

export default createStackNavigator({
  ConfirmRequest: TransactionConfirmationScreenWithData,
  ImportSeedPhraseSheet: {
    screen: ImportSeedPhraseSheet,
    navigationOptions: {
      effect: 'sheet',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height / 2,
      },
    },
  },
  ExpandedAssetScreen: {
    navigationOptions: {
      effect: 'expanded',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height,
      },
    },
    screen: ExpandedAssetScreen,
  },
  ReceiveModal: {
    navigationOptions: {
      effect: 'expanded',
      gestureResponseDistance: {
        vertical: deviceUtils.dimensions.height,
      },
    },
    screen: ReceiveModal,
  },
  SendSheet: SendSheetWithData,
  SendQRScannerScreen: SendQRScannerScreenWithData,
  SwipeLayout: SwipeStack,
  SettingsModal: {
    navigationOptions: {
      effect: 'expanded',
      gesturesEnabled: false,
    },
    screen: SettingsModal,
  },
}, {
  headerMode: 'none',
  initialRouteName: 'SwipeLayout',
  mode: 'modal',
  transitionConfig: buildTransitions(Navigation, { expanded, sheet }),
  cardStyle: {
    backgroundColor: 'transparent',
  },
  onTransitionStart() {
    store.dispatch(updateTransitionProps({ isTransitioning: true }));
  },
  onTransitionEnd() {
    store.dispatch(updateTransitionProps({ isTransitioning: false }));
  },
});

import { account, commonStorage, accountUpdateAccountAddress } from 'balance-common';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppRegistry, AppState, AsyncStorage, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
import { connect, Provider } from 'react-redux';
import { compose, withProps } from 'recompact';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { walletConnectGetTransaction } from './model/walletconnect';
import { walletInit } from './model/wallet';
import transactionsToApprove, { addTransactionToApprove } from './reducers/transactionsToApprove';
import Routes from './screens/Routes';

const store = createStore(
  combineReducers({ account, transactionsToApprove }),
  applyMiddleware(thunk),
);

class App extends Component {
  static propTypes = {
    accountUpdateAccountAddress: PropTypes.func,
    addTransactionToApprove: PropTypes.func,
  }

  navigatorRef = null

  componentDidMount() {
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('received fcmToken', fcmToken);
          commonStorage.saveLocal('balanceWalletFcmToken', { data: fcmToken });
        } else {
          console.log('no fcm token yet');
        }
      });

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
      console.log('received refreshed fcm token', fcmToken);
      commonStorage.saveLocal('balanceWalletFcmToken', { data: fcmToken });
    });
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification => {
      console.log('on notification displayed', notification);
      const { transactionId } = notification.data;
      this.onPushNotification(transactionId);
    });
    this.notificationListener = firebase.notifications().onNotification(notification => {
      console.log('on notification', notification);
      const { transactionId } = notification.data;
      this.onPushNotification(transactionId);

    });

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
      console.log('on notification opened');
      const notification = notificationOpen.notification;
      const { transactionId } = notification.data;
      this.onPushNotification(transactionId);
    });

    walletInit()
      .then(walletAddress => {
        console.log('wallet address is', walletAddress);
        this.props.accountUpdateAccountAddress(walletAddress, 'BALANCEWALLET');
        firebase.notifications().getInitialNotification()
        .then(notificationOpen => {
          console.log('on notification initial');
          if (notificationOpen) {
            const notification = notificationOpen.notification;
            const { transactionId } = notification.data;
            this.onPushNotification(transactionId);
          }
        });
      })
      .catch(error => {
        // TODO error handling
      });

    setTimeout(() => {
      this.handleOpenConfirmTransactionModal()
    }, 7500);
    // setTimeout(() => {
    //   this.handleOpenConfirmTransactionModal()
    // }, 12500);
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListender();
    this.onTokenRefreshListener();
  }

  handleNavigatorRef = (navigatorRef) => { this.navigatorRef = navigatorRef; }

  handleOpenConfirmTransactionModal = () => {
    if (!this.navigatorRef) return;

    const action = NavigationActions.navigate({
      routeName: 'ConfirmTransaction',
      params: {},
    });

    this.navigatorRef.dispatch(action);
  }

  onPushNotification = async (transactionId) => {
    const transactionPayload = await walletConnectGetTransaction(transactionId);
    this.props.addTransactionToApprove(transactionId, transactionPayload);
    this.handleOpenConfirmTransactionModal();
  }

  render = () => (
    <Provider store={store}>
      <Routes ref={this.handleNavigatorRef} />
    </Provider>
  )
}

const AppWithRedux = compose(
  withProps({ store }),
  connect(
    null,
    {
      addTransactionToApprove,
      accountUpdateAccountAddress,
    },
  ),
)(App);

AppRegistry.registerComponent('BalanceWallet', () => AppWithRedux);

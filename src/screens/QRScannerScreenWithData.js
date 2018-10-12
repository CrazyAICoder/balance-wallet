import lang from 'i18n-js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose } from 'recompact';
import { AlertIOS } from 'react-native';
import { withAccountAddress, withWalletConnectors } from '../hoc';
import { walletConnectInit } from '../model/walletconnect';
import QRScannerScreen from './QRScannerScreen';

class QRScannerScreenWithData extends PureComponent {
  static propTypes = {
    accountAddress: PropTypes.string,
    addWalletConnector: PropTypes.func,
    isScreenActive: PropTypes.bool,
    navigation: PropTypes.object,
  }

  handlePressBackButton = () => this.props.navigation.push('WalletScreen')

  handleSuccess = async (event) => {
    const { accountAddress, addWalletConnector, navigation } = this.props;
    const data = event.data;

    if (data) {
      try {
        const walletConnector = await walletConnectInit(accountAddress, data);
        addWalletConnector(walletConnector);
        navigation.navigate('WalletScreen');
      } catch (error) {
        AlertIOS.alert(lang.t('wallet.wallet_connect.error'), error);
        console.log('error initializing wallet connect', error);
      }
    }
  }

  render = () => (
    <QRScannerScreen
      {...this.props}
      onPressBackButton={this.handlePressBackButton}
      onSuccess={this.handleSuccess}
    />
  )
}

export default compose(
  withAccountAddress,
  withWalletConnectors,
)(QRScannerScreenWithData);
